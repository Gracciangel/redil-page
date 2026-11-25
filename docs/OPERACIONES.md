# Operaciones de la landing de Redil

Procedimientos para publicar cambios, actualizar métricas y verificar el sitio. La fuente de verdad de la aplicación es `spa/README.md`; acá está el paso a paso.

## Enlaces y estado

| Recurso | Valor |
| --- | --- |
| Landing | https://gracciangel.github.io/redil-page/ |
| App (Firebase Hosting) | https://redil-5bb15.web.app |
| Login / destino del QR | https://redil-5bb15.web.app/login |
| Proyecto Supabase | `ghjdhnqphsflcajoacwq` |
| Tabla de métricas | `public.metrics_redil` |
| RPC pública | `public.get_redil_metrics()` |
| Último deploy verificado | commit `e8c9382`, run `45516010484` |
| Valores vigentes (24 nov 2026) | 100 congregaciones · 43.002 miembros · v1.2.0 · 56 % |

El repositorio de la app es separado (`C:\Users\angel\redil`) y se despliega con `npm run deploy` (Firebase CLI). **Este repo solo contiene la landing.**

---

## 1. Publicar un cambio en la landing

El deploy es automático: cada push a `main` dispara `.github/workflows/deploy.yml`.

```powershell
cd C:\Users\angel\redil-page\spa
npm run lint
npm run build
cd ..
git add -A
git commit -m "Descripcion del cambio"
git push origin main
```

Después:

1. Esperar el workflow en `https://github.com/Gracciangel/redil-page/actions` (o `gh run list`). Debe terminar en `success`.
2. Verificar el sitio:

```powershell
Invoke-WebRequest -Uri 'https://gracciangel.github.io/redil-page/' -UseBasicParsing
Invoke-WebRequest -Uri 'https://gracciangel.github.io/redil-page/manifest.webmanifest' -UseBasicParsing
Invoke-WebRequest -Uri 'https://gracciangel.github.io/redil-page/sw.js' -UseBasicParsing
```

Las tres deben dar `200`. Si el contenido parece viejo, recargar con caché desactivada o cerrar/reabrir la pestaña: el service worker precachea el build anterior.

También se puede disparar el workflow manualmente con `workflow_dispatch` desde la pestaña *Actions* (útil si el último push falló y ya está corregido en `main`).

---

## 2. Actualizar versión, progreso y cifras

No hace falta tocar el código ni redesplegar. Se inserta una **fila nueva** en `metrics_redil`; la RPC elige siempre la más reciente.

Ejecutar en el SQL Editor de Supabase:

```sql
insert into public.metrics_redil (congregations, members, version, progress)
values (<congregaciones reales>, <miembros reales>, '<vX.Y.Z>', <progreso real>);
```

Reglas:

- Usar **solo valores reales**. Nunca dejar números de ejemplo ni estimaciones.
- Todas las columnas son nullable. Si una se deja `NULL`, esa tarjeta no se muestra (no se inventa un `0`).
- Si `created_at` no tiene `default now()`, setearlo en el insert. El orden es `created_at desc nulls last, id desc`.
- No borrar el historial: la fila anterior queda como registro y la nueva pasa a ser la vigente.
- Para corregir un error, insertar otra fila con los valores correctos en lugar de editar la anterior.

Resultado esperado en la landing:

| Columna | Dónde aparece |
| --- | --- |
| `congregations` | Tarjeta «Congregaciones» |
| `members` | Tarjeta «Miembros» |
| `version` | Chip «Versión …» en el encabezado de Progreso |
| `progress` | Anillo y barra de avance general |
| `created_at` | Fecha del badge «En vivo» |

Si `progress` está `NULL`, se usa la hoja de ruta local (54 %). Si no hay ninguna fila con datos, el badge dice «Sin métricas publicadas».

### Verificar la RPC

```powershell
$envLines = Get-Content 'C:\Users\angel\redil-page\.env'
$url = ($envLines | Where-Object { $_ -like 'VITE_SUPABASE_URL=*' }) -replace '^VITE_SUPABASE_URL=',''
$key = ($envLines | Where-Object { $_ -like 'VITE_SUPABASE_ANON_KEY=*' }) -replace '^VITE_SUPABASE_ANON_KEY=',''
$h = @{ 'apikey'=$key; 'Authorization'="Bearer $key"; 'Content-Type'='application/json' }
Invoke-RestMethod -Method Post -Uri "$url/rest/v1/rpc/get_redil_metrics" -Headers $h -Body '{}'
```

Debe devolver un array con una fila. Si la tabla está vacía, devuelve `[]`: eso es correcto, no un error.

