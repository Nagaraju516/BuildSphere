import React, { useState } from 'react';
import {
  PieChart,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  FileText,
  Download,
  AlertCircle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Building,
  Filter,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { Expense, ExpenseCategory } from '../types';

export const FinancePage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const { project, expenses, addExpense, transactions } = useAppStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'expenses' | 'transactions'>('overview');
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState(25000);
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>('structural_materials');
  const [paidTo, setPaidTo] = useState('');
  const [receiptNumber, setReceiptNumber] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState<string>('all');

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remainingBudget = Math.max(0, project.targetBudget - totalSpent);
  const contingency = project.contingencyBudget;

  const categories: ExpenseCategory[] = [
    'land_permits',
    'structural_materials',
    'finishing_materials',
    'labour_contractors',
    'equipment_rental',
    'transport_logistics',
    'interior_furnishing',
    'contingency_misc',
  ];

  // Category breakdown
  const categoryBreakdown = categories.map((cat) => {
    const spent = expenses.filter((e) => e.category === cat).reduce((s, e) => s + e.amount, 0);
    // Estimated budget allocations
    const allocationWeights: Record<ExpenseCategory, number> = {
      land_permits: 0.08,
      structural_materials: 0.35,
      finishing_materials: 0.18,
      labour_contractors: 0.22,
      equipment_rental: 0.05,
      transport_logistics: 0.04,
      interior_furnishing: 0.05,
      contingency_misc: 0.03,
    };
    const allocated = Math.round(project.targetBudget * allocationWeights[cat]);
    const variance = allocated - spent;
    return {
      category: cat,
      title: t(`finance.categories.${cat}`),
      spent,
      allocated,
      variance,
      percent: Math.min(100, Math.round((spent / (allocated || 1)) * 100)),
    };
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      projectId: project.id,
      category: expenseCategory,
      title: expenseTitle || 'Construction Site Expense',
      amount: expenseAmount,
      date: new Date().toISOString().split('T')[0],
      receiptNumber: receiptNumber || `RCP-${Math.floor(1000 + Math.random() * 9000)}`,
      paidTo: paidTo || 'Local Vendor',
      paymentMethod: 'upi',
    });
    setModalOpen(false);
    setExpenseTitle('');
    setPaidTo('');
    setReceiptNumber('');
  };

  const filteredExpenses = expenses.filter((e) => {
    if (selectedFilterCategory === 'all') return true;
    return e.category === selectedFilterCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-violet-100 text-violet-800 px-2.5 py-0.5 rounded-full">
              Module 5
            </span>
            <span className="text-xs font-semibold text-slate-500">Cost Control & Financial Auditing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('finance.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('finance.subtitle')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t('common.downloadReport')}</span>
          </button>

          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>{t('finance.recordExpense')}</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            {t('finance.totalBudget')}
          </span>
          <p className="text-2xl font-black text-slate-900">
            {formatCurrency(project.targetBudget, true)}
          </p>
          <span className="text-[11px] text-slate-500 block">Approved Villa BOQ</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            {t('finance.spentToDate')}
          </span>
          <p className="text-2xl font-black text-violet-700">
            {formatCurrency(totalSpent, true)}
          </p>
          <div className="flex items-center text-[11px] text-slate-500">
            <span className="font-bold text-violet-700 mr-1">
              {Math.round((totalSpent / project.targetBudget) * 100)}%
            </span>
            <span>of budget consumed</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            {t('finance.remainingBudget')}
          </span>
          <p className="text-2xl font-black text-emerald-600">
            {formatCurrency(remainingBudget, true)}
          </p>
          <span className="text-[11px] text-emerald-700 font-semibold block">Sufficient Cashflow Buffer</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 block">
            {t('finance.contingencyReserve')}
          </span>
          <p className="text-2xl font-black text-amber-600">
            {formatCurrency(contingency, true)}
          </p>
          <span className="text-[11px] text-slate-500 block">Emergency Structural Fund</span>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold w-fit">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('finance.budgetVariance')}
        </button>
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'expenses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Expense Ledger ({expenses.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-3 py-1.5 rounded-lg transition-all ${
            activeTab === 'transactions' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {t('finance.demoPayments')} ({transactions.length})
        </button>
      </div>

      {/* TAB 1: BUDGET VARIANCE ANALYSIS */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {t('finance.budgetVariance')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparison between allocated Bill of Quantities (BOQ) and actual site expenditure.
            </p>
          </div>

          <div className="space-y-4">
            {categoryBreakdown.map((item) => (
              <div key={item.category} className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1">
                  <div>
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className="text-slate-400 ml-2">
                      ({formatCurrency(item.spent)} of {formatCurrency(item.allocated)})
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`font-black text-xs ${
                        item.variance >= 0 ? 'text-emerald-700' : 'text-rose-700'
                      }`}
                    >
                      {item.variance >= 0 ? 'Surplus:' : 'Deficit:'} {formatCurrency(Math.abs(item.variance))}
                    </span>
                    <span className="text-slate-500 font-bold w-12 text-right">{item.percent}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      item.percent > 95
                        ? 'bg-rose-500'
                        : item.percent > 75
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${item.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: EXPENSES LEDGER */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 text-xs">
            <Filter className="w-4 h-4 text-slate-400 mr-1" />
            <button
              onClick={() => setSelectedFilterCategory('all')}
              className={`px-3 py-1 rounded-lg font-bold ${
                selectedFilterCategory === 'all'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedFilterCategory(c)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize ${
                  selectedFilterCategory === c
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Date & Voucher #</th>
                  <th className="p-3.5">Expense Description</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Paid To</th>
                  <th className="p-3.5 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-slate-900 block">{formatDate(exp.date)}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{exp.receiptNumber}</span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-800">{exp.title}</td>
                    <td className="p-3.5 capitalize text-slate-600 font-medium">
                      {exp.category.replace('_', ' ')}
                    </td>
                    <td className="p-3.5 text-slate-700">{exp.paidTo}</td>
                    <td className="p-3.5 text-right font-black text-slate-900 text-sm">
                      {formatCurrency(exp.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DEMO PAYMENTS */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs flex items-center justify-between">
            <span className="font-semibold">{t('common.demoNotice')}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold uppercase text-[10px]">
              Simulated Ledger
            </span>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs">
            {transactions.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No simulated transactions logged yet. Place a material order or book equipment to see simulated transactions.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-3.5">Ref #</th>
                    <th className="p-3.5">Entity</th>
                    <th className="p-3.5">Method</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((tx) => (
                    <tr key={tx.id}>
                      <td className="p-3.5 font-mono font-bold text-slate-800">{tx.transactionRef}</td>
                      <td className="p-3.5 capitalize font-medium">{tx.relatedEntity.replace('_', ' ')}</td>
                      <td className="p-3.5 uppercase font-bold text-brand-600">{tx.method}</td>
                      <td className="p-3.5 text-slate-500">{new Date(tx.timestamp).toLocaleString('en-IN')}</td>
                      <td className="p-3.5 text-right font-black text-emerald-600">{formatCurrency(tx.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Record Expense Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">{t('finance.recordExpense')}</h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('finance.expenseTitle')}</label>
                <input
                  type="text"
                  required
                  value={expenseTitle}
                  onChange={(e) => setExpenseTitle(e.target.value)}
                  placeholder="e.g. 50 Bags Cement Batch 4"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('finance.expenseAmount')}</label>
                <input
                  type="number"
                  required
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(Number(e.target.value))}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('finance.expenseCategory')}</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {t(`finance.categories.${c}`)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('finance.paidTo')}</label>
                  <input
                    type="text"
                    required
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    placeholder="Vendor Name"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">{t('finance.receiptNumber')}</label>
                  <input
                    type="text"
                    value={receiptNumber}
                    onChange={(e) => setReceiptNumber(e.target.value)}
                    placeholder="Voucher #"
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold"
              >
                Save Expense Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
