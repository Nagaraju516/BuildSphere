import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  Building,
  ShoppingCart,
  Users,
  Truck,
  CheckSquare,
  PieChart,
  Wrench,
  ShieldAlert,
  Search,
  Bell,
  Globe,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Check,
  Heart,
} from 'lucide-react';
import { useAppStore } from '../../store';
import { useI18n } from '../../i18n';
import { SupportedLanguage, UserRole } from '../../types';
import { GlobalSearchModal } from './GlobalSearchModal';

export const Header: React.FC = () => {
  const location = useLocation();
  const { t, language, setLanguage } = useI18n();
  const {
    currentUser,
    switchUserRole,
    cart,
    notifications,
    markAllNotificationsAsRead,
  } = useAppStore();

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);
  const [isNotifMenuOpen, setIsNotifMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifs = notifications.filter((n) => !n.read);

  const navLinks = [
    { to: '/', label: t('nav.home'), icon: Compass },
    { to: '/properties', label: t('nav.properties'), icon: Building },
    { to: '/materials', label: t('nav.materials'), icon: ShoppingCart },
    { to: '/services', label: t('nav.services'), icon: Users },
    { to: '/equipment', label: t('nav.equipment'), icon: Truck },
    { to: '/projects', label: t('nav.projects'), icon: CheckSquare },
    { to: '/finance', label: t('nav.finance'), icon: PieChart },
    { to: '/maintenance', label: t('nav.maintenance'), icon: Wrench },
    { to: '/admin', label: t('nav.admin'), icon: ShieldAlert },
  ];

  const languages: { code: SupportedLanguage; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  const personas: { role: UserRole; label: string; desc: string }[] = [
    { role: 'homeowner', label: t('auth.roles.homeowner'), desc: 'Build, buy materials & track home' },
    { role: 'contractor', label: t('auth.roles.contractor'), desc: 'Receive quotes, bid & execute' },
    { role: 'supplier', label: t('auth.roles.supplier'), desc: 'Sell materials & manage inventory' },
    { role: 'admin', label: t('auth.roles.admin'), desc: 'Platform oversight & approvals' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
        {/* Top Info Bar */}
        <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-200">BuildSphere Master Monolith</span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-400">{t('common.demoNotice')}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-slate-400 hidden sm:inline">Market: India (Pan-India)</span>
            <div className="flex items-center space-x-1 font-semibold text-brand-400">
              <span>₹ INR</span>
            </div>
            <div className="flex items-center space-x-1 pl-2 border-l border-slate-700 text-[11px]">
              <span className="text-slate-400 hidden sm:inline">భాష / Lang:</span>
              <button onClick={() => setLanguage('en')} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${language === 'en' ? 'bg-white text-slate-900' : 'text-slate-400 hover:text-white'}`}>EN</button>
              <button onClick={() => setLanguage('te')} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${language === 'te' ? 'bg-brand-500 text-white font-black' : 'text-slate-400 hover:text-white'}`}>తెలుగు</button>
              <button onClick={() => setLanguage('hi')} className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${language === 'hi' ? 'bg-amber-500 text-white font-black' : 'text-slate-400 hover:text-white'}`}>हिन्दी</button>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Brand Logo */}
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2.5 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                      Build<span className="text-brand-600">Sphere</span>
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 hidden sm:block -mt-1">
                    {t('common.tagline')}
                  </p>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation Links (Scrollable or condensed) */}
            <nav className="hidden xl:flex items-center space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 font-bold border border-brand-200 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons & Switches */}
            <div className="flex items-center space-x-2">
              {/* Universal Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 text-xs font-medium transition-colors"
                title="Search everything"
              >
                <Search className="w-4 h-4 text-slate-400" />
                <span className="hidden md:inline">{t('common.search')}...</span>
                <kbd className="hidden lg:inline text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs text-slate-400">
                  Ctrl+K
                </kbd>
              </button>

              {/* Prominent Direct 3-Language Selector Buttons */}
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200 shadow-2xs">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'en'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200 ring-1 ring-slate-900/10'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title="Switch to English"
                >
                  🇬🇧 English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'te'
                      ? 'bg-brand-600 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title="తెలుగులోకి మార్చండి"
                >
                  🇮🇳 తెలుగు
                </button>
                <button
                  onClick={() => setLanguage('hi')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    language === 'hi'
                      ? 'bg-amber-600 text-white shadow-xs font-black'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
                  title="हिन्दी में बदलें"
                >
                  🇮🇳 हिन्दी
                </button>
              </div>

              {/* Persona Switcher Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline capitalize">{currentUser.role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isPersonaMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500">{currentUser.email}</p>
                    </div>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {t('auth.switchRole')}
                    </div>
                    {personas.map((p) => (
                      <button
                        key={p.role}
                        onClick={() => {
                          switchUserRole(p.role);
                          setIsPersonaMenuOpen(false);
                        }}
                        className={`w-full flex items-start justify-between px-3.5 py-2 text-left transition-colors ${
                          currentUser.role === p.role
                            ? 'bg-brand-50 text-brand-700'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <p className="text-xs font-bold">{p.label}</p>
                          <p className="text-[10px] text-slate-400">{p.desc}</p>
                        </div>
                        {currentUser.role === p.role && (
                          <Check className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifMenuOpen(!isNotifMenuOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title={t('common.notifications')}
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
                  )}
                </button>

                {isNotifMenuOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 z-50 animate-fadeIn">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                      <h4 className="text-xs font-bold text-slate-900">
                        {t('common.notifications')} ({unreadNotifs.length})
                      </h4>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] font-semibold text-brand-600 hover:text-brand-700"
                        >
                          {t('notifications.markAllRead')}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-400 text-center py-6">
                          {t('notifications.empty')}
                        </p>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${
                              !n.read ? 'bg-brand-50/40' : ''
                            }`}
                          >
                            <p className="text-xs font-bold text-slate-800">{n.title}</p>
                            <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                            <span className="text-[9px] text-slate-400 mt-1 inline-block">
                              {new Date(n.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart Button */}
              <Link
                to="/materials/cart"
                className="relative flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-transform active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span className="hidden sm:inline">{t('common.myCart')}</span>
                {cartItemsCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 bg-white text-brand-700 rounded-full text-[10px] font-black">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="xl:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-1 animate-fadeIn">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Search Dialog Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
