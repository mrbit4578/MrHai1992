# Render exit 127 — đã xử lý trong code + checklist dashboard

## Code (commit mới)

Trên Render (`RENDER=true`), sau `npm install` / `npm run build` repo sẽ cài **shim**:

- `vite` → `node server.cjs`
- `serve` → `node server.cjs`
- `yarn start` → `node server.cjs`
- `npm start` / `npm run preview` → `node server.cjs`

Đồng thời **bỏ shebang** `#!/usr/bin/env node` trên `server.cjs` (tránh lỗi 127 khi chạy file trực tiếp).

Build Command **nên** là:

```bash
npm install && npm run build
```

(để có `node_modules/.bin` + shim)

Start Command **nên** là:

```bash
node server.cjs
```

Nếu Start Command cũ là `vite` / `vite preview ...` và PATH có `node_modules/.bin` sau install → shim sẽ bắt.

---

## Vẫn bắt buộc kiểm tra Settings (Web Service cũ)

Vào `https://dashboard.render.com/web/srv-d98ih0etrd3s73eo8uv0` → **Settings**:

| Field | Giá trị khuyến nghị |
|-------|---------------------|
| Language | **Node** |
| Build Command | `npm install && npm run build` |
| Start Command | `node server.cjs` |
| NODE_VERSION | `20` |
| Health Check Path | `/health` |

**Clear build cache & deploy.**

---

## Cách chắc chắn nhất: Static Site

**New + → Static Site** (không dùng Web Service):

| Field | Value |
|-------|--------|
| Build Command | `test -f dist/index.html && echo ok` |
| Publish Directory | `dist` |

`dist/` đã có trên git.

---

## Live không cần Render

https://mrbit4578.github.io/MrHai1992/
