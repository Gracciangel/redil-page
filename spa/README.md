# Redil — landing / SPA

Sitio de presentación de **Redil**, el punto de conexión digital para congregaciones evangélicas. Explica el problema que resuelve, muestra funciones y progreso de desarrollo e incluye un botón de instalación real (prompt nativo cuando el navegador lo permite; si no, QR e instrucciones).

**Lema:** Redil, un lugar para conectar iglesia.  
**Costo:** ninguno para su uso. El proyecto puede sostenerse con donaciones opcionales; nunca se condiciona el acceso a la congregación a un pago.

## Stack

- React 19 + TypeScript + Vite 8
- `vite-plugin-pwa`: manifest + service worker + precache
- Roboto autoalojada (subset latino), igual tipografía que la app
- Paleta de Redil: fondo `#000`, violeta `#c084fc`, texto `#f5eef8`
- `qrcode.react` para el QR de instalación (apunta siempre a `https://redil-5bb15.web.app/login`)
- `@supabase/supabase-js`: cliente público (anon key, solo lectura) para las métricas reales
- Animaciones con IntersectionObserver + CSS: reveals, parallax, órbita, marquee y barras de progreso, con respeto a `prefers-reduced-motion`

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
VITE_SUPABASE_STATS_TABLE=<tabla/vista pública con las métricas>   # se define cuando se confirme el esquema
```

- El cliente se crea en `src/lib/supabase.ts`. Solo usa la **anon key**; la `service_role` nunca debe llegar al front.
- `src/data/landing.ts` consulta `VITE_SUPABASE_STATS_TABLE` si está definida. Espera una fila con `congregations`, `members`, `events`, `announcements`, `updatedAt` y, opcionalmente, `roadmap`.
- Si no hay tabla configurada o la lectura falla, se mantiene el estado actual: sin cifras inventadas y badge «Sin métricas publicadas».
- En CI, las mismas variables se inyectan desde **GitHub Actions Variables** (`vars.VITE_SUPABASE_*`) en el workflow de Pages. El `.env` no se commitea.
- Si RLS bloquea la lectura anónima, hay que exponer una vista/RPC con `security_invoker` o un endpoint propio; no aflojar políticas sobre tablas sensibles.

## Decisiones de contenido

- No se muestran métricas estimadas: hasta que exista el endpoint, la sección de cifras no aparece y el badge dice «Sin métricas publicadas».
- No se muestra ningún QR de acceso ni código perteneciente a una congregación real. El único QR es el de instalación y apunta al login indicado. La sección **Congregaciones** explica el flujo de registro → validación → ingreso → entrega de QR/código, sin ejemplos reales.
- Se habla del **pastor o encargado de la congregación**, no de «dueño» del tenant.
- No se usa la expresión «casa digital»: se dice **punto de conexión digital**.
- La organización interna son **miembros, ministerios y grupos**; no un directorio empresarial.
- La comunicación se centra en ser **gratis** y en conectar a la congregación, con **donaciones opcionales** como forma de apoyo; no se destaca el funcionamiento sin conexión.
- Avance general: **54 %**. Quedan módulos como ministerios y roles, calendario completo y métricas reales.
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
  data/landing.ts         hoja de ruta y normalización del endpoint
  hooks/useMotion.ts      reveals y parallax
  hooks/useLandingData.ts carga de datos
  App.tsx / App.css / index.css / main.tsx
```

## Endpoint de métricas (cuando esté listo)

No hace falta tocar los componentes. Definí en `.env`:

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
