import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  Plus,
  Send,
  MessageSquare,
  Briefcase,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { ServiceBooking, QuotationRequest } from '../types';

export const BookingsPage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const {
    bookings,
    quotationRequests,
    acceptQuotationAndCreateBooking,
    addWorkLog,
    completeBooking,
    respondToQuotation,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'bookings' | 'quotes'>('bookings');
  const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
  const [logSummary, setLogSummary] = useState('');
  const [logPercent, setLogPercent] = useState(50);
  const [reviewModalBooking, setReviewModalBooking] = useState<ServiceBooking | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    addWorkLog(selectedBooking.id, logSummary || 'Progress inspection verified on site.', logPercent);
    setSelectedBooking(null);
    setLogSummary('');
  };

  const handleCompleteReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewModalBooking) return;
    completeBooking(reviewModalBooking.id, {
      rating,
      comment: reviewComment || 'Work delivered on time with high craftsmanship.',
    });
    setReviewModalBooking(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Workforce Bookings & Quotations Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track daily work execution logs, review estimates, and verify milestone completions.
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'bookings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Bookings ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'quotes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Quotation Requests ({quotationRequests.length})
          </button>
        </div>
      </div>

      {/* TAB 1: ACTIVE BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold">No worker bookings active yet.</p>
              <Link to="/services" className="text-xs text-amber-600 font-bold underline mt-1 block">
                Find Professionals & Request Estimates →
              </Link>
            </div>
          ) : (
            bookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs p-6 space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-black text-slate-900">{booking.bookingNumber}</span>
                      <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                        {booking.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{booking.projectTitle}</h3>
                    <p className="text-xs text-slate-500">
                      Assigned to: <strong className="text-slate-800">{booking.providerName}</strong> ({booking.trade.replace('_', ' ')})
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Agreed Wage Amount</span>
                    <span className="text-lg font-black text-slate-900">
                      {formatCurrency(booking.agreedAmount)}
                    </span>
                  </div>
                </div>

                {/* Work Log Timeline */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      Daily Work Progress Logs
                    </h4>
                    {booking.status !== 'completed' && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center space-x-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Progress</span>
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {booking.workLogs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs flex items-center justify-between"
                      >
                        <div>
                          <span className="font-bold text-slate-900">{log.summary}</span>
                          <span className="text-slate-400 block text-[10px] mt-0.5">Date: {log.date}</span>
                        </div>
                        <span className="font-black text-brand-600 text-xs">
                          {log.percentageCompleted}% Executed
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completion & Review Status */}
                {booking.status === 'completed' ? (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Service successfully completed & verified on site.</span>
                    </div>
                    {booking.userReview && (
                      <div className="flex items-center space-x-1 text-amber-600 font-bold">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{booking.userReview.rating}/5 Rated</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => setReviewModalBooking(booking)}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t('services.completeService')}</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: QUOTATION REQUESTS */}
      {activeTab === 'quotes' && (
        <div className="space-y-6">
          {quotationRequests.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-bold">No active quotation requests.</p>
              <Link to="/services" className="text-xs text-amber-600 font-bold underline mt-1 block">
                Find Professionals to Request Estimates →
              </Link>
            </div>
          ) : (
            quotationRequests.map((q) => (
              <div
                key={q.id}
                className="rounded-2xl bg-white border border-slate-200 p-6 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{q.projectTitle}</h3>
                    <p className="text-xs text-slate-500">
                      Provider: <strong className="text-slate-800">{q.providerName}</strong> • Target Budget: {formatCurrency(q.estimatedBudget)}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    Status: {q.status.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {q.workDescription}
                </p>

                {/* Estimate details if received */}
                {q.status === 'estimate_received' && q.estimateAmount && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-amber-900">Provider Estimate Quoted:</span>
                      <strong className="text-base font-black text-amber-900">
                        {formatCurrency(q.estimateAmount)}
                      </strong>
                    </div>
                    {q.estimateNotes && (
                      <p className="text-xs text-amber-800 italic">Notes: {q.estimateNotes}</p>
                    )}
                    <button
                      onClick={() =>
                        acceptQuotationAndCreateBooking(
                          q.id,
                          new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
                        )
                      }
                      className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
                    >
                      Accept Estimate & Schedule Booking Work
                    </button>
                  </div>
                )}

                {/* Simulation button to quickly generate contractor response */}
                {q.status === 'submitted' && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() =>
                        respondToQuotation(
                          q.id,
                          Math.round(q.estimatedBudget * 0.95),
                          14,
                          'Material specifications and labor crew verified. Ready to start in 2 days.'
                        )
                      }
                      className="text-xs font-bold text-amber-700 hover:text-amber-800 underline"
                    >
                      (Simulate Contractor Response with ₹ {Math.round(q.estimatedBudget * 0.95).toLocaleString('en-IN')} Estimate)
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Progress Log Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Record Daily Progress Log</h3>
            <form onSubmit={handleAddLog} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Work Completed Summary</label>
                <textarea
                  rows={3}
                  required
                  value={logSummary}
                  onChange={(e) => setLogSummary(e.target.value)}
                  placeholder="e.g. Rough conduiting finished for 3 bedrooms; conduits plastered."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Cumulative Percentage: {logPercent}%</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={logPercent}
                  onChange={(e) => setLogPercent(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-amber-600 text-white font-bold"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-bold text-slate-900 text-base">Complete Service & Rate Work</h3>
            <form onSubmit={handleCompleteReview} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Star Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform"
                    >
                      <Star className={`w-6 h-6 ${star <= rating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Feedback Comments</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details about punctuality, finish quality, and safety..."
                  className="w-full p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewModalBooking(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold"
                >
                  Sign Off & Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
