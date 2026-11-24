import type { CSSProperties } from 'react'
import {
  CalendarIcon,
  GridIcon,
  MegaphoneIcon,
  QrIcon,
  SparkIcon,
  UsersIcon,
} from './Icons'

const FEATURES = [
  {
    icon: UsersIcon,
    title: 'Miembros y grupos',
    text: 'Las personas de la congregación, sus ministerios y grupos, en un mismo lugar.',
    tag: 'Personas',
    size: 'wide',
  },
  {
    icon: CalendarIcon,
    title: 'Eventos y calendario',
    text: 'Todo lo que viene, con fecha y lugar, en un mismo lugar.',
    tag: 'Agenda',
    size: 'normal',
  },
  {
    icon: MegaphoneIcon,
    title: 'Avisos destacados',
    text: 'Lo importante se fija y deja de perderse entre mensajes.',
    tag: 'Comunicación',
    size: 'normal',
  },
  {
    icon: QrIcon,
    title: 'Accesos',
    text: 'El pastor o encargado comparte el acceso; la persona entra y queda vinculada a su congregación.',
    tag: 'Ingreso',
    size: 'normal',
  },
  {
    icon: GridIcon,
    title: 'Ministerios y roles',
    text: 'Cada grupo con sus responsables, para que todos sepan qué les toca hacer.',
    tag: 'Organización',
    size: 'wide',
  },
  {
    icon: SparkIcon,
    title: 'Sin costo',
    text: 'Redil no tiene costo para su uso: se sostiene con donaciones opcionales. Está al alcance de toda la congregación.',
    tag: 'Gratis',
    size: 'normal',
  },
]

export function Features() {
  return (
    <section className="section section--features" id="funciones">
      <div className="section-head" data-reveal>
        <span className="eyebrow">04 · Funciones</span>
        <h2>Lo esencial, sin vueltas.</h2>
        <p>
          Cada pantalla existe por una razón: sacar una tarea del chat y ponerla en un punto de
          conexión que todo el equipo pueda encontrar.
        </p>
      </div>

      <div className="feature-grid">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon
          return (
            <article
              className={`feature-card feature-card--${feature.size}`}
              key={feature.title}
              data-reveal
              style={{ '--delay': `${(index % 3) * 100}ms` } as CSSProperties}
            >
              <span className="feature-icon"><Icon size={22} /></span>
              <span className="feature-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="feature-arrow" aria-hidden="true">↗</span>
            </article>
          )
        })}
      </div>
    </section>
  )
}
