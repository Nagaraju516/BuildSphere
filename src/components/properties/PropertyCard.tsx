import React from 'react';
import { Property } from '../../types';
import { formatIndianRupees } from '../../utils/currencyFormatter';

interface Props {
  property: Property;
  onSelect?: (prop: Property) => void;
}

export const PropertyCard: React.FC<Props> = ({ property, onSelect }) => (
  <div
    onClick={() => onSelect && onSelect(property)}
    className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all p-5 cursor-pointer"
  >
    <img src={property.images[0]} alt={property.title} className="w-full h-44 object-cover rounded-xl" />
    <div className="mt-3">
      <span className="text-xs font-bold text-brand-600 uppercase">{property.location.locality}</span>
      <h4 className="font-bold text-slate-900 mt-0.5 truncate">{property.title}</h4>
      <p className="text-lg font-black text-slate-900 mt-2">{formatIndianRupees(property.price)}</p>
    </div>
  </div>
);
