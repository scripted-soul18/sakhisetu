import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Baby, Search, CheckCircle2, ShieldCheck, Heart, Sparkles, Filter, ExternalLink } from 'lucide-react';
import { childcareService } from '../services/api';
import LoadingScreen from '../components/LoadingScreen';

export default function ChildcarePage() {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');
  const [inquiryToast, setInquiryToast] = useState('');

  const fetchCenters = async () => {
    try {
      setLoading(true);
      const params = {};
      if (cityFilter && cityFilter !== 'all') params.location = cityFilter;
      if (search) params.search = search;

      const res = await childcareService.getChildcare(params);
      setCenters(res.centers || []);
    } catch (err) {
      console.error('Error fetching childcare centers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, [cityFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCenters();
  };

  const handleInquire = (center) => {
    setInquiryToast(`Subsidy & enrollment inquiry initiated for ${center.name}! A coordinator will contact you.`);
    setTimeout(() => setInquiryToast(''), 4500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Toast Notification */}
      {inquiryToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-purple-500/40 flex items-center gap-3 animate-in slide-in-from-bottom duration-300">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">{inquiryToast}</span>
        </div>
      )}

      {/* Header Banner with Real Photo Showcase */}
      <div className="bg-gradient-to-r from-purple-50 via-white to-pink-50 p-6 sm:p-8 rounded-3xl border border-purple-200 shadow-soft flex flex-col lg:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-bold border border-purple-300">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700" />
            <span>Verified Community Support & Care</span>
          </div>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Childcare & Crèche Facilities
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Discover dependable, subsidized crèches, infant daycares, and after-school centers with special fee concessions for single working mothers. Inspected for safety, hygienic standards, and certified caregivers.
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600 pt-1">
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Inspected Facilities</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-600" /> Single Mother Subsidies</span>
          </div>
        </div>

        {/* Real Facility Image */}
        <div className="w-full lg:w-80 h-48 rounded-2xl overflow-hidden shadow-md border border-purple-200 shrink-0 relative group">
          <img 
            src="/childcare_center.jpg" 
            alt="Safe and modern childcare center for single mothers" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute bottom-2 left-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center justify-between">
            <span>Safe Learning Spaces</span>
            <span className="text-purple-300 font-bold">100% Verified</span>
          </div>
        </div>
      </div>

      {/* Search and City Filter Bar */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by facility name, area, or service (e.g. Infant, Crèche, Montessori, After-school)..."
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-purple-500 text-sm outline-none"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
          >
            Search Facilities
          </button>
        </form>

        {/* City Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px] mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Select City Hub:</span>
          </div>
          {['all', 'Pune', 'Mumbai', 'Delhi', 'Bengaluru', 'Jaipur'].map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city === 'all' ? '' : city)}
              className={`px-3.5 py-1.5 rounded-xl font-medium transition-all ${
                (cityFilter === city || (city === 'all' && !cityFilter))
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {city === 'all' ? 'All Locations' : city}
            </button>
          ))}
        </div>
      </div>

      {/* Childcare Center Cards Grid */}
      {loading ? (
        <LoadingScreen message="Loading childcare facilities..." />
      ) : centers.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 space-y-2">
          <p className="font-heading font-bold text-lg text-slate-800">No childcare centers found</p>
          <p className="text-xs text-slate-500">Try selecting another city or clearing your search filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Showing {centers.length} verified community centres</span>
            <span>Single Mother Subsidy Supported</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {centers.map((center) => (
              <div
                key={center.id}
                className="bg-white rounded-3xl border border-slate-200 hover:border-purple-300 p-6 shadow-sm hover:shadow-card transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Location Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-xs font-semibold border border-purple-200">
                      {center.location}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Verified
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-heading font-bold text-xl text-slate-900 mb-2 leading-snug hover:text-purple-700 transition-colors">
                    {center.name}
                  </h3>

                  {/* Address */}
                  <p className="text-xs text-slate-600 mb-4 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </p>

                  {/* Operational Details */}
                  <div className="space-y-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{center.opening_hours}</span>
                    </div>
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{center.contact}</span>
                    </div>
                  </div>

                  {/* Services Badges */}
                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Provided Services:
                    </span>
                    <p className="text-xs text-purple-900 font-medium bg-purple-50/60 p-2.5 rounded-xl border border-purple-100 leading-relaxed flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                      <span>{center.services}</span>
                    </p>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleInquire(center)}
                    className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-all active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5" />
                    Inquire for Crèche Subsidy
                  </button>

                  <a
                    href={`tel:${center.contact.split('|')[0].trim()}`}
                    className="w-full py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors text-center"
                  >
                    Call Facility Directly
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
