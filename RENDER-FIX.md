# Render exit 127 — fix dứt điểm

## 1) Chẩn đoán 1 câu

`Exited with status 127 while running your code` = **Web Service** đang chạy Start Command mà **không tìm thấy lệnh** (`node`, `vite`, `yarn`, …).

Service cũ dạng:

`https://dashboard.render.com/web/srv-...`

là **Web Service**, không phải Static Site.

Push code **không đổi** Start Command đã lưu trên dashboard.

---

## 2) Cách A — Static Site (khuyến nghị, hết 127)

1. **New + → Static Site** (đừng bấm Deploy service Web cũ)
2. Repo `mrbit4578/MrHai1992`, branch `main`
3. 

| Field | Value |
|-------|--------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| NODE_VERSION | `20` |

4. Create → đợi xanh
5. Suspend/Delete Web Service cũ

---

## 3) Cách B — Sửa Web Service cũ (nếu bắt buộc)

Vào **Settings** service `srv-d98ih0...` và **ghi đè**:

| Field | Value |
|-------|--------|
| Environment | **Node** (hoặc **Docker** + Dockerfile) |
| Build Command | `npm install && npm run build` |
| **Start Command** | `node server.cjs` |
| NODE_VERSION | `20` |
| Root Directory | *(trống)* |

Sau đó: **Manual Deploy → Clear build cache & deploy**

### Nếu chọn Docker

| Field | Value |
|-------|--------|
| Environment | Docker |
| Dockerfile Path | `Dockerfile` |
| Docker Command | *(để trống — dùng CMD)* |

---

## 4) Repo đã làm gì để ổn định

- `server.cjs` — server CommonJS, luôn listen
- `scripts/build.cjs` — build vite; nếu fail mà có `dist/` prebuilt thì **vẫn pass**
- `postinstall` — tự build sau `npm install`
- `dist/` **được commit** (fallback)
- `Procfile` / `package.json start` → `node server.cjs`
- Đã xóa `nixpacks.toml` (cấu hình nix sai dễ gây 127)

---

## 5) Backup không cần Render

https://mrbit4578.github.io/MrHai1992/
