import type { CSSProperties } from 'react'
import brandMark from '../assets/brand-mark.png'
import { ArrowIcon, CheckIcon, ShieldIcon } from './Icons'

const STEPS = [
  {
    title: 'Entrás con tu Google',
    text: 'Tu identidad es la misma de siempre. Sin usuarios nuevos que olvidar.',
  },
  {
    title: 'El pastor o encargado te da el acceso',
    text: 'Desde la congregación te comparten el acceso. Nada de enlaces perdidos.',
  },
  {
    title: 'Recién ahí, tu lugar',
    text: 'La pertenencia se crea primero y los roles se asignan después, con calma.',
  },
]

export function Solution() {
  return (
    <section className="section section--solution" id="solucion">
      <div className="solution-inner">
        <div className="solution-copy">
          <span className="eyebrow" data-reveal>02 · La idea</span>
          <h2 data-reveal>Un punto de conexión digital. Una sola puerta de entrada.</h2>
          <p className="section-lead" data-reveal>
            Redil es una app instalable pensada para la realidad de una congregación: la
            pertenencia va primero, y el resto de las herramientas viven adentro.
          </p>

          <ol className="solution-steps">
            {STEPS.map((step, index) => (
              <li key={step.title} data-reveal style={{ '--delay': `${index * 100}ms` } as CSSProperties}>
                <span className="step-index">0{index + 1}</span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </div>
                <ArrowIcon size={18} />
              </li>
            ))}
          </ol>
        </div>

        <div className="solution-visual" data-reveal>
          <div className="access-card">
            <div className="access-card__top">
              <img src={brandMark} alt="" width="42" height="42" />
              <div>
                <strong>Tu congregación</strong>
                <span>Punto de conexión digital</span>
              </div>
            </div>
            <div className="access-card__body">
              <div className="connection-visual" aria-hidden="true">
                <span className="connection-ring" />
                <img src={brandMark} alt="" width="56" height="56" />
                <span className="connection-node connection-node--one">Miembros</span>
                <span className="connection-node connection-node--two">Grupos</span>
                <span className="connection-node connection-node--three">Ministerios</span>
              </div>
              <div>
                <span className="access-card__label">Todo vinculado</span>
                <strong>Pastor, grupos y miembros</strong>
                <small>Una congregación, una comunidad conectada, un solo lugar para encontrarse.</small>
              </div>
            </div>
            <div className="access-card__footer">
              <ShieldIcon size={17} />
              <span>Un miembro, una congregación, un ingreso.</span>
            </div>
          </div>

          <div className="solution-chip">
            <CheckIcon size={16} />
            Pertenencia confirmada
          </div>
        </div>
      </div>
    </section>
  )
}
