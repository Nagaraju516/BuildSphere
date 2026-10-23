import React from 'react';
import { AMCPackage } from '../../types';
import { formatIndianRupees } from '../../utils/currencyFormatter';
import { Check } from 'lucide-react';

interface Props {
  pkg: AMCPackage;
  onSubscribe?: (pkg: AMCPackage) => void;
}

export const AMCSubscriptionCard: React.FC<Props> = ({ pkg, onSubscribe }) => (
  <div className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
    <h4 className="font-black text-slate-900 text-base">{pkg.title}</h4>
    <p className="text-xs text-slate-500">{pkg.description}</p>
    <div className="text-2xl font-black text-brand-600">
      {formatIndianRupees(pkg.pricePerYear || pkg.annualCost || 0)} / yr
    </div>
    <ul className="space-y-1.5 text-xs text-slate-600">
      {(pkg.coverage || pkg.features || []).map((f, i) => (
        <li key={i} className="flex items-center space-x-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>{f}</span>
        </li>
      ))}
    </ul>
    {onSubscribe && (
      <button
        onClick={() => onSubscribe(pkg)}
        className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
      >
        Subscribe
      </button>
    )}
  </div>
);
