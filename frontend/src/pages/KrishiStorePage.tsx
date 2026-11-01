import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Star,
  Plus,
  Minus,
  Trash2,
  CheckCircle2,
  Truck,
  ShieldCheck,
  CreditCard,
  ChevronRight,
  Sparkles,
  Package,
  X
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { StoreProduct } from '../types';

export const KrishiStorePage: React.FC = () => {
  const { storeProducts, cart, addToCart, removeFromCart, updateCartQuantity, placeOrder, orders, user } = useFarmData();
  const { t } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedProductDetails, setSelectedProductDetails] = useState<StoreProduct | null>(null);

  const [deliveryAddress, setDeliveryAddress] = useState(
    `${user?.village || 'Pandavapura'}, ${user?.district || 'Mandya'}, ${user?.state || 'Karnataka'}`
  );
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe)');

  const categories = [
    'All',
    'Seeds',
    'Fertilizers',
    'Bio Products',
    'Tools',
    'Irrigation',
    'Sensors',
    'Drone Services'
  ];

  const filteredProducts = storeProducts.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    placeOrder(deliveryAddress, paymentMethod);
    setShowCheckoutModal(false);
    setShowCartDrawer(false);
    setShowOrdersModal(true);
  };

  return (
    <div className="space-y-8 pb-16 animate-in fade-in">
      {/* Agricultural Store Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-sm border border-[#E5EDE7]">
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#172B24]">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&auto=format&fit=crop&q=80"
            alt="Agricultural seeds, inputs, and farm store"
            className="w-full h-full object-cover opacity-85 hover:scale-102 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#022C22]/90 via-[#172B24]/40 to-transparent flex flex-col justify-end p-6 sm:p-8 text-white">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#064E3B]/80 backdrop-blur-xs text-white text-xs font-bold w-fit mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Certified Agri-Inputs & Farm Tech</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
              Krishi Store
            </h1>
            <p className="text-xs sm:text-base text-[#E5EDE7] mt-0.5 max-w-2xl leading-relaxed">
              Certified seeds, nano fertilizers, bio-protection, drip kits, and IoT sensors with farm-gate delivery.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[#718078]">
          All products sourced directly from registered agricultural co-operatives & manufacturers.
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowOrdersModal(true)}
            className="px-4 py-2 rounded-xl border border-[#CBD8D0] hover:bg-[#F7FAF7] text-[#3E5248] text-xs font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
          >
            <Package className="w-4 h-4 text-[#064E3B]" />
            <span>{t('orders')} ({orders.length})</span>
          </button>

          <button
            onClick={() => setShowCartDrawer(true)}
            className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('cart')} ({cartItemCount})</span>
          </button>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                activeCategory === cat
                  ? 'bg-[#059669] text-white shadow-xs'
                  : 'bg-white text-[#5A6E64] hover:bg-[#EFF4EF] border border-[#E5EDE7]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9A90]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search seeds, nano urea, drip..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#E5EDE7] text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-[#10B981]"
          />
        </div>
      </div>

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Product Image & Badge */}
              <div className="relative h-44 w-full bg-[#EFF4EF] overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badge && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#059669]/90 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    {prod.badge}
                  </span>
                )}
              </div>

              {/* Product Content */}
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-[#8A9A90]">
                  <span className="font-semibold">{prod.brand}</span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{prod.rating} ({prod.reviewCount})</span>
                  </span>
                </div>

                <h3
                  onClick={() => setSelectedProductDetails(prod)}
                  className="font-extrabold text-sm text-[#172B24] line-clamp-2 hover:text-[#064E3B] cursor-pointer font-heading leading-snug"
                >
                  {prod.name}
                </h3>

                <p className="text-[11px] text-[#718078] line-clamp-2 leading-relaxed">
                  {prod.description}
                </p>

                {/* Price & Strike-through */}
                <div className="flex items-baseline gap-2 pt-2">
                  <span className="text-lg font-black text-[#172B24] font-heading">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  {prod.originalPrice > prod.price && (
                    <span className="text-xs text-[#8A9A90] line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Footer */}
            <div className="p-4 pt-0">
              <button
                onClick={() => addToCart(prod, 1)}
                className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] active:scale-95 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 1. SLIDE-OVER CART DRAWER */}
      {showCartDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
            {/* Cart Header */}
            <div className="p-5 border-b border-[#EFF4EF] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#059669]" />
                <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                  Your Farm Cart ({cartItemCount})
                </h3>
              </div>
              <button
                onClick={() => setShowCartDrawer(false)}
                className="p-1.5 rounded-xl text-[#8A9A90] hover:text-[#3E5248]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#CBD8D0] mx-auto" />
                  <div className="font-bold text-[#3E5248] text-sm">Your cart is currently empty</div>
                  <p className="text-xs text-[#8A9A90]">
                    Add certified hybrid seeds, nano fertilizers, or sensors to order.
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 rounded-2xl border border-[#E5EDE7] bg-[#F7FAF7]/50"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1 space-y-1">
                      <div className="font-bold text-xs text-[#172B24] line-clamp-1">
                        {item.product.name}
                      </div>
                      <div className="text-xs font-black text-[#064E3B]">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 bg-white rounded-lg border border-[#E5EDE7] px-2 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="text-[#718078] hover:text-[#172B24]"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#243A32]">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="text-[#718078] hover:text-[#172B24]"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[#8A9A90] hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Checkout CTA */}
            {cart.length > 0 && (
              <div className="p-5 border-t border-[#EFF4EF] space-y-3 bg-[#F7FAF7]">
                <div className="flex justify-between text-xs text-[#5A6E64]">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#172B24]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-[#5A6E64]">
                  <span>Farm-Gate Delivery</span>
                  <span className="font-bold text-[#064E3B]">FREE</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#172B24] pt-2 border-t border-[#E5EDE7]">
                  <span>Total Amount</span>
                  <span className="text-lg text-[#064E3B] font-black">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                <button
                  onClick={() => setShowCheckoutModal(true)}
                  className="w-full py-3.5 rounded-2xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md shadow-[#059669]/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#E5EDE7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                Confirm Doorstep Farm Delivery
              </h3>
              <button onClick={() => setShowCheckoutModal(false)} className="text-[#8A9A90] hover:text-[#3E5248]">
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Delivery Address & Farm Gate</label>
                <textarea
                  rows={2}
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs focus:ring-2 focus:ring-[#10B981] outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white"
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI (Google Pay / PhonePe / Paytm)</option>
                  <option value="Cash on Delivery (COD)">Cash on Delivery (COD at Farm Gate)</option>
                  <option value="Kisan Credit Card (KCC)">Kisan Credit Card (KCC Subsidized 4%)</option>
                  <option value="Net Banking">Net Banking (SBI / Canara / HDFC)</option>
                </select>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#064E3B] flex items-center justify-between">
                <div>
                  <div className="font-bold">Total Order Value:</div>
                  <div className="text-lg font-black text-[#064E3B]">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </div>
                </div>
                <span className="text-[10px] font-bold text-[#064E3B] bg-white px-2 py-1 rounded-lg">
                  Free Transit Insurance
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-[#059669] hover:bg-[#064E3B] text-white font-bold text-sm shadow-md transition-all"
              >
                Confirm & Place Order (+100 XP)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. ORDER HISTORY & LIVE STEP TRACKING MODAL */}
      {showOrdersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#E5EDE7] space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                My Farm Orders & Live Tracking
              </h3>
              <button onClick={() => setShowOrdersModal(false)} className="text-[#8A9A90] hover:text-[#3E5248]">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl border border-[#E5EDE7] space-y-3 bg-[#F7FAF7]/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-[#172B24]">Order #{ord.id}</span>
                      <div className="text-[10px] text-[#8A9A90]">Placed on {ord.date}</div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D1FAE5] text-[#064E3B] text-[10px] font-extrabold">
                      {ord.status}
                    </span>
                  </div>

                  <div className="text-xs text-[#5A6E64] font-medium">
                    Total: <strong className="text-[#172B24]">₹{ord.totalAmount.toLocaleString('en-IN')}</strong> via {ord.paymentMethod}
                  </div>

                  {/* Step Tracking Progress Bar */}
                  <div className="pt-2 border-t border-[#E5EDE7]/80 space-y-2">
                    <div className="text-[10px] font-bold text-[#8A9A90] uppercase">Live Delivery Milestones</div>
                    <div className="space-y-2 text-xs">
                      {ord.trackingSteps.map((st, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2
                            className={`w-4 h-4 shrink-0 ${
                              st.completed ? 'text-[#059669]' : 'text-[#CBD8D0]'
                            }`}
                          />
                          <span className={st.completed ? 'font-bold text-[#243A32]' : 'text-[#8A9A90]'}>
                            {st.title}
                          </span>
                          <span className="text-[10px] text-[#8A9A90] ml-auto">{st.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
