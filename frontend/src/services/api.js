import axios from 'axios';
import {
  DEMO_JOBS,
  DEMO_COURSES,
  DEMO_SCHEMES,
  DEMO_CHILDCARE,
  DEMO_PROFILES,
  calculateClientRecommendations
} from '../data/mockData';

// Base API URL: Defaults to /api which Vite proxies in local dev
// When deployed on Netlify, if VITE_API_URL is unset or API is unreachable,
// the service automatically falls back to the rich demo dataset.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Attach auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sakhi_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Unable to connect to the backend server.';
    if (error.response) {
      message = error.response.data?.error || error.response.data?.message || `Server responded with ${error.response.status}`;
    } else if (error.request) {
      message = 'Backend server not reachable. Serving local prototype demo data.';
    }
    return Promise.reject(new Error(message));
  }
);

// Helper filtering functions for demo mode
function filterDemoJobs(params = {}) {
  let list = [...DEMO_JOBS];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.organization.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      (j.required_skills && j.required_skills.some(s => s.toLowerCase().includes(q)))
    );
  }
  if (params.location) {
    const loc = params.location.toLowerCase();
    list = list.filter(j => j.location.toLowerCase().includes(loc));
  }
  if (params.job_type && params.job_type !== 'all') {
    list = list.filter(j => j.job_type.toLowerCase() === params.job_type.toLowerCase());
  }
  if (params.hours) {
    list = list.filter(j => j.required_hours <= parseInt(params.hours, 10));
  }
  if (params.category && params.category !== 'all') {
    list = list.filter(j => j.career_category.toLowerCase() === params.category.toLowerCase());
  }
  return { status: 'success', count: list.length, jobs: list, source: 'demo_fallback' };
}

function filterDemoCourses(params = {}) {
  let list = [...DEMO_COURSES];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== 'all') {
    const targetCat = params.category.toLowerCase();
    list = list.filter(c => {
      const sc = c.skill_category.toLowerCase();
      return sc === targetCat || sc.includes(targetCat) || targetCat.includes(sc);
    });
  }
  return { status: 'success', count: list.length, courses: list, source: 'demo_fallback' };
}

function filterDemoSchemes(params = {}) {
  let list = [...DEMO_SCHEMES];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
  }
  if (params.category && params.category !== 'all') {
    list = list.filter(s => s.category.toLowerCase() === params.category.toLowerCase());
  }
  return { status: 'success', count: list.length, schemes: list, source: 'demo_fallback' };
}

function filterDemoChildcare(params = {}) {
  let list = [...DEMO_CHILDCARE];
  if (params.search) {
    const q = params.search.toLowerCase();
    list = list.filter(c =>
      c.name.toLowerCase().includes(q) ||
      c.address.toLowerCase().includes(q) ||
      c.services.toLowerCase().includes(q)
    );
  }
  if (params.location && params.location !== 'all') {
    const loc = params.location.toLowerCase();
    list = list.filter(c => c.location.toLowerCase().includes(loc) || c.address.toLowerCase().includes(loc));
  }
  return { status: 'success', count: list.length, centers: list, source: 'demo_fallback' };
}

