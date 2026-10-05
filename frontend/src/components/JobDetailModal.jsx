import React, { useState } from 'react';
import { X, Building2, MapPin, Clock, IndianRupee, Briefcase, CheckCircle, AlertCircle, Send, ShieldCheck } from 'lucide-react';
import MatchBadge from './MatchBadge';

export default function JobDetailModal({ job, onClose, onApplySuccess }) {
  const [isApplying, setIsApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  if (!job) return null;

  const handleApply = () => {
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplied(true);
      if (onApplySuccess) onApplySuccess(job);
    }, 600);
  };

  const score = job.match_percentage || 0;
  const breakdown = job.score_breakdown || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-brand-700 border border-rose-200">
              {job.job_type} Opportunity
            </span>
            <span className="text-xs text-slate-500 font-medium">Category: {job.career_category}</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl text-slate-900">
            {job.title}
          </h2>
          <p className="text-slate-600 font-medium flex items-center gap-1.5 mt-1">
            <Building2 className="w-4 h-4 text-slate-400" />
            {job.organization}
          </p>
        </div>

        {/* Match Percentage Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <MatchBadge score={score} size="lg" />
            <div>
              <p className="font-bold text-slate-900 text-sm">Rule-Based Weighted Match</p>
              <p className="text-xs text-slate-600">Calculated directly against your registered constraints</p>
            </div>
          </div>
        </div>

        {/* 4-Factor Weighted Breakdown */}
        {breakdown.skill_score !== undefined && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <p className="font-bold text-slate-700 mb-2 uppercase tracking-wider text-[11px]">
              Transparency Score Breakdown (Formula: Skill 40% + Time 20% + Loc 20% + Exp 20%)
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-500 block">Skills (40%)</span>
                <span className="font-bold text-brand-600 text-sm">{breakdown.skill_score}%</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-500 block">Hours (20%)</span>
                <span className="font-bold text-brand-600 text-sm">{breakdown.time_score}%</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-500 block">Location (20%)</span>
                <span className="font-bold text-brand-600 text-sm">{breakdown.location_score}%</span>
              </div>
              <div className="p-2 rounded bg-white border border-slate-200">
                <span className="text-slate-500 block">Experience (20%)</span>
                <span className="font-bold text-brand-600 text-sm">{breakdown.experience_score}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-slate-100 mb-6 text-xs text-slate-700 font-medium">
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px]">Location</span>
            <span className="font-bold text-slate-900">{job.location}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px]">Daily Hours</span>
            <span className="font-bold text-slate-900">{job.required_hours} hrs / day</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px]">Monthly Compensation</span>
            <span className="font-bold text-emerald-700">{job.salary}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-slate-400 block text-[11px]">Minimum Experience</span>
            <span className="font-bold text-slate-900">{job.minimum_experience === 0 ? 'Freshers (0 yrs)' : `${job.minimum_experience} yrs`}</span>
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-6 space-y-2">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Role Summary & Circumstance Support</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Required Skills & Missing Skills */}
        <div className="mb-6 space-y-2">
          <h4 className="font-heading font-bold text-slate-900 text-sm">Required Capabilities</h4>
          <div className="flex flex-wrap gap-2">
            {(job.required_skills || []).map((skill, i) => (
              <span key={i} className="px-3 py-1 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold">
                {skill}
              </span>
            ))}
          </div>

          {job.missing_skills && job.missing_skills.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <b>Recommended Skill Bridge:</b> You can enroll in free courses for <b>{job.missing_skills.join(', ')}</b> on our Courses page.
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleApply}
            disabled={applied || isApplying}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 ${
              applied
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95 shadow-brand-500/25'
            }`}
          >
            {isApplying ? (
              <span>Submitting Application...</span>
            ) : applied ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Applied Successfully!
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Sakhi Profile Application
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
