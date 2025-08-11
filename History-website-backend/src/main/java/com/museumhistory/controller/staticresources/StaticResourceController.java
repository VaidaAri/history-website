package com.museumhistory.controller.staticresources;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/staticresources")
@CrossOrigin(origins = "http://localhost:4200")
public class StaticResourceController {

    private static final Logger logger = LoggerFactory.getLogger(StaticResourceController.class);

    @GetMapping("/images/{folder}/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String folder, @PathVariable String filename) {
        try {
            // Validate input parameters
            if (folder == null || folder.trim().isEmpty()) {
                logger.warn("Image request with empty folder parameter");
                return ResponseEntity.badRequest().build();
            }
            
            if (filename == null || filename.trim().isEmpty()) {
                logger.warn("Image request with empty filename parameter");
                return ResponseEntity.badRequest().build();
            }
            
            // Security check - prevent directory traversal attacks
            if (folder.contains("..") || filename.contains("..")) {
                logger.warn("Potential directory traversal attack detected: folder={}, filename={}", folder, filename);
                return ResponseEntity.badRequest().build();
            }
            
            String decodedFolder = URLDecoder.decode(folder, StandardCharsets.UTF_8.name());
            String decodedFilename = URLDecoder.decode(filename, StandardCharsets.UTF_8.name());
            
            // Additional security check after decoding
            if (decodedFolder.contains("..") || decodedFilename.contains("..")) {
                logger.warn("Directory traversal detected after URL decoding: folder={}, filename={}", decodedFolder, decodedFilename);
                return ResponseEntity.badRequest().build();
            }
            
            String imagePath = "static/images/" + decodedFolder + "/" + decodedFilename;
            logger.debug("Attempting to load image: {}", imagePath);
            
            Resource resource = new ClassPathResource(imagePath);
            
            if (!resource.exists()) {
                logger.warn("Image not found: {}", imagePath);
                return ResponseEntity.notFound().build();
            }
            
            if (!resource.isReadable()) {
                logger.warn("Image not readable: {}", imagePath);
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            
            byte[] imageBytes = Files.readAllBytes(resource.getFile().toPath());
            String contentType = determineContentType(decodedFilename);
            
            logger.debug("Successfully loaded image: {} ({} bytes)", imagePath, imageBytes.length);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(imageBytes);
                    
        } catch (SecurityException e) {
            logger.error("Security error while loading image: folder={}, filename={}", folder, filename, e);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (IOException e) {
            logger.error("IO error while loading image: folder={}, filename={}", folder, filename, e);
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            logger.error("Unexpected error while loading image: folder={}, filename={}", folder, filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    
    @GetMapping("/images/{folder}")
    public ResponseEntity<Object> getImagesFromFolder(@PathVariable String folder) {
        try {
            // Validate input parameter
            if (folder == null || folder.trim().isEmpty()) {
                logger.warn("Folder listing request with empty folder parameter");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Numele folderului este obligatoriu");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Security check - prevent directory traversal attacks
            if (folder.contains("..")) {
                logger.warn("Potential directory traversal attack in folder listing: {}", folder);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Nume de folder invalid");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String decodedFolder = URLDecoder.decode(folder, StandardCharsets.UTF_8.name());
            
            // Additional security check after decoding
            if (decodedFolder.contains("..")) {
                logger.warn("Directory traversal detected after URL decoding in folder listing: {}", decodedFolder);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Nume de folder invalid");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String folderPath = "static/images/" + decodedFolder;
            logger.debug("Attempting to list images in folder: {}", folderPath);
            
            Resource resource = new ClassPathResource(folderPath);
            
            if (!resource.exists()) {
                logger.warn("Image folder not found: {}", folderPath);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Folderul '" + decodedFolder + "' nu a fost găsit");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            if (!resource.getFile().isDirectory()) {
                logger.warn("Resource is not a directory: {}", folderPath);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Resursa specificată nu este un folder");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            String[] fileNames = resource.getFile().list();
            
            if (fileNames == null) {
                fileNames = new String[0];
            }
            
            logger.debug("Successfully listed {} files in folder: {}", fileNames.length, folderPath);
            
            return ResponseEntity.ok(fileNames);
            
        } catch (SecurityException e) {
            logger.error("Security error while listing folder: {}", folder, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Acces interzis la folder");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
        } catch (IOException e) {
            logger.error("IO error while listing folder: {}", folder, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la accesarea folderului");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while listing folder: {}", folder, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare neașteptată la listarea fișierelor");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private String determineContentType(String filename) {
        if (filename.toLowerCase().endsWith(".jpg") || filename.toLowerCase().endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.toLowerCase().endsWith(".png")) {
            return "image/png";
        } else if (filename.toLowerCase().endsWith(".gif")) {
            return "image/gif";
        }
        return "application/octet-stream";
    }
}