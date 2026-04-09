/* ============================================================
   GEOMIND – script1_0.js
   ============================================================ */

/* ── 1. Menú hamburguesa ── */
const toggle = document.getElementById('menu-toggle');
const menu   = document.getElementById('menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('active');
  }
});


/* ── 2. Lazy loading con IntersectionObserver ── */
document.addEventListener('DOMContentLoaded', () => {

  const lazyImages = document.querySelectorAll('img.lazy');

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const img = entry.target;
      img.src = img.dataset.src;

      img.addEventListener('load', () => {
        img.classList.add('loaded');
      }, { once: true });

      img.addEventListener('error', () => {
        img.classList.add('loaded');
      }, { once: true });

      obs.unobserve(img);
    });
  }, {
    rootMargin: '0px 0px 200px 0px',
    threshold: 0
  });

  lazyImages.forEach(img => observer.observe(img));


  /* ── 3. Lightbox / Popup ── */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightbox-img');
  const lightboxText = document.getElementById('lightbox-text');
  const closeBtn     = document.getElementById('close');
  const downloadBtn  = document.getElementById('download');

  document.querySelector('.masonry').addEventListener('click', (e) => {
    const img = e.target.closest('img');
    if (!img) return;
    lightbox.style.display = 'flex';
    lightboxImg.src  = img.src || img.dataset.src;
    lightboxText.textContent = img.alt;
  });

  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.style.display = 'none';
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.style.display = 'none';
  });

  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');
    link.href = lightboxImg.src;
    const name = lightboxImg.alt
      ? lightboxImg.alt.split(',')[0].trim().replace(/\s+/g, '_')
      : 'geomind_imagen';
    link.download = name + '.jpg';
    link.click();
  });


  /* ── 4. Deep-links redes sociales ── */
  function openWithFallback(deepLink, webUrl) {
    window.location = deepLink;
    setTimeout(() => { window.location = webUrl; }, 500);
  }

  const socialLinks = {
    'facebook-link':  ['fb://page/100002075693941', 'https://www.facebook.com/geoartlibrery/'],
    'instagram-link': ['instagram://user?username=geomindsolutions', 'https://www.instagram.com/geomindsolutions/'],
    'linkedin-link':  ['linkedin://profile/geomind-global-solutions-3484ab399', 'https://www.linkedin.com/in/geomind-global-solutions-3484ab399'],
    'youtube-link':   ['vnd.youtube://channel/UCXXXXXXXX', 'https://www.youtube.com/@GeomindGlobalSolutions'],
    'tiktok-link':    ['tiktok://user/@geomindsolutions', 'https://www.tiktok.com/@geomindsolutions'],
  };

  Object.entries(socialLinks).forEach(([id, [deep, web]]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openWithFallback(deep, web);
    });
  });

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