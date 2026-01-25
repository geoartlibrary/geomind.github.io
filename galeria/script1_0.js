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
// fallback
document.addEventListener("DOMContentLoaded", () => {
  function openWithFallback(deepLink, webUrl) {
    // Intenta abrir la app
    window.location = deepLink;
    // Si falla, abre la versión web
    setTimeout(() => {
      window.location = webUrl;
    }, 500);
  }

  document.getElementById("facebook-link").addEventListener("click", (e) => {
    e.preventDefault();
    openWithFallback("fb://page/100002075693941", "https://www.facebook.com/geoartlibrery/");
  });

  document.getElementById("instagram-link").addEventListener("click", (e) => {
    e.preventDefault();
    openWithFallback("instagram://user?username=geomindsolutions", "https://www.instagram.com/geomindsolutions/");
  });

  document.getElementById("linkedin-link").addEventListener("click", (e) => {
    e.preventDefault();
    openWithFallback("linkedin://profile/geomind-global-solutions-3484ab399", "https://www.linkedin.com/in/geomind-global-solutions-3484ab399");
  });

  document.getElementById("youtube-link").addEventListener("click", (e) => {
    e.preventDefault();
    openWithFallback("vnd.youtube://channel/UCXXXXXXXX", "https://www.youtube.com/@GeomindGlobalSolutions");
    // ⚠️ Reemplaza UCXXXXXXXX con el ID real de tu canal
  });

  document.getElementById("tiktok-link").addEventListener("click", (e) => {
    e.preventDefault();
    openWithFallback("tiktok://user/@geomindsolutions", "https://www.tiktok.com/@geomindsolutions");
  });
});



