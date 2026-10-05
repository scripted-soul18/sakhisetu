import axios from 'axios';

// The base API URL defaults to /api which Vite proxies to backend in dev
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Interceptor to attach auth token
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

// Interceptor for friendly error messages
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Unable to connect to the server. Please check if the backend is running.';
    if (error.response) {
      message = error.response.data?.error || error.response.data?.message || `Server responded with error (${error.response.status})`;
    } else if (error.request) {
      message = 'Backend server did not respond. Please make sure the Flask backend is started on port 5000.';
    }
    return Promise.reject(new Error(message));
  }
);

// Auth Services with Mobile OTP, Email OTP, and Google Sign-in
export const authService = {
  sendOtp: async (identifier, type = 'mobile', purpose = 'verification') => {
    const res = await apiClient.post('/auth/send-otp', { identifier, type, purpose });
    return res.data;
  },
  verifyOtp: async (identifier, otp, fullName = '') => {
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
  },
  googleLogin: async (googleData) => {
    const res = await apiClient.post('/auth/google', googleData);
    if (res.data.token) {
      localStorage.setItem('sakhi_token', res.data.token);
      localStorage.setItem('sakhi_user', JSON.stringify(res.data.user));
      if (res.data.profile) {
        localStorage.setItem('sakhi_current_profile', JSON.stringify(res.data.profile));
      }
    }
    return res.data;
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
    const res = await apiClient.get('/auth/me');
    return res.data;
  }
};

// Profile Services
export const profileService = {
  saveProfile: async (profileData) => {
    const user = authService.getCurrentUser();
    if (user?.id) {
      profileData.user_id = user.id;
    }
    const res = await apiClient.post('/profile', profileData);
    if (res.data.profile) {
      localStorage.setItem('sakhi_current_profile', JSON.stringify(res.data.profile));
    }
    return res.data;
  },
  getProfile: async (id) => {
    const res = await apiClient.get(`/profile/${id}`);
    return res.data;
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
    const res = await apiClient.get('/jobs', { params });
    return res.data;
  },
  getJobById: async (id) => {
    const res = await apiClient.get(`/jobs/${id}`);
    return res.data;
  }
};

// Courses Services
export const courseService = {
  getCourses: async (params = {}) => {
    const res = await apiClient.get('/courses', { params });
    return res.data;
  },
  getCourseById: async (id) => {
    const res = await apiClient.get(`/courses/${id}`);
    return res.data;
  }
};

// Schemes Services
export const schemeService = {
  getSchemes: async (params = {}) => {
    const res = await apiClient.get('/schemes', { params });
    return res.data;
  },
  getSchemeById: async (id) => {
    const res = await apiClient.get(`/schemes/${id}`);
    return res.data;
  }
};

// Childcare Services
export const childcareService = {
  getChildcare: async (params = {}) => {
    const res = await apiClient.get('/childcare', { params });
    return res.data;
  },
  getChildcareById: async (id) => {
    const res = await apiClient.get(`/childcare/${id}`);
    return res.data;
  }
};

// Recommendations Engine
export const recommendationService = {
  getRecommendations: async (profilePayload) => {
    const res = await apiClient.post('/recommendations', profilePayload);
    return res.data;
  },
  getRecommendationsByProfileId: async (profileId) => {
    const res = await apiClient.get(`/recommendations/${profileId}`);
    return res.data;
  }
};

export default apiClient;
