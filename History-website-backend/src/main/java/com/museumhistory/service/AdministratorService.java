package com.museumhistory.service;

import com.museumhistory.model.Administrator;
import com.museumhistory.repository.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministratorService {
    @Autowired
    private AdministratorRepository administratorRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Administrator> getAllAdministrators() {
        return administratorRepository.findAll();
    }

    public void createAdministrator(Administrator newAdministrator){
        // Hash the password before saving
        newAdministrator.setPassword(passwordEncoder.encode(newAdministrator.getPassword()));
        administratorRepository.save(newAdministrator);
    }

    public void updateAdministrator(Administrator updatedAdministrator){
        // If password is being updated, hash it
        if (updatedAdministrator.getPassword() != null && !updatedAdministrator.getPassword().isEmpty()) {
            // Check if password is already hashed (starts with $2a$ for BCrypt)
            if (!updatedAdministrator.getPassword().startsWith("$2a$")) {
                updatedAdministrator.setPassword(passwordEncoder.encode(updatedAdministrator.getPassword()));
            }
        }
        administratorRepository.save(updatedAdministrator);
    }

    public void deleteAdministrator(Integer administratorId){
        administratorRepository.deleteById(administratorId);
    }

    public Administrator findAdministratorById(Integer administratorId){
        return administratorRepository.findById(administratorId)
                .orElseThrow(()
                        -> new RuntimeException("Nu s-a gasit administrator cu ID-ul:" + administratorId));

    }

    public boolean authenticate(String username, String password) {
        Optional<Administrator> admin = administratorRepository.findByUsername(username);
        if (admin.isPresent()) {
            return passwordEncoder.matches(password, admin.get().getPassword());
        }
        return false;
    }
}
