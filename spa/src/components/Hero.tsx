import type { CSSProperties } from 'react'
import { InstallButton } from './InstallManager'
import { PhoneMockup } from './PhoneMockup'

export function Hero() {
  return (
    <>
      <section className="hero" id="inicio">
        <div className="hero-copy">
          <span className="eyebrow hero-eyebrow" data-reveal>
            <span className="eyebrow-dot" /> Punto de conexión digital · Sin costo
          </span>
          <h1 data-reveal style={{ '--delay': '80ms' } as CSSProperties}>
            Tu congregación,
            <br />
            <span>en una sola app.</span>
          </h1>
          <p className="hero-lead" data-reveal style={{ '--delay': '160ms' } as CSSProperties}>
            Redil reúne miembros, ministerios, grupos, eventos y avisos en un punto de conexión
            digital. Se instala en el celular, abre con un toque y no tiene costo para tu
            congregación. Su sostenimiento se apoya en donaciones opcionales.
          </p>
          <div className="hero-actions" data-reveal style={{ '--delay': '240ms' } as CSSProperties}>
            <InstallButton withArrow>Instalar Redil gratis</InstallButton>
            <a className="text-link" href="#problema">
              Ver el problema <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div className="hero-proof" data-reveal style={{ '--delay': '320ms' } as CSSProperties}>
            <div className="avatar-stack" aria-hidden="true">
              <i>M</i><i>A</i><i>L</i><i>R</i>
            </div>
            <span>Redil, un lugar para conectar iglesia. Sin costo; donaciones opcionales.</span>
          </div>
        </div>
        <PhoneMockup />
      </section>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {Array.from({ length: 2 }, (_, index) => (
            <span key={index}>
              Miembros <b>✦</b> Ministerios <b>✦</b> Grupos <b>✦</b> Eventos <b>✦</b> Avisos{' '}
              <b>✦</b> Accesos con QR <b>✦</b> Sin costo <b>✦</b> Donaciones opcionales <b>✦</b>
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
