import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Address } from '../types';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, formatCurrency } = useI18n();
  const { cart, updateCartQuantity, removeFromCart, clearCart, createMaterialOrder, currentUser } = useAppStore();

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [selectedAddress, setSelectedAddress] = useState<Address>(
    currentUser.addresses[0] || {
      id: 'default',
      street: 'Plot 42, Road 10, Jubilee Hills Extension',
      city: 'Hyderabad',
      state: 'Telangana',
      pincode: '500033',
    }
  );
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const gstAmount = Math.round(subtotal * 0.18);
  const deliveryFee = subtotal > 50000 || subtotal === 0 ? 0 : 1500;
  const totalAmount = subtotal + gstAmount + deliveryFee;

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsPlacingOrder(true);

    setTimeout(() => {
      const order = createMaterialOrder(selectedAddress, paymentMethod);
      setIsPlacingOrder(false);
      navigate('/materials/orders');
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">{t('materials.cartEmpty')}</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Add structural cement, steel rebars, electrical cabling, or finishing tiles from verified dealers.
        </p>
        <Link
          to="/materials"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
        >
          <span>Browse Materials Catalog</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Materials Cart & Simulated Checkout
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Review quantities, select site delivery address, and place simulated order with zero real payment deduction.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">
              Cart Items ({cart.length})
            </h3>
            <button
              onClick={clearCart}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
            >
              Clear Cart
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {cart.map((item) => (
              <div key={item.productId} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-200 flex-shrink-0"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      {item.product.brand} • {item.product.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatCurrency(item.product.price)} per {item.product.unit}
                    </p>
                  </div>
                </div>

                {/* Counter & Total */}
                <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-xl p-1">
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                      className="p-1 rounded-lg bg-white text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-800 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                      className="p-1 rounded-lg bg-white text-slate-700 hover:bg-slate-100 shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">
                      {formatCurrency(item.product.price * item.quantity)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[11px] text-rose-500 hover:text-rose-700 flex items-center space-x-0.5 mt-0.5 ml-auto"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Checkout Summary Box */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-6">
            <h3 className="font-bold text-slate-900 text-base border-b border-slate-100 pb-3">
              {t('materials.cartSummary')}
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>{t('common.subtotal')}</span>
                <span className="font-bold text-slate-900">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('materials.gst')}</span>
                <span className="font-bold text-slate-900">{formatCurrency(gstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('materials.deliveryFee')}</span>
                <span className="font-bold text-emerald-600">
                  {deliveryFee === 0 ? 'FREE (Orders > ₹50,000)' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-sm font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700 text-base">{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                {t('materials.deliveryAddress')}
              </label>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                <p className="font-bold text-slate-900">{currentUser.name}</p>
                <p>{selectedAddress.street}</p>
                <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
              </div>
            </div>

            {/* Payment Options (Simulated) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-800 block">
                Simulated Payment Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'upi', label: 'UPI / QR', icon: QrCode },
                  { id: 'card', label: 'Debit / Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building },
                  { id: 'cod', label: 'Pay on Delivery', icon: Truck },
                ].map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setPaymentMethod(mode.id as any)}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center space-x-2 transition-all ${
                        paymentMethod === mode.id
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-500 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated Checkout Button */}
            <button
              disabled={isPlacingOrder}
              onClick={handleCheckout}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center space-x-2 shadow-md transition-all disabled:opacity-50"
            >
              {isPlacingOrder ? (
                <span>Generating Order & Tax Invoice...</span>
              ) : (
                <>
                  <span>Place Simulated Order ({formatCurrency(totalAmount, true)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center space-x-2 text-[10px] text-slate-400 justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Simulated payment • Stock safely deducted • Expense logged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
