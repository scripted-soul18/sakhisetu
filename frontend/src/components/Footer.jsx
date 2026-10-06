import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ExternalLink, HelpCircle, PhoneCall } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shrink-0">
                <img src="/logo.png" alt="SakhiSetu Logo" className="w-full h-full object-contain" />
              </div>
              <span className="font-heading font-extrabold text-2xl text-white tracking-tight">
                Sakhi<span className="text-brand-400">Setu</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Empowering single mothers through transparent, rule-based matching. We connect mothers with jobs, verified courses, government schemes, and reliable local crèches tailored to their real-life constraints.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-brand-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Built for Women Empowerment Innovation 2026</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide">Explore Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-brand-400 transition-colors">Flexible Jobs Directory</Link>
              </li>
              <li>
                <Link to="/courses" className="hover:text-brand-400 transition-colors">Free Skill Upgrade Courses</Link>
              </li>
              <li>
                <Link to="/schemes" className="hover:text-brand-400 transition-colors">Government Welfare Schemes</Link>
              </li>
              <li>
                <Link to="/childcare" className="hover:text-brand-400 transition-colors">Childcare & Crèche Map</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-brand-400 transition-colors">My Personalized Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Trust & Privacy */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide">Trust & Transparency</h4>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <p className="font-semibold text-slate-200 mb-1">Privacy Commitment</p>
                <p>We collect only the information needed to calculate tailored recommendations. Your data is never sold or shared.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/80">
                <p className="font-semibold text-slate-200 mb-1">Indicative Eligibility</p>
                <p>Welfare scheme eligibility shown is indicative. Please verify the latest guidelines on official government portals.</p>
              </div>
            </div>
          </div>

          {/* Emergency & Support Helplines */}
          <div>
            <h4 className="text-white font-heading font-bold text-base mb-4 tracking-wide">Emergency Helplines (India)</h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60">
                <span>Women Helpline (National)</span>
                <span className="font-bold text-rose-400">1091 / 181</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60">
                <span>Childline Support</span>
                <span className="font-bold text-amber-400">1098</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60">
                <span>National Career Service</span>
                <span className="font-bold text-teal-400">1514</span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/60">
                <span>Emergency Police / Relief</span>
                <span className="font-bold text-sky-400">112</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SakhiSetu – Open-Source Women Empowerment Initiative. Developed for Innovation Showcase.</p>
          <p className="text-slate-400 font-medium tracking-wide">
            Made by women, for women — Dedicated to economic independence and self-reliance.
          </p>
        </div>
      </div>
    </footer>
  );
}
