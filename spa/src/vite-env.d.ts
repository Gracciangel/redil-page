/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API. Se usa para derivar /public/stats si no se indica otra cosa. */
  readonly VITE_API_URL?: string
  /** Endpoint exacto de métricas públicas. Ej: https://api.ejemplo.com/public/stats */
  readonly VITE_LANDING_STATS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
