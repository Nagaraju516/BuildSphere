import React, { useState } from 'react';
import { Search, X, Building, ShoppingCart, Users, Truck, CheckCircle2, Wrench } from 'lucide-react';
import { useAppStore } from '../../store';
import { useI18n } from '../../i18n';
import { Link } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const { globalSearch } = useAppStore();
  const { t, formatCurrency } = useI18n();
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const results = globalSearch(query);

  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'properties':
        return <Building className="w-5 h-5 text-indigo-600" />;
      case 'materials':
        return <ShoppingCart className="w-5 h-5 text-emerald-600" />;
      case 'services':
        return <Users className="w-5 h-5 text-amber-600" />;
      case 'equipment':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'projects':
        return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
      case 'maintenance':
        return <Wrench className="w-5 h-5 text-rose-600" />;
      default:
        return <Search className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="flex items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-6 h-6 text-slate-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('common.searchPlaceholder')}
            className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-lg focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-4">
          {query.trim() === '' ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-slate-600">Type to search across all 6 construction modules</p>
              <p className="text-sm text-slate-400 mt-1">Try: "Cement", "HMDA", "JCB", "Electrician", "Slab", "Plumbing"</p>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p className="font-semibold text-slate-700">{t('common.noResults')}</p>
              <p className="text-sm text-slate-400 mt-1">{t('common.tryDifferentSearch')}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                Found {results.length} results
              </p>
              {results.map((res) => (
                <Link
                  key={`${res.module}-${res.id}`}
                  to={res.url}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-lg bg-slate-100 group-hover:bg-white group-hover:shadow-sm">
                      {getModuleIcon(res.module)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm group-hover:text-brand-600 transition-colors">
                        {res.title}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-1">{res.subtitle}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-brand-50 group-hover:text-brand-700 mb-1">
                      {res.badge}
                    </span>
                    {res.price !== undefined && (
                      <p className="text-xs font-semibold text-slate-900">
                        {formatCurrency(res.price, true)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
