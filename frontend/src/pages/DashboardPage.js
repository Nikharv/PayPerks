import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import '../css/DashboardPage.css';

function DashboardPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('available');
  const [offers, setOffers] = useState([]);
  const [claimedOffers, setClaimedOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [navigate]);

  // Separate effect for fetching claimed offers
  useEffect(() => {
    if (!user) return;

    const fetchClaimedOffers = async () => {
      try {
        const data = await api.getClaimedOffers(user.userId);
        setClaimedOffers(data);
      } catch (error) {
        console.error('Error fetching claimed offers:', error);
      }
    };

    fetchClaimedOffers();
  }, [user]);

  // Effect for fetching available offers based on search
  useEffect(() => {
    if (!user || activeTab !== 'available') return;

    const fetchAvailableOffers = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await api.searchOffers(user.userId, searchQuery);
        // Filter out claimed offers before setting the state
        const claimedOfferIds = new Set(claimedOffers.map(offer => offer.offerId));
        const availableOffers = data.filter(offer => !claimedOfferIds.has(offer.offerId));
        setOffers(availableOffers);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchAvailableOffers, 300);
    return () => clearTimeout(debounceTimer);
  }, [user, searchQuery, activeTab, claimedOffers]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleClaimOffer = async (offerId, merchantName) => {
    try {
      await api.claimOffer(user.userId, offerId);
      
      // Show success message
      setSuccessMessage(`Successfully claimed offer from ${merchantName}!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

      // Update claimed offers immediately
      const newClaimedOffers = await api.getClaimedOffers(user.userId);
      setClaimedOffers(newClaimedOffers);
      
      // Remove the claimed offer from available offers
      setOffers(prevOffers => prevOffers.filter(offer => offer.offerId !== offerId));
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredOffers = offers.filter(offer =>
    offer.merchantName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showSearchPrompt = activeTab === 'available' && !searchQuery.trim() && !isLoading;
  const showNoResults = activeTab === 'available' && searchQuery.trim() && filteredOffers.length === 0 && !isLoading;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>PayPerks Dashboard</h1>
        <div className="user-info">
          <span>Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}

      <div className="search-container">
        <input
          type="text"
          placeholder="Search offers by merchant name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'available' ? 'active' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          Available Offers
        </button>
        <button
          className={`tab-button ${activeTab === 'claimed' ? 'active' : ''}`}
          onClick={() => setActiveTab('claimed')}
        >
          Claimed Offers
        </button>
      </div>

      <div className="offers-container">
        {isLoading ? (
          <div className="loading">Loading...</div>
        ) : activeTab === 'available' ? (
          <div className="offers-list">
            {showSearchPrompt ? (
              <div className="search-prompt">
                <p>Enter a merchant name to search for available offers</p>
                <p className="search-tip">Example: Try searching for "Merchant_520" or "Merchant_91"</p>
              </div>
            ) : showNoResults ? (
              <p className="no-offers">No offers found for "{searchQuery}"</p>
            ) : searchQuery.trim() && (
              filteredOffers.map(offer => (
                <div key={offer.offerId} className="offer-card">
                  <h3>{offer.merchantName}</h3>
                  <p>{offer.offerDescription}</p>
                  <p className="card-name">Card: {offer.cardName}</p>
                  <button 
                    className="claim-button"
                    onClick={() => handleClaimOffer(offer.offerId, offer.merchantName)}
                  >
                    Claim Offer
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="offers-list">
            {claimedOffers.length > 0 ? (
              claimedOffers.map(offer => (
                <div key={offer.offerId} className="offer-card claimed">
                  <h3>{offer.merchantName}</h3>
                  <p>{offer.offerDescription}</p>
                  <p className="card-name">Card: {offer.cardName}</p>
                  <p className="claimed-date">
                    Claimed: {new Date(offer.claimedDate).toLocaleDateString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="no-offers">No claimed offers</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage; 