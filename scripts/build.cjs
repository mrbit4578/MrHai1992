/**
 * Build helper:
 * 1) Try vite build
 * 2) If vite missing/fails but dist/ exists (prebuilt in git) → success
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

if (process.env.USE_PREBUILT_DIST === "1") {
  if (!hasDist()) {
    console.error("[build] USE_PREBUILT_DIST=1 but dist/index.html missing");
    process.exit(1);
  }
  console.log("[build] using prebuilt dist/ (USE_PREBUILT_DIST=1)");
  process.exit(0);
}

if (fs.existsSync(viteJs)) {
  console.log("[build] vite via node");
  const result = spawnSync(process.execPath, [viteJs, "build"], {
    cwd: root,
    stdio: "inherit",
    env: process.env
  });
  if (result.status === 0 && hasDist()) {
    console.log("[build] vite ok");
    process.exit(0);
  }
  console.warn("[build] vite failed, status=", result.status);
}

if (hasDist()) {
  console.log("[build] fallback: prebuilt dist/ present");
  process.exit(0);
}

console.error("[build] no dist/ and vite unavailable/failed");
process.exit(1);
