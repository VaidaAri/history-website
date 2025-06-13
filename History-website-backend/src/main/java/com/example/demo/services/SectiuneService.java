package com.example.demo.services;

import com.example.demo.models.Postare;
import com.example.demo.models.Sectiune;
import com.example.demo.repos.SectiuneRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SectiuneService {
    @Autowired
    SectiuneRepository sectiuneRepository;
    
    @Autowired
    PostareService postareService;

    public List<Sectiune> getAllSectiuni() {
        return sectiuneRepository.findAll();
    }

    public Sectiune getSectiuneById(Integer id) {
        return sectiuneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Nu s-a găsit secțiunea cu ID-ul: " + id));
    }
    
    public Sectiune getSectiuneByTitlu(String titlu) {
        return sectiuneRepository.findByTitlu(titlu);
    }

    public Sectiune createSectiune(Sectiune sectiune) {
        return sectiuneRepository.save(sectiune);
    }

    public Sectiune updateSectiune(Integer id, Sectiune sectiune) {
        Sectiune existingSectiune = getSectiuneById(id);
        existingSectiune.setTitlu(sectiune.getTitlu());
        existingSectiune.setDescriere(sectiune.getDescriere());
        existingSectiune.setOrdine(sectiune.getOrdine());
        return sectiuneRepository.save(existingSectiune);
    }

    public void deleteSectiune(Integer id) {
        sectiuneRepository.deleteById(id);
    }
    
    public Sectiune adaugaPostare(Integer sectiuneId, Postare postare) {
        Sectiune sectiune = getSectiuneById(sectiuneId);
        postare.setSectiune(sectiune);
        postareService.createPost(postare);
        return getSectiuneById(sectiuneId);
    }
    
    public Sectiune stergePostare(Integer sectiuneId, Integer postareId) {
        Sectiune sectiune = getSectiuneById(sectiuneId);
        postareService.deletePost(postareId);
        return getSectiuneById(sectiuneId);
    }
}