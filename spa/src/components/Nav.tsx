import brandMark from '../assets/brand-mark.png'
import { InstallButton } from './InstallManager'


const LINKS = [
  { href: '#problema', label: 'El problema' },
  { href: '#solucion', label: 'La idea' },
  { href: '#congregaciones', label: 'Congregaciones' },
  { href: '#funciones', label: 'Funciones' },
  { href: '#progreso', label: 'Progreso' },
  { href: '#faq', label: 'Preguntas' },
]

export function Nav() {
  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Redil, volver al inicio">
        <img src={brandMark} alt="" width="34" height="34" />
        <span>Redil</span>
      </a>
      <nav className="site-nav" aria-label="Navegación principal">
        {LINKS.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
      <InstallButton variant="nav">Instalar app</InstallButton>
    </header>
  )
}
