import React from 'react';
import { Equipment } from '../../types';
import { formatIndianRupees } from '../../utils/currencyFormatter';

interface Props {
  equipment: Equipment;
  onRent?: (eq: Equipment) => void;
}

export const EquipmentCard: React.FC<Props> = ({ equipment, onRent }) => (
  <div className=\"rounded-2xl bg-white border border-slate-200 p-5 shadow-sm space-y-3\">
    <img src={equipment.image} alt={equipment.name} className=\"w-full h-40 object-cover rounded-xl\" />
    <h4 className=\"font-bold text-slate-900 text-sm truncate\">{equipment.name}</h4>
    <p className=\"text-xs text-slate-500\">Model: {equipment.model}</p>
    <div className=\"flex justify-between items-center text-xs pt-2 border-t border-slate-100\">
      <span className=\"font-black text-slate-900\">{formatIndianRupees(equipment.dailyRentalRate)} / day</span>
      <span className=\"px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]\">Verified Fleet</span>
    </div>
  </div>
);
