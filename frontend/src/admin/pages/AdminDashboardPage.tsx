import React, { useEffect, useState } from 'react';
import {
  Users,
  Wheat,
  Store,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  Bell,
  Activity,
  Sliders,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { adminApi } from '../services/adminApi';
import { AdminTab } from '../components/AdminSidebar';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: AdminTab) => void;
  onNavigateFarmer: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onNavigateTab, onNavigateFarmer }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminApi.stats.get();
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    { month: 'Apr', users: 1200, crops: 2400 },
    { month: 'May', users: 1540, crops: 3100 },
    { month: 'Jun', users: 1890, crops: 3800 },
    { month: 'Jul', users: 2150, crops: 4250 },
    { month: 'Aug', users: 2340, crops: 4620 },
    { month: 'Sep', users: 2450, crops: 4821 }
  ];

  const distributionData = [
    { category: 'Paddy', count: 1840 },
    { category: 'Sugarcane', count: 1250 },
    { category: 'Tomato', count: 980 },
    { category: 'Cotton', count: 520 },
    { category: 'Ragi', count: 231 }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-950 text-white p-6 sm:p-8 shadow-sm border border-emerald-700/60 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-emerald-200 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Precision Agriculture Operations Console</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight">
              Platform Overview & Control
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 max-w-xl">
              Real-time synchronization across telemetry, multi-lingual agricultural advisories, and APMC market intelligence.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => onNavigateTab('dashboard-editor')}
              className="px-4 py-2.5 rounded-2xl bg-white text-stone-900 hover:bg-emerald-50 text-xs font-extrabold flex items-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <Sliders className="w-4 h-4 text-emerald-700" />
              <span>Edit Dashboard</span>
            </button>
            <button
              onClick={() => onNavigateTab('crops')}
              className="px-4 py-2.5 rounded-2xl bg-emerald-700/60 hover:bg-emerald-700 border border-emerald-500/40 text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wheat className="w-4 h-4 text-emerald-300" />
              <span>Manage Crops</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Users */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">Users</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-heading">
            {stats ? Number(stats.totalUsers).toLocaleString() : '2,450'}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+12.4% this month</span>
          </div>
        </div>

        {/* Active Farmers */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">Farmers</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-heading">
            {stats ? Number(stats.activeFarmers).toLocaleString() : '1,982'}
          </div>
          <div className="text-[11px] text-stone-500 font-semibold mt-1">Verified landholding RTCs</div>
        </div>

        {/* Total Crops */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">Crops</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-700">
              <Wheat className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-heading">
            {stats ? Number(stats.totalCrops).toLocaleString() : '4,821'}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-1">Monitored acres</div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">Products</span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Store className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-heading">
            {stats ? stats.totalProducts : 356}
          </div>
          <div className="text-[11px] text-teal-700 font-semibold mt-1">Agri store catalog</div>
        </div>

        {/* Government Schemes */}
        <div className="p-5 rounded-3xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">Schemes</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-stone-900 mt-2 font-heading">
            {stats ? stats.totalSchemes : 82}
          </div>
          <div className="text-[11px] text-purple-700 font-semibold mt-1">Active state subsidies</div>
        </div>
      </div>

      {/* Quick Actions Shortcuts Bar */}
      <div className="bg-white rounded-3xl border border-stone-200 p-5 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-stone-500 uppercase tracking-wider font-heading">
            Admin Management Actions
          </h2>
          <span className="text-[11px] text-stone-500">Quick shortcuts to content managers</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={() => onNavigateTab('dashboard-editor')}
            className="p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-left transition-all cursor-pointer group"
          >
            <Sliders className="w-5 h-5 text-emerald-700 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold">Edit Dashboard</div>
            <div className="text-[10px] text-emerald-800/80">Hero, greeting & cards</div>
          </button>

          <button
            onClick={() => onNavigateTab('crops')}
            className="p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-left transition-all cursor-pointer group"
          >
            <Wheat className="w-5 h-5 text-amber-700 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold">Manage Crops</div>
            <div className="text-[10px] text-amber-800/80">Add, edit & stages</div>
          </button>

          <button
            onClick={() => onNavigateTab('market')}
            className="p-3.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-left transition-all cursor-pointer group"
          >
            <TrendingUp className="w-5 h-5 text-blue-700 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold">Manage Market</div>
            <div className="text-[10px] text-blue-800/80">Update APMC rates</div>
          </button>

          <button
            onClick={() => onNavigateTab('schemes')}
            className="p-3.5 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-left transition-all cursor-pointer group"
          >
            <ShieldCheck className="w-5 h-5 text-purple-700 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold">Manage Schemes</div>
            <div className="text-[10px] text-purple-800/80">Subsidies & deadlines</div>
          </button>

          <button
            onClick={() => onNavigateTab('store')}
            className="p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-left transition-all cursor-pointer group"
          >
            <Store className="w-5 h-5 text-teal-700 mb-1 group-hover:scale-110 transition-transform" />
            <div className="text-xs font-bold">Manage Store</div>
            <div className="text-[10px] text-teal-800/80">Products & stock</div>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Growth Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 font-heading">
                Farmer Onboarding & Acreage Growth
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Platform adoption across Karnataka agricultural zones</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Active Sync
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="#16a34a" strokeWidth={3} fill="url(#userGrad)" name="Registered Farmers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Crop Distribution Bar Chart */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 font-heading">
                Top Cultivated Crops
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Acreage breakdown</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distributionData} layout="vertical" margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={11} width={70} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1c1917',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#15803d" radius={[0, 8, 8, 0]} name="Acreage (Acres)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Recent Activity & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-stone-900 font-heading">
                Recent Admin Operations
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">Live audit log of all content modifications</p>
            </div>
            <button
              onClick={() => onNavigateTab('activity')}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>View Full Log</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/70 border-b border-stone-200 text-stone-500 font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Admin</th>
                  <th className="py-2.5 px-3">Action</th>
                  <th className="py-2.5 px-3">Module / Page</th>
                  <th className="py-2.5 px-3">Details</th>
                  <th className="py-2.5 px-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {stats && stats.recentActivities && stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((act: any) => (
                    <tr key={act.id} className="hover:bg-stone-50/60 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-stone-900">{act.adminName}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[10px]">
                          {act.action}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{act.page}</td>
                      <td className="py-2.5 px-3 text-stone-500 max-w-xs truncate">{act.record || '—'}</td>
                      <td className="py-2.5 px-3 text-right text-stone-400">
                        {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-stone-400">
                      No recent activities recorded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health Card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-stone-900 font-heading">
              Platform Status
            </h3>
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Backend REST API</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">Operational (5000/api)</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Persistence Storage</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">Atomic JSON File DB Synchronized</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
              <div className="text-xs font-bold text-emerald-950 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>IoT & Telemetry Bridge</span>
              </div>
              <div className="text-[11px] text-emerald-800 mt-1">{stats ? stats.activeSensors : 5} Active Sensor Probes Online</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
