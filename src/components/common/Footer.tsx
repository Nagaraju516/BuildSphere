import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ShieldCheck, Heart, MapPin, Phone, Mail, Award, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n';

export const Footer: React.FC = () => {
  const { t } = useI18n();

  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-amber-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
                <Building className="w-6 h-6" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Build<span className="text-brand-500">Sphere</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t('common.tagline')} Connecting land due diligence, architectural blueprints, certified building materials, skilled trade workers, heavy machinery, and post-construction AMC care in one unified super app.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/50 text-emerald-300 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Zero-API-Key Architecture: 100% Self-Contained Monolith</span>
            </div>
          </div>

          {/* Module 1 & 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Land & Marketplace
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  {t('nav.properties')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  {t('property.dueDiligenceChecklist')}
                </Link>
              </li>
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  {t('property.architectServices')}
                </Link>
              </li>
              <li>
                <Link to="/materials" className="hover:text-white transition-colors">
                  {t('nav.materials')}
                </Link>
              </li>
              <li>
                <Link to="/materials/orders" className="hover:text-white transition-colors">
                  {t('materials.orderHistory')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Module 3 & 4 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Workers & Machinery
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="hover:text-white transition-colors">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/services/quotations" className="hover:text-white transition-colors">
                  {t('services.requestQuote')}
                </Link>
              </li>
              <li>
                <Link to="/services/bookings" className="hover:text-white transition-colors">
                  {t('services.activeBookings')}
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-white transition-colors">
                  {t('nav.equipment')}
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-white transition-colors">
                  {t('equipment.smartHomeTech')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Module 5 & 6 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Lifecycle & Finance
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  {t('projects.milestonesTitle')}
                </Link>
              </li>
              <li>
                <Link to="/finance" className="hover:text-white transition-colors">
                  {t('nav.finance')}
                </Link>
              </li>
              <li>
                <Link to="/projects/handover" className="hover:text-white transition-colors">
                  {t('projects.handoverChecklist')}
                </Link>
              </li>
              <li>
                <Link to="/maintenance" className="hover:text-white transition-colors">
                  {t('nav.maintenance')}
                </Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-white transition-colors">
                  {t('nav.support')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Cities & Disclaimers */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="font-semibold text-slate-400">Supported Regions:</span>
            <span>Hyderabad (GHMC/HMDA)</span>
            <span>•</span>
            <span>Bengaluru (BBMP/BDA)</span>
            <span>•</span>
            <span>Amaravati & Vijayawada (APCRDA)</span>
            <span>•</span>
            <span>Visakhapatnam (VMRDA)</span>
            <span>•</span>
            <span>Chennai (CMDA)</span>
            <span>•</span>
            <span>Pune (PMRDA)</span>
          </div>
          <div className="text-right">
            <span>© {new Date().getFullYear()} BuildSphere Technologies. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
