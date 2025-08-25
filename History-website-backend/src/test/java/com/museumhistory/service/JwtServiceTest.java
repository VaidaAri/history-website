package com.museumhistory.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Date;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private static final String TEST_SECRET = "mySecretKeyForMuseumHistoryWebsiteApplicationThatShouldBeAtLeast256BitsLongForTesting123";
    private static final Long TEST_EXPIRATION = 3600000L; // 1 hour

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // Set test values using reflection to simulate @Value injection
        ReflectionTestUtils.setField(jwtService, "secret", TEST_SECRET);
        ReflectionTestUtils.setField(jwtService, "expiration", TEST_EXPIRATION);
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        // Given
        String username = "testuser";

        // When
        String token = jwtService.generateToken(username);

        // Then
        assertNotNull(token);
        assertFalse(token.isEmpty());
        assertTrue(token.split("\\.").length == 3); // JWT has 3 parts separated by dots
    }

    @Test
    void extractUsername_ShouldReturnCorrectUsername() {
        // Given
        String username = "testuser";
        String token = jwtService.generateToken(username);

        // When
        String extractedUsername = jwtService.extractUsername(token);

        // Then
        assertEquals(username, extractedUsername);
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        // Given
        String username = "testuser";
        String token = jwtService.generateToken(username);
        Date now = new Date();

        // When
        Date expiration = jwtService.extractExpiration(token);

        // Then
        assertNotNull(expiration);
        assertTrue(expiration.after(now));
    }

    @Test
    void validateToken_ShouldReturnTrue_ForValidToken() {
        // Given
        String username = "testuser";
        String token = jwtService.generateToken(username);

        // When
        Boolean isValid = jwtService.validateToken(token, username);

        // Then
        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_ForWrongUsername() {
        // Given
        String username = "testuser";
        String wrongUsername = "wronguser";
        String token = jwtService.generateToken(username);

        // When
        Boolean isValid = jwtService.validateToken(token, wrongUsername);

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldReturnTrue_ForNonExpiredToken() {
        // Given
        String username = "testuser";
        String token = jwtService.generateToken(username);

        // When
        Boolean isValid = jwtService.validateToken(token);

        // Then
        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_ForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        Boolean isValid = jwtService.validateToken(invalidToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_ForMalformedToken() {
        // Given
        String malformedToken = "not-a-jwt-token";

        // When
        Boolean isValid = jwtService.validateToken(malformedToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void validateToken_ShouldReturnFalse_ForEmptyToken() {
        // Given
        String emptyToken = "";

        // When
        Boolean isValid = jwtService.validateToken(emptyToken);

        // Then
        assertFalse(isValid);
    }

    @Test
    void extractUsername_ShouldThrowException_ForInvalidToken() {
        // Given
        String invalidToken = "invalid.token.here";

        // When & Then
        assertThrows(RuntimeException.class, () -> {
            jwtService.extractUsername(invalidToken);
        });
    }

    @Test
    void generateMultipleTokens_ShouldCreateDifferentTokens() {
        // Given
        String username = "testuser";

        // When
        String token1 = jwtService.generateToken(username);
        // Small delay to ensure different timestamps
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        String token2 = jwtService.generateToken(username);

        // Then
        assertNotNull(token1);
        assertNotNull(token2);
        assertNotEquals(token1, token2); // Different tokens due to different timestamps
    }

    @Test
    void tokenValidation_ShouldWorkWithSpecialCharacterUsernames() {
        // Given
        String username = "user.name@email.com";
        String token = jwtService.generateToken(username);

        // When
        String extractedUsername = jwtService.extractUsername(token);
        Boolean isValid = jwtService.validateToken(token, username);

        // Then
        assertEquals(username, extractedUsername);
        assertTrue(isValid);
    }

    @Test
    void validateToken_ShouldHandleNullUsername() {
        // Given
        String username = "testuser";
        String token = jwtService.generateToken(username);

        // When
        Boolean isValid = jwtService.validateToken(token, null);

        // Then
        assertFalse(isValid);
    }
}