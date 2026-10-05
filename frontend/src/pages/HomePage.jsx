import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, ArrowRight, ShieldCheck, HeartHandshake, MapPin, 
  BookOpen, Briefcase, Baby, Sliders, CheckCircle2, Star, Award, 
  Clock, IndianRupee, Users, Phone, Mail, LogIn
} from 'lucide-react';
import { authService, profileService } from '../services/api';
import AuthModal from '../components/AuthModal';

export default function HomePage() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMethod, setAuthMethod] = useState('mobile');
  const navigate = useNavigate();

  const handleOpenAuth = (method = 'mobile') => {
    setAuthMethod(method);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (user) => {
    const profile = profileService.getCachedProfile();
    if (profile) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  const currentUser = authService.getCurrentUser();

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-rose-200/40 via-brand-100/30 to-amber-100/20 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Heading & Auth Card */}
            <div className="lg:col-span-7 text-left space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-brand-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                <img src="/logo.png" alt="SakhiSetu Logo" className="w-5 h-5 object-contain" />
                <span>Digital Empowerment for Single Mothers</span>
              </div>

              {/* Heading */}
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-[1.1]">
                Empowering Single Mothers. <br />
                <span className="bg-gradient-to-r from-brand-600 via-rose-500 to-amber-600 bg-clip-text text-transparent">
                  Building Independent Futures.
                </span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal">
                A personalized digital platform connecting single mothers with suitable jobs, free skills, government support, and childcare resources — ranked according to your real-life constraints.
              </p>

              {/* Real Authentication Quick Card */}
              <div className="bg-white/95 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-rose-200 shadow-xl space-y-4 max-w-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                      {currentUser ? 'Active Account' : 'Get Started Now'}
                    </span>
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-slate-900 mt-1">
                      {currentUser ? `Welcome back, ${currentUser.full_name}!` : 'Sign Up or Sign In to Unlock Opportunities'}
                    </h3>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>

                {currentUser ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-slate-600">
                      You are signed in. View your tailored job recommendations or update your constraints.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        to="/dashboard"
                        className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm"
                      >
                        Go to My Dashboard →
                      </Link>
                      <Link
                        to="/jobs"
                        className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200"
                      >
                        Browse All Jobs
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 pt-2">
                    <p className="text-xs text-slate-500">
                      Choose your preferred sign-in method to receive an instant verification code:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <button
                        onClick={() => handleOpenAuth('mobile')}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-rose-50 text-slate-800 text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Phone className="w-4 h-4 text-brand-600" />
                        <span>Mobile (OTP)</span>
                      </button>

                      <button
                        onClick={() => handleOpenAuth('email')}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-brand-400 bg-slate-50 hover:bg-rose-50 text-slate-800 text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <Mail className="w-4 h-4 text-brand-600" />
                        <span>Email (OTP)</span>
                      </button>

                      <button
                        onClick={() => handleOpenAuth('google')}
                        className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold transition-all shadow-sm active:scale-95"
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                        </svg>
                        <span>Google</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                      <span className="text-slate-400">Already registered?</span>
                      <button
                        onClick={() => handleOpenAuth('mobile')}
                        className="font-bold text-brand-600 hover:underline"
                      >
                        Quick Sign In with OTP →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Navigation Links */}
              <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
                <span className="font-semibold text-slate-600">Quick Explore:</span>
                <Link to="/jobs" className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                  12+ Flexible Jobs
                </Link>
                <Link to="/courses" className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                  Free Skill Courses
                </Link>
                <Link to="/schemes" className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                  Welfare Schemes
                </Link>
                <Link to="/childcare" className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors">
                  Childcare Centers
                </Link>
              </div>

            </div>

            {/* Right Column: Hero Real Photography Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Visual Image Frame */}
                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-[4/3] sm:aspect-[16/11] relative group">
                  <img
                    src="/hero_mother.jpg"
                    alt="Indian mother balancing digital career and family"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                  {/* Caption on image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="font-heading font-bold text-sm">Flexible Careers Tailored for Mothers</p>
                    <p className="text-xs text-rose-200">Balanced work hours, nearby daycare, and dignity</p>
                  </div>
                </div>

                {/* Floating Badge 1 - Top Right */}
                <div className="absolute -top-4 -right-2 sm:-right-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200 shadow-lg flex items-center gap-2 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 leading-tight">100% Free Public Initiative</p>
                    <p className="text-[10px] text-emerald-600 font-semibold">Zero Commission or Hidden Fees</p>
                  </div>
                </div>

                {/* Floating Badge 2 - Bottom Left */}
                <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-rose-200 shadow-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-900 leading-tight">4-Factor Match Engine</p>
                    <p className="text-[10px] text-slate-500 font-medium">Time, Skills, Location, Childcare</p>
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Main USP Highlight */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-8 sm:p-12 shadow-2xl overflow-hidden border border-slate-800">
          <div className="relative z-10 text-center max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-rose-300 text-xs font-bold tracking-wider uppercase">
              The SakhiSetu Innovation USP
            </span>
            <blockquote className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-snug">
              “SakhiSetu does not simply list resources. It understands a mother’s circumstances and ranks opportunities according to her real-life constraints.”
            </blockquote>
            <p className="text-sm sm:text-base text-rose-200/80 font-normal">
              No generic jobs requiring 10-hour commutes. We evaluate child age, available time, nearby crèche centers, and transferable skills to calculate genuine compatibility.
            </p>
          </div>
        </div>
      </section>

      {/* Why SakhiSetu Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-600 mb-2">
            Why SakhiSetu?
          </h2>
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Designed for Real Lives, Not Ideal Resumes
          </h3>
          <p className="text-base text-slate-600 mt-3">
            Single mothers face distinct everyday hurdles that conventional job boards completely ignore.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 text-brand-600 flex items-center justify-center">
              <Clock className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-xl text-slate-900">Time & Childcare Realities</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              When you have a young child and 4 available hours between school runs, a standard 9-to-6 job is impossible. We prioritize matching your exact daily time window.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sliders className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-xl text-slate-900">Explainable Transparency</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              No black-box algorithms or fake claims. Every recommendation shows a clear 4-factor breakdown: Skills (40%), Hours (20%), Location (20%), and Experience (20%).
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h4 className="font-heading font-bold text-xl text-slate-900">Full Support Ecosystem</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              Employment alone is not enough without social backing. SakhiSetu links you to government maternity/welfare schemes and community crèches in your district.
            </p>
          </div>

        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-b from-rose-50/50 to-white rounded-3xl border border-rose-100 p-8 sm:p-14">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
              Simple 4-Step Process
            </span>
            <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
              How SakhiSetu Works
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900">Quick Authentication</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Sign up with your mobile number, email, or Google and confirm your identity via instant OTP.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900">Set Constraints</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Provide your education, available daily hours, child's age, and preferred career path.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900">Smart Ranking</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our rule-based engine mathematically weights skill overlap, shift flexibility, and commute feasibility.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-bold flex items-center justify-center text-sm">
                4
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900">Thrive & Grow</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Bridge missing skills with free courses, apply for flexible work, and access subsidized community crèches.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-600">
            Four Integrated Pillars
          </span>
          <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight mt-1">
            What SakhiSetu Delivers
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Jobs */}
          <Link to="/jobs" className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-36 rounded-2xl bg-gradient-to-tr from-rose-600 via-brand-600 to-rose-400 p-4 flex flex-col justify-between text-white mb-3.5 relative shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded backdrop-blur-xs">12+ Active Roles</span>
                  <p className="text-xs font-bold mt-1">Remote, Hybrid & Local Work</p>
                </div>
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                1. Flexible Job Matches
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Curated remote, hybrid, and part-time opportunities ranging from data entry to tutoring and IT support.
              </p>
            </div>
            <span className="text-xs font-bold text-brand-600 flex items-center gap-1 pt-3">
              Browse Openings <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 2: Courses with Real Image */}
          <Link to="/courses" className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-36 rounded-2xl overflow-hidden mb-3.5 relative shadow-sm border border-amber-200">
                <img src="/skills_training.jpg" alt="Free Skill Training Courses" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">100% Free Certifications</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                2. Skill Bridge Courses
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Free, self-paced certifications through Skill India, SWAYAM, and NCS to bridge identified skill gaps.
              </p>
            </div>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1 pt-3">
              Explore Courses <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 3: Schemes */}
          <Link to="/schemes" className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-36 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 p-4 flex flex-col justify-between text-white mb-3.5 relative shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded backdrop-blur-xs">Government Welfare</span>
                  <p className="text-xs font-bold mt-1">Mission Shakti & PMMVY</p>
                </div>
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                3. Government Schemes
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Indicative eligibility check and direct official portal links for Mission Shakti, PMMVY, and PMKVY.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 pt-3">
              Check Eligibility <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

          {/* Pillar 4: Childcare with Real Image */}
          <Link to="/childcare" className="group p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between overflow-hidden">
            <div>
              <div className="h-36 rounded-2xl overflow-hidden mb-3.5 relative shadow-sm border border-purple-200">
                <img src="/childcare_center.jpg" alt="Childcare & Daycare Facilities" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">Verified Crèches</span>
              </div>
              <h4 className="font-heading font-bold text-lg text-slate-900 group-hover:text-purple-600 transition-colors">
                4. Crèche Directory
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                Subsidized community daycares with opening hours, direct contacts, and single mother fee waivers.
              </p>
            </div>
            <span className="text-xs font-bold text-purple-600 flex items-center gap-1 pt-3">
              Find Nearby Crèches <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>

        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authMethod}
      />

    </div>
  );
}
