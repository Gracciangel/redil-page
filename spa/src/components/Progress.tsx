import type { ComponentType, CSSProperties } from 'react'
import { useLandingData } from '../hooks/useLandingData'
import { useCountUp } from '../hooks/useCountUp'
import { useInView } from '../hooks/useInView'
import type { RoadmapStatus } from '../data/landing'
import {
  CalendarIcon,
  CheckIcon,
  ChurchIcon,
  MegaphoneIcon,
  SparkIcon,
  UsersIcon,
} from './Icons'

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Listo',
  active: 'En curso',
  next: 'Próximo',
}

type MetricIcon = ComponentType<{ size?: number }>

function MetricCard({
  value,
  label,
  Icon,
  delay,
}: {
  value: number
  label: string
  Icon: MetricIcon
  delay: number
}) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const count = useCountUp(value, inView)

  return (
    <div
      ref={ref}
      className={`metric-card ${inView ? 'metric-card--in' : ''}`}
      style={{ '--delay': `${delay}ms` } as CSSProperties}
    >
      <span className="metric-card__icon" aria-hidden="true">
        <Icon size={22} />
      </span>
      <strong>{count.toLocaleString('es')}</strong>
      <span className="metric-card__label">{label}</span>
    </div>
  )
}

export function Progress() {
  const { stats, roadmap, live } = useLandingData()
  const localOverall = Math.round(
    roadmap.reduce((total, item) => total + item.progress, 0) / Math.max(1, roadmap.length),
  )
  // El porcentaje publicado en Supabase manda; si no hay dato se usa la hoja de ruta.
  const overall =
    stats?.progress !== undefined ? Math.min(100, Math.max(0, stats.progress)) : localOverall

  const updated = stats?.updatedAt ? new Date(stats.updatedAt) : null
  const updatedLabel =
    updated && !Number.isNaN(updated.getTime())
      ? new Intl.DateTimeFormat('es', {
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        }).format(updated)
      : null

  return (
    <section className="section section--progress" id="progreso">
      <div className="section-head section-head--split" data-reveal>
        <div>
          <span className="eyebrow">05 · Progreso</span>
          <h2>Estamos construyendo el punto de conexión.</h2>
          <p>
            Redil ya permite gestionar accesos, miembros y grupos. Todavía faltan módulos
            importantes —ministerios y roles, calendario completo y métricas reales— y por eso el
            avance es parcial.
          </p>
        </div>
        <div className="progress-meta">
          {stats?.version && <span className="version-chip">Versión {stats.version}</span>}
          <span className={`live-badge ${live ? 'live-badge--on' : ''}`}>
            <i />{' '}
            {live
              ? `En vivo${updatedLabel ? ` · ${updatedLabel}` : ''}`
              : 'Sin métricas publicadas'}
          </span>
        </div>
      </div>

      <div className="progress-summary" data-reveal>
        <div className="progress-ring" style={{ '--progress': `${overall}%` } as CSSProperties}>
          <div>
            <strong>{overall}%</strong>
            <span>avance general</span>
          </div>
        </div>
        <div className="progress-summary__copy">
          <span className="eyebrow">Estado actual</span>
          <h3>De la idea a una app instalable.</h3>
          <p>
            Cada etapa se marca cuando funciona de punta a punta, no cuando apenas está dibujada.
            Lo esencial ya está andando; el resto se construye con la congregación, no para ella.
          </p>
          <div className="progress-track" aria-label={`Avance general ${overall} %`}>
            <span style={{ width: `${overall}%` }} />
          </div>
        </div>
      </div>

      {live && stats && (
        <div className="stats-grid">
          {[
            { value: stats.congregations, label: 'Congregaciones', Icon: ChurchIcon },
            { value: stats.members, label: 'Miembros', Icon: UsersIcon },
            { value: stats.events, label: 'Eventos', Icon: CalendarIcon },
            { value: stats.announcements, label: 'Avisos', Icon: MegaphoneIcon },
          ]
            .filter((metric) => typeof metric.value === 'number')
            .map((metric, index) => (
              <MetricCard
                key={metric.label}
                value={metric.value ?? 0}
                label={metric.label}
                Icon={metric.Icon}
                delay={index * 110}
              />
            ))}
        </div>
      )}

      <ol className="roadmap">
        {roadmap.map((item, index) => (
          <li
            key={item.id}
            className={`roadmap-item roadmap-item--${item.status}`}
            data-reveal
            style={{ '--delay': `${index * 70}ms` } as CSSProperties}
          >
            <span className="roadmap-marker" aria-hidden="true">
              {item.status === 'done' ? (
                <CheckIcon size={15} />
              ) : item.status === 'active' ? (
                <SparkIcon size={15} />
              ) : (
                index + 1
              )}
            </span>
            <div className="roadmap-body">
              <div className="roadmap-title">
                <h3>{item.title}</h3>
                <span className={`status-chip status-chip--${item.status}`}>
                  {STATUS_LABEL[item.status]}
                </span>
              </div>
              <p>{item.detail}</p>
              <div className="roadmap-track">
                <span style={{ width: `${item.progress}%` }} />
              </div>
            </div>
            <span className="roadmap-percent">{item.progress}%</span>
          </li>
        ))}
      </ol>

      <p className="data-note" data-reveal>
        {live && stats
          ? 'Cifras y versión leídas desde la fuente pública de Redil.'
          : 'Todavía no publicamos cifras: no hay números estimados. La hoja de ruta refleja el estado real de la app.'}
      </p>
    </section>
  )
}
