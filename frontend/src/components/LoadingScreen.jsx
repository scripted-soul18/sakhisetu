import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Search, Sliders } from 'lucide-react';

export default function LoadingScreen({ message }) {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Analyzing your profile...", icon: Sliders },
    { text: "Evaluating working hours & commute feasibility...", icon: Search },
    { text: "Finding opportunities that fit your needs...", icon: Sparkles },
    { text: "Smart Matching Engine finalizing score breakdown...", icon: CheckCircle2 }
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setStep(1), 1200);
    const timer2 = setTimeout(() => setStep(2), 2400);
    const timer3 = setTimeout(() => setStep(3), 3600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-full border-4 border-rose-100 border-t-brand-600 animate-spin flex items-center justify-center shadow-lg"></div>
        <div className="absolute inset-0 flex items-center justify-center text-brand-600">
          <CurrentIcon className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold uppercase tracking-wider mb-3">
        <span>Smart Matching Engine</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-800 transition-all duration-300">
        {message || steps[step].text}
      </h3>
      <p className="text-sm text-slate-500 mt-2 max-w-md">
        Evaluating weighted compatibility across skills (40%), daily hours (20%), location (20%), and experience (20%).
      </p>

      {/* Progress Dots */}
      <div className="flex gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === step ? 'w-8 bg-brand-600' : 'w-2 bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
