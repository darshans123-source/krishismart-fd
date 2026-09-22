import React, { useState, useEffect } from 'react';
import { 
  Activity, Search, Filter, RefreshCw, Calendar, 
  User, CheckCircle2, Clock, ArrowUpDown 
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

interface ActivityLog {
  id: string;
  adminName: string;
  adminEmail: string;
  action: string;
  page: string;
  record?: string;
  recordTitle?: string;
  timestamp: string;
}

export const AdminActivityLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await adminApi.activity.getAll();
      if (res && res.data) {
        setLogs(res.data);
      }
    } catch (e) {
      console.error('Failed to load activity logs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.adminName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.page.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.recordTitle && log.recordTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesAction = selectedAction === 'all' || log.page === selectedAction;
    return matchesSearch && matchesAction;
  });

  const uniquePages = Array.from(new Set(logs.map(l => l.page)));

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            Immutable Audit Trail & Compliance
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight font-heading">
            System Activity & Audit Logs
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time chronological record of content updates, crop edits, publish actions, and administrative operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchLogs}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 bg-white hover:bg-stone-50 text-xs font-bold transition cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Logs
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search logs by staff name, action, or affected record..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600/30 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-stone-50 focus:ring-2 focus:ring-emerald-600/30"
          >
            <option value="all">All Modules</option>
            {uniquePages.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      {loading ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
          <p className="text-xs text-stone-500">Reading audit trail...</p>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center">
          <Activity className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-stone-800">No activity recorded</h3>
          <p className="text-xs text-stone-500 mt-1">Actions performed in the admin portal will appear here automatically.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/80 border-b border-stone-200 text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Timestamp</th>
                  <th className="py-3.5 px-4">Admin User</th>
                  <th className="py-3.5 px-4">Action</th>
                  <th className="py-3.5 px-4">Module</th>
                  <th className="py-3.5 px-5">Target Record</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
                {filteredLogs.map(item => (
                  <tr key={item.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-4 px-5 text-stone-500 font-mono text-[11px] whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(item.timestamp).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        })}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[11px] shrink-0">
                          {item.adminName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{item.adminName}</div>
                          <div className="text-[10px] text-stone-400 font-mono">{item.adminEmail}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 font-semibold text-stone-800 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {item.action}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-medium text-stone-600">
                      {item.page}
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-bold text-stone-900">
                        {item.record || item.recordTitle || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
