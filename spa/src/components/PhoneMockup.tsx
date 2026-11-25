import brandMark from '../assets/brand-mark.png'
import { CheckIcon, GridIcon, QrIcon, SparkIcon, UsersIcon } from './Icons'

export function PhoneMockup() {
  return (
    <div className="phone-scene">
      <div className="phone-aura" aria-hidden="true" />
      <div className="phone" aria-label="Vista previa de la app Redil">
        <div className="phone-island" aria-hidden="true" />
        <div className="phone-screen">
          <div className="phone-header">
            <img src={brandMark} alt="" width="34" height="34" />
            <div className="phone-header__text">
              <strong>Redil</strong>
              <span>Tu congregación</span>
            </div>
            <span className="phone-online" aria-label="Acceso disponible" />
          </div>

          <p className="phone-hello">Hola, hermandad 👋</p>

          <div className="phone-feature">
            <span className="phone-feature__tag">Próximo evento</span>
            <strong>Culto de domingo</strong>
            <span>Domingo · 10:00 · Salón principal</span>
            <div className="phone-feature__people" aria-hidden="true">
              <i>A</i><i>M</i><i>J</i>
            </div>
          </div>

          <div className="phone-mini-grid">
            <div>
              <UsersIcon size={19} />
              <strong>Miembros</strong>
              <span>de la congregación</span>
            </div>
            <div>
              <GridIcon size={19} />
              <strong>Ministerios</strong>
              <span>y grupos</span>
            </div>
          </div>

          <div className="phone-section-title">
            <strong>Avisos</strong>
            <span>Ver todos</span>
          </div>
          <div className="phone-note">
            <span className="phone-note__dot" />
            <div>
              <strong>Reunión de obreros</strong>
              <span>Hoy · 19:30</span>
            </div>
            <CheckIcon size={16} />
          </div>
          <div className="phone-note">
            <span className="phone-note__dot phone-note__dot--blue" />
            <div>
              <strong>Bautismo</strong>
              <span>Mañana · 16:00</span>
            </div>
          </div>

          <div className="phone-tabs" aria-hidden="true">
            <span className="is-active">Inicio</span>
            <span>Calendario</span>
            <span>Avisos</span>
            <span>Perfil</span>
          </div>
        </div>
      </div>

      <div className="float-card float-card--qr">
        <span className="float-icon"><QrIcon size={20} /></span>
        <div>
          <strong>Acceso por QR</strong>
          <span>Un código, una congregación</span>
        </div>
      </div>
      <div className="float-card float-card--free">
        <span className="float-icon"><SparkIcon size={20} /></span>
        <div>
          <strong>Sin costo</strong>
          <span>Para toda la congregación</span>
        </div>
      </div>
    </div>
  )
}
