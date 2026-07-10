# Hết lỗi Deploy / exit 127 trên Render

## Vì sao fail mãi

Service dạng URL:

`https://dashboard.render.com/web/srv-XXXX`

là **Web Service**. Nó **luôn** chạy **Start Command**.

`exit 127` = lệnh start **không tồn tại** trong runtime  
(ví dụ Start = `vite` / `yarn` / sai Language).

**Push code không sửa ô Start Command** đã lưu trên dashboard.

Repo local/CI đã build OK. Lỗi nằm ở **cấu hình service**.

---

## Cách chắc chắn 100% (làm đúng 1 lần)

### Bước 1 — Tạo Static Site MỚI

1. Mở https://dashboard.render.com  
2. Bấm **New +**  
3. Chọn **Static Site** ← không chọn Web Service  
4. Connect repo **`mrbit4578/MrHai1992`**, branch **`main`**  
5. Điền **chính xác**:

| Field | Value |
|-------|--------|
| Name | `mrhai1992` (tên mới, khác service cũ) |
| Branch | `main` |
| **Build Command** | `echo prebuilt-dist` |
| **Publish Directory** | `dist` |

6. Environment Variables (optional): `NODE_VERSION` = `20`  
7. **Create Static Site**  
8. Vào Web Service cũ `srv-d98ih0...` → **Settings → Suspend Service** (hoặc Delete)

`dist/` đã commit sẵn → **không cần npm/vite trên Render**.

### Bước 2 — (Blueprint, tùy chọn)

https://dashboard.render.com/select-repo?type=static  

hoặc **New → Blueprint** trỏ repo này (`render.yaml`).

---

## Nếu vẫn muốn Web Service cũ

**Settings** của `srv-d98ih0...`:

| Field | Value |
|-------|--------|
| Language | **Node** |
| Build Command | `echo prebuilt-dist` |
| **Start Command** | `node server.cjs` |
| Health Check Path | `/health` |

Hoặc:

| Field | Value |
|-------|--------|
| Language | **Docker** |
| Dockerfile Path | `./Dockerfile` |
| Docker Command | *(để trống)* |

Rồi **Clear build cache & deploy**.

---

## Backup không cần Render (đã live)

https://mrbit4578.github.io/MrHai1992/

---

## Checklist khi vẫn đỏ

- [ ] Có đang Deploy **Web** service cũ không? → đổi sang Static Site  
- [ ] Start Command có phải đúng `node server.cjs` không?  
- [ ] Language có phải **Node** (hoặc Docker) không — không phải Python  
- [ ] Root Directory có để **trống** không  
