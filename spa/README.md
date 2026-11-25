# Redil — landing / SPA

Sitio de presentación de **Redil**, el punto de conexión digital para congregaciones evangélicas. Explica el problema que resuelve, muestra funciones y progreso de desarrollo e incluye un botón de instalación real (prompt nativo cuando el navegador lo permite; si no, QR e instrucciones).

**Lema:** Redil, un lugar para conectar iglesia.  
**Costo:** ninguno para su uso. El proyecto puede sostenerse con donaciones opcionales; nunca se condiciona el acceso a la congregación a un pago.

## Estado publicado

- **Landing:** https://gracciangel.github.io/redil-page/ (GitHub Pages, deploy automático desde `main`).
- **App:** https://redil-5bb15.web.app (Firebase Hosting, repo separado `redil`). El QR de instalación apunta a `https://redil-5bb15.web.app/login`.
- **Último deploy verificado:** commit `e8c9382`, GitHub Actions run `45516010484`.
- **Métricas vigentes (24 nov 2026):** 100 congregaciones, 43.002 miembros, versión `v1.2.0`, progreso `56 %`. Se leen en vivo desde Supabase; el `54 %` de la hoja de ruta local es solo el fallback cuando no hay dato publicado.

## Stack

- React 19 + TypeScript + Vite 8
- `vite-plugin-pwa`: manifest + service worker + precache
- Roboto autoalojada (subset latino), igual tipografía que la app
- Paleta de Redil: fondo `#000`, violeta `#c084fc`, texto `#f5eef8`
- `qrcode.react` para el QR de instalación (apunta siempre a `https://redil-5bb15.web.app/login`)
- `@supabase/supabase-js`: cliente público (anon key, solo lectura) para las métricas reales
- Animaciones con IntersectionObserver + CSS: reveals, parallax, órbita, marquee y barras de progreso, con respeto a `prefers-reduced-motion`
- Hooks propios: `useLandingData`, `useMotion`, `useInView` y `useCountUp` (contador de las cards de métricas)

## Scripts

```bash
npm install
npm run dev       # http://localhost:5173 (sin service worker)
npm run build     # typecheck + build + manifest y service worker en dist/
npm run preview   # http://localhost:4173, sirve la PWA de verdad
npm run lint
npm run icons     # regenera PNGs desde src/assets/brand-mark.png
```

> El service worker solo se activa en producción. Para probar la instalación usá `npm run build && npm run preview` o desplegá por HTTPS. En iOS: Safari → Compartir → *Agregar a la pantalla de inicio*.

## Conexión a Supabase

El `.env` está en la **raíz del repo** (`../.env` desde `spa/`) y Vite lo carga con `envDir: '..'`:

```
VITE_SUPABASE_URL=https://<proyecto>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key>
VITE_SUPABASE_STATS_TABLE=metrics_redil
VITE_SUPABASE_METRICS_RPC=get_redil_metrics
```

- El cliente se crea en `src/lib/supabase.ts`. Solo usa la **anon key**; la `service_role` nunca debe llegar al front.
- `src/data/landing.ts` llama primero a la RPC `get_redil_metrics` y, si todavía no existe, cae a la lectura directa de `metrics_redil`. En ambos casos toma la fila más reciente (`created_at desc nulls last, id desc`):
  - `congregations` → tarjeta «Congregaciones»
  - `members` → tarjeta «Miembros»
  - `version` → chip «Versión …» en el encabezado de progreso
  - `progress` → porcentaje del anillo y la barra. Con dato publicado manda la RPC (hoy 56 %); si está vacío se calcula desde la hoja de ruta local (54 %).
  - `created_at` → fecha del badge «En vivo»
- Las columnas son nullable: las tarjetas sin dato **no se muestran**. Nunca se inventan números.
- Si la tabla está vacía o la lectura falla, se mantiene el badge «Sin métricas publicadas».
- En CI, las mismas variables se inyectan desde **GitHub Actions Variables** (`vars.VITE_SUPABASE_*`) en el workflow de Pages. El `.env` no se commitea.
- Si RLS bloquea la lectura anónima, hay que exponer una vista/RPC con `security_invoker` o un endpoint propio; no aflojar políticas sobre tablas sensibles.

### RPC de métricas

La definición está en `src/supabase/rpcs/get_redil_metrics.sql`. Hay que ejecutarla **una vez** en el SQL Editor de Supabase (o con la CLI con permisos de `postgres`); la anon key no puede crear funciones.

- La función `public.get_redil_metrics()` es `security definer`, `stable` y no acepta parámetros: devuelve solo `congregations`, `members`, `version`, `progress` y `created_at` de la última fila.
- Se retira `EXECUTE` a `PUBLIC` y se lo da únicamente a `anon` y `authenticated`.
- El archivo incluye, comentadas, las sentencias para revocar el acceso directo a la tabla una vez verificada la RPC.
- Para probarla sin frontend: `curl -X POST "$SUPABASE_URL/rest/v1/rpc/get_redil_metrics" -H "apikey: $ANON_KEY" -H "Authorization: Bearer $ANON_KEY"`.

### Cómo publicar una métrica nueva

Se inserta una fila en `public.metrics_redil` desde el SQL Editor de Supabase; la RPC toma siempre la más reciente, así que no hace falta borrar la anterior ni redesplegar la landing:

```sql
insert into public.metrics_redil (congregations, members, version, progress)
values (<congregaciones reales>, <miembros reales>, '<vX.Y.Z>', <progreso real>);
```

