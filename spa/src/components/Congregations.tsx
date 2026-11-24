import type { CSSProperties } from 'react'
import brandMark from '../assets/brand-mark.png'
import { ArrowIcon, CheckIcon, QrIcon, ShieldIcon } from './Icons'

const STEPS = [
  {
    title: 'La congregación se registra',
    text: 'El pastor o encargado carga los datos de la iglesia: nombre, ciudad y un contacto.',
    icon: ShieldIcon,
  },
  {
    title: 'Se valida la información',
    text: 'Revisamos que los datos sean correctos. Mientras tanto, no se entregan accesos.',
    icon: CheckIcon,
  },
  {
    title: 'Recién ahí, ingreso habilitado',
    text: 'Con la congregación validada, el pastor o encargado puede iniciar sesión.',
    icon: ArrowIcon,
  },
  {
    title: 'QR y código para compartir',
    text: 'Obtiene su propio QR y código de acceso para invitar a los miembros de su congregación.',
    icon: QrIcon,
  },
]

export function Congregations() {
  return (
    <section className="section section--congregations" id="congregaciones">
      <div className="congregation-inner">
        <div className="congregation-copy">
          <span className="eyebrow" data-reveal>03 · Congregaciones</span>
          <h2 data-reveal>Primero la congregación. Después, sus miembros.</h2>
          <p className="section-lead" data-reveal>
            Así como un miembro entra con su Google y el acceso que recibe, la congregación tiene
            su propio camino: se registra, se valida y recién entonces puede entregar accesos a su
            comunidad.
          </p>

          <ol className="tenant-steps">
            {STEPS.map((step, index) => {
              const Icon = step.icon
              return (
                <li
                  key={step.title}
                  data-reveal
                  style={{ '--delay': `${index * 90}ms` } as CSSProperties}
                >
                  <span className="tenant-step-index">0{index + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.text}</p>
                  </div>
                  <Icon size={18} />
                </li>
              )
            })}
          </ol>
        </div>

        <div className="congregation-visual" data-reveal>
          <div className="tenant-card">
            <div className="tenant-card__top">
              <img src={brandMark} alt="" width="42" height="42" />
              <div>
                <strong>Tu congregación</strong>
                <span>Registro y validación</span>
              </div>
              <span className="tenant-state">En revisión</span>
            </div>

            <div className="tenant-progress" aria-hidden="true">
              <span className="is-done">1</span>
              <i />
              <span className="is-active">2</span>
              <i />
              <span>3</span>
            </div>

            <div className="tenant-access">
              <QrIcon size={26} />
              <div>
                <strong>QR y código de acceso</strong>
                <span>Disponibles solo después de la validación.</span>
              </div>
              <ShieldIcon size={18} />
            </div>

            <p className="tenant-card__note">
              No mostramos códigos reales: cada congregación recibe los suyos cuando ingresa.
            </p>
          </div>
          <div className="tenant-chip">
            <CheckIcon size={16} />
            Accesos habilitados tras la validación
          </div>
        </div>
      </div>
    </section>
  )
}
