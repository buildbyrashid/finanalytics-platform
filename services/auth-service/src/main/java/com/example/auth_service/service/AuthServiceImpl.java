package com.example.auth_service.service;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;

    public AuthServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String register(RegisterRequest request) {
        // Implementation for user registration
        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        // Implementation for user login
        return "User logged in successfully";
    }
}
