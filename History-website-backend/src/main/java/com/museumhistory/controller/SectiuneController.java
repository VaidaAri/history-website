package com.museumhistory.controller;

import com.museumhistory.model.Postare;
import com.museumhistory.model.Sectiune;
import com.museumhistory.service.SectiuneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sectiuni")
public class SectiuneController {

    @Autowired
    private SectiuneService sectiuneService;

    @GetMapping
    public List<Sectiune> getAllSectiuni() {
        return sectiuneService.getAllSectiuni();
    }

    @GetMapping("/{id}")
    public Sectiune getSectiuneById(@PathVariable Integer id) {
        return sectiuneService.getSectiuneById(id);
    }
    
    @GetMapping("/titlu/{titlu}")
    public Sectiune getSectiuneByTitlu(@PathVariable String titlu) {
        return sectiuneService.getSectiuneByTitlu(titlu);
    }

    @PostMapping
    public Sectiune createSectiune(@RequestBody Sectiune sectiune) {
        return sectiuneService.createSectiune(sectiune);
    }

    @PutMapping("/{id}")
    public Sectiune updateSectiune(@PathVariable Integer id, @RequestBody Sectiune sectiune) {
        return sectiuneService.updateSectiune(id, sectiune);
    }

    @DeleteMapping("/{id}")
    public void deleteSectiune(@PathVariable Integer id) {
        sectiuneService.deleteSectiune(id);
    }
    
    @PostMapping("/{sectiuneId}/postari")
    public Sectiune adaugaPostare(@PathVariable Integer sectiuneId, @RequestBody Postare postare) {
        return sectiuneService.adaugaPostare(sectiuneId, postare);
    }
    
    @DeleteMapping("/{sectiuneId}/postari/{postareId}")
    public Sectiune stergePostare(@PathVariable Integer sectiuneId, @PathVariable Integer postareId) {
        return sectiuneService.stergePostare(sectiuneId, postareId);
    }
}