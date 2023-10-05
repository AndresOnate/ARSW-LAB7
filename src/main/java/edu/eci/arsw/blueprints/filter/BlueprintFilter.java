/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.blueprints.filter;

import edu.eci.arsw.blueprints.model.Blueprint;

import java.util.Set;

/**
 *
 * @author Andres Oñate
 */
public interface BlueprintFilter {

    /**
     * @param bp  Blueprint to filter
     * @return Filtered Blueprint
     */
    public Blueprint filterBlueprint(Blueprint bp);

    /**
     * @param blueprints The set of blueprints to filter
     * @return A filtered set of blueprints
     */
    Set<Blueprint> filterBlueprints(Set<Blueprint> blueprints);


}
