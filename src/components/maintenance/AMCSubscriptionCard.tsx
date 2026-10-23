import React from 'react';
import { AMCPackage } from '../../types';
import { Check } from 'lucide-react';
import { formatIndianRupees } from '../../utils/currencyFormatter';

interface Props {
  pkg: AMCPackage;
  onSubscribe?: (pkg: AMCPackage) => void;
}

export const AMCSubscriptionCard: React.FC<Props> = ({ pkg, onSubscribe }) => (
  <div className=\"rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm\">
    <h4 className=\"font-black text-slate-900 text-base\">{pkg.title}</h4>
    <p className=\"text-xs text-slate-500\">{pkg.description}</p>
    <div className=\"text-2xl font-black text-brand-600\">{formatIndianRupees(pkg.annualCost)} / yr</div>
    <ul className=\"space-y-1.5 text-xs text-slate-600\">
      {pkg.features.map((f, i) => (
        <li key={i} className=\"flex items-center space-x-1.5\">
          <Check className=\"w-3.5 h-3.5 text-emerald-600 flex-shrink-0\" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  </div>
);
