
var map = L.map('map').setView([46.7833, 6.65], 14);
        //var marker = L.marker([46.7833, 6.65]).addTo(map);
      mapLink =
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
            }).addTo(map);
