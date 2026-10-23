import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingCart,
  Plus,
  Minus,
  Check,
  Star,
  ShieldCheck,
  Truck,
  Filter,
  Search,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Product, MaterialCategory } from '../types';

export const MaterialsPage: React.FC = () => {
  const { t, formatCurrency } = useI18n();
  const { products, cart, addToCart, updateCartQuantity } = useAppStore();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const categories = [
    { key: 'all', label: t('materials.categories.all') },
    { key: 'structural', label: 'Structural' },
    { key: 'electrical', label: 'Electrical' },
    { key: 'plumbing', label: 'Plumbing' },
    { key: 'finishing', label: 'Finishing' },
    { key: 'interior', label: 'Interior' },
  ];

  const filteredProducts = products.filter((prod) => {
    const matchesCat = activeCategory === 'all' || prod.category === activeCategory;
    const matchesQuery =
      searchQuery === '' ||
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAddToCart = (prod: Product) => {
    addToCart(prod.id, 1);
    setAddedToast(prod.name);
    setTimeout(() => setAddedToast(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
              Module 2
            </span>
            <span className="text-xs font-semibold text-slate-500">Verified Marketplace & Supply</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('materials.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('materials.subtitle')}
          </p>
        </div>

        {/* View Orders & Cart Shortcut */}
        <div className="flex items-center space-x-3">
          <Link
            to="/materials/orders"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Truck className="w-4 h-4 text-slate-500" />
            <span>{t('materials.orderHistory')}</span>
          </Link>

          <Link
            to="/materials/cart"
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-transform active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{t('common.myCart')} ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
          </Link>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all capitalize ${
                activeCategory === c.key
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cement, steel, tiles..."
            className="w-full text-xs bg-slate-50 border border-slate-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-brand-500"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => {
          const inCartItem = cart.find((c) => c.productId === prod.id);
          const isOutOfStock = prod.stock <= 0;

          return (
            <div
              key={prod.id}
              className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all card-hover flex flex-col justify-between"
            >
              <div>
                {/* Product Image Banner */}
                <div className="relative h-48 bg-slate-100 overflow-hidden group">
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900/80 text-white backdrop-blur-md">
                    {prod.subCategory}
                  </span>
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1 px-2 py-0.5 rounded bg-white/90 text-amber-600 text-[10px] font-bold shadow-xs">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{prod.rating} ({prod.reviewCount})</span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-4 space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {prod.brand}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                      {prod.name}
                    </h3>
                  </div>

                  {/* Stock & Supplier */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Depot: <strong className="text-slate-700">{prod.supplier.city}</strong>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOutOfStock
                          ? 'bg-rose-100 text-rose-700'
                          : prod.stock < 100
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {isOutOfStock ? t('materials.outOfStock') : `${prod.stock} in Stock`}
                    </span>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-2 flex items-baseline justify-between">
                    <div>
                      <p className="text-lg font-black text-slate-900">
                        {formatCurrency(prod.price)}
                      </p>
                      <p className="text-[10px] text-slate-400 line-through">
                        MRP: {formatCurrency(prod.mrp)}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      per {prod.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 pt-0 space-y-2">
                {inCartItem ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl p-1.5">
                    <button
                      onClick={() => updateCartQuantity(prod.id, inCartItem.quantity - 1)}
                      className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-emerald-800">
                      {inCartItem.quantity} in Cart
                    </span>
                    <button
                      onClick={() => updateCartQuantity(prod.id, inCartItem.quantity + 1)}
                      className="p-1.5 rounded-lg bg-white text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    disabled={isOutOfStock}
                    onClick={() => handleAddToCart(prod)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-all ${
                      isOutOfStock
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    }`}
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>{t('materials.addToCart')}</span>
                  </button>
                )}

                <button
                  onClick={() => setSelectedProduct(prod)}
                  className="w-full py-1.5 text-center text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  View Technical Specifications
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Added Toast Notification */}
      {addedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-semibold">{t('materials.addedToCart')}: {addedToast}</span>
        </div>
      )}

      {/* Specifications Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {selectedProduct.brand}
                </span>
                <h3 className="font-bold text-slate-900 text-base">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('materials.specs')}
              </h4>
              <div className="rounded-xl border border-slate-200 divide-y divide-slate-100 text-xs">
                {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-2.5">
                    <span className="text-slate-500">{key}:</span>
                    <strong className="text-slate-900">{value}</strong>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedProduct(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
