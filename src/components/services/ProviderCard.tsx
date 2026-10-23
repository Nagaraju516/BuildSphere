import React from 'react';
import { ServiceProvider } from '../../types';
import { formatIndianRupees } from '../../utils/currencyFormatter';
import { Star } from 'lucide-react';

interface Props {
  provider: ServiceProvider;
  onSelect?: (provider: ServiceProvider) => void;
}

export const ProviderCard: React.FC<Props> = ({ provider, onSelect }) => (
  <div
    onClick={() => onSelect && onSelect(provider)}
    className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3 hover:shadow-md transition-all cursor-pointer"
  >
    <div className="flex items-center space-x-3">
      <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full object-cover" />
      <div>
        <h4 className="font-bold text-slate-900 text-sm">{provider.name}</h4>
        <p className="text-xs text-slate-500 capitalize">{provider.trade.replace('_', ' ')}</p>
      </div>
    </div>
    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
      <span className="font-black text-slate-900">{formatIndianRupees(provider.indicativeDailyRate)} / day</span>
      <span className="flex items-center text-amber-500 font-bold">
        <Star className="w-3 h-3 fill-current mr-1" />
        {provider.rating}
      </span>
    </div>
  </div>
);
