// menú SOLO PC
window.addEventListener("load", () => {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);

  if (isMobile) {
    document.getElementById("nota-movil").classList.remove("hidden");
  }
});


// Selecciona el botón hamburguesa y el menú
const toggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

// Evento para abrir/cerrar menú
toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});
// Cerrar menú al hacer clic fuera
document.addEventListener("click", (event) => {
  const isClickInsideMenu = menu.contains(event.target);
  const isClickOnToggle = toggle.contains(event.target); // usar la misma variable

  if (!isClickInsideMenu && !isClickOnToggle) {
    menu.classList.remove("active");
  }
});
// asidE
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar = document.getElementById("sidebar");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
});




window.addEventListener("load", () => {
  const map = L.map('mapa-base', {
    center: [-1.8312, -78.1834], // Ecuador
    zoom: 7,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: false
  });

  // Capas base
  const esriTopo = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19 }
  ).addTo(map);

  const esriSat = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19 }
  );

  const osmDark = L.tileLayer(
    'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    {
      subdomains: ['a','b','c','d'],
      maxZoom: 20,
      attribution: '&copy; OSM & CARTO'
    }
  );

  // ✅ Capa WMS de Cobertura de la Tierra y Biota (IGM Ecuador)
  const biota = L.tileLayer.wms(
    "https://www.geoportaligm.gob.ec/arcgis/services/Cartografia/Cobertura_Tierra_Biota/MapServer/WMSServer",
    {
      layers: '0',              // número de capa dentro del servicio
      format: 'image/png',
      transparent: true,
      attribution: '© IGM Ecuador'
    }
  );

  // ✅ Control de capas de Leaflet (solo bases)
  L.control.layers(
    {
      "Esri Topo": esriTopo,
      "Esri Satélite": esriSat,
      "OSM Oscuro": osmDark
    },
    null,
    { position: 'topright' }
  ).addTo(map);

  // Control de zoom
  L.control.zoom({ position: 'topright' }).addTo(map);

  // Escala
  L.control.scale({ position: 'bottomleft', imperial: false, maxWidth: 200 }).addTo(map);

  // Coordenadas UTM dinámicas
  const coordDiv = L.control({position: 'bottomleft'});
  coordDiv.onAdd = function () {
    this._div = L.DomUtil.create('div', 'coord-info');
    this.update();
    return this._div;
  };
  coordDiv.update = function (text) {
    this._div.innerHTML = text || 'Mueve el puntero para ver UTM';
  };
  coordDiv.addTo(map);

  function getUTMZone(lat, lon) {
    const zone = Math.floor((lon + 180) / 6) + 1;
    const hemisphere = lat >= 0 ? 'N' : 'S';
    return { zone, hemisphere };
  }

  map.on('mousemove', function(e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;
    const { zone, hemisphere } = getUTMZone(lat, lon);

    const projStr = `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
    const utmCoord = proj4(projStr, [lon, lat]);
    const easting = utmCoord[0].toFixed(2);
    const northing = utmCoord[1].toFixed(2);

    coordDiv.update(`<b>UTM ${zone}${hemisphere}</b><br>E: ${easting} m<br>N: ${northing} m`);
  });

  

  // ✅ Vincular checkbox del aside para Biota
  document.getElementById("toggle-hidrologia").addEventListener("change", e => {
    e.target.checked ? map.addLayer(biota) : map.removeLayer(biota);
  });
});
