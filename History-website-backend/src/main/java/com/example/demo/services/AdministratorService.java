package com.example.demo.services;

import com.example.demo.models.Administrator;
import com.example.demo.repos.AdministratorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void updateAdministrator(Administrator newAdministrator){
        administratorRepository.save(newAdministrator);
    }

    public void deleteAdministrator(Integer administratorId){
        administratorRepository.deleteById(administratorId);
    }

    public Administrator findAdministratorById(Integer administratorId){
        return administratorRepository.findById(administratorId)
                .orElseThrow(()
                        -> new RuntimeException("Nu s-a gasit administrator cu ID-ul:" + administratorId));

    }
}
