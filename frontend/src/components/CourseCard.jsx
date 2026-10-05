import React from 'react';
import { BookOpen, Clock, Award, Star, ExternalLink, Sparkles } from 'lucide-react';

export default function CourseCard({ course, isBridge = false }) {
  return (
    <div className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-card hover:-translate-y-0.5 flex flex-col justify-between ${
      isBridge ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200 shadow-sm'
    }`}>
      <div className="p-6">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-brand-700 text-xs font-semibold border border-rose-200">
            {course.skill_category}
          </span>
          <div className="flex items-center gap-1.5">
            {course.is_free && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-200">
                100% Free
              </span>
            )}
            <div className="flex items-center text-amber-500 text-xs font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 stroke-amber-400 mr-0.5" />
              <span>{course.rating || '4.8'}</span>
            </div>
          </div>
        </div>

        {/* Bridge alert if targeted */}
        {isBridge && (
          <div className="mb-2.5 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100/70 text-amber-900 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-600" />
            <span>Recommended Skill Bridge</span>
          </div>
        )}

        {/* Title & Provider */}
        <h4 className="font-heading font-bold text-lg text-slate-900 mb-1 leading-snug hover:text-brand-600 transition-colors">
          {course.name}
        </h4>
        <p className="text-xs font-semibold text-slate-500 mb-3 flex items-center gap-1">
          <span>By {course.provider}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {course.description}
        </p>

        {/* Course Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 py-2.5 border-t border-slate-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-slate-400" />
            {course.level}
          </span>
          <span className="text-slate-600 font-medium">
            {course.mode}
          </span>
        </div>
      </div>

      {/* Enroll Link */}
      <div className="px-6 pb-6 pt-0">
        <a
          href={course.url || 'https://www.skillindiadigital.gov.in'}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 border border-slate-200 hover:border-brand-200 transition-all active:scale-95"
        >
          <span>Start Free Learning</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
