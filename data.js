const fs = require('fs');
const turf = require("@turf/turf");

const ENCLOSING_AREA_FILE = "./inputs/area_surface.geojson";
const BUILDINGS_FILE = "./inputs/building_footprints.geojson";
const SOLAR_PANELS_FILE = "./inputs/solar_panels.geojson";
const HIGH_POTENTIALS_FILE = "./inputs/high_potentials.geojson";

const ENCLOSING_AREA_FILE_OUT = "./outputs/area_surface.geojson";
const BUILDINGS_FILE_OUT = "./outputs/building_footprints.geojson";
const SOLAR_PANELS_FILE_OUT = "./outputs/solar_panels.geojson";
const HIGH_POTENTIALS_FILE_OUT = "./outputs/high_potentials.geojson";

var enclosing = JSON.parse(fs.readFileSync(ENCLOSING_AREA_FILE, {encoding: 'utf8'}));
var buildings = JSON.parse(fs.readFileSync(BUILDINGS_FILE, {encoding: 'utf8'}));
var solar_panels = JSON.parse(fs.readFileSync(SOLAR_PANELS_FILE, {encoding: 'utf8'}));
var high_potentials = JSON.parse(fs.readFileSync(HIGH_POTENTIALS_FILE, {encoding: 'utf8'}));


enclosing.features.forEach((feature) => {

    feature.properties.total_rooftop_area = 0;
    feature.properties.total_solar_panel_area = 0;
    feature.properties.total_potential_area = 0;
    feature.properties.munich_kwh = 0;
    feature.properties.total_potential_kwh_year = 0;
    feature.properties.total_solar_kwh_year = 0;
    feature.properties.total_estimated_cost = 0;
    
    buildings.features.forEach((building) => {

        //rooftop area
        var area = turf.area(building)
        building.properties.rooftop_area = area
        feature.properties.total_rooftop_area += area;

        building.properties.kwh_year = (area/(10*1.5))*1000;
        feature.properties.munich_kwh += building.properties.kwh_year;
        building.properties.kwp = (area/(10*1.5));
        building.properties.estimated_cost =(area / 1.5 * 200)
        feature.properties.total_estimated_cost += building.properties.estimated_cost;
    })

    solar_panels.features.forEach(solar_panel =>{
        var area = turf.area(solar_panel)
        solar_panel.properties.area = area
        feature.properties.total_solar_panel_area += area;
        solar_panel.properties.kwh_year = (area/(10*1.5))*1000;
        solar_panel.properties.kwp = (area/(10*1.5));
        feature.properties.total_solar_kwh_year += solar_panel.properties.kwh_year;
    })

    high_potentials.features.forEach(high_potential => {
        var area = turf.area(high_potential)
        high_potential.properties.area = area
        feature.properties.total_potential_area += area;
        high_potential.properties.kwh_year = (area/(1.5))*1000;
        high_potential.properties.kwp = (area/(10*1.5));
        feature.properties.total_potential_kwh_year += high_potential.properties.kwh_year;
    })

    console.log(feature.properties.total_rooftop_area)
    console.log(feature.properties.total_solar_panel_area)
    console.log(feature.properties.total_potential_area)
    console.log(feature.properties.munich_kwh)
    console.log(feature.properties.total_solar_kwh_year)
    console.log(feature.properties.total_estimated_cost)

})

fs.writeFileSync(ENCLOSING_AREA_FILE_OUT, JSON.stringify(enclosing), {encoding: 'utf8'})
fs.writeFileSync(BUILDINGS_FILE_OUT, JSON.stringify(buildings), {encoding: 'utf8'})
fs.writeFileSync(SOLAR_PANELS_FILE_OUT, JSON.stringify(solar_panels), {encoding: 'utf8'})
fs.writeFileSync(HIGH_POTENTIALS_FILE_OUT, JSON.stringify(high_potentials), {encoding: 'utf8'})
