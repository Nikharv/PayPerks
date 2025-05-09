package com.payperks.controller;

import com.payperks.model.Offer;
import com.payperks.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/offers")
@CrossOrigin(origins = "http://localhost:3000")
public class OfferController {
    
    @Autowired
    private OfferService offerService;

    @GetMapping("/search")
    public ResponseEntity<List<Offer>> searchOffers(
            @RequestParam Integer userId,
            @RequestParam(required = false, defaultValue = "") String merchant) {
        return ResponseEntity.ok(offerService.searchOffers(userId, merchant));
    }

    @GetMapping("/claimed")
    public ResponseEntity<List<Offer>> getClaimedOffers(@RequestParam Integer userId) {
        return ResponseEntity.ok(offerService.getClaimedOffers(userId));
    }

    @PostMapping("/claim")
    public ResponseEntity<?> claimOffer(@RequestBody Map<String, Integer> request) {
        Integer userId = request.get("userId");
        Integer offerId = request.get("offerId");
        
        boolean claimed = offerService.claimOffer(userId, offerId);
        if (claimed) {
            return ResponseEntity.ok(Map.of("message", "Offer claimed successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Offer already claimed or invalid"));
        }
    }
} 