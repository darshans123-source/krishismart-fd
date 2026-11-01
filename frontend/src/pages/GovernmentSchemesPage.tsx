import React, { useState } from 'react';
import {
  Landmark,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { GovernmentScheme } from '../types';

export const GovernmentSchemesPage: React.FC = () => {
  const { schemes, applyForScheme, user } = useFarmData();
  const { t } = useLanguage();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSchemeForModal, setSelectedSchemeForModal] = useState<GovernmentScheme | null>(null);

  const categories = ['All', 'Direct Income', 'Credit & Loan', 'Insurance', 'Equipment & Solar', 'Organic & Seeds'];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1 border border-blue-200">
            <Landmark className="w-3.5 h-3.5" />
            <span>Direct Benefit Transfer (DBT) & Subsidies</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">
            {t('govtSchemes')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078]">
            Central & State agricultural welfare schemes, eligibility checklists, and direct DBT assistance.
          </p>
        </div>
      </div>

      {/* Eligible Match Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 shrink-0">
            <Sparkles className="w-6 h-6 text-blue-300" />
          </div>
          <div>
            <div className="font-extrabold text-base font-heading">
              Personalized Scheme Match for {user?.name || 'Farmer'} ({user?.landSize || 6.5} Acres)
            </div>
            <p className="text-xs text-blue-200 mt-0.5">
              You are currently eligible for 5 central and state DBT subsidies in {user?.state || 'Karnataka'}.
            </p>
          </div>
        </div>

        <button
          onClick={() => setSelectedCategory('All')}
          className="px-4 py-2 rounded-xl bg-white/75 backdrop-blur-xl text-blue-950 text-xs font-extrabold hover:bg-blue-50 transition-colors shrink-0"
        >
          View Matched Subsidies
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/75 backdrop-blur-xl text-[#5A6E64] hover:bg-[#EFF4EF] border border-[#E5EDE7]'
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
            placeholder="Search PM-KISAN, KCC, Solar..."
            className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#E5EDE7] text-xs bg-white/75 backdrop-blur-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div
            key={scheme.id}
            className="bg-white/75 backdrop-blur-xl rounded-2xl border border-[#E5EDE7] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-400 hover:shadow-md transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {scheme.category}
                </span>
                <span
                  className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                    scheme.appliedStatus === 'Approved'
                      ? 'bg-[#D1FAE5] text-[#064E3B]'
                      : scheme.appliedStatus === 'In Progress'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-[#EFF4EF] text-[#5A6E64]'
                  }`}
                >
                  {scheme.appliedStatus || 'Not Applied'}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#172B24] font-heading group-hover:text-blue-700 transition-colors">
                {scheme.shortName}
              </h3>
              <p className="text-[11px] text-[#8A9A90] font-medium line-clamp-1">{scheme.name}</p>

              {/* Financial Benefit Callout */}
              <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#EFF4EF] text-xs text-[#243A32] font-bold mt-3">
                💰 {scheme.financialBenefit}
              </div>

              {/* Eligibility Preview */}
              <div className="mt-3 space-y-1 text-xs text-[#5A6E64]">
                <div className="font-bold text-[#3E5248] text-[11px]">Key Eligibility:</div>
                <p className="text-[11px] text-[#718078] line-clamp-2 leading-relaxed">
                  {scheme.eligibility[0]}
                </p>
              </div>
            </div>

            {/* Action Footer */}
            <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedSchemeForModal(scheme)}
                className="text-xs font-bold text-[#5A6E64] hover:text-blue-700 flex items-center gap-1"
              >
                <span>Full Checklist</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              {scheme.appliedStatus === 'Not Applied' ? (
                <button
                  onClick={() => applyForScheme(scheme.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  {t('applyNow')}
                </button>
              ) : (
                <span className="text-[11px] font-bold text-[#064E3B] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
                  <span>Enrolled</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* DETAILED SCHEME CHECKLIST MODAL */}
      {selectedSchemeForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#E5EDE7] space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-blue-700 uppercase">
                  {selectedSchemeForModal.category}
                </span>
                <h3 className="font-extrabold text-lg text-[#172B24] font-heading">
                  {selectedSchemeForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSchemeForModal(null)}
                className="text-[#8A9A90] hover:text-[#3E5248] text-base"
              >
                ✕
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
              <div className="font-bold text-blue-900">Financial Assistance & Subsidy</div>
              <p className="text-blue-800 font-semibold">{selectedSchemeForModal.financialBenefit}</p>
            </div>

            <div className="w-full min-w-0 space-y-2 text-xs">
              <div className="font-bold text-[#243A32] uppercase text-[10px] tracking-wider">
                Eligibility Criteria
              </div>
              <ul className="w-full min-w-0 space-y-1.5 text-[#5A6E64]">
                {selectedSchemeForModal.eligibility.map((el, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
                    <span>{el}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="w-full min-w-0 space-y-2 text-xs">
              <div className="font-bold text-[#243A32] uppercase text-[10px] tracking-wider">
                Required Documents Checklist
              </div>
              <ul className="w-full min-w-0 space-y-1.5 text-[#5A6E64]">
                {selectedSchemeForModal.documentsRequired.map((doc, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between gap-3">
              <a
                href={selectedSchemeForModal.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Official Govt Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {selectedSchemeForModal.appliedStatus === 'Not Applied' && (
                <button
                  onClick={() => {
                    applyForScheme(selectedSchemeForModal.id);
                    setSelectedSchemeForModal(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md"
                >
                  Initiate Application
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
