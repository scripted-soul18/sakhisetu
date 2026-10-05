import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertTriangle } from 'lucide-react';
import { schemeService } from '../services/api';
import SchemeCard from '../components/SchemeCard';
import LoadingScreen from '../components/LoadingScreen';

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const fetchSchemes = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (category !== 'all') params.category = category;

      const res = await schemeService.getSchemes(params);
      setSchemes(res.schemes || []);
    } catch (err) {
      console.error('Error fetching schemes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchemes();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchSchemes();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-6 sm:p-8 rounded-3xl border border-emerald-200 shadow-soft">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            Government Welfare & Empowerment
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 mt-2">
            Social Support & Government Schemes
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Verified national initiatives supporting women's safety, maternal benefits, vocational stipends, and entrepreneurship.
          </p>
        </div>
      </div>

      {/* Mandatory Indicative Eligibility Banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3 text-xs text-amber-950 shadow-sm">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-900 mb-0.5">Official Verification Reminder</p>
          <p className="leading-relaxed">
            Eligibility shown here is indicative. Criteria such as annual income slabs, age limits, and local documentation may vary by state. Please verify current eligibility and requirements directly on the official government website.
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search scheme name, benefit keywords (e.g. Shakti, Loan, Crèche, Stipend)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-emerald-500 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
          >
            Search
          </button>
        </form>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Focus Areas:</span>
          {['all', 'Women Empowerment & Safety', 'Maternal & Child Health', 'Employment & Career', 'Skill Development', 'Entrepreneurship', 'Business Financing'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                category === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {cat === 'all' ? 'All Schemes' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <LoadingScreen message="Loading welfare schemes..." />
      ) : schemes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500">
          No schemes found for this selection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}

    </div>
  );
}
