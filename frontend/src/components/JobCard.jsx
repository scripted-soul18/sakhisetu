import React, { useState } from 'react';
import { MapPin, Clock, Briefcase, IndianRupee, ChevronDown, ChevronUp, CheckCircle, AlertCircle, ArrowRight, Building2, Send, Star } from 'lucide-react';
import MatchBadge from './MatchBadge';

export default function JobCard({ job, onSelect, onApply, isTopMatch = false }) {
  const [showReasons, setShowReasons] = useState(true);
  const [applied, setApplied] = useState(false);

  const handleApplyClick = (e) => {
    e.stopPropagation();
    setApplied(true);
    if (onApply) onApply(job);
  };

  const score = job.match_percentage !== undefined ? job.match_percentage : null;

  return (
    <div className={`relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 ${
      isTopMatch ? 'border-brand-300 shadow-md ring-1 ring-brand-200' : 'border-slate-200 shadow-sm'
    }`}>
      {/* Top Match Ribbon */}
      {isTopMatch && (
        <div className="absolute -top-3 left-6 bg-gradient-to-r from-brand-600 to-rose-500 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1.5">
          <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
          <span>Best Circumstance Match</span>
        </div>
      )}

      <div className="p-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-heading font-bold text-xl text-slate-900 hover:text-brand-600 transition-colors">
                {job.title}
              </h3>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                job.job_type === 'Remote' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                job.job_type === 'Hybrid' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                'bg-purple-50 text-purple-700 border border-purple-200'
              }`}>
                {job.job_type}
              </span>
            </div>
            <p className="text-slate-600 text-sm font-medium flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-400" />
              {job.organization}
            </p>
          </div>

          {/* Match Score Indicator */}
          {score !== null && (
            <div className="self-start sm:self-center">
              <MatchBadge score={score} size="lg" />
            </div>
          )}
        </div>

        {/* Quick Meta Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 py-3 border-y border-slate-100 mb-4 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{job.required_hours} hrs/day</span>
          </div>
          <div className="flex items-center gap-1.5">
            <IndianRupee className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate font-semibold text-slate-800">{job.salary}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>{job.minimum_experience === 0 ? 'Freshers Welcome' : `${job.minimum_experience}+ yrs exp`}</span>
          </div>
        </div>

        {/* Description snippet */}
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {job.description}
        </p>

        {/* Required Skills tags */}
        <div className="flex items-center gap-1.5 flex-wrap mb-4">
          <span className="text-xs text-slate-400 font-semibold mr-1">Skills:</span>
          {(job.required_skills || []).map((skill, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium"
            >
              {skill}
            </span>
          ))}
        </div>

        {/* Why this matches you (Explainable Engine USP) */}
        {job.matching_reasons && job.matching_reasons.length > 0 && (
          <div className="mb-4 bg-rose-50/60 rounded-xl p-3.5 border border-rose-100">
            <button
              onClick={() => setShowReasons(!showReasons)}
              className="w-full flex items-center justify-between text-xs font-bold text-brand-800 tracking-wide uppercase"
            >
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Why This Matches Your Constraints
              </span>
              {showReasons ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showReasons && (
              <div className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                {job.matching_reasons.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{reason.replace(/^[✓\s]+/, '')}</span>
                  </div>
                ))}

                {/* Score weights breakdown link if present */}
                {job.score_breakdown && (
                  <div className="pt-2 mt-2 border-t border-rose-200/60 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Skills: <b>{job.score_breakdown.skill_score}%</b></span>
                    <span>Hours: <b>{job.score_breakdown.time_score}%</b></span>
                    <span>Location: <b>{job.score_breakdown.location_score}%</b></span>
                    <span>Exp: <b>{job.score_breakdown.experience_score}%</b></span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Missing Skills Warning & Bridge */}
        {job.missing_skills && job.missing_skills.length > 0 && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span>Recommended bridge skill: <b>{job.missing_skills.join(', ')}</b>. </span>
              <span className="text-amber-800 font-semibold underline cursor-pointer" onClick={() => onSelect && onSelect(job)}>
                Free course available below.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {onSelect ? (
            <button
              onClick={() => onSelect(job)}
              className="text-xs font-semibold text-brand-700 hover:text-brand-800 hover:underline flex items-center gap-1"
            >
              View Full Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyClick}
              disabled={applied}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                applied
                  ? 'bg-emerald-600 text-white cursor-default'
                  : 'bg-brand-600 hover:bg-brand-700 text-white active:scale-95'
              }`}
            >
              {applied ? (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  Application Submitted
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Apply With Profile
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
