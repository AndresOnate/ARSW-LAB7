package edu.eci.arsw.blueprints.filter.impl;

import edu.eci.arsw.blueprints.filter.BlueprintFilter;
import edu.eci.arsw.blueprints.model.Blueprint;
import edu.eci.arsw.blueprints.model.Point;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Service
public class RedundancyFilter implements BlueprintFilter {

    @Override
    public Blueprint filterBlueprint(Blueprint bp) {
        List<Point> points = bp.getPoints();
        List<Point> filteredPoints = new ArrayList<>();
        int pointsSize = points.size();
        for (int i = 0; i < points.size() -1; i++) {
            Point currentPoint = points.get(i);
            if (!currentPoint.equals(points.get(i + 1))) {
                filteredPoints.add(currentPoint);
            }
        }
        filteredPoints.add(points.get(pointsSize-1));
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
