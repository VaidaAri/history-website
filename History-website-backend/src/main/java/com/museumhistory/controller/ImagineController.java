package com.museumhistory.controller;

import com.museumhistory.model.Imagine;
import com.museumhistory.service.ImagineService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImagineController {

    private static final Logger logger = LoggerFactory.getLogger(ImagineController.class);

    @Autowired
    private ImagineService imagineService;

    @GetMapping
    public ResponseEntity<Object> getAllImages(){
        try {
            logger.debug("Fetching all images");
            List<Imagine> images = imagineService.getAllImages();
            return ResponseEntity.ok(images);
        } catch (Exception e) {
            logger.error("Error fetching all images", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca imaginile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getImageById(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid image ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul imaginii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching image with ID: {}", id);
            Imagine image = imagineService.findImageById(id);
            
            if (image == null) {
                logger.warn("Image not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imaginea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(image);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Nu s-a gasit imagine cu ID-ul")) {
                logger.warn("Image not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imaginea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            logger.error("Error fetching image with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea imaginii");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error fetching image with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare neașteptată la căutarea imaginii");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createImage(@RequestBody Imagine newImage){
        try {
            // Validate input
            if (newImage == null) {
                logger.warn("Attempt to create image with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele imaginii nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newImage.getPath() == null || newImage.getPath().trim().isEmpty()) {
                validationErrors.put("path", "Calea imaginii este obligatorie");
            }
            if (newImage.getDescription() == null || newImage.getDescription().trim().isEmpty()) {
                validationErrors.put("description", "Descrierea imaginii este obligatorie");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for image creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele imaginii nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new image: {}", newImage.getPath());
            
            imagineService.createImage(newImage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Imaginea a fost creată cu succes");
            response.put("status", "success");
            response.put("imagePath", newImage.getPath());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating image", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Există deja o imagine cu această cale sau datele nu respectă restricțiile");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating image", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea imaginii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateImage(@RequestBody Imagine updatedImage){
        try {
            // Validate input
            if (updatedImage == null) {
                logger.warn("Attempt to update image with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele imaginii nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (updatedImage.getId() == null || updatedImage.getId() <= 0) {
                logger.warn("Invalid image ID for update: {}", updatedImage.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul imaginii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if image exists
            Imagine existingImage = imagineService.findImageById(updatedImage.getId());
            if (existingImage == null) {
                logger.warn("Attempted to update non-existent image with ID: {}", updatedImage.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imaginea cu ID-ul " + updatedImage.getId() + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating image with ID: {}", updatedImage.getId());
            
            imagineService.updateImage(updatedImage);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Imaginea a fost actualizată cu succes");
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating image: " + updatedImage.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating image: " + updatedImage.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea imaginii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteImage(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid image ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul imaginii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if image exists before trying to delete
            Imagine existingImage = imagineService.findImageById(id);
            if (existingImage == null) {
                logger.warn("Attempted to delete non-existent image with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Imaginea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting image with ID: {} - {}", id, existingImage.getPath());
            
            imagineService.deleteImage(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Imaginea a fost ștearsă cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Image not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Imaginea nu a fost găsită");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting image: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge imaginea din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting image: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea imaginii. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private static final String UPLOAD_DIR = "uploads/";
    @PostMapping("/upload-image")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("image") MultipartFile file, 
            @RequestParam("description") String description,
            @RequestParam(value = "position", defaultValue = "0") Integer position) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Fișierul este gol"));
            }
            
            String originalFilename = file.getOriginalFilename();
            String fileName = System.currentTimeMillis() + "_" + originalFilename;
            
            Path uploadPath = Paths.get(UPLOAD_DIR).toAbsolutePath().normalize();
            
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path targetLocation = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            
            Imagine image = new Imagine();
            image.setPath(fileName);
            image.setDescription(description);
            image.setPosition(position);
            imagineService.createImage(image);

            Map<String, String> response = new HashMap<>();
            response.put("imagePath", image.getPath());
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare la încărcarea fișierului: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Eroare neașteptată: " + e.getMessage()));
        }
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/").resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                String contentType = Files.probeContentType(filePath);

                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, contentType != null ? contentType : "application/octet-stream")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
