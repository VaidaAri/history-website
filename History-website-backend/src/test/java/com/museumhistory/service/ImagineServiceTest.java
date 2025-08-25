package com.museumhistory.service;

import com.museumhistory.model.Imagine;
import com.museumhistory.repository.ImagineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ImagineServiceTest {

    @Mock
    private ImagineRepository imagineRepository;

    @InjectMocks
    private ImagineService imagineService;

    private Imagine testImage;

    @BeforeEach
    void setUp() {
        testImage = new Imagine();
        testImage.setId(1);
        testImage.setPath("test-image.jpg");
        testImage.setDescription("Test image");
        testImage.setPosition(0);
    }

    @Test
    void getAllImages_ShouldReturnImagesOrderedByPosition() {
        // Given
        Imagine image1 = new Imagine();
        image1.setPosition(0);
        image1.setPath("first.jpg");
        
        Imagine image2 = new Imagine();
        image2.setPosition(1);
        image2.setPath("second.jpg");
        
        List<Imagine> expectedImages = Arrays.asList(image1, image2);
        when(imagineRepository.findAllByOrderByPositionAsc()).thenReturn(expectedImages);

        // When
        List<Imagine> result = imagineService.getAllImages();

        // Then
        assertEquals(expectedImages, result);
        verify(imagineRepository).findAllByOrderByPositionAsc();
        verify(imagineRepository, never()).findAll(); // Should not use the old method
    }

    @Test
    void createImage_ShouldSaveImage() {
        // Given
        Imagine newImage = new Imagine();
        newImage.setPath("new-image.jpg");
        newImage.setDescription("New image");
        newImage.setPosition(5);

        // When
        imagineService.createImage(newImage);

        // Then
        verify(imagineRepository).save(newImage);
    }

    @Test
    void updateImage_ShouldSaveUpdatedImage() {
        // Given
        Imagine updatedImage = new Imagine();
        updatedImage.setId(1);
        updatedImage.setPath("updated-image.jpg");
        updatedImage.setDescription("Updated description");
        updatedImage.setPosition(3);

        // When
        imagineService.updateImage(updatedImage);

        // Then
        verify(imagineRepository).save(updatedImage);
    }

    @Test
    void findImageById_ShouldReturnImage_WhenExists() {
        // Given
        Integer imageId = 1;
        when(imagineRepository.findById(imageId)).thenReturn(Optional.of(testImage));

        // When
        Imagine result = imagineService.findImageById(imageId);

        // Then
        assertEquals(testImage, result);
        verify(imagineRepository).findById(imageId);
    }

    @Test
    void findImageById_ShouldThrowException_WhenNotExists() {
        // Given
        Integer imageId = 999;
        when(imagineRepository.findById(imageId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> imagineService.findImageById(imageId));
        
        assertTrue(exception.getMessage().contains("Nu s-a gasit imagine cu ID-ul:999"));
        verify(imagineRepository).findById(imageId);
    }

    @Test
    void deleteImage_ShouldDeleteFromRepository_WhenImageExists() {
        // Given
        Integer imageId = 1;
        testImage.setPath("test-image.jpg");
        when(imagineRepository.findById(imageId)).thenReturn(Optional.of(testImage));

        // When
        imagineService.deleteImage(imageId);

        // Then
        verify(imagineRepository).findById(imageId);
        verify(imagineRepository).deleteById(imageId);
    }

    @Test
    void deleteImage_ShouldHandleImageWithNullPath() {
        // Given
        Integer imageId = 1;
        testImage.setPath(null);
        when(imagineRepository.findById(imageId)).thenReturn(Optional.of(testImage));

        // When
        imagineService.deleteImage(imageId);

        // Then
        verify(imagineRepository).findById(imageId);
        verify(imagineRepository).deleteById(imageId);
        // Should not try to delete file when path is null
    }

    @Test
    void deleteImage_ShouldHandleImageWithEmptyPath() {
        // Given
        Integer imageId = 1;
        testImage.setPath("");
        when(imagineRepository.findById(imageId)).thenReturn(Optional.of(testImage));

        // When
        imagineService.deleteImage(imageId);

        // Then
        verify(imagineRepository).findById(imageId);
        verify(imagineRepository).deleteById(imageId);
    }

    @Test
    void createImage_WithDefaultPosition_ShouldWork() {
        // Given
        Imagine newImage = new Imagine();
        newImage.setPath("no-position-image.jpg");
        newImage.setDescription("Image without explicit position");
        // position defaults to 0 in the model

        // When
        imagineService.createImage(newImage);

        // Then
        verify(imagineRepository).save(newImage);
        assertEquals(0, newImage.getPosition()); // Default position should be 0
    }

    @Test
    void updateImage_WithNewPosition_ShouldUpdateCorrectly() {
        // Given
        Imagine existingImage = new Imagine();
        existingImage.setId(1);
        existingImage.setPath("existing.jpg");
        existingImage.setPosition(0);
        
        // Update with new position
        existingImage.setPosition(5);

        // When
        imagineService.updateImage(existingImage);

        // Then
        verify(imagineRepository).save(existingImage);
        assertEquals(5, existingImage.getPosition());
    }

    @Test
    void getAllImages_ShouldReturnEmptyList_WhenNoImages() {
        // Given
        when(imagineRepository.findAllByOrderByPositionAsc()).thenReturn(Arrays.asList());

        // When
        List<Imagine> result = imagineService.getAllImages();

        // Then
        assertTrue(result.isEmpty());
        verify(imagineRepository).findAllByOrderByPositionAsc();
    }
}