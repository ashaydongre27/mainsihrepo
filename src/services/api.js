/**
 * API client for The Nexus Flask Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

export async function apiRequest(endpoint, method = 'GET', body = null) {
  try {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('nexus_token');
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`API error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.warn(`[Nexus API] Error on ${endpoint}:`, err);
    return null; // Return null so callers can use smart local fallback
  }
}

// Authentication
export const loginApi = (email, password, role) => 
  apiRequest('/auth/login', 'POST', { email, password, role });

export const registerApi = (userData) => 
  apiRequest('/auth/register', 'POST', userData);

export const getDemoUsersApi = () => 
  apiRequest('/auth/demo-users', 'GET');

// AI Resume Analyzer
export const analyzeResumeApi = (resumeText, targetRole) => 
  apiRequest('/resume/analyze', 'POST', { resumeText, targetRole });

// Interactive Career Roadmap
export const getRoadmapApi = () => 
  apiRequest('/roadmap/get', 'GET');

export const toggleTaskApi = (milestoneId, taskId) => 
  apiRequest('/roadmap/toggle-task', 'POST', { milestoneId, taskId });

export const checkInRoadmapApi = () => 
  apiRequest('/roadmap/check-in', 'POST');

// Zulu Chatbot
export const zuluChatApi = (message) => 
  apiRequest('/zulu/chat', 'POST', { message });

// Academy Modules
export const getAcademyDataApi = () => 
  apiRequest('/academy/all-data', 'GET');

// Industry Modules
export const getIndustryDataApi = () => 
  apiRequest('/industry/all-data', 'GET');

export const postOpportunityApi = (oppData) => 
  apiRequest('/industry/post-opportunity', 'POST', oppData);

export const submitSkillDemandApi = (demandData) => 
  apiRequest('/industry/submit-skill-demand', 'POST', demandData);
