/**
 * Datos de la landing.
 *
 * No hay métricas de ejemplo: mientras no exista el endpoint, la sección de
 * cifras simplemente no se muestra. Cuando esté listo, alcanza con definir
 * VITE_LANDING_STATS_URL (o VITE_API_URL) en .env.
 */

export type RoadmapStatus = 'done' | 'active' | 'next'

export interface RoadmapItem {
  id: string
  title: string
  detail: string
  status: RoadmapStatus
  progress: number
}

export interface LandingStats {
  congregations: number
  members: number
  events: number
  announcements: number
  updatedAt?: string
}

export interface LandingData {
  stats: LandingStats | null
  roadmap: RoadmapItem[]
  live: boolean
}

export const ROADMAP: RoadmapItem[] = [
  {
    id: 'accesos',
    title: 'Accesos y congregaciones',
    detail:
      'Ingreso con Google y acceso compartido por el pastor o encargado, con pertenencia a una sola congregación.',
    status: 'done',
    progress: 100,
  },
  {
    id: 'miembros',
    title: 'Miembros y grupos',
    detail:
      'Fichas de las personas y organización de ministerios y grupos dentro de la congregación.',
    status: 'done',
    progress: 100,
  },
  {
    id: 'agenda',
    title: 'Eventos y calendario',
    detail: 'La agenda de la congregación con fechas y lugares en un mismo lugar.',
    status: 'active',
    progress: 70,
  },
  {
    id: 'avisos',
    title: 'Avisos',
    detail: 'Comunicaciones destacadas que dejan de perderse entre mensajes.',
    status: 'active',
    progress: 58,
  },
  {
    id: 'ministerios',
    title: 'Ministerios y roles',
    detail:
      'Asignar responsables a cada ministerio o grupo y definir permisos dentro de la congregación.',
    status: 'next',
    progress: 32,
  },
  {
    id: 'pulido',
    title: 'Experiencia móvil y pulido',
    detail: 'Navegación, estados y detalles finales de la interfaz en el celular.',
    status: 'next',
    progress: 12,
  },
  {
    id: 'datos',
    title: 'Métricas en vivo',
    detail: 'Conectar la landing a la base de datos para mostrar cifras reales.',
    status: 'next',
    progress: 6,
  },
]

function statsEndpoint(): string {
  const explicit = import.meta.env.VITE_LANDING_STATS_URL?.trim()
  if (explicit) return explicit

  const api = import.meta.env.VITE_API_URL?.trim()
  return api ? `${api.replace(/\/$/, '')}/public/stats` : ''
}

function asNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.round(value)
    : null
}

function normalizeStats(value: unknown): LandingStats | null {
  const raw = (value && typeof value === 'object' ? value : {}) as Record<string, unknown>
  const stats = (raw.stats && typeof raw.stats === 'object' ? raw.stats : raw) as Record<
    string,
    unknown
  >

  const congregations = asNumber(stats.congregations)
  const members = asNumber(stats.members)
  const events = asNumber(stats.events)
  const announcements = asNumber(stats.announcements)

  if (
    congregations === null ||
    members === null ||
    events === null ||
    announcements === null
  ) {
    return null
  }

  return {
    congregations,
    members,
    events,
    announcements,
    updatedAt: typeof stats.updatedAt === 'string' ? stats.updatedAt : undefined,
  }
}

function normalizeRoadmap(value: unknown): RoadmapItem[] {
  if (!Array.isArray(value)) return ROADMAP

  const incoming = new Map<string, Partial<RoadmapItem>>()
  for (const entry of value) {
    if (!entry || typeof entry !== 'object') continue
    const item = entry as Record<string, unknown>
    if (typeof item.id !== 'string') continue
    incoming.set(item.id, {
      status:
        item.status === 'done' || item.status === 'active' || item.status === 'next'
          ? item.status
          : undefined,
      progress:
        typeof item.progress === 'number'
          ? Math.min(100, Math.max(0, item.progress))
          : undefined,
    })
  }

  return ROADMAP.map((item) => {
    const update = incoming.get(item.id)
    return {
      ...item,
      status: update?.status ?? item.status,
      progress: update?.progress ?? item.progress,
    }
  })
}

export async function loadLandingData(signal?: AbortSignal): Promise<LandingData> {
  const endpoint = statsEndpoint()
  if (!endpoint) return { stats: null, roadmap: ROADMAP, live: false }

  try {
    const response = await fetch(endpoint, { signal, headers: { Accept: 'application/json' } })
    if (!response.ok) throw new Error(`Stats API respondió ${response.status}`)

    const payload: unknown = await response.json()
    const raw = (payload && typeof payload === 'object' ? payload : {}) as Record<string, unknown>

    return {
      stats: normalizeStats(payload),
      roadmap: normalizeRoadmap(raw.roadmap),
      live: true,
    }
  } catch (error) {
    if (signal?.aborted) throw error
    return { stats: null, roadmap: ROADMAP, live: false }
  }
}
