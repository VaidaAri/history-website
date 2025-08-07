package com.museumhistory.service;

import com.museumhistory.model.Administrator;
import com.museumhistory.repository.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdministratorService {
    @Autowired
    AdministratorRepository administratorRepository;

    public List<Administrator> getAllAdministrators() {
        return administratorRepository.findAll();
    }

    public void createAdministrator(Administrator newAdministrator){
        administratorRepository.save(newAdministrator);
    }

    public void updateAdministrator(Administrator updatedAdministrator){
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
        Optional<Administrator> admin = administratorRepository.findByUsernameAndPassword(username, password);
        return admin.isPresent();
    }
}
