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
    public ResponseEntity<Object> getAllAdministrators(){
        try {
            logger.debug("Fetching all administrators");
            List<Administrator> administrators = administratorService.getAllAdministrators();
            return ResponseEntity.ok(administrators);
        } catch (Exception e) {
            logger.error("Error fetching all administrators", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca administratorii");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
    public ResponseEntity<Map<String, Object>> createAdministrator(@RequestBody Administrator newAdministrator) {
        try {
            // Validate input
            if (newAdministrator == null) {
                logger.warn("Attempt to create administrator with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele administratorului nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newAdministrator.getFirstName() == null || newAdministrator.getFirstName().trim().isEmpty()) {
                validationErrors.put("firstName", "Prenumele este obligatoriu");
            }
            if (newAdministrator.getLastName() == null || newAdministrator.getLastName().trim().isEmpty()) {
                validationErrors.put("lastName", "Numele este obligatoriu");
            }
            if (newAdministrator.getUsername() == null || newAdministrator.getUsername().trim().isEmpty()) {
                validationErrors.put("username", "Username-ul este obligatoriu");
            }
            if (newAdministrator.getPassword() == null || newAdministrator.getPassword().trim().isEmpty()) {
                validationErrors.put("password", "Parola este obligatorie");
            }
            if (newAdministrator.getEmail() == null || newAdministrator.getEmail().trim().isEmpty()) {
                validationErrors.put("email", "Email-ul este obligatoriu");
            }
            
            // Additional validation for username and email format
            if (newAdministrator.getUsername() != null && newAdministrator.getUsername().trim().length() < 3) {
                validationErrors.put("username", "Username-ul trebuie să aibă cel puțin 3 caractere");
            }
            if (newAdministrator.getPassword() != null && newAdministrator.getPassword().trim().length() < 6) {
                validationErrors.put("password", "Parola trebuie să aibă cel puțin 6 caractere");
            }
            if (newAdministrator.getEmail() != null && !newAdministrator.getEmail().contains("@")) {
                validationErrors.put("email", "Email-ul trebuie să aibă un format valid");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for administrator creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele administratorului nu sunt complete sau valide");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new administrator: {} {} - {}", 
                newAdministrator.getFirstName(), newAdministrator.getLastName(), newAdministrator.getUsername());
            
            administratorService.createAdministrator(newAdministrator);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Administrator a fost creat cu succes");
            response.put("status", "success");
            response.put("username", newAdministrator.getUsername());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating administrator", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja un administrator cu acest username sau email");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while creating administrator", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating administrator", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea administratorului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateAdministrator(@RequestBody Administrator updatedAdministrator){
        try {
            // Validate input
            if (updatedAdministrator == null) {
                logger.warn("Attempt to update administrator with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele administratorului nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (updatedAdministrator.getId() == null || updatedAdministrator.getId() <= 0) {
                logger.warn("Invalid administrator ID for update: {}", updatedAdministrator.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul administratorului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (updatedAdministrator.getFirstName() == null || updatedAdministrator.getFirstName().trim().isEmpty()) {
                validationErrors.put("firstName", "Prenumele este obligatoriu");
            }
            if (updatedAdministrator.getLastName() == null || updatedAdministrator.getLastName().trim().isEmpty()) {
                validationErrors.put("lastName", "Numele este obligatoriu");
            }
            if (updatedAdministrator.getUsername() == null || updatedAdministrator.getUsername().trim().isEmpty()) {
                validationErrors.put("username", "Username-ul este obligatoriu");
            }
            if (updatedAdministrator.getEmail() == null || updatedAdministrator.getEmail().trim().isEmpty()) {
                validationErrors.put("email", "Email-ul este obligatoriu");
            }
            
            // Additional validation
            if (updatedAdministrator.getUsername() != null && updatedAdministrator.getUsername().trim().length() < 3) {
                validationErrors.put("username", "Username-ul trebuie să aibă cel puțin 3 caractere");
            }
            if (updatedAdministrator.getEmail() != null && !updatedAdministrator.getEmail().contains("@")) {
                validationErrors.put("email", "Email-ul trebuie să aibă un format valid");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for administrator update: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele administratorului nu sunt complete sau valide");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if administrator exists before trying to update
            Administrator existingAdmin = administratorService.findAdministratorById(updatedAdministrator.getId());
            if (existingAdmin == null) {
                logger.warn("Attempted to update non-existent administrator with ID: {}", updatedAdministrator.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Administratorul cu ID-ul " + updatedAdministrator.getId() + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating administrator with ID: {} - {}", 
                updatedAdministrator.getId(), updatedAdministrator.getUsername());
            
            administratorService.updateAdministrator(updatedAdministrator);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Administrator a fost actualizat cu succes");
            response.put("status", "success");
            response.put("username", updatedAdministrator.getUsername());
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating administrator: " + updatedAdministrator.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja un administrator cu acest username sau email");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid argument while updating administrator: " + updatedAdministrator.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            errorResponse.put("status", "error");
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating administrator: " + updatedAdministrator.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea administratorului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteAdministrator(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid administrator ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul administratorului trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if administrator exists before trying to delete
            Administrator existingAdmin = administratorService.findAdministratorById(id);
            if (existingAdmin == null) {
                logger.warn("Attempted to delete non-existent administrator with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Administratorul cu ID-ul " + id + " nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting administrator with ID: {} - {}", 
                id, existingAdmin.getUsername());
            
            administratorService.deleteAdministrator(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Administrator a fost șters cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Administrator not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Administratorul nu a fost găsit");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting administrator: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge administratorul din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting administrator: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea administratorului. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
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
