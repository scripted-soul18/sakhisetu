import React, { useState } from 'react';
import { ShieldCheck, FileText, Users, ExternalLink, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export default function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-card p-6 flex flex-col justify-between">
      <div>
        {/* Category Pill */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
            {scheme.category}
          </span>
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Govt. Welfare
          </span>
        </div>

        {/* Title */}
        <h4 className="font-heading font-bold text-xl text-slate-900 mb-2 leading-snug hover:text-brand-600 transition-colors">
          {scheme.name}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          {scheme.description}
        </p>

        {/* Who it helps */}
        <div className="mb-3 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2 text-xs text-slate-700">
          <Users className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Who it helps: </span>
            {scheme.who_it_helps}
          </div>
        </div>

        {/* Eligibility & Documents Accordion */}
        <div className="space-y-2 mb-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-brand-600 py-1"
          >
            <span>Check Indicative Eligibility & Documents</span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {expanded && (
            <div className="p-3.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs space-y-3 animate-in fade-in duration-200">
              <div>
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  General Eligibility Criteria:
                </p>
                <p className="text-slate-600 leading-relaxed">{scheme.eligibility}</p>
              </div>

              <div>
                <p className="font-bold text-slate-800 mb-1 flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-indigo-600" />
                  Required Documents:
                </p>
                <p className="text-slate-600 leading-relaxed">{scheme.required_documents}</p>
              </div>
            </div>
          )}
        </div>

        {/* Mandatory Indicative Notice */}
        <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 mb-4">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-snug">
            Eligibility shown here is indicative. Please verify current eligibility and guidelines on the official government website.
          </p>
        </div>
      </div>

      {/* Official Link */}
      <div>
        <a
          href={scheme.official_url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-all shadow-sm active:scale-95"
        >
          <span>Visit Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
