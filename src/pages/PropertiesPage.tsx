import React, { useState } from 'react';
import {
  Building,
  MapPin,
  Compass,
  FileCheck,
  ShieldCheck,
  Heart,
  Calendar,
  Share2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  DollarSign,
  Layers,
  ChevronRight,
  Check,
  X,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Property, PropertyType, FloorPlan } from '../types';
import { LandLocationMap } from '../components/common/LandLocationMap';

export const PropertiesPage: React.FC = () => {
  const { t, formatCurrency } = useI18n();
  const {
    properties,
    floorPlans,
    approvalGuides,
    currentUser,
    toggleSavedProperty,
    submitPropertyInquiry,
    updateDueDiligenceStatus,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'listings' | 'map' | 'diligence' | 'plans' | 'approvals'>('listings');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Filtered properties
  const filteredProperties = properties.filter((p) => {
    if (selectedType === 'all') return true;
    return p.type === selectedType;
  });

  const handleOpenInquiry = (prop: Property) => {
    setSelectedProperty(prop);
    setInquiryModalOpen(true);
    setInquirySubmitted(false);
  };

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProperty) return;
    submitPropertyInquiry({
      propertyId: selectedProperty.id,
      message: inquiryMessage || 'Requesting title deed documents and site visit.',
      requestedDate: inquiryDate || new Date().toISOString().split('T')[0],
    });
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquiryModalOpen(false);
      setInquiryMessage('');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Module Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              Module 1
            </span>
            <span className="text-xs font-semibold text-slate-500">Early-Stage Due Diligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('property.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('property.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('listings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'listings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('property.allProperties')}
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center space-x-1.5 ${
              activeTab === 'map' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Land Location Map</span>
          </button>
          <button
            onClick={() => setActiveTab('diligence')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'diligence' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('property.dueDiligenceChecklist')}
          </button>
          <button
            onClick={() => setActiveTab('plans')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'plans' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('property.viewFloorPlans')}
          </button>
          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'approvals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Municipal Approvals
          </button>
        </div>
      </div>

      {/* TAB: INTERACTIVE LAND LOCATION MAP */}
      {activeTab === 'map' && (
        <div className="space-y-6">
          <LandLocationMap
            onSelectProperty={(prop) => {
              setSelectedProperty(prop);
            }}
            onViewDueDiligence={(prop) => {
              setSelectedProperty(prop);
              setActiveTab('diligence');
            }}
            onRequestVisit={(prop) => {
              handleOpenInquiry(prop);
            }}
          />
        </div>
      )}

      {/* TAB 1: LISTINGS */}
      {activeTab === 'listings' && (
        <div className="space-y-6">
          {/* Filters Bar & View Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="w-4 h-4 text-slate-500 mr-1" />
              <span className="text-xs font-bold text-slate-700">{t('property.filterByType')}:</span>
              {(['all', 'plot', 'land', 'residential', 'commercial'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
                    selectedType === type
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {type === 'all' ? t('common.all') : t(`property.types.${type}`)}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                {filteredProperties.length} verified listings
              </span>

              {/* View Mode Toggle: Grid vs Map */}
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⊞ Grid View
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                    viewMode === 'map' ? 'bg-brand-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Map View</span>
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'map' ? (
            <LandLocationMap
              onSelectProperty={(prop) => {
                setSelectedProperty(prop);
              }}
              onViewDueDiligence={(prop) => {
                setSelectedProperty(prop);
                setActiveTab('diligence');
              }}
              onRequestVisit={(prop) => {
                handleOpenInquiry(prop);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {filteredProperties.map((prop) => {
              const isSaved = currentUser.savedProperties.includes(prop.id);
              return (
                <div
                  key={prop.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative h-64 overflow-hidden group">
                      <img
                        src={prop.images[0]}
                        alt={prop.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3 flex items-center space-x-2">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-slate-900/80 text-white backdrop-blur-md">
                          {prop.type}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white flex items-center space-x-1">
                          <ShieldCheck className="w-3 h-3" />
                          <span>{prop.legalStatus}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => toggleSavedProperty(prop.id)}
                        className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                          isSaved
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-slate-700 hover:bg-white'
                        }`}
                      >
                        <Heart className="w-4 h-4 fill-current" />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end text-white">
                        <div className="bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl">
                          <p className="text-[10px] font-medium text-slate-300">Total Price</p>
                          <p className="text-lg font-black text-amber-300">
                            {formatCurrency(prop.price, true)}
                          </p>
                        </div>
                        <span className="text-xs bg-slate-950/70 px-2.5 py-1 rounded-lg">
                          ₹ {prop.pricePerSqFt} / sq.ft
                        </span>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{prop.title}</h3>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 mr-1 flex-shrink-0" />
                          <span>{prop.location.locality}, {prop.location.city} ({prop.location.pincode})</span>
                        </p>
                      </div>

                      {/* Specs */}
                      <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-center">
                        <div className="p-2 rounded-lg bg-slate-50">
                          <p className="text-[10px] text-slate-400">Total Area</p>
                          <p className="text-xs font-bold text-slate-800 mt-0.5">{prop.areaSqFt} sq.ft</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <p className="text-[10px] text-slate-400">Dimensions</p>
                          <p className="text-xs font-bold text-slate-800 mt-0.5">{prop.dimensions}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50">
                          <p className="text-[10px] text-slate-400">Facing</p>
                          <p className="text-xs font-bold text-slate-800 mt-0.5">{prop.facing}</p>
                        </div>
                      </div>

                      {/* Highlights */}
                      <div className="space-y-1.5">
                        {prop.highlights.slice(0, 2).map((h, i) => (
                          <div key={i} className="flex items-center text-xs text-slate-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 mr-2 flex-shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="p-6 pt-0 flex items-center space-x-3">
                    <button
                      onClick={() => handleOpenInquiry(prop)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{t('property.scheduleInquiry')}</span>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedProperty(prop);
                        setActiveTab('diligence');
                      }}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors"
                    >
                      Legal Due Diligence
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </div>
      )}

      {/* TAB 2: DUE DILIGENCE CHECKLIST */}
      {activeTab === 'diligence' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              Legal Safeguards
            </span>
            <h2 className="text-2xl font-black text-slate-900 mt-2">
              {t('property.dueDiligenceChecklist')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('property.dueDiligenceDesc')}
            </p>
          </div>

          {/* Active Checked Property Selector */}
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700">Inspecting Property:</span>
            <select
              value={selectedProperty?.id || properties[0].id}
              onChange={(e) => {
                const found = properties.find((p) => p.id === e.target.value);
                if (found) setSelectedProperty(found);
              }}
              className="text-xs font-bold bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-slate-800"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.location.locality})
                </option>
              ))}
            </select>
          </div>

          {/* Checklist Items */}
          {(() => {
            const currentProp = selectedProperty || properties[0];
            return (
              <div className="space-y-4">
                {currentProp.dueDiligenceItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs mt-0.5">
                        #{idx + 1}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Category: <span className="font-semibold capitalize">{item.category.replace('_', ' ')}</span> • Updated: {item.updatedAt}
                        </p>
                        {item.notes && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-2 border border-slate-100">
                            Notes: {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <select
                        value={item.status}
                        onChange={(e) =>
                          updateDueDiligenceStatus(currentProp.id, item.id, e.target.value as any)
                        }
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg border ${
                          item.status === 'verified'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                            : item.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="verified">Verified (Clear)</option>
                        <option value="in_progress">Under Investigation</option>
                        <option value="pending">Pending Document</option>
                        <option value="flagged">Flagged / Query Raised</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 3: FLOOR PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              {t('property.architectServices')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Browse contemporary architectural floor plans designed for Indian plot sizes with cross-ventilation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {floorPlans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-6 space-y-4"
              >
                <div className="relative h-56 rounded-xl overflow-hidden">
                  <img src={plan.images[0]} alt={plan.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white">
                    {plan.bhk} BHK • {plan.floors} Floors
                  </span>
                  {plan.energyEfficient && (
                    <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-700 text-white">
                      Eco-Smart & Ventilated
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{plan.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">By {plan.architectName}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Plot Size</span>
                    <strong className="text-slate-800">{plan.plotSize}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Built-Up Area</span>
                    <strong className="text-slate-800">{plan.builtUpAreaSqFt} sq.ft</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Estimated Build Cost</span>
                    <strong className="text-amber-600">{formatCurrency(plan.estimatedCost, true)}</strong>
                  </div>
                </div>

                {/* Room Breakdown */}
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Room Dimensions</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-600">
                    {plan.roomBreakdown.slice(0, 4).map((r, i) => (
                      <div key={i} className="flex justify-between">
                        <span>{r.room}:</span>
                        <strong className="text-slate-800">{r.dimensions}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('diligence')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
                >
                  Adopt Plan for Current Project
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MUNICIPAL APPROVAL GUIDES */}
      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              {t('property.approvalGuide')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Step-by-step procedures and mandatory scrutiny checklists for local municipal approvals.
            </p>
          </div>

          <div className="space-y-6">
            {approvalGuides.map((guide) => (
              <div key={guide.id} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {guide.region}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">{guide.authorityName}</h3>
                    <p className="text-xs text-slate-500">{guide.approvalType} • Expected Turnaround: ~{guide.estimatedDays} Days</p>
                  </div>
                  {guide.officialPortalUrl && (
                    <a
                      href={guide.officialPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-blue-600"
                    >
                      Visit Official Portal
                    </a>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Procedural Steps */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Application Workflow
                    </h4>
                    <ol className="space-y-2 text-xs text-slate-600 list-decimal list-inside">
                      {guide.steps.map((s, idx) => (
                        <li key={idx} className="leading-relaxed">
                          <span className="text-slate-800">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Mandatory Documents */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                      Mandatory Document Attachments
                    </h4>
                    <div className="space-y-1.5 text-xs text-slate-600">
                      {guide.mandatoryDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                          <span>{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inquiry Dialog Modal */}
      {inquiryModalOpen && selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {t('property.inquiryForm')}
              </h3>
              <button
                onClick={() => setInquiryModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {inquirySubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-800 text-base">
                  {t('property.inquirySent')}
                </h4>
                <p className="text-xs text-slate-500">
                  Seller {selectedProperty.seller.name} has been notified and will contact you directly at {currentUser.phone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-slate-700">Property</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedProperty.title}</p>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Preferred Visit Date
                  </label>
                  <input
                    type="date"
                    required
                    value={inquiryDate}
                    onChange={(e) => setInquiryDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Your Requirements / Due Diligence Questions
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="e.g. Please provide copy of latest EC Form 15 and link document survey map."
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors"
                >
                  Send Inquiry Request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
