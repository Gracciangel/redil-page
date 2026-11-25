# Redil — landing page

Sitio público de presentación de Redil: **https://gracciangel.github.io/redil-page/**

## Estado actual

- Landing publicada en GitHub Pages. Último deploy verificado: commit `e8c9382`, GitHub Actions run `45516010484`.
- Métricas en vivo leídas desde Supabase a través de la RPC pública 
- Valores vigentes (24 nov 2026): **100 congregaciones**, **43.002 miembros**, versión `v1.2.0`, progreso `56 %`.
- La aplicación de Redil es un proyecto separado (`C:\Users\angel\redil`) desplegado en Firebase Hosting: **https://redil-5bb15.web.app**. El QR de instalación de la landing apunta siempre a `https://redil-5bb15.web.app/login`.

## Qué hay en este repo

| Ruta | Contenido |
| --- | --- |
| `spa/` | Aplicación React + TypeScript + Vite, PWA instalable |
| `spa/src/components/` | Secciones de la landing, FAQ y tarjetas de métricas animadas |
| `spa/src/data/` | Hoja de ruta, normalización de métricas y preguntas frecuentes |
| `spa/src/supabase/rpcs/` | Definición SQL de la RPC pública de métricas |
| `.github/workflows/deploy.yml` | Build y deploy automático a GitHub Pages |
| `docs/OPERACIONES.md` | Procedimientos para publicar, actualizar métricas y verificar |

## Documentación

- [Guía de la SPA, arquitectura y decisiones de contenido](spa/README.md)
- [Operaciones: deploy, métricas, FAQ, variables y solución de problemas](docs/OPERACIONES.md)
- [Plantilla de variables de entorno](.env.example)

## Resumen técnico

React 19 + TypeScript + Vite 8, `vite-plugin-pwa` (manifest, service worker y precache), Roboto autoalojada, QR generado con `qrcode.react` y cliente público de Supabase con **anon key** (nunca `service_role`).

`npm run lint` y `npm run build` deben pasar antes de publicar; el workflow de GitHub Actions los ejecuta automáticamente en cada push a `main`. El `.env` de la raíz está gitignoreado: en CI las mismas variables se inyectan desde GitHub Actions Variables.
