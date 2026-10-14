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

Necesito saber qué talentos, equipo y addons llevar en campos de batalla, no solo para subir de nivel.

Idea:

- [ ] Selector PvE / PvP siempre visible en la cabecera, junto al nivel. Guardado en `PlayerProgressService` (nueva clave `STORAGE_KEYS.GAME_MODE`).
- [ ] Talentos: añadir `mode: 'pve' | 'pvp'` a `talent-builds.json` y builds PvP para Puntería (Scatter Shot, Improved Concussive Shot, Deterrence o Improved Wing Clip según el reparto). Validarlas con `talents.json` como las de PvE.
- [ ] Equipo: pesos de stats por modo (en PvP sube Stamina) en `ITEM_STAT_WEIGHTS`, y fuentes PvP: recompensas de honor y de reputación de Warsong Gulch, Arathi Basin y Alterac Valley.
- [ ] Tramos de BG (10-19, 20-29…): qué llevar en cada uno, incluido equipo de twink si compensa quedarse en un tramo.
- [ ] Pestaña o sección "Campos de batalla": niveles de entrada, rotación y prioridades del cazador (control, kiting, Viper Sting contra casters, Tranquilizing Shot), y mascota recomendada para PvP.
- [ ] Addons PvP en `addons.json` con etiqueta de modo (temporizadores de BG, enemigos, cooldowns de rivales). Comprobar cuáles hay para el cliente de Forever.
- [ ] Ver qué pestañas cambian con el modo (Ahora, Talentos, Equipo, Addons, Mascotas) y cuáles se quedan igual (Ruta).

Investigar antes:

- [ ] Qué BG y qué sistema de honor y rangos trae Forever, y si cambia algo respecto a Classic.
- [ ] Si la beta tiene BG hasta el 30 y si foreverchanges.pro lista el equipo de honor o de reputación PvP.
