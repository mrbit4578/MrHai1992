# Cửu Long Pha Chế

Website bán đồ uống & nguyên liệu (React + Vite + Tailwind).

- **GitHub:** https://github.com/mrbit4578/MrHai1992  
- **Pages (live):** https://mrbit4578.github.io/MrHai1992/  
- **Render:** xem [RENDER-FIX.md](./RENDER-FIX.md)

## Local

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm start        # node server.cjs → http://localhost:3000
```

## Render (tóm tắt)

Site tĩnh đã build sẵn trong `dist/`.

**Đúng:** New → **Static Site**  
- Build: `echo prebuilt-dist`  
- Publish: `dist`

**Sai:** Deploy lại Web Service với Start Command `vite` / trống → `exit 127`.

Nếu giữ Web Service: Start Command **bắt buộc** = `node server.cjs` (Language = Node).
