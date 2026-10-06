import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, MapPin, GraduationCap, Briefcase, Clock, Baby, IndianRupee, Plus, X, ArrowRight, AlertCircle, ShieldCheck, LogIn, Check, Sparkles } from 'lucide-react';
import { profileService, recommendationService, authService } from '../services/api';
import { DEMO_PROFILES } from '../data/mockData';
import LoadingScreen from '../components/LoadingScreen';
import AuthModal from '../components/AuthModal';

const SKILL_SUGGESTIONS = [
  'MS Office', 'Excel', 'Word', 'Communication', 'Data Entry',
  'Typing', 'Spoken English', 'Customer Support', 'Telecalling',
  'Teaching', 'Tutoring', 'Digital Marketing', 'Social Media',
  'Canva', 'Python', 'Web Development', 'HTML', 'CSS',
  'Tailoring', 'Embroidery', 'Garment Making', 'Sales',
  'Healthcare', 'Patient Care', 'Computer Basics'
];

export default function RegisterProfilePage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [formData, setFormData] = useState({
    full_name: '',
    age: '28',
    city: '',
    state: '',
    education_level: "Bachelor's Degree",
    qualification: '',
    skills: ['MS Office', 'Communication'],
    years_of_experience: '1',
    preferred_job_type: 'Remote',
    available_hours: '4',
    career_preference: 'Data Entry',
    number_of_children: '1',
    child_age: '4',
    monthly_income: 'Below ₹15,000',
    preferred_salary: '₹15,000 - ₹20,000'
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    if (user?.full_name) {
      setFormData(prev => ({ ...prev, full_name: user.full_name }));
    }
  }, []);

  const handleAddSkill = (skill) => {
    const trimmed = skill.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, trimmed] }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleCustomSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (customSkillInput.trim()) {
        handleAddSkill(customSkillInput.trim());
        setCustomSkillInput('');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickFill = (demoData) => {
    setFormData({
      full_name: demoData.full_name || '',
      age: String(demoData.age || 28),
      city: demoData.city || '',
      state: demoData.state || 'Maharashtra',
      education_level: demoData.education_level || "Bachelor's Degree",
      qualification: demoData.qualification || '',
      skills: demoData.skills || [],
      years_of_experience: String(demoData.years_of_experience || 0),
      preferred_job_type: demoData.preferred_job_type || 'Remote',
      available_hours: String(demoData.available_hours || 4),
      career_preference: demoData.career_preference || 'Data Entry',
      number_of_children: String(demoData.number_of_children || 1),
      child_age: String(demoData.child_age || 4),
      monthly_income: demoData.monthly_income || 'Below ₹15,000',
      preferred_salary: demoData.preferred_salary || '₹15,000 - ₹20,000'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Form Validation
    if (!formData.full_name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!formData.city.trim() || !formData.state.trim()) {
      setErrorMsg('Please enter both City and State.');
      return;
    }
    if (formData.skills.length === 0) {
      setErrorMsg('Please select or add at least one skill.');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        full_name: formData.full_name.trim(),
        age: parseInt(formData.age, 10) || 28,
        city: formData.city.trim(),
        state: formData.state.trim(),
        education_level: formData.education_level,
        qualification: formData.qualification.trim(),
        skills: formData.skills,
        years_of_experience: parseFloat(formData.years_of_experience) || 0,
        preferred_job_type: formData.preferred_job_type,
        available_hours: parseInt(formData.available_hours, 10) || 4,
        career_preference: formData.career_preference,
        number_of_children: parseInt(formData.number_of_children, 10) || 1,
        child_age: parseInt(formData.child_age, 10) || 4,
        monthly_income: formData.monthly_income,
        preferred_salary: formData.preferred_salary
      };

      // 1. Save profile to backend database API
      const profileResult = await profileService.saveProfile(payload);
      const savedProfile = profileResult.profile || payload;

      // 2. Run smart recommendations engine
      const recResult = await recommendationService.getRecommendations(savedProfile);
      localStorage.setItem('sakhi_latest_recommendations', JSON.stringify(recResult));

      // 3. Redirect to Dashboard with state
      navigate('/dashboard', { state: { profile: savedProfile, recommendations: recResult } });

    } catch (err) {
      console.error('Registration/Matching error:', err);
      setErrorMsg(err.message || 'Unable to submit profile. Please ensure the backend is running.');
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingScreen message="Saving profile and calculating personalized matches..." />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 rounded-3xl p-6 sm:p-8 border border-rose-200 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-white/80 px-3 py-1 rounded-full border border-rose-200 inline-block mb-2">
            SakhiSetu Profile Registration
          </span>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900">
            Enter Your Real Circumstances
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
            We evaluate your available daily hours, childcare situation, and skills to provide transparently matched opportunities.
          </p>
        </div>

        {!currentUser && (
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="self-start sm:self-center shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-brand-700 bg-white hover:bg-rose-50 border border-brand-300 shadow-sm"
          >
            <LogIn className="w-4 h-4 text-brand-600" />
            <span>Sign In (Mobile / Email)</span>
          </button>
        )}
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-sm text-rose-800 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Quick Fill Demo Persona Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <div>
            <p className="text-xs font-bold text-slate-800">
              Quick Test: Fill Form with Demo Mother Persona
            </p>
            <p className="text-[11px] text-slate-500">
              Select any profile to auto-populate the form and test match results:
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {DEMO_PROFILES.map((dp) => (
            <button
              key={dp.id}
              type="button"
              onClick={() => handleQuickFill(dp.data)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-brand-700 border border-slate-200 transition-all active:scale-95"
            >
              Fill: {dp.name}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm">
        
        {/* Section 1: Personal Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">1. Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="e.g. Aarti Joshi"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="e.g. 29"
                min="18"
                max="70"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Pune"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                State *
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Maharashtra"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Education & Experience */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">2. Education & Professional Background</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Education Level *
              </label>
              <select
                name="education_level"
                value={formData.education_level}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all bg-white"
              >
                <option value="10th Standard / SSC">10th Standard / SSC</option>
                <option value="12th Standard / HSC">12th Standard / HSC</option>
                <option value="Diploma / Vocational">Diploma / Vocational</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="Other / Self-Taught">Other / Self-Taught</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Degree / Specialization
              </label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g. B.A. or B.Com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Years of Experience *
              </label>
              <select
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none transition-all bg-white"
              >
                <option value="0">0 years (Fresher / Career Break)</option>
                <option value="0.5">6 months</option>
                <option value="1">1 year</option>
                <option value="2">2 years</option>
                <option value="3">3 years</option>
                <option value="5">5+ years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Skills (Multi-select) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Briefcase className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">3. Your Skills & Capabilities</h3>
          </div>

          <p className="text-xs text-slate-500">
            Select from common skills below or add your own. Skills account for 40% of the match score calculation.
          </p>

          {/* Current Selected Skills Pills */}
          <div className="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-2xl bg-slate-50 border border-slate-200">
            {formData.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-brand-50 text-brand-700 border border-brand-200 text-xs font-semibold"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-brand-900 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
            {formData.skills.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills selected yet. Click suggestions below or type a custom skill.</span>
            )}
          </div>

          {/* Custom Skill Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={handleCustomSkillKeyDown}
              placeholder="Add another skill (e.g. Fast Typing, English Communication, Canva)..."
              className="flex-1 px-4 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-brand-500"
            />
            <button
              type="button"
              onClick={() => {
                if (customSkillInput.trim()) {
                  handleAddSkill(customSkillInput.trim());
                  setCustomSkillInput('');
                }
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>

          {/* Popular Suggestions */}
          <div className="flex flex-wrap gap-1.5">
            {SKILL_SUGGESTIONS.map(s => {
              const isSelected = formData.skills.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => isSelected ? handleRemoveSkill(s) : handleAddSkill(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-slate-400" />}
                    <span>{s}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Work Preferences & Constraints */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">4. Work Preferences & Daily Constraints</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Preferred Job Type *
              </label>
              <select
                name="preferred_job_type"
                value={formData.preferred_job_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none bg-white font-medium"
              >
                <option value="Remote">Remote (Work From Home)</option>
                <option value="Hybrid">Hybrid (Flexible Mix)</option>
                <option value="On-site">On-site (Local Office / Workshop)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Available Daily Hours *
              </label>
              <select
                name="available_hours"
                value={formData.available_hours}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none bg-white font-medium"
              >
                <option value="2">2 hours / day (Micro shifts)</option>
                <option value="4">4 hours / day (Half day)</option>
                <option value="6">6 hours / day (Moderate shift)</option>
                <option value="8">8 hours / day (Full shift)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Career Preference *
              </label>
              <select
                name="career_preference"
                value={formData.career_preference}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none bg-white font-medium"
              >
                <option value="Data Entry">Data Entry</option>
                <option value="Teaching">Teaching & Tutoring</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Software/IT">Software / IT</option>
                <option value="Tailoring">Tailoring & Apparel</option>
                <option value="Sales">Sales & Telecalling</option>
                <option value="Healthcare">Healthcare Support</option>
                <option value="Content Writing">Content Writing</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Child Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Baby className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">5. Childcare Circumstances</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Number of Children *
              </label>
              <input
                type="number"
                name="number_of_children"
                value={formData.number_of_children}
                onChange={handleChange}
                min="1"
                max="8"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Youngest Child's Age (Years) *
              </label>
              <input
                type="number"
                name="child_age"
                value={formData.child_age}
                onChange={handleChange}
                min="0"
                max="18"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Used to suggest age-appropriate local crèches and eligible government maternal welfare schemes.
              </span>
            </div>
          </div>
        </div>

        {/* Section 6: Optional Financial Preferences */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <IndianRupee className="w-4 h-4 text-emerald-600" />
            <h4 className="font-heading font-bold text-sm text-slate-700">Optional Financial Details</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Current Household Income Range
              </label>
              <select
                name="monthly_income"
                value={formData.monthly_income}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="Below ₹10,000">Below ₹10,000 / month</option>
                <option value="Below ₹15,000">Below ₹15,000 / month</option>
                <option value="₹15,000 - ₹25,000">₹15,000 - ₹25,000 / month</option>
                <option value="Above ₹25,000">Above ₹25,000 / month</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                Target Monthly Salary
              </label>
              <select
                name="preferred_salary"
                value={formData.preferred_salary}
                onChange={handleChange}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
              >
                <option value="₹10,000 - ₹15,000">₹10,000 - ₹15,000</option>
                <option value="₹15,000 - ₹20,000">₹15,000 - ₹20,000</option>
                <option value="₹20,000 - ₹30,000">₹20,000 - ₹30,000</option>
                <option value="₹30,000+">₹30,000+</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Privacy: Your circumstances are stored securely in the database to calculate your matches.</span>
          </p>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 hover:to-rose-600 shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-95"
          >
            <span>Save Profile & Calculate Matches</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          if (user?.full_name) {
            setFormData(prev => ({ ...prev, full_name: user.full_name }));
          }
        }}
      />

    </div>
  );
}
