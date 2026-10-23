import React, { useState } from 'react';
import {
  MapPin,
  Compass,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  ShieldCheck,
  Building,
  ArrowRight,
  Phone,
  Eye,
  FileCheck,
  Check,
  Copy,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useI18n } from '../../i18n';
import { useAppStore } from '../../store';
import { Property } from '../../types';

interface LandLocationMapProps {
  onSelectProperty?: (prop: Property) => void;
  onViewDueDiligence?: (prop: Property) => void;
  onRequestVisit?: (prop: Property) => void;
}

export const LandLocationMap: React.FC<LandLocationMapProps> = ({
  onSelectProperty,
  onViewDueDiligence,
  onRequestVisit,
}) => {
  const { t, formatCurrency } = useI18n();
  const { properties } = useAppStore();

  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [mapLayer, setMapLayer] = useState<'streets' | 'satellite' | 'cadastral'>('streets');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPlot, setSelectedPlot] = useState<Property>(properties[0]);
  const [hoveredPlot, setHoveredPlot] = useState<Property | null>(null);
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Filter properties based on city
  const filteredPlots = properties.filter((p) => {
    if (selectedCity === 'all') return true;
    if (selectedCity === 'Hyderabad') return p.location.city === 'Hyderabad';
    if (selectedCity === 'Bengaluru') return p.location.city === 'Bengaluru';
    if (selectedCity === 'Amaravati') return p.location.city === 'Vijayawada' || p.location.locality.includes('Amaravati');
    return true;
  });

  // Center coordinates for map viewports
  const getCityBounds = () => {
    if (selectedCity === 'Hyderabad') {
      return { minLat: 17.20, maxLat: 17.52, minLng: 78.10, maxLng: 78.50 };
    }
    if (selectedCity === 'Bengaluru') {
      return { minLat: 12.92, maxLat: 13.06, minLng: 77.65, maxLng: 77.85 };
    }
    if (selectedCity === 'Amaravati') {
      return { minLat: 16.38, maxLat: 16.52, minLng: 80.48, maxLng: 80.65 };
    }
    // Default pan-India view bounded to South Central corridor
    return { minLat: 12.80, maxLat: 17.60, minLng: 77.50, maxLng: 80.70 };
  };

  const bounds = getCityBounds();

  // Project lat/lng to percentage coordinates on the SVG map canvas
  const projectToPlotPosition = (prop: Property) => {
    const lat = prop.location.coordinates?.lat || 17.40;
    const lng = prop.location.coordinates?.lng || 78.35;

    // Normalizing within city/all boundaries
    const latPercent = 100 - ((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * 100;
    const lngPercent = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100;

    // Constrain within 10% to 90% viewable zone
    const constrainedX = Math.max(12, Math.min(88, lngPercent));
    const constrainedY = Math.max(12, Math.min(88, latPercent));

    return { x: constrainedX, y: constrainedY };
  };

  const handleCopyCoords = (lat?: number, lng?: number) => {
    if (!lat || !lng) return;
    navigator.clipboard.writeText(`${lat}, ${lng}`);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  return (
    <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xl space-y-0">
      {/* Top Map Control Bar */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1 rounded bg-brand-500/20 text-brand-400">
              <MapPin className="w-4 h-4 text-brand-400" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-brand-400">
              Interactive GIS Land Location Map
            </span>
          </div>
          <h3 className="text-lg font-black text-white mt-1">
            Explore Verified Land Parcels & Plots
          </h3>
          <p className="text-xs text-slate-400">
            Click any plot marker to view satellite topography, survey numbers, and legal clearances.
          </p>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 text-xs font-bold">
          <button
            onClick={() => { setSelectedCity('all'); setZoomLevel(1); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCity === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            All Regions ({properties.length})
          </button>
          <button
            onClick={() => { setSelectedCity('Hyderabad'); setZoomLevel(1.2); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCity === 'Hyderabad'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Hyderabad Corridor (4)
          </button>
          <button
            onClick={() => { setSelectedCity('Bengaluru'); setZoomLevel(1.2); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCity === 'Bengaluru'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Bengaluru (1)
          </button>
          <button
            onClick={() => { setSelectedCity('Amaravati'); setZoomLevel(1.2); }}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              selectedCity === 'Amaravati'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            Amaravati / AP (1)
          </button>
        </div>
      </div>

      {/* Main Map + Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        {/* Left Side: Interactive Map Visualizer Canvas */}
        <div className="lg:col-span-8 relative bg-slate-950 overflow-hidden flex flex-col justify-between select-none">
          {/* Layer Style Switcher Overlay */}
          <div className="absolute top-4 left-4 z-20 flex items-center space-x-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700 text-[11px] font-bold text-slate-200 shadow-lg">
            <button
              onClick={() => setMapLayer('streets')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapLayer === 'streets' ? 'bg-brand-600 text-white shadow-xs' : 'hover:bg-slate-800'
              }`}
            >
              🗺️ GIS Master Plan
            </button>
            <button
              onClick={() => setMapLayer('satellite')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapLayer === 'satellite' ? 'bg-brand-600 text-white shadow-xs' : 'hover:bg-slate-800'
              }`}
            >
              🛰️ Satellite Imagery
            </button>
            <button
              onClick={() => setMapLayer('cadastral')}
              className={`px-2.5 py-1.5 rounded-lg transition-all ${
                mapLayer === 'cadastral' ? 'bg-brand-600 text-white shadow-xs' : 'hover:bg-slate-800'
              }`}
            >
              📐 Cadastral Survey
            </button>
          </div>

          {/* Zoom & View Controls Overlay */}
          <div className="absolute top-4 right-4 z-20 flex flex-col space-y-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 text-slate-200 shadow-lg">
            <button
              onClick={() => setZoomLevel((prev) => Math.min(2, Number((prev + 0.2).toFixed(1))))}
              title="Zoom In"
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((prev) => Math.max(0.8, Number((prev - 0.2).toFixed(1))))}
              title="Zoom Out"
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => { setZoomLevel(1); setSelectedCity('all'); }}
              title="Reset View"
              className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* SVG Map Canvas with Interactive Visuals */}
          <div className="relative w-full h-[520px] lg:h-full overflow-hidden flex items-center justify-center">
            {/* Map Background Layer depending on mode */}
            <div
              className="absolute inset-0 transition-transform duration-500 ease-out"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              {mapLayer === 'satellite' ? (
                // Satellite Photorealistic Background Grid
                <div className="absolute inset-0 bg-[#0f172a] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-90">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-slate-900 to-teal-950/30"></div>
                  {/* Simulated River / Water body */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                    <path
                      d="M -50 250 Q 200 200, 400 320 T 900 280 T 1200 350"
                      fill="none"
                      stroke="#0284c7"
                      strokeWidth="24"
                      strokeLinecap="round"
                    />
                    <path
                      d="M -50 250 Q 200 200, 400 320 T 900 280 T 1200 350"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="6"
                      strokeDasharray="8 8"
                    />
                  </svg>
                </div>
              ) : mapLayer === 'cadastral' ? (
                // Survey & Boundary Blueprint Cadastral Grid
                <div className="absolute inset-0 bg-[#090d16] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:32px_32px]">
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_0.5px,transparent_0.5px)] [background-size:8px_8px] opacity-20"></div>
                </div>
              ) : (
                // GIS Streets & Master Plan View
                <div className="absolute inset-0 bg-slate-950 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px]">
                  {/* Outer Ring Road (ORR) Arterial Highway Arc */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
                    {/* Ring Expressway */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="38%"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="6"
                      strokeDasharray="12 6"
                    />
                    {/* Radial Highways */}
                    <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#64748b" strokeWidth="4" />
                    <line x1="85%" y1="15%" x2="15%" y2="85%" stroke="#64748b" strokeWidth="4" />
                    <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#475569" strokeWidth="3" />
                  </svg>
                </div>
              )}

              {/* Geographic Region Label Badges on Map */}
              <div className="absolute top-[18%] left-[24%] pointer-events-none opacity-50">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Tellapur - Neopolis Corridor (ORR Exit 2)
                </span>
              </div>
              <div className="absolute bottom-[28%] left-[16%] pointer-events-none opacity-50">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Shankarpally - Vikarabad State Highway
                </span>
              </div>
              <div className="absolute bottom-[16%] right-[22%] pointer-events-none opacity-50">
                <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Shamshabad RGIA Airport Corridor
                </span>
              </div>

              {/* Interactive Property Map Markers */}
              {filteredPlots.map((plot) => {
                const pos = projectToPlotPosition(plot);
                const isSelected = selectedPlot?.id === plot.id;
                const isHovered = hoveredPlot?.id === plot.id;

                return (
                  <div
                    key={plot.id}
                    onClick={() => {
                      setSelectedPlot(plot);
                      if (onSelectProperty) onSelectProperty(plot);
                    }}
                    onMouseEnter={() => setHoveredPlot(plot)}
                    onMouseLeave={() => setHoveredPlot(null)}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 group"
                  >
                    {/* Pulsating Radar Wave on Selected Marker */}
                    {isSelected && (
                      <span className="absolute -inset-4 rounded-full bg-brand-500/30 animate-ping pointer-events-none"></span>
                    )}

                    {/* Cadastral Boundary polygon preview when selected */}
                    {isSelected && (
                      <div className="absolute -top-12 -left-12 w-24 h-24 border-2 border-dashed border-amber-400 bg-amber-400/10 rounded-lg pointer-events-none animate-pulse flex items-center justify-center">
                        <span className="text-[9px] font-black uppercase text-amber-300 bg-slate-900/80 px-1 rounded">
                          {plot.dimensions}
                        </span>
                      </div>
                    )}

                    {/* Pin Marker Badge */}
                    <div
                      className={`relative flex items-center space-x-1.5 px-3 py-1.5 rounded-full shadow-2xl transition-all transform group-hover:scale-110 ${
                        isSelected
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black ring-4 ring-amber-400/40 scale-105'
                          : isHovered
                          ? 'bg-brand-500 text-white font-bold ring-2 ring-brand-300'
                          : 'bg-slate-900/90 text-white font-semibold border border-slate-700 hover:border-brand-400'
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isSelected ? 'text-slate-950 fill-current' : 'text-brand-400'
                        }`}
                      />
                      <span className="text-xs whitespace-nowrap">
                        {formatCurrency(plot.price, true)}
                      </span>
                    </div>

                    {/* Hover Info Tooltip */}
                    <div
                      className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2.5 rounded-xl bg-slate-900/95 text-white border border-slate-700 shadow-2xl pointer-events-none transition-all duration-200 z-50 ${
                        isHovered && !isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    >
                      <div className="text-[10px] font-black uppercase tracking-wider text-brand-400">
                        {plot.location.locality}
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{plot.title}</div>
                      <div className="text-[11px] text-slate-300 mt-1 flex justify-between">
                        <span>{plot.areaSqFt} sq.ft</span>
                        <span className="text-amber-400 font-bold">{plot.facing} Facing</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Map Legend */}
          <div className="p-3 bg-slate-900/95 border-t border-slate-800 flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-4">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                <span>Selected Plot</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                <span>Available Verified Plot</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded bg-amber-400/40 border border-amber-400"></span>
                <span>Survey Demarcation</span>
              </span>
            </div>

            <div className="text-slate-400">
              Showing <strong className="text-white">{filteredPlots.length}</strong> land parcels on GIS Grid
            </div>
          </div>
        </div>

        {/* Right Side: Selected Land Parcel Inspector Drawer */}
        <div className="lg:col-span-4 bg-white p-6 flex flex-col justify-between space-y-6 border-l border-slate-200 overflow-y-auto max-h-[640px]">
          {selectedPlot ? (
            <div className="space-y-5 animate-fadeIn">
              {/* Photo & Badge */}
              <div className="relative h-48 rounded-2xl overflow-hidden shadow-sm group">
                <img
                  src={selectedPlot.images[0]}
                  alt={selectedPlot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-brand-600 text-white shadow-md">
                  {selectedPlot.type.toUpperCase()} • {selectedPlot.facing} FACING
                </span>

                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-600 text-white flex items-center space-x-1 shadow-md">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{selectedPlot.legalStatus}</span>
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <p className="text-xs text-brand-300 font-bold uppercase tracking-wider">
                    {selectedPlot.location.locality}, {selectedPlot.location.city}
                  </p>
                  <h4 className="text-base font-black truncate">{selectedPlot.title}</h4>
                </div>
              </div>

              {/* Price & Dimensions Quick Banner */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Plot Price</span>
                  <span className="text-xl font-black text-slate-900">
                    {formatCurrency(selectedPlot.price)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    ₹{selectedPlot.pricePerSqFt} / sq.ft
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Size & Boundary</span>
                  <span className="text-sm font-black text-slate-800 block mt-1">
                    {selectedPlot.dimensions}
                  </span>
                  <span className="text-[11px] text-amber-600 font-bold block">
                    {selectedPlot.areaSqFt} sq.ft ({Math.round(selectedPlot.areaSqFt / 9)} Sq.Yds)
                  </span>
                </div>
              </div>

              {/* Geo-Location Details & Survey Number */}
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 flex items-center space-x-1.5">
                    <Navigation className="w-3.5 h-3.5 text-blue-600" />
                    <span>Cadastral Survey Demarcation</span>
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-blue-200/80 text-blue-900">
                    PIN {selectedPlot.location.pincode}
                  </span>
                </div>

                <p className="text-slate-700 font-semibold">
                  {selectedPlot.location.surveyNumber || 'Survey No. Verified & Demarcated'}
                </p>

                {selectedPlot.location.coordinates && (
                  <div className="flex items-center justify-between pt-1 border-t border-blue-100 text-[11px] text-slate-600">
                    <span>
                      GPS: {selectedPlot.location.coordinates.lat}° N, {selectedPlot.location.coordinates.lng}° E
                    </span>
                    <button
                      onClick={() =>
                        handleCopyCoords(
                          selectedPlot.location.coordinates?.lat,
                          selectedPlot.location.coordinates?.lng
                        )
                      }
                      className="text-blue-700 hover:text-blue-900 font-bold flex items-center space-x-1"
                    >
                      {copiedCoords ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy GPS</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Verified Site Highlights</span>
                <div className="space-y-1.5">
                  {selectedPlot.highlights.map((h, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seller / Builder Info */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Listing Contact</span>
                  <span className="font-bold text-slate-800">{selectedPlot.seller.name}</span>
                  <span className="text-slate-500 capitalize block text-[11px]">({selectedPlot.seller.type})</span>
                </div>
                <a
                  href={`tel:${selectedPlot.seller.phone}`}
                  className="px-3 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center space-x-1 transition-colors"
                >
                  <Phone className="w-3 h-3 text-brand-600" />
                  <span>Call</span>
                </a>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    if (onSelectProperty) onSelectProperty(selectedPlot);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-600 to-emerald-600 hover:from-brand-500 hover:to-emerald-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Select & Start Construction on this Land</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      if (onViewDueDiligence) onViewDueDiligence(selectedPlot);
                    }}
                    className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Legal Due Diligence</span>
                  </button>

                  <button
                    onClick={() => {
                      if (onRequestVisit) onRequestVisit(selectedPlot);
                    }}
                    className="py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-slate-700 text-xs flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-600" />
                    <span>Book Site Visit</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 py-12">
              <MapPin className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
              <p className="text-sm font-bold text-slate-600">No Land Parcel Selected</p>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Click on any pin on the map to inspect boundary dimensions, legal clearance, and satellite position.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
