
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
  const map = L.map('mapa-base').setView([-0.1807, -78.4678], 13);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19
}).addTo(map);



  // Forzar recalculado del tamaño del mapa
  setTimeout(() => {
    map.invalidateSize();
  }, 500);

  // Marcador en Quito
  L.marker([-0.1807, -78.4678]).addTo(map)
    .bindPopup("<b>Quito</b><br>Capital de Ecuador")
    .openPopup();
});
