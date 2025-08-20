package com.museumhistory.controller;

import com.museumhistory.model.Postare;
import com.museumhistory.model.Sectiune;
import com.museumhistory.service.SectiuneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/sectiuni")
public class SectiuneController {

    private static final Logger logger = LoggerFactory.getLogger(SectiuneController.class);

    @Autowired
    private SectiuneService sectiuneService;

    @GetMapping
    public ResponseEntity<Object> getAllSectiuni() {
        try {
            logger.debug("Fetching all sectiuni");
            List<Sectiune> sectiuni = sectiuneService.getAllSectiuni();
            return ResponseEntity.ok(sectiuni);
        } catch (Exception e) {
            logger.error("Error fetching all sectiuni", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca secțiunile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getSectiuneById(@PathVariable Integer id) {
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid sectiune ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching sectiune with ID: {}", id);
            Sectiune sectiune = sectiuneService.getSectiuneById(id);
            
            if (sectiune == null) {
                logger.warn("Sectiune not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(sectiune);
        } catch (Exception e) {
            logger.error("Error fetching sectiune with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea secțiunii");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/titlu/{titlu}")
    public ResponseEntity<Object> getSectiuneByTitlu(@PathVariable String titlu) {
        try {
            if (titlu == null || titlu.trim().isEmpty()) {
                logger.warn("Invalid sectiune title provided: {}", titlu);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Titlul secțiunii nu poate fi gol");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching sectiune with title: {}", titlu);
            Sectiune sectiune = sectiuneService.getSectiuneByTitlu(titlu);
            
            if (sectiune == null) {
                logger.warn("Sectiune not found with title: {}", titlu);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu titlul '" + titlu + "' nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(sectiune);
        } catch (Exception e) {
            logger.error("Error fetching sectiune with title: " + titlu, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea secțiunii după titlu");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Object> createSectiune(@RequestBody Sectiune sectiune) {
        try {
            // Validate input
            if (sectiune == null) {
                logger.warn("Attempt to create sectiune with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele secțiunii nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (sectiune.getTitlu() == null || sectiune.getTitlu().trim().isEmpty()) {
                validationErrors.put("titlu", "Titlul secțiunii este obligatoriu");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for sectiune creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele secțiunii nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new sectiune: {}", sectiune.getTitlu());
            
            Sectiune createdSectiune = sectiuneService.createSectiune(sectiune);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Secțiunea a fost creată cu succes");
            response.put("status", "success");
            response.put("sectiune", createdSectiune);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating sectiune", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja o secțiune cu acest titlu sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating sectiune", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea secțiunii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Object> updateSectiune(@PathVariable Integer id, @RequestBody Sectiune sectiune) {
        try {
            // Validate ID
            if (id == null || id <= 0) {
                logger.warn("Invalid sectiune ID for update: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate input
            if (sectiune == null) {
                logger.warn("Attempt to update sectiune with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele secțiunii nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if sectiune exists
            Sectiune existingSectiune = sectiuneService.getSectiuneById(id);
            if (existingSectiune == null) {
                logger.warn("Attempted to update non-existent sectiune with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating sectiune with ID: {} - {}", id, sectiune.getTitlu());
            
            Sectiune updatedSectiune = sectiuneService.updateSectiune(id, sectiune);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Secțiunea a fost actualizată cu succes");
            response.put("status", "success");
            response.put("sectiune", updatedSectiune);
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating sectiune: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating sectiune: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea secțiunii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteSectiune(@PathVariable Integer id) {
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid sectiune ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if sectiune exists before trying to delete
            Sectiune existingSectiune = sectiuneService.getSectiuneById(id);
            if (existingSectiune == null) {
                logger.warn("Attempted to delete non-existent sectiune with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting sectiune with ID: {} - {}", id, existingSectiune.getTitlu());
            
            sectiuneService.deleteSectiune(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Secțiunea a fost ștearsă cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Sectiune not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Secțiunea nu a fost găsită");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting sectiune: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge secțiunea din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting sectiune: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea secțiunii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @PostMapping("/{sectiuneId}/postari")
    public ResponseEntity<Object> adaugaPostare(@PathVariable Integer sectiuneId, @RequestBody Postare postare) {
        try {
            // Validate sectiuneId
            if (sectiuneId == null || sectiuneId <= 0) {
                logger.warn("Invalid sectiune ID for adding postare: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate postare
            if (postare == null) {
                logger.warn("Attempt to add null postare to sectiune: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele postării nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if sectiune exists
            Sectiune existingSectiune = sectiuneService.getSectiuneById(sectiuneId);
            if (existingSectiune == null) {
                logger.warn("Attempted to add postare to non-existent sectiune: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu ID-ul " + sectiuneId + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Adding postare to sectiune ID: {}", sectiuneId);
            
            Sectiune updatedSectiune = sectiuneService.adaugaPostare(sectiuneId, postare);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Postarea a fost adăugată cu succes în secțiune");
            response.put("status", "success");
            response.put("sectiune", updatedSectiune);
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while adding postare to sectiune: " + sectiuneId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while adding postare to sectiune: " + sectiuneId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la adăugarea postării în secțiune. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @DeleteMapping("/{sectiuneId}/postari/{postareId}")
    public ResponseEntity<Object> stergePostare(@PathVariable Integer sectiuneId, @PathVariable Integer postareId) {
        try {
            // Validate sectiuneId
            if (sectiuneId == null || sectiuneId <= 0) {
                logger.warn("Invalid sectiune ID for removing postare: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate postareId
            if (postareId == null || postareId <= 0) {
                logger.warn("Invalid postare ID for removal: {}", postareId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul postării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if sectiune exists
            Sectiune existingSectiune = sectiuneService.getSectiuneById(sectiuneId);
            if (existingSectiune == null) {
                logger.warn("Attempted to remove postare from non-existent sectiune: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Secțiunea cu ID-ul " + sectiuneId + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Removing postare ID: {} from sectiune ID: {}", postareId, sectiuneId);
            
            Sectiune updatedSectiune = sectiuneService.stergePostare(sectiuneId, postareId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Postarea a fost eliminată cu succes din secțiune");
            response.put("status", "success");
            response.put("sectiune", updatedSectiune);
            
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Postare not found for removal from sectiune: " + sectiuneId + ", postare: " + postareId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Postarea nu a fost găsită în secțiunea specificată");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while removing postare from sectiune: " + sectiuneId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate elimina postarea din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while removing postare from sectiune: " + sectiuneId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la eliminarea postării din secțiune. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}