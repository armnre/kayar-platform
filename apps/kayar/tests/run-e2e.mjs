// Starts `vite preview` on the built app, runs the browser E2E suite, stops the server, and exits with the suite's code.
import { spawn } from 'node:child_process';
const port = process.env.E2E_PORT || '4173';
const base = `http://localhost:${port}`;
const server = spawn('npx', ['vite', 'preview', '--port', port, '--strictPort'], { stdio: 'ignore' });
let code = 1;
try {
  for (let i = 0; i < 60; i++) { try { if ((await fetch(base)).ok) break; } catch { /* not up yet */ } await new Promise((r) => setTimeout(r, 500)); }
  code = await new Promise((res) => spawn('node', ['tests/e2e-routing.cjs'], { stdio: 'inherit', env: { ...process.env, E2E_BASE_URL: base } }).on('exit', (c) => res(c ?? 1)));
} finally { server.kill(); }
process.exit(code);
