import React from 'react';
import { CheckCircle2, CircleDot, ArrowRight, Sparkles, BookOpen, Send, Compass, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RoadmapTimeline({ roadmap = [], careerPreference = 'Data Entry' }) {
  if (!roadmap || roadmap.length === 0) return null;

  const getStepIcon = (index) => {
    switch (index) {
      case 0: return CheckCircle2;
      case 1: return BookOpen;
      case 2: return Send;
      case 3: return Compass;
      case 4: return TrendingUp;
      default: return CircleDot;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-rose-50 text-brand-600">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="font-heading font-bold text-2xl text-slate-900">
              My Personalized Career Roadmap
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            A structured path toward sustainable financial independence in <span className="font-semibold text-brand-600">{careerPreference}</span>
          </p>
        </div>

        <span className="self-start sm:self-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
          5-Step Guided Growth
        </span>
      </div>

      <div className="relative">
        {/* Continuous connector line */}
        <div className="hidden md:block absolute left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-brand-600 via-rose-300 to-slate-200" />

        <div className="space-y-8">
          {roadmap.map((item, index) => {
            const Icon = getStepIcon(index);
            const isCompleted = item.status === 'done';
            const isCurrent = item.status === 'current';

            return (
              <div key={item.step || index} className="relative flex flex-col md:flex-row gap-5 items-start">
                
                {/* Step Marker Node */}
                <div className={`shrink-0 z-10 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-bold text-sm shadow-sm transition-transform ${
                  isCompleted
                    ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-gradient-to-tr from-brand-600 to-rose-500 text-white ring-4 ring-rose-100 shadow-brand-500/25 scale-105'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  <Icon className="w-6 h-6 mb-0.5" />
                  <span className="text-[10px] uppercase tracking-wider font-extrabold">Step {item.step}</span>
                </div>

                {/* Content Box */}
                <div className={`flex-1 rounded-2xl p-5 border transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-rose-50/60 to-white border-brand-200 shadow-sm'
                    : 'bg-white border-slate-200/80 hover:border-slate-300'
                }`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h4 className="font-heading font-bold text-lg text-slate-900">
                      {item.title}
                    </h4>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isCompleted ? 'bg-emerald-100 text-emerald-800' :
                      isCurrent ? 'bg-brand-100 text-brand-800 animate-pulse' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    {item.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs font-semibold">
                    <span className="text-slate-500 flex items-center gap-1">
                      Target Action: <span className="text-slate-800">{item.action}</span>
                    </span>

                    {index === 1 && (
                      <Link to="/courses" className="text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        View Free Courses <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    {index === 2 && (
                      <Link to="/jobs" className="text-brand-600 hover:text-brand-700 flex items-center gap-1">
                        Explore Matching Jobs <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
