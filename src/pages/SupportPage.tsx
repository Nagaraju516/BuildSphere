import React, { useState } from 'react';
import {
  HelpCircle,
  MessageSquare,
  Send,
  Plus,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  FileQuestion,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { SupportTicket } from '../types';

export const SupportPage: React.FC = () => {
  const { t, formatDate } = useI18n();
  const { supportTickets, createSupportTicket, replyToTicket, currentUser } = useAppStore();

  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('orders');
  const [description, setDescription] = useState('');
  const [activeTicketId, setActiveTicketId] = useState<string | null>(supportTickets[0]?.id || null);
  const [replyText, setReplyText] = useState('');

  const faqs = [
    {
      q: 'How does BuildSphere verify property land titles before purchase?',
      a: 'We guide homeowners through a 7-point scrutiny checklist covering registered 30-year link documents, nil-encumbrance certificates (EC Form 15), master plan land-use zoning (R1), and advocate legal search opinions.',
    },
    {
      q: 'Are material prices inclusive of GST and site unloading?',
      a: 'All catalog product listings show base price plus standard 18% GST itemized transparently in your cart. Free site unloading is provided for batch orders above ₹50,000.',
    },
    {
      q: 'How do contractor milestone wage payments work?',
      a: 'Work is divided into verified stages. Payments are released only when daily work logs reach agreed completion percentages and receive homeowner sign-off.',
    },
    {
      q: 'What is covered under the Annual Maintenance Contract (AMC)?',
      a: 'AMC packages provide preventive MEP quarterly check-ups, overhead tank disinfection, rooftop solar panel dusting, and priority 24/7 emergency breakdown support.',
    },
  ];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    createSupportTicket(subject, category, description);
    setTicketModalOpen(false);
    setSubject('');
    setDescription('');
  };

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    replyToTicket(ticketId, replyText, 'user');
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Helpdesk & Technical Advisory Support
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Have questions about local municipal approvals, material specifications, or contractor arbitration? Raise a support ticket.
          </p>
        </div>

        <button
          onClick={() => setTicketModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Support Ticket</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Active Tickets & Thread */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="text-base font-bold text-slate-900">Your Support Tickets</h3>

          {supportTickets.length === 0 ? (
            <p className="text-xs text-slate-400 bg-white p-6 rounded-2xl border border-slate-200 text-center">
              No tickets raised.
            </p>
          ) : (
            supportTickets.map((tkt) => {
              const isSelected = activeTicketId === tkt.id;
              return (
                <div
                  key={tkt.id}
                  className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs space-y-4 p-6"
                >
                  <div
                    onClick={() => setActiveTicketId(isSelected ? null : tkt.id)}
                    className="flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-bold text-slate-700">{tkt.ticketNumber}</span>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {tkt.status}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mt-1">{tkt.subject}</h4>
                    </div>
                    <span className="text-xs font-bold text-slate-400">
                      {isSelected ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </div>

                  {/* Messages Thread */}
                  {isSelected && (
                    <div className="pt-4 border-t border-slate-100 space-y-4">
                      <div className="space-y-3">
                        {tkt.messages.map((msg, mIdx) => (
                          <div
                            key={mIdx}
                            className={`p-3 rounded-xl text-xs max-w-lg ${
                              msg.sender === 'user'
                                ? 'bg-slate-100 text-slate-800 ml-auto'
                                : 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                            }`}
                          >
                            <span className="font-bold block text-[10px] text-slate-500 mb-0.5">
                              {msg.senderName} ({msg.timestamp})
                            </span>
                            <p className="leading-relaxed">{msg.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Reply Input */}
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your reply to support..."
                          className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none"
                        />
                        <button
                          onClick={() => handleSendReply(tkt.id)}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right: FAQs */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex items-center space-x-2 text-slate-900 font-bold text-sm">
            <FileQuestion className="w-5 h-5 text-amber-500" />
            <span>Frequently Asked Construction Questions</span>
          </div>

          <div className="space-y-4 text-xs">
            {faqs.map((f, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                <p className="font-bold text-slate-900">{f.q}</p>
                <p className="text-slate-600 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ticket Modal */}
      {ticketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Open Support Ticket</h3>
              <button onClick={() => setTicketModalOpen(false)} className="p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Inquiring about municipal setback rules in Tellapur"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="property">Land & Property Due Diligence</option>
                  <option value="materials">Materials Order / GST Invoice</option>
                  <option value="services">Contractor Booking & Quality</option>
                  <option value="billing">Payments & Billing</option>
                  <option value="technical">Platform Assistance</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message Description</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your question or issue in detail..."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold"
              >
                Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
