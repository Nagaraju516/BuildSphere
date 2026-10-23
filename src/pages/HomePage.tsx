import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building,
  Compass,
  ShoppingCart,
  Users,
  Truck,
  CheckCircle2,
  PieChart,
  Wrench,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Calculator,
  Layers,
  Clock,
  Shield,
  FileCheck,
  ChevronRight,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';

export const HomePage: React.FC = () => {
  const { t, formatCurrency } = useI18n();
  const { project, properties, products, providers } = useAppStore();

  // Interactive Construction Estimator State
  const [areaSqFt, setAreaSqFt] = useState<number>(2000);
  const [floors, setFloors] = useState<number>(2);
  const [tier, setTier] = useState<'standard' | 'premium' | 'luxury'>('premium');

  const ratePerSqFt = tier === 'standard' ? 1850 : tier === 'premium' ? 2300 : 2950;
  const estimatedCost = areaSqFt * ratePerSqFt;
  const cementBags = Math.round(areaSqFt * 0.42);
  const steelTonnes = (areaSqFt * 0.0035).toFixed(1);

  const modules = [
    {
      id: 1,
      title: t('property.title'),
      subtitle: t('property.subtitle'),
      icon: Building,
      badge: 'Module 1',
      color: 'from-blue-600 to-indigo-700',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      to: '/properties',
      features: ['Search Plots & Land', '7-Point Due Diligence', 'Municipal Sanctions (GHMC/BBMP)', 'Vastu Floor Plans'],
    },
    {
      id: 2,
      title: t('materials.title'),
      subtitle: t('materials.subtitle'),
      icon: ShoppingCart,
      badge: 'Module 2',
      color: 'from-emerald-600 to-teal-700',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      to: '/materials',
      features: ['Cement, Steel, Bricks', 'Ashirvad & Astral Plumbing', 'Asian Paints & Vitrified Tiles', 'Live Dispatch Tracking'],
    },
    {
      id: 3,
      title: t('services.title'),
      subtitle: t('services.subtitle'),
      icon: Users,
      badge: 'Module 3',
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
      to: '/services',
      features: ['Turnkey Civil Contractors', 'Council-Registered Architects', 'Licensed Electricians & Plumbers', '13-Stage Booking Engine'],
    },
    {
      id: 4,
      title: t('equipment.title'),
      subtitle: t('equipment.subtitle'),
      icon: Truck,
      badge: 'Module 4',
      color: 'from-sky-600 to-blue-700',
      textColor: 'text-sky-600',
      bgColor: 'bg-sky-50',
      borderColor: 'border-sky-200',
      to: '/equipment',
      features: ['JCB 3DX & Excavator Fleet', 'Concrete Mixers & Scaffolding', 'Certified Operators', 'Rooftop Solar & CCTV'],
    },
    {
      id: 5,
      title: t('finance.title'),
      subtitle: t('finance.subtitle'),
      icon: PieChart,
      badge: 'Module 5',
      color: 'from-violet-600 to-purple-700',
      textColor: 'text-violet-600',
      bgColor: 'bg-violet-50',
      borderColor: 'border-violet-200',
      to: '/finance',
      features: ['8 Budget Categories', 'Real-Time Variance Audit', 'Simulated Demo UPI & Cards', 'Downloadable Cost Summaries'],
    },
    {
      id: 6,
      title: t('projects.title'),
      subtitle: t('projects.subtitle'),
      icon: CheckCircle2,
      badge: 'Module 6',
      color: 'from-rose-600 to-pink-700',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-200',
      to: '/projects',
      features: ['Complete 28 Milestones', 'Pre-Handover Snag List', 'Move-In Readiness Index', 'Annual AMC Maintenance Care'],
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-brand-400 text-xs font-bold tracking-wide">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>Pan-India Construction Super App</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                {t('common.appName')}
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-emerald-300 to-amber-400 mt-2">
                  {t('common.tagline')}
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                The single modular platform connecting every phase of Indian homebuilding: land due diligence, architectural floor plans, verified materials, skilled labour, heavy equipment, and ongoing home maintenance.
              </p>

              {/* Call-to-actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/projects"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all transform hover:-translate-y-0.5"
                >
                  <Layers className="w-4 h-4" />
                  <span>{t('projects.title')}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/materials"
                  className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{t('materials.title')}</span>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-800 flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Zero-API-Key Architecture</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="w-4 h-4 text-brand-400" />
                  <span>7-Point Due Diligence</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>28 Sequential Milestones</span>
                </div>
              </div>
            </div>

            {/* Right Live Lifecycle Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-800/90 border border-slate-700 p-6 shadow-2xl backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-400">
                      Live Active Project
                    </span>
                    <h3 className="font-bold text-white text-base truncate">{project.title}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {project.overallProgressPercent}% Complete
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Current Phase: <strong className="text-white capitalize">{project.status}</strong></span>
                    <span>28 Milestones Total</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.overallProgressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key Numbers Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <p className="text-[11px] text-slate-400">{t('finance.totalBudget')}</p>
                    <p className="text-base font-extrabold text-white mt-1">
                      {formatCurrency(project.targetBudget, true)}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60">
                    <p className="text-[11px] text-slate-400">Plot & Built-Up Area</p>
                    <p className="text-base font-extrabold text-amber-400 mt-1">
                      {project.builtUpAreaSqFt} {t('common.sqft')}
                    </p>
                  </div>
                </div>

                {/* Next Upcoming Milestone */}
                <div className="p-3.5 rounded-xl bg-brand-950/40 border border-brand-800/40 flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-brand-600 text-white mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-xs">
                    <p className="font-bold text-slate-200">Milestone 23 in Progress</p>
                    <p className="text-slate-400 mt-0.5">
                      Interior Wall Putty & Asian Paints Apex Ultima Painting (85% Finished)
                    </p>
                  </div>
                </div>

                <Link
                  to="/projects"
                  className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>Open 28-Milestone Project Board</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Integrated Modules Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full">
            Modular Monolith
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Six Seamless Modules. One Single Application.
          </h2>
          <p className="text-slate-600 text-sm">
            Everything you need across your property lifecycle without switching portals or dealing with fragmented suppliers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="group relative rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-xl transition-all card-hover flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${m.bgColor} ${m.textColor}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {m.subtitle}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {m.features.map((f, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-4">
                  <Link
                    to={m.to}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 text-slate-800 hover:text-brand-700 text-xs font-bold transition-all"
                  >
                    <span>Launch {m.badge}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Construction Estimator */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 sm:p-12 border border-slate-700 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Calculator className="w-4 h-4" />
                <span>Instant Construction Budget Simulator</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight">
                Calculate Real Construction Cost in Seconds
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tune built-up area and specification quality tier based on prevailing Indian material and labour rates.
              </p>

              {/* Slider for Area */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Built-Up Area</span>
                  <span className="text-brand-400 text-sm font-bold">{areaSqFt} Sq.Ft</span>
                </div>
                <input
                  type="range"
                  min="800"
                  max="6000"
                  step="100"
                  value={areaSqFt}
                  onChange={(e) => setAreaSqFt(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>800 sq.ft (Compact 2BHK)</span>
                  <span>6000 sq.ft (Grand Villa)</span>
                </div>
              </div>

              {/* Tier Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Specification Tier</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['standard', 'premium', 'luxury'] as const).map((tOption) => (
                    <button
                      key={tOption}
                      onClick={() => setTier(tOption)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition-all border ${
                        tier === tOption
                          ? 'bg-brand-600 text-white border-brand-500 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {tOption}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Calculated Results Box */}
            <div className="lg:col-span-6 bg-slate-950/70 border border-slate-700/80 rounded-2xl p-6 sm:p-8 space-y-6">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated Total Construction Cost
                </p>
                <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-amber-300 mt-2">
                  {formatCurrency(estimatedCost)}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  At ₹ {ratePerSqFt} per sq.ft ({tier.toUpperCase()} finish quality)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] text-slate-400">Cement Quantity</p>
                  <p className="text-lg font-bold text-white mt-1">~ {cementBags} Bags</p>
                  <span className="text-[10px] text-slate-500">PPC Weather Shield</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                  <p className="text-[11px] text-slate-400">TMT Steel Rebars</p>
                  <p className="text-lg font-bold text-amber-400 mt-1">~ {steelTonnes} Tonnes</p>
                  <span className="text-[10px] text-slate-500">Fe 550D High Ductility</span>
                </div>
              </div>

              <Link
                to="/finance"
                className="w-full inline-flex items-center justify-center space-x-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition-colors"
              >
                <span>Save to Project Budget Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
