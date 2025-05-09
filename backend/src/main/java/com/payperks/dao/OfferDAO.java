package com.payperks.dao;

import com.payperks.model.Offer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class OfferDAO {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Offer> offerRowMapper = (rs, rowNum) -> {
        Offer offer = new Offer();
        offer.setOfferId(rs.getInt("offer_id"));
        offer.setCardId(rs.getInt("card_id"));
        offer.setMerchantId(rs.getInt("merchant_id"));
        offer.setMerchantName(rs.getString("merchant_name"));
        offer.setCardName(rs.getString("card_name"));
        offer.setOfferDescription(rs.getString("offer_description"));
        return offer;
    };

    public List<Offer> searchOffers(Integer userId, String merchant) {
        String sql = """
            SELECT o.* FROM offers_data o
            INNER JOIN cards c ON o.card_id = c.card_id
            WHERE c.user_id = ?
            AND LOWER(o.merchant_name) LIKE LOWER(?)
        """;
        return jdbcTemplate.query(sql, offerRowMapper, userId, "%" + merchant + "%");
    }

    public List<Offer> getClaimedOffers(Integer userId) {
        String sql = """
            SELECT o.* FROM offers_data o
            INNER JOIN claimed_offers co ON o.offer_id = co.offer_id
            WHERE co.user_id = ?
        """;
        return jdbcTemplate.query(sql, offerRowMapper, userId);
    }

    public boolean claimOffer(Integer userId, Integer offerId) {
        try {
            String sql = "INSERT INTO claimed_offers (user_id, offer_id) VALUES (?, ?)";
            jdbcTemplate.update(sql, userId, offerId);
            return true;
        } catch (Exception e) {
            return false; // Offer already claimed or other error
        }
    }

    public boolean isOfferClaimed(Integer userId, Integer offerId) {
        String sql = "SELECT COUNT(*) FROM claimed_offers WHERE user_id = ? AND offer_id = ?";
        int count = jdbcTemplate.queryForObject(sql, Integer.class, userId, offerId);
        return count > 0;
    }
} 