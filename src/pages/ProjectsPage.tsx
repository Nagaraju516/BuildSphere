import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Building,
  Layers,
  Wrench,
  ChevronRight,
  Plus,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { useI18n } from '../i18n';
import { useAppStore } from '../store';
import { ProjectMilestone, MilestoneCategory } from '../types';
import { GuidedJourneyWizard } from '../components/common/GuidedJourneyWizard';

export const ProjectsPage: React.FC = () => {
  const { t, formatCurrency, formatDate } = useI18n();
  const { project, updateMilestoneProgress } = useAppStore();

  const [viewMode, setViewMode] = useState<'journey' | 'milestones'>('journey');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMilestone, setSelectedMilestone] = useState<ProjectMilestone | null>(null);
  const [newProgress, setNewProgress] = useState(100);
  const [newStatus, setNewStatus] = useState<ProjectMilestone['status']>('completed');
  const [newNote, setNewNote] = useState('');

  const categories: { key: string; label: string }[] = [
    { key: 'all', label: 'All 28 Milestones' },
    { key: 'pre_construction', label: '1. Pre-Construction (1-8)' },
    { key: 'foundation_structure', label: '2. Structure & Masonry (9-16)' },
    { key: 'mep_rough_in', label: '3. MEP Rough-In (17-20)' },
    { key: 'finishing_interior', label: '4. Finishing & Woodwork (21-26)' },
    { key: 'inspection_handover', label: '5. Handover & Move-In (27-28)' },
  ];

  const filteredMilestones = project.milestones.filter((m) => {
    if (activeCategory === 'all') return true;
    return m.category === activeCategory;
  });

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMilestone) return;
    updateMilestoneProgress(selectedMilestone.id, newProgress, newStatus, newNote);
    setSelectedMilestone(null);
    setNewNote('');
  };

  const completedCount = project.milestones.filter((m) => m.status === 'completed').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full">
              Module 6
            </span>
            <span className="text-xs font-semibold text-slate-500">28-Milestone Construction Journey</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('projects.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            {t('projects.subtitle')}
          </p>
        </div>

        {/* Shortcuts */}
        <div className="flex items-center space-x-3">
          <Link
            to="/projects/handover"
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-2 shadow-sm transition-all"
          >
            <FileCheck className="w-4 h-4 text-brand-400" />
            <span>{t('projects.handoverChecklist')}</span>
          </Link>
          <Link
            to="/maintenance"
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors"
          >
            <Wrench className="w-4 h-4 text-slate-500" />
            <span>AMC & Home Care</span>
          </Link>
        </div>
      </div>

      {/* Project Status Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-brand-400 tracking-wider">
              {project.address.locality || project.address.city} Residence
            </span>
            <h2 className="text-2xl font-black text-white mt-1">{project.title}</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Built-Up: {project.builtUpAreaSqFt} sq.ft • Target Completion: {formatDate(project.targetCompletionDate)}
            </p>
          </div>

          <div className="flex items-center space-x-6 bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
            <div>
              <p className="text-[10px] text-slate-400 uppercase font-bold">Completed Milestones</p>
              <p className="text-xl font-black text-emerald-400 mt-0.5">
                {completedCount} / 28
              </p>
            </div>
            <div className="border-l border-slate-800 pl-6">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Overall Progress</p>
              <p className="text-xl font-black text-amber-400 mt-0.5">
                {project.overallProgressPercent}%
              </p>
            </div>
          </div>
        </div>

        {/* Big Progress Bar */}
        <div className="space-y-2">
          <div className="w-full bg-slate-700/60 h-3 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 via-emerald-400 to-amber-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${project.overallProgressPercent}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-[11px] text-slate-400">
            <span>Milestone 1: Land Verification</span>
            <span className="text-white font-bold">Current: Finishing & Painting</span>
            <span>Milestone 28: Move-In & Gruhapravesam</span>
          </div>
        </div>
      </div>

      {/* View Switcher: Interactive Journey vs 28 Detailed Milestones */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-100 p-2 rounded-2xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode('journey')}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
              viewMode === 'journey'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>🧭 7-Step Guided Lifecycle</span>
            <span className="px-1.5 py-0.5 rounded-full bg-brand-700/60 text-[10px] text-brand-100">Step-by-Step</span>
          </button>

          <button
            onClick={() => setViewMode('milestones')}
            className={`px-4 py-2 rounded-xl font-black text-xs transition-all flex items-center space-x-2 ${
              viewMode === 'milestones'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <span>📑 28 Detailed Milestones Ledger</span>
          </button>
        </div>

        <p className="text-xs text-slate-500 pr-2 hidden sm:block">
          {viewMode === 'journey' ? 'End-to-end interactive simulation from land to move-in' : 'Audited stage-by-stage engineering progress'}
        </p>
      </div>

      {viewMode === 'journey' ? (
        <GuidedJourneyWizard />
      ) : (
        <>
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 text-xs font-bold">
            {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setActiveCategory(c.key)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeCategory === c.key
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 28 Milestones Grid */}
      <div className="space-y-4">
        {filteredMilestones.map((ms) => {
          const isDone = ms.status === 'completed';
          const isInProgress = ms.status === 'in_progress';

          return (
            <div
              key={ms.id}
              className={`rounded-2xl border transition-all p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : isInProgress
                  ? 'bg-amber-50/40 border-amber-300 ring-2 ring-amber-400/20 shadow-md'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isInProgress
                      ? 'bg-amber-500 text-white animate-pulse'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {ms.index}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{ms.title}</h3>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : isInProgress
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {ms.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                    {ms.description}
                  </p>

                  {ms.notes.length > 0 && (
                    <div className="text-[11px] text-slate-500 italic mt-1 flex items-center space-x-1">
                      <span>Site Note:</span>
                      <strong className="text-slate-700 not-italic">{ms.notes[ms.notes.length - 1]}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress & Actions */}
              <div className="flex items-center space-x-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                <div className="text-right">
                  <span className="text-xs font-black text-slate-900 block">{ms.progressPercent}%</span>
                  <span className="text-[10px] text-slate-400">Budget: {formatCurrency(ms.plannedBudget, true)}</span>
                </div>

                <button
                  onClick={() => {
                    setSelectedMilestone(ms);
                    setNewProgress(ms.progressPercent);
                    setNewStatus(ms.status);
                  }}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-white text-xs font-bold text-slate-700 shadow-2xs transition-colors"
                >
                  Update
                </button>
              </div>
            </div>
          );
        })}
      </div>
      </>
      )}

      {/* Milestone Update Modal */}
      {selectedMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                Update Milestone {selectedMilestone.index}: {selectedMilestone.title}
              </h3>
              <button onClick={() => setSelectedMilestone(null)} className="p-1 text-slate-400">✕</button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                >
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="delayed">Delayed</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Progress Completion: {newProgress}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={newProgress}
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Add Site Inspection Note</label>
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="e.g. Concrete cube test passed 28-day 29 MPa requirement."
                  className="w-full p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedMilestone(null)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-rose-600 text-white font-bold"
                >
                  Save Milestone Progress
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
