import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Eye,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Sliders,
  Type,
  Image as ImageIcon,
  Square,
  BarChart,
  Sun,
  Wheat,
  Store,
  ShieldCheck,
  AlertTriangle,
  Move,
  Layout,
  ExternalLink
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { AdminModal } from '../components/AdminModal';

interface AdminPageEditorProps {
  pageId: string;
  onBack: () => void;
}

export const AdminPageEditor: React.FC<AdminPageEditorProps> = ({ pageId, onBack }) => {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'edit' | 'split' | 'preview'>('edit');

  // Selected Section & Component for editing
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [editingComponent, setEditingComponent] = useState<any | null>(null);
  const [componentModalOpen, setComponentModalOpen] = useState(false);
  const [targetSectionForNewComp, setTargetSectionForNewComp] = useState<string | null>(null);

  // Status message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fetchPage = async () => {
    try {
      const res = await adminApi.pages.getById(pageId);
      if (res.success && res.data) {
        setPage(res.data);
        if (res.data.sections && res.data.sections.length > 0) {
          setActiveSectionId(res.data.sections[0].id);
        }
      }
    } catch (err: any) {
      alert(err.message || 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveDraft = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await adminApi.pages.save(page.id, {
        ...page,
        status: 'Draft'
      });
      if (res.success) {
        setPage(res.data);
        showToast('Draft saved successfully! Ready for publishing.');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!page) return;
    setSaving(true);
    try {
      const res = await adminApi.pages.save(page.id, {
        ...page,
        status: 'Published'
      });
      if (res.success) {
        setPage(res.data);
        showToast('Page Published! Visible to all farmers immediately.');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Section Handlers
  const handleAddSection = () => {
    if (!page) return;
    const newSecId = `sec-${Date.now()}`;
    const newSection = {
      id: newSecId,
      title: `Section ${(page.sections?.length || 0) + 1}`,
      type: 'card',
      visible: true,
      order: (page.sections?.length || 0) + 1,
      components: [
        {
          id: `c-${Date.now()}`,
          type: 'heading',
          title: 'Section Heading',
          visible: true,
          order: 1
        }
      ]
    };

    const updatedSections = [...(page.sections || []), newSection];
    setPage({ ...page, sections: updatedSections });
    setActiveSectionId(newSecId);
  };

  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    if (!page || !page.sections) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= page.sections.length) return;

    const updated = [...page.sections];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;

    // re-index order
    updated.forEach((s, idx) => (s.order = idx + 1));
    setPage({ ...page, sections: updated });
  };

  const handleToggleSectionVisibility = (secId: string) => {
    if (!page || !page.sections) return;
    const updated = page.sections.map((s: any) =>
      s.id === secId ? { ...s, visible: !s.visible } : s
    );
    setPage({ ...page, sections: updated });
  };

  const handleDuplicateSection = (secId: string) => {
    if (!page || !page.sections) return;
    const target = page.sections.find((s: any) => s.id === secId);
    if (!target) return;

    const duplicated = {
      ...target,
      id: `sec-${Date.now()}`,
      title: `${target.title} (Copy)`,
      order: page.sections.length + 1,
      components: (target.components || []).map((c: any) => ({
        ...c,
        id: `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`
      }))
    };

    setPage({ ...page, sections: [...page.sections, duplicated] });
  };

  const handleDeleteSection = (secId: string) => {
    if (!page || !page.sections) return;
    if (page.sections.length <= 1) {
      alert('Page must contain at least one section.');
      return;
    }
    const updated = page.sections.filter((s: any) => s.id !== secId);
    setPage({ ...page, sections: updated });
    if (activeSectionId === secId) {
      setActiveSectionId(updated[0]?.id || null);
    }
  };

  // Component Handlers
  const handleOpenAddComponent = (sectionId: string) => {
    setTargetSectionForNewComp(sectionId);
    setEditingComponent({
      id: `c-${Date.now()}`,
      type: 'card',
      title: 'New Component Title',
      content: 'Detailed description or component content.',
      image: '',
      icon: '🌱',
      link: '',
      visible: true,
      order: 1
    });
    setComponentModalOpen(true);
  };

  const handleOpenEditComponent = (comp: any) => {
    setEditingComponent({ ...comp });
    setComponentModalOpen(true);
  };

  const handleSaveComponentModal = () => {
    if (!page || !page.sections || !editingComponent) return;

    const updatedSections = page.sections.map((sec: any) => {
      const isTarget = targetSectionForNewComp ? sec.id === targetSectionForNewComp : sec.components?.some((c: any) => c.id === editingComponent.id);
      if (!isTarget) return sec;

      const compExists = sec.components?.some((c: any) => c.id === editingComponent.id);
      let updatedComps;
      if (compExists) {
        updatedComps = sec.components.map((c: any) =>
          c.id === editingComponent.id ? editingComponent : c
        );
      } else {
        updatedComps = [...(sec.components || []), { ...editingComponent, order: (sec.components?.length || 0) + 1 }];
      }
      return { ...sec, components: updatedComps };
    });

    setPage({ ...page, sections: updatedSections });
    setComponentModalOpen(false);
    setEditingComponent(null);
    setTargetSectionForNewComp(null);
  };

  const handleDeleteComponent = (secId: string, compId: string) => {
    if (!page || !page.sections) return;
    const updatedSections = page.sections.map((sec: any) => {
      if (sec.id !== secId) return sec;
      return {
        ...sec,
        components: sec.components.filter((c: any) => c.id !== compId)
      };
    });
    setPage({ ...page, sections: updatedSections });
  };

  if (loading || !page) {
    return (
      <div className="p-8 text-center text-stone-500 font-medium">
        Loading Visual Page Builder...
      </div>
    );
  }

  // Active section object
  const activeSection = page.sections?.find((s: any) => s.id === activeSectionId) || page.sections?.[0];

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-150">
      {/* Top Floating Control Bar */}
      <div className="sticky top-16 z-20 bg-white/95 backdrop-blur-md rounded-3xl border border-stone-200 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
            title="Back to Pages list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-stone-900 font-heading tracking-tight">
                {page.name}
              </h2>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                  page.status === 'Published'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                {page.status}
              </span>
            </div>
            <div className="text-[11px] text-stone-400 font-mono mt-0.5">
              Route: {page.route} • Last updated: {page.lastUpdated}
            </div>
          </div>
        </div>

        {/* Middle: View Mode Tabs */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-2xl border border-stone-200 self-center sm:self-auto">
          <button
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'edit' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`hidden md:block px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'split' ? 'bg-white text-stone-900 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'preview' ? 'bg-white text-emerald-800 shadow-2xs font-bold' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            Live Preview
          </button>
        </div>

        {/* Right: Save Draft & Publish Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-4 py-2 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 text-stone-600" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={handlePublish}
            disabled={saving}
            className="px-5 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Publish Page</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-900 text-white text-xs font-bold text-center shadow-lg animate-in slide-in-from-top duration-200">
          {toastMessage}
        </div>
      )}

      {/* Main Grid: Editor on Left, Live Preview on Right (if split or preview) */}
      <div className={`grid gap-6 ${viewMode === 'split' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* ================================================== */}
        {/* EDITOR PANEL (Shown in 'edit' or 'split') */}
        {/* ================================================== */}
        {viewMode !== 'preview' && (
          <div className="space-y-6">
            {/* Section List & Ordering Bar */}
            <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-stone-900 font-heading uppercase tracking-wider">
                    Page Sections ({page.sections?.length || 0})
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">Drag/Reorder, toggle visibility, and edit components</p>
                </div>

                <button
                  onClick={handleAddSection}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Section</span>
                </button>
              </div>

              {/* Sections List */}
              <div className="space-y-2.5">
                {page.sections?.map((sec: any, idx: number) => {
                  const isSelected = sec.id === activeSectionId;
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setActiveSectionId(sec.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-emerald-50/70 border-emerald-400 shadow-2xs'
                          : 'bg-stone-50 border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Up/Down buttons */}
                        <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronUp className="w-3 h-3 text-stone-600" />
                          </button>
                          <button
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === page.sections.length - 1}
                            className="p-1 rounded hover:bg-stone-200 disabled:opacity-30 cursor-pointer"
                          >
                            <ChevronDown className="w-3 h-3 text-stone-600" />
                          </button>
                        </div>

                        <div>
                          <div className="text-xs font-extrabold text-stone-900 flex items-center gap-2">
                            <span>{sec.title}</span>
                            <span className="text-[10px] font-mono font-medium text-stone-400">
                              ({sec.type})
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {sec.components?.length || 0} nested components • {sec.visible ? 'Visible' : 'Hidden'}
                          </div>
                        </div>
                      </div>

                      {/* Right controls */}
                      <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleToggleSectionVisibility(sec.id)}
                          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                            sec.visible
                              ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                              : 'bg-stone-200 text-stone-600 border-stone-300'
                          }`}
                        >
                          {sec.visible ? 'Visible' : 'Hidden'}
                        </button>
                        <button
                          onClick={() => handleDuplicateSection(sec.id)}
                          className="p-1.5 rounded-lg hover:bg-stone-200 text-stone-500 hover:text-stone-800"
                          title="Duplicate Section"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteSection(sec.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-100 text-stone-400 hover:text-rose-600"
                          title="Delete Section"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Section Detail & Nested Components Editor */}
            {activeSection && (
              <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-900 font-heading">
                      Section Content: {activeSection.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Configure layout type and customize component tree
                    </p>
                  </div>

                  <button
                    onClick={() => handleOpenAddComponent(activeSection.id)}
                    className="px-4 py-2 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Component</span>
                  </button>
                </div>

                {/* Section Settings (Title, Layout Type) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Section Title</label>
                    <input
                      type="text"
                      value={activeSection.title}
                      onChange={(e) => {
                        const updated = page.sections.map((s: any) =>
                          s.id === activeSection.id ? { ...s, title: e.target.value } : s
                        );
                        setPage({ ...page, sections: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700">Display Layout Type</label>
                    <select
                      value={activeSection.type}
                      onChange={(e) => {
                        const updated = page.sections.map((s: any) =>
                          s.id === activeSection.id ? { ...s, type: e.target.value } : s
                        );
                        setPage({ ...page, sections: updated });
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                    >
                      <option value="hero">Hero Header (Large Greeting)</option>
                      <option value="grid">Multi-Column Card Grid</option>
                      <option value="banner">Promotional Banner</option>
                      <option value="card">Standalone Soft Card</option>
                      <option value="list">Vertical List Items</option>
                      <option value="chart">Analytics Chart Widget</option>
                      <option value="alert">Alert / Advisory Warning</option>
                    </select>
                  </div>
                </div>

                {/* Components Tree */}
                <div className="space-y-3 pt-2">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">
                    Components in this Section ({activeSection.components?.length || 0})
                  </div>

                  <div className="space-y-2.5">
                    {activeSection.components?.map((comp: any, idx: number) => (
                      <div
                        key={comp.id || idx}
                        className="p-4 rounded-2xl bg-stone-50/80 border border-stone-200 hover:border-emerald-300 transition-all flex items-start justify-between gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                              {comp.type}
                            </span>
                            <span className="font-extrabold text-stone-900 text-xs">
                              {comp.title || 'Untitled Component'}
                            </span>
                          </div>
                          {comp.content && (
                            <p className="text-xs text-stone-600 line-clamp-2">{comp.content}</p>
                          )}
                          {comp.image && (
                            <div className="text-[11px] text-emerald-700 truncate max-w-xs">
                              Image: {comp.image}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleOpenEditComponent(comp)}
                            className="px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 hover:bg-stone-100 text-xs font-bold text-stone-700 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComponent(activeSection.id, comp.id)}
                            className="p-1.5 rounded-xl hover:bg-rose-100 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Remove component"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================== */}
        {/* LIVE PREVIEW PANEL (Shown in 'preview' or 'split') */}
        {/* ================================================== */}
        {viewMode !== 'edit' && (
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-stone-900 font-heading">
                  Farmer Live View Simulation
                </h3>
              </div>
              <span className="text-[11px] text-stone-400">100% WYSIWYG Rendering</span>
            </div>

            {/* Dynamic Rendering of Page Sections */}
            <div className="space-y-6 bg-[#fbfcf9] p-4 sm:p-6 rounded-2xl border border-stone-200">
              {page.sections
                ?.filter((sec: any) => sec.visible)
                .map((sec: any) => (
                  <div key={sec.id} className="space-y-3">
                    <div className="text-xs font-black uppercase tracking-wider text-stone-500 font-heading">
                      {sec.title}
                    </div>

                    {/* Section Type Layouts */}
                    {sec.type === 'hero' ? (
                      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 to-emerald-900 text-white p-6 shadow-sm border border-emerald-700/80 space-y-4">
                        {sec.components?.map((c: any) => (
                          <div key={c.id}>
                            {c.type === 'badge' && (
                              <span className="inline-block px-3 py-0.5 rounded-full bg-emerald-700/60 text-emerald-200 text-xs font-bold">
                                {c.title}
                              </span>
                            )}
                            {c.type === 'heading' && (
                              <h1 className="text-2xl font-extrabold text-white mt-2 font-heading">
                                {c.title}
                              </h1>
                            )}
                            {c.type === 'paragraph' && (
                              <p className="text-xs text-emerald-100 mt-1 max-w-lg">{c.title || c.content}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : sec.type === 'grid' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {sec.components?.map((c: any) => (
                          <div key={c.id} className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-1">
                            <div className="text-sm font-bold text-stone-900">{c.title}</div>
                            {c.content && <p className="text-xs text-stone-600">{c.content}</p>}
                          </div>
                        ))}
                      </div>
                    ) : sec.type === 'alert' ? (
                      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-1">
                        {sec.components?.map((c: any) => (
                          <div key={c.id}>
                            <div className="text-xs font-bold">{c.title}</div>
                            {c.content && <p className="text-xs text-amber-800">{c.content}</p>}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-2">
                        {sec.components?.map((c: any) => (
                          <div key={c.id} className="space-y-1">
                            <div className="text-sm font-bold text-stone-900">{c.title}</div>
                            {c.content && <p className="text-xs text-stone-600">{c.content}</p>}
                            {c.image && (
                              <img src={c.image} alt={c.title} className="w-full h-36 object-cover rounded-xl mt-2" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Component Modal */}
      {componentModalOpen && editingComponent && (
        <AdminModal
          isOpen={componentModalOpen}
          onClose={() => setComponentModalOpen(false)}
          title="Configure Component"
          subtitle="Define typography, content, icons, imagery, and routing"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Component Type</label>
                <select
                  value={editingComponent.type}
                  onChange={(e) => setEditingComponent({ ...editingComponent, type: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white"
                >
                  <option value="heading">Heading</option>
                  <option value="paragraph">Paragraph Text</option>
                  <option value="card">Card</option>
                  <option value="button">Interactive Button</option>
                  <option value="badge">Badge Pill</option>
                  <option value="image">Image Display</option>
                  <option value="statistic">Statistic Metric</option>
                  <option value="alert">Alert Notice</option>
                  <option value="weather">Weather Card</option>
                  <option value="crop">Crop Card</option>
                  <option value="product">Product Card</option>
                  <option value="scheme">Scheme Card</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Title / Label</label>
                <input
                  type="text"
                  value={editingComponent.title || ''}
                  onChange={(e) => setEditingComponent({ ...editingComponent, title: e.target.value })}
                  placeholder="e.g. Good Afternoon, Farmer"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Body Content / Description</label>
              <textarea
                rows={3}
                value={editingComponent.content || ''}
                onChange={(e) => setEditingComponent({ ...editingComponent, content: e.target.value })}
                placeholder="Component markdown or descriptive text content..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Icon / Emoji</label>
                <input
                  type="text"
                  value={editingComponent.icon || ''}
                  onChange={(e) => setEditingComponent({ ...editingComponent, icon: e.target.value })}
                  placeholder="🌱 or Sun"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-700">Target Route / Link</label>
                <input
                  type="text"
                  value={editingComponent.link || ''}
                  onChange={(e) => setEditingComponent({ ...editingComponent, link: e.target.value })}
                  placeholder="/my-farm or https://..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-700">Image URL</label>
              <input
                type="text"
                value={editingComponent.image || ''}
                onChange={(e) => setEditingComponent({ ...editingComponent, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs"
              />
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setComponentModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveComponentModal}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
              >
                Save Component
              </button>
            </div>
          </div>
        </AdminModal>
      )}
    </div>
  );
};
