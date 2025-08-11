package com.museumhistory.controller;

import com.museumhistory.model.Administrator;
import com.museumhistory.service.AdministratorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/administrators")
public class AdministratorController {

    private static final Logger logger = LoggerFactory.getLogger(AdministratorController.class);

    @Autowired
    private AdministratorService administratorService;

    @GetMapping
    public List<Administrator> getAllAdministrators(){
        return administratorService.getAllAdministrators();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getAdministratorById(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid administrator ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul administratorului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching administrator with ID: {}", id);
            Administrator administrator = administratorService.findAdministratorById(id);
            
            if (administrator == null) {
                logger.warn("Administrator not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Administratorul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(administrator);
        } catch (Exception e) {
            logger.error("Error fetching administrator with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea administratorului");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public void createAdministrator(@RequestBody Administrator newAdministrator) {
        administratorService.createAdministrator(newAdministrator);
    }

    @PutMapping
    public void updateAdministrator(@RequestBody Administrator updatedAdministrator){
        administratorService.updateAdministrator(updatedAdministrator);
    }

    @DeleteMapping("/{id}")
    public void deleteAdministrator(@PathVariable Integer id){
        administratorService.deleteAdministrator(id);
    }

    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Map<String, String> credentials) {
        try {
            // Validate input
            if (credentials == null) {
                logger.warn("Login attempt with null credentials");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele de autentificare sunt obligatorii");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String username = credentials.get("username");
            String password = credentials.get("password");
            
            // Validate required fields
            if (username == null || username.trim().isEmpty()) {
                logger.warn("Login attempt with empty username");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Numele de utilizator este obligatoriu");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (password == null || password.trim().isEmpty()) {
                logger.warn("Login attempt with empty password for user: {}", username);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Parola este obligatorie");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Sanitize username
            username = username.trim();
            
            logger.info("Login attempt for user: {}", username);
            
            boolean isAuthenticated = administratorService.authenticate(username, password);
            
            if (isAuthenticated) {
                String token = generateSimpleToken(username);
                logger.info("Successful login for user: {}", username);
                
                // Return just the token as text (for compatibility with frontend)
                return ResponseEntity.ok(token);
            } else {
                logger.warn("Failed login attempt for user: {}", username);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Nume de utilizator sau parolă incorectă");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
            }
            
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument during login", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Date de autentificare invalide");
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error during login", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la autentificare. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/validate-token")
    public ResponseEntity<Object> validateToken(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            if (authHeader == null || authHeader.trim().isEmpty()) {
                logger.debug("Token validation failed: no authorization header");
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("error", "Lipsește header-ul de autorizare");
                return ResponseEntity.ok(response);
            }
            
            if (!authHeader.startsWith("Bearer ")) {
                logger.debug("Token validation failed: invalid authorization header format");
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("error", "Format invalid pentru header-ul de autorizare");
                return ResponseEntity.ok(response);
            }
            
            String token = authHeader.substring(7).trim();
            
            if (token.isEmpty()) {
                logger.debug("Token validation failed: empty token");
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("error", "Token-ul nu poate fi gol");
                return ResponseEntity.ok(response);
            }
            
            // Basic token validation (decode and check format)
            boolean isValidToken = validateTokenFormat(token);
            
            if (isValidToken) {
                logger.debug("Token validation successful");
                Map<String, Object> response = new HashMap<>();
                response.put("valid", true);
                return ResponseEntity.ok(response);
            } else {
                logger.debug("Token validation failed: invalid token format");
                Map<String, Object> response = new HashMap<>();
                response.put("valid", false);
                response.put("error", "Token invalid sau expirat");
                return ResponseEntity.ok(response);
            }
            
        } catch (Exception e) {
            logger.error("Unexpected error during token validation", e);
            Map<String, Object> response = new HashMap<>();
            response.put("valid", false);
            response.put("error", "Eroare la validarea token-ului");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
    
    private String generateSimpleToken(String username) {
        try {
            String tokenId = UUID.randomUUID().toString();
            String timestamp = String.valueOf(new Date().getTime());
            String tokenData = username + ":" + timestamp + ":" + tokenId;
            return Base64.getEncoder().encodeToString(tokenData.getBytes());
        } catch (Exception e) {
            logger.error("Error generating token for user: " + username, e);
            throw new RuntimeException("Nu s-a putut genera token-ul de autentificare");
        }
    }
    
    private boolean validateTokenFormat(String token) {
        try {
            // Decode the token
            byte[] decodedBytes = Base64.getDecoder().decode(token);
            String tokenData = new String(decodedBytes);
            
            // Check if token has the expected format: username:timestamp:tokenId
            String[] parts = tokenData.split(":");
            if (parts.length != 3) {
                return false;
            }
            
            // Validate timestamp (basic check - not expired if less than 24 hours old)
            try {
                long timestamp = Long.parseLong(parts[1]);
                long currentTime = new Date().getTime();
                long tokenAge = currentTime - timestamp;
                
                // Token expires after 24 hours (in milliseconds)
                long maxAge = 24 * 60 * 60 * 1000L;
                
                return tokenAge <= maxAge;
            } catch (NumberFormatException e) {
                return false;
            }
            
        } catch (IllegalArgumentException e) {
            // Base64 decoding failed
            return false;
        } catch (Exception e) {
            logger.error("Error validating token format", e);
            return false;
        }
    }
}
