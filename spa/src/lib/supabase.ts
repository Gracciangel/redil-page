import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente público de Supabase para la landing.
 * Las credenciales se leen del `.env` de la raíz (Vite `envDir: '..'`) o de las
 * variables del workflow en CI. Solo se usa la anon key: nunca service_role.
 */
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase: SupabaseClient | null =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        },
      })
    : null

export const hasSupabase = supabase !== null
