function showMap()
{
    // Creating map options
    var mapOptions = {
    center: [45.06442203607026, 7.659717674490363],
    zoom: 17
    }
    
    // Creating a map object
    var map = new L.map("map", mapOptions);
    
    // Creating a Layer object
    L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

    // Create Marker
    L.marker([45.06435081030144, 7.659214542691698]).addTo(map)

    map.scrollWheelZoom.disable();
} 