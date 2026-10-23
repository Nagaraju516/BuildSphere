import React, { useState } from 'react';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wrench,
  Sun,
  Shield,
  Zap,
  Clock,
  ArrowRight,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Equipment, EquipmentRentalBooking } from '../types';

export const EquipmentPage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const {
    equipmentList,
    rentals,
    smartHomeList,
    bookEquipmentRental,
    updateRentalStatus,
    currentUser,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'fleet' | 'rentals' | 'smart'>('fleet');
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [daysCount, setDaysCount] = useState(2);
  const [operatorRequested, setOperatorRequested] = useState(true);
  const [bookingToast, setBookingToast] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEquipment) return;

    const endDate = new Date(new Date(startDate).getTime() + daysCount * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    bookEquipmentRental({
      equipmentId: selectedEquipment.id,
      startDate,
      endDate,
      daysCount,
      deliveryAddress: currentUser.addresses[0],
      operatorRequested,
    });

    setBookingToast(true);
    setTimeout(() => {
      setSelectedEquipment(null);
      setBookingToast(false);
      setActiveTab('rentals');
    }, 1500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-sky-100 text-sky-800 px-2.5 py-0.5 rounded-full">
              Module 4
            </span>
            <span className="text-xs font-semibold text-slate-500">Fleet Rental & Smart Infrastructure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('equipment.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('equipment.subtitle')}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('fleet')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'fleet' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('equipment.rentalCatalog')}
          </button>
          <button
            onClick={() => setActiveTab('rentals')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'rentals' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('equipment.activeRentals')} ({rentals.length})
          </button>
          <button
            onClick={() => setActiveTab('smart')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'smart' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('equipment.smartHomeTech')}
          </button>
        </div>
      </div>

      {/* TAB 1: FLEET */}
      {activeTab === 'fleet' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {equipmentList.map((eq) => (
            <div
              key={eq.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all card-hover p-6 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative h-56 rounded-xl overflow-hidden bg-slate-100">
                  <img src={eq.image} alt={eq.name} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                    {eq.category} • Model: {eq.model}
                  </span>
                  {eq.operatorProvided && (
                    <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                      Certified Operator Included
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{eq.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Fleet Base: {eq.city} • Available Units: {eq.availableCount}</p>
                </div>

                {/* Specs */}
                <div className="rounded-xl border border-slate-100 divide-y divide-slate-100 text-xs">
                  {Object.entries(eq.specifications).map(([k, v]) => (
                    <div key={k} className="p-2 flex justify-between">
                      <span className="text-slate-500">{k}:</span>
                      <strong className="text-slate-800">{v}</strong>
                    </div>
                  ))}
                </div>

                {/* Rates */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{t('equipment.dailyRate')}</span>
                    <strong className="text-base font-black text-slate-900">
                      {formatCurrency(eq.dailyRate)} / day
                    </strong>
                  </div>
                  {eq.hourlyRate > 0 && (
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{t('equipment.hourlyRate')}</span>
                      <strong className="text-sm font-bold text-slate-700">
                        {formatCurrency(eq.hourlyRate)} / hr
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setSelectedEquipment(eq)}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center space-x-1.5 shadow-xs transition-colors"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{t('equipment.bookEquipment')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: ACTIVE RENTALS */}
      {activeTab === 'rentals' && (
        <div className="space-y-6">
          {rentals.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <span className="text-sm font-black text-slate-900">{r.bookingNumber}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{r.equipmentName}</h3>
                  <p className="text-xs text-slate-500">
                    Deployment: {formatDate(r.startDate)} to {formatDate(r.endDate)} ({r.daysCount} days)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200 block mb-1">
                    {r.status.toUpperCase()}
                  </span>
                  <span className="text-base font-black text-slate-900">
                    {formatCurrency(r.totalCost)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-800">Site Unloading Address:</p>
                  <p>{r.deliveryAddress.street}, {r.deliveryAddress.city}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50">
                  <p className="font-bold text-slate-800">Operator & Inspection:</p>
                  <p>{r.operatorRequested ? 'Dedicated Heavy Machinery Operator Deployed' : 'Self-Operated Equipment'}</p>
                  {r.damageCheckNotes && <p className="italic text-slate-500 mt-1">{r.damageCheckNotes}</p>}
                </div>
              </div>

              {/* Status Simulation */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400">Current On-Site Deployment Milestone</span>
                <select
                  value={r.status}
                  onChange={(e) => updateRentalStatus(r.id, e.target.value as any)}
                  className="text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="dispatched">Dispatched to Site</option>
                  <option value="on_site">Operating On-Site</option>
                  <option value="pickup_scheduled">Pickup Scheduled</option>
                  <option value="returned">Returned & Inspected</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SMART HOME & SOLAR */}
      {activeTab === 'smart' && (
        <div className="space-y-6">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              {t('equipment.smartHomeTech')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {t('equipment.smartTechDesc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {smartHomeList.map((smart) => (
              <div
                key={smart.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden p-6 space-y-4 shadow-2xs hover:shadow-md transition-all"
              >
                <div className="relative h-52 rounded-xl overflow-hidden bg-slate-100">
                  <img src={smart.image} alt={smart.title} className="w-full h-full object-cover" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-900/80 text-white">
                    {smart.category}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{smart.brand}</span>
                  <h3 className="text-base font-bold text-slate-900 mt-0.5">{smart.title}</h3>
                  <p className="text-sm font-extrabold text-brand-700 mt-1">
                    Indicative Cost: {formatCurrency(smart.indicativeCost)}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-[11px] font-bold text-slate-700 uppercase">Key Benefits</p>
                  {smart.benefits.map((b, i) => (
                    <div key={i} className="flex items-center space-x-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600 flex-shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 text-xs font-bold transition-colors">
                  Request Supplier Site Feasibility Survey
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Equipment Booking Modal */}
      {selectedEquipment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Book {selectedEquipment.name}</h3>
              <button onClick={() => setSelectedEquipment(null)} className="p-1 text-slate-400">✕</button>
            </div>

            {bookingToast ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h4 className="font-bold text-slate-900">{t('equipment.equipmentBooked')}</h4>
                <p className="text-xs text-slate-500">Fleet dispatch registered and expense logged in Finance Hub.</p>
              </div>
            ) : (
              <form onSubmit={handleBook} className="space-y-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Deployment Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Duration (Days): {daysCount}</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={daysCount}
                    onChange={(e) => setDaysCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div className="flex items-center space-x-2 p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="opReq"
                    checked={operatorRequested}
                    onChange={(e) => setOperatorRequested(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                  <label htmlFor="opReq" className="text-xs font-semibold text-slate-700">
                    Include Certified Heavy Equipment Operator
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-sky-50 border border-sky-100 flex justify-between items-center text-sky-950">
                  <span className="font-bold">Total Rental Estimate:</span>
                  <strong className="text-base font-black">
                    {formatCurrency(selectedEquipment.dailyRate * daysCount)}
                  </strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold"
                >
                  Confirm Fleet Deployment
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
