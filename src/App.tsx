import { useState, useEffect } from 'react'
import { ShoppingCart, X, Play, Package, Coffee } from 'lucide-react'
import { Toaster, toast } from 'sonner'

/** Resolve public/ assets for both local "/" and GitHub Pages "/MrHai1992/". */
const asset = (path: string) =>
  `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

// Types
interface Product {
  id: number
  name: string
  price: number
  image: string
  category: 'drink' | 'ingredient'
  description: string
  unit?: string
  badge?: string
  video?: string
  // For ingredients
  supplier?: string
  contact?: string
  address?: string
  certificates?: string[]
  origin?: string
}

interface CartItem {
  product: Product
  quantity: number
}

// ==================== 20+ LOẠI THỨC UỐNG PHA CHẾ (Đa dạng, Trend 2026) ====================
const drinks: Product[] = [
  { id: 101, name: "Trà Sữa Nướng", price: 38000, image: asset("assets/drinks/tra-sua-nuong.jpg"), category: "drink", description: "Trà đen nướng đường nâu khói thơm + sữa tươi + trân châu hoàng kim. Signature phá cách.", badge: "Hot", video: asset("assets/videos/tra-sua-nuong.mp4") },
  { id: 102, name: "Sinh Tố Collagen Đặc Quánh", price: 42000, image: asset("assets/drinks/sinh-to.jpg"), category: "drink", description: "Xoài, chuối, việt quất đông lạnh xay đặc sánh + bột collagen. Healthy trend cho giới trẻ.", badge: "Healthy", video: asset("assets/videos/sinh-to-collagen.mp4") },
  { id: 103, name: "Sữa Tươi Trân Châu Đường Đen", price: 36000, image: asset("assets/drinks/sua-tuoi.jpg"), category: "drink", description: "Sữa tươi nguyên chất + syrup đường đen caramel + trân châu dai. Bestseller mọi lứa tuổi.", badge: "Bestseller", video: asset("assets/videos/sua-tuoi-duong-den.mp4") },
  { id: 104, name: "Trà Đào Cam Sả", price: 35000, image: asset("assets/drinks/tra-sua-action.jpg"), category: "drink", description: "Trà đen + đào ngâm + cam tươi + sả đập. Giải nhiệt quốc dân." },
  { id: 105, name: "Cà Phê Cốt Dừa", price: 39000, image: asset("assets/drinks/ca-phe-1.jpg"), category: "drink", description: "Cà phê Robusta đậm + cốt dừa béo ngậy. Vị Việt Nam hiện đại.", video: asset("assets/videos/tra-sua-nuong-final.mp4") },
  { id: 106, name: "Trà Sữa Phô Mai Dâu", price: 41000, image: asset("assets/drinks/tra-sua-1.jpg"), category: "drink", description: "Trà sữa + kem phô mai mặn + sốt dâu tươi. Trend phô mai nhiều màu.", video: asset("assets/videos/sinh-to-extra.mp4") },
  { id: 107, name: "Trà Sữa Phô Mai Khoai Môn", price: 40000, image: asset("assets/drinks/tra-sua-2.jpg"), category: "drink", description: "Trà sữa tím + phô mai + khoai môn nghiền. Màu sắc bắt mắt, vị béo." },
  { id: 108, name: "Sinh Tố Bơ Matcha", price: 43000, image: asset("assets/drinks/sinh-to-1.jpg"), category: "drink", description: "Bơ sáp + matcha Nhật + sữa hạt. Siêu thực phẩm healthy.", video: asset("assets/videos/tra-sua-extra.mp4") },
  { id: 109, name: "Nước Ép Cam Gừng", price: 35000, image: asset("assets/drinks/tra-sua-3.jpg"), category: "drink", description: "Cam tươi + gừng + mật ong. Tăng đề kháng, giải cảm." },
  { id: 110, name: "Trà Ô Long Trân Châu", price: 37000, image: asset("assets/drinks/tra-sua-nuong.jpg"), category: "drink", description: "Trà ô long Đài Loan + trân châu hoàng kim. Vị trà đậm, ít ngọt." },
  { id: 111, name: "Soda Chanh Dây", price: 36000, image: asset("assets/drinks/ca-phe-1.jpg"), category: "drink", description: "Chanh dây tươi + soda + đường mía. Sảng khoái, ít calo." },
  { id: 112, name: "Latte Cà Phê Đá", price: 38000, image: asset("assets/drinks/tra-sua-1.jpg"), category: "drink", description: "Espresso + sữa tươi + đá. Cân bằng, latte art đẹp." },
  { id: 113, name: "Trà Hoa Quả Nhiệt Đới", price: 39000, image: asset("assets/drinks/sinh-to-2.jpg"), category: "drink", description: "Trà đen + dứa + dưa hấu + thanh long. Trái cây tươi 100%." },
  { id: 114, name: "Sinh Tố Dâu Việt Quất", price: 41000, image: asset("assets/drinks/sinh-to.jpg"), category: "drink", description: "Dâu + việt quất + sữa chua Hy Lạp. Giàu antioxidant." },
  { id: 115, name: "Cà Phê Latte Bơ", price: 40000, image: asset("assets/drinks/ca-phe-1.jpg"), category: "drink", description: "Cà phê + bơ sáp + sữa đặc. Vị béo lạ, trend mới." },
  { id: 116, name: "Trà Sữa Matcha", price: 37000, image: asset("assets/drinks/tra-sua-2.jpg"), category: "drink", description: "Matcha cao cấp + sữa tươi + trân châu. Màu xanh đẹp mắt." },
  { id: 117, name: "Nước Ép Dứa Bạc Hà", price: 35000, image: asset("assets/drinks/tra-sua-3.jpg"), category: "drink", description: "Dứa tươi + bạc hà + chanh. Giải nhiệt cực mạnh." },
  { id: 118, name: "Trà Đen Trân Châu Đài Loan", price: 38000, image: asset("assets/drinks/tra-sua-nuong.jpg"), category: "drink", description: "Trà đen chuẩn Đài + trân châu lớn + đường nâu." },
  { id: 119, name: "Sinh Tố Xoài Dừa", price: 39000, image: asset("assets/drinks/sinh-to-1.jpg"), category: "drink", description: "Xoài cát + nước cốt dừa + đá xay. Vị nhiệt đới." },
  { id: 120, name: "Trà Sữa Caramel Trân Châu", price: 41000, image: asset("assets/drinks/sua-tuoi.jpg"), category: "drink", description: "Trà + caramel + trân châu + kem tươi. Ngọt béo cân bằng." },
  { id: 121, name: "Phô Mai Trà Sữa Than Tre", price: 42000, image: asset("assets/drinks/tra-sua-1.jpg"), category: "drink", description: "Trà than tre + phô mai mặn. Trend màu đen huyền bí." },
  { id: 122, name: "Cà Phê Muối Biển", price: 36000, image: asset("assets/drinks/ca-phe-1.jpg"), category: "drink", description: "Cà phê + muối biển + sữa đặc. Vị mặn ngọt độc đáo." },
]

// ==================== NGUYÊN LIỆU PHA CHẾ - Thông tin đầy đủ chuyên nghiệp ====================
const ingredients: Product[] = [
  {
    id: 201, name: "Trân Châu Hoàng Kim", price: 85000, image: asset("assets/ingredients/tran-chau.jpg"), category: "ingredient",
    description: "Trân châu tapioca cao cấp, dai giòn, không bị nát khi ngâm lâu.",
    unit: "1kg", supplier: "Gia Thịnh Phát", contact: "0901 234 567", address: "Số 45 Đường 3/2, Quận 10, TP.HCM",
    certificates: ["VSATTP", "HACCP", "ISO 22000"], origin: "Đài Loan (nhập khẩu)"
  },
  {
    id: 202, name: "Syrup Đường Nâu Caramel", price: 72000, image: asset("assets/ingredients/syrup.jpg"), category: "ingredient",
    description: "Syrup đường nâu đậm đặc chuyên dùng cho Trà Sữa Nướng & Brown Sugar.",
    unit: "1.2L", supplier: "Golden Farm", contact: "028 3865 4321", address: "Lô A2-3 KCN Tân Tạo, Bình Tân, TP.HCM",
    certificates: ["VSATTP", "FSSC 22000", "Halal"], origin: "Việt Nam"
  },
  {
    id: 203, name: "Bột Kem Béo Frima", price: 145000, image: asset("assets/ingredients/bot-kem-beo.jpg"), category: "ingredient",
    description: "Bột kem béo số 1 thị trường, tan nhanh, béo ngậy không át vị trà.",
    unit: "1kg", supplier: "Dongsuh (Hàn Quốc)", contact: "1900 1234", address: "Cảng Cát Lái, TP.HCM (nhập khẩu chính hãng)",
    certificates: ["ISO 22000", "HACCP", "FDA"], origin: "Hàn Quốc"
  },
  {
    id: 204, name: "Matcha Nhật Bản Uji", price: 285000, image: asset("assets/ingredients/matcha.jpg"), category: "ingredient",
    description: "Matcha cao cấp vùng Uji, vị umami mạnh, màu xanh đẹp tự nhiên.",
    unit: "200g", supplier: "Lộc Phát Import", contact: "0912 345 678", address: "Số 12 Nguyễn Trãi, Quận 1, TP.HCM",
    certificates: ["JAS", "VSATTP", "Organic"], origin: "Nhật Bản"
  },
  {
    id: 205, name: "Trà Đen Lộc Phát 500g", price: 84000, image: asset("assets/ingredients/hong-tra.jpg"), category: "ingredient",
    description: "Trà đen thượng hạng, chuyên dùng cho trà sữa. Mùi thơm tự nhiên.",
    unit: "500g", supplier: "Lộc Phát", contact: "1800 5566", address: "Khu công nghiệp Biên Hòa, Đồng Nai",
    certificates: ["VSATTP", "ISO 9001", "HACCP"], origin: "Việt Nam (Bảo Lộc)"
  },
  {
    id: 206, name: "Trái Cây Ngâm Mix", price: 95000, image: asset("assets/ingredients/trai-cay.jpg"), category: "ingredient",
    description: "Đào, dâu, việt quất ngâm đường. Dùng cho trà trái cây & sinh tố.",
    unit: "Hộp 1.5kg", supplier: "Rhodes (Nhập)", contact: "028 3899 1122", address: "Cảng Cát Lái, Quận 2, TP.HCM",
    certificates: ["VSATTP", "HACCP", "BRC"], origin: "Thái Lan / Việt Nam"
  },
  {
    id: 207, name: "Bột Kem Béo Kievit", price: 68000, image: asset("assets/ingredients/bot-kem-beo.jpg"), category: "ingredient",
    description: "Bột kem béo giá tốt, phù hợp quán take-away bình dân.",
    unit: "1kg", supplier: "FrieslandCampina", contact: "1900 6789", address: "Bình Dương (nhập Indonesia)",
    certificates: ["ISO 22000", "HACCP"], origin: "Indonesia"
  },
  {
    id: 208, name: "Trà Ô Long Kim Tuyên", price: 165000, image: asset("assets/ingredients/hong-tra.jpg"), category: "ingredient",
    description: "Trà ô long cao cấp, vị hoa quả nhẹ. Dùng cho quán cao cấp.",
    unit: "500g", supplier: "Lộc Phát", contact: "1800 5566", address: "Khu công nghiệp Biên Hòa, Đồng Nai",
    certificates: ["VSATTP", "ISO 22000"], origin: "Việt Nam (Lâm Đồng)"
  },
  {
    id: 209, name: "Trân Châu Đen", price: 78000, image: asset("assets/ingredients/tran-chau.jpg"), category: "ingredient",
    description: "Trân châu đen chuẩn vị Đài Loan, dai vừa phải.",
    unit: "1kg", supplier: "Gia Thịnh Phát", contact: "0901 234 567", address: "Quận 10, TP.HCM",
    certificates: ["VSATTP", "HACCP"], origin: "Đài Loan"
  },
  {
    id: 210, name: "Sữa Đặc La Rosee", price: 52000, image: asset("assets/ingredients/syrup.jpg"), category: "ingredient",
    description: "Sữa đặc có đường cao cấp cho cà phê và trà sữa.",
    unit: "397g", supplier: "La Rosee", contact: "028 3556 7788", address: "Bình Dương",
    certificates: ["VSATTP", "ISO 9001"], origin: "Việt Nam"
  },
]

const allProducts = [...drinks, ...ingredients]

function App() {
  const [activeTab, setActiveTab] = useState<'drink' | 'ingredient'>('drink')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [orderForm, setOrderForm] = useState({ name: '', phone: '', address: '' })
  const [showVideoModal, setShowVideoModal] = useState<Product | null>(null)

  // Load cart from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cart')
    if (saved) setCart(JSON.parse(saved))
  }, [])

  // Save cart
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const filteredProducts = allProducts.filter(p => p.category === activeTab)

  // Separate modals
  const [selectedIngredient, setSelectedIngredient] = useState<Product | null>(null)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.findIndex(item => item.product.id === product.id)
      if (existing >= 0) {
        const updated = [...prev]
        updated[existing].quantity += 1
        return updated
      } else {
        return [...prev, { product, quantity: 1 }]
      }
    })
    toast.success(`Đã thêm ${product.name}`, {
      description: `${product.price.toLocaleString('vi-VN')}đ`,
      action: { label: "Xem giỏ", onClick: () => setIsCartOpen(true) }
    })
  }

  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return
    setCart(prev =>
      prev.map(item =>
        item.product.id === id ? { ...item, quantity: newQty } : item
      )
    )
  }

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.product.id !== id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const openCheckout = () => {
    if (cart.length === 0) return
    setIsCartOpen(false)
    setIsCheckoutOpen(true)
  }

  const submitOrder = () => {
    if (!orderForm.name || !orderForm.phone) {
      toast.error("Vui lòng điền họ tên và số điện thoại")
      return
    }

    toast.success("Đặt hàng thành công!", {
      description: `Tổng: ${cartTotal.toLocaleString('vi-VN')}đ • ${orderForm.name}`,
    })

    // Simulate order
    console.log("ORDER PLACED:", { ...orderForm, items: cart, total: cartTotal })

    setCart([])
    setIsCheckoutOpen(false)
    setOrderForm({ name: '', phone: '', address: '' })
    setIsCartOpen(false)
  }

  const openVideo = (product: Product) => {
    setShowVideoModal(product)
  }

  return (
    <div className="min-h-screen bg-[#fffdf8]">
      <Toaster position="top-center" richColors closeButton />

      {/* Navbar */}
      <nav className="nav">
        <div className="container flex items-center justify-between h-16">
          <div className="logo">
            <div className="w-9 h-9 bg-[#0c7a4d] rounded-xl flex items-center justify-center text-white font-black text-xl">CL</div>
            <div>
              <span className="font-black tracking-tighter">CỬU LONG</span>
              <span className="text-[#f59e0b] font-bold"> PHA CHẾ</span>
              <div className="text-[10px] text-[#5f6f68] -mt-1">24H • TREND 2026</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setActiveTab('drink')} 
              className={`tab flex items-center gap-1.5 ${activeTab === 'drink' ? 'active' : 'hover:bg-[#e7f5ee] text-[#22302a]'}`}
            >
              <Coffee size={16} /> Đồ Uống Pha Chế
            </button>
            <button 
              onClick={() => setActiveTab('ingredient')} 
              className={`tab flex items-center gap-1.5 ${activeTab === 'ingredient' ? 'active' : 'hover:bg-[#e7f5ee] text-[#22302a]'}`}
            >
              <Package size={16} /> Nguyên Liệu Pha Chế
            </button>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="ml-4 flex items-center gap-2 bg-white border border-[#e5e0d5] px-4 py-2 rounded-2xl font-semibold hover:bg-[#f8f1e3] relative"
            >
              <ShoppingCart size={18} />
              <span>Giỏ hàng</span>
              {cartCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-[#f59e0b] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </div>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="hero">
        <div className="container">
          <div className="max-w-2xl">
            <div className="inline-block bg-white/20 text-white text-xs tracking-[3px] px-4 py-1 rounded-full mb-4">MR. HẢI • CỬU LONG MINI MART 24H</div>
            <h1 className="font-black leading-none tracking-[-2.5px]">
              NGUYÊN LIỆU &amp;<br />ĐỒ UỐNG PHA CHẾ<br /> <span className="text-[#ffd27a]">TREND 2026</span>
            </h1>
            <p className="mt-4 text-lg text-white/90 max-w-md">
              22+ loại thức uống trend • 27+ nguyên liệu chất lượng cao. 
              Video hướng dẫn thực tế • Cam kết VSATTP đầy đủ.
            </p>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setActiveTab('drink')} className="btn-primary px-8 py-3 text-base rounded-2xl flex items-center gap-2">
                Mua đồ uống ngay
              </button>
              <button onClick={() => setActiveTab('ingredient')} className="px-8 py-3 text-base rounded-2xl border border-white/60 hover:bg-white/10">
                Mua nguyên liệu sỉ
              </button>
            </div>
            <div className="flex gap-8 mt-8 text-sm text-white/70">
              <div>✓ 20+ nguyên liệu</div>
              <div>✓ Video hướng dẫn</div>
              <div>✓ Giá sỉ &amp; lẻ</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cam kết chuyên nghiệp & An toàn thực phẩm */}
      <div className="bg-white border-y border-[#e5e0d5] py-3">
        <div className="container flex flex-wrap justify-center gap-x-8 gap-y-1 text-xs text-[#5f6f68]">
          <span>✓ VSATTP đầy đủ</span>
          <span>✓ HACCP • ISO 22000</span>
          <span>✓ Nguồn gốc rõ ràng</span>
          <span>✓ Kiểm nghiệm định kỳ</span>
          <span>✓ Hơn 22 loại thức uống & 27+ nguyên liệu</span>
        </div>
      </div>

      {/* Tabs + Products */}
      <div className="container py-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="uppercase text-xs tracking-widest text-[#5f6f68]">Danh mục sản phẩm</div>
            <h2 className="text-3xl font-bold tracking-tight">
              {activeTab === 'drink' ? 'Đồ Uống Pha Chế Trend' : 'Nguyên Liệu Pha Chế Chất Lượng Cao'}
            </h2>
          </div>
          <div className="text-sm text-[#5f6f68]">Tất cả giá đã bao gồm VAT • Miễn phí ship từ 500k</div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map(product => (
            <div key={product.id} className="product-card group">
              <div className="product-img">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.badge && (
                  <div className="absolute top-3 left-3 px-3 py-0.5 rounded-full text-[10px] font-bold bg-[#f59e0b] text-[#3a2a00]">
                    {product.badge}
                  </div>
                )}
                <div className={`absolute top-3 right-3 px-2.5 py-px text-[10px] font-semibold rounded ${product.category === 'drink' ? 'badge-drink' : 'badge-ingredient'}`}>
                  {product.category === 'drink' ? 'ĐỒ UỐNG' : 'NGUYÊN LIỆU'}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <div className="font-semibold text-lg leading-tight mb-1">{product.name}</div>
                <div className="text-[#5f6f68] text-sm flex-1 line-clamp-2">{product.description}</div>
                {product.category === 'ingredient' && product.supplier && (
                  <div className="text-[11px] text-[#0c7a4d] mt-1">NCC: {product.supplier}</div>
                )}

                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="price">{product.price.toLocaleString('vi-VN')}</span>
                    <span className="text-xs text-[#5f6f68] ml-1">đ{product.unit ? ` / ${product.unit}` : ''}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => addToCart(product)}
                    className="btn-primary flex-1 text-sm py-2.5"
                  >
                    + Thêm vào giỏ
                  </button>
                  
                  {product.category === 'drink' && product.video && (
                    <button 
                      onClick={() => openVideo(product)}
                      className="px-3 border border-[#e5e0d5] rounded-xl hover:bg-[#f8f1e3] flex items-center gap-1 text-sm"
                      title="Xem video hướng dẫn pha chế"
                    >
                      <Play size={15} /> Video
                    </button>
                  )}
                  
                  {product.category === 'ingredient' && (
                    <button 
                      onClick={() => setSelectedIngredient(product)}
                      className="px-3 border border-[#e5e0d5] rounded-xl hover:bg-[#f8f1e3] text-sm"
                    >
                      Chi tiết
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 text-xs text-[#5f6f68]">
          Sản phẩm được chọn lọc từ báo cáo xu hướng TP.HCM 2026 • Hình ảnh &amp; video thực tế từ Cửu Long Mini Mart 24H
        </div>
      </div>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[90] bg-black/40" onClick={() => setIsCartOpen(false)} />
      )}
      <div className={`cart-drawer transition-transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-5 border-b flex items-center justify-between">
          <div className="font-bold flex items-center gap-2 text-xl">
            <ShoppingCart /> Giỏ hàng của bạn
          </div>
          <button onClick={() => setIsCartOpen(false)}><X /></button>
        </div>

        <div className="flex-1 overflow-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-12 text-[#5f6f68]">
              Giỏ hàng trống.<br />Hãy thêm đồ uống hoặc nguyên liệu!
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div key={product.id} className="cart-item">
                <img src={product.image} className="w-16 h-16 object-cover rounded-lg border" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm leading-tight">{product.name}</div>
                  <div className="text-[#c2410c] font-bold">{product.price.toLocaleString('vi-VN')}đ</div>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(product.id, quantity - 1)} className="qty-btn">-</button>
                    <span className="w-8 text-center font-mono">{quantity}</span>
                    <button onClick={() => updateQuantity(product.id, quantity + 1)} className="qty-btn">+</button>
                    <button onClick={() => removeFromCart(product.id)} className="ml-auto text-xs text-red-500 hover:underline">Xóa</button>
                  </div>
                </div>
                <div className="text-right font-bold text-sm whitespace-nowrap">
                  {(product.price * quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-5 border-t bg-[#fffdf8]">
            <div className="flex justify-between text-lg font-bold mb-4">
              <span>TỔNG CỘNG</span>
              <span className="text-[#c2410c]">{cartTotal.toLocaleString('vi-VN')}đ</span>
            </div>
            <button 
              onClick={openCheckout}
              className="w-full bg-[#0c7a4d] hover:bg-[#0a5c3b] text-white py-3.5 rounded-2xl font-bold text-lg"
            >
              ĐẶT HÀNG NGAY
            </button>
            <div className="text-[11px] text-center mt-2 text-[#5f6f68]">Miễn phí giao hàng nội thành • COD toàn quốc</div>
          </div>
        )}
      </div>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="modal" onClick={() => setIsCheckoutOpen(false)}>
          <div className="modal-content p-6" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-2xl mb-1">Xác nhận đơn hàng</h3>
            <p className="text-sm text-[#5f6f68] mb-4">Cửu Long Pha Chế sẽ liên hệ xác nhận trong 10 phút</p>

            <div className="space-y-3 mb-5">
              {cart.map(({product, quantity}) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span>{product.name} × {quantity}</span>
                  <span className="font-semibold">{(product.price * quantity).toLocaleString()}đ</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mb-5 font-bold text-lg flex justify-between">
              <span>Tổng thanh toán</span>
              <span>{cartTotal.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="space-y-3">
              <input 
                type="text" placeholder="Họ và tên *" 
                className="w-full border rounded-xl p-3" 
                value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} 
              />
              <input 
                type="tel" placeholder="Số điện thoại *" 
                className="w-full border rounded-xl p-3" 
                value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value})} 
              />
              <input 
                type="text" placeholder="Địa chỉ giao hàng" 
                className="w-full border rounded-xl p-3" 
                value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} 
              />
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setIsCheckoutOpen(false)} className="flex-1 border py-3 rounded-2xl font-semibold">Hủy</button>
              <button onClick={submitOrder} className="flex-1 btn-primary py-3 text-base">XÁC NHẬN ĐẶT HÀNG</button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal - Thực tế với <video> */}
      {showVideoModal && (
        <div className="modal" onClick={() => setShowVideoModal(null)}>
          <div className="modal-content p-6 max-w-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-xl">{showVideoModal.name} — Hướng dẫn pha chế tại Cửu Long 24H</h3>
              <button onClick={() => setShowVideoModal(null)}><X /></button>
            </div>
            
            {showVideoModal.video ? (
              <video 
                src={showVideoModal.video} 
                controls 
                autoPlay 
                className="w-full rounded-xl bg-black mb-4" 
                style={{ maxHeight: '420px' }}
              >
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            ) : (
              <div className="bg-black aspect-video rounded-xl mb-4 flex items-center justify-center text-white/70">
                Video hướng dẫn đang cập nhật
              </div>
            )}
            
            <div className="text-sm text-[#5f6f68]">
              Video được quay thực tế tại quầy Cửu Long Mini Mart 24H. 
              Sử dụng nguyên liệu chất lượng cao, tuân thủ VSATTP.
            </div>
            <button 
              onClick={() => setShowVideoModal(null)} 
              className="mt-4 w-full py-2.5 bg-[#0c7a4d] text-white rounded-xl font-semibold"
            >
              Đóng
            </button>
          </div>
        </div>
      )}

      {/* Ingredient Detail Modal - Chuyên nghiệp, đầy đủ thông tin */}
      {selectedIngredient && (
        <div className="modal" onClick={() => setSelectedIngredient(null)}>
          <div className="modal-content p-6 max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="flex gap-4">
              <img 
                src={selectedIngredient.image} 
                alt={selectedIngredient.name} 
                className="w-28 h-28 object-cover rounded-xl border"
              />
              <div className="flex-1">
                <h3 className="font-bold text-xl">{selectedIngredient.name}</h3>
                <div className="text-[#c2410c] font-bold text-lg mt-1">
                  {selectedIngredient.price.toLocaleString('vi-VN')}đ {selectedIngredient.unit && `/ ${selectedIngredient.unit}`}
                </div>
                <div className="text-xs text-[#5f6f68] mt-1">Nguồn: {selectedIngredient.origin}</div>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-sm text-[#22302a]">{selectedIngredient.description}</p>

              <div className="mt-4 grid grid-cols-1 gap-3 text-sm">
                <div>
                  <span className="font-semibold text-[#0c7a4d]">Nhà cung cấp:</span><br />
                  <span>{selectedIngredient.supplier}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#0c7a4d]">Liên hệ:</span><br />
                  <span>{selectedIngredient.contact}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#0c7a4d]">Địa chỉ kho:</span><br />
                  <span className="text-xs">{selectedIngredient.address}</span>
                </div>
                <div>
                  <span className="font-semibold text-[#0c7a4d]">Giấy chứng nhận ATTP:</span><br />
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedIngredient.certificates?.map(cert => (
                      <span key={cert} className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                        ✓ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 p-3 bg-[#f8f1e3] rounded-xl text-xs text-[#5f6f68]">
              Sản phẩm được kiểm soát chất lượng nghiêm ngặt theo quy định VSATTP. 
              Phù hợp cho quán trà sữa, cà phê, sinh tố chuyên nghiệp.
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelectedIngredient(null)} className="flex-1 py-2.5 border rounded-xl">Đóng</button>
              <button 
                onClick={() => { addToCart(selectedIngredient); setSelectedIngredient(null); }} 
                className="flex-1 btn-primary py-2.5"
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-[#0a5c3b] text-white/80 py-8 text-sm mt-12">
        <div className="container text-center">
          Cửu Long Pha Chế — Mr. Hải 24H • Chuyên nguyên liệu &amp; đồ uống trend cho quán &amp; cá nhân<br />
          Hotline: 0389 045 248 • Giao nhanh TP.HCM &amp; Đồng Nai • Dự án được build bởi Grok (xAI)
        </div>
      </footer>
    </div>
  )
}

export default App
