/**
 * Zero-dependency production static server (Node built-ins only).
 * Works on Render Web Service: binds 0.0.0.0 and process.env.PORT.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");
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
  ".ttf": "font/ttf",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml"
};

if (!fs.existsSync(dist)) {
  console.error(`[static-server] missing dist/ at ${dist}. Did build run?`);
  process.exit(1);
}

function safeJoin(base, requestPath) {
  const decoded = decodeURIComponent((requestPath || "/").split("?")[0]);
  const cleaned = path.normalize(decoded).replace(/^(\.\.(\/|\\|$))+/, "");
  const resolved = path.join(base, cleaned);
  if (!resolved.startsWith(base)) {
    return null;
  }
  return resolved;
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, headers);
  res.end(body);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const stream = fs.createReadStream(filePath);
  res.writeHead(200, {
    "content-type": type,
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=31536000, immutable"
  });
  stream.pipe(res);
  stream.on("error", () => {
    if (!res.headersSent) {
      send(res, 500, "Read error");
    } else {
      res.destroy();
    }
  });
}

const server = http.createServer((req, res) => {
  try {
    const urlPath = req.url || "/";
    if (urlPath === "/health") {
      return send(res, 200, "ok", { "content-type": "text/plain; charset=utf-8" });
    }

    let filePath = safeJoin(dist, urlPath === "/" ? "/index.html" : urlPath);
    if (!filePath) {
      return send(res, 400, "Bad path");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath);
    }

    // SPA fallback
    const indexPath = path.join(dist, "index.html");
    if (fs.existsSync(indexPath)) {
      return sendFile(res, indexPath);
    }

    return send(res, 404, "Not found");
  } catch (error) {
    console.error(error);
    return send(res, 500, "Server error");
  }
});

server.listen(port, host, () => {
  console.log(`[static-server] listening on http://${host}:${port}`);
  console.log(`[static-server] serving ${dist}`);
});

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, () => {
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 3000).unref();
  });
}
