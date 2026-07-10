# Cửu Long Pha Chế — Website bán đồ uống & nguyên liệu

**Branding:** Cửu Long Mini Mart 24H × Mr. Hải Pha Chế  
**Repo:** https://github.com/mrbit4578/MrHai1992  
**Website bán hàng (live):** https://mrbit4578.github.io/MrHai1992/

Website bán hàng tĩnh (React + Vite + Tailwind): menu đồ uống, nguyên liệu, giỏ hàng, form đặt hàng, video hướng dẫn.

## Tính năng

- 2 danh mục: **Đồ uống pha chế** / **Nguyên liệu pha chế**
- Giỏ hàng, tăng/giảm SL, tính tiền realtime
- Modal đặt hàng (tên, SĐT, địa chỉ)
- Video hướng dẫn pha chế
- Responsive, tối ưu bán lẻ / take-away

## Chạy local

```bash
npm install
npm run dev
# http://localhost:5173
```

Build production:

```bash
npm run build
npm run preview
```

## Deploy Render (Web Service)

Lỗi `Exited with status 127` = **command not found** (thường `vite` / `serve` không có trong PATH).

Repo đã fix cứng:

| Field | Value **bắt buộc** trên dashboard |
|-------|-----------------------------------|
| Runtime | **Node** |
| Build Command | `npm install --include=dev && npm run build` |
| Start Command | `node scripts/static-server.mjs` |
| Node version | **20** |

`start` dùng static server **thuần Node** (`scripts/static-server.mjs`), không gọi `vite`/`serve` lúc runtime.

**Quan trọng:** trong Render → Settings, ghi đè Start Command đúng như trên (không để `vite`, `npm run dev`, hay để trống).

Sau khi push, bấm **Manual Deploy → Clear build cache & deploy**.

Health: `https://<service>.onrender.com/health`

> Repo **Trade-2026** (coin trade agent) là project khác.  
> Repo này **MrHai1992** là website Cửu Long Pha Chế (Vite/React).

## Deploy GitHub Pages (tự động)

Mỗi lần push `main` hoặc `master`, workflow `.github/workflows/pages.yml` sẽ:

1. `npm ci` + `npm run build` (base path `/MrHai1992/`)
2. Deploy artifact lên GitHub Pages

**URL live:** https://mrbit4578.github.io/MrHai1992/

> Lần đầu: Settings → Pages → Source = **GitHub Actions** (workflow tự bật khi deploy thành công).

## Lộ trình nền tảng web (sau GitHub)

| Giai đoạn | Nền tảng | Ghi chú |
|-----------|----------|---------|
| Ngắn hạn | **GitHub Pages** | Free, HTTPS, CI deploy (đang dùng) |
| Mở rộng | Netlify / Vercel / Cloudflare Pages | Form order, domain riêng, CDN |
| Bán hàng đầy đủ | Shopify / Haravan / Sapo | Thanh toán, kho, vận chuyển |

Static export (`dist/`) sẵn sàng kéo sang Netlify/Vercel/Cloudflare chỉ bằng kéo folder hoặc `git connect`.

## Cấu trúc

```
src/App.tsx              # UI + logic bán hàng
public/assets/
  ├── drinks/            # Ảnh đồ uống
  ├── ingredients/       # Ảnh nguyên liệu
  └── videos/            # Video hướng dẫn
.github/workflows/pages.yml
```

## Git

```bash
git add .
git commit -m "update website bán hàng"
git push origin main
```
