import { useState, useEffect } from 'react'
import { ShoppingCart, X, Play, Package, Coffee } from 'lucide-react'
import { Toaster, toast } from 'sonner'

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
}

interface CartItem {
  product: Product
  quantity: number
}

// Data - Drinks (from previous high-quality generations - Cửu Long Mini Mart 24H style)
const drinks: Product[] = [
  {
    id: 101,
    name: "Trà Sữa Nướng",
    price: 55000,
    image: "/assets/drinks/tra-sua-nuong.jpg",
    category: "drink",
    description: "Trà đen nướng đường nâu khói thơm + sữa tươi + trân châu hoàng kim. Trend phá cách 2026.",
    badge: "Hot",
  },
  {
    id: 102,
    name: "Sinh Tố Collagen Đặc Quánh",
    price: 62000,
    image: "/assets/drinks/sinh-to.jpg",
    category: "drink",
    description: "Xoài, chuối, việt quất xay đặc sánh + collagen. Healthy & đẹp da cho giới trẻ.",
    badge: "Healthy",
  },
  {
    id: 103,
    name: "Sữa Tươi Trân Châu Đường Đen",
    price: 48000,
    image: "/assets/drinks/sua-tuoi.jpg",
    category: "drink",
    description: "Sữa tươi nguyên chất + syrup đường đen caramel + trân châu dai giòn.",
    badge: "Bestseller",
  },
  {
    id: 104,
    name: "Trà Đào Cam Sả",
    price: 45000,
    image: "/assets/drinks/tra-sua-action.jpg",
    category: "drink",
    description: "Trà đen + đào ngâm + cam tươi + sả đập dập. Quốc dân giải nhiệt.",
  },
]

// Data - Nguyên liệu (from du-an-nguyen-lieu + report)
const ingredients: Product[] = [
  {
    id: 201,
    name: "Trân Châu Hoàng Kim",
    price: 85000,
    image: "/assets/ingredients/tran-chau.jpg",
    category: "ingredient",
    description: "Trân châu tapioca cao cấp, dai giòn, 1kg đóng gói.",
    unit: "1kg",
  },
  {
    id: 202,
    name: "Syrup Đường Nâu / Caramel",
    price: 72000,
    image: "/assets/ingredients/syrup.jpg",
    category: "ingredient",
    description: "Syrup cao cấp cho Trà Sữa Nướng & Brown Sugar. Chai 1.2L.",
    unit: "1.2L",
  },
  {
    id: 203,
    name: "Bột Kem Béo Frima (Hàn)",
    price: 145000,
    image: "/assets/ingredients/bot-kem-beo.jpg",
    category: "ingredient",
    description: "Vua bột béo - Frima Dongsuh. Dùng cho tất cả trà sữa.",
    unit: "1kg",
  },
  {
    id: 204,
    name: "Matcha Nhật Bản Cao Cấp",
    price: 285000,
    image: "/assets/ingredients/matcha.jpg",
    category: "ingredient",
    description: "Matcha Uji cao cấp, vị umami mạnh. Dùng cho latte & smoothie.",
    unit: "200g",
  },
  {
    id: 205,
    name: "Trà Đen / Hồng Trà Lộc Phát",
    price: 84000,
    image: "/assets/ingredients/hong-tra.jpg",
    category: "ingredient",
    description: "Trà đen thượng hạng Lộc Phát. 500g - chủ lực cho quán.",
    unit: "500g",
  },
  {
    id: 206,
    name: "Trái Cây Tươi & Ngâm Mix",
    price: 95000,
    image: "/assets/ingredients/trai-cay.jpg",
    category: "ingredient",
    description: "Đào, dâu, việt quất, mứt trái cây nhập. Hộp lớn.",
    unit: "Hộp 1.5kg",
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
              Bán lẻ &amp; sỉ. Công thức độc quyền. Video hướng dẫn chi tiết. 
              Giao nhanh TP.HCM &amp; toàn quốc.
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
                  {product.category === 'drink' && (
                    <button 
                      onClick={() => openVideo(product)}
                      className="px-3 border border-[#e5e0d5] rounded-xl hover:bg-[#f8f1e3] flex items-center"
                      title="Xem video hướng dẫn"
                    >
                      <Play size={16} />
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

      {/* Video Modal (Demo) */}
      {showVideoModal && (
        <div className="modal" onClick={() => setShowVideoModal(null)}>
          <div className="modal-content p-6 max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold mb-2">{showVideoModal.name} — Hướng dẫn pha chế</h3>
            <div className="bg-black aspect-video rounded-xl mb-4 flex items-center justify-center text-white/70 text-sm">
              🎥 Video hướng dẫn thực tế (15s)<br />File: {showVideoModal.name.toLowerCase().replace(/\s+/g,'-')}.mp4
            </div>
            <p className="text-sm text-[#5f6f68] mb-4">Video được quay tại Cửu Long Mini Mart 24H. Sử dụng nguyên liệu chất lượng cao từ kho của chúng tôi.</p>
            <button className="w-full py-2.5 border rounded-xl" onClick={() => setShowVideoModal(null)}>Đóng</button>
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
