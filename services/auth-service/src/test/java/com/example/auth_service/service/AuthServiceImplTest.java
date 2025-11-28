package com.example.auth_service.service;

import com.example.auth_service.dto.LoginRequest;
import com.example.auth_service.dto.RegisterRequest;
import com.example.auth_service.entity.Role;
import com.example.auth_service.entity.User;
import com.example.auth_service.repository.RoleRepository;
import com.example.auth_service.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    // -------- REGISTER TEST --------
    @Test
    void register_ShouldSaveUser_WhenValidRequest() {

        RegisterRequest request = new RegisterRequest(
                "rashid",
                "rashid@gmail.com",
                "password",
                "USER"
        );

        when(userRepository.findByEmail(request.getEmail()))
                .thenReturn(Optional.empty());

        Role role = new Role(1L, "ROLE_USER");
        when(roleRepository.findByName("ROLE_USER"))
                .thenReturn(Optional.of(role));

        when(passwordEncoder.encode("password"))
                .thenReturn("encoded123");

        var response = authService.register(request);

        assertEquals("User registered successfully", response.getMessage());
        verify(userRepository, times(1)).save(any(User.class));
    }

    // -------- LOGIN TEST --------
    @Test
    void login_ShouldReturnToken_WhenCredentialsValid() {

        User user = new User(
                1L,
                "rashid",
                "rashid@gmail.com",
                "encoded123",
                Set.of(new Role(1L, "ROLE_USER"))
        );

        LoginRequest request = new LoginRequest("rashid@gmail.com", "password");

        when(userRepository.findByEmail("rashid@gmail.com"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password", "encoded123"))
                .thenReturn(true);

        when(jwtService.generateToken(any()))
                .thenReturn("jwt-token");

        var response = authService.login(request);

        assertEquals("jwt-token", response.getToken());
    }
}
