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

// Animación en el título (se ejecuta directamente)
gsap.to("#scramble-heading", {
  duration: 1.5,
  scrambleText: "Soluciones personalizadas de otro nivel"
});

// Lista de servicios con sus imágenes
const servicios = [
  { texto: "Informes de intercomparación de resultados", img: "IMAGENES/informes.jpg" },
  { texto: "Mapeo geológico multiescala", img: "IMAGENES/mapa.jpg" },
  { texto: "Asesorias personalizadas", img: "IMAGENES/asesorias.jpg" },
  { texto: "Cursos personalizados", img: "IMAGENES/cursos.jpg" },
];

// Timeline que recorre todos los servicios y se repite infinito
const tl = gsap.timeline({ repeat: -1 });

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
  }).to({}, { duration: 1 }); // pausa entre servicios
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

// Animación GSAP para ocultar/mostrar navbar según scroll
const showAnim = gsap.from('.main-tool-bar', { 
  yPercent: -100,
  paused: true,
  duration: 0.2
}).progress(1);

ScrollTrigger.create({
  start: "top top",
  end: "max",
  onUpdate: (self) => {
    self.direction === -1 ? showAnim.play() : showAnim.reverse();
  }
});



(function(){
  const zones=[
    {city:"Saskatchewan", tz:"America/Regina",       flag:"🇨🇦"},
    {city:"México",        tz:"America/Mexico_City",  flag:"🇲🇽"},
    {city:"Quito",         tz:"America/Guayaquil",    flag:"🇪🇨"},
    {city:"Madrid",        tz:"Europe/Madrid",         flag:"🇪🇸"}
  ];

  const wrap=document.getElementById("cm");
  if(!wrap) return;

  zones.forEach(z=>{
    const id="cm-"+z.tz.replace(/\//g,"-");
    const item=document.createElement("div");
    item.className="cm-item";
    item.innerHTML=
      `<span class="cm-flag">${z.flag}</span>`+
      `<div class="cm-info">`+
        `<div class="cm-city">${z.city}</div>`+
        `<div class="cm-time" id="${id}">--:--:--</div>`+
      `</div>`;
    wrap.appendChild(item);
  });

  function tick(){
    const now=new Date();
    zones.forEach(z=>{
      const el=document.getElementById("cm-"+z.tz.replace(/\//g,"-"));
      if(el) el.textContent=now.toLocaleTimeString("es-ES",{
        timeZone:z.tz,
        hour:"2-digit",
        minute:"2-digit",
        second:"2-digit",
        hour12:false
      });
    });
  }

  tick();
  setInterval(tick,1000);
})();

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin, MorphSVGPlugin);

// ── Scramble H2 ──────────────────────────────────────────────
gsap.to("h2.revista-text", {
  duration: 2,
  scrambleText: {
    text: "MEDIO DIGITAL DE DIVULGACIÓN CIENTÍFICA",
    chars: "upperAndLowerCase",
    revealDelay: 0.3,
    speed: 0.8
  },
  ease: "power2.out",
  scrollTrigger: {
    trigger: "#revista",        // ← sección contenedora
    start: "top 75%",           // se activa cuando el top de #revista llega al 75% del viewport
    toggleActions: "play none none none"
  }
});

// ── SplitText manual + animación H1 ──────────────────────────
const h1El = document.querySelector("h1.revista-text");
if (h1El) {
  const words = h1El.textContent.trim().split(/\s+/);
  h1El.innerHTML = words
    .map(w => `<span class="word-span" style="display:inline-block; margin-right:0.25em">${w}</span>`)
    .join("");

  gsap.from(".word-span", {
    duration: 1.5,
    opacity: 0,
    x: () => gsap.utils.random(-300, 300),
    y: () => gsap.utils.random(-200, 200),
    stagger: 0.1,
    ease: "expo.out",
    scrollTrigger: {
      trigger: "#revista",      // ← misma sección
      start: "top 75%",
      toggleActions: "play none none none"
    }
  });
}