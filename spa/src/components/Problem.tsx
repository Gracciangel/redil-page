import type { CSSProperties } from 'react'
import { GridIcon, MegaphoneIcon, QrIcon, UsersIcon } from './Icons'

const PAINS = [
  {
    icon: UsersIcon,
    title: 'Los datos viven dispersos',
    text: 'Un formulario para inscribirse, una planilla para los miembros y un mensaje perdido con el teléfono correcto.',
  },
  {
    icon: GridIcon,
    title: 'Los ministerios se pierden de vista',
    text: 'Cada grupo organiza su propia lista de integrantes y responsables. Sin una gestión central, nadie sabe quién hace qué ni qué ministerio necesita ayuda.',
  },
  {
    icon: MegaphoneIcon,
    title: 'Los avisos se ahogan',
    text: 'Lo importante pasa entre cientos de mensajes del grupo y nadie vuelve a encontrarlo cuando lo necesita.',
  },
  {
    icon: QrIcon,
    title: 'Entrar es un obstáculo',
    text: 'Cada persona tiene que preguntar por el acceso o por quién tiene la información actualizada.',
  },
]

export function Problem() {
  return (
    <section className="section section--problem" id="problema">
      <div className="section-head" data-reveal>
        <span className="eyebrow">01 · El problema</span>
        <h2>La información existe. Lo que falta es un lugar común.</h2>
        <p>
          En una congregación todo el mundo se mueve: llegan personas nuevas, cambian los horarios,
          se organizan eventos y cada ministerio tiene su propia dinámica. Cuando cada novedad
          depende de un chat distinto, la memoria del equipo se pierde entre mensajes.
        </p>
      </div>

      <div className="problem-grid">
        {PAINS.map((pain, index) => {
          const Icon = pain.icon
          return (
            <article
              className="pain-card"
              key={pain.title}
              data-reveal
              style={{ '--delay': `${(index % 2) * 110}ms` } as CSSProperties}
            >
              <span className="pain-number">0{index + 1}</span>
              <span className="pain-icon"><Icon size={24} /></span>
              <h3>{pain.title}</h3>
              <p>{pain.text}</p>
            </article>
          )
        })}
      </div>

      <div className="problem-quote" data-reveal>
        <span aria-hidden="true">“</span>
        <p>
          No necesitamos otra herramienta para mirar. Necesitamos un punto de conexión digital
          donde cada cosa esté en su lugar y cualquier persona pueda entrar.
        </p>
      </div>
    </section>
  )
}
