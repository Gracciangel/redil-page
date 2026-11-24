import { createContext, useContext } from 'react'

export interface InstallContextValue {
  installed: boolean
  canInstall: boolean
  isIOS: boolean
  install: () => Promise<void>
}

export const InstallContext = createContext<InstallContextValue | null>(null)

export function useInstall(): InstallContextValue {
  const context = useContext(InstallContext)
  if (!context) throw new Error('useInstall debe usarse dentro de InstallProvider')
  return context
}
