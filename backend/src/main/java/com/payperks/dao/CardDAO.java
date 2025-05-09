package com.payperks.dao;

import com.payperks.model.Card;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class CardDAO {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final RowMapper<Card> cardRowMapper = (rs, rowNum) -> {
        Card card = new Card();
        card.setCardId(rs.getInt("card_id"));
        card.setCardName(rs.getString("card_name"));
        card.setBankName(rs.getString("bank_name"));
        card.setCardType(rs.getString("card_type"));
        return card;
    };

    public List<Card> findCards(String bank, String type) {
        StringBuilder sql = new StringBuilder("SELECT * FROM cards_data WHERE 1=1");
        if (bank != null && !bank.isEmpty()) {
            sql.append(" AND bank_name = ?");
        }
        if (type != null && !type.isEmpty()) {
            sql.append(" AND card_type = ?");
        }

        if (bank != null && !bank.isEmpty() && type != null && !type.isEmpty()) {
            return jdbcTemplate.query(sql.toString(), cardRowMapper, bank, type);
        } else if (bank != null && !bank.isEmpty()) {
            return jdbcTemplate.query(sql.toString(), cardRowMapper, bank);
        } else if (type != null && !type.isEmpty()) {
            return jdbcTemplate.query(sql.toString(), cardRowMapper, type);
        } else {
            return jdbcTemplate.query(sql.toString(), cardRowMapper);
        }
    }

    public void addUserCards(Integer userId, List<Integer> cardIds) {
        String sql = "INSERT INTO cards (user_id, card_id) VALUES (?, ?)";
        for (Integer cardId : cardIds) {
            try {
                jdbcTemplate.update(sql, userId, cardId);
            } catch (Exception e) {
                // Skip if card already exists for user
            }
        }
    }

    public List<Integer> getUserCardIds(Integer userId) {
        String sql = "SELECT card_id FROM cards WHERE user_id = ?";
        return jdbcTemplate.queryForList(sql, Integer.class, userId);
    }
} 