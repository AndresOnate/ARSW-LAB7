/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.controllers;

import java.util.LinkedHashSet;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;

import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.persistence.BlueprintNotFoundException;
import edu.eci.arsw.blueprints.persistence.BlueprintPersistenceException;
import edu.eci.arsw.blueprints.services.BlueprintsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 *
 * @author hcadavid
 */
@RestController
@RequestMapping(value = "/blueprints")
public class BlueprintAPIController {

    @Autowired
    BlueprintsServices bps;


    @RequestMapping(method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBlueprints() {
        try {
            Set<Blueprint> data = bps.getAllBlueprints();
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        } catch (BlueprintNotFoundException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error", HttpStatus.NOT_FOUND);
        }
    }


    @RequestMapping(path = "/{author}", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBlueprintByAuthor(@PathVariable String author) throws BlueprintNotFoundException {
        Set<Blueprint> data = bps.getBlueprintsByAuthor(author);
        if (!data.isEmpty()) {
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);

        }
        return new ResponseEntity<>("El autor no existe", HttpStatus.NOT_FOUND);
    }

    @RequestMapping(path = "/{author}/{bpname}" , method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBlueprintByAuthorAndName(@PathVariable String author,@PathVariable String bpname ) throws BlueprintNotFoundException {
        Blueprint data = bps.getBlueprint(author, bpname);
        if (data != null) {
            return new ResponseEntity<>(data, HttpStatus.ACCEPTED);
        }
        return new ResponseEntity<>("El autor o el plano no existe", HttpStatus.NOT_FOUND);
    }

    @RequestMapping(method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> postBluePrint(@RequestBody Blueprint blueprint){
        try {
            bps.addNewBlueprint(blueprint);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (BlueprintPersistenceException ex) {
            Logger.getLogger(BlueprintAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>("Error",HttpStatus.BAD_REQUEST);
        }

    }

    @RequestMapping(path = "/{author}/{bpname}", method = RequestMethod.PUT,produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> putBlueprint(@PathVariable String author, @PathVariable String bpname, @RequestBody Blueprint bp) throws BlueprintNotFoundException {
        Blueprint blueprint = bps.getBlueprint(author, bpname);
        if(blueprint != null){
            blueprint.setAuthor(bp.getAuthor());
            blueprint.setName(bp.getName());
            blueprint.setPoints(bp.getPoints());
            return new ResponseEntity<>(HttpStatus.CREATED);
        }
        return new ResponseEntity<>("Error",HttpStatus.BAD_REQUEST);

    }
}
