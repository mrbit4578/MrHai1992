/**
 * postinstall: on Render, install shims so common broken Start Commands work:
 *   vite | vite preview | serve | yarn start | npm start
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const isRender = process.env.RENDER === "true" || process.env.RENDER === "1";

if (!isRender && process.env.FORCE_RENDER_SHIMS !== "1") {
  process.exit(0);
}

console.log("[render-shims] installing start shims");

const binShim = `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const server = path.resolve(process.cwd(), "server.cjs");
const child = spawn(process.execPath, [server], { stdio: "inherit", env: process.env });
child.on("exit", (c, s) => { if (s) process.kill(process.pid, s); else process.exit(c || 0); });
`;

const shRoot = `#!/bin/sh
ROOT="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
exec node "$ROOT/server.cjs" "$@"
`;

function write(file, body, mode = 0o755) {
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body, "utf8");
    try {
      fs.chmodSync(file, mode);
    } catch {
      /* ignore */
    }
    console.log("[render-shims]", path.relative(root, file));
  } catch (e) {
    console.warn("[render-shims] skip", file, e.message);
  }
}

// Root shims (if Start Command is ./vite or PATH includes project root)
for (const name of ["vite", "serve"]) {
  write(path.join(root, name), shRoot);
}

// yarn shim → npm start equivalent
write(
  path.join(root, "yarn"),
  `#!/bin/sh
ROOT="$(CDPATH= cd -- "$(dirname "$0")" && pwd)"
if [ "$1" = "start" ]; then exec node "$ROOT/server.cjs"; fi
if [ "$1" = "run" ] && [ "$2" = "start" ]; then exec node "$ROOT/server.cjs"; fi
if [ "$1" = "run" ] && [ "$2" = "preview" ]; then exec node "$ROOT/server.cjs"; fi
if command -v npm >/dev/null 2>&1; then exec npm "$@"; fi
exec node "$ROOT/server.cjs"
`
);

// node_modules/.bin shims (PATH usually includes this after npm install on Node runtime)
const binDir = path.join(root, "node_modules", ".bin");
write(path.join(binDir, "vite"), binShim);
write(path.join(binDir, "serve"), binShim);

// Overwrite vite package CLI entry used by some start commands
const viteCli = path.join(root, "node_modules", "vite", "bin", "vite.js");
if (fs.existsSync(path.dirname(viteCli))) {
  write(
    viteCli,
    `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const server = path.resolve(process.cwd(), "server.cjs");
const child = spawn(process.execPath, [server], { stdio: "inherit", env: process.env });
child.on("exit", (c, s) => { if (s) process.kill(process.pid, s); else process.exit(c || 0); });
`,
    0o644
  );
}

console.log("[render-shims] done");
