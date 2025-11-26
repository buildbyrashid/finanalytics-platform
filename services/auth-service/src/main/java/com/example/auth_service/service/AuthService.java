package com.example.auth_service.service;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.RegisterRequest;

public interface AuthService {
    String register(RegisterRequest request);
    String login(LoginRequest request);
}
