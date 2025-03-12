let dataPath = "data/Building_Footprints.geojson";

let myMap = L.map("map", {
    center: [ 38.915238198858177, -77.069972753095968],
    zoom: 13
  });
  
  // Adding a tile layer (the background map image) to our map:
  // We use the addTo() method to add objects to our map.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);



function getPolygonCenter(coordinates) {
  let totalLat = 0, totalLng = 0, count = 0;

  coordinates[0].forEach(coord => {
    totalLng += coord[0];  // Longitude
    totalLat += coord[1];  // Latitude
    count++;
  });

  return [totalLat / count, totalLng / count]; // [avgLat, avgLng]
}

d3.json(dataPath).then(function (data) {

    // Once we get a response, send the data.features object to the createFeatures function.
    L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        let gis_id = feature.properties.GIS_ID;
        let obj_id = feature.properties.OBJECTID;
        let coordinates = feature.geometry.coordinates;
        
        // Compute center of the polygon
        let centerLatLng = getPolygonCenter(coordinates);
      
        // Add a marker at the computed center
        L.marker(centerLatLng)
          .addTo(myMap)
          .bindPopup(`<h3>${gis_id}</h3><h3>${centerLatLng}</h3><hr><p>Obj ID: ${obj_id}</p>`);
        
      },
      style: function(feature) {
        return {
          color: "black",
          fillColor: "green",
          fillOpacity: 0.5,
          weight: 1.5
        };
      }
    }).addTo(myMap);
  });
  