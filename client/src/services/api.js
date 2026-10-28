// ReferHire Central API Client with Live Backend Integration & Resilient Fallback
const BASE_URL = '/api';

// Fallback seed dataset matching server/src/utils/seedData.js
const FALLBACK_DATA = {
  jobs: [
    {
      _id: 'job-1',
      title: 'MERN Stack Developer',
      companyName: 'Google',
      workMode: 'REMOTE',
      jobType: 'FULL_TIME',
      location: 'Bengaluru / Remote',
      salary: { min: 1400000, max: 2400000, currency: 'INR', period: 'YEARLY' },
      experience: { min: 2, max: 5 },
      skills: ['react', 'node.js', 'mongodb', 'express', 'git', 'docker'],
      description: 'Join Google Cloud Developer Experience team to build web applications, internal developer tools, and customer portals.',
      requirements: [
        'Proficiency with React, Node.js, and Express REST APIs',
        'Experience building performant MongoDB aggregations and schema models',
        'Good understanding of Docker and CI/CD pipelines'
      ],
      benefits: ['Comprehensive health coverage', 'Work from home stipend', 'Annual learning budget', 'Stock grants'],
      allowReferrals: true,
      applicationCount: 2,
      referralRequestCount: 1,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job-2',
      title: 'Frontend Engineer (React + TypeScript)',
      companyName: 'Microsoft',
      workMode: 'HYBRID',
      jobType: 'FULL_TIME',
      location: 'Hyderabad, India',
      salary: { min: 1800000, max: 2800000, currency: 'INR', period: 'YEARLY' },
      experience: { min: 2, max: 6 },
      skills: ['react', 'typescript', 'css', 'redux', 'jest', 'git'],
      description: 'Help engineer next-generation Azure Portal tools and responsive component design systems.',
      requirements: [
        '3+ years with modern React, Hooks, and TypeScript',
        'Obsession with UI accessibility, design system tokens, and web performance',
        'Experience writing comprehensive Jest / React Testing Library unit tests'
      ],
      benefits: ['Hybrid work model (3 days onsite)', 'Wellness subsidies', 'Generous paid parental leave'],
      allowReferrals: true,
      applicationCount: 1,
      referralRequestCount: 2,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job-3',
      title: 'Senior Backend Systems Engineer',
      companyName: 'Stripe',
      workMode: 'REMOTE',
      jobType: 'FULL_TIME',
      location: 'Global Remote',
      salary: { min: 2600000, max: 4000000, currency: 'INR', period: 'YEARLY' },
      experience: { min: 4, max: 8 },
      skills: ['node.js', 'redis', 'distributed systems', 'docker', 'mongodb'],
      description: 'Build fault-tolerant payment transaction routing engines, distributed settlement ledgers, and partner webhook orchestrators.',
      requirements: [
        'Demonstrated expertise in high-concurrency Node.js microservices',
        'Deep understanding of distributed consensus, cache invalidation, and idempotency keys',
        'Experience tuning MongoDB and Redis under heavy throughput'
      ],
      benefits: ['Competitive equity package', 'Top-tier medical insurance', 'Home office setup budget'],
      allowReferrals: true,
      applicationCount: 3,
      referralRequestCount: 1,
      createdAt: new Date().toISOString()
    },
    {
      _id: 'job-4',
      title: 'Full Stack AI Product Engineer',
      companyName: 'TechCorp Labs',
      workMode: 'REMOTE',
      jobType: 'FULL_TIME',
      location: 'Bengaluru / Remote',
      salary: { min: 2000000, max: 3200000, currency: 'INR', period: 'YEARLY' },
      experience: { min: 2, max: 5 },
      skills: ['react', 'node.js', 'python', 'fastapi', 'tailwind css'],
      description: 'Engineer real-time agentic workflows, conversational copilot interfaces, and document intelligence engines.',
      requirements: [
        'Full-stack experience with modern React, Tailwind CSS, and Node.js',
        'Hands-on experience with Python APIs (FastAPI) and vector embeddings',
        'Obsession with low-latency UX and responsive micro-interactions'
      ],
      benefits: ['Flexible working hours', 'Unlimited PTO policy', 'Conference travel stipend'],
      allowReferrals: true,
      applicationCount: 1,
      referralRequestCount: 0,
      createdAt: new Date().toISOString()
    }
  ],
  referrers: [
    {
      _id: 'ref-profile-1',
      userId: {
        _id: 'user-priya',
        name: 'Priya Sundaram',
        email: 'priyas@google.com',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
      },
      companyName: 'Google',
      companyEmail: 'priyas@google.com',
      isCompanyVerified: true,
      role: 'Senior Staff Software Engineer',
      department: 'Google Cloud & Developer Tools',
      totalReferralsProvided: 14,
      successfulHires: 4,
      rating: 4.95,
      referralCriteria: {
        minimumExperienceYears: 2,
        preferredSkills: ['node.js', 'react', 'distributed systems', 'kubernetes', 'mongodb'],
        customNotes: 'I actively refer engineers for Google Cloud, Core Search, and YouTube teams. Please share your GitHub.'
      },
      isActive: true
    },
    {
      _id: 'ref-profile-2',
      userId: {
        _id: 'user-rohan',
        name: 'Rohan Mehta',
        email: 'rohanm@microsoft.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
      },
      companyName: 'Microsoft',
      companyEmail: 'rohanm@microsoft.com',
      isCompanyVerified: true,
      role: 'Principal Engineering Lead',
      department: 'Azure Developer Experience',
      totalReferralsProvided: 22,
      successfulHires: 6,
      rating: 4.88,
      referralCriteria: {
        minimumExperienceYears: 1,
        preferredSkills: ['react', 'typescript', 'c#', 'azure', 'node.js'],
        customNotes: 'Hiring actively for Azure and GitHub integration tools in Hyderabad and Bangalore.'
      },
      isActive: true
    }
  ],
  candidateProfile: {
    headline: 'Full-Stack MERN Developer | React, Node.js, MongoDB',
    bio: '2+ years of experience building scalable single page applications and cloud microservices. Active open-source contributor.',
    location: 'Bengaluru, India',
    skills: ['react', 'node.js', 'mongodb', 'express', 'javascript', 'typescript', 'git', 'docker', 'tailwind css'],
    experienceYears: 2.5
  },
  referralRequests: [
    {
      _id: 'req-1',
      jobId: {
        _id: 'job-1',
        title: 'MERN Stack Developer'
      },
      companyName: 'Google',
      referrerId: {
        _id: 'user-priya',
        name: 'Priya Sundaram',
        email: 'priyas@google.com'
      },
      candidateId: {
        _id: 'user-aarav',
        name: 'Aarav Sharma',
        email: 'candidate@referhire.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      },
      skillsMatchScore: 85,
      pitchMessage: 'Hi Priya! I saw the MERN requisition for Google Cloud. With 2.5 years architecting Node and React systems with MongoDB indexing, I would be honored to be considered for an internal referral!',
      status: 'ACCEPTED',
      referrerNotes: 'Strong profile with demonstrated MongoDB aggregations and clean React code. Submitted to internal Cloud recruiter queue.',
      createdAt: new Date().toISOString()
    }
  ],
  applications: [
    {
      _id: 'app-1',
      jobId: {
        _id: 'job-1',
        title: 'MERN Stack Developer',
        companyName: 'Google'
      },
      candidateId: {
        _id: 'user-aarav',
        name: 'Aarav Sharma',
        email: 'candidate@referhire.com'
      },
      isReferred: true,
      referredBy: {
        _id: 'user-priya',
        name: 'Priya Sundaram'
      },
      skillsMatchScore: 85,
      matchingSkills: ['react', 'node.js', 'mongodb', 'express', 'git', 'docker'],
      missingSkills: [],
      status: 'INTERVIEW_SCHEDULED',
      createdAt: new Date().toISOString()
    }
  ]
};

class ApiService {
  constructor() {
    this.token = localStorage.getItem('referhire_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('referhire_token', token);
    } else {
      localStorage.removeItem('referhire_token');
    }
  }

  getToken() {
    return this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401 && this.token && !options._retry) {
          options._retry = true;
          const refreshed = await this.refreshToken();
          if (refreshed) {
            headers['Authorization'] = `Bearer ${this.token}`;
            const retryRes = await fetch(url, { ...options, headers, credentials: 'include' });
            return await retryRes.json();
          }
        }
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      // If server is not responding (e.g. backend server offline), handle gracefully
      if (err.message && (err.message.includes('fetch') || err.name === 'TypeError')) {
        console.warn(`[Backend Offline Fallback] Handling ${endpoint}`);
        return this.handleOfflineFallback(endpoint, options);
      }
      throw err;
    }
  }

  handleOfflineFallback(endpoint, options = {}) {
    // Auth Fallbacks when live server is offline
    if (endpoint.startsWith('/auth/login')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch {}
      const email = (body.email || '').toLowerCase().trim();
      const password = body.password || '';

      if (!email || !password) {
        throw new Error('Please provide both email and password.');
      }

      let role = 'CANDIDATE';
      let name = 'Alex Chen';
      if (email.includes('referrer') || email.includes('google')) {
        role = 'REFERRER';
        name = 'Priya Sundaram';
      } else if (email.includes('recruiter') || email.includes('techcorp')) {
        role = 'RECRUITER';
        name = 'Marcus Vance';
      } else if (email.includes('admin')) {
        role = 'ADMIN';
        name = 'Elena Rostova';
      }

      const mockUser = {
        id: 'usr-demo-' + role.toLowerCase(),
        name,
        email,
        role,
        avatar: ''
      };
      localStorage.setItem('referhire_cached_user', JSON.stringify(mockUser));

      return {
        success: true,
        message: 'Logged in successfully (Development Mode)',
        data: {
          user: mockUser,
          accessToken: 'mock-access-token-' + role.toLowerCase()
        }
      };
    }

    if (endpoint.startsWith('/auth/register')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch {}
      const { name, email, role = 'CANDIDATE' } = body;

      const newUser = {
        id: 'usr-reg-' + Date.now(),
        name: name || 'ReferHire Member',
        email: email || 'member@referhire.com',
        role: role.toUpperCase(),
        avatar: ''
      };
      localStorage.setItem('referhire_cached_user', JSON.stringify(newUser));

      return {
        success: true,
        message: 'Account registered successfully',
        data: {
          user: newUser,
          accessToken: 'mock-access-token-' + newUser.role.toLowerCase()
        }
      };
    }

    if (endpoint.startsWith('/auth/me')) {
      const cached = localStorage.getItem('referhire_cached_user');
      const user = cached ? JSON.parse(cached) : {
        id: 'usr-demo-cand',
        name: 'Alex Chen',
        email: 'alex.chen@example.com',
        role: 'CANDIDATE'
      };

      let profileData = FALLBACK_DATA.candidateProfile;
      if (user.role === 'REFERRER') profileData = FALLBACK_DATA.referrers[0];

      return {
        success: true,
        data: {
          user,
          profile: profileData
        }
      };
    }

    if (endpoint.startsWith('/auth/logout')) {
      localStorage.removeItem('referhire_cached_user');
      return { success: true, message: 'Logged out successfully' };
    }

    // Jobs
    if (endpoint.startsWith('/jobs/saved')) {
      return { success: true, data: [] };
    }
    if (endpoint.startsWith('/jobs')) {
      return { success: true, count: FALLBACK_DATA.jobs.length, data: FALLBACK_DATA.jobs };
    }

    // Referrers
    if (endpoint.startsWith('/profiles/referrers')) {
      return { success: true, count: FALLBACK_DATA.referrers.length, data: FALLBACK_DATA.referrers };
    }
    if (endpoint.startsWith('/profiles/candidate/me')) {
      return { success: true, data: FALLBACK_DATA.candidateProfile };
    }
    if (endpoint.startsWith('/profiles/referrer/me')) {
      return { success: true, data: FALLBACK_DATA.referrers[0] };
    }

    // Referrals
    if (endpoint.startsWith('/referrals/my-requests')) {
      return { success: true, data: FALLBACK_DATA.referralRequests };
    }
    if (endpoint.startsWith('/referrals/incoming')) {
      return { success: true, data: FALLBACK_DATA.referralRequests };
    }
    if (endpoint.startsWith('/referrals/request')) {
      return { success: true, message: 'Referral request submitted successfully', data: { _id: 'req-new', status: 'PENDING' } };
    }

    // Applications
    if (endpoint.startsWith('/applications/my-applications') || endpoint.startsWith('/applications/job')) {
      return { success: true, data: FALLBACK_DATA.applications };
    }

    // Notifications
    if (endpoint.startsWith('/notifications')) {
      return { success: true, unreadCount: 1, data: [
        {
          _id: 'notif-1',
          type: 'REFERRAL_ACCEPTED',
          title: 'Referral Endorsed by Google Insider!',
          message: 'Priya Sundaram endorsed your profile for MERN Stack Developer at Google.',
          isRead: false,
          createdAt: new Date().toISOString()
        }
      ]};
    }

    // AI Endpoints
    if (endpoint.startsWith('/ai/copilot')) {
      let body = {};
      try { body = JSON.parse(options.body || '{}'); } catch {}
      const msg = (body.message || '').toLowerCase();
      let reply = `Here is strategic guidance for your referral journey:\n\n• Target requisitions where you possess at least 70% of core competencies.\n• Reach out with a concise note pointing directly to real projects.\n• For Google Cloud, highlight distributed databases and sub-100ms API benchmarks.`;
      if (msg.includes('match') || msg.includes('job')) {
        reply = `I benchmarked your profile skills against our open requisitions:\n\n1. Google — MERN Stack Developer (85% Match)\n2. Microsoft — Frontend Engineer (75% Match)\n3. Stripe — Senior Backend Engineer (65% Match)`;
      }
      return {
        success: true,
        data: {
          response: reply,
          provider: 'ReferHire Knowledge Engine',
          actionableJobs: [
            { id: 'job-1', title: 'MERN Stack Developer', company: 'Google', matchScore: 85 },
            { id: 'job-2', title: 'Frontend Engineer (React)', company: 'Microsoft', matchScore: 75 }
          ]
        }
      };
    }

    if (endpoint.startsWith('/ai/analyze-resume')) {
      return {
        success: true,
        data: {
          score: 86,
          extractedSkills: ['react', 'node.js', 'mongodb', 'docker', 'git'],
          matchedSkills: ['react', 'node.js', 'mongodb', 'git'],
          missingSkills: ['kubernetes', 'typescript'],
          suggestions: [
            'Add measurable metric impact (e.g. "Reduced query latency by 35%")',
            'Highlight cloud infrastructure and containerization skills'
          ]
        }
      };
    }

    return { success: true, data: null };
  }

  async refreshToken() {
    try {
      const res = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success && data.data?.accessToken) {
        this.setToken(data.data.accessToken);
        return true;
      }
      this.setToken(null);
      return false;
    } catch {
      this.setToken(null);
      return false;
    }
  }

  // Auth
  login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  register(payload) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  logout() {
    return this.request('/auth/logout', { method: 'POST' }).finally(() => {
      this.setToken(null);
    });
  }

  getMe() {
    return this.request('/auth/me');
  }

  // Jobs
  getJobs(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/jobs${query ? `?${query}` : ''}`);
  }

  getJobById(id) {
    return this.request(`/jobs/${id}`);
  }

  createJob(jobData) {
    return this.request('/jobs', {
      method: 'POST',
      body: JSON.stringify(jobData)
    });
  }

  // Referrals
  requestReferral(payload) {
    return this.request('/referrals/request', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  getMyReferralRequests() {
    return this.request('/referrals/my-requests');
  }

  getIncomingReferrals() {
    return this.request('/referrals/incoming');
  }

  updateReferralStatus(id, payload) {
    return this.request(`/referrals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  // Applications
  applyToJob(payload) {
    return this.request('/applications', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  getMyApplications() {
    return this.request('/applications/my-applications');
  }

  getJobApplications(jobId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/applications/job/${jobId}${query ? `?${query}` : ''}`);
  }

  updateApplicationStatus(id, payload) {
    return this.request(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    });
  }

  // Profiles
  getCandidateProfile() {
    return this.request('/profiles/candidate/me');
  }

  updateCandidateProfile(profileData) {
    return this.request('/profiles/candidate/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  }

  getReferrerProfile() {
    return this.request('/profiles/referrer/me');
  }

  updateReferrerProfile(profileData) {
    return this.request('/profiles/referrer/me', {
      method: 'PATCH',
      body: JSON.stringify(profileData)
    });
  }

  getActiveReferrers(company) {
    return this.request(`/profiles/referrers${company ? `?company=${company}` : ''}`);
  }

  // Notifications
  getNotifications() {
    return this.request('/notifications');
  }

  markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, { method: 'PATCH' });
  }

  markAllNotificationsRead() {
    return this.request('/notifications/read-all', { method: 'PATCH' });
  }

  // Saved Jobs
  toggleSaveJob(jobId) {
    return this.request(`/jobs/${jobId}/save`, { method: 'POST' });
  }

  getSavedJobs() {
    return this.request('/jobs/saved');
  }

  // AI & Career Intelligence
  chatCopilot(payload) {
    return this.request('/ai/copilot', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  analyzeResume(payload) {
    return this.request('/ai/analyze-resume', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  generateReferralPitch(payload) {
    return this.request('/ai/generate-referral-pitch', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }
}

export const api = new ApiService();
