let dataPath = "data/Building_Footprints.geojson";

let myMap = L.map("map", {
    center: [
    37.09, -95.71
    ],
    zoom: 5
});


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

  

// Perform a GET request to the query URL/
d3.json(dataPath).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  L.geoJson(data, {
    onEachFeature: function (feature, layer) {
      let neighborhood = feature.properties.neighborhood;
      let borough = feature.properties.borough;
      let coordinates = feature.geometry.coordinates;
      
      // Compute center of the polygon
      let centerLatLng = getPolygonCenter(coordinates);
    
      // Add a marker at the computed center
      L.marker(centerLatLng)
        .addTo(myMap)
        .bindPopup(`<h3>${neighborhood}</h3><p>Borough: ${borough}</p>`);
      layer.bindPopup(`<h3>Layer Pop: ${neighborhood}</h3><p>Borough: ${borough}</p>`);
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

