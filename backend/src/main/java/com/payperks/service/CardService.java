package com.payperks.service;

import com.payperks.dao.CardDAO;
import com.payperks.model.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CardService {
    
    @Autowired
    private CardDAO cardDAO;

    public List<Card> findCards(String bank, String type) {
        return cardDAO.findCards(bank, type);
    }

    public void addUserCards(Integer userId, List<Integer> cardIds) {
        // Validate user and cards before adding
        cardDAO.addUserCards(userId, cardIds);
    }

    public List<Integer> getUserCardIds(Integer userId) {
        return cardDAO.getUserCardIds(userId);
    }
} 