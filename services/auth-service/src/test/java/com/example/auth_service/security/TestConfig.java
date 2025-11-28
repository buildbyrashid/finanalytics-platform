package com.example.auth_service.security;

import com.example.auth_service.service.AuthService;
import org.mockito.Mockito;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;

@TestConfiguration
public class TestConfig {

    @Bean
    public AuthService authService() {
        return Mockito.mock(AuthService.class);
    }
}