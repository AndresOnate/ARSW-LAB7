package edu.eci.arsw.blueprints.filter.impl;

import edu.eci.arsw.blueprints.filter.BlueprintFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class SubsamplingFilter implements BlueprintFilter {

    @Override
    public Blueprint filterBlueprint(Blueprint bp) {
        List<Point> points = bp.getPoints();
        List<Point> filteredPoints = new ArrayList<>();
        for (int i = 0; i < points.size(); i += 2) {
            filteredPoints.add(points.get(i));
        }
        bp.setPoints(filteredPoints);
        return bp;
    }

    @Override
    public Set<Blueprint> filterBlueprints(Set<Blueprint> blueprints) {
        Set<Blueprint> filteredBlueprints = new HashSet<>();
        for (Blueprint bp : blueprints) {
            Blueprint filteredBlueprint = filterBlueprint(bp);
            filteredBlueprints.add(filteredBlueprint);
        }
        return filteredBlueprints;
    }


}
