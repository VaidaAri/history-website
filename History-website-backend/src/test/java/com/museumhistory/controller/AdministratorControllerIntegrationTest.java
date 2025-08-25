package com.museumhistory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.museumhistory.model.Administrator;
import com.museumhistory.repository.AdministratorRepository;
import com.museumhistory.service.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class AdministratorControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    private Administrator testAdmin;
    private String rawPassword = "testpassword";

    @BeforeEach
    void setUp() {
        // Clean up any existing test data
        administratorRepository.deleteAll();
        
        // Create test administrator
        testAdmin = new Administrator();
        testAdmin.setFirstName("Test");
        testAdmin.setLastName("Admin");
        testAdmin.setUsername("testadmin");
        testAdmin.setPassword(passwordEncoder.encode(rawPassword));
        testAdmin.setEmail("test@admin.com");
        testAdmin = administratorRepository.save(testAdmin);
    }

    @Test
    void login_WithValidCredentials_ShouldReturnJwtToken() throws Exception {
        // Given
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "testadmin");
        credentials.put("password", rawPassword);

        // When & Then
        String response = mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isOk())
                .andExpect(content().string(not(emptyString())))
                .andReturn()
                .getResponse()
                .getContentAsString();

        // Verify the token is valid
        assert jwtService.validateToken(response, "testadmin");
    }

    @Test
    void login_WithInvalidUsername_ShouldReturnUnauthorized() throws Exception {
        // Given
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "wronguser");
        credentials.put("password", rawPassword);

        // When & Then
        mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Nume de utilizator sau parolă incorectă"))
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void login_WithInvalidPassword_ShouldReturnUnauthorized() throws Exception {
        // Given
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "testadmin");
        credentials.put("password", "wrongpassword");

        // When & Then
        mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("Nume de utilizator sau parolă incorectă"))
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void login_WithEmptyCredentials_ShouldReturnBadRequest() throws Exception {
        // Given
        Map<String, String> credentials = new HashMap<>();
        credentials.put("username", "");
        credentials.put("password", "");

        // When & Then
        mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(credentials)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Numele de utilizator este obligatoriu"))
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void login_WithNullCredentials_ShouldReturnBadRequest() throws Exception {
        // When & Then - sending empty body should trigger "Required request body is missing" from Spring
        mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(""))
                .andExpect(status().isBadRequest());
        
        // Alternative test with actual null object content
        mockMvc.perform(post("/api/administrators/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))  // Empty JSON object
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Numele de utilizator este obligatoriu"))
                .andExpect(jsonPath("$.status").value("error"));
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() throws Exception {
        // Given
        String validToken = jwtService.generateToken("testadmin");

        // When & Then
        mockMvc.perform(get("/api/administrators/validate-token")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() throws Exception {
        // Given
        String invalidToken = "invalid.token.here";

        // When & Then
        mockMvc.perform(get("/api/administrators/validate-token")
                .header("Authorization", "Bearer " + invalidToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false))
                .andExpect(jsonPath("$.error").value("Token invalid sau expirat"));
    }

    @Test
    void validateToken_WithNoAuthHeader_ShouldReturnFalse() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/administrators/validate-token"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false))
                .andExpect(jsonPath("$.error").value("Lipsește header-ul de autorizare"));
    }

    @Test
    void validateToken_WithInvalidAuthHeaderFormat_ShouldReturnFalse() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/administrators/validate-token")
                .header("Authorization", "InvalidFormat token123"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.valid").value(false))
                .andExpect(jsonPath("$.error").value("Format invalid pentru header-ul de autorizare"));
    }

    @Test
    void getAllAdministrators_WithValidToken_ShouldReturnAdmins() throws Exception {
        // Given
        String validToken = jwtService.generateToken("testadmin");

        // When & Then
        mockMvc.perform(get("/api/administrators")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].username").value("testadmin"))
                .andExpect(jsonPath("$[0].firstName").value("Test"))
                .andExpect(jsonPath("$[0].lastName").value("Admin"));
    }

    @Test
    void getAllAdministrators_WithoutToken_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/administrators"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createAdministrator_WithValidToken_ShouldCreateAdmin() throws Exception {
        // Given
        String validToken = jwtService.generateToken("testadmin");
        Administrator newAdmin = new Administrator();
        newAdmin.setFirstName("New");
        newAdmin.setLastName("Admin");
        newAdmin.setUsername("newadmin");
        newAdmin.setPassword("newpassword");
        newAdmin.setEmail("new@admin.com");

        // When & Then
        mockMvc.perform(post("/api/administrators")
                .header("Authorization", "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newAdmin)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Administrator a fost creat cu succes"))
                .andExpect(jsonPath("$.status").value("success"))
                .andExpect(jsonPath("$.username").value("newadmin"));
    }

    @Test
    void createAdministrator_WithoutToken_ShouldReturnForbidden() throws Exception {
        // Given
        Administrator newAdmin = new Administrator();
        newAdmin.setFirstName("New");
        newAdmin.setLastName("Admin");
        newAdmin.setUsername("newadmin");
        newAdmin.setPassword("newpassword");
        newAdmin.setEmail("new@admin.com");

        // When & Then
        mockMvc.perform(post("/api/administrators")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newAdmin)))
                .andExpect(status().isForbidden());
    }
}