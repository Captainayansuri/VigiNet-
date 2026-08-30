import { spawn } from 'node:child_process';

const startProcess = (command, args) => {
  const child = spawn(command, args, {
    stdio: 'inherit',
    env: process.env,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      process.exit(code ?? 1);
    }
  });

  return child;
};

const backend = startProcess(process.execPath, ['server/index.js']);
const frontend = startProcess(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0']);

const shutdown = () => {
  backend.kill('SIGTERM');
  frontend.kill('SIGTERM');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);