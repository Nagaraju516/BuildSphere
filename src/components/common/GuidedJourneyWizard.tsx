import React, { useState } from 'react';
import {
  Compass,
  MapPin,
  Building,
  CheckCircle2,
  ShoppingCart,
  Users,
  Truck,
  Wrench,
  ShieldCheck,
  Calendar,
  Layers,
  ArrowRight,
  Zap,
  Droplets,
  HardHat,
  Award,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  PackageCheck,
  Check,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAppStore } from '../../store';
import { Property, Product, Provider } from '../../types';
import { LandLocationMap } from './LandLocationMap';

export const GuidedJourneyWizard: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const {
    properties,
    products,
    providers,
    project,
    equipmentList,
    createMaterialOrder,
    acceptQuotationAndCreateBooking,
    bookEquipmentRental,
    submitMaintenanceRequest,
    subscribeAMC,
    currentUser,
    orders,
    bookings,
  } = useAppStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedPlot, setSelectedPlot] = useState<Property>(properties[0]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]); // initial completed for demo
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [showLandMap, setShowLandMap] = useState<boolean>(false);

  // Trigger feedback banner
  const triggerSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3500);
  };

  // Step 1: Buy Plot Action
  const handleSelectPlot = (prop: Property) => {
    setSelectedPlot(prop);
    if (!completedSteps.includes(1)) {
      setCompletedSteps((prev) => [...prev, 1]);
    }
    triggerSuccess(`స్థలం ఎంపిక పూర్తయింది! ${prop.title} మీ ప్రాజెక్ట్ సైట్‌గా నమోదు చేయబడింది.`);
  };

  // Step 2: Book Survey Action
  const handleBookSurvey = (type: string) => {
    if (!completedSteps.includes(2)) {
      setCompletedSteps((prev) => [...prev, 2]);
    }
    triggerSuccess(`సర్వే బుకింగ్ విజయవంతమైంది! ${type} కోసం ఇంజనీర్ కేటాయించబడ్డారు.`);
  };

  // Step 3: Approve Plan
  const handleApprovePlan = () => {
    if (!completedSteps.includes(3)) {
      setCompletedSteps((prev) => [...prev, 3]);
    }
    triggerSuccess('3BHK ఆధునిక ఆర్కిటెక్ట్ ప్లాన్ ఆమోదించబడింది! TS-bPASS భవన నిర్మాణ అనుమతి నంబర్ #BP-1042 జారీ చేయబడింది.');
  };

  // Step 4: 1-Click Order Materials to Site
  const handleOrderMaterialDirectly = (prod: Product, qty: number) => {
    const orderAddress = {
      id: 'active-site',
      street: `${selectedPlot.title}, ${selectedPlot.location.locality}`,
      city: selectedPlot.location.city,
      state: selectedPlot.location.state,
      pincode: selectedPlot.location.pincode,
    };

    // Temporarily add to cart & place order
    createMaterialOrder(orderAddress, 'upi');

    if (!completedSteps.includes(4)) {
      setCompletedSteps((prev) => [...prev, 4]);
    }

    triggerSuccess(
      `ఆర్డర్ పూర్తయింది! ${qty} ${prod.unit} ${prod.name} సైట్‌కు డిస్పాచ్ చేయబడింది. అధికారిక జీఎస్టీ రసీదు సిద్ధమైంది.`
    );
  };

  // Step 5: Hire Worker Directly
  const handleHireWorkerDirectly = (prov: Provider) => {
    // Generate quote and accept into booking
    const bookingStartDate = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    acceptQuotationAndCreateBooking('instant-quote', bookingStartDate);

    if (!completedSteps.includes(5)) {
      setCompletedSteps((prev) => [...prev, 5]);
    }

    triggerSuccess(
      `నియామకం నిర్ధారించబడింది! ${prov.name} (${prov.trade.replace('_', ' ')}) ఈ సైట్ పనులకు బుక్ చేయబడ్డారు.`
    );
  };

  // Step 6: Deploy Heavy Machinery
  const handleDeployMachinery = (eqName: string) => {
    const eq = equipmentList[0];
    bookEquipmentRental({
      equipmentId: eq.id,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysCount: 2,
      deliveryAddress: currentUser.addresses[0],
      operatorRequested: true,
    });

    if (!completedSteps.includes(6)) {
      setCompletedSteps((prev) => [...prev, 6]);
    }

    triggerSuccess(`${eqName} సైట్‌కు బయలుదేరింది! సర్టిఫైడ్ ఆపరేటర్‌తో పాటు 2 రోజులు డిప్లాయ్ చేయబడింది.`);
  };

  // Step 7: Handover & Maintenance
  const handleFinalHandover = () => {
    submitMaintenanceRequest({
      userId: currentUser.id,
      category: 'tank_cleaning',
      title: 'గృహ ప్రవేశానికి ముందు అండర్‌గ్రౌండ్ సంప్ & ఓవర్‌హెడ్ ట్యాంక్ క్లీనింగ్',
      description: 'డీప్ క్లీనింగ్ మరియు యాంటీ-బాక్టీరియల్ వాష్ పూర్తయింది.',
      urgency: 'standard',
      preferredDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    subscribeAMC('amc-2');

    if (!completedSteps.includes(7)) {
      setCompletedSteps((prev) => [...prev, 7]);
    }

    triggerSuccess(
      'అభినందనలు! గృహ ప్రవేశ తాళాలు అందుకోబడ్డాయి. వాటర్ ట్యాంక్ క్లీనింగ్ మరియు వార్షిక AMC కేర్ ప్లాన్ యాక్టివేట్ అయ్యాయి.'
    );
  };

  const steps = [
    { num: 1, title: t('journey.step1Title'), desc: t('journey.step1Desc'), icon: MapPin },
    { num: 2, title: t('journey.step2Title'), desc: t('journey.step2Desc'), icon: Compass },
    { num: 3, title: t('journey.step3Title'), desc: t('journey.step3Desc'), icon: Building },
    { num: 4, title: t('journey.step4Title'), desc: t('journey.step4Desc'), icon: ShoppingCart },
    { num: 5, title: t('journey.step5Title'), desc: t('journey.step5Desc'), icon: Users },
    { num: 6, title: t('journey.step6Title'), desc: t('journey.step6Desc'), icon: Truck },
    { num: 7, title: t('journey.step7Title'), desc: t('journey.step7Desc'), icon: Wrench },
  ];

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xl overflow-hidden space-y-6">
      {/* Wizard Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('journey.badge')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
              {t('journey.title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t('journey.subtitle')}
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-700 p-4 rounded-2xl flex items-center space-x-4 flex-shrink-0">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">పూర్తయిన దశలు (Progress)</span>
              <p className="text-xl font-black text-brand-400 mt-0.5">
                {completedSteps.length} / 7 దశలు
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-brand-500/30 flex items-center justify-center font-black text-sm text-brand-400">
              {Math.round((completedSteps.length / 7) * 100)}%
            </div>
          </div>
        </div>

        {/* Step Tabs Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-4 border-t border-slate-700/80">
          {steps.map((st) => {
            const Icon = st.icon;
            const isCompleted = completedSteps.includes(st.num);
            const isCurrent = currentStep === st.num;

            return (
              <button
                key={st.num}
                onClick={() => setCurrentStep(st.num)}
                className={`p-3 rounded-xl text-left transition-all flex flex-col justify-between border ${
                  isCurrent
                    ? 'bg-brand-600 text-white border-brand-400 shadow-lg scale-102 ring-2 ring-brand-300/30'
                    : isCompleted
                    ? 'bg-slate-800 text-emerald-300 border-emerald-500/40 hover:bg-slate-700'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase">దశ {st.num}</span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  ) : (
                    <Icon className="w-4 h-4 opacity-50 flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs font-bold mt-1 line-clamp-1">{st.title.split(':')[1] || st.title}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Success Notification Alert */}
      {actionSuccessMsg && (
        <div className="mx-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center space-x-3 shadow-md animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-bold">{actionSuccessMsg}</p>
        </div>
      )}

      {/* Interactive Step Content Container */}
      <div className="p-6 sm:p-8 pt-0">
        {/* STEP 1: PICK & BUY LAND */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {t('journey.step1Title')}
              </span>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    1. స్థలం పరిశీలన & తక్షణ కొనుగోలు (Land Discovery & Purchase)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    ధృవీకరించబడిన లీగల్ అనుమతులు ఉన్న స్థలాన్ని ఎంచుకోండి. కొనుగోలు చేసిన వెంటనే మీ ప్రాజెక్ట్‌కు లింక్ అవుతుంది.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowLandMap(!showLandMap)}
                  className="self-start sm:self-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center space-x-1.5 shadow-sm transition-all flex-shrink-0"
                >
                  <MapPin className="w-3.5 h-3.5 text-brand-400" />
                  <span>{showLandMap ? '⊞ Hide Map & Show Cards' : '🗺️ Open Land Location Map'}</span>
                </button>
              </div>
            </div>

            {showLandMap ? (
              <div className="pt-2 animate-fadeIn">
                <LandLocationMap
                  onSelectProperty={(plot) => {
                    handleSelectPlot(plot);
                    setShowLandMap(false);
                  }}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.slice(0, 2).map((plot) => {
                const isSelected = selectedPlot.id === plot.id;
                return (
                  <div
                    key={plot.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'border-brand-500 bg-brand-50/20 ring-2 ring-brand-500/20 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="relative h-44 rounded-xl overflow-hidden">
                        <img src={plot.images[0]} alt={plot.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white">
                          {plot.legalStatus}
                        </span>
                        <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg text-sm font-black bg-slate-950/80 text-amber-300">
                          {formatCurrency(plot.price, true)}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">{plot.title}</h4>
                        <p className="text-xs text-slate-500 flex items-center mt-1">
                          <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{plot.location.locality}, {plot.location.city}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-1.5 text-center text-xs py-2 border-y border-slate-100">
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-400 block">విస్తీర్ణం</span>
                          <strong>{plot.areaSqFt} చ.అ</strong>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-400 block">కొలతలు</span>
                          <strong>{plot.dimensions}</strong>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded">
                          <span className="text-[10px] text-slate-400 block">ముఖద్వారం</span>
                          <strong>{plot.facing}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-2">
                      <button
                        onClick={() => handleSelectPlot(plot)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all ${
                          isSelected
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        <Check className="w-4 h-4" />
                        <span>{isSelected ? 'ఎంపికయిన సైట్ (Selected Site)' : t('journey.buyPlot')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            )}

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
              >
                <span>తదుపరి దశ: సైట్ సర్వే & సాయిల్ టెస్టింగ్ →</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SURVEY & SOIL TEST */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {t('journey.step2Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                2. సరిహద్దు సర్వే & సాయిల్ టెస్టింగ్ (Survey & Soil Bearing Capacity)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                నిర్మాణం ప్రారంభించే ముందు సైట్ కొలతలు, లెవెల్స్ మరియు భూమి లోతు సామర్థ్యాన్ని నిపుణులతో తనిఖీ చేయించండి.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Compass className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">టోటల్ స్టేషన్ బౌండరీ సర్వే</h4>
                    <p className="text-xs text-slate-500">GPS పాయింట్స్ & కాంటూర్ మ్యాపింగ్</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  డిజిటల్ పరికరాలతో సైట్ 4 మూలల హద్దులు నిర్ణయించి రోడ్డు లెవెల్ బెంచ్‌మార్క్ నిర్ణయిస్తారు.
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-base">₹ 32,000</span>
                  <button
                    onClick={() => handleBookSurvey('టోటల్ స్టేషన్ సర్వే')}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    {t('journey.bookSurvey')}
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">సాయిల్ ఇన్వెస్టిగేషన్ & SBC టెస్ట్</h4>
                    <p className="text-xs text-slate-500">6 మీటర్ల లోతు బోర్‌హోల్ విశ్లేషణ</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  పునాదుల వెడల్పు నిర్ణయించడానికి సురక్షిత బేరింగ్ సామర్థ్యం (180 kN/m²) ల్యాబ్ సర్టిఫికేట్.
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-base">₹ 45,000</span>
                  <button
                    onClick={() => handleBookSurvey('సాయిల్ టెస్టింగ్')}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
                  >
                    సాయిల్ టెస్ట్ బుక్ చేయండి
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
              >
                ← వెనుకకు
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold"
              >
                తదుపరి దశ: ప్లానింగ్ & మున్సిపల్ అనుమతులు →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FLOOR PLAN & SANCTION */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                {t('journey.step3Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                3. ఆధునిక ఆర్కిటెక్చరల్ ప్లానింగ్ & మున్సిపల్ అనుమతులు (Modern Floor Plan & Approvals)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                ఆర్కిటెక్ట్ రూపొందించిన 3BHK నమూనా ప్లాన్ ఆమోదించి TS-bPASS / GHMC మున్సిపల్ భవన అనుమతిని పొందండి.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                    ఆధునిక ఆర్కిటెక్చర్ ఆమోదిత ప్లాన్
                  </span>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    3BHK కాంటెంపరరీ డ్యూప్లెక్స్ విల్లా ప్లాన్ (2,450 చ.అ)
                  </h4>
                  <p className="text-xs text-slate-500">ఆర్కిటెక్ట్: అర్. అనన్య దేశ్‌ముఖ్, కౌన్సిల్ ఆఫ్ ఆర్కిటెక్చర్ సర్టిఫైడ్</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">అంచనా నిర్మాణ వ్యయం</span>
                  <span className="text-lg font-black text-amber-600">₹ 48,00,000</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs py-2 bg-slate-50 p-3 rounded-xl">
                <div><span>లివింగ్ హాల్:</span> <strong className="block text-slate-800">16 x 20 అడుగులు</strong></div>
                <div><span>మాడ్యులర్ కిచెన్:</span> <strong className="block text-slate-800">11 x 12 అడుగులు</strong></div>
                <div><span>హోమ్ ఆఫీస్ / స్టడీ:</span> <strong className="block text-slate-800">6 x 7 అడుగులు</strong></div>
                <div><span>మాస్టర్ బెడ్‌రూమ్:</span> <strong className="block text-slate-800">14 x 16 అడుగులు</strong></div>
              </div>

              <button
                onClick={handleApprovePlan}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ఈ ప్లాన్‌ను ఆమోదించండి & మున్సిపల్ అనుమతి (TS-bPASS) పొందండి</span>
              </button>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(2)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                ← వెనుకకు
              </button>
              <button onClick={() => setCurrentStep(4)} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                తదుపరి దశ: సామగ్రి కొనుగోలు (సిమెంట్ & స్టీల్) →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: ORDER CEMENT, STEEL & BRICKS */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                {t('journey.step4Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                4. సిమెంట్, స్టీల్ & ఇటుకలు సైట్‌కు నేరుగా కొనుగోలు చేయండి (Instant Material Procurement)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                డీలర్ల నుండి అసలైన బ్రాండెడ్ సామగ్రిని మీ నిర్మాణ సైట్‌కు 1-క్లిక్‌తో ఆర్డర్ చేయండి. జీఎస్టీ బిల్ మరియు రవాణా రికార్డు ఆటోమేటిక్‌గా జనరేట్ అవుతాయి.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Product 1: Cement */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">UltraTech Cement</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    అల్ట్రాటెక్ వెదర్ ప్లస్ సిమెంట్ (100 బ్యాగులు)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">పునాదులు మరియు స్లాబ్ వాటర్‌ప్రూఫింగ్ రక్షణ</p>
                  <p className="text-lg font-black text-slate-900 mt-2">
                    {formatCurrency(39500)} <span className="text-xs text-slate-400 font-normal">(@ ₹395 / బ్యాగ్)</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOrderMaterialDirectly(products[0], 100)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>సైట్‌కు డిస్పాచ్ చేయండి</span>
                </button>
              </div>

              {/* Product 2: Steel */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Tata Steel</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    టాటా టిస్కాన్ 550D TMT స్టీల్ (2 టన్నులు)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">భూకంప నిరోధక హై-డక్టిలిటీ పిల్లర్ రాడ్లు</p>
                  <p className="text-lg font-black text-slate-900 mt-2">
                    {formatCurrency(137000)} <span className="text-xs text-slate-400 font-normal">(@ ₹68,500 / టన్ను)</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOrderMaterialDirectly(products[1], 2)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>స్టీల్ ఆర్డర్ చేయండి</span>
                </button>
              </div>

              {/* Product 3: Bricks */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">Clay Works</span>
                  <h4 className="font-bold text-slate-900 text-sm mt-0.5">
                    వైర్‌కట్ ఎరుపు ఇటుకలు (5,000 ముక్కలు)
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">గోడల నిర్మాణానికి కాల్చిన గట్టి ఇటుకలు</p>
                  <p className="text-lg font-black text-slate-900 mt-2">
                    {formatCurrency(47500)} <span className="text-xs text-slate-400 font-normal">(@ ₹9.50 / ఇటుక)</span>
                  </p>
                </div>
                <button
                  onClick={() => handleOrderMaterialDirectly(products[2], 5000)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs"
                >
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>ఇటుకలు ఆర్డర్ చేయండి</span>
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(3)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                ← వెనుకకు
              </button>
              <button onClick={() => setCurrentStep(5)} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                తదుపరి దశ: ఎలక్ట్రీషియన్, ప్లంబర్ & కార్మికుల నియామకం →
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: HIRE WORKERS & SUBCONTRACTORS */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full">
                {t('journey.step5Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                5. ఎలక్ట్రీషియన్, ప్లంబర్, తాపీ మేస్త్రీ బుకింగ్ (Hire Verified Trade Workforce)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                నిపుణులను పారదర్శక రోజువారీ వేతనంతో నేరుగా బుక్ చేయండి. వారి రోజువారీ పని పురోగతిని యాప్‌లో పరిశీలించండి.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Electrician */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-amber-50 text-amber-600"><Zap className="w-4 h-4" /></span>
                    <span className="text-xs font-black uppercase text-amber-700">ఎలక్ట్రీషియన్</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{providers[2]?.name || 'పి. వెంకటరావు'}</h4>
                  <p className="text-xs text-slate-500">15 ఏళ్ల అనుభవం • గ్రేడ్-A లైసెన్స్డ్ కాంట్రాక్టర్</p>
                  <p className="text-base font-black text-slate-900 mt-2">
                    {formatCurrency(1100)} / రోజువారీ వేతనం
                  </p>
                </div>
                <button
                  onClick={() => handleHireWorkerDirectly(providers[2])}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                >
                  ఎలక్ట్రీషియన్ ని బుక్ చేయండి
                </button>
              </div>

              {/* Plumber */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-blue-50 text-blue-600"><Droplets className="w-4 h-4" /></span>
                    <span className="text-xs font-black uppercase text-blue-700">ప్లంబర్</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{providers[3]?.name || 'మొహమ్మద్ రియాజ్'}</h4>
                  <p className="text-xs text-slate-500">14 ఏళ్ల అనుభవం • ఆశీర్వాద్ సర్టిఫైడ్ మాస్టర్ ప్లంబర్</p>
                  <p className="text-base font-black text-slate-900 mt-2">
                    {formatCurrency(1050)} / రోజువారీ వేతనం
                  </p>
                </div>
                <button
                  onClick={() => handleHireWorkerDirectly(providers[3])}
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  ప్లంబర్ ని బుక్ చేయండి
                </button>
              </div>

              {/* Mason */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><HardHat className="w-4 h-4" /></span>
                    <span className="text-xs font-black uppercase text-emerald-700">తాపీ మేస్త్రీ</span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">{providers[4]?.name || 'కె. నరసింహా రెడ్డి'}</h4>
                  <p className="text-xs text-slate-500">20 ఏళ్ల అనుభవం • బ్రిక్‌వర్క్ & ప్లాస్టరింగ్ స్పెషలిస్ట్</p>
                  <p className="text-base font-black text-slate-900 mt-2">
                    {formatCurrency(1200)} / రోజువారీ వేతనం
                  </p>
                </div>
                <button
                  onClick={() => handleHireWorkerDirectly(providers[4])}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  మేస్త్రీ బృందాన్ని బుక్ చేయండి
                </button>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(4)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                ← వెనుకకు
              </button>
              <button onClick={() => setCurrentStep(6)} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                తదుపరి దశ: భారీ యంత్రాలు (JCB) →
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: HEAVY MACHINERY & LOGISTICS */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full">
                {t('journey.step6Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                6. JCB & కాంక్రీట్ మిక్సర్లు సైట్‌కు రప్పించండి (Heavy Machinery Deployment)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                పునాది తవ్వకాలు మరియు పిల్లర్ స్లాబ్ కాస్టింగ్ కోసం సర్టిఫైడ్ ఆపరేటర్‌తో కూడిన యంత్రాల ఫ్లీట్.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-sky-50 text-sky-600"><Truck className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">JCB 3DX సూపర్ ఎకో బ్యాక్‌హో లోడర్</h4>
                    <p className="text-xs text-slate-500">లైసెన్స్డ్ ఆపరేటర్ సహితం • గంటకు ₹1,250</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  పునాది గుంతల తవ్వకం మరియు గ్రావెల్ మట్టి లెవెలింగ్ పనులను త్వరితగతిన పూర్తి చేయడానికి.
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-base">₹ 9,500 / రోజుకు</span>
                  <button
                    onClick={() => handleDeployMachinery('JCB 3DX')}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                  >
                    JCB ని సైట్‌కు పంపించండి
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-2xs">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600"><Layers className="w-6 h-6" /></div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">కాంక్రీట్ మిక్సర్ మెషిన్ & స్కాఫోల్డింగ్</h4>
                    <p className="text-xs text-slate-500">1 బ్యాగ్ కెపాసిటీ డీజిల్ మిక్సర్</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600">
                  కాలమ్స్ మరియు స్లాబ్ కాస్టింగ్ కోసం యూనిఫామ్ కాంక్రీట్ మిక్సింగ్ సిస్టమ్.
                </p>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                  <span className="font-black text-slate-900 text-base">₹ 2,400 / రోజుకు</span>
                  <button
                    onClick={() => handleDeployMachinery('కాంక్రీట్ మిక్సర్')}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                  >
                    మిక్సర్ బుక్ చేయండి
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(5)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                ← వెనుకకు
              </button>
              <button onClick={() => setCurrentStep(7)} className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold">
                తదుపరి దశ: గృహ ప్రవేశం & నిర్వహణ →
              </button>
            </div>
          </div>
        )}

        {/* STEP 7: HANDOVER, MOVE-IN & AMC */}
        {currentStep === 7 && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                {t('journey.step7Title')}
              </span>
              <h3 className="text-xl font-black text-slate-900 mt-2">
                7. అధికారిక గృహ ప్రవేశం & వార్షిక నిర్వహణ (Move-In & AMC Protection)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                6 నాణ్యతా ఇంజనీరింగ్ పరీక్షలు పూర్తయ్యాయి. గృహ ప్రవేశ తాళాలు అందుకోండి మరియు లైఫ్‌లాంగ్ కేర్ ప్లాన్‌లో చేరండి.
              </p>
            </div>

            <div className="rounded-2xl bg-gradient-to-r from-emerald-900 via-slate-900 to-slate-900 text-white p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase text-brand-400">గృహ ప్రవేశ సంసిద్ధత</span>
                  <h4 className="text-2xl font-black mt-1">100% నిర్మాణం పూర్తయింది</h4>
                  <p className="text-xs text-slate-300 mt-0.5">సాయిల్ టెస్ట్ నుండి పెయింటింగ్ వరకు మొత్తం 28 మైలురాళ్లు సక్సెస్.</p>
                </div>
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-2xl">
                  READY
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="font-bold text-brand-300 block">వాటర్ ట్యాంక్ డీప్ శానిటైజేషన్:</span>
                  <span className="text-slate-400">అండర్‌గ్రౌండ్ సంప్ మరియు 1000L ట్యాంక్ క్లీనింగ్ షెడ్యూల్ అయింది.</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-300 block">వార్షిక గృహ రక్షణ (AMC):</span>
                  <span className="text-slate-400">24/7 ఎమర్జెన్సీ బ్రేక్‌డౌన్ హెల్ప్‌లైన్ మరియు త్రైమాసిక తనిఖీలు.</span>
                </div>
              </div>

              <button
                onClick={handleFinalHandover}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-sm flex items-center justify-center space-x-2 transition-transform active:scale-98 shadow-lg"
              >
                <Award className="w-5 h-5" />
                <span>గృహ ప్రవేశ తాళాలు అందుకోండి & AMC కేర్ యాక్టివేట్ చేయండి</span>
              </button>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <button onClick={() => setCurrentStep(6)} className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600">
                ← వెనుకకు
              </button>
              <div className="text-xs font-bold text-emerald-700 flex items-center space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>పూర్తి నిర్మాణ ప్రయాణం విజయవంతంగా అమలు చేయబడింది!</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Persistent Active Project Summary Bar */}
      <div className="bg-slate-50 border-t border-slate-200 p-4 sm:p-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-700 gap-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('journey.siteSelected')}</span>
            <strong className="text-slate-900">{selectedPlot.title.split('(')[0]}</strong>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('journey.materialsOrdered')}</span>
            <strong className="text-emerald-700">సిమెంట్ & స్టీల్ ఆర్డర్లు సైట్‌లో ఉన్నాయి</strong>
          </div>
          <div className="border-l border-slate-200 pl-4">
            <span className="text-slate-400 block text-[10px] uppercase font-bold">{t('journey.workersHired')}</span>
            <strong className="text-amber-700">ఎలక్ట్రీషియన్ & ప్లంబర్ యాక్టివ్</strong>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
          అన్నీ ఒకే యాప్‌లో వర్క్ అవుతున్నాయి (All in One App)
        </span>
      </div>
    </div>
  );
};
