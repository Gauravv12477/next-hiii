// Ensure that BASE_URL is defined, or throw an error
const apiURL = `${process.env.BASE_URL + '/api' || 'http://localhost:3000'}/api`;


const API_CONFIG = {
  login: `${apiURL}/auth/login`,
  signup: `${apiURL}/auth/signup`,
  Logout: `${apiURL}/auth/logout`,
};


export default API_CONFIG;