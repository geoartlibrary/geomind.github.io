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

gsap.registerPlugin(ScrollTrigger);

// Animación en el título
gsap.to("#scramble-heading", {
  duration: 1.5,
  scrambleText: "Soluciones personalizadas de otro nivel",
  scrollTrigger: {
    trigger: "#scramble-demo",
    start: "top 80%",
    toggleActions: "play none none none"
  }
});

// Lista de servicios con sus imágenes
const servicios = [
  { texto: "Informes de intercomparación de resultados", img: "IMAGENES/ilus.png" },
  { texto: "Mapeo geológico multiescala", img: "IMAGENES/geoconnect.png" },
  { texto: "Asesorias personalizadas ", img: "IMAGENES/logo.png" },
  { texto: "Cursos personalizados", img: "IMAGENES/muestreo.png" },
];

// Timeline que recorre todos los servicios y se repite
ScrollTrigger.create({
  trigger: "#scramble-demo",
  start: "top 80%",
  onEnter: () => {
    const tl = gsap.timeline({ repeat: -1 }); // repeat infinito

    servicios.forEach((servicio) => {
      tl.to("#scramble-paragraph", {
        duration: 2,
        scrambleText: {
          text: servicio.texto,
          chars: "XO",
          revealDelay: 0.5,
          speed: 0.3,
          newClass: "myClass"
        },
        onStart: () => {
          const imgElement = document.getElementById("service-image");
          imgElement.style.opacity = 0;
          imgElement.src = servicio.img;
          setTimeout(() => {
            imgElement.style.opacity = 1;
          }, 300);
        }
      }).to({}, { duration: 1 }); // pequeña pausa entre servicios
    });
  }
});

ScrollTrigger.create({
  trigger: "#revista",
  start: "top 80%",
  once: true,
  onEnter: () => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    tl.to("#icon-shape", { duration: 1.2, morphSVG: "#eye" })
      .to("#icon-shape", { duration: 1.2, morphSVG: "#check", delay: 0.8 })
      .to("#icon-shape", { duration: 1.2, morphSVG: "#icon-shape", delay: 0.8 });
  }
});