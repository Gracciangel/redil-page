import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { InstallContext, useInstall, type InstallContextValue } from './installContext'

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

/** El QR de instalación siempre lleva al login de Redil, no a la landing. */
export const INSTALL_URL = 'https://redil-5bb15.web.app/login'

function detectIOS(): boolean {
  if (typeof navigator === 'undefined') return false
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function detectStandalone(): boolean {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    nav.standalone === true ||
    document.referrer.includes('android-app://')
  )
}

export function InstallProvider({ children }: { children: ReactNode }) {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(detectStandalone)
  const [helpOpen, setHelpOpen] = useState(false)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  const isIOS = useMemo(() => detectIOS(), [])

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as InstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setDeferred(null)
      setHelpOpen(false)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    if (!helpOpen) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setHelpOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [helpOpen])

  const install = useCallback(async () => {
    if (installed) return
    if (!deferred) {
      setHelpOpen(true)
      return
    }
    await deferred.prompt()
    const choice = await deferred.userChoice
    setDeferred(null)
    if (choice.outcome === 'accepted') setInstalled(true)
  }, [deferred, installed])

  const value = useMemo<InstallContextValue>(
    () => ({ installed, canInstall: Boolean(deferred), isIOS, install }),
    [deferred, installed, install, isIOS],
  )

  return (
    <InstallContext.Provider value={value}>
      {children}
      {helpOpen && (
        <div className="install-overlay" onMouseDown={() => setHelpOpen(false)}>
          <div
            className="install-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="install-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              ref={closeRef}
              className="dialog-close"
              type="button"
              aria-label="Cerrar"
              onClick={() => setHelpOpen(false)}
            >
              ×
            </button>
            <span className="eyebrow">Instalar en tu celular</span>
            <h2 id="install-title">Redil vive en tu pantalla de inicio</h2>
            <p className="dialog-lead">
              Entrás con un toque, sin escribir URLs y sin costo para tu congregación. Las
              donaciones son opcionales.
            </p>
            <div className="dialog-qr">
              <QRCodeSVG value={INSTALL_URL} size={132} bgColor="#ffffff" fgColor="#000000" />
              <div>
                <strong>Escaneá desde el celular</strong>
                <span>El QR abre directamente el acceso a Redil.</span>
                <a href={INSTALL_URL} target="_blank" rel="noreferrer">Abrir Redil</a>
              </div>
            </div>
            <div className="dialog-steps">
              <div>
                <strong>En iPhone</strong>
                <span>
                  Safari → botón Compartir → <em>Agregar a la pantalla de inicio</em>.
                </span>
              </div>
              <div>
                <strong>En Android</strong>
                <span>
                  Chrome → menú ⋮ → <em>Instalar aplicación</em> o <em>Agregar a inicio</em>.
                </span>
              </div>
            </div>
            <p className="dialog-note">
              En escritorio podés instalarla desde el menú del navegador. La app se abre como
              cualquier programa, con su propio ícono.
            </p>
          </div>
        </div>
      )}
    </InstallContext.Provider>
  )
}

export function InstallButton({
  children = 'Instalar Redil',
  variant = 'primary',
  withArrow = false,
}: {
  children?: ReactNode
  variant?: 'primary' | 'ghost' | 'nav'
  withArrow?: boolean
}) {
  const { installed, install } = useInstall()

  return (
    <button
      className={`install-button install-button--${variant}`}
      type="button"
      onClick={() => void install()}
      aria-label={installed ? 'Redil ya está instalada' : undefined}
    >
      {installed ? 'Ya está instalada' : children}
      {!installed && withArrow && <span aria-hidden="true">↗</span>}
    </button>
  )
}
