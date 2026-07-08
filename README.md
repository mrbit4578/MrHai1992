# Cửu Long Pha Chế - Website Bán Đồ Uống & Nguyên Liệu

Website chuyên nghiệp bán **Đồ uống pha chế** và **Nguyên liệu pha chế** cao cấp, dựa trên dữ liệu trend 2026 từ TP.HCM.

**Branding:** Cửu Long Mini Mart 24H × Mr. Hải Pha Chế

## ✨ Tính năng

- 2 danh mục rõ ràng tách biệt:
  - **Đồ Uống Pha Chế** (Trà Sữa Nướng, Sinh Tố Collagen, Sữa Tươi Đường Đen...)
  - **Nguyên Liệu Pha Chế** (Trân châu, Syrup, Bột kem béo, Matcha, Trà...)
- Thêm giỏ hàng mượt mà
- Tăng/giảm số lượng, tính thành tiền realtime
- Modal đặt hàng (tên, SĐT, địa chỉ)
- Nút "Xem video hướng dẫn" cho đồ uống
- Toàn bộ hình ảnh & dữ liệu từ dự án trước (Grok Imagine Agent)
- Responsive, hiện đại, Gen Z vibe

## 🚀 Chạy dự án

```bash
npm install
npm run dev
```

## 📦 Upload tự động lên GitHub

Có sẵn **agent** để đẩy toàn bộ folder dự án:

```bash
python scripts/upload-agent.py
```

Hoặc dùng GitHub MCP / thủ công:

```bash
git add .
git commit -m "update website"
git push
```

## Cấu trúc dự án (tách biệt 2 folder khái niệm)

```
src/App.tsx          # Toàn bộ logic + UI
public/assets/
  ├── drinks/        # Ảnh đồ uống đẹp (từ Tool tạo hình ảnh Grok)
  └── ingredients/   # Ảnh nguyên liệu (từ du-an-nguyen-lieu)
scripts/
  └── upload-agent.py   # Agent tự động upload
```

## GitHub

Repo: https://github.com/mrbit4578/MrHai1992

Dự án được build bằng Grok (xAI) - mô hình mạnh nhất.

---

**Lưu ý:** Video thực tế nằm trong thư mục gốc Tool tạo hình ảnh Grok/outputs/videos. Khi cần có thể thêm vào public sau.
