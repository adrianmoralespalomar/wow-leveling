# Rastro

Guía de subida del 1 al 60 para un **cazador orco de Puntería** en *World of Warcraft: Forever* (lanzamiento: 4 de noviembre de 2026). Pensada para tenerla abierta mientras juegas: eliges tu nivel en la barra de arriba y ves qué talento poner, qué entrenar, qué arma buscar, dónde subir y qué equipo te conviene.

## Secciones

El selector **PvE / PvP** de la cabecera cambia la build de talentos, los pesos del equipo (en PvP el Aguante pesa más) y los addons que se muestran.

- **Ahora**: lo que te toca en tu nivel. Talento, instructor, arma a distancia (hito actual y siguiente, con otras formas de cubrirlo y si compensa comprar o esperar), zonas, mazmorras con su botín de cazador y la mejor pieza por ranura con alternativas por vía (misión, subasta, mazmorra, campo de batalla). Si una misión cercana iguala lo de ahora, te avisa de que no gastes. En modo PvP, también tu tramo de campos de batalla.
- **Ruta**: tramos de 10 niveles con zonas, mazmorras e hitos.
- **Talentos**: los tres árboles de la beta con dos builds para subir (Puntería y Bestias), una JcJ (Puntería y Survival) y el orden de puntos nivel a nivel.
- **Mascotas**: qué mascota llevar en cada tramo, bestias que puedes domar a tu nivel (con enlace al mapa), familias con su habilidad propia y las reglas de mascotas de Forever.
- **Equipo**: tabla por ranura con todo lo que puede conseguir la Horda, ordenado por nivel.
- **Campos de batalla**: los cuatro campos de Forever, qué jugar y qué equipo de reputación y honor llevar en cada tramo, cómo se juega el cazador, mascotas para JcJ y las reglas de honor y rangos.
- **Addons**: los que usa la gente en Forever y su estado, según el modo.
- **Mi personaje**: pega el texto del addon `WowLevelingExport` y verás tu equipo, qué ranuras puedes mejorar y tus talentos.

## Arrancar

```bash
npm install
npm start
```

`npm start` levanta la web (http://localhost:4200) y un pequeño servidor de datos (puerto 4300) que usa el botón **Refrescar datos**. Si solo quieres la web, usa `npm run start:web`.

El `.npmrc` activa `legacy-peer-deps` porque `npm install` falla con un error de npm (`edgesOut`) al resolver las dependencias de Vitest.

## Datos

Todo vive en `public/data` y se carga en tiempo de ejecución, así que se puede actualizar sin tocar código.

| Fichero | Origen | Cómo se actualiza |
| --- | --- | --- |
| `items.json` | Cliente beta de Forever vía foreverchanges.pro | `npm run data` |
| `talents.json` | Árboles de la beta vía wowforevertalent.com | `npm run data` |
| `abilities.json` | Libro de hechizos de la beta vía wowforevertalent.com | `npm run data` |
| `pets.json` | Bestias domables de la beta vía wowforevertools.com | `npm run data` |
| `pet-abilities.json` | Rangos de habilidad de mascota, coste en puntos y bestias que los enseñan, vía wow-petopia.com | `npm run data` |
| `meta.json` | Fecha de generación y versión del cliente | `npm run data` |
| `pet-guide.json` | Mascota por tramo, familias y reglas | A mano |
| `pvp-guide.json` | Campos de batalla, tramos, consejos y mascotas JcJ | A mano |
| `talent-builds.json` | Builds y orden de puntos | A mano |
| `leveling-guide.json` | Zonas, mazmorras, hitos de armas y consejos | A mano |
| `addons.json` | Lista de addons | A mano |

### Refrescar

El aviso **Datos de la beta, hasta nivel 30** de la cabecera abre un diálogo con la fecha de los datos y dos botones:

- **Buscar novedades** compara la versión del cliente publicada en las fuentes con la tuya.
- **Refrescar datos** ejecuta `npm run data` desde el servidor local y recarga la web con lo nuevo.

Los dos necesitan arrancar con `npm start`. En una web publicada (sin servidor de datos) ejecuta `npm run data`, vuelve a publicar y pulsa **Volver a cargar**. Lo escrito a mano no cambia al refrescar.

Tras el lanzamiento conviene refrescar: el botín de las mazmorras del 33 al 55 está oculto en el cliente de la beta y aparecerá cuando Blizzard lo publique.

La puntuación de los objetos es orientativa (pesos en `src/app/models/item-score-weights.const.ts`).

## Addon WowLevelingExport

1. Descárgalo desde la web (Mi personaje o Addons) y descomprímelo en la carpeta `Interface/AddOns` de tu instalación de Forever. Si cambias el código del addon, regenera el zip con `npm run addon:zip`.
2. En el juego escribe `/exportpj` (o `/wle`).
3. Copia el texto con Ctrl+C y pégalo en la página **Mi personaje**.

El `.toc` usa `## Interface: 16001` (cliente 1.60.1). Si el juego lo marca como desactualizado, comprueba el número con `/run print((select(4, GetBuildInfo())))` y cámbialo, o activa «Cargar addons desactualizados».
