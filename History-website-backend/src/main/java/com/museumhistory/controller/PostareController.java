package com.museumhistory.controller;

import com.museumhistory.model.Postare;
import com.museumhistory.service.PostareService;
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
@RequestMapping("/api/posts")
public class PostareController {

    private static final Logger logger = LoggerFactory.getLogger(PostareController.class);

    @Autowired
    private PostareService postareService;

    @GetMapping
    public ResponseEntity<Object> getAllPosts(){
        try {
            logger.debug("Fetching all posts");
            List<Postare> posts = postareService.getAllPosts();
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("Error fetching all posts", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca postările");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getPostById(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid post ID provided: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul postării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching post with ID: {}", id);
            Postare post = postareService.findPostByID(id);
            
            if (post == null) {
                logger.warn("Post not found with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Postarea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            return ResponseEntity.ok(post);
        } catch (Exception e) {
            logger.error("Error fetching post with ID: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la căutarea postării");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    @GetMapping("/sectiune/{sectiuneId}")
    public ResponseEntity<Object> getPostsBySectiune(@PathVariable Integer sectiuneId) {
        try {
            if (sectiuneId == null || sectiuneId <= 0) {
                logger.warn("Invalid sectiune ID provided: {}", sectiuneId);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul secțiunii trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.debug("Fetching posts for sectiune ID: {}", sectiuneId);
            List<Postare> posts = postareService.getPostsBySectiuneId(sectiuneId);
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            logger.error("Error fetching posts for sectiune ID: " + sectiuneId, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu s-au putut încărca postările pentru secțiunea specificată");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createPost(@RequestBody Postare newPost){
        try {
            // Validate input
            if (newPost == null) {
                logger.warn("Attempt to create post with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele postării nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Validate required fields
            Map<String, String> validationErrors = new HashMap<>();
            if (newPost.getDescription() == null || newPost.getDescription().trim().isEmpty()) {
                validationErrors.put("description", "Descrierea postării este obligatorie");
            }
            
            if (!validationErrors.isEmpty()) {
                logger.warn("Validation failed for post creation: {}", validationErrors);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele postării nu sunt complete");
                errorResponse.put("validationErrors", validationErrors);
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            logger.info("Creating new post");
            
            postareService.createPost(newPost);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Postarea a fost creată cu succes");
            response.put("status", "success");
            response.put("post", newPost);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while creating post", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while creating post", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la crearea postării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updatePost(@RequestBody Postare updatedPost){
        try {
            // Validate input
            if (updatedPost == null) {
                logger.warn("Attempt to update post with null data");
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Datele postării nu pot fi null");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            if (updatedPost.getId() == null || updatedPost.getId() <= 0) {
                logger.warn("Invalid post ID for update: {}", updatedPost.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul postării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if post exists
            Postare existingPost = postareService.findPostByID(updatedPost.getId());
            if (existingPost == null) {
                logger.warn("Attempted to update non-existent post with ID: {}", updatedPost.getId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Postarea cu ID-ul " + updatedPost.getId() + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Updating post with ID: {}", updatedPost.getId());
            
            postareService.updatePost(updatedPost);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Postarea a fost actualizată cu succes");
            response.put("status", "success");
            
            return ResponseEntity.ok(response);
            
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while updating post: " + updatedPost.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Datele nu respectă restricțiile de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while updating post: " + updatedPost.getId(), e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la actualizarea postării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deletePost(@PathVariable Integer id){
        try {
            if (id == null || id <= 0) {
                logger.warn("Invalid post ID for deletion: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "ID-ul postării trebuie să fie un număr pozitiv");
                errorResponse.put("status", "error");
                return ResponseEntity.badRequest().body(errorResponse);
            }
            
            // Check if post exists before trying to delete
            Postare existingPost = postareService.findPostByID(id);
            if (existingPost == null) {
                logger.warn("Attempted to delete non-existent post with ID: {}", id);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Postarea cu ID-ul " + id + " nu a fost găsită");
                errorResponse.put("status", "error");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
            }
            
            logger.info("Deleting post with ID: {}", id);
            
            postareService.deletePost(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Postarea a fost ștearsă cu succes");
            response.put("status", "success");
            return ResponseEntity.ok(response);
            
        } catch (EmptyResultDataAccessException e) {
            logger.error("Post not found for deletion: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Postarea nu a fost găsită");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting post: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Nu se poate șterge postarea din cauza restricțiilor de integritate");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
        } catch (Exception e) {
            logger.error("Unexpected error while deleting post: " + id, e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Eroare la ștergerea postării. Vă rugăm să încercați din nou.");
            errorResponse.put("status", "error");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}
