package com.museumhistory.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.museumhistory.config.TestConfig;
import com.museumhistory.model.Administrator;
import com.museumhistory.model.Imagine;
import com.museumhistory.repository.AdministratorRepository;
import com.museumhistory.repository.ImagineRepository;
import com.museumhistory.service.JwtService;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Import(TestConfig.class)
@Transactional
class ImagineControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ImagineRepository imagineRepository;

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TestConfig.TestCleanupUtility testCleanupUtility;

    private Administrator testAdmin;
    private String validToken;
    private Imagine testImage;

    @BeforeEach
    void setUp() {
        // Clean up data
        imagineRepository.deleteAll();
        administratorRepository.deleteAll();
        
        // Create test admin
        testAdmin = new Administrator();
        testAdmin.setFirstName("Test");
        testAdmin.setLastName("Admin");
        testAdmin.setUsername("testadmin");
        testAdmin.setPassword(passwordEncoder.encode("testpassword"));
        testAdmin.setEmail("test@admin.com");
        testAdmin = administratorRepository.save(testAdmin);
        
        validToken = jwtService.generateToken("testadmin");
        
        // Create test image
        testImage = new Imagine();
        testImage.setPath("test-image.jpg");
        testImage.setDescription("Test image");
        testImage.setPosition(0);
        testImage = imagineRepository.save(testImage);
    }

    @AfterEach
    void tearDown() {
        testCleanupUtility.cleanupTestUploads();
    }

    @Test
    void getAllImages_ShouldReturnImagesOrderedByPosition() throws Exception {
        // Given - create multiple images with different positions
        Imagine image1 = new Imagine();
        image1.setPath("image1.jpg");
        image1.setDescription("First image");
        image1.setPosition(1);
        imagineRepository.save(image1);
        
        Imagine image2 = new Imagine();
        image2.setPath("image2.jpg");
        image2.setDescription("Second image");
        image2.setPosition(2);
        imagineRepository.save(image2);

        // When & Then
        mockMvc.perform(get("/api/images"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(3)))
                .andExpect(jsonPath("$[0].position").value(0)) // testImage
                .andExpect(jsonPath("$[1].position").value(1)) // image1
                .andExpect(jsonPath("$[2].position").value(2)); // image2
    }

    @Test
    void getImageById_ShouldReturnImage_WhenExists() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/images/" + testImage.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(testImage.getId()))
                .andExpect(jsonPath("$.path").value("test-image.jpg"))
                .andExpect(jsonPath("$.description").value("Test image"))
                .andExpect(jsonPath("$.position").value(0));
    }

    @Test
    void getImageById_ShouldReturnNotFound_WhenNotExists() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/images/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.error").value(containsString("Imaginea cu ID-ul 999 nu a fost găsită")));
    }

    @Test
    void uploadImage_WithValidToken_ShouldCreateImage() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test-upload.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/images/upload-image")
                .file(file)
                .param("description", "Uploaded test image")
                .param("position", "5")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.imagePath").value(containsString("test-upload.jpg")));

        // Verify image was saved to database
        assert imagineRepository.count() == 2; // testImage + uploaded image
    }

    @Test
    void uploadImage_WithoutToken_ShouldReturnForbidden() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "test-upload.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/images/upload-image")
                .file(file)
                .param("description", "Uploaded test image")
                .param("position", "5"))
                .andExpect(status().isForbidden());
    }

    @Test
    void uploadImage_WithEmptyFile_ShouldReturnBadRequest() throws Exception {
        // Given
        MockMultipartFile emptyFile = new MockMultipartFile(
                "image",
                "empty.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                new byte[0]
        );

        // When & Then
        mockMvc.perform(multipart("/api/images/upload-image")
                .file(emptyFile)
                .param("description", "Empty test image")
                .param("position", "0")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Fișierul este gol"));
    }

    @Test
    void uploadImage_WithDefaultPosition_ShouldUseZero() throws Exception {
        // Given
        MockMultipartFile file = new MockMultipartFile(
                "image",
                "default-position.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "test image content".getBytes()
        );

        // When & Then
        mockMvc.perform(multipart("/api/images/upload-image")
                .file(file)
                .param("description", "Image with default position")
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk());

        // Verify position defaults to 0
        Imagine uploadedImage = imagineRepository.findAll().stream()
                .filter(img -> img.getPath().contains("default-position.jpg"))
                .findFirst()
                .orElse(null);
        
        assert uploadedImage != null;
        assert uploadedImage.getPosition() == 0;
    }

    @Test
    void createImage_WithValidToken_ShouldCreateImage() throws Exception {
        // Given
        Imagine newImage = new Imagine();
        newImage.setPath("new-image.jpg");
        newImage.setDescription("New test image");
        newImage.setPosition(3);

        // When & Then
        mockMvc.perform(post("/api/images")
                .header("Authorization", "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(newImage)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message").value("Imaginea a fost creată cu succes"))
                .andExpect(jsonPath("$.imagePath").value("new-image.jpg"));
    }

    @Test
    void deleteImage_WithValidToken_ShouldDeleteImage() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/images/" + testImage.getId())
                .header("Authorization", "Bearer " + validToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Imaginea a fost ștearsă cu succes"));

        // Verify image was deleted
        assert imagineRepository.findById(testImage.getId()).isEmpty();
    }

    @Test
    void deleteImage_WithoutToken_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(delete("/api/images/" + testImage.getId()))
                .andExpect(status().isForbidden());

        // Verify image was not deleted
        assert imagineRepository.findById(testImage.getId()).isPresent();
    }

    @Test
    void updateImage_WithValidToken_ShouldUpdateImage() throws Exception {
        // Given
        testImage.setDescription("Updated description");
        testImage.setPosition(10);

        // When & Then
        mockMvc.perform(put("/api/images")
                .header("Authorization", "Bearer " + validToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(testImage)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Imaginea a fost actualizată cu succes"));

        // Verify image was updated
        Imagine updatedImage = imagineRepository.findById(testImage.getId()).orElse(null);
        assert updatedImage != null;
        assert updatedImage.getDescription().equals("Updated description");
        assert updatedImage.getPosition() == 10;
    }
}