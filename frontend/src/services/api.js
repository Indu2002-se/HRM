const API_BASE_URL = 'http://localhost:8000/api';

const getToken = () => localStorage.getItem('token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const authAPI = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
};

export const profileAPI = {
  getProfile: () => request('/profile'),
};

export const attendanceAPI = {
  getAttendances: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/attendances?${queryString}`);
  },
  checkIn: () => request('/attendances', { method: 'POST' }),
  checkOut: (id) => request(`/attendances/${id}`, { method: 'PUT' }),
  getStats: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return request(`/attendances/stats${params.toString() ? '?' + params.toString() : ''}`);
  },
  getTodayStatus: () => request('/attendances/today-status'),
  getMonthlyChart: (month, year) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    if (year) params.append('year', year);
    return request(`/attendances/monthly-chart${params.toString() ? '?' + params.toString() : ''}`);
  },
};

export const leaveAPI = {
  getLeaves: (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return request(`/leaves?${queryString}`);
  },
  createLeave: (data) => request('/leaves', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getBalance: () => request('/leaves/balance'),
};

export const faceAPI = {
  getStatus: () => request('/face/status'),
  enroll: (descriptor) => request('/face/enroll', {
    method: 'POST',
    body: JSON.stringify({ face_descriptor: descriptor }),
  }),
  verify: (action, descriptor, attendanceId = null) => {
    const payload = {
      action,
      face_descriptor: descriptor,
    };
    if (attendanceId) {
      payload.attendance_id = attendanceId;
    }
    return request('/attendances/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};

export default { authAPI, profileAPI, attendanceAPI, leaveAPI, faceAPI };
