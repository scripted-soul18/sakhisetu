import React, { useState, useEffect } from 'react';
import { Search, BookOpen, Filter, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { courseService } from '../services/api';
import CourseCard from '../components/CourseCard';
import LoadingScreen from '../components/LoadingScreen';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;

      const res = await courseService.getCourses(params);
      setCourses(res.courses || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCourses();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner with Real Photo Showcase */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-orange-50 p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-soft flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            <span>Free Skill Development & Certifications</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Skill Upgrade & Certification Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Free, self-paced courses from National Skill Development Corporation (NSDC), SWAYAM, and partnering foundations designed to fit mothers' flexible schedules and bridge job requirements.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> 100% Free Certifications</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Self-Paced Learning</span>
          </div>
        </div>

        {/* Real Training Image */}
        <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden shadow-md border border-amber-200 shrink-0 relative group">
          <img 
            src="/skills_training.jpg" 
            alt="Women learning digital skills in vocational training class" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center justify-between">
            <span>Vocational Training</span>
            <span className="text-amber-300 font-bold">NSDC Partner</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search course title, provider, or skill (e.g. Python, Excel, English)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-amber-500 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Categories Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Categories:</span>
          {['all', 'Data Entry', 'Digital Marketing', 'Software/IT', 'Customer Support', 'Financial Literacy', 'Tailoring'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                category === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Skills' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      {loading ? (
        <LoadingScreen message="Loading courses catalog..." />
      ) : courses.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500">
          No courses matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

    </div>
  );
}
