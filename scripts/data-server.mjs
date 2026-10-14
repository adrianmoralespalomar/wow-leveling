// Servidor local para el botón "Refrescar datos" de la web. Solo existe en desarrollo (npm start lo arranca junto a ng serve).
//  GET  /api/data/check    compara las versiones publicadas en las fuentes con las de public/data/meta.json
//  POST /api/data/refresh  ejecuta build-data.mjs y devuelve el nuevo meta.json
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { fetchRemoteVersions } from './data-sources.mjs';

const DATA_SERVER_PORT = 4300;
const BUILD_SCRIPT_URL = new URL('./build-data.mjs', import.meta.url);
const META_FILE_URL = new URL('../public/data/meta.json', import.meta.url);

let isRefreshing = false;

async function readMeta() {
  try {
    return JSON.parse(await readFile(META_FILE_URL, 'utf8'));
  } catch {
    return null;
  }
}

function runBuildScript() {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [fileURLToPath(BUILD_SCRIPT_URL)]);
    let output = '';
    child.stdout.on('data', (chunk) => (output += chunk));
    child.stderr.on('data', (chunk) => (output += chunk));
    child.on('close', (exitCode) => resolve({ ok: exitCode === 0, output: output.trim() }));
  });
}

async function handleCheck() {
  const [meta, remote] = await Promise.all([readMeta(), fetchRemoteVersions()]);
  const hasUpdates = !meta || meta.itemsBuild !== remote.itemsBuild || meta.talentsVersion !== remote.talentsVersion;
  return { hasUpdates, local: meta, remote };
}

async function handleRefresh() {
  if (isRefreshing) return { status: 409, body: { ok: false, output: 'Ya hay una actualización en marcha.' } };
  isRefreshing = true;
  try {
    const result = await runBuildScript();
    return { status: result.ok ? 200 : 500, body: { ...result, meta: await readMeta() } };
  } finally {
    isRefreshing = false;
  }
}

function sendJson(response, status, body) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'GET' && request.url === '/api/data/check') return sendJson(response, 200, await handleCheck());
    if (request.method === 'POST' && request.url === '/api/data/refresh') {
      const { status, body } = await handleRefresh();
      return sendJson(response, status, body);
    }
    sendJson(response, 404, { ok: false, output: 'Ruta desconocida' });
  } catch (error) {
    sendJson(response, 502, { ok: false, output: error instanceof Error ? error.message : String(error) });
  }
});

server.listen(DATA_SERVER_PORT, () => console.log(`Servidor de datos en http://localhost:${DATA_SERVER_PORT}`));
