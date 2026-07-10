/**
 * Production build for Render/CI.
 * - Prefer vite build when available
 * - Never fail the deploy if a prebuilt dist/ already exists
 */
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const viteJs = path.join(root, "node_modules", "vite", "bin", "vite.js");
const distIndex = path.join(root, "dist", "index.html");

function hasDist() {
  return fs.existsSync(distIndex);
}

function runViteBuild() {
  if (!fs.existsSync(viteJs)) {
    console.log("[build] vite not installed at", viteJs);
    return false;
  }
  console.log("[build] running vite build via node");
  const result = spawnSync(process.execPath, [viteJs, "build"], {
    cwd: root,
    stdio: "inherit",
    env: process.env
  });
  return result.status === 0;
}

const ok = runViteBuild();
if (ok && hasDist()) {
  console.log("[build] success");
  process.exit(0);
}

if (hasDist()) {
  console.log("[build] vite failed or skipped, but prebuilt dist/ exists — continue");
  process.exit(0);
}

console.error("[build] FATAL: no dist/ and vite build failed");
process.exit(1);
