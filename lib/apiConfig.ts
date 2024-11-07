// Ensure that BASE_URL is defined, or throw an error
const apiURL = `${process.env.BASE_URL || 'http://localhost:3000'}/api`;


const API_CONFIG = {
  login: `${apiURL}/auth/login`,
  signup: `${apiURL}/auth/signup`,
  logout: `${apiURL}/auth/logout`,


  // task API's

  TaskOperations: `${apiURL}/tasks`
};


export default API_CONFIG;