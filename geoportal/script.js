
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

document.addEventListener("DOMContentLoaded", () => {
  const map = L.map('mapa-base', {
    center: [-0.1807, -78.4678], // Quito
    zoom: 12,
    minZoom: 6,
    maxZoom: 18,
    zoomControl: false
  });

  // Esri World Topographic Map
  const esriTopo = L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    {
      maxZoom: 19,
      attribution: 'Tiles © Esri — Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), MapmyIndia, TomTom'
    }
  );

  esriTopo.addTo(map);

  // Recalcular tamaño y centrar
  window.addEventListener("load", () => {
    map.invalidateSize();
    map.setView([-0.1807, -78.4678], 12);
  });

  // Marcador en Quito
  L.marker([-0.1807, -78.4678]).addTo(map)
    .bindPopup("<b>Quito</b><br>Capital de Ecuador")
    .openPopup();
});
