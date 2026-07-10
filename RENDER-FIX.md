# Render deploy fix (exit 127)

`Exited with status 127` = **command not found**.  
Với site Vite/React, **đúng sản phẩm trên Render là Static Site**, không phải Web Service chạy `vite`/`npm start` sai runtime.

## Cách A — KHUYẾN NGHỊ: Static Site (hết lỗi 127)

Service Web cũ (`srv-d98ih0...`) đang là **Web Service** → luôn cần Start Command.  
Hãy **tạo service mới**:

1. Dashboard → **New +** → **Static Site**
2. Connect repo: `mrbit4578/MrHai1992`, branch `main`
3. Settings:

| Field | Value |
|-------|--------|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Node version / `NODE_VERSION` | `20` |

4. Create Static Site → đợi deploy xanh.
5. (Tuỳ chọn) Xóa / suspend Web Service cũ để tránh nhầm.

Không có Start Command → **không còn exit 127 lúc “running your code”**.

## Cách B — Giữ Web Service cũ (nếu bắt buộc)

Vào **Settings** của `srv-d98ih0...` và set **chính xác**:

| Field | Value |
|-------|--------|
| Runtime / Environment | **Node** (không phải Python/Docker trừ khi bạn chủ động dùng Dockerfile) |
| Build Command | `npm install && npm run build` |
| Start Command | `node server.mjs` |
| `NODE_VERSION` | `20` |
| Root Directory | *(để trống)* |

Rồi: **Manual Deploy → Clear build cache & deploy**.

Health check: `/health`

## Không dùng

- `vite` / `npm run dev` / `npm run preview` làm Start Command  
- Runtime Python  
- Start Command trống trên Web Service  

## Verify local

```bash
npm install
npm run build
node server.mjs
# http://localhost:3000  and  /health
```
