import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/SetupPage.css';

const SetupPage = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([{ bankName: '', cardType: '', cardName: '' }]);
  const [availableCardsMap, setAvailableCardsMap] = useState({});
  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get unique bank names from the database
  const bankNames = [
    'Chase', 'Bank of America', 'American Express', 'Citi',
    'Capital One', 'Wells Fargo', 'Discover', 'TD Bank',
    'U.S. Bank', 'PNC', 'HSBC', 'Barclays', 'Ally Bank', 'Synchrony'
  ];

  const cardTypes = ['credit', 'debit'];

  // Fetch available cards for a specific index
  const fetchAvailableCards = async (bankName, cardType, index) => {
    if (!bankName || !cardType) {
      setAvailableCardsMap(prev => ({
        ...prev,
        [index]: []
      }));
      return;
    }
    
    try {
      console.log('Fetching cards for:', { bankName, cardType, index });
      const url = `http://localhost:8080/cards-data?bank=${encodeURIComponent(bankName)}&type=${encodeURIComponent(cardType)}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch cards: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Fetched cards for index', index, ':', data);
      
      if (Array.isArray(data)) {
        setAvailableCardsMap(prev => ({
          ...prev,
          [index]: data
        }));
      } else {
        console.error('Invalid response format:', data);
        setAvailableCardsMap(prev => ({
          ...prev,
          [index]: []
        }));
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
      setAvailableCardsMap(prev => ({
        ...prev,
        [index]: []
      }));
    }
  };

  const handleInputChange = (index, field, value) => {
    const newCards = [...cards];
    newCards[index] = {
      ...newCards[index],
      [field]: value,
      // Reset cardName when bank or type changes
      ...(field !== 'cardName' && { cardName: '' })
    };
    setCards(newCards);
    clearError(index);

    // Fetch available cards when bank or type changes
    if ((field === 'bankName' || field === 'cardType') && newCards[index].bankName && newCards[index].cardType) {
      fetchAvailableCards(newCards[index].bankName, newCards[index].cardType, index);
    }
  };

  const addCard = () => {
    setCards([...cards, { bankName: '', cardType: '', cardName: '' }]);
  };

  const removeCard = (index) => {
    if (cards.length > 1) {
      const newCards = cards.filter((_, i) => i !== index);
      setCards(newCards);
      
      // Remove available cards for the removed index
      setAvailableCardsMap(prev => {
        const newMap = { ...prev };
        delete newMap[index];
        // Reindex the remaining cards
        Object.keys(newMap)
          .filter(key => parseInt(key) > index)
          .forEach(key => {
            newMap[parseInt(key) - 1] = newMap[key];
            delete newMap[key];
          });
        return newMap;
      });
      
      clearError(index);
    }
  };

  const clearError = (index) => {
    const newErrors = [...errors];
    newErrors[index] = null;
    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = cards.map(card => {
      if (!card.bankName) return 'Please select a bank';
      if (!card.cardType) return 'Please select a card type';
      if (!card.cardName) return 'Please select a card';
      return null;
    });

    setErrors(newErrors);
    return !newErrors.some(error => error !== null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Get the user ID from localStorage
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.userId) {
        throw new Error('User not found. Please log in again.');
      }

      // Find cardIds for each selected card
      const cardIds = cards.map((card, index) => {
        const matchingCard = availableCardsMap[index]?.find(ac => ac.cardName === card.cardName);
        if (!matchingCard) {
          throw new Error(`Could not find card ID for ${card.cardName}`);
        }
        return matchingCard.cardId;
      });

      const response = await fetch('http://localhost:8080/user-cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          cardIds: cardIds
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to save cards: ${errorData}`);
      }

      // Handle successful submission
      console.log('Cards saved successfully');
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving cards:', error);
      setErrors(['Failed to save cards: ' + error.message]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="setup-container">
      <div className="setup-content">
        <h1>Welcome to PayPerks</h1>
        <p className="setup-subtitle">Let's add your cards to get started</p>

        <form onSubmit={handleSubmit} className="setup-form">
          {cards.map((card, index) => (
            <div key={index} className="card-entry">
              <div className="card-header">
                <h3>Card {index + 1}</h3>
                {cards.length > 1 && (
                  <button
                    type="button"
                    className="remove-card-btn"
                    onClick={() => removeCard(index)}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="form-group">
                <label htmlFor={`bank-${index}`}>Bank Name</label>
                <select
                  id={`bank-${index}`}
                  value={card.bankName}
                  onChange={(e) => handleInputChange(index, 'bankName', e.target.value)}
                  className={errors[index] && !card.bankName ? 'error' : ''}
                >
                  <option value="">Select Bank</option>
                  {bankNames.map(bank => (
                    <option key={bank} value={bank}>{bank}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor={`type-${index}`}>Card Type</label>
                <select
                  id={`type-${index}`}
                  value={card.cardType}
                  onChange={(e) => handleInputChange(index, 'cardType', e.target.value)}
                  className={errors[index] && !card.cardType ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {cardTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor={`card-${index}`}>Card Name</label>
                <select
                  id={`card-${index}`}
                  value={card.cardName}
                  onChange={(e) => handleInputChange(index, 'cardName', e.target.value)}
                  className={errors[index] && !card.cardName ? 'error' : ''}
                  disabled={!card.bankName || !card.cardType}
                >
                  <option value="">Select Card</option>
                  {[...new Map((availableCardsMap[index] || []).map(card => [card.cardName, card])).values()].map(availableCard => (
                    <option key={availableCard.cardId} value={availableCard.cardName}>
                      {availableCard.cardName}
                    </option>
                  ))}
                </select>
              </div>

              {errors[index] && (
                <span className="error-message">{errors[index]}</span>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-card-btn"
            onClick={addCard}
          >
            + Add Another Card
          </button>

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Finish Setup'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupPage; 