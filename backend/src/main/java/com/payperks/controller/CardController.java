package com.payperks.controller;

import com.payperks.model.Card;
import com.payperks.service.CardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class CardController {
    
    @Autowired
    private CardService cardService;

    @GetMapping("/cards-data")
    public ResponseEntity<List<Card>> getCards(
            @RequestParam(required = false) String bank,
            @RequestParam(required = false) String type) {
        return ResponseEntity.ok(cardService.findCards(bank, type));
    }

    @PostMapping("/user-cards")
    public ResponseEntity<?> addUserCards(@RequestBody Map<String, Object> request) {
        try {
            Integer userId = (Integer) request.get("userId");
            @SuppressWarnings("unchecked")
            List<Integer> cardIds = (List<Integer>) request.get("cardIds");
            
            cardService.addUserCards(userId, cardIds);
            return ResponseEntity.ok(Map.of("message", "Cards added successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/user-cards/{userId}")
    public ResponseEntity<List<Integer>> getUserCards(@PathVariable Integer userId) {
        return ResponseEntity.ok(cardService.getUserCardIds(userId));
    }
} 