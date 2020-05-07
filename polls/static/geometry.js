var geodjango_id_geometry = {};
geodjango_id_geometry.fieldid = 'id_geometry';
geodjango_id_geometry.modifiable = true;
geodjango_id_geometry.geom_type = 'Point';
geodjango_id_geometry.srid = 4326;

function id_geometry_map_callback(map, options) {
    geodjango_id_geometry.store_class = L.FieldStore;
    (new L.GeometryField(geodjango_id_geometry)).addTo(map);
};

    var option = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 10000
    };

    function success(pos) {
    var crd = pos.coords;
    lat = crd.latitude;
    lon = crd.longitude;
    map = L.Map.djangoMap('id_geometry-map', options).setView([lat, lon],18);
    console.log("got the location");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`Accuracy: ${crd.accuracy} meters more or less.`);


    }

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
      map = L.Map.djangoMap('id_geometry-map', options).setView([46.781178, 6.636813399],12);
      console.log("location not authorized or timeout");
    }




(function () {


    function loadmap() {

        var djoptions = {"srid": null, "extent": [[-90, -180], [90, 180]], "fitextent": true, "center": [46.7833, 6.65], "zoom": 12, "minzoom": 1, "maxzoom": 19, "zoomFactor": .66, "layers": [["OpenStreenMap", "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {"attribution": "&copy; Contributors"}], ["Satellite", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {"attribution": "&copy; Contributors"}]], "overlays": [], "attributionprefix": "Powered by django-leaflet", "scale": "metric", "minimap": false, "resetview": true, "tilesextent": []};
            options = {djoptions: djoptions, initfunc: loadmap,
                       globals: false, callback: id_geometry_map_callback};
        navigator.geolocation.getCurrentPosition(success, error, option);


    }



    var loadevents = ["load"];
    if (loadevents.length === 0) loadmap();
    else if (window.addEventListener) for (var i=0; i<loadevents.length; i++) window.addEventListener(loadevents[i], loadmap, false);
    else if (window.jQuery) jQuery(window).on(loadevents.join(' '), loadmap);

})();
