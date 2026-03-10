// src/services/api.js

const API_BASE_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const getFormHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Auth Service
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) throw new Error('Login failed');
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return { userId: data.user.id, role: data.user.role };
};

export const register = async (email, password, name, extraData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, ...extraData }),
  });
  if (!response.ok) throw new Error('Registration failed');
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data.user;
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!response.ok) {
      if(response.status === 401 || response.status === 403) {
         localStorage.removeItem('token');
      }
      return null;
    }
    const profile = await response.json();
    return { account: { $id: profile.id, email: profile.email, name: profile.name }, profile };
  } catch (error) {
    console.error('Failed to fetch user:', error);
    return null;
  }
};

export const logout = async () => {
  localStorage.removeItem('token');
  return true;
};

// Storage Service
export const uploadIdCard = async (file) => {
  const formData = new FormData();
  formData.append('idCard', file);

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: getFormHeaders(),
    body: formData,
  });
  if (!response.ok) throw new Error('Upload failed');
  
  const data = await response.json();
  // Transform path to full URL so frontend can display
  return { $id: 'file-' + Date.now(), url: `http://localhost:5000${data.url}` };
};

export const updateUserVerification = async (userId, fileId, fileUrl) => {
  // If uploadIdCard returned url, we pass it here
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ fileUrl }),
  });
  if (!response.ok) throw new Error('Failed to update verification');
  return true;
};

// Mentor actions
export const getPendingVerifications = async () => {
  const response = await fetch(`${API_BASE_URL}/admin/verifications`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch verifications');
  const users = await response.json();
  
  // Transform users backend structure to match frontend expectations ($id, fullName, idCardUrl)
  return users.map(user => ({
    $id: user.id,
    userId: user.id,
    fullName: user.name,
    regNo: user.regNo,
    department: user.department,
    verificationStatus: user.verificationStatus,
    idCardUrl: user.idCardUrl ? (user.idCardUrl.startsWith('http') ? user.idCardUrl : `http://localhost:5000${user.idCardUrl}`) : 'https://via.placeholder.com/300x200?text=No+ID+Card',
  }));
};

export const reviewVerification = async (userId, status) => {
  const response = await fetch(`${API_BASE_URL}/admin/verify/${userId}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error('Failed to review verification');
  return true;
};

// Test / Database
export const getFullTest = async (testId) => {
  const response = await fetch(`${API_BASE_URL}/tests/${testId}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch test details');
  return await response.json();
};

export const getAllQuestions = async () => {
  const response = await fetch(`${API_BASE_URL}/questions`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch questions');
  return await response.json();
};

export const saveTestResult = async (data) => {
  const response = await fetch(`${API_BASE_URL}/tests`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to save test result');
  const savedTest = await response.json();
  return { ...savedTest, $id: savedTest.id };
};

export const getTestResults = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/tests`, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch test results');
  const tests = await response.json();
  return tests.map(test => ({ ...test, $id: test.id }));
};
