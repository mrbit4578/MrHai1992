/* eslint-disable no-console */
/**
 * CommonJS production server — maximum Render compatibility.
 * Start command (copy exactly):
 *   node server.cjs
 */
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
  const data = Buffer.from(body);
  res.writeHead(code, {
    "content-type": type || "text/plain; charset=utf-8",
    "content-length": data.length
  });
  res.end(data);
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  res.writeHead(200, {
    "content-type": type,
    "cache-control": ext === ".html" ? "no-cache" : "public, max-age=86400"
  });
  fs.createReadStream(filePath).on("error", () => {
    if (!res.headersSent) send(res, 500, "read error");
    else res.destroy();
  }).pipe(res);
}

const fallbackHtml = `<!doctype html><html><head><meta charset="utf-8"><title>MrHai1992</title></head>
<body style="font-family:sans-serif;max-width:720px;margin:40px auto;padding:0 16px">
<h1>MrHai1992 is running</h1>
<p>Node ${process.version} · port ${port}</p>
<p><b>dist/</b> is missing on this host. Build step may have failed, or use Static Site with publish dir <code>dist</code>.</p>
<ol>
<li>Render → New → <b>Static Site</b></li>
<li>Build: <code>npm install && npm run build</code></li>
<li>Publish: <code>dist</code></li>
</ol>
<p>Or Web Service Start Command must be exactly: <code>node server.cjs</code> with Environment <b>Node</b>.</p>
</body></html>`;

const server = http.createServer((req, res) => {
  try {
    const url = req.url || "/";
    if (url === "/health" || url.startsWith("/health?")) {
      return send(res, 200, "ok");
    }

    if (!fs.existsSync(dist)) {
      return send(res, 200, fallbackHtml, "text/html; charset=utf-8");
    }

    let rel = decodeURIComponent(url.split("?")[0].split("#")[0]);
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
  } catch (e) {
    console.error(e);
    return send(res, 500, "error");
  }
});

server.listen(port, host, () => {
  console.log(`[server.cjs] node=${process.version} http://${host}:${port}`);
  console.log(`[server.cjs] dist=${dist} exists=${fs.existsSync(dist)}`);
});

process.on("SIGTERM", () => server.close(() => process.exit(0)));
process.on("SIGINT", () => server.close(() => process.exit(0)));
