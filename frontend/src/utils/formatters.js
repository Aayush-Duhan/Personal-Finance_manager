import axios from 'axios';
import config from './config';

let userCurrency = 'USD'; // Default currency

const axiosConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false
};

export const fetchUserPreferences = async (userId) => {
  try {
    const response = await axios.get(
      `${config.apiEndpoint.replace('/transactions', '')}/profile`,
      {
        ...axiosConfig,
        headers: {
          ...axiosConfig.headers,
          'Authorization': userId
        }
      }
    );

    if (response.data.statusCode === 200) {
      const profileData = typeof response.data.body === 'string' 
        ? JSON.parse(response.data.body) 
        : response.data.body;
      
      userCurrency = profileData.currency || 'USD';
    }
  } catch (error) {
    console.error('Error fetching user preferences:', error);
  }
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: userCurrency
  }).format(amount);
};

export const getUserCurrency = () => userCurrency; 