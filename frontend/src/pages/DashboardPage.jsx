import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, User, MapPin, Clock, Briefcase, GraduationCap, 
  Baby, Sliders, ArrowRight, ShieldCheck, BookOpen, Building2, 
  CheckCircle2, ChevronRight, AlertCircle, LogIn, Heart, Phone
} from 'lucide-react';
import { profileService, recommendationService, authService } from '../services/api';
import MatchBadge from '../components/MatchBadge';
import JobCard from '../components/JobCard';
import CourseCard from '../components/CourseCard';
import SchemeCard from '../components/SchemeCard';
import RoadmapTimeline from '../components/RoadmapTimeline';
import JobDetailModal from '../components/JobDetailModal';
import LoadingScreen from '../components/LoadingScreen';
import AuthModal from '../components/AuthModal';

export default function DashboardPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedSuccessToast, setAppliedSuccessToast] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      let activeProfile = location.state?.profile || profileService.getCachedProfile();

      // If no cached profile, check if user is logged in
      const user = authService.getCurrentUser();
      if (!activeProfile && user) {
        try {
          const meData = await authService.getMe();
          if (meData.profile) {
            activeProfile = meData.profile;
            localStorage.setItem('sakhi_current_profile', JSON.stringify(activeProfile));
          }
        } catch {
          // No profile yet
        }
      }

      setProfile(activeProfile);

      if (!activeProfile) {
        setLoading(false);
        return;
      }

      // If recommendations passed in state, use them
      if (location.state?.recommendations) {
        setRecommendations(location.state.recommendations);
        setLoading(false);
        return;
      }

      // Fetch fresh calculation from recommendation engine
      const recs = await recommendationService.getRecommendations(activeProfile);
      setRecommendations(recs);
      localStorage.setItem('sakhi_latest_recommendations', JSON.stringify(recs));
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setErrorMsg(err.message || 'Failed to calculate recommendations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleApplySuccess = (job) => {
    setAppliedSuccessToast(`Application for "${job.title}" at ${job.organization} recorded successfully!`);
    setTimeout(() => setAppliedSuccessToast(''), 4000);
  };

  if (loading) {
    return <LoadingScreen message="Calculating weighted recommendation scores..." />;
  }

  // If no profile registered yet
  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-white border border-rose-200 p-1 flex items-center justify-center mx-auto shadow-md">
          <img src="/logo.png" alt="SakhiSetu" className="w-full h-full object-contain" />
        </div>
        <h2 className="font-heading font-extrabold text-3xl text-slate-900">
          Create Your Profile to View Matches
        </h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          SakhiSetu ranks opportunities based on your real-life constraints: available hours, education, commute preference, and child's age.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-brand-600 to-rose-500 hover:from-brand-700 shadow-md shadow-brand-500/25 transition-all"
          >
            Create Your Profile Now
          </Link>
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            Sign In with Mobile / Email OTP
          </button>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => loadDashboardData()}
        />
      </div>
    );
  }

  const motherName = profile?.full_name || 'Mother';
  const topJobs = recommendations?.ranked_jobs?.slice(0, 4) || [];
  const topCourses = recommendations?.recommended_courses?.slice(0, 3) || [];
  const topSchemes = recommendations?.recommended_schemes?.slice(0, 2) || [];
  const nearbyCenters = recommendations?.childcare_centers?.slice(0, 3) || [];
  const roadmap = recommendations?.career_roadmap || [];
  const summary = recommendations?.summary || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Toast Notification */}
      {appliedSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{appliedSuccessToast}</span>
        </div>
      )}

      {/* Top Welcome & Score Header */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-amber-50 rounded-3xl p-6 sm:p-10 border border-rose-200/80 shadow-soft flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-rose-100/70 px-3 py-1 rounded-full border border-rose-200">
              Personalized Empowerment Dashboard
            </span>
            <span className="text-xs text-slate-500 font-medium">Smart Matching Engine Active</span>
          </div>

          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Welcome, <span className="text-brand-600">{motherName}</span>
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
            Here are your ranked opportunities based on your <b>{profile?.available_hours} hours/day</b> availability, <b>{profile?.career_preference}</b> interest, and location in <b>{profile?.city}, {profile?.state}</b>.
          </p>
        </div>

        {/* Quick Highlights / Top Compatibility Stat */}
        <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm shrink-0">
          <div className="text-center px-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Top Match</p>
            <p className="font-heading font-extrabold text-3xl text-brand-600">
              {summary.highest_match_score || 90}%
            </p>
            <p className="text-[10px] text-emerald-700 font-semibold">Calculated Score</p>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <div className="text-center px-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Suitable Jobs</p>
            <p className="font-heading font-extrabold text-3xl text-slate-800">
              {summary.total_suitable_jobs || topJobs.length}
            </p>
            <p className="text-[10px] text-slate-500 font-medium">Ranked</p>
          </div>
        </div>
      </div>

      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-600" />
            <h3 className="font-heading font-bold text-xl text-slate-900">Your Registered Circumstances</h3>
          </div>
          <Link
            to="/register"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 hover:underline flex items-center gap-1"
          >
            <span>Edit Constraints</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Location</span>
            <p className="font-bold text-slate-800 text-sm truncate">{profile?.city}, {profile?.state}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Education</span>
            <p className="font-bold text-slate-800 text-sm truncate">{profile?.education_level}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Experience</span>
            <p className="font-bold text-slate-800 text-sm">{profile?.years_of_experience || 0} Years</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Available Time</span>
            <p className="font-bold text-brand-600 text-sm">{profile?.available_hours} hrs / day</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Work Preference</span>
            <p className="font-bold text-slate-800 text-sm">{profile?.preferred_job_type}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-slate-400 block font-semibold uppercase text-[10px]">Child Info</span>
            <p className="font-bold text-slate-800 text-sm">{profile?.number_of_children || 1} child ({profile?.child_age || 4}yo)</p>
          </div>
        </div>

        {/* Current Skills Chips */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2">Your Skills:</span>
          {(profile?.skills || []).map((skill, idx) => (
            <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-brand-700 border border-rose-200 text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* SECTION: Top Job Matches */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-rose-100 text-brand-600">
                <Briefcase className="w-5 h-5" />
              </span>
              <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                Your Top Job Matches
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Rigorously calculated using rule-based formula: Skills (40%), Hours (20%), Location (20%), Experience (20%).
            </p>
          </div>

          <Link
            to="/jobs"
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            <span>View All Flexible Jobs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {topJobs.length === 0 ? (
          <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-center text-slate-500">
            No matching jobs found for current filters. Try adjusting your preferences.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {topJobs.map((job, idx) => (
              <JobCard
                key={job.job_id || idx}
                job={job}
                isTopMatch={idx === 0}
                onSelect={(j) => setSelectedJob(j)}
                onApply={(j) => handleApplySuccess(j)}
              />
            ))}
          </div>
        )}
      </section>

      {/* SECTION: Career Roadmap */}
      <RoadmapTimeline
        roadmap={roadmap}
        careerPreference={profile?.career_preference}
      />

      {/* 2-COLUMN SECTION: Recommended Courses & Government Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recommended Courses */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-100 text-amber-600">
                <BookOpen className="w-5 h-5" />
              </span>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Recommended Skill Upgrades
              </h3>
            </div>
            <Link to="/courses" className="text-xs font-bold text-amber-700 hover:underline">
              All Courses →
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Free verified courses to bridge missing skills and boost your match rating to 95%+.
          </p>

          <div className="space-y-4">
            {topCourses.map((course, idx) => (
              <CourseCard key={course.id || idx} course={course} isBridge={idx === 0} />
            ))}
          </div>
        </section>

        {/* Welfare & Schemes */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-emerald-100 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
              </span>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Government Welfare & Support
              </h3>
            </div>
            <Link to="/schemes" className="text-xs font-bold text-emerald-700 hover:underline">
              All Schemes →
            </Link>
          </div>
          <p className="text-xs text-slate-500">
            Indicative welfare schemes prioritizing single mothers, nutrition, and enterprise loans.
          </p>

          <div className="space-y-4">
            {topSchemes.map((scheme, idx) => (
              <SchemeCard key={scheme.id || idx} scheme={scheme} />
            ))}
          </div>
        </section>

      </div>

      {/* SECTION: Nearby Childcare Facilities */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-100 text-purple-600">
                <Baby className="w-5 h-5" />
              </span>
              <h3 className="font-heading font-bold text-2xl text-slate-900">
                Support & Childcare Near You ({profile?.city})
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Subsidized community crèches with verified operating hours.
            </p>
          </div>

          <Link
            to="/childcare"
            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            <span>View All Facilities Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {nearbyCenters.map((c) => (
            <div key={c.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="font-heading font-bold text-slate-900 text-sm">{c.name}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold shrink-0">
                    {c.location}
                  </span>
                </div>
                <p className="text-slate-600 mb-2">{c.address}</p>
                <div className="pt-2 border-t border-slate-200/60 text-slate-500 space-y-1 text-[11px]">
                  <p className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-slate-400 shrink-0" /><span>{c.opening_hours}</span></p>
                  <p className="font-semibold text-slate-700 flex items-center gap-1.5"><Phone className="w-3 h-3 text-slate-400 shrink-0" /><span>{c.contact}</span></p>
                  <p className="text-purple-700 font-medium flex items-center gap-1.5"><Sparkles className="w-3 h-3 text-purple-600 shrink-0" /><span>{c.services}</span></p>
                </div>
              </div>

              <div className="pt-3">
                <Link
                  to="/childcare"
                  className="w-full inline-block text-center py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-purple-50 text-purple-700 font-bold text-[11px]"
                >
                  View Facility Info
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApplySuccess={(j) => {
            setSelectedJob(null);
            handleApplySuccess(j);
          }}
        />
      )}

    </div>
  );
}
