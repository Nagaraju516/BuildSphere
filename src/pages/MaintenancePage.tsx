import React, { useState } from 'react';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Sparkles,
  Zap,
  Droplets,
  Paintbrush,
  Bug,
  Sun,
  Hammer,
  Phone,
  ArrowRight,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { MaintenanceRequest } from '../types';

export const MaintenancePage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const {
    maintenanceRequests,
    amcPackages,
    submitMaintenanceRequest,
    subscribeAMC,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'request' | 'amc' | 'history'>('request');
  const [maintCategory, setMaintCategory] = useState<MaintenanceRequest['category']>('plumbing');
  const [maintTitle, setMaintTitle] = useState('');
  const [maintDesc, setMaintDesc] = useState('');
  const [urgency, setUrgency] = useState<'low' | 'standard' | 'urgent'>('standard');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [submitToast, setSubmitToast] = useState(false);
  const [amcToast, setAmcToast] = useState<string | null>(null);

  const handleRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMaintenanceRequest({
      userId: 'user-homeowner-1',
      category: maintCategory,
      title: maintTitle || 'General Home Maintenance Repair',
      description: maintDesc || 'Technician inspection requested for residential villa.',
      urgency,
      preferredDate,
    });
    setSubmitToast(true);
    setTimeout(() => {
      setSubmitToast(false);
      setActiveTab('history');
      setMaintTitle('');
      setMaintDesc('');
    }, 1500);
  };

  const handleSubscribe = (pkgId: string, title: string) => {
    subscribeAMC(pkgId);
    setAmcToast(title);
    setTimeout(() => setAmcToast(null), 3000);
  };

  const categoryIcons: Record<string, any> = {
    electrical: Zap,
    plumbing: Droplets,
    painting: Paintbrush,
    carpentry: Hammer,
    pest_control: Bug,
    tank_cleaning: Droplets,
    solar: Sun,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              Post-Handover
            </span>
            <span className="text-xs font-semibold text-slate-500">Home Care & Long-Term AMC</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('maintenance.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('maintenance.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('request')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'request' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('maintenance.requestRepair')}
          </button>
          <button
            onClick={() => setActiveTab('amc')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'amc' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('maintenance.amcTitle')}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Tickets ({maintenanceRequests.length})
          </button>
        </div>
      </div>

      {/* Emergency Hotline Strip */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 text-xs">
          <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
            <Phone className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <span className="font-bold text-white block">24/7 Breakdown Rapid Assistance Hotline</span>
            <span className="text-slate-400 text-[11px]">Direct priority dispatch for pipe burst, main breaker trip, or roof leakage.</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-brand-400 bg-slate-800 px-3 py-1.5 rounded-lg">
            1800-419-8800 (Toll Free)
          </span>
        </div>
      </div>

      {/* TAB 1: RAISE REPAIR REQUEST */}
      {activeTab === 'request' && (
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-2xs">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              {t('maintenance.requestRepair')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select category and preferred inspection window. Certified technician assigned within 15 minutes.
            </p>
          </div>

          {submitToast ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-900 text-base">Service Request Registered</h3>
              <p className="text-xs text-slate-500">Technician dispatched to your residential address.</p>
            </div>
          ) : (
            <form onSubmit={handleRequestSubmit} className="space-y-6 text-xs">
              {/* Category Grid */}
              <div className="space-y-2">
                <label className="font-bold text-slate-700 block">
                  {t('maintenance.repairCategory')}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(
                    [
                      'plumbing',
                      'electrical',
                      'painting',
                      'carpentry',
                      'pest_control',
                      'tank_cleaning',
                      'solar',
                    ] as const
                  ).map((cat) => {
                    const Icon = categoryIcons[cat] || Wrench;
                    const isSelected = maintCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setMaintCategory(cat)}
                        className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'bg-rose-50 text-rose-900 border-rose-400 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-2 text-rose-600" />
                        <span className="font-bold text-xs capitalize">
                          {cat.replace('_', ' ')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Issue Headline</label>
                <input
                  type="text"
                  required
                  value={maintTitle}
                  onChange={(e) => setMaintTitle(e.target.value)}
                  placeholder="e.g. Master bathroom vanity basin tap dripping water"
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Detailed Symptoms</label>
                <textarea
                  rows={3}
                  required
                  value={maintDesc}
                  onChange={(e) => setMaintDesc(e.target.value)}
                  placeholder="Describe frequency, noise, or water pooling observations..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Priority / Urgency</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  >
                    <option value="standard">Standard (Next Available Slot)</option>
                    <option value="urgent">Urgent (Emergency Response)</option>
                    <option value="low">Low (Weekend Inspection)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Preferred Visit Date</label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm transition-colors"
              >
                Submit Maintenance Request
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 2: ANNUAL AMC PACKAGES */}
      {activeTab === 'amc' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              {t('maintenance.amcTitle')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('maintenance.amcDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {amcPackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all border ${
                  pkg.isPopular
                    ? 'bg-gradient-to-b from-white to-amber-50/40 border-amber-300 shadow-lg ring-2 ring-amber-400/20'
                    : 'bg-white border-slate-200 shadow-2xs'
                }`}
              >
                <div className="space-y-4">
                  {pkg.isPopular && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white">
                      Most Popular
                    </span>
                  )}
                  <div>
                    <h3 className="text-lg font-black text-slate-900">{pkg.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{pkg.description}</p>
                  </div>

                  <div className="py-2 border-y border-slate-100">
                    <p className="text-2xl font-black text-slate-900">
                      {formatCurrency(pkg.pricePerYear)}
                    </p>
                    <span className="text-[10px] text-slate-400">Annual Protection Plan (Billed Yearly)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <p className="font-bold text-slate-700 uppercase text-[10px]">What is Included:</p>
                    {pkg.coverage.map((cov, cIdx) => (
                      <div key={cIdx} className="flex items-start space-x-2 text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span>{cov}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleSubscribe(pkg.id, pkg.title)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                      pkg.isPopular
                        ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {t('maintenance.subscribeAMC')}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {amcToast && (
            <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-semibold">Enrolled in {amcToast}! Welcome to BuildSphere Care.</span>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: TICKETS HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {maintenanceRequests.map((req) => (
            <div
              key={req.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-slate-700">{req.requestNumber}</span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-800">
                    {req.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400">
                  Logged on {formatDate(req.createdAt)}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {req.description}
              </p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-1">
                <span>
                  Assigned Specialist: <strong className="text-slate-800">{req.technicianName || 'Dispatching'}</strong>
                </span>
                <span>Scheduled Visit: {req.preferredDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
