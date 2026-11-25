-- Redil — RPC pública para las métricas de la landing.
-- Ejecutar en el SQL Editor de Supabase (requiere rol postgres / service_role).
-- Idempotente: se puede volver a ejecutar sin duplicar nada.
--
-- Devuelve solo la fila más reciente de public.metrics_redil y únicamente las
-- columnas públicas. Corre como security definer para no depender de RLS, pero
-- no acepta parámetros ni usa SQL dinámico: no expone ninguna otra tabla.

drop function if exists public.get_redil_metrics();

create or replace function public.get_redil_metrics()
returns table (
  congregations bigint,
  members       bigint,
  version       text,
  progress      integer,
  created_at    timestamptz
)
language sql
stable
security definer
set search_path = public
as $$
  select m.congregations,
         m.members,
         m.version,
         m.progress,
         m.created_at
  from public.metrics_redil as m
  -- created_at es nullable: DESC deja los NULL primero, así que se mandan al
  -- final y se desempata por id (identity) para tomar la fila realmente última.
  order by m.created_at desc nulls last, m.id desc
  limit 1;
$$;

-- Postgres otorga EXECUTE a PUBLIC por defecto: se lo quitamos y lo damos solo
-- a los roles que usa la landing.
revoke all on function public.get_redil_metrics() from public;
grant execute on function public.get_redil_metrics() to anon, authenticated;

-- Opcional (recomendado una vez verificada la RPC): si querés que la tabla deje
-- de ser legible directamente, descomentá estas dos líneas:
-- revoke select on public.metrics_redil from anon;
-- revoke select on public.metrics_redil from authenticated;
