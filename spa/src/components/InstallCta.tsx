import brandMark from '../assets/brand-mark.png'
import { InstallButton } from './InstallManager'

const PERKS = ['Sin costo', 'Un ícono en tu pantalla', 'Un toque y entrás']

export function InstallCta() {
  return (
    <section className="section install-section" id="instalar">
      <div className="install-panel" data-reveal>
        <div className="install-panel__glow" aria-hidden="true" />
        <img src={brandMark} alt="" width="72" height="72" />
        <span className="eyebrow">Listo para usar</span>
        <h2>Llevá tu congregación a tu bolsillo.</h2>
        <p>
          Instalá Redil en el celular y entrá con un toque. Funciona como una app más: pantalla
          completa, ícono propio y acceso directo para toda la congregación. Sin costo, sin
          suscripciones: si querés apoyar el proyecto, podés hacer una donación opcional.
        </p>
        <InstallButton withArrow>Instalar Redil gratis</InstallButton>
        <div className="install-perks">
          {PERKS.map((perk) => (
            <span key={perk}>✓ {perk}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
