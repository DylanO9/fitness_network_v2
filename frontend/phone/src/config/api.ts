// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://vc:3000'  // Development URL - use your computer's IP
  : 'https://your-production-url.com'; // Production URL

export const API_ENDPOINTS = {
  register: `${API_BASE_URL}/users/register`,
  login: `${API_BASE_URL}/users/login`,
  // Add other endpoints here
};

export default API_ENDPOINTS; 