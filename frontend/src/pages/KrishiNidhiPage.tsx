import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Plus,
  Landmark,
  ShieldCheck,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  HelpCircle,
  FileText
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
  Bar,
  Legend
} from 'recharts';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';

export const KrishiNidhiPage: React.FC = () => {
  const { financialSummary, transactions, addTransaction } = useFarmData();
  const { t } = useLanguage();

  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Income');
  const [txCategory, setTxCategory] = useState<any>('Crop Sales');
  const [txAmount, setTxAmount] = useState<number>(25000);
  const [txDescription, setTxDescription] = useState('');
  const [txCrop, setTxCrop] = useState('Tomato');

  const monthlyCashflowData = [
    { month: 'Apr', Income: 120000, Expenses: 35000, Net: 85000 },
    { month: 'May', Income: 342250, Expenses: 42000, Net: 300250 },
    { month: 'Jun', Income: 18000, Expenses: 28000, Net: -10000 },
    { month: 'Jul', Income: 4000, Expenses: 19800, Net: -15800 },
    { month: 'Aug', Income: 144000, Expenses: 18000, Net: 126000 },
  ];

  const categoryBreakdownData = [
    { category: 'Seeds & Saplings', amount: 18500 },
    { category: 'Fertilizer & Nutrition', amount: 24800 },
    { category: 'Labor & Weeding', amount: 38000 },
    { category: 'Drip & Machinery Fuel', amount: 26500 },
    { category: 'Pesticides & Bio', amount: 15000 },
    { category: 'Transport & Logistics', amount: 20000 },
  ];

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txDescription.trim()) return;
    addTransaction({
      type: txType,
      category: txCategory,
      amount: txAmount,
      date: new Date().toISOString().split('T')[0],
      description: txDescription,
      cropAssociated: txCrop
    });
    setTxDescription('');
    setShowAddTxModal(false);
  };

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D1FAE5] text-[#064E3B] text-xs font-bold mb-1 border border-[#A7F3D0]">
            <Coins className="w-3.5 h-3.5" />
            <span>Farm Financial Operating System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            {t('krishiNidhi')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Track farm cash flow, crop ROI margins, Kisan Credit Card score, and government subsidies.
          </p>
        </div>

        <button
          onClick={() => setShowAddTxModal(true)}
          className="px-4 py-2.5 rounded-2xl btn-clay-primary text-white text-xs font-bold shadow-md shadow-[#059669]/20 transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Record Entry</span>
        </button>
      </div>

      {/* 1. TOP FINANCIAL KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#8A9A90]">Total Income</span>
            <div className="w-8 h-8 rounded-xl bg-[#D1FAE5] text-[#064E3B] flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172B24] font-heading">
            ₹{financialSummary.totalIncome.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#059669] font-semibold mt-1 flex items-center gap-1">
            <span>+18.4% vs last Rabi season</span>
          </div>
        </div>

        {/* Total Expenses */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#8A9A90]">Total Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-[#172B24] font-heading">
            ₹{financialSummary.totalExpenses.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#718078] font-medium mt-1">
            Input cost per acre: ₹21,969
          </div>
        </div>

        {/* Net Profit */}
        <div className="glass-card p-5 rounded-2xl bg-gradient-to-br from-[#064E3B] to-teal-950 text-white">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#6EE7B7]">Net Farm Profit</span>
            <div className="w-8 h-8 rounded-xl bg-white/10 text-[#6EE7B7] flex items-center justify-center border border-white/20">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-heading">
            ₹{financialSummary.netProfit.toLocaleString('en-IN')}
          </div>
          <div className="text-xs text-[#A7F3D0] font-semibold mt-1">
            ROI Margin: <strong>{financialSummary.profitMargin}%</strong>
          </div>
        </div>

        {/* Kisan Credit Score & Loan Eligibility */}
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase font-bold text-[#8A9A90]">KCC Credit Health</span>
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-800 font-heading flex items-center gap-2">
            <span>785</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Excellent
            </span>
          </div>
          <div className="text-xs text-[#718078] font-medium mt-1">
            Pre-approved loan: ₹{financialSummary.loanEligibilityAmount.toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* 2. RECHARTS CASHFLOW & EXPENSE GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cashflow Trend AreaChart */}
        <div className="lg:col-span-8 bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
            <div>
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                Monthly Agricultural Cashflow & Margins
              </h3>
              <p className="text-xs text-[#718078]">Income vs. Farm Input Expenses (FY 2026-27)</p>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#D1FAE5] text-[#064E3B] text-[10px] font-bold">
              Surplus Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyCashflowData}>
                <defs>
                  <linearGradient id="incomeColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip formatter={(val: any) => `₹${val.toLocaleString('en-IN')}`} />
                <Area
                  type="monotone"
                  dataKey="Income"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#incomeColor)"
                />
                <Area
                  type="monotone"
                  dataKey="Expenses"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#expenseColor)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Expense Category Breakdown BarChart */}
        <div className="lg:col-span-4 bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-4">
          <div className="border-b border-[#EFF4EF] pb-3">
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Expense Allocation
            </h3>
            <p className="text-xs text-[#718078]">Major operational cost drivers</p>
          </div>

          <div className="w-full min-w-0 space-y-3 text-xs">
            {categoryBreakdownData.map((cat, i) => (
              <div key={i} className="w-full min-w-0 space-y-1">
                <div className="flex justify-between font-bold text-[#3E5248]">
                  <span>{cat.category}</span>
                  <span>₹{cat.amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-[#EFF4EF] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#059669] h-full rounded-full"
                    style={{ width: `${(cat.amount / 38000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. TRANSACTION LEDGER TABLE */}
      <div className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
          <div>
            <h3 className="font-extrabold text-base text-[#172B24] font-heading">
              Recent Financial Transactions & DBT Subsidies
            </h3>
            <p className="text-xs text-[#718078]">
              Verified income receipts, fertilizer invoices, and mandi payouts.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E5EDE7] text-[#8A9A90] font-bold uppercase text-[10px]">
                <th className="py-3 px-2">Type</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Description</th>
                <th className="py-3 px-2">Crop / Entity</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFF4EF]">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#F7FAF7]/80 transition-colors">
                  <td className="py-3 px-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        tx.type === 'Income'
                          ? 'bg-[#D1FAE5] text-[#064E3B]'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="py-3 px-2 font-bold text-[#243A32]">{tx.category}</td>
                  <td className="py-3 px-2 text-[#5A6E64]">{tx.description}</td>
                  <td className="py-3 px-2 text-[#718078] font-medium">{tx.cropAssociated || 'General Farm'}</td>
                  <td className="py-3 px-2 text-[#8A9A90]">{tx.date}</td>
                  <td className={`py-3 px-2 text-right font-black text-sm ${tx.type === 'Income' ? 'text-[#064E3B]' : 'text-rose-600'}`}>
                    {tx.type === 'Income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECORD TRANSACTION MODAL */}
      {showAddTxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#E5EDE7] space-y-4">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">
                Record Financial Entry
              </h3>
              <button onClick={() => setShowAddTxModal(false)} className="text-[#8A9A90] hover:text-[#3E5248]">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTxSubmit} className="w-full min-w-0 space-y-3.5 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTxType('Income')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    txType === 'Income'
                      ? 'bg-[#059669] text-white shadow-xs'
                      : 'bg-[#EFF4EF] text-[#5A6E64]'
                  }`}
                >
                  + Income (Sale / Subsidy)
                </button>
                <button
                  type="button"
                  onClick={() => setTxType('Expense')}
                  className={`py-2 rounded-xl font-bold transition-all ${
                    txType === 'Expense'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-[#EFF4EF] text-[#5A6E64]'
                  }`}
                >
                  - Expense (Cost)
                </button>
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Category</label>
                <select
                  value={txCategory}
                  onChange={(e) => setTxCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs bg-white/75 backdrop-blur-xl"
                >
                  {txType === 'Income' ? (
                    <>
                      <option value="Crop Sales">Crop Sales (Mandi / Trader)</option>
                      <option value="Subsidies">Government Subsidies (DBT)</option>
                      <option value="Livestock">Dairy / Livestock</option>
                      <option value="Other">Other Revenue</option>
                    </>
                  ) : (
                    <>
                      <option value="Fertilizer">Fertilizer & Nutrients</option>
                      <option value="Seeds">Seeds & Seedlings</option>
                      <option value="Labor">Labor & Wages</option>
                      <option value="Machinery/Fuel">Machinery & Diesel</option>
                      <option value="Pesticides">Crop Protection</option>
                      <option value="Other">Other Operational Cost</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={txAmount}
                  onChange={(e) => setTxAmount(parseInt(e.target.value) || 0)}
                  required
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-[#3E5248] mb-1">Description</label>
                <input
                  type="text"
                  value={txDescription}
                  onChange={(e) => setTxDescription(e.target.value)}
                  placeholder="e.g. 20 quintals Tomato sold to APMC trader"
                  required
                  className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl btn-clay-primary text-white font-bold text-sm shadow-md transition-all mt-2"
              >
                Save Transaction (+30 XP)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
