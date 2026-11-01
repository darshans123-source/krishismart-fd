import React, { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Copy,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  ArrowRight,
  Sparkles,
  Sliders
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';
import { AdminPageEditor } from './AdminPageEditor';
import { AdminTab } from '../components/AdminSidebar';

interface AdminPagesManagerProps {
  onNavigateTab: (tab: AdminTab) => void;
}

export const AdminPagesManager: React.FC<AdminPagesManagerProps> = ({ onNavigateTab }) => {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft'>('all');

  // Active page being edited in the visual editor
  const [editingPageId, setEditingPageId] = useState<string | null>(null);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [previewPage, setPreviewPage] = useState<any | null>(null);

  // New Page Form
  const [newPageName, setNewPageName] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [newPageRoute, setNewPageRoute] = useState('');

  const fetchPages = async () => {
    try {
      const res = await adminApi.pages.getAll();
      if (res.success && res.data) {
        setPages(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageName.trim()) return;

    const slug = newPageSlug.trim() || newPageName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const route = newPageRoute.trim() || `/${slug}`;

    try {
      const res = await adminApi.pages.save(`page-${Date.now()}`, {
        name: newPageName,
        slug,
        route,
        status: 'Draft',
        sections: [
          {
            id: `sec-${Date.now()}`,
            title: 'Main Section',
            type: 'banner',
            visible: true,
            order: 1,
            components: [
              { id: `c-${Date.now()}`, type: 'heading', title: newPageName, visible: true, order: 1 }
            ]
          }
        ]
      });

      if (res.success) {
        setIsCreateModalOpen(false);
        setNewPageName('');
        setNewPageSlug('');
        setNewPageRoute('');
        await fetchPages();
        setEditingPageId(res.data.id);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to create page');
    }
  };

  const handleTogglePublish = async (pageId: string) => {
    try {
      const res = await adminApi.pages.publish(pageId);
      if (res.success) {
        fetchPages();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDuplicate = async (pageId: string) => {
    try {
      const res = await adminApi.pages.duplicate(pageId);
      if (res.success) {
        fetchPages();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      const res = await adminApi.pages.delete(deleteConfirmId);
      if (res.success) {
        setDeleteConfirmId(null);
        fetchPages();
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  // If in Visual Editor mode, render AdminPageEditor
  if (editingPageId) {
    if (editingPageId === 'page-dashboard' || editingPageId === 'dashboard') {
      // Special dashboard editor redirect or show universal editor
    }
    return (
      <AdminPageEditor
        pageId={editingPageId}
        onBack={() => {
          setEditingPageId(null);
          fetchPages();
        }}
      />
    );
  }

  const filteredPages = pages.filter((page) => {
    const matchesSearch =
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.route.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header Description & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-2xl border border-[#E5EDE7] p-5 sm:p-6 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-[#172B24] font-heading">Universal Page Manager</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ECFDF5] text-[#064E3B] border border-[#A7F3D0] text-xs font-bold">
              {pages.length} Managed Pages
            </span>
          </div>
          <p className="text-xs text-[#718078] mt-1">
            Control published states, component layouts, and route bindings for all farmer-facing screens.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateTab('dashboard-editor')}
            className="px-4 py-2.5 rounded-2xl bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#243A32] text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-[#064E3B]" />
            <span>Edit Dashboard Hero</span>
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2.5 rounded-2xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#8A9A90] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pages or routes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white border border-[#E5EDE7] text-xs focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
          />
        </div>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-[#EFF4EF] rounded-2xl border border-[#E5EDE7] self-stretch sm:self-auto justify-center">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'all' ? 'bg-white text-[#172B24] shadow-2xs font-bold' : 'text-[#718078] hover:text-[#172B24]'
            }`}
          >
            All ({pages.length})
          </button>
          <button
            onClick={() => setStatusFilter('Published')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'Published' ? 'bg-white text-[#064E3B] shadow-2xs font-bold' : 'text-[#718078] hover:text-[#172B24]'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setStatusFilter('Draft')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              statusFilter === 'Draft' ? 'bg-white text-amber-800 shadow-2xs font-bold' : 'text-[#718078] hover:text-[#172B24]'
            }`}
          >
            Drafts
          </button>
        </div>
      </div>

      {/* Pages Data Table */}
      <div className="bg-white rounded-2xl border border-[#E5EDE7] shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7FAF7]/70 border-b border-[#E5EDE7] text-[#718078] font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Page Name</th>
                <th className="py-3.5 px-4">Route Path</th>
                <th className="py-3.5 px-4">Sections</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF4EF]">
              {filteredPages.map((page) => (
                <tr key={page.id} className="hover:bg-[#ECFDF5]/20 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="font-extrabold text-[#172B24] text-sm font-heading">{page.name}</div>
                    <div className="text-[11px] text-[#8A9A90] mt-0.5">ID: {page.id}</div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-[#EFF4EF] text-[#3E5248] border border-[#E5EDE7]">
                      {page.route}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-xs font-semibold text-[#5A6E64]">
                      {page.sections ? page.sections.length : 0} sections
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublish(page.id)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border transition-colors cursor-pointer ${
                        page.status === 'Published'
                          ? 'bg-[#ECFDF5] text-[#064E3B] border-[#6EE7B7] hover:bg-[#D1FAE5]'
                          : 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Click to toggle publish status"
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          page.status === 'Published' ? 'bg-[#059669]' : 'bg-amber-600'
                        }`}
                      />
                      <span>{page.status}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-[#718078]">
                    <div>{page.lastUpdated}</div>
                    <div className="text-[10px] text-[#8A9A90] mt-0.5">by {page.updatedBy || 'Admin'}</div>
                  </td>

                  <td className="py-4 px-4 sm:px-6 text-right">
                    <div className="inline-flex items-center gap-1">
                      {/* Visual Editor */}
                      <button
                        onClick={() => setEditingPageId(page.id)}
                        className="p-2 rounded-xl bg-[#ECFDF5] hover:bg-[#D1FAE5] text-[#064E3B] transition-colors cursor-pointer"
                        title="Visual Page Editor"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* Preview Modal */}
                      <button
                        onClick={() => setPreviewPage(page)}
                        className="p-2 rounded-xl bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] transition-colors cursor-pointer"
                        title="Quick Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Duplicate */}
                      <button
                        onClick={() => handleDuplicate(page.id)}
                        className="p-2 rounded-xl bg-[#EFF4EF] hover:bg-[#E5EDE7] text-[#3E5248] transition-colors cursor-pointer"
                        title="Duplicate Page"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      {/* Delete */}
                      {page.id !== 'page-dashboard' && page.slug !== 'dashboard' && (
                        <button
                          onClick={() => setDeleteConfirmId(page.id)}
                          className="p-2 rounded-xl hover:bg-rose-50 text-[#8A9A90] hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Page Modal */}
      <AdminModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Farmer Page"
        subtitle="Define page metadata, URL path, and initial layout"
      >
        <form onSubmit={handleCreatePage} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#3E5248]">Page Name</label>
            <input
              type="text"
              value={newPageName}
              onChange={(e) => {
                setNewPageName(e.target.value);
                if (!newPageSlug) {
                  setNewPageSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              placeholder="e.g. Kisan Credit Guidance"
              required
              className="w-full px-4 py-2.5 rounded-2xl border border-[#E5EDE7] text-xs focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E5248]">URL Slug</label>
              <input
                type="text"
                value={newPageSlug}
                onChange={(e) => setNewPageSlug(e.target.value)}
                placeholder="kisan-credit"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E5EDE7] text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#3E5248]">Route Path</label>
              <input
                type="text"
                value={newPageRoute}
                onChange={(e) => setNewPageRoute(e.target.value)}
                placeholder="/kisan-credit"
                className="w-full px-4 py-2.5 rounded-2xl border border-[#E5EDE7] text-xs font-mono"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-[#E5EDE7]">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-[#CBD8D0] text-[#3E5248] text-xs font-semibold hover:bg-[#EFF4EF]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#064E3B] hover:bg-[#064E3B] text-white text-xs font-bold shadow-xs cursor-pointer"
            >
              Create Page & Launch Visual Editor
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete Confirmation */}
      <AdminConfirmModal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleDelete}
        title="Delete Page"
        message="Are you sure you want to delete this page? This action will remove it from the CMS."
        confirmLabel="Delete Page"
        isDestructive={true}
      />

      {/* Quick Preview Modal */}
      {previewPage && (
        <AdminModal
          isOpen={!!previewPage}
          onClose={() => setPreviewPage(null)}
          title={`Preview: ${previewPage.name}`}
          subtitle={`Route: ${previewPage.route} • Status: ${previewPage.status}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-[#F7FAF7] border border-[#E5EDE7] space-y-3">
              <div className="text-xs font-bold text-[#3E5248] uppercase tracking-wider">Page Schema Summary</div>
              <div className="text-xs text-[#5A6E64]">Sections count: {previewPage.sections?.length || 0}</div>
              {previewPage.sections?.map((sec: any, idx: number) => (
                <div key={sec.id || idx} className="p-3 rounded-xl bg-white border border-[#E5EDE7] space-y-1">
                  <div className="text-xs font-bold text-[#064E3B]">
                    Section {idx + 1}: {sec.title} ({sec.type})
                  </div>
                  <div className="text-[11px] text-[#718078]">
                    {sec.components?.length || 0} nested components • Visible: {sec.visible ? 'Yes' : 'No'}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setEditingPageId(previewPage.id);
                  setPreviewPage(null);
                }}
                className="px-4 py-2 rounded-xl bg-[#064E3B] text-white text-xs font-bold hover:bg-[#064E3B]"
              >
                Open in Full Visual Editor
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
