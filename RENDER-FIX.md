# Hết lỗi Render exit 127 (chắc chắn)

## Chẩn đoán

Thông báo:

> Exited with status 127 while **running your code**

chỉ xảy ra với **Web Service** (có process start).  
**Static Site không có bước “running your code”** → không thể ra lỗi này.

Service hiện tại `srv-d98ih0etrd3s73eo8uv0` là **Web Service**.  
Cứ bấm Deploy lại commit mới **mà không đổi loại service / Start Command** thì **vẫn 127**.

`127` = shell không tìm thấy lệnh (thường `node` hoặc `vite` không có trong PATH / runtime sai).

---

## Cách duy nhất được khuyến nghị: Static Site MỚI

1. Mở https://dashboard.render.com  
2. **New +** → **Static Site**  ← không chọn Web Service  
3. Connect GitHub repo **`mrbit4578/MrHai1992`**, branch **`main`**  
4. Điền:

| Field | Value |
|-------|--------|
| Name | `mrhai1992` (tên mới) |
| Branch | `main` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

5. Environment → Add: `NODE_VERSION` = `20`  
6. **Create Static Site**  
7. Vào service Web cũ `srv-d98ih0...` → Settings → **Suspend** hoặc **Delete**

### Không làm

- Không “Manual Deploy” lại service Web cũ rồi mong hết 127  
- Không dùng Start Command `vite` / `npm run dev` / `npm run preview`

---

## Nếu nhất định giữ Web Service cũ

Settings của `srv-d98ih0...` phải **copy đúng từng ký tự**:

| Field | Value |
|-------|--------|
| **Language / Environment** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `node server.cjs` |
| **NODE_VERSION** | `20` |
| Root Directory | *(trống)* |

Sau đó: **Manual Deploy → Clear build cache & deploy**.

Health: `https://<host>/health` → body `ok`

Hoặc đổi Environment sang **Docker**, Docker Command **để trống** (dùng `CMD` trong Dockerfile).

---

## Site backup (đã có sẵn)

GitHub Pages (không phụ thuộc Render):

https://mrbit4578.github.io/MrHai1992/

---

## Kiểm tra local

```bash
npm install
npm run build
node server.cjs
# open http://localhost:3000
# open http://localhost:3000/health
```
