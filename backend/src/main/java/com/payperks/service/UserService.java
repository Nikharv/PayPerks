package com.payperks.service;

import com.payperks.dao.UserDAO;
import com.payperks.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    
    @Autowired
    private UserDAO userDAO;

    public User signup(User user) {
        // Check if email already exists
        if (userDAO.findByEmail(user.getEmail()) != null) {
            throw new RuntimeException("Email already exists");
        }
        return userDAO.createUser(user);
    }

    public User login(String email, String password) {
        User user = userDAO.validateCredentials(email, password);
        if (user == null) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }

    public User findById(Integer userId) {
        User user = userDAO.findById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }
} 