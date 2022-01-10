var geodjango_id_geometry = {};
geodjango_id_geometry.fieldid = 'id_geometry';
geodjango_id_geometry.modifiable = true;
geodjango_id_geometry.geom_type = 'Point';
geodjango_id_geometry.srid = 4326;

var lat;
var lng;

function id_geometry_map_callback(map, options) {
    geodjango_id_geometry.store_class = L.FieldStore;
    (new L.GeometryField(geodjango_id_geometry)).addTo(map);

    map.on('draw:created', function(e) {
      layer = e.layer;
      lat = layer.getLatLng().lat;
      lng = layer.getLatLng().lng;
      console.log(lat, lng);


      // give suggestion based on lat lon
      var settings = {
        "url": "https://biolocation.heig-vd.ch:5000/v1/suggest?lat=" + lat + "&lon=" + lng,
        "method": "POST",
        "timeout": 0,

      };

      $.ajax(settings).done(function(response) {

        suggestion = response;
        console.log(suggestion)
        if ($("#second").children().length != 0) {
          //console.log(suggestion[0].sp_name);

          var ids_hidden = ["1", "2", "3", "4", "5"]
          var span_ids = ["11", "12", "13", "14", "15"]
          for (var el of ids_hidden) {
            var eachSug = document.getElementById(el);
            eachSug.value = suggestion[ids_hidden.indexOf(el)].sp_name
          }
          for (var el2 of span_ids) {
            var a = $("#" + el2).find('a')
            //a.innerHTML = suggestion[0].sp_name
            a.text(" " + suggestion[span_ids.indexOf(el2)].sp_name)
            a.attr("href", suggestion[span_ids.indexOf(el2)].url)
          }
        }

      });

      // feedback regarding the location of species when user provides the name of species
      if($("#third").val()!="" && $("#third").hasClass("species_form")){
        // get the user values
          var sp_name = $("#third").val();
          //console.log(selected);
          var settings = {
            "url": "https://biolocation.heig-vd.ch:5000/v1/predict?lat=" + lat + "&lon=" + lng + "&sp_name=" + sp_name,
            "method": "POST",
            "timeout": 0,
          };
          $.ajax(settings).done(function(response){

            if(response['probability of occurrence']<=50){
              sweetAlert({
                title: "Please confirm",
                text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
              percent. This species could be usually observed in ${response.habitat}. Please make sure the location or the species name is added correctly.`,
                icon: "warning",
                dangerMode: true,
              })
              document.getElementById("FlagLocation").value = "true";

            }

            else{
              sweetAlert({
                title: "For your information",
                text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
              percent. This species could be usually observed in ${response.habitat}`,
                icon: "warning",
                dangerMode: true,
              })

              document.getElementById("FlagLocation").value = "false";
            }
          })
      }
      ////////////////////



    });


    map.on('draw:edited', function(e) {
      var layers = e.layers;
      layers.eachLayer(function(layer) {
        lat = layer.getLatLng().lat;
        lng = layer.getLatLng().lng;

        var settings = {
          "url": "https://biolocation.heig-vd.ch:5000/v1/suggest?lat=" + lat + "&lon=" + lng,
          "method": "POST",
          "timeout": 0,
        };

        $.ajax(settings).done(function(response) {
          suggestion = response;
          console.log(suggestion)
          if ($("#second").children().length != 0) {
            //console.log(suggestion[0].sp_name);

            var ids_hidden = ["1", "2", "3", "4", "5"]
            var span_ids = ["11", "12", "13", "14", "15"]
            for (var el of ids_hidden) {
              var eachSug = document.getElementById(el);
              eachSug.value = suggestion[ids_hidden.indexOf(el)].sp_name
            }
            for (var el2 of span_ids) {
              var a = $("#" + el2).find('a')
              //a.innerHTML = suggestion[0].sp_name
              a.text(" " + suggestion[span_ids.indexOf(el2)].sp_name)
              a.attr("href", suggestion[span_ids.indexOf(el2)].url)
            }
          }

        });
      });

      // if user edits the location then the probability of species also will change >> give feedback
      if($("#third").val()!="" && $("#third").hasClass("species_form")){
        // get the user values
          var sp_name = $("#third").val();
          //console.log(selected);
          var settings = {
            "url": "https://biolocation.heig-vd.ch:5000/v1/predict?lat=" + lat + "&lon=" + lng + "&sp_name=" + sp_name,
            "method": "POST",
            "timeout": 0,
          };
          $.ajax(settings).done(function(response){

            if(response['probability of occurrence']<=50){
              sweetAlert({
                title: "Please confirm",
                text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
              percent. This species could be usually observed in ${response.habitat}. Please make sure the location or the species name is added correctly.`,
                icon: "warning",
                dangerMode: true,
              })
              document.getElementById("FlagLocation").value = "true";

            }

            else{
              sweetAlert({
                title: "For your information",
                text: `The probability of observing ${sp_name} in a neighbourhood of 1km around your location is ${response['probability of occurrence']}
              percent. This species could be usually observed in ${response.habitat}`,
                icon: "warning",
                dangerMode: true,
              })

              document.getElementById("FlagLocation").value = "false";
            }
          })
      }
    });

  };

// check probability of occurance


    var option = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 600000
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

        var djoptions = {"srid": null, "extent": [[-90, -180], [90, 180]], "fitextent": true, "center": [46.7833, 6.65], "zoom": 12, "minzoom": 1,  "maxzoom": 18, "zoomFactor": .66, "layers": [["OpenStreenMap", "https://tile.openstreetmap.org/{z}/{x}/{y}.png", {"attribution": "&copy; Contributors"}], ["Satellite", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {"attribution": "&copy; Contributors"}]], "overlays": [], "attributionprefix": "Powered by django-leaflet", "scale": "metric", "minimap": false, "resetview": true, "tilesextent": []};
            options = {djoptions: djoptions, initfunc: loadmap,
                       globals: false, callback: id_geometry_map_callback};
        navigator.geolocation.getCurrentPosition(success, error, option);
    }



    var loadevents = ["load"];
    if (loadevents.length === 0) loadmap();
    else if (window.addEventListener) for (var i=0; i<loadevents.length; i++) window.addEventListener(loadevents[i], loadmap, false);
    else if (window.jQuery) jQuery(window).on(loadevents.join(' '), loadmap);


})();