- Usar solo valores reales: nunca números de ejemplo ni estimaciones.
- Las columnas son nullable; si una queda en `NULL`, esa tarjeta no se muestra.
- Si `created_at` no tiene `default now()`, setearlo en el insert. El orden es `created_at desc nulls last, id desc`.
- Para corregir un dato, insertar otra fila con los valores correctos.

### Cards de métricas

- `src/components/Progress.tsx` renderiza una `MetricCard` por columna con dato.
- Iconos (`src/components/Icons.tsx`): congregación → iglesia, miembros → personas, eventos → calendario, avisos → megáfono.
- El número se anima de 0 al valor real con `useCountUp` cuando `useInView` detecta que la card entró al viewport; la entrada de las cards se escalona 110 ms.
- La grilla está centrada (`auto-fit` + `justify-content: center`); en móvil se apila en una columna centrada.
- Con `prefers-reduced-motion` el contador muestra el valor final sin animación.

## Decisiones de contenido

- No se muestran métricas estimadas: mientras la RPC no devuelva una fila con datos, la sección de cifras no aparece y el badge dice «Sin métricas publicadas».
- No se muestra ningún QR de acceso ni código perteneciente a una congregación real. El único QR es el de instalación y apunta al login indicado. La sección **Congregaciones** explica el flujo de registro → validación → ingreso → entrega de QR/código, sin ejemplos reales.
- Se habla del **pastor o encargado de la congregación**, no de «dueño» del tenant.
- No se usa la expresión «casa digital»: se dice **punto de conexión digital**.
- La organización interna son **miembros, ministerios y grupos**; no un directorio empresarial.
- La comunicación se centra en ser **gratis** y en conectar a la congregación, con **donaciones opcionales** como forma de apoyo; no se destaca el funcionamiento sin conexión.
- Avance general: el publicado en Supabase (**56 %** al 24 nov 2026). El **54 %** de la hoja de ruta local es el fallback si no hay dato en vivo. Quedan módulos como ministerios y roles, calendario completo y métricas reales.
- Las **preguntas frecuentes** viven en `src/data/faq.json` (el JSON entregado por el equipo). Los marcadores `{pagina de redil}` y `{email aun no definido}` se resuelven en `src/components/Faq.tsx`: el primero apunta al login real de Redil y el segundo se comunica como «canales de contacto a publicarse próximamente», sin inventar un email.

## Estructura

```
public/
  icons/                  icon-192, icon-512, maskable-512 (generados)
  apple-touch-icon.png
scripts/
  generate-icons.mjs      usa sharp sobre src/assets/brand-mark.png
src/
  assets/brand-mark.png   marca original
  components/             Nav, Hero, PhoneMockup, Problem, Solution,
                          Congregations, Features, Progress, Faq,
                          InstallCta, InstallManager, Footer, Icons
  data/faq.json           preguntas frecuentes (fuente editable)
  data/landing.ts         hoja de ruta, normalización y carga de métricas
  hooks/useLandingData.ts carga de datos (RPC → tabla → endpoint)
  hooks/useMotion.ts      reveals y parallax
  hooks/useInView.ts      entrada de las cards al viewport
  hooks/useCountUp.ts     contador animado de las cards
  lib/supabase.ts         cliente anónimo de Supabase
  supabase/rpcs/          definición SQL de la RPC pública
  App.tsx / App.css / index.css / main.tsx
```

## Endpoint HTTP opcional (último fallback)

Hoy la fuente principal es Supabase. Este endpoint solo se usa si no hay cliente/RPC/tabla configurados. No hace falta tocar los componentes; definí en `.env`:

```env
VITE_API_URL=https://tu-api.example.com
# O, si el endpoint no sigue la convención:
VITE_LANDING_STATS_URL=https://tu-api.example.com/public/stats
```

Contrato esperado (`GET`, con CORS habilitado):

```json
{
  "stats": {
    "congregations": 0,
    "members": 0,
    "events": 0,
    "announcements": 0,
    "updatedAt": "2026-11-24T12:00:00Z"
  },
  "roadmap": [
    { "id": "ministerios", "status": "active", "progress": 60 }
  ]
}
```

- `stats` también se acepta directamente en la raíz del JSON.
- Si faltan cifras, no se muestra nada: nunca se inventan números.
- `roadmap` es opcional. Ids: `accesos`, `miembros`, `agenda`, `avisos`, `ministerios`, `pulido` y `datos`. Estados: `done`, `active` y `next`.
- Si la request falla o no hay URL, se mantiene la hoja de ruta local y el badge «Sin métricas publicadas».
- Todo se normaliza en `src/data/landing.ts`.

## Despliegue

El deploy es **GitHub Pages** con GitHub Actions (`.github/workflows/deploy.yml`). La URL pública es:

**https://gracciangel.github.io/redil-page/**

Por eso `vite.config.ts` usa `base: '/redil-page/'` y el manifest usa esa misma base en `start_url`, `scope`, iconos y atajos. Si el repo se renombra o se agrega un dominio propio, hay que actualizar `BASE` en `vite.config.ts`.

Si el primer deploy falla con un error de Pages, activar **Settings → Pages → Source: GitHub Actions** en el repositorio y volver a correr el workflow.

Cada push a `main` corre `npm ci && npm run build` con las variables inyectadas y publica `spa/dist`. Para verificar un deploy:

```bash
curl -I https://gracciangel.github.io/redil-page/
curl -s https://gracciangel.github.io/redil-page/manifest.webmanifest
```

Chequeos mínimos: `index.html` 200, `manifest.webmanifest` y `sw.js` sirven, el bundle contiene `get_redil_metrics` y la sección de progreso muestra «En vivo» con su versión. El procedimiento completo está en [`../docs/OPERACIONES.md`](../docs/OPERACIONES.md).
