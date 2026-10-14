// npm start: arranca el servidor de datos (botón "Refrescar datos") y ng serve a la vez; al cerrar uno se cierran los dos.
import { spawn } from 'node:child_process';

const ngServeCommand = ['npx ng serve', ...process.argv.slice(2)].join(' ');
const children = [
  spawn(process.execPath, ['scripts/data-server.mjs'], { stdio: 'inherit' }),
  spawn(ngServeCommand, { stdio: 'inherit', shell: true }),
];

function stopAll() {
  for (const child of children) if (child.exitCode === null) child.kill();
}

for (const child of children) child.on('exit', stopAll);
process.on('SIGINT', stopAll);
process.on('SIGTERM', stopAll);
