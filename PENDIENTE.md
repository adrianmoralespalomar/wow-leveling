# Pendiente

## 1. Desplegar en Vercel con refresco de datos

Hoy la web es estática y funciona en Vercel, salvo "Buscar novedades" y "Refrescar datos": dependen de `scripts/data-server.mjs`, que reescribe `public/data` en disco. En Vercel no se puede.

Hecho: repositorio en GitHub y proyecto en Vercel con build command `npm run build`, usando los JSON de `public/data` subidos al repo.

Problema encontrado: wowforevertools.com devuelve 403 a las máquinas de Vercel (`npm run data` falla en el build). Por eso los datos se regeneran en local y se suben con un push.

Plan:

- [ ] Decidir cómo refrescar en producción. Opciones: regenerar en local y hacer push (lo actual); GitHub Action programada que ejecute `npm run data` y haga commit (comprobar si las fuentes no bloquean también a GitHub); o proxy/headers para esa fuente.
- [ ] Si se vuelve a `npm run data && npm run build` en Vercel, hace falta resolver antes el 403. Si una fuente falla, el despliegue falla y sigue el anterior.
- [ ] Output directory: `dist/wow-leveling/browser`. Comprobar la versión de Node que pide Angular 22.
- [ ] `vercel.json` con un rewrite de todas las rutas a `/index.html`, para que recargar en `/mascotas` no dé 404.
- [ ] Crear un Deploy Hook en Vercel y guardar su URL como variable de entorno secreta (`DEPLOY_HOOK_URL`).
- [ ] Función `api/data/check`: reutiliza `fetchRemoteVersions()` de `scripts/data-sources.mjs` y la compara con `data/meta.json`.
- [ ] Función `api/data/refresh`: llama al Deploy Hook (POST). Añadir un límite de llamadas para que nadie lance builds sin parar.
- [ ] `DataRefreshService`: distinguir local (regenera y recarga al momento) de Vercel ("Publicando datos nuevos, estarán en 1-2 minutos").
- [ ] Opcional: cron de Vercel que lance el hook una vez al día.
- [ ] Actualizar el README.

## 2. Selector PvE / PvP

Hecho (14 de octubre): selector en la cabecera (`STORAGE_KEYS.GAME_MODE`), build `mm-pvp` (31 MM / 20 SV, validada con `talents.json`), pesos de equipo por modo (`PVP_ITEM_STAT_WEIGHTS`), procedencia `pvp` para los vendedores de reputación y honor (`scripts/pvp-sources.mjs`), pestaña Campos de batalla con `pvp-guide.json` (campos, tramos con equipo de la Horda, combate, mascotas, reglas) y addons con `mode`. Cambian con el modo: Ahora (talento, tramo JcJ y pesos del equipo), Talentos, Equipo y Addons. Ruta y Mascotas se quedan igual.

Queda:

- [ ] Revisar todo en el lanzamiento (4 de noviembre): en la beta solo se juega Darkspear Islands, así que tramos, recompensas y reglas salen de guías de fans.
- [ ] Recompensas de Darkspear Raiders y de las marcas de honor: aún no están en los datos de foreverchanges.pro. Cuando salgan, añadirlas a los tramos.
- [ ] Twinks: confirmar si Forever deja bloquear la experiencia y si los campos dan experiencia.
- [ ] Probar la build JcJ y las mascotas recomendadas en partidas reales; quizá una segunda build JcJ de Bestias.
- [ ] Comprobar si LoseControl tiene versión Forever y si hay temporizadores de campo de batalla compatibles.
