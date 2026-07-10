# Cửu Long Pha Chế — Website bán đồ uống & nguyên liệu

**Repo:** https://github.com/mrbit4578/MrHai1992  
**GitHub Pages:** https://mrbit4578.github.io/MrHai1992/

Stack: React + Vite + Tailwind.

## Local

```bash
npm install
npm run dev
# http://localhost:5173
```

```bash
npm run build
npm start
# http://localhost:3000  +  /health
```

## Deploy Render (đọc kỹ)

Chi tiết: **[RENDER-FIX.md](./RENDER-FIX.md)**

### Quan trọng về lỗi `exit 127`

Lỗi này đến từ **Start Command / runtime trên Web Service**, không phải do thiếu file trong git.
**Cách chắc chắn:** tạo **Static Site mới** (Publish = `dist`), đừng Deploy lại Web Service cũ nếu Start Command vẫn sai.

| Static Site | Web Service |
|-------------|-------------|
| Build: `npm install && npm run build` | Build: `npm install && npm run build` |
| Publish: `dist` | Start: **`node server.cjs`** |
| NODE_VERSION=20 | Environment=**Node**, NODE_VERSION=20 |

## Scripts

| Script | Việc |
|--------|------|
| `npm run dev` | Vite dev |
| `npm run build` | Vite build (fallback prebuilt `dist/`) |
| `npm start` | `node server.cjs` production server |
