/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL base de la API. Se usa para derivar /public/stats si no se indica otra cosa. */
  readonly VITE_API_URL?: string
  /** Endpoint exacto de métricas públicas. Ej: https://api.ejemplo.com/public/stats */
  readonly VITE_LANDING_STATS_URL?: string
  /** URL del proyecto Supabase (solo lectura pública desde la landing). */
  readonly VITE_SUPABASE_URL?: string
  /** anon key de Supabase. Nunca usar service_role en el front. */
  readonly VITE_SUPABASE_ANON_KEY?: string
  /** Tabla/vista pública con las métricas (fallback hasta desplegar la RPC). */
  readonly VITE_SUPABASE_STATS_TABLE?: string
  /** Nombre de la RPC pública que devuelve las métricas. */
  readonly VITE_SUPABASE_METRICS_RPC?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
