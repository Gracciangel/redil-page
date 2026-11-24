import brandMark from '../assets/brand-mark.png'

export function Footer() {
  return (
    <footer className="site-footer">
      <a className="brand" href="#inicio">
        <img src={brandMark} alt="" width="28" height="28" />
        <span>Redil</span>
      </a>
      <p>Redil, un lugar para conectar iglesia. Sin costo; apoyalo con donaciones opcionales.</p>
      <div className="footer-links">
        <a href="#problema">Problema</a>
        <a href="#solucion">La idea</a>
        <a href="#congregaciones">Congregaciones</a>
        <a href="#funciones">Funciones</a>
        <a href="#progreso">Progreso</a>
        <a href="#instalar">Instalar</a>
      </div>
      <small>© {new Date().getFullYear()} Redil</small>
    </footer>
  )
}
