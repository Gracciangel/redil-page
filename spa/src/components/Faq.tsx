import { Fragment, type CSSProperties, type ReactNode } from 'react'
import faq from '../data/faq.json'
import { INSTALL_URL } from './InstallManager'

/** Marcadores del JSON provisto por el equipo de Redil, resueltos sin inventar datos. */
const TOKENS: Record<string, ReactNode> = {
  'pagina de redil': (
    <a href={INSTALL_URL} target="_blank" rel="noreferrer">
      Redil
    </a>
  ),
  'email aun no definido': 'los canales de contacto que publicaremos próximamente',
}

function renderResponse(text: string): ReactNode[] {
  return text.split(/(\{[^}]+\})/g).map((part, index) => {
    const token = /^\{([^}]+)\}$/.exec(part)
    if (!token) return part
    const value = TOKENS[token[1]]
    return value ? <Fragment key={index}>{value}</Fragment> : part
  })
}

export function Faq() {
  return (
    <section className="section section--faq" id="faq">
      <div className="faq-layout">
        <div className="faq-intro" data-reveal>
          <span className="eyebrow">06 · Preguntas frecuentes</span>
          <h2>Lo que probablemente querés saber.</h2>
          <p className="section-lead">
            Cómo se crea una congregación, quién puede entrar y qué incluye Redil. Respondido sin
            letra chica.
          </p>
          <p className="faq-hint">Tocá una pregunta para desplegar la respuesta.</p>
        </div>

        <div className="faq-list">
          {faq.map((item, index) => (
            <details
              className="faq-item"
              key={item.question}
              data-reveal
              style={{ '--delay': `${index * 55}ms` } as CSSProperties}
            >
              <summary>{item.question}</summary>
              <div className="faq-answer">
                <p>{renderResponse(item.response)}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
