const API_BASE_URL = 'http://localhost:8080';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

const defaultOptions = {
  credentials: 'include',
  headers: defaultHeaders,
};

export const api = {
  // Auth endpoints
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Card endpoints
  getCards: async () => {
    console.log('Making request to:', `${API_BASE_URL}/cards-data`);
    const response = await fetch(`${API_BASE_URL}/cards-data`, {
      ...defaultOptions,
      method: 'GET',
    });
    const data = await handleResponse(response);
    console.log('API Response:', data);
    return data;
  },

  addUserCards: async (userId, cardIds) => {
    const response = await fetch(`${API_BASE_URL}/user-cards`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify({ userId, cardIds }),
    });
    return handleResponse(response);
  },

  getUserCards: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/user-cards/${userId}`, {
      ...defaultOptions,
      method: 'GET',
    });
    return handleResponse(response);
  },

  // Offer endpoints
  searchOffers: async (userId, merchant) => {
    const params = new URLSearchParams({ userId });
    if (merchant) params.append('merchant', merchant);
    
    const response = await fetch(`${API_BASE_URL}/offers/search?${params}`, {
      ...defaultOptions,
      method: 'GET',
    });
    return handleResponse(response);
  },

  getClaimedOffers: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/offers/claimed?userId=${userId}`, {
      ...defaultOptions,
      method: 'GET',
    });
    return handleResponse(response);
  },

  claimOffer: async (userId, offerId) => {
    const response = await fetch(`${API_BASE_URL}/offers/claim`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify({ userId, offerId }),
    });
    return handleResponse(response);
  },

  setupCards: async (cards) => {
    const response = await fetch(`${API_BASE_URL}/cards/setup`, {
      ...defaultOptions,
      method: 'POST',
      body: JSON.stringify({ cards }),
    });
    return handleResponse(response);
  },
}; 