La definición de la función está en `spa/src/supabase/rpcs/get_redil_metrics.sql`. Solo necesita ejecutarse **una vez**; si se actualiza, el archivo es idempotente (`drop function if exists` + `create or replace`). La anon key no puede crearla: hay que usar el SQL Editor o la CLI con rol `postgres`.

---

## 3. Actualizar las preguntas frecuentes

1. Editar `spa/src/data/faq.json` (array de `{ "question", "response" }`).
2. Si aparece un marcador nuevo `{...}`, resolverlo en `spa/src/components/Faq.tsx` dentro de `TOKENS`. Los actuales:
   - `{pagina de redil}` → enlace al login real de Redil (`INSTALL_URL`).
   - `{email aun no definido}` → «los canales de contacto que publicaremos próximamente». No inventar un email.
3. Correr `npm run lint` y `npm run build`, hacer commit y push (sección 1).

---

## 4. Cambiar la URL del QR o la base del sitio

- **QR de instalación:** constante `INSTALL_URL` en `spa/src/components/InstallManager.tsx`. Hoy apunta a `https://redil-5bb15.web.app/login` y no debe cambiar salvo que la app se mude de dominio.
- **Base de GitHub Pages:** `BASE` en `spa/vite.config.ts` (`/redil-page/`). Afecta `base`, `start_url`, `scope`, iconos y atajos del manifest. Si se agrega un dominio propio, actualizar ahí y el manifest se recalcula solo.
- **Atajos del manifest:** mismo archivo, array `shortcuts` (incluye `#faq`).

---

## 5. Variables de entorno y CI

El `.env` queda en la raíz del repo y **no se commitea** (regla en `.gitignore`). Plantilla: `.env.example`.

| Variable | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | anon key pública; **nunca `service_role`** |
| `VITE_SUPABASE_STATS_TABLE` | `metrics_redil`, fallback si la RPC falta |
| `VITE_SUPABASE_METRICS_RPC` | `get_redil_metrics`; tiene default en código |
| `VITE_API_URL` / `VITE_LANDING_STATS_URL` | endpoint HTTP opcional, último fallback |

En GitHub: *Settings → Secrets and variables → Actions → Variables*. El workflow inyecta las cuatro primeras en el paso *Build*. Si se renombra una variable, hay que actualizar también `.github/workflows/deploy.yml`.

La anon key es pública por diseño y queda embebida en el bundle; eso es esperado. La `service_role` jamás debe aparecer en el front ni en el bundle.

---

## 6. Rollback

- **Código:** revertir el commit (`git revert <sha>`) y pushear; Actions publica el estado anterior.
- **Métricas:** insertar una fila nueva con los valores correctos. No editar ni borrar filas antiguas.
- **FAQ:** revertir el commit del JSON; no hay estado en base de datos.

---

## 7. Solución de problemas

| Síntoma | Causa probable | Acción |
| --- | --- | --- |
| Badge «Sin métricas publicadas» | Tabla vacía, RPC inexistente o sin `EXECUTE` a `anon` | Ejecutar el SQL de la RPC y cargar una fila real |
| RPC devuelve `404` | Función no creada en la base | Ejecutar `spa/src/supabase/rpcs/get_redil_metrics.sql` |
| RPC devuelve `401` | anon key inválida o rotating | Actualizar `VITE_SUPABASE_ANON_KEY` en `.env` y en GitHub Actions Variables |
| Aparece el progreso 54 % | `progress` es `NULL` en la fila vigente | Cargar una fila con `progress` real |
| No aparece una tarjeta | La columna correspondiente está `NULL` | Completar el valor en una fila nueva |
| El sitio no refleja el deploy | Service worker con caché del build anterior | Recarga forzada; verificar el asset activo en el HTML |
| `npm run build` falla en CI | Falta alguna variable de GitHub Actions | Revisar *Variables* y el paso *Build* del workflow |
| Página 404 en la raíz | `BASE` / Pages mal configurado | Verificar `BASE='/redil-page/'` y *Settings → Pages → Source: GitHub Actions* |
| El contador no anima | `prefers-reduced-motion` activo o sin IntersectionObserver | Comportamiento esperado: muestra el valor final directo |

---

## 8. Reglas de contenido (no negociables)

- Lema: **Redil, un lugar para conectar iglesia**.
- **Sin costo**, con donaciones opcionales. Nunca condicionar el acceso a un pago.
- **Punto de conexión digital**, nunca «casa digital».
- **Pastor o encargado**, nunca «dueño».
- La congregación tiene **miembros, ministerios y grupos**, no un «directorio».
- Flujo de congregaciones: registro → validación → ingreso → QR/código **solo después de validar**.
- No se muestran códigos de congregaciones reales ni QR de ejemplo; el único QR es el de instalación.
- No se anuncia funcionamiento sin conexión.
- Nunca se publican cifras estimadas: si no hay dato real, no se muestra.
