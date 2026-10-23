import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Plus,
  ShieldCheck,
  Home,
  Award,
  Key,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { SnagItem } from '../types';

export const HandoverPage: React.FC = () => {
  const { t, formatDate } = useI18n();
  const { project, addSnagItem, resolveSnagItem, toggleHandoverCheck } = useAppStore();

  const [snagModalOpen, setSnagModalOpen] = useState(false);
  const [snagTitle, setSnagTitle] = useState('');
  const [snagLocation, setSnagLocation] = useState('');
  const [snagCategory, setSnagCategory] = useState<SnagItem['category']>('paint');
  const [snagSeverity, setSnagSeverity] = useState<SnagItem['severity']>('minor');
  const [assignedTrade, setAssignedTrade] = useState('Painter (Color World)');

  const passedChecksCount = project.handoverChecks.filter((c) => c.status === 'pass').length;
  const resolvedSnagsCount = project.snagList.filter((s) => s.status === 'resolved' || s.status === 'verified').length;
  const readinessIndex = Math.round(
    ((passedChecksCount / (project.handoverChecks.length || 1)) * 0.6 +
      (resolvedSnagsCount / (project.snagList.length || 1)) * 0.4) *
      100
  );

  const handleAddSnag = (e: React.FormEvent) => {
    e.preventDefault();
    addSnagItem({
      title: snagTitle,
      location: snagLocation,
      category: snagCategory,
      severity: snagSeverity,
      status: 'open',
      assignedTrade,
    });
    setSnagModalOpen(false);
    setSnagTitle('');
    setSnagLocation('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('projects.handoverChecklist')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('projects.handoverDesc')}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-brand-400" />
            <span>Print Handover Certificate</span>
          </button>
        </div>
      </div>

      {/* Move-In Readiness Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-emerald-900/50 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4" />
            <span>{t('projects.moveInReadiness')}</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            {readinessIndex}% Ready for Gruhapravesam
          </h2>
          <p className="text-xs text-slate-300 max-w-lg">
            Calculated from 6 critical engineering sign-offs and resolution of all reported subcontractor defects.
          </p>
        </div>

        <div className="w-32 h-32 rounded-full border-8 border-emerald-500/30 flex items-center justify-center bg-slate-900/80 shadow-2xl">
          <span className="text-3xl font-black text-emerald-400">{readinessIndex}%</span>
        </div>
      </div>

      {/* 2-Column Grid: Handover Checks & Snag List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 6 Engineering Handover Checks */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Mandatory Engineering Quality Tests
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Verify each structural, waterproofing, and MEP inspection certificate before taking physical possession.
            </p>
          </div>

          <div className="space-y-4">
            {project.handoverChecks.map((check) => (
              <div
                key={check.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {check.area}
                    </span>
                    <span className="text-xs font-bold text-slate-900">{check.checklist}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Inspector: <strong className="text-slate-700">{check.testedBy}</strong>
                    {check.testedAt && ` • Date: ${formatDate(check.testedAt)}`}
                  </p>
                  {check.remarks && (
                    <p className="text-[11px] text-emerald-800 italic">{check.remarks}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() =>
                      toggleHandoverCheck(check.id, check.status === 'pass' ? 'pending' : 'pass')
                    }
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                      check.status === 'pass'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{check.status === 'pass' ? 'Passed' : 'Verify'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Defect Snag List Manager */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {t('projects.snagListTitle')}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Defects assigned to contractors for correction.
              </p>
            </div>
            <button
              onClick={() => setSnagModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Report Snag</span>
            </button>
          </div>

          <div className="space-y-3">
            {project.snagList.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Zero open defects recorded.</p>
            ) : (
              project.snagList.map((snag) => (
                <div
                  key={snag.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                    snag.status === 'resolved'
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full mr-2 ${
                          snag.severity === 'critical'
                            ? 'bg-rose-600 text-white'
                            : snag.severity === 'major'
                            ? 'bg-orange-500 text-white'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {snag.severity}
                      </span>
                      <strong className="text-slate-900">{snag.title}</strong>
                    </div>
                  </div>

                  <p className="text-slate-500 text-[11px]">
                    Location: <strong className="text-slate-700">{snag.location}</strong> • Assigned: {snag.assignedTrade}
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <span className="text-[10px] text-slate-400">Reported: {snag.reportedDate}</span>
                    {snag.status === 'resolved' ? (
                      <span className="font-bold text-emerald-700 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolved on {snag.resolvedDate}</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => resolveSnagItem(snag.id)}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 underline"
                      >
                        Sign Off Repair Completed
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Warranties & Guarantees Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-2xs">
        <h3 className="text-base font-bold text-slate-900">
          {t('projects.warranties')}
        </h3>
        <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
              <tr>
                <th className="p-3">Building System</th>
                <th className="p-3">Manufacturer / Supplier</th>
                <th className="p-3">Valid Until</th>
                <th className="p-3 text-right">Helpline Contact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {project.warranties.map((w, idx) => (
                <tr key={idx}>
                  <td className="p-3 font-bold text-slate-900">{w.item}</td>
                  <td className="p-3 text-slate-600">{w.vendor}</td>
                  <td className="p-3 text-emerald-700 font-bold">{w.expiryDate}</td>
                  <td className="p-3 text-right text-slate-700 font-mono">{w.contact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Snag Modal */}
      {snagModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Report Quality Snag</h3>
              <button onClick={() => setSnagModalOpen(false)} className="p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleAddSnag} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Defect Title</label>
                <input
                  type="text"
                  required
                  value={snagTitle}
                  onChange={(e) => setSnagTitle(e.target.value)}
                  placeholder="e.g. Master bathroom tile grout hairline gap"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Exact Room / Location</label>
                <input
                  type="text"
                  required
                  value={snagLocation}
                  onChange={(e) => setSnagLocation(e.target.value)}
                  placeholder="e.g. First Floor Balcony Floor Joint"
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Severity</label>
                  <select
                    value={snagSeverity}
                    onChange={(e) => setSnagSeverity(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  >
                    <option value="minor">Minor (Cosmetic)</option>
                    <option value="moderate">Moderate (Touch-up)</option>
                    <option value="major">Major (Rework)</option>
                    <option value="critical">Critical (Safety)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Assigned Subcontractor</label>
                  <input
                    type="text"
                    required
                    value={assignedTrade}
                    onChange={(e) => setAssignedTrade(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
              >
                Log Snag for Rectification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
