import React from 'react';
import { Product } from '../../types';
import { formatIndianRupees } from '../../utils/currencyFormatter';

interface Props {
  product: Product;
  onAddToCart?: (prod: Product) => void;
}

export const ProductCard: React.FC<Props> = ({ product, onAddToCart }) => (
  <div className=\"rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:shadow-md transition-all\">
    <img src={product.image} alt={product.name} className=\"w-full h-40 object-cover rounded-xl\" />
    <h4 className=\"font-bold text-slate-900 mt-2 text-sm truncate\">{product.name}</h4>
    <p className=\"text-xs text-slate-500\">{product.brand}</p>
    <div className=\"flex justify-between items-center mt-3\">
      <span className=\"font-black text-slate-900\">{formatIndianRupees(product.price)}</span>
      {onAddToCart && (
        <button
          onClick={() => onAddToCart(product)}
          className=\"px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs\"
        >
          Add to Cart
        </button>
      )}
    </div>
  </div>
);
