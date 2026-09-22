import React, { useState, useEffect } from 'react';
import { 
  Bot, Search, Filter, Plus, Edit2, Trash2, CheckCircle2, 
  AlertCircle, Sparkles, BookOpen, RefreshCw, Languages, ExternalLink 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface AIAdvisorArticle {
  id: string;
  title: string;
  category: 'crop_recommendation' | 'disease_info' | 'fertilizer' | 'pest_control' | 'farming_tips' | 'seasonal_advice' | 'faq';
  crop?: string;
  content: string;
  image?: string;
  language: 'en' | 'kn' | 'hi';
  status: 'published' | 'draft';
  updatedAt?: string;
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  crop_recommendation: { label: 'Crop Advisory', color: 'bg-emerald-100 text-emerald-800' },
  disease_info: { label: 'Disease Guide', color: 'bg-rose-100 text-rose-800' },
  fertilizer: { label: 'Fertilizer & Nutrition', color: 'bg-amber-100 text-amber-800' },
  pest_control: { label: 'Pest Management', color: 'bg-orange-100 text-orange-800' },
  farming_tips: { label: 'Farming Tips', color: 'bg-blue-100 text-blue-800' },
  seasonal_advice: { label: 'Seasonal Advisory', color: 'bg-teal-100 text-teal-800' },
  faq: { label: 'FAQ', color: 'bg-purple-100 text-purple-800' }
};

export const AdminAIAdvisorManager: React.FC = () => {
  const [articles, setArticles] = useState<AIAdvisorArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLang, setSelectedLang] = useState<string>('all');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AIAdvisorArticle | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AIAdvisorArticle | null>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [formData, setFormData] = useState<Partial<AIAdvisorArticle>>({
    title: '',
    category: 'crop_recommendation',
    crop: '',
    content: '',
    image: '',
    language: 'en',
    status: 'published'
  });

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await adminApi.aiAdvisor.getAll();
      if (res && res.data) {
        setArticles(res.data);
      }
    } catch (error) {
      console.error('Failed to load AI Advisor content:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'crop_recommendation',
      crop: '',
      content: '',
      image: '',
      language: 'en',
      status: 'published'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AIAdvisorArticle) => {
    setEditingItem(item);
    setFormData({ ...item });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    try {
      setSaving(true);
      if (editingItem) {
        await adminApi.aiAdvisor.update(editingItem.id, formData);
      } else {
        await adminApi.aiAdvisor.create(formData);
      }
      setIsModalOpen(false);
      await fetchArticles();
    } catch (error) {
      console.error('Error saving AI article:', error);
      alert('Failed to save article.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.aiAdvisor.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchArticles();
    } catch (error) {
      console.error('Failed to delete AI article:', error);
      alert('Failed to delete article.');
    }
  };

  const filteredArticles = articles.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.crop && item.crop.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesLang = selectedLang === 'all' || item.language === selectedLang;
    return matchesSearch && matchesCat && matchesLang;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5 text-emerald-600" />
            Knowledge Base & AI Models
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            AI Advisor Knowledge Manager
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Curate agronomic knowledge, pest diagnoses, localized crop advice, and FAQs served by KrishiSmart AI.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchArticles}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm shadow-emerald-700/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Knowledge Article
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search AI articles by title, disease, fertilizer, crop name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>

          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Languages</option>
            <option value="en">English (EN)</option>
            <option value="kn">Kannada (KN)</option>
            <option value="hi">Hindi (HI)</option>
          </select>
        </div>
      </div>

      {/* Articles Grid / List */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading AI Advisor knowledge base...</p>
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <BookOpen className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No knowledge articles found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try modifying your search or filter options.'
              : 'Add your first agronomic guide or AI recommendation to empower farmers.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map(item => {
            const catInfo = CATEGORY_CONFIG[item.category] || { label: item.category, color: 'bg-stone-100 text-stone-800' };
            return (
              <div 
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {item.image && (
                    <div className="h-36 w-full overflow-hidden bg-stone-100 relative">
                      <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.status === 'published' ? 'bg-emerald-500 text-white' : 'bg-stone-500 text-white'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-4 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${catInfo.color}`}>
                        {catInfo.label}
                      </span>
                      <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                        <Languages className="w-3 h-3 text-stone-400" />
                        {item.language.toUpperCase()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>

                    {item.crop && (
                      <div className="text-[11px] text-emerald-800 font-semibold bg-emerald-50/70 px-2 py-0.5 rounded w-fit">
                        🌱 Crop: {item.crop}
                      </div>
                    )}

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-3 bg-stone-50/70 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    ID: {item.id.slice(0, 8)}...
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-emerald-700 hover:bg-white transition"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(item)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-white transition"
                      title="Delete Article"
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
        title={editingItem ? 'Edit AI Knowledge Article' : 'Create AI Knowledge Article'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Article Title *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Managing Early Blight in Tomato Crops"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Associated Crop</label>
              <input
                type="text"
                value={formData.crop || ''}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
                placeholder="e.g. Tomato, Cotton, Rice, Maize"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Language</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="en">English</option>
                <option value="kn">Kannada (ಕನ್ನಡ)</option>
                <option value="hi">Hindi (हिन्दी)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Cover Image URL (Optional)</label>
            <input
              type="url"
              value={formData.image || ''}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Article Content / Advisory *</label>
            <textarea
              required
              rows={6}
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Detailed agronomic guidance, recommended fungicide sprays, organic treatments, dosage..."
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
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
              {saving ? 'Saving...' : editingItem ? 'Save Changes' : 'Create Article'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete AI Knowledge Article"
        message={`Are you sure you want to permanently delete "${deleteTarget?.title}"? This knowledge will no longer be served by the AI Advisor.`}
      />
    </div>
  );
};
