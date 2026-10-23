import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  ChevronUp,
  MapPin,
  Calendar,
  AlertCircle,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { MaterialOrder } from '../types';

export const OrdersPage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const { orders, updateOrderStatus } = useAppStore();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(orders[0]?.id || null);
  const [invoiceModalOrder, setInvoiceModalOrder] = useState<MaterialOrder | null>(null);

  const getStatusColor = (status: MaterialOrder['orderStatus']) => {
    switch (status) {
      case 'placed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'confirmed':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'dispatched':
      case 'in_transit':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'out_for_delivery':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const handleAdvanceStatus = (order: MaterialOrder) => {
    const statuses: MaterialOrder['orderStatus'][] = [
      'placed',
      'confirmed',
      'dispatched',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ];
    const currentIndex = statuses.indexOf(order.orderStatus);
    if (currentIndex < statuses.length - 1) {
      updateOrderStatus(order.id, statuses[currentIndex + 1]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('materials.orderHistory')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Transparent status-based delivery milestones and official tax invoices for on-site material deliveries.
          </p>
        </div>

        <Link
          to="/materials"
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors w-fit"
        >
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No orders placed yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
              >
                {/* Order Top Bar */}
                <div className="p-4 sm:p-6 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-black text-slate-900 text-base">{order.orderNumber}</span>
                      <span
                        className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${getStatusColor(
                          order.orderStatus
                        )}`}
                      >
                        {order.orderStatus.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      Ordered: {formatDate(order.orderedAt)} • Est. Site Delivery: {formatDate(order.estimatedDeliveryDate)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-[10px] uppercase font-bold text-slate-400">Total Billed</p>
                      <p className="text-base font-black text-slate-900">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    <button
                      onClick={() => setInvoiceModalOrder(order)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>GST Invoice</span>
                    </button>

                    <button
                      onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6">
                    {/* Items List */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Ordered Consignments ({order.items.length})
                      </h4>
                      <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between text-xs">
                            <div>
                              <p className="font-bold text-slate-900">{item.productName}</p>
                              <p className="text-slate-500">
                                {item.brand} • {item.quantity} {item.unit} @ {formatCurrency(item.unitPrice)}
                              </p>
                            </div>
                            <span className="font-black text-slate-900">
                              {formatCurrency(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Status-Based Dispatch Timeline */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                          <Truck className="w-4 h-4 text-brand-600" />
                          <span>Status-Based Logistics Dispatch Records</span>
                        </h4>

                        {order.orderStatus !== 'delivered' && (
                          <button
                            onClick={() => handleAdvanceStatus(order)}
                            className="text-[11px] font-bold text-brand-600 hover:text-brand-700 underline"
                          >
                            Simulate Next Delivery Milestone →
                          </button>
                        )}
                      </div>

                      <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                        {order.trackingHistory.map((step, sIdx) => (
                          <div key={sIdx} className="relative">
                            <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-brand-500 ring-4 ring-brand-50"></span>
                            <div className="text-xs">
                              <span className="font-bold text-slate-900">{step.status}</span>
                              <span className="text-slate-400 ml-2">({step.timestamp})</span>
                              <p className="text-slate-500 mt-0.5">
                                Location: <strong className="text-slate-700">{step.location}</strong>
                              </p>
                              <p className="text-slate-600 italic mt-0.5">{step.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Printable GST Tax Invoice Modal */}
      {invoiceModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto print:p-0">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <span className="text-xl font-black text-slate-900 tracking-tight">
                  Build<span className="text-brand-600">Sphere</span> Commercial
                </span>
                <p className="text-xs text-slate-500 mt-1">
                  Tax Invoice / Bill of Supply (Rule 46 of CGST Rules)
                </p>
                <p className="text-[11px] text-slate-400">GSTIN: 36AABCB4492M1ZK</p>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-slate-100 rounded text-xs font-mono font-bold">
                  {invoiceModalOrder.invoiceNumber}
                </span>
                <p className="text-xs text-slate-500 mt-1">Date: {formatDate(invoiceModalOrder.orderedAt)}</p>
              </div>
            </div>

            {/* Bill To & Ship To */}
            <div className="grid grid-cols-2 gap-6 text-xs text-slate-600">
              <div>
                <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Billed To:</p>
                <p className="font-bold text-slate-900">Suresh Reddy</p>
                <p>{invoiceModalOrder.deliveryAddress.street}</p>
                <p>{invoiceModalOrder.deliveryAddress.city}, {invoiceModalOrder.deliveryAddress.state}</p>
              </div>
              <div>
                <p className="font-bold text-slate-800 uppercase tracking-wider mb-1">Site Delivery:</p>
                <p className="font-bold text-slate-900">Residential Project Site</p>
                <p>{invoiceModalOrder.deliveryAddress.street}</p>
                <p>Payment: {invoiceModalOrder.paymentMethod.toUpperCase()} (Simulated)</p>
              </div>
            </div>

            {/* Table */}
            <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Rate</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceModalOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-800">{it.productName}</span>
                        <span className="block text-[10px] text-slate-400">{it.brand}</span>
                      </td>
                      <td className="p-2.5 text-center font-bold">
                        {it.quantity} {it.unit}
                      </td>
                      <td className="p-2.5 text-right">{formatCurrency(it.unitPrice)}</td>
                      <td className="p-2.5 text-right font-bold">{formatCurrency(it.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="text-xs space-y-1.5 text-slate-600 max-w-xs ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold">{formatCurrency(invoiceModalOrder.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>CGST (9%) & SGST (9%):</span>
                <span className="font-bold">{formatCurrency(invoiceModalOrder.gstAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery & Unloading:</span>
                <span className="font-bold">{formatCurrency(invoiceModalOrder.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total Amount Paid:</span>
                <span className="text-emerald-700">{formatCurrency(invoiceModalOrder.totalAmount)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200">
              <button
                onClick={() => setInvoiceModalOrder(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
