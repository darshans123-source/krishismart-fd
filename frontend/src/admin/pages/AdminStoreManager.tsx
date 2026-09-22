import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Search, Plus, Edit2, Trash2, CheckCircle2, 
  XCircle, Star, Tag, Package, RefreshCw, Filter, ArrowUpDown 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface StoreProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  image: string;
  brand: string;
  inStock: boolean;
  badge?: string;
  description?: string;
  features?: string[];
  dosageOrUsage?: string;
}

const CATEGORIES = [
  'All',
  'Seeds & Hybrids',
  'Bio-Fertilizers & Nutrition',
  'Crop Protection & Fungicides',
  'Irrigation Equipment',
  'Tools & Sprayers'
];

export const AdminStoreManager: React.FC = () => {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'in_stock' | 'out_of_stock'>('all');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<StoreProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StoreProduct | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formData, setFormData] = useState<Partial<StoreProduct>>({
    name: '',
    category: 'Bio-Fertilizers & Nutrition',
    price: 299,
    originalPrice: 350,
    rating: 4.8,
    reviewCount: 24,
    image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&auto=format&fit=crop&q=80',
    brand: 'KrishiSmart Agrotech',
    inStock: true,
    badge: 'Govt Certified',
    description: '',
    dosageOrUsage: 'Apply as recommended by KrishiSmart agronomist'
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await adminApi.store.getAll();
      if (res && res.data) {
        setProducts(res.data);
      }
    } catch (e) {
      console.error('Failed to load store products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Bio-Fertilizers & Nutrition',
      price: 299,
      originalPrice: 350,
      rating: 4.8,
      reviewCount: 1,
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?w=300&auto=format&fit=crop&q=80',
      brand: 'KrishiSmart Agrotech',
      inStock: true,
      badge: 'Govt Certified',
      description: '',
      dosageOrUsage: 'Apply as recommended by KrishiSmart agronomist'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod: StoreProduct) => {
    setEditingProduct(prod);
    setFormData({ ...prod });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    try {
      setSaving(true);
      if (editingProduct) {
        await adminApi.store.update(editingProduct.id, formData);
      } else {
        await adminApi.store.create(formData);
      }
      setIsModalOpen(false);
      await fetchProducts();
    } catch (e) {
      console.error('Failed to save store product:', e);
      alert('Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.store.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchProducts();
    } catch (e) {
      console.error('Failed to delete store product:', e);
      alert('Failed to delete product.');
    }
  };

  const handleToggleStock = async (prod: StoreProduct) => {
    try {
      await adminApi.store.update(prod.id, { inStock: !prod.inStock });
      await fetchProducts();
    } catch (e) {
      console.error('Failed to toggle stock status:', e);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'in_stock' ? p.inStock :
      !p.inStock;
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />
            Agri-Input Direct Marketplace
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Krishi Store Product Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage certified seeds, bio-fertilizers, solar drip kits, and agricultural machinery sold to farmers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProducts}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Store Product
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Catalog SKUs</div>
            <div className="text-2xl font-black text-stone-900 mt-1">{products.length} Items</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Direct manufacturer sourcing</div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">In Stock Ratio</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {products.length > 0 
                ? Math.round((products.filter(p => p.inStock).length / products.length) * 100) 
                : 100}%
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Ready for doorstep delivery</div>
          </div>
          <div className="p-3 bg-teal-50 text-teal-700 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Avg Farmer Rating</div>
            <div className="text-2xl font-black text-amber-900 mt-1">4.8 / 5.0</div>
            <div className="text-[11px] text-amber-700 font-semibold mt-0.5">Over 1,200 verified reviews</div>
          </div>
          <div className="p-3 bg-amber-50 text-amber-700 rounded-2xl">
            <Star className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-stone-500">Avg Farmer Savings</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">22%</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Vs local retail prices</div>
          </div>
          <div className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
            <Tag className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search store by product title, brand, SKU or active molecule..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:ring-2 focus:ring-emerald-600/30"
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Inventory</option>
            <option value="in_stock">In Stock Only</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading catalog items...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Package className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No products found</h3>
          <p className="text-xs text-stone-500 mt-1">Try relaxing your search terms or add a new product.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(prod => {
            const discountPct = prod.originalPrice && prod.originalPrice > prod.price 
              ? Math.round(((prod.originalPrice - prod.price) / prod.originalPrice) * 100) 
              : 0;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden bg-stone-100 relative">
                    <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wide">
                        {prod.badge}
                      </span>
                    )}
                    {discountPct > 0 && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-rose-500 text-white text-[10px] font-extrabold">
                        {discountPct}% OFF
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-semibold text-emerald-800">{prod.brand}</span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        {prod.rating || 4.8}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 line-clamp-2 leading-snug">
                      {prod.name}
                    </h3>

                    <div className="text-[11px] text-stone-500 font-medium line-clamp-1">
                      {prod.category}
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      <span className="text-lg font-black text-stone-900 font-heading">
                        ₹{prod.price}
                      </span>
                      {prod.originalPrice && prod.originalPrice > prod.price && (
                        <span className="text-xs text-stone-400 line-through">
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStock(prod)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-extrabold cursor-pointer transition ${
                      prod.inStock
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {prod.inStock ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {prod.inStock ? 'In Stock' : 'Out of Stock'}
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-white transition"
                      title="Edit Product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(prod)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition"
                      title="Delete Product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Create Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Store Product' : 'Add Store Product'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Product Title *</label>
            <input
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Bio-NPK Liquid Consortium 1 Liter"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                {CATEGORIES.filter(c => c !== 'All').map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Brand / Manufacturer</label>
              <input
                type="text"
                value={formData.brand || ''}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="KrishiSmart Agrotech"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                min="1"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Original MRP (₹)</label>
              <input
                type="number"
                min="1"
                value={formData.originalPrice || 0}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Badge Tag</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                placeholder="Govt Certified / Bestseller"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Product Image URL</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Description & Application Advice</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Active ingredients, bacterial count, dosage per acre..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-semibold text-stone-700">In Stock & Available for Delivery</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Target Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Store Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? It will no longer be visible on the Krishi Store.`}
      />
    </div>
  );
};
