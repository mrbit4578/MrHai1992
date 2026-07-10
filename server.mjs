/**
 * Production static file server — Node built-ins only.
 * Start command for Render Web Service:
 *   node server.mjs
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8"
};

function log(...args) {
  console.log("[server]", ...args);
}

if (!fs.existsSync(dist)) {
  console.error("[server] FATAL: dist/ missing. Build step did not produce dist/.");
  console.error("[server] cwd=", process.cwd());
  console.error("[server] expected=", dist);
  process.exit(1);
}

function safePath(urlPath) {
  const raw = decodeURIComponent((urlPath || "/").split("?")[0].split("#")[0]);
  const normalized = path.posix.normalize(raw).replace(/^(\.\.(\/|$))+/, "");
  const abs = path.join(dist, normalized);
  if (!abs.startsWith(dist)) return null;
  return abs;
}

function sendText(res, code, text, type = "text/plain; charset=utf-8") {
  res.writeHead(code, { "content-type": type, "content-length": Buffer.byteLength(text) });
  res.end(text);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "content-type": type,
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable"
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  try {
    const url = req.url || "/";
    if (url === "/health" || url.startsWith("/health?")) {
      return sendText(res, 200, "ok");
    }

    let target = safePath(url === "/" ? "/index.html" : url);
    if (!target) return sendText(res, 400, "bad path");

    if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
      target = path.join(target, "index.html");
    }

    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      return sendFile(res, target);
    }

    const indexPath = path.join(dist, "index.html");
    if (fs.existsSync(indexPath)) return sendFile(res, indexPath);
    return sendText(res, 404, "not found");
  } catch (err) {
    console.error(err);
    return sendText(res, 500, "error");
  }
});

server.listen(port, host, () => {
  log(`listening on http://${host}:${port}`);
  log(`serving ${dist}`);
  log(`node ${process.version}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    log(`shutdown ${sig}`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 2500).unref();
  });
}
