import React from 'react';

export default function MatchBadge({ score, size = 'md', showLabel = true }) {
  const numScore = Math.round(Number(score) || 0);

  let colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let badgeText = 'Top Match';

  if (numScore >= 85) {
    colorClasses = 'bg-emerald-50 text-emerald-700 border-emerald-300';
    badgeText = 'Excellent Match';
  } else if (numScore >= 70) {
    colorClasses = 'bg-teal-50 text-teal-700 border-teal-300';
    badgeText = 'Strong Match';
  } else if (numScore >= 50) {
    colorClasses = 'bg-amber-50 text-amber-700 border-amber-300';
    badgeText = 'Moderate Match';
  } else {
    colorClasses = 'bg-slate-100 text-slate-600 border-slate-200';
    badgeText = 'Partial Match';
  }

  if (size === 'lg') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm ${colorClasses}`}>
        <span className="font-heading font-bold text-lg tracking-tight">{numScore}%</span>
        {showLabel && <span className="text-xs font-semibold uppercase tracking-wider">{badgeText}</span>}
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${colorClasses}`}>
      <span className="font-heading font-bold">{numScore}%</span>
      {showLabel && <span>Match</span>}
    </div>
  );
}
