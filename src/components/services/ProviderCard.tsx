import React from 'react';
import { Provider } from '../../types';
import { Star, ShieldCheck } from 'lucide-react';
import { formatIndianRupees } from '../../utils/currencyFormatter';

interface Props {
  provider: Provider;
  onBook?: (prov: Provider) => void;
}

export const ProviderCard: React.FC<Props> = ({ provider, onBook }) => (
  <div className=\"rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3\">
    <div className=\"flex items-center space-x-3\">
      <img src={provider.avatar} alt={provider.name} className=\"w-12 h-12 rounded-full object-cover\" />
      <div>
        <h4 className=\"font-bold text-slate-900 text-sm\">{provider.name}</h4>
        <p className=\"text-xs text-slate-500 capitalize\">{provider.trade.replace('_', ' ')}</p>
      </div>
    </div>
    <div className=\"flex justify-between items-center text-xs pt-2 border-t border-slate-100\">
      <span className=\"font-black text-slate-900\">{formatIndianRupees(provider.indicativeDailyRate)} / day</span>
      <span className=\"flex items-center text-amber-500 font-bold\"><Star className=\"w-3 h-3 fill-current mr-1\" />{provider.rating}</span>
    </div>
  </div>
);
