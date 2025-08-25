package com.museumhistory.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@TestConfiguration
@Profile("test")
public class TestConfig {

    /**
     * Creates test upload directory for file upload tests
     */
    @Bean
    @Primary
    public String testUploadDirectory() {
        try {
            Path testUploadPath = Paths.get("test-uploads");
            if (!Files.exists(testUploadPath)) {
                Files.createDirectories(testUploadPath);
            }
            return testUploadPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to create test upload directory", e);
        }
    }

    /**
     * Test cleanup utility
     */
    @Bean
    public TestCleanupUtility testCleanupUtility() {
        return new TestCleanupUtility();
    }

    public static class TestCleanupUtility {
        
        public void cleanupTestUploads() {
            try {
                Path testUploadPath = Paths.get("test-uploads");
                if (Files.exists(testUploadPath)) {
                    Files.walk(testUploadPath)
                        .filter(Files::isRegularFile)
                        .forEach(file -> {
                            try {
                                Files.deleteIfExists(file);
                            } catch (IOException e) {
                                // Log but don't fail tests
                                System.out.println("Warning: Could not delete test file: " + file);
                            }
                        });
                }
            } catch (IOException e) {
                System.out.println("Warning: Could not cleanup test uploads: " + e.getMessage());
            }
        }
    }
}