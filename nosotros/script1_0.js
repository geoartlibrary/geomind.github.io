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
// script.js
document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('hero-track');
  const slides = document.querySelectorAll('.hero-slide');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  let index = 0;

  function updateSlide() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  next.addEventListener('click', () => {
    index = (index + 1) % slides.length;
    updateSlide();
  });

  prev.addEventListener('click', () => {
    index = (index - 1 + slides.length) % slides.length;
    updateSlide();
  });
});

 // seccion carrusel
let index = 0;
const contents = document.querySelectorAll(".hero-content");
const dots = document.querySelectorAll(".dot");
const hero = document.querySelector(".hero");

function showContent(n) {
  contents.forEach(c => c.classList.remove("active"));
  dots.forEach(d => d.classList.remove("active"));

  contents[n].classList.add("active");
  dots[n].classList.add("active");

  // Cambiar fondo según el atributo data-bg
  const bg = contents[n].getAttribute("data-bg");
  hero.style.background = `url("${bg}") no-repeat center center/cover`;
}

document.querySelector(".next").addEventListener("click", () => {
  index = (index + 1) % contents.length;
  showContent(index);
});

document.querySelector(".prev").addEventListener("click", () => {
  index = (index - 1 + contents.length) % contents.length;
  showContent(index);
});

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i;
    showContent(index);
  });
});

// Mostrar la primera sección al cargar
showContent(index);

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