// Auth Services with Mobile OTP, Email OTP, and Google Sign-in
export const authService = {
  sendOtp: async (identifier, type = 'mobile', purpose = 'verification') => {
    try {
      const res = await apiClient.post('/auth/send-otp', { identifier, type, purpose });
      return res.data;
    } catch {
      // Demo fallback: instant confirmation for Netlify or offline testing
      return {
        status: 'success',
        message: `OTP sent to ${identifier}. Use code 123456 to verify.`,
        masked_identifier: identifier,
        debug_otp: '123456',
        demo_mode: true
      };
    }
  },
  verifyOtp: async (identifier, otp, fullName = '') => {
    try {
      const res = await apiClient.post('/auth/verify-otp', {
        identifier,
        otp,
        full_name: fullName
      });
      if (res.data.token) {
        localStorage.setItem('sakhi_token', res.data.token);
        localStorage.setItem('sakhi_user', JSON.stringify(res.data.user));
        if (res.data.profile) {
          localStorage.setItem('sakhi_current_profile', JSON.stringify(res.data.profile));
        }
      }
      return res.data;
    } catch {
      // Demo fallback
      const demoUser = {
        id: Date.now(),
        mobile_number: identifier.includes('@') ? null : identifier,
        email: identifier.includes('@') ? identifier : null,
        full_name: fullName || (identifier.includes('@') ? identifier.split('@')[0] : 'Priya Sharma')
      };
      const token = 'demo-jwt-token-' + Date.now();
      localStorage.setItem('sakhi_token', token);
      localStorage.setItem('sakhi_user', JSON.stringify(demoUser));

      // Default to Priya Sharma profile if none set
      if (!localStorage.getItem('sakhi_current_profile')) {
        localStorage.setItem('sakhi_current_profile', JSON.stringify(DEMO_PROFILES[0].data));
      }

      return {
        status: 'success',
        message: 'Successfully authenticated in demo mode',
        token,
        user: demoUser
      };
    }
  },
  googleLogin: async (googleData) => {
    try {
      const res = await apiClient.post('/auth/google', googleData);
      if (res.data.token) {
        localStorage.setItem('sakhi_token', res.data.token);
        localStorage.setItem('sakhi_user', JSON.stringify(res.data.user));
        if (res.data.profile) {
          localStorage.setItem('sakhi_current_profile', JSON.stringify(res.data.profile));
        }
      }
      return res.data;
    } catch {
      const demoUser = {
        id: Date.now(),
        email: googleData.email || 'priya.sharma@gmail.com',
        full_name: googleData.name || 'Priya Sharma'
      };
      const token = 'demo-google-token-' + Date.now();
      localStorage.setItem('sakhi_token', token);
      localStorage.setItem('sakhi_user', JSON.stringify(demoUser));
      if (!localStorage.getItem('sakhi_current_profile')) {
        localStorage.setItem('sakhi_current_profile', JSON.stringify(DEMO_PROFILES[0].data));
      }
      return {
        status: 'success',
        message: 'Google login successful in demo mode',
        token,
        user: demoUser
      };
    }
  },
  logout: () => {
    localStorage.removeItem('sakhi_token');
    localStorage.removeItem('sakhi_user');
    localStorage.removeItem('sakhi_current_profile');
    localStorage.removeItem('sakhi_latest_recommendations');
  },
  getCurrentUser: () => {
    try {
      const u = localStorage.getItem('sakhi_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  },
  getCachedProfile: () => {
    try {
      const p = localStorage.getItem('sakhi_current_profile');
      return p ? JSON.parse(p) : null;
    } catch {
      return null;
    }
  },
  getMe: async () => {
    try {
      const res = await apiClient.get('/auth/me');
      return res.data;
    } catch {
      return { user: authService.getCurrentUser(), profile: authService.getCachedProfile() };
    }
  }
};

// Profile Services
export const profileService = {
  saveProfile: async (profileData) => {
    try {
      const user = authService.getCurrentUser();
      if (user?.id) {
        profileData.user_id = user.id;
      }
      const res = await apiClient.post('/profile', profileData);
      if (res.data.profile) {
        localStorage.setItem('sakhi_current_profile', JSON.stringify(res.data.profile));
      }
      return res.data;
    } catch {
      // Local fallback for static deployment
      const savedProfile = { ...profileData, id: profileData.id || Date.now() };
      localStorage.setItem('sakhi_current_profile', JSON.stringify(savedProfile));
      return {
        status: 'success',
        message: 'Profile saved successfully',
        profile: savedProfile
      };
    }
  },
  getProfile: async (id) => {
    try {
      const res = await apiClient.get(`/profile/${id}`);
      return res.data;
    } catch {
      const cached = profileService.getCachedProfile();
      return { profile: cached || DEMO_PROFILES[0].data };
    }
  },
  getCachedProfile: () => {
    try {
      const p = localStorage.getItem('sakhi_current_profile');
      return p ? JSON.parse(p) : null;
    } catch {
      return null;
    }
  }
};

// Jobs Services
export const jobService = {
  getJobs: async (params = {}) => {
    try {
      const res = await apiClient.get('/jobs', { params });
      return res.data;
    } catch {
      return filterDemoJobs(params);
    }
  },
  getJobById: async (id) => {
    try {
      const res = await apiClient.get(`/jobs/${id}`);
      return res.data;
    } catch {
      const found = DEMO_JOBS.find(j => j.id === parseInt(id, 10));
      return { job: found || DEMO_JOBS[0] };
    }
  }
};

// Courses Services
export const courseService = {
  getCourses: async (params = {}) => {
    try {
      const res = await apiClient.get('/courses', { params });
      return res.data;
    } catch {
      return filterDemoCourses(params);
    }
  },
  getCourseById: async (id) => {
    try {
      const res = await apiClient.get(`/courses/${id}`);
      return res.data;
    } catch {
      const found = DEMO_COURSES.find(c => c.id === parseInt(id, 10));
      return { course: found || DEMO_COURSES[0] };
    }
  }
};

// Schemes Services
export const schemeService = {
  getSchemes: async (params = {}) => {
    try {
      const res = await apiClient.get('/schemes', { params });
      return res.data;
    } catch {
      return filterDemoSchemes(params);
    }
  },
  getSchemeById: async (id) => {
    try {
      const res = await apiClient.get(`/schemes/${id}`);
      return res.data;
    } catch {
      const found = DEMO_SCHEMES.find(s => s.id === parseInt(id, 10));
      return { scheme: found || DEMO_SCHEMES[0] };
    }
  }
};

// Childcare Services
export const childcareService = {
  getChildcare: async (params = {}) => {
    try {
      const res = await apiClient.get('/childcare', { params });
      return res.data;
    } catch {
      return filterDemoChildcare(params);
    }
  },
  getChildcareById: async (id) => {
    try {
      const res = await apiClient.get(`/childcare/${id}`);
      return res.data;
    } catch {
      const found = DEMO_CHILDCARE.find(c => c.id === parseInt(id, 10));
      return { center: found || DEMO_CHILDCARE[0] };
    }
  }
};

// Recommendations Engine
export const recommendationService = {
  getRecommendations: async (profilePayload) => {
    try {
      const res = await apiClient.post('/recommendations', profilePayload);
      return res.data;
    } catch {
      return calculateClientRecommendations(profilePayload);
    }
  },
  getRecommendationsByProfileId: async (profileId) => {
    try {
      const res = await apiClient.get(`/recommendations/${profileId}`);
      return res.data;
    } catch {
      const cached = profileService.getCachedProfile();
      return calculateClientRecommendations(cached || DEMO_PROFILES[0].data);
    }
  }
};

export default apiClient;
