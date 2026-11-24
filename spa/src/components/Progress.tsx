import type { CSSProperties } from 'react'
import { useLandingData } from '../hooks/useLandingData'
import type { RoadmapStatus } from '../data/landing'
import { CheckIcon, SparkIcon } from './Icons'

const STATUS_LABEL: Record<RoadmapStatus, string> = {
  done: 'Listo',
  active: 'En curso',
  next: 'Próximo',
}

export function Progress() {
  const { stats, roadmap, live } = useLandingData()
  const overall = Math.round(
    roadmap.reduce((total, item) => total + item.progress, 0) / Math.max(1, roadmap.length),
  )

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
        <span className={`live-badge ${live ? 'live-badge--on' : ''}`}>
          <i /> {live ? `En vivo${updatedLabel ? ` · ${updatedLabel}` : ''}` : 'Sin métricas publicadas'}
        </span>
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
          <div className="metric-card">
            <strong>{stats.congregations.toLocaleString('es')}</strong>
            <span>Congregaciones</span>
          </div>
          <div className="metric-card">
            <strong>{stats.members.toLocaleString('es')}</strong>
            <span>Miembros</span>
          </div>
          <div className="metric-card">
            <strong>{stats.events.toLocaleString('es')}</strong>
            <span>Eventos</span>
          </div>
          <div className="metric-card">
            <strong>{stats.announcements.toLocaleString('es')}</strong>
            <span>Avisos</span>
          </div>
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
          ? 'Cifras leídas desde el endpoint público.'
          : 'Todavía no publicamos cifras: no hay números estimados. La hoja de ruta refleja el estado real de la app.'}
      </p>
    </section>
  )
}
