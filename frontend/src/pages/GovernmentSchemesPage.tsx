import React, { useState } from 'react';
import { Landmark, CheckCircle2, FileText, ExternalLink, ChevronRight, Search, Upload } from 'lucide-react';
import { useFarmData } from '../context/FarmDataContext';
import { useLanguage } from '../context/LanguageContext';
import { GovernmentScheme, SchemeApplication } from '../types';

/*
  GOVERNMENT SCHEMES — real application workflow, no fake portal claim.
  Apply Now opens a scheme-specific form (details, eligibility, required
  documents shown above the form). Mandatory fields are validated with
  inline errors. Save Draft stores a Draft; Submit stores a Submitted
  application with a unique reference (KS-YYYY-XXXXXX) in KrishiSmart
  (localStorage via context) and shows confirmation ONLY after that save.
  A Submitted application here is NOT a government submission: the card
  and the confirmation both point to the scheme's official portal, where
  the farmer must complete the official step. Document uploads record
  file names only — files are not sent to a government server by this app.
*/
interface FormState { farmerName: string; phone: string; village: string; district: string; landAcres: string; bankAccountAvailable: boolean; documents: string[]; }

export const GovernmentSchemesPage: React.FC = () => {
  const { schemes, schemeApplications, saveSchemeApplication, user } = useFarmData();
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [detailsScheme, setDetailsScheme] = useState<GovernmentScheme | null>(null);
  const [formScheme, setFormScheme] = useState<GovernmentScheme | null>(null);
  const [form, setForm] = useState<FormState>({ farmerName: user?.name || '', phone: '', village: '', district: '', landAcres: '', bankAccountAvailable: false, documents: [] });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmation, setConfirmation] = useState<SchemeApplication | null>(null);
  const [showApplications, setShowApplications] = useState(false);

  const categories = ['All', 'Direct Income', 'Credit & Loan', 'Insurance', 'Equipment & Solar', 'Organic & Seeds', 'Irrigation'];
  const filteredSchemes = schemes.filter((s) => {
    const matchesCat = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.shortName.toLowerCase().includes(searchQuery.toLowerCase()) || s.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const openForm = (scheme: GovernmentScheme) => {
    setFormScheme(scheme); setConfirmation(null); setErrors({});
    setForm((f) => ({ ...f, farmerName: f.farmerName || user?.name || '' }));
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.farmerName.trim()) e.farmerName = 'Full name is required.';
    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = 'Enter a valid 10-digit Indian mobile number starting with 6–9.';
    if (!form.village.trim()) e.village = 'Village is required.';
    if (!form.district.trim()) e.district = 'District is required.';
    const acres = parseFloat(form.landAcres);
    if (!Number.isFinite(acres) || acres <= 0) e.landAcres = 'Enter land area in acres greater than 0.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildApp = (status: SchemeApplication['status']): SchemeApplication => ({
    id: `app-${Date.now()}`, schemeId: formScheme!.id, schemeName: formScheme!.name,
    reference: `KS-${new Date().getFullYear()}-${String(Math.floor(100000 + Math.random() * 900000))}`,
    status, farmerName: form.farmerName.trim(), phone: form.phone.trim(), village: form.village.trim(),
    district: form.district.trim(), landAcres: parseFloat(form.landAcres), documents: form.documents,
    submittedAt: new Date().toISOString(), governmentSubmitted: false,
  });

  const handleSaveDraft = () => {
    if (!formScheme) return;
    const app = buildApp('Draft');
    saveSchemeApplication(app);
    setConfirmation(app); setFormScheme(null);
  };
  const handleSubmit = () => {
    if (!formScheme || !validate()) return;
    const app = buildApp('Submitted');
    saveSchemeApplication(app);
    setConfirmation(app); setFormScheme(null);
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = { Draft: 'bg-[#EFF4EF] text-[#5A6E64]', Submitted: 'bg-blue-100 text-blue-800', 'Under Review': 'bg-amber-100 text-amber-800', Approved: 'bg-[#D1FAE5] text-[#064E3B]', Rejected: 'bg-rose-100 text-rose-800' };
    return map[status] || map.Draft;
  };

  return (
    <div className="w-full min-w-0 space-y-8 pb-12 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold mb-1 border border-blue-200"><Landmark className="w-3.5 h-3.5" /><span>Direct Benefit Transfer (DBT) & Subsidies</span></div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172B24] font-heading">{t('govtSchemes')}</h1>
          <p className="text-xs sm:text-sm text-[#718078]">Central & State agricultural welfare schemes, eligibility checklists, and application tracking in KrishiSmart. Applying here saves your application in KrishiSmart — the official government step must still be completed on the official portal linked for each scheme.</p>
        </div>
        <button onClick={() => setShowApplications((v) => !v)} className="px-4 py-2.5 rounded-xl bg-[#065F46] text-white text-xs font-bold shrink-0">My Applications ({schemeApplications.length})</button>
      </div>

      {showApplications && (
        <div className="bg-white rounded-2xl border border-[#E5EDE7] p-5 space-y-3">
          <h2 className="font-extrabold text-[#172B24] font-heading">My Applications</h2>
          {schemeApplications.length === 0 ? <p className="text-sm text-[#718078]">No applications yet. Use Apply Now on a scheme to create one.</p> : schemeApplications.map((a) => {
            const scheme = schemes.find((s) => s.id === a.schemeId);
            return (
              <div key={a.id} className="p-4 rounded-2xl bg-[#F3F6F4] space-y-1 text-xs">
                <div className="flex flex-wrap justify-between gap-2"><strong className="text-sm">{a.schemeName}</strong><span className={`font-bold px-2 py-0.5 rounded-full ${statusBadge(a.status)}`}>{a.status}</span></div>
                <p>Reference: <strong>{a.reference}</strong> · {new Date(a.submittedAt).toLocaleString('en-IN')} · {a.farmerName} · {a.village}, {a.district} · {a.landAcres} acres</p>
                {a.documents.length > 0 && <p>Documents attached (names only): {a.documents.join(', ')}</p>}
                <p className="text-[#718078]">Status in KrishiSmart. This is not a government submission — complete the official step on the portal below.</p>
                {scheme && <a href={scheme.officialUrl} target="_blank" rel="noreferrer" className="font-bold text-blue-700 hover:underline inline-flex items-center gap-1">Official portal <ExternalLink className="w-3.5 h-3.5" /></a>}
              </div>
            );
          })}
        </div>
      )}

      {confirmation && (
        <div className="p-5 rounded-2xl bg-[#ECFDF5] border border-[#A7F3D0] space-y-2">
          <p className="font-extrabold text-[#065F46] flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> {confirmation.status === 'Draft' ? 'Draft saved' : 'Application saved successfully'}</p>
          <p className="text-sm text-[#064E3B]">Reference number: <strong>{confirmation.reference}</strong> · Scheme: {confirmation.schemeName} · Status: {confirmation.status}</p>
          {confirmation.status === 'Submitted' && <p className="text-xs text-[#065F46]">Your application is saved in KrishiSmart and appears in My Applications. It has NOT been submitted to a government department by this app — please complete the official submission on the portal: {schemes.find((s) => s.id === confirmation.schemeId)?.officialUrl}</p>}
          <button onClick={() => setConfirmation(null)} className="text-xs font-bold text-[#065F46] underline">Dismiss</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex gap-1.5 overflow-x-auto w-full md:w-auto pb-1">
          {categories.map((cat) => <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 ${selectedCategory === cat ? 'bg-blue-600 text-white' : 'bg-white text-[#5A6E64] border border-[#E5EDE7]'}`}>{cat}</button>)}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9A90]" />
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search PM-KISAN, KCC, Solar..." className="w-full pl-9 pr-4 py-2 rounded-2xl border border-[#E5EDE7] text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="bg-white rounded-2xl border border-[#E5EDE7] p-6 shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">{scheme.category}</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${scheme.appliedStatus === 'Approved' ? 'bg-[#D1FAE5] text-[#064E3B]' : scheme.appliedStatus === 'In Progress' ? 'bg-amber-100 text-amber-800' : 'bg-[#EFF4EF] text-[#5A6E64]'}`}>{scheme.appliedStatus || 'Not Applied'}</span>
              </div>
              <h3 className="font-extrabold text-base text-[#172B24] font-heading">{scheme.shortName}</h3>
              <p className="text-[11px] text-[#8A9A90] font-medium">{scheme.name}</p>
              <div className="p-3 rounded-2xl bg-[#F7FAF7] border border-[#EFF4EF] text-xs text-[#243A32] font-bold mt-3">💰 {scheme.financialBenefit}</div>
              <p className="text-[11px] text-[#718078] mt-3 leading-relaxed">{scheme.eligibility[0]}</p>
            </div>
            <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between gap-2">
              <button onClick={() => setDetailsScheme(scheme)} className="text-xs font-bold text-[#5A6E64] hover:text-blue-700 flex items-center gap-1">Full Checklist <ChevronRight className="w-3.5 h-3.5" /></button>
              <button onClick={() => openForm(scheme)} className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">{t('applyNow')}</button>
            </div>
          </div>
        ))}
      </div>

      {detailsScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <div><span className="text-[10px] font-extrabold text-blue-700 uppercase">{detailsScheme.category}</span><h3 className="font-extrabold text-lg text-[#172B24] font-heading">{detailsScheme.name}</h3></div>
              <button onClick={() => setDetailsScheme(null)} className="text-[#8A9A90] hover:text-[#3E5248] text-base">✕</button>
            </div>
            <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1"><div className="font-bold text-blue-900">Financial Assistance & Subsidy</div><p className="text-blue-800 font-semibold">{detailsScheme.financialBenefit}</p></div>
            <div className="space-y-2 text-xs"><div className="font-bold uppercase text-[10px] tracking-wider">Eligibility Criteria</div><ul className="space-y-1.5 text-[#5A6E64]">{detailsScheme.eligibility.map((el, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" /><span>{el}</span></li>)}</ul></div>
            <div className="space-y-2 text-xs"><div className="font-bold uppercase text-[10px] tracking-wider">Required Documents Checklist</div><ul className="space-y-1.5 text-[#5A6E64]">{detailsScheme.documentsRequired.map((doc, i) => <li key={i} className="flex gap-2"><FileText className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" /><span>{doc}</span></li>)}</ul></div>
            <div className="pt-3 border-t border-[#EFF4EF] flex items-center justify-between gap-3">
              <a href={detailsScheme.officialUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1">Official Govt Portal <ExternalLink className="w-3.5 h-3.5" /></a>
              <button onClick={() => { setDetailsScheme(null); openForm(detailsScheme); }} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">Apply Now</button>
            </div>
          </div>
        </div>
      )}

      {formScheme && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#022C22]/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EFF4EF] pb-3">
              <div><span className="text-[10px] font-extrabold text-blue-700 uppercase">Application form</span><h3 className="font-extrabold text-lg text-[#172B24] font-heading">{formScheme.name}</h3><p className="text-xs text-[#718078]">{formScheme.financialBenefit}</p></div>
              <button onClick={() => setFormScheme(null)} className="text-[#8A9A90] hover:text-[#3E5248] text-base">✕</button>
            </div>
            <div className="text-xs text-[#5A6E64] space-y-1"><p className="font-bold text-[#243A32]">Required documents for this scheme:</p><p>{formScheme.documentsRequired.join(' · ')}</p><p className="text-[#718078]">This form saves your application in KrishiSmart only. After saving, complete the official submission on the official portal linked below.</p></div>
            <div className="space-y-3 text-xs">
              {([
                ['farmerName', 'Full name *', 'text'],
                ['phone', 'Mobile number *', 'tel'],
                ['village', 'Village *', 'text'],
                ['district', 'District *', 'text'],
                ['landAcres', 'Land area (acres) *', 'number'],
              ] as const).map(([key, label, type]) => (
                <div key={key}>
                  <label className="block font-bold text-[#3E5248] mb-1">{label}</label>
                  <input type={type} value={form[key]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className="w-full p-2.5 rounded-xl border border-[#CBD8D0] text-xs" />
                  {errors[key] && <p className="text-rose-600 font-bold mt-1">{errors[key]}</p>}
                </div>
              ))}
              <label className="flex items-center gap-2 font-bold text-[#3E5248]"><input type="checkbox" checked={form.bankAccountAvailable} onChange={(e) => setForm((f) => ({ ...f, bankAccountAvailable: e.target.checked }))} /> Aadhaar-seeded bank account available (no account number is collected here)</label>
              <div>
                <label className="block font-bold text-[#3E5248] mb-1 flex items-center gap-1.5"><Upload className="w-4 h-4" /> Upload documents (names recorded only)</label>
                <input type="file" multiple onChange={(e) => { const names = Array.from(e.target.files || []).map((f) => f.name); setForm((f) => ({ ...f, documents: [...f.documents, ...names] })); }} className="w-full text-xs" />
                {form.documents.length > 0 && <p className="text-[#3E5248] mt-1">Attached: {form.documents.join(', ')}</p>}
                <p className="text-[11px] text-[#718078] mt-1">Files are not sent to a government server by this app — keep the originals ready for the official portal step.</p>
              </div>
            </div>
            <div className="pt-3 border-t border-[#EFF4EF] flex flex-wrap gap-2">
              <button onClick={handleSaveDraft} className="flex-1 py-2.5 rounded-xl bg-[#F3F6F4] text-[#065F46] font-bold text-xs">Save Draft</button>
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">Submit Application</button>
              <a href={formScheme.officialUrl} target="_blank" rel="noreferrer" className="w-full text-center text-xs font-bold text-blue-700 hover:underline flex items-center justify-center gap-1">Official portal: {formScheme.officialUrl} <ExternalLink className="w-3.5 h-3.5" /></a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
