/**
 * Build for local + Render.
 * On Render (RENDER=true): after build, replace vite CLI shims so Start
 * commands like `vite` / `vite preview` run server.cjs instead of exiting 127.
 */
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const viteJs = path.join(root, "node_modules", "vite", "bin", "vite.js");
const distIndex = path.join(root, "dist", "index.html");
const isRender = process.env.RENDER === "true" || process.env.RENDER === "1";

function hasDist() {
  return fs.existsSync(distIndex);
}

function runVite() {
  if (!fs.existsSync(viteJs)) {
    console.log("[build] vite package missing");
    return false;
  }
  console.log("[build] vite build");
  const r = spawnSync(process.execPath, [viteJs, "build"], {
    cwd: root,
    stdio: "inherit",
    env: process.env
  });
  return r.status === 0 && hasDist();
}

/** Make bare `vite` / npx vite / vite preview start our server on Render. */
function installRenderShims() {
  const shimBody = `#!/usr/bin/env node
// Render start shim — replaces vite CLI so "vite" / "vite preview" do not 127.
const { spawn } = require("node:child_process");
const path = require("node:path");
const server = path.join(__dirname, "..", "..", "server.cjs");
// When this file lives at node_modules/vite/bin/vite.js → ../../server.cjs is wrong
// Resolve from process.cwd() which is the service root on Render.
const candidates = [
  path.join(process.cwd(), "server.cjs"),
  path.join(__dirname, "..", "..", "..", "server.cjs"),
  path.join(__dirname, "server.cjs")
];
const fs = require("node:fs");
let target = candidates.find((p) => fs.existsSync(p));
if (!target) {
  console.error("[shim] server.cjs not found", candidates);
  process.exit(1);
}
const child = spawn(process.execPath, [target], { stdio: "inherit", env: process.env });
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code || 0);
});
`;

  const targets = [
    path.join(root, "node_modules", "vite", "bin", "vite.js"),
    path.join(root, "node_modules", ".bin", "vite"),
    path.join(root, "node_modules", ".bin", "vite.cmd"),
    path.join(root, "vite"),
    path.join(root, "serve")
  ];

  // Simpler robust shim for .bin/vite (node script without require path issues)
  const binShim = `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const server = path.resolve(process.cwd(), "server.cjs");
const child = spawn(process.execPath, [server], { stdio: "inherit", env: process.env });
child.on("exit", (c, s) => { if (s) process.kill(process.pid, s); else process.exit(c || 0); });
`;

  const shShim = `#!/bin/sh
exec node "$(dirname "$0")/server.cjs" "$@"
`;

  for (const t of targets) {
    try {
      fs.mkdirSync(path.dirname(t), { recursive: true });
      if (t.endsWith("vite.js")) {
        // Keep real vite.js for nothing — overwrite with node shim using cwd
        fs.writeFileSync(
          t,
          `#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");
const server = path.resolve(process.cwd(), "server.cjs");
const child = spawn(process.execPath, [server], { stdio: "inherit", env: process.env });
child.on("exit", (c, s) => { if (s) process.kill(process.pid, s); else process.exit(c || 0); });
`,
          "utf8"
        );
      } else if (t.endsWith(".cmd")) {
        fs.writeFileSync(t, `@node "%~dp0\\..\\..\\server.cjs" %*\r\n`, "utf8");
      } else if (t.endsWith("vite") && t.includes(`${path.sep}.bin${path.sep}`)) {
        fs.writeFileSync(t, binShim, "utf8");
        try {
          fs.chmodSync(t, 0o755);
        } catch {
          /* windows */
        }
      } else if (t.endsWith(`${path.sep}vite`) || t.endsWith(`${path.sep}serve`) || t.endsWith("/vite") || t.endsWith("/serve") || /(^|[\\/])(vite|serve)$/.test(t)) {
        // root-level shims: ./vite and ./serve next to server.cjs
        if (path.dirname(t) === root) {
          fs.writeFileSync(t, shShim.replace("$(dirname \"$0\")/server.cjs", path.join(root, "server.cjs").replace(/\\/g, "/")), "utf8");
          // portable:
          fs.writeFileSync(
            t,
            `#!/bin/sh\nexec node "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/server.cjs" "$@"\n`,
            "utf8"
          );
          try {
            fs.chmodSync(t, 0o755);
          } catch {
            /* windows */
          }
        }
      }
      console.log("[build] wrote shim", path.relative(root, t));
    } catch (e) {
      console.warn("[build] shim skip", t, e.message);
    }
  }

  // Always write clean root shims
  for (const name of ["vite", "serve", "yarn"]) {
    const p = path.join(root, name);
    if (name === "yarn") {
      fs.writeFileSync(
        p,
        `#!/bin/sh\n# yarn → npm shim on Render\nif [ "$1" = "start" ] || [ "$1" = "run" ] && [ "$2" = "start" ]; then\n  exec node "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/server.cjs"\nfi\nexec npm "$@"\n`,
        "utf8"
      );
    } else {
      fs.writeFileSync(
        p,
        `#!/bin/sh\nexec node "$(CDPATH= cd -- "$(dirname "$0")" && pwd)/server.cjs" "$@"\n`,
        "utf8"
      );
    }
    try {
      fs.chmodSync(p, 0o755);
    } catch {
      /* windows */
    }
    console.log("[build] root shim", name);
  }
}

const ok = runVite();
if (!ok && hasDist()) {
  console.log("[build] using prebuilt dist/");
} else if (!ok && !hasDist()) {
  console.error("[build] failed and no dist/");
  process.exit(1);
}

if (isRender || process.env.FORCE_RENDER_SHIMS === "1") {
  console.log("[build] installing Render start shims (RENDER=true)");
  installRenderShims();
}

console.log("[build] done");
process.exit(0);
