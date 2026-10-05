import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, MapPin, Clock, X, CheckCircle2 } from 'lucide-react';
import { jobService, recommendationService, profileService } from '../services/api';
import JobCard from '../components/JobCard';
import JobDetailModal from '../components/JobDetailModal';
import LoadingScreen from '../components/LoadingScreen';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedToast, setAppliedToast] = useState('');

  // Filters State
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedHours, setSelectedHours] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setErrorMsg('');

      // Check if user has an active profile to score jobs against
      const profile = profileService.getCachedProfile();

      if (profile) {
        // Fetch personalized weighted recommendations
        const recData = await recommendationService.getRecommendations(profile);
        let ranked = recData.ranked_jobs || [];

        // Apply client filters on the ranked jobs
        if (search) {
          const s = search.toLowerCase();
          ranked = ranked.filter(j =>
            j.title.toLowerCase().includes(s) ||
            j.organization.toLowerCase().includes(s) ||
            j.description.toLowerCase().includes(s) ||
            (j.required_skills && j.required_skills.some(sk => sk.toLowerCase().includes(s)))
          );
        }
        if (selectedLocation) {
          ranked = ranked.filter(j => j.location.toLowerCase().includes(selectedLocation.toLowerCase()));
        }
        if (selectedType !== 'all') {
          ranked = ranked.filter(j => j.job_type.toLowerCase() === selectedType.toLowerCase());
        }
        if (selectedHours) {
          ranked = ranked.filter(j => j.required_hours <= parseInt(selectedHours, 10));
        }
        if (selectedCategory !== 'all') {
          ranked = ranked.filter(j => j.career_category.toLowerCase() === selectedCategory.toLowerCase());
        }

        setJobs(ranked);
      } else {
        // Fetch raw jobs from API
        const params = {};
        if (search) params.search = search;
        if (selectedLocation) params.location = selectedLocation;
        if (selectedType !== 'all') params.job_type = selectedType;
        if (selectedHours) params.hours = selectedHours;
        if (selectedCategory !== 'all') params.category = selectedCategory;

        const res = await jobService.getJobs(params);
        setJobs(res.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setErrorMsg(err.message || 'Unable to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [selectedType, selectedHours, selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedLocation('');
    setSelectedType('all');
    setSelectedHours('');
    setSelectedCategory('all');
  };

  const handleApplySuccess = (job) => {
    setAppliedToast(`Application for ${job.title} received successfully!`);
    setTimeout(() => setAppliedToast(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast */}
      {appliedToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-emerald-500/40 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{appliedToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 via-white to-pink-50 p-6 sm:p-8 rounded-3xl border border-rose-200/80 shadow-soft">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-rose-100 px-3 py-1 rounded-full border border-rose-200">
            Work Opportunities
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2">
            Circumstance-Aligned Jobs
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Browse verified part-time, remote, and hybrid positions structured for single mothers.
          </p>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        
        {/* Search Input Row */}
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, skill (e.g. Excel, Canva), or organization..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100 text-sm outline-none"
            />
          </div>

          <div className="sm:w-64 relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholder="City (e.g. Pune, Mumbai)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-brand-500 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter By:</span>
          </div>

          {/* Job Type */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">All Job Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          {/* Hours */}
          <select
            value={selectedHours}
            onChange={(e) => setSelectedHours(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="">Any Daily Hours</option>
            <option value="2">Max 2 hrs/day</option>
            <option value="4">Max 4 hrs/day</option>
            <option value="6">Max 6 hrs/day</option>
            <option value="8">Full Day (8 hrs)</option>
          </select>

          {/* Career Category */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Data Entry">Data Entry</option>
            <option value="Customer Support">Customer Support</option>
            <option value="Teaching">Teaching & Tutoring</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Software/IT">Software / IT</option>
            <option value="Tailoring">Tailoring</option>
            <option value="Sales">Sales</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Content Writing">Content Writing</option>
          </select>

          {/* Reset */}
          {(search || selectedLocation || selectedType !== 'all' || selectedHours || selectedCategory !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="text-xs text-brand-600 hover:text-brand-800 font-bold ml-auto flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>

      </div>

      {/* Jobs Listing */}
      {loading ? (
        <LoadingScreen message="Filtering matching opportunities..." />
      ) : jobs.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
          <p className="font-heading font-bold text-lg text-slate-800">No opportunities found</p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria or resetting filters to see more results.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-semibold">
            Showing {jobs.length} opportunities (sorted by compatibility):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job, idx) => (
              <JobCard
                key={job.job_id || job.id || idx}
                job={job}
                onSelect={(j) => setSelectedJob(j)}
                onApply={(j) => handleApplySuccess(j)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
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
