/**
 * Production static server for Render / any host that sets PORT.
 * Avoids shell-specific $PORT expansion issues.
 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { existsSync } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
const serveBin = path.join(root, "node_modules", "serve", "build", "main.js");
const port = String(process.env.PORT || 3000);

if (!existsSync(dist)) {
  console.error("dist/ not found. Run `npm run build` before start.");
  process.exit(1);
}
if (!existsSync(serveBin)) {
  console.error("serve package missing. Run `npm install`.");
  process.exit(1);
}

console.log(`serving ${dist} on 0.0.0.0:${port}`);

const child = spawn(
  process.execPath,
  [serveBin, "-s", dist, "-l", `tcp://0.0.0.0:${port}`, "--no-port-switching"],
  {
    cwd: root,
    stdio: "inherit",
    env: process.env
  }
);

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    child.kill(sig);
  });
}
