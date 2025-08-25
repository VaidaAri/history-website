package com.museumhistory.config;

import com.museumhistory.model.Administrator;
import com.museumhistory.repository.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class PasswordMigrationScript implements CommandLineRunner {

    @Autowired
    private AdministratorRepository administratorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔧 Starting password migration...");
        
        List<Administrator> admins = administratorRepository.findAll();
        
        for (Administrator admin : admins) {
            String currentPassword = admin.getPassword();
            
            // Check if password is already hashed (BCrypt hashes start with $2a$)
            if (!currentPassword.startsWith("$2a$")) {
                System.out.println("📝 Migrating password for user: " + admin.getUsername());
                
                // Hash the plain text password
                String hashedPassword = passwordEncoder.encode(currentPassword);
                admin.setPassword(hashedPassword);
                
                administratorRepository.save(admin);
                
                System.out.println("✅ Password migrated for user: " + admin.getUsername());
            } else {
                System.out.println("⏭️  Password already hashed for user: " + admin.getUsername());
            }
        }
        
        System.out.println("🎉 Password migration completed!");
    }
}