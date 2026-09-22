import React, { useState, useEffect } from 'react';
import { 
  Image as ImageIcon, Upload, Search, Trash2, Copy, 
  Check, ExternalLink, RefreshCw, Filter, Eye, FileText 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  tags?: string[];
}

export const AdminMediaLibrary: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MediaItem | null>(null);
  const [uploading, setUploading] = useState(false);

  // Upload Form
  const [nameInput, setNameInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [tagsInput, setTagsInput] = useState('crops, hero');

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const res = await adminApi.media.getAll();
      if (res && res.data) {
        setMediaList(res.data);
      }
    } catch (e) {
      console.error('Failed to load media items:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput) return;

    try {
      setUploading(true);
      const payload = {
        name: nameInput || `Asset_${Date.now()}`,
        url: urlInput,
        type: 'image',
        size: 320000,
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      };

      await adminApi.media.upload(payload);
      setIsUploadOpen(false);
      setNameInput('');
      setUrlInput('');
      await fetchMedia();
    } catch (e) {
      console.error('Failed to upload media:', e);
      alert('Failed to add asset.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.media.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchMedia();
    } catch (e) {
      console.error('Failed to delete media asset:', e);
    }
  };

  const allTags = Array.from(new Set(mediaList.flatMap(m => m.tags || [])));

  const filteredMedia = mediaList.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags && item.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesTag = selectedTag === 'all' || (item.tags && item.tags.includes(selectedTag));
    return matchesSearch && matchesTag;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
            Digital Asset Management
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Media Library
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Store and manage high-resolution photographs, crop pathology imagery, hero banners, and brand vectors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchMedia}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Add Media Asset
          </button>
        </div>
      </div>

      {/* Search & Tag Filter */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media assets by filename or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Tags</option>
            {allTags.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Loading media library assets...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <ImageIcon className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No media items found</h3>
          <p className="text-xs text-stone-500 mt-1">Upload an image or paste a CDN URL to populate your library.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map(item => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-stone-100 overflow-hidden">
                <img
                  src={item.url}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                  <button
                    onClick={() => setPreviewItem(item)}
                    className="p-2 rounded-xl bg-white/90 text-stone-900 hover:bg-white transition"
                    title="Preview full size"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyUrl(item)}
                    className="p-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition"
                    title="Copy Image URL"
                  >
                    {copiedId === item.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 space-y-1.5">
                <h4 className="text-xs font-bold text-stone-900 truncate" title={item.name}>
                  {item.name}
                </h4>
                <div className="flex items-center justify-between text-[10px] text-stone-400">
                  <span>{item.uploadedAt}</span>
                  <span>{Math.round((item.size || 250000) / 1024)} KB</span>
                </div>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.slice(0, 2).map((t, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 text-[9px] font-medium">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="px-3 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <button
                  onClick={() => handleCopyUrl(item)}
                  className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy URL
                    </>
                  )}
                </button>
                <button
                  onClick={() => setDeleteTarget(item)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <AdminModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Image or Add Media URL"
      >
        <form onSubmit={handleUploadSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Asset Name / Title</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Healthy Basmati Paddy Field"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL *</label>
            <input
              type="url"
              required
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://images.unsplash.com/... or CDN link"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
            <span className="text-[11px] text-stone-400 mt-1 block">
              Supports CDN, Unsplash, Cloudinary, or AWS S3 image links.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="crops, rice, banner, soil"
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          {urlInput && (
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <span className="text-xs font-semibold text-stone-600 mb-2 block">Live Preview</span>
              <div className="h-40 rounded-lg overflow-hidden bg-white border border-stone-200 flex items-center justify-center">
                <img src={urlInput} alt="Preview" className="max-h-full object-contain" onError={() => {}} />
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setIsUploadOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition disabled:opacity-50"
            >
              {uploading ? 'Adding...' : 'Save Asset'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Full Preview Modal */}
      <AdminModal
        isOpen={Boolean(previewItem)}
        onClose={() => setPreviewItem(null)}
        title={previewItem?.name || 'Image Preview'}
      >
        <div className="space-y-4">
          <div className="max-h-[60vh] overflow-hidden rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center">
            {previewItem && (
              <img src={previewItem.url} alt={previewItem.name} className="max-h-[58vh] w-auto object-contain" />
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <span className="truncate pr-4 font-mono">{previewItem?.url}</span>
            <button
              onClick={() => previewItem && handleCopyUrl(previewItem)}
              className="shrink-0 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
            >
              {copiedId === previewItem?.id ? 'Copied URL!' : 'Copy Direct URL'}
            </button>
          </div>
        </div>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Media Asset"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? Any sections referencing this image will need to be updated.`}
      />
    </div>
  );
};
