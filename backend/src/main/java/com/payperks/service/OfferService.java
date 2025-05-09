package com.payperks.service;

import com.payperks.dao.OfferDAO;
import com.payperks.model.Offer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OfferService {
    
    @Autowired
    private OfferDAO offerDAO;

    public List<Offer> searchOffers(Integer userId, String merchant) {
        return offerDAO.searchOffers(userId, merchant);
    }

    public List<Offer> getClaimedOffers(Integer userId) {
        return offerDAO.getClaimedOffers(userId);
    }

    public boolean claimOffer(Integer userId, Integer offerId) {
        // Check if offer is already claimed
        if (offerDAO.isOfferClaimed(userId, offerId)) {
            return false;
        }
        return offerDAO.claimOffer(userId, offerId);
    }
} 