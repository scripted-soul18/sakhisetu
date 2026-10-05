import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Briefcase, BookOpen, ShieldCheck, Baby, LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { authService, profileService } from '../services/api';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check local authentication state
    const user = authService.getCurrentUser();
    setCurrentUser(user);
  }, [location.pathname]);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'How It Works', path: '/#how-it-works' },
    { name: 'Jobs', path: '/jobs' },
    { name: 'Courses', path: '/courses' },
    { name: 'Schemes', path: '/schemes' },
    { name: 'Childcare', path: '/childcare' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  const isActive = (path) => {
    if (path.startsWith('/#')) return false;
    return location.pathname === path;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-white border border-rose-200/80 p-1 flex items-center justify-center shadow-md shadow-rose-200/50 group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <img src="/logo.png" alt="SakhiSetu Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-extrabold text-2xl tracking-tight text-slate-900 group-hover:text-brand-600 transition-colors">
                    Sakhi<span className="text-brand-600">Setu</span>
                  </span>
                  <span className="text-[10px] bg-rose-100 text-brand-700 font-bold px-1.5 py-0.5 rounded-full border border-rose-200 uppercase tracking-wide">
                    Empower
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">A Digital Empowerment Platform for Single Mothers</p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive(link.path)
                      ? 'text-brand-600 bg-brand-50'
                      : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Buttons: Sign In / User Profile */}
            <div className="hidden sm:flex items-center gap-3">
              {currentUser ? (
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-brand-900 text-xs font-semibold">
                    <User className="w-4 h-4 text-brand-600" />
                    <span className="truncate max-w-[130px] font-bold">
                      {currentUser.full_name || currentUser.mobile_number || currentUser.email}
                    </span>
                  </div>

                  <Link
                    to="/register"
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    Edit Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    title="Log out from SakhiSetu"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-brand-200 transition-all shadow-sm active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-brand-600" />
                    Sign In / Sign Up
                  </button>

                  <Link
                    to="/register"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-md shadow-brand-500/25 transition-all hover:shadow-lg active:scale-95"
                  >
                    <User className="w-3.5 h-3.5" />
                    Create Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              {!currentUser && (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-brand-700 bg-rose-50 border border-rose-200 flex items-center gap-1"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Sign In
                </button>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2.5 rounded-xl text-slate-600 hover:text-brand-600 hover:bg-rose-50 focus:outline-none"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {isOpen && (
          <div className="lg:hidden border-b border-rose-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
            <nav className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'text-brand-600 bg-brand-50 font-semibold'
                      : 'text-slate-700 hover:text-brand-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2.5">
              {currentUser ? (
                <>
                  <div className="p-3 rounded-xl bg-rose-50 text-xs text-brand-900 font-bold flex items-center justify-between">
                    <span>Logged in as: {currentUser.full_name || currentUser.mobile_number}</span>
                    <button onClick={handleLogout} className="text-rose-600 underline">Logout</button>
                  </div>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-rose-500 shadow-md"
                  >
                    Edit Profile Constraints
                  </Link>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { setIsOpen(false); setShowAuthModal(true); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-brand-700 bg-rose-50 border border-rose-200"
                  >
                    <LogIn className="w-4 h-4 text-brand-600" />
                    Sign In / Sign Up (Mobile, Email, Google)
                  </button>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-brand-600 to-rose-500 shadow-md"
                  >
                    <User className="w-4 h-4" />
                    Create Profile Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Real Auth Modal with Mobile, Email, Google OTP */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          // If user already has profile, redirect to dashboard, else register
          const profile = profileService.getCachedProfile();
          if (profile) {
            navigate('/dashboard');
          } else {
            navigate('/register');
          }
        }}
      />
    </>
  );
}
