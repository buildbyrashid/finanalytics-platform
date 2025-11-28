package com.example.auth_service.controller;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.security.TestConfig;
import com.example.auth_service.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;

import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

import org.springframework.context.annotation.Import;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(TestConfig.class)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AuthService authService;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void register_ShouldReturnSuccess() throws Exception {

        RegisterRequest req = new RegisterRequest("rashid", "r@gmail.com", "pass", "USER");

        Mockito.when(authService.register(req)).thenReturn(
                new com.example.auth_service.dto.AuthResponse(
                        "User registered successfully",
                        null
                )
        );

        mockMvc.perform(
                post("/api/v1/auth/register")
                        .contentType("application/json")
                        .content(mapper.writeValueAsString(req))
        ).andExpect(status().isOk());
    }

    @Test
    void login_ShouldReturnToken() throws Exception {

        LoginRequest req = new LoginRequest("a@gmail.com", "123");

        Mockito.when(authService.login(req)).thenReturn(
                new com.example.auth_service.dto.AuthResponse(
                        "Login successful",
                        "jwt-token"
                )
        );

        mockMvc.perform(
                post("/api/v1/auth/login")
                        .contentType("application/json")
                        .content(mapper.writeValueAsString(req))
        ).andExpect(status().isOk());
    }
}
