import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Plus, Edit2, Trash2, Key, 
  CheckCircle2, RefreshCw, Lock, Mail, User, Shield 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdminAuth } from '../auth/AdminAuthContext';
import { AdminModal } from '../components/AdminModal';
import { AdminConfirmModal } from '../components/AdminConfirmModal';

interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor';
  active: boolean;
  lastLogin?: string;
}

const ROLE_DESCRIPTIONS: Record<string, { label: string; desc: string; badge: string }> = {
  super_admin: { 
    label: 'Super Admin', 
    desc: 'Total control across platform, admins, system security, and database',
    badge: 'bg-rose-100 text-rose-800 border-rose-200'
  },
  admin: { 
    label: 'Admin', 
    desc: 'Full access to content, farmers, crops, schemes, store, and settings',
    badge: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  editor: { 
    label: 'Content Editor', 
    desc: 'Limited to editing CMS pages, crop guides, AI articles, and prices',
    badge: 'bg-blue-100 text-blue-800 border-blue-200'
  }
};

export const AdminUsersRolesPage: React.FC = () => {
  const { admin: currentAdmin } = useAdminAuth();
  const [admins, setAdmins] = useState<AdminAccount[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminAccount | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminAccount | null>(null);
  const [saving, setSaving] = useState(false);

  // Form
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'editor';
    password?: string;
  }>({
    name: '',
    email: '',
    role: 'editor',
    password: ''
  });

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const res = await adminApi.adminUsers.getAll();
      if (res && res.data) {
        setAdmins(res.data);
      }
    } catch (e: any) {
      console.error('Failed to load admin users:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleOpenCreate = () => {
    setEditingAdmin(null);
    setFormData({
      name: '',
      email: '',
      role: 'editor',
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (acc: AdminAccount) => {
    setEditingAdmin(acc);
    setFormData({
      name: acc.name,
      email: acc.email,
      role: acc.role,
      password: ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (editingAdmin) {
        await adminApi.adminUsers.update(editingAdmin.id, formData);
      } else {
        if (!formData.password) {
          alert('Password is required for new admin user.');
          return;
        }
        await adminApi.adminUsers.create(formData);
      }
      setIsModalOpen(false);
      await fetchAdmins();
    } catch (e: any) {
      console.error('Failed to save admin user:', e);
      alert(e.message || 'Operation failed. Requires Super Admin permissions.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await adminApi.adminUsers.delete(deleteTarget.id);
      setDeleteTarget(null);
      await fetchAdmins();
    } catch (e: any) {
      console.error('Failed to delete admin:', e);
      alert(e.message || 'Failed to remove admin.');
    }
  };

  const isSuperAdmin = currentAdmin?.role === 'super_admin';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-semibold mb-2">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            Security & Role-Based Access Control (RBAC)
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            Admin Staff & Permissions
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage administrative personnel, assign granular permission tiers, and enforce authentication security.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchAdmins}
            className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 transition"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          {isSuperAdmin && (
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Admin User
            </button>
          )}
        </div>
      </div>

      {!isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center gap-2.5">
          <Shield className="w-5 h-5 text-amber-600 shrink-0" />
          <span>
            You are logged in as an <strong>{currentAdmin?.role}</strong>. Only <strong>Super Admins</strong> can create or delete staff accounts.
          </span>
        </div>
      )}

      {/* Role Matrix Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(ROLE_DESCRIPTIONS).map(([k, v]) => (
          <div key={k} className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold border ${v.badge}`}>
                {v.label}
              </span>
              <span className="text-xs font-bold text-stone-400">
                {admins.filter(a => a.role === k).length} Accounts
              </span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed pt-1">
              {v.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Admin Users Table */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Checking credentials...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Staff Member</th>
                  <th className="py-3.5 px-4">Role Tier</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Activity</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {admins.map(acc => {
                  const roleConfig = ROLE_DESCRIPTIONS[acc.role] || { label: acc.role, badge: 'bg-stone-100 text-stone-700' };
                  const isCurrent = acc.email === currentAdmin?.email;

                  return (
                    <tr key={acc.id} className="hover:bg-stone-50/60 transition">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-stone-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0">
                            {acc.name ? acc.name.charAt(0).toUpperCase() : 'A'}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 flex items-center gap-2">
                              {acc.name}
                              {isCurrent && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-stone-400 font-mono">{acc.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${roleConfig.badge}`}>
                          {roleConfig.label}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          acc.active ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${acc.active ? 'bg-emerald-600' : 'bg-stone-400'}`} />
                          {acc.active ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-stone-500 text-[11px]">
                        {acc.lastLogin || 'Recent'}
                      </td>

                      <td className="py-4 px-5 text-right">
                        {isSuperAdmin && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(acc)}
                              className="p-1.5 rounded-lg text-stone-500 hover:text-emerald-700 hover:bg-stone-100 transition"
                              title="Edit Permissions"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {!isCurrent && (
                              <button
                                onClick={() => setDeleteTarget(acc)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Revoke Access"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit/Create Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingAdmin ? 'Update Staff Permissions' : 'Create Staff Account'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {editingAdmin ? 'Reset Password (leave empty to keep current)' : 'Initial Password *'}
            </label>
            <input
              type="password"
              value={formData.password || ''}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={editingAdmin ? '••••••••' : 'Minimum 6 characters'}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Permission Role Tier *</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30"
            >
              <option value="editor">Content Editor (CMS editing only)</option>
              <option value="admin">Admin (CMS, Users, Settings, Products, Schemes)</option>
              <option value="super_admin">Super Admin (Full Root Access)</option>
            </select>
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
              {saving ? 'Saving...' : editingAdmin ? 'Save Changes' : 'Create Account'}
            </button>
          </div>
        </form>
      </AdminModal>

      {/* Delete confirmation */}
      <AdminConfirmModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Revoke Admin Access"
        message={`Are you sure you want to permanently revoke administrative access for "${deleteTarget?.name}" (${deleteTarget?.email})?`}
      />
    </div>
  );
};
