import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Star,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Briefcase,
  MapPin,
  Clock,
  Send,
  Filter,
  ArrowRight,
  Phone,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Provider, TradeType } from '../types';

export const ServicesPage: React.FC = () => {
  const { t, formatCurrency } = useI18n();
  const { providers, quotationRequests, submitQuotationRequest, bookings } = useAppStore();

  const [selectedTrade, setSelectedTrade] = useState<string>('all');
  const [quoteModalProvider, setQuoteModalProvider] = useState<Provider | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [estimatedBudget, setEstimatedBudget] = useState(50000);
  const [locationText, setLocationText] = useState('Hyderabad (Jubilee Hills Extn)');
  const [submittedToast, setSubmittedToast] = useState(false);

  const trades = [
    { key: 'all', label: t('services.trades.all') },
    { key: 'general_contractor', label: 'Contractors' },
    { key: 'architect', label: 'Architects' },
    { key: 'electrician', label: 'Electricians' },
    { key: 'plumber', label: 'Plumbers' },
    { key: 'mason', label: 'Masons' },
  ];

  const filteredProviders = providers.filter((p) => {
    if (selectedTrade === 'all') return true;
    return p.trade === selectedTrade;
  });

  const handleOpenQuote = (prov: Provider) => {
    setQuoteModalProvider(prov);
    setSubmittedToast(false);
  };

  const handleSendQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quoteModalProvider) return;

    submitQuotationRequest({
      providerId: quoteModalProvider.id,
      trade: quoteModalProvider.trade,
      projectTitle: projectTitle || 'Home Construction Service',
      workDescription: workDescription || 'Full scope execution as per standard architectural specs.',
      propertyLocation: locationText,
      estimatedBudget,
    });

    setSubmittedToast(true);
    setTimeout(() => {
      setQuoteModalProvider(null);
      setProjectTitle('');
      setWorkDescription('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
              Module 3
            </span>
            <span className="text-xs font-semibold text-slate-500">Service Discovery & Booking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('services.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('services.subtitle')}
          </p>
        </div>

        {/* View Bookings & Quotations Shortcut */}
        <div className="flex items-center space-x-3">
          <Link
            to="/services/bookings"
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>{t('services.activeBookings')} ({bookings.length})</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-2xl border border-slate-200">
        <Filter className="w-4 h-4 text-slate-400 mr-1" />
        {trades.map((tr) => (
          <button
            key={tr.key}
            onClick={() => setSelectedTrade(tr.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              selectedTrade === tr.key
                ? 'bg-amber-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tr.label}
          </button>
        ))}
      </div>

      {/* Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProviders.map((prov) => (
          <div
            key={prov.id}
            className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all card-hover flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={prov.avatar}
                    alt={prov.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                  />
                  <div>
                    <div className="flex items-center space-x-1">
                      <h3 className="font-bold text-slate-900 text-sm">{prov.name}</h3>
                      {prov.isVerified && (
                        <span title="Verified Professional">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 capitalize">{prov.trade.replace('_', ' ')}</p>
                    <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prov.rating} ({prov.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>

              {prov.businessName && (
                <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  {prov.businessName}
                </p>
              )}

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {prov.bio}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5">
                {prov.skills.slice(0, 3).map((sk, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                  >
                    {sk}
                  </span>
                ))}
              </div>

              {/* Rates & Experience */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('services.ratePerDay')}</span>
                  <strong className="text-slate-900 text-sm">
                    {formatCurrency(prov.indicativeDailyRate)} / day
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">{t('services.experience')}</span>
                  <strong className="text-slate-900 text-sm">{prov.experienceYears} Years</strong>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="p-6 pt-0">
              <button
                onClick={() => handleOpenQuote(prov)}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t('services.requestQuote')}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quotation Request Modal */}
      {quoteModalProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-amber-600">
                  {quoteModalProvider.trade.replace('_', ' ')}
                </span>
                <h3 className="font-bold text-slate-900 text-base">
                  Request Quote from {quoteModalProvider.name}
                </h3>
              </div>
              <button
                onClick={() => setQuoteModalProvider(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            {submittedToast ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-800 text-base">{t('services.quoteSubmitted')}</h4>
                <p className="text-xs text-slate-500">
                  The professional will review your requirements and provide an estimated budget and timeline.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendQuote} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Project Title / Scope
                  </label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. 2400 Sq.Ft Villa Complete Electrical Conduiting & DB Wiring"
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Detailed Work Specifications
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={workDescription}
                    onChange={(e) => setWorkDescription(e.target.value)}
                    placeholder="Describe specific rooms, materials preference, and milestones..."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {t('services.estimatedBudget')}
                    </label>
                    <input
                      type="number"
                      required
                      value={estimatedBudget}
                      onChange={(e) => setEstimatedBudget(Number(e.target.value))}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Site Location
                    </label>
                    <input
                      type="text"
                      required
                      value={locationText}
                      onChange={(e) => setLocationText(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors"
                >
                  Submit Estimate Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
