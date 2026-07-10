/* Production static server — CommonJS (no shebang: avoids /usr/bin/env 127). */
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const dist = path.join(__dirname, "dist");
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8"
};

function send(res, code, body, type) {
  const buf = Buffer.from(String(body));
  res.writeHead(code, {
    "content-type": type || "text/plain; charset=utf-8",
    "content-length": buf.length
  });
  res.end(buf);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "content-type": type,
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=86400"
  });
  fs.createReadStream(filePath)
    .on("error", () => {
      if (!res.headersSent) send(res, 500, "read error");
      else res.destroy();
    })
    .pipe(res);
}

const helpHtml = `<!doctype html><html lang="vi"><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/><title>MrHai1992</title></head>
<body style="font-family:system-ui,sans-serif;max-width:40rem;margin:2rem auto;padding:0 1rem;line-height:1.5">
<h1>MrHai1992 server is up</h1>
<p>Node ${process.version} · ${host}:${port}</p>
<p><code>dist/</code> missing — upload/build dist or use Static Site publish dir.</p>
</body></html>`;

const server = http.createServer((req, res) => {
  try {
    const url = req.url || "/";
    if (url === "/health" || url.startsWith("/health?")) {
      return send(res, 200, "ok");
    }
    if (!fs.existsSync(dist)) {
      return send(res, 200, helpHtml, "text/html; charset=utf-8");
    }

    let rel = decodeURIComponent(url.split("?")[0].split("#")[0] || "/");
    if (rel === "/") rel = "/index.html";
    rel = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
    let filePath = path.join(dist, rel);
    if (!filePath.startsWith(dist)) return send(res, 400, "bad path");

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      return sendFile(res, filePath);
    }
    const indexPath = path.join(dist, "index.html");
    if (fs.existsSync(indexPath)) return sendFile(res, indexPath);
    return send(res, 404, "not found");
  } catch (err) {
    console.error(err);
    return send(res, 500, "error");
  }
});

server.listen(port, host, () => {
  console.log(`[server.cjs] http://${host}:${port} node=${process.version}`);
  console.log(`[server.cjs] dist=${dist} exists=${fs.existsSync(dist)}`);
});

function shutdown(sig) {
  console.log(`[server.cjs] ${sig}`);
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 2000).unref();
}
process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
