package com.museumhistory.service;

import com.museumhistory.model.Administrator;
import com.museumhistory.repository.AdministratorRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdministratorServiceTest {

    @Mock
    private AdministratorRepository administratorRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AdministratorService administratorService;

    private Administrator testAdmin;

    @BeforeEach
    void setUp() {
        testAdmin = new Administrator();
        testAdmin.setId(1);
        testAdmin.setFirstName("Test");
        testAdmin.setLastName("Admin");
        testAdmin.setUsername("testadmin");
        testAdmin.setPassword("plainpassword");
        testAdmin.setEmail("test@admin.com");
    }

    @Test
    void getAllAdministrators_ShouldReturnAllAdmins() {
        // Given
        List<Administrator> expectedAdmins = Arrays.asList(testAdmin);
        when(administratorRepository.findAll()).thenReturn(expectedAdmins);

        // When
        List<Administrator> result = administratorService.getAllAdministrators();

        // Then
        assertEquals(expectedAdmins, result);
        verify(administratorRepository).findAll();
    }

    @Test
    void createAdministrator_ShouldHashPasswordBeforeSaving() {
        // Given
        String plainPassword = "plainpassword";
        String hashedPassword = "$2a$10$hashedpassword";
        testAdmin.setPassword(plainPassword);
        
        when(passwordEncoder.encode(plainPassword)).thenReturn(hashedPassword);

        // When
        administratorService.createAdministrator(testAdmin);

        // Then
        assertEquals(hashedPassword, testAdmin.getPassword());
        verify(passwordEncoder).encode(plainPassword);
        verify(administratorRepository).save(testAdmin);
    }

    @Test
    void updateAdministrator_ShouldHashNewPassword() {
        // Given
        String newPlainPassword = "newpassword";
        String hashedPassword = "$2a$10$newhashedpassword";
        testAdmin.setPassword(newPlainPassword);
        
        when(passwordEncoder.encode(newPlainPassword)).thenReturn(hashedPassword);

        // When
        administratorService.updateAdministrator(testAdmin);

        // Then
        assertEquals(hashedPassword, testAdmin.getPassword());
        verify(passwordEncoder).encode(newPlainPassword);
        verify(administratorRepository).save(testAdmin);
    }

    @Test
    void updateAdministrator_ShouldNotHashAlreadyHashedPassword() {
        // Given
        String alreadyHashedPassword = "$2a$10$existinghashedpassword";
        testAdmin.setPassword(alreadyHashedPassword);

        // When
        administratorService.updateAdministrator(testAdmin);

        // Then
        assertEquals(alreadyHashedPassword, testAdmin.getPassword());
        verify(passwordEncoder, never()).encode(anyString());
        verify(administratorRepository).save(testAdmin);
    }

    @Test
    void updateAdministrator_ShouldNotProcessEmptyPassword() {
        // Given
        testAdmin.setPassword("");

        // When
        administratorService.updateAdministrator(testAdmin);

        // Then
        verify(passwordEncoder, never()).encode(anyString());
        verify(administratorRepository).save(testAdmin);
    }

    @Test
    void deleteAdministrator_ShouldCallRepositoryDelete() {
        // Given
        Integer adminId = 1;

        // When
        administratorService.deleteAdministrator(adminId);

        // Then
        verify(administratorRepository).deleteById(adminId);
    }

    @Test
    void findAdministratorById_ShouldReturnAdmin_WhenExists() {
        // Given
        Integer adminId = 1;
        when(administratorRepository.findById(adminId)).thenReturn(Optional.of(testAdmin));

        // When
        Administrator result = administratorService.findAdministratorById(adminId);

        // Then
        assertEquals(testAdmin, result);
        verify(administratorRepository).findById(adminId);
    }

    @Test
    void findAdministratorById_ShouldThrowException_WhenNotExists() {
        // Given
        Integer adminId = 999;
        when(administratorRepository.findById(adminId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, 
            () -> administratorService.findAdministratorById(adminId));
        
        assertTrue(exception.getMessage().contains("Nu s-a gasit administrator cu ID-ul:999"));
        verify(administratorRepository).findById(adminId);
    }

    @Test
    void authenticate_ShouldReturnTrue_WhenCredentialsValid() {
        // Given
        String username = "testadmin";
        String plainPassword = "plainpassword";
        String hashedPassword = "$2a$10$hashedpassword";
        testAdmin.setPassword(hashedPassword);
        
        when(administratorRepository.findByUsername(username)).thenReturn(Optional.of(testAdmin));
        when(passwordEncoder.matches(plainPassword, hashedPassword)).thenReturn(true);

        // When
        boolean result = administratorService.authenticate(username, plainPassword);

        // Then
        assertTrue(result);
        verify(administratorRepository).findByUsername(username);
        verify(passwordEncoder).matches(plainPassword, hashedPassword);
    }

    @Test
    void authenticate_ShouldReturnFalse_WhenUserNotFound() {
        // Given
        String username = "nonexistent";
        String password = "password";
        
        when(administratorRepository.findByUsername(username)).thenReturn(Optional.empty());

        // When
        boolean result = administratorService.authenticate(username, password);

        // Then
        assertFalse(result);
        verify(administratorRepository).findByUsername(username);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
    }

    @Test
    void authenticate_ShouldReturnFalse_WhenPasswordIncorrect() {
        // Given
        String username = "testadmin";
        String plainPassword = "wrongpassword";
        String hashedPassword = "$2a$10$hashedpassword";
        testAdmin.setPassword(hashedPassword);
        
        when(administratorRepository.findByUsername(username)).thenReturn(Optional.of(testAdmin));
        when(passwordEncoder.matches(plainPassword, hashedPassword)).thenReturn(false);

        // When
        boolean result = administratorService.authenticate(username, plainPassword);

        // Then
        assertFalse(result);
        verify(administratorRepository).findByUsername(username);
        verify(passwordEncoder).matches(plainPassword, hashedPassword);
    }
}