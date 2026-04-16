// ─── Nota móvil ──────────────────────────────────────────────────────────────
window.addEventListener("load", () => {
  const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  if (isMobile) document.getElementById("nota-movil").classList.remove("hidden");
});

// ─── Navbar hamburguesa ───────────────────────────────────────────────────────
const toggle = document.getElementById('menu-toggle');
const menu   = document.getElementById('menu');

toggle.addEventListener('click', () => menu.classList.toggle('active'));

document.addEventListener("click", (event) => {
  if (!menu.contains(event.target) && !toggle.contains(event.target)) {
    menu.classList.remove("active");
  }
});

// ─── Sidebar toggle ───────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("sidebar-toggle");
  const sidebar   = document.getElementById("sidebar");
  toggleBtn.addEventListener("click", () => sidebar.classList.toggle("active"));
});

// ─── ACORDION ───────────────────────────────────────────────────────────
document.querySelectorAll(".accordion-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const content = btn.nextElementSibling;
    content.classList.toggle("active");
  });
});

// ─── POP PARA LA LEYENDA ───────────────────────────────────────────────────────────
// Crear modal dinámico
function showLegend(layerId, legendUrls) {
  const modal = document.createElement("div");
  modal.className = "legend-modal";

  // Si hay varias imágenes, separarlas por comas en el atributo data-legend
  const urls = legendUrls.split(",");
  const content = urls.map(url =>
    `<img src="${url.trim()}" alt="Leyenda de ${layerId}" style="max-width:100%; margin:8px 0;">`
  ).join("");

  modal.innerHTML = `
    <div class="legend-modal-content">
      <h3>Leyenda - ${layerId}</h3>
      ${content}
      <button class="legend-close">Cerrar</button>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = "flex";

  modal.querySelector(".legend-close").addEventListener("click", () => {
    document.body.removeChild(modal);
  });
}
document.querySelectorAll(".legend-link").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // evita que el navegador recargue la página
    const layerId   = link.getAttribute("data-layer");
    const legendUrl = link.getAttribute("data-legend");
    showLegend(layerId, legendUrl);
  });
});


// ─── Mapa + Herramienta de captura ───────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  const map = L.map('mapa-base', {
    center: [-1.8312, -78.1834],
    zoom: 7,
    minZoom: 5,
    maxZoom: 18,
    zoomControl: false,
    doubleClickZoom: false   // CRÍTICO: evita que dblclick consuma clics simples
  });

  L.tileLayer(
    'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
    { maxZoom: 19 }
  ).addTo(map);

const volcanes = L.esri.featureLayer({
      url: "https://services4.arcgis.com/QdHwhlbx61LR3TWb/arcgis/rest/services/GVP_Volcano_List_Holocene_URL/FeatureServer/0",
      pointToLayer: function (geojson, latlng) {
        return L.circleMarker(latlng, {
          radius: 6,
          fillColor: "red",
          color: "#fff",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          layer.bindPopup(
            "<b>Volcán:</b> " + feature.properties.Volcano_Name + "<br>" +
            "<b>País:</b> " + feature.properties.Country + "<br>" +
            "<b>Lat:</b> " + feature.properties.Latitude + "<br>" +
            "<b>Lon:</b> " + feature.properties.Longitude
          );
        }
      }
    });

    const geologyLayer = L.tileLayer.wms(
      "https://mapsref.brgm.fr/wxs/1GG/CGMW_Bedrock_and_Structural_Geology?",
      {
        layers: 'World_CGMW_50M_Geology', // nombre de la capa según GetCapabilities
        format: 'image/png',
        transparent: true,   // importante para ver la base debajo
        version: '1.3.0',
        attribution: 'BRGM · CGMW Bedrock & Structural Geology'
      }
    );
    const geologysudamerica = L.tileLayer.wms(
      "https://srvags.sgc.gov.co/arcgis/services/Mapa_Geologico_Sur_America/GeologicalMapSouthAmerican/MapServer/WmsServer?",
      {
        layers: '8', // nombre de la capa según GetCapabilities
        format: 'image/png',
        transparent: true,
        version: '1.3.0',
        attribution: 'SGC · Mapa Geológico de Suramérica'
      }
    );
    // Capa en teselas de ArcGIS REST (TilesOnly)

const critMinLayer = L.esri.featureLayer({
      url: "https://services1.arcgis.com/SR1muQK0r6SVF2nb/arcgis/rest/services/Global_Critical_Minerals/FeatureServer/0",
      pointToLayer: function (geojson, latlng) {
        return L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#ff7800",
          color: "#000",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        if (feature.properties) {
          layer.bindPopup(
            "<b>" + (feature.properties.DEPOSIT_NAME || "Sin nombre") + "</b><br>" +
            "Mineral: " + (feature.properties.CRITICAL_MINERAL || "N/A") + "<br>" +
            "Tipo: " + (feature.properties.DEPOSIT_TYPE || "N/A") + "<br>" +
            "Ubicación: " + (feature.properties.LOCATION || "")
          );
        }
      }
    });

// ── COLORES POR EDAD (USGS/FGDC estándar) ──────────────────────────────────
const ageColors = {
  // Cenozoico
  "Holocene":        "#ffff99",
  "Quaternary":      "#f9f972",
  "Pleistocene":     "#fff2ae",
  "Pliocene":        "#ffe569",
  "Neogene":         "#ffcc66",
  "Miocene":         "#ffb347",
  "Oligocene":       "#ff9933",
  "Eocene":          "#ff8000",
  "Paleocene":       "#e67300",
  "Paleogene":       "#e07000",
  "Tertiary":        "#ffbb66",
  // Límites
  "Cretaceous-Tertiary":   "#d4f0a0",
  "Cretaceous-Paleogene":  "#c8eda0",
  // Mesozoico
  "Cretaceous":      "#80e880",
  "Late Cretaceous": "#66d966",
  "Early Cretaceous":"#99f099",
  "Jurassic":        "#00c8a0",
  "Late Jurassic":   "#00b890",
  "Middle Jurassic": "#00a882",
  "Early Jurassic":  "#00d8b0",
  "Triassic":        "#8fd9b6",
  "Late Triassic":   "#7dcaa6",
  "Middle Triassic": "#6cbb96",
  "Early Triassic":  "#a0e0c0",
  "Mesozoic":        "#b3f0d9",
  // Paleozoico
  "Permian":         "#e8a090",
  "Pennsylvanian":   "#c8a0d0",
  "Mississippian":   "#a890d0",
  "Carboniferous":   "#b898d0",
  "Devonian":        "#c8b870",
  "Silurian":        "#b8d890",
  "Ordovician":      "#00b890",
  "Cambrian":        "#70c880",
  "Paleozoic":       "#a0b8e0",
  // Precámbrico
  "Neoproterozoic":  "#ff99cc",
  "Mesoproterozoic": "#ff66aa",
  "Paleoproterozoic":"#e6007a",
  "Proterozoic":     "#ff80bb",
  "Archean":         "#c00060",
  "Precambrian":     "#d070a0",
  // Plutónicas/volcánicas sin edad clara
  "undivided":       "#cccccc",
};

// ── COLORES POR UNIT_ABBREV (para unidades mixtas tipo KTvm, pQg, etc.) ────
// Extrae el prefijo de edad del símbolo y lo mapea
function colorFromAbbrev(abbrev) {
  if (!abbrev) return null;
  // Prefijos en orden de mayor a menor especificidad
  const prefixMap = [
    ["KPg", "#c8eda0"], ["KT",  "#d4f0a0"],
    ["pQ",  "#fff2ae"], ["Qh",  "#ffff99"], ["Q",   "#f9f972"],
    ["pgT", "#e07000"], ["eT",  "#ff8000"], ["oT",  "#ff9933"],
    ["mT",  "#ffb347"], ["nT",  "#ffcc66"], ["T",   "#ffbb66"],
    ["Ku",  "#99f099"], ["K",   "#80e880"],
    ["Ju",  "#00d8b0"], ["J",   "#00c8a0"],
    ["Tr",  "#8fd9b6"],
    ["Pu",  "#e8a090"], ["P",   "#e8a090"],
    ["IP",  "#c8a0d0"],
    ["M",   "#b898d0"],  // Mississippian
    ["Du",  "#c8b870"], ["D",   "#c8b870"],
    ["Su",  "#b8d890"], ["S",   "#b8d890"],
    ["Ou",  "#00b890"], ["O",   "#00b890"],
    ["Cm",  "#70c880"],
    ["Zu",  "#ff99cc"], ["Z",   "#ff99cc"],
    ["Yu",  "#ff66aa"], ["Y",   "#ff66aa"],
    ["Xu",  "#e6007a"], ["X",   "#e6007a"],
    ["Wu",  "#c00060"], ["W",   "#c00060"],
    ["pZ",  "#d070a0"],
  ];
  for (const [prefix, color] of prefixMap) {
    if (abbrev.startsWith(prefix)) return color;
  }
  return null;
}

// ── FUNCIÓN PRINCIPAL DE COLOR ───────────────────────────────────────────────
function getFeatureColor(feature) {
  const p = feature.properties;

  // 1) Intenta por UNIT_ABBREV (más específico)
  const byAbbrev = colorFromAbbrev(p.UNIT_ABBREV);
  if (byAbbrev) return byAbbrev;

  // 2) Fallback: MIN_AGE o MAX_AGE
  const age = p.MIN_AGE || p.MAX_AGE || "";
  const byAge = ageColors[age];
  if (byAge) return byAge;

  // 3) Busca substring en MIN_AGE (para valores compuestos)
  for (const [key, color] of Object.entries(ageColors)) {
    if (age.includes(key)) return color;
  }

  // 4) Último recurso: ROCKTYPE-based
  const rt = (p.ROCKTYPE || "").toLowerCase();
  if (rt.includes("pluton") || rt.includes("intrusive")) return "#ff6666";
  if (rt.includes("volcanic"))  return "#ff9966";
  if (rt.includes("water"))     return "#aad4ff";

  return "#cccccc"; // sin clasificar
}

// ── LAYER CON ESTILO CORRECTO ────────────────────────────────────────────────
const geoUnitsLayer = L.esri.featureLayer({
  url: "https://services.arcgis.com/v01gqwM5QqNysAAi/arcgis/rest/services/Geologic_Map_of_North_America/FeatureServer/27",
  style: function(feature) {
    return {
      color:        "#555",
      weight:       0.5,
      fillColor:    getFeatureColor(feature),
      fillOpacity:  1
    };
  },
  onEachFeature: function(feature, layer) {
    const p = feature.properties;
    layer.bindPopup(`
      <b>${p.UNIT_ABBREV || "–"}</b><br>
      ${p.ROCKTYPE || ""} — ${p.LITHOLOGY || ""}<br>
      <i>${p.MIN_AGE || ""}</i>
    `);
  }
});

    // Barra de coordenadas UTM
  const coordDiv = L.control({ position: 'bottomleft' });
  coordDiv.onAdd = function () {
    this._div = L.DomUtil.create('div', 'coord-info');
    this._div.innerHTML = 'Mueve el puntero para ver UTM';
    return this._div;
  };
  coordDiv.update = function (text) { this._div.innerHTML = text; };
  coordDiv.addTo(map);

  function latLonToUTM(lat, lon) {
    const zone       = Math.floor((lon + 180) / 6) + 1;
    const hemisphere = lat >= 0 ? 'N' : 'S';
    const projStr    = `+proj=utm +zone=${zone} ${hemisphere === 'S' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
    const c          = proj4(projStr, [lon, lat]);
    return { easting: c[0].toFixed(2), northing: c[1].toFixed(2), zone, hemisphere };
  }

  map.on('mousemove', (e) => {
    try {
      const u = latLonToUTM(e.latlng.lat, e.latlng.lng);
      coordDiv.update(`<b>UTM ${u.zone}${u.hemisphere}</b><br>E: ${u.easting} m<br>N: ${u.northing} m`);
    } catch (_) {}
  });

  document.getElementById("toggle-hidrologia").addEventListener("change", e => {
    e.target.checked ? map.addLayer(volcanes) : map.removeLayer(volcanes);
  });
document.getElementById("toggle-geologia").addEventListener("change", e => {
    e.target.checked ? map.addLayer(geologyLayer) : map.removeLayer(geologyLayer);
  });
document.getElementById("toggle-geologiasub").addEventListener("change", e => {
    e.target.checked ? map.addLayer(geologysudamerica) : map.removeLayer(geologysudamerica);
  });
  document.getElementById("toggle-petroleo").addEventListener("change", e => {
    e.target.checked ? map.addLayer(critMinLayer) : map.removeLayer(critMinLayer);
  });
   document.getElementById("toggle-norte").addEventListener("change", e => {
    e.target.checked ? map.addLayer(geoUnitsLayer) : map.removeLayer(geoUnitsLayer);
  });
  //  HERRAMIENTA DE CAPTURA DE COORDENADAS
  // ═══════════════════════════════════════════════

  let capturando       = false;
  let modoActual       = 'puntos';
  let puntosCapturados = [];
  let marcadores       = [];
  let poligonoLayer    = null;

  const btnModoPuntos   = document.getElementById("btn-modo-puntos");
  const btnModoPoligono = document.getElementById("btn-modo-poligono");
  const btnCaptura      = document.getElementById("btn-toggle-captura");
  const statusDiv       = document.getElementById("captura-status");
  const tbody           = document.getElementById("tabla-coords-body");
  const btnLimpiar      = document.getElementById("btn-limpiar");
  const btnExportar     = document.getElementById("btn-exportar-csv");
  const contadorBadge   = document.getElementById("contador-puntos");

  function makeIcon(color) {
    return L.divIcon({
      className: '',
      html: `<div style="width:12px;height:12px;background:${color};border:2px solid #fff;border-radius:50%;box-shadow:0 0 5px rgba(0,0,0,0.5)"></div>`,
      iconAnchor: [6, 6]
    });
  }

  btnModoPuntos.addEventListener("click", (e) => {
    e.stopPropagation();
    modoActual = 'puntos';
    btnModoPuntos.classList.add("active");
    btnModoPoligono.classList.remove("active");
    actualizarStatus();
  });

  btnModoPoligono.addEventListener("click", (e) => {
    e.stopPropagation();
    modoActual = 'poligono';
    btnModoPoligono.classList.add("active");
    btnModoPuntos.classList.remove("active");
    actualizarStatus();
  });

  btnCaptura.addEventListener("click", (e) => {
    e.stopPropagation();
    capturando = !capturando;
    if (capturando) {
      btnCaptura.innerHTML = '<i class="fa-solid fa-stop"></i> Detener captura';
      btnCaptura.classList.add("capturing");
      document.body.classList.add("capturando");
    } else {
      detenerCaptura();
      if (modoActual === 'poligono' && puntosCapturados.length >= 3) cerrarPoligono();
    }
    actualizarStatus();
  });

  function detenerCaptura() {
    capturando = false;
    btnCaptura.innerHTML = '<i class="fa-solid fa-crosshairs"></i> Activar captura';
    btnCaptura.classList.remove("capturing");
    document.body.classList.remove("capturando");
  }

  function actualizarStatus() {
    statusDiv.className = 'captura-status';
    if (!capturando) {
      statusDiv.classList.add("off");
      statusDiv.textContent = "Captura inactiva";
    } else if (modoActual === 'puntos') {
      statusDiv.classList.add("on-puntos");
      statusDiv.textContent = "● Capturando puntos — clic en mapa";
    } else {
      statusDiv.classList.add("on-poligono");
      statusDiv.textContent = "● Polígono — clic: vértice | doble clic: cerrar";
    }
  }

  // Clic en mapa → capturar punto
  map.on('click', function (e) {
    if (!capturando) return;

    let utm;
    try {
      utm = latLonToUTM(e.latlng.lat, e.latlng.lng);
    } catch (err) {
      alert("Error al convertir UTM. Verifica que proj4.js está cargado antes de script.js.");
      return;
    }

    const punto = {
      lat:        e.latlng.lat.toFixed(6),
      lon:        e.latlng.lng.toFixed(6),
      easting:    utm.easting,
      northing:   utm.northing,
      zone:       utm.zone,
      hemisphere: utm.hemisphere
    };
    puntosCapturados.push(punto);

    const color  = modoActual === 'poligono' ? '#2980b9' : '#c0392b';
    const marker = L.marker([e.latlng.lat, e.latlng.lng], { icon: makeIcon(color) })
      .bindTooltip(`#${puntosCapturados.length}`, { permanent: true, direction: 'right' })
      .addTo(map);
    marcadores.push(marker);

    if (modoActual === 'poligono') actualizarPoligonoProvisional();

    agregarFila(punto, puntosCapturados.length);
    if (contadorBadge) contadorBadge.textContent = puntosCapturados.length;
  });

  // Doble clic → cerrar polígono
  map.on('dblclick', function () {
    if (!capturando || modoActual !== 'poligono') return;
    if (puntosCapturados.length >= 3) {
      cerrarPoligono();
      detenerCaptura();
      actualizarStatus();
    }
  });

  function actualizarPoligonoProvisional() {
    if (poligonoLayer) map.removeLayer(poligonoLayer);
    if (puntosCapturados.length < 2) return;
    const ll = puntosCapturados.map(p => [parseFloat(p.lat), parseFloat(p.lon)]);
    poligonoLayer = L.polyline(ll, { color: '#2980b9', weight: 2, dashArray: '6 4' }).addTo(map);
  }

  function cerrarPoligono() {
    if (poligonoLayer) map.removeLayer(poligonoLayer);
    const ll = puntosCapturados.map(p => [parseFloat(p.lat), parseFloat(p.lon)]);
    poligonoLayer = L.polygon(ll, { color: '#2980b9', weight: 2, fillColor: '#2980b9', fillOpacity: 0.15 }).addTo(map);
  }

  function agregarFila(punto, idx) {
    const emptyRow = document.getElementById("row-empty");
    if (emptyRow) emptyRow.remove();
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${idx}</td><td>${punto.lat}</td><td>${punto.lon}</td>
      <td>${punto.easting}</td><td>${punto.northing}</td><td>${punto.zone}${punto.hemisphere}</td>
    `;
    tr.addEventListener("click", () =>
      map.flyTo([parseFloat(punto.lat), parseFloat(punto.lon)], 14, { duration: 0.8 })
    );
    tbody.appendChild(tr);
    tbody.closest('.tabla-wrapper').scrollTop = 99999;
  }

  btnLimpiar.addEventListener("click", (e) => {
    e.stopPropagation();
    if (puntosCapturados.length === 0) return;
    if (!confirm("¿Eliminar todos los puntos capturados?")) return;
    puntosCapturados = [];
    marcadores.forEach(m => map.removeLayer(m));
    marcadores = [];
    if (poligonoLayer) { map.removeLayer(poligonoLayer); poligonoLayer = null; }
    if (contadorBadge) contadorBadge.textContent = '0';
    tbody.innerHTML = '<tr id="row-empty"><td colspan="6" class="empty-msg">Sin puntos capturados</td></tr>';
    if (capturando) { detenerCaptura(); actualizarStatus(); }
  });

  btnExportar.addEventListener("click", (e) => {
    e.stopPropagation();
    if (puntosCapturados.length === 0) { alert("No hay puntos para exportar."); return; }
    const header = "N,Latitud,Longitud,Easting_m,Northing_m,Zona_UTM";
    const rows   = puntosCapturados.map((p, i) =>
      `${i+1},${p.lat},${p.lon},${p.easting},${p.northing},${p.zone}${p.hemisphere}`
    );
    const blob = new Blob([[header, ...rows].join("\n")], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href = url;
    a.download = `coordenadas_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

// ═══════════════════════════════════════════════════════════════
  //  HERRAMIENTA DE BÚSQUEDA DE COORDENADAS
  // ═══════════════════════════════════════════════════════════════

  let marcadorBusqueda = null;

  const tabGeo    = document.getElementById("buscar-tab-geo");
  const tabUTM    = document.getElementById("buscar-tab-utm");
  const panelGeo  = document.getElementById("buscar-geo-panel");
  const panelUTM  = document.getElementById("buscar-utm-panel");
  const buscarSt  = document.getElementById("buscar-status");
  const btnLimpiarBusq = document.getElementById("btn-limpiar-busqueda");

  // Cambio de pestaña Geog. ↔ UTM
  tabGeo.addEventListener("click", (e) => {
    e.stopPropagation();
    tabGeo.classList.add("active");
    tabUTM.classList.remove("active");
    panelGeo.style.display = "";
    panelUTM.style.display = "none";
    limpiarStatus();
  });

  tabUTM.addEventListener("click", (e) => {
    e.stopPropagation();
    tabUTM.classList.add("active");
    tabGeo.classList.remove("active");
    panelGeo.style.display = "none";
    panelUTM.style.display = "";
    limpiarStatus();
  });

  function limpiarStatus() {
    buscarSt.textContent = "";
    buscarSt.className   = "buscar-status";
  }

  // Icono del marcador de búsqueda (pin dorado destacado)
  function iconoBusqueda() {
    return L.divIcon({
      className: '',
      html: `
        <div style="
          position: relative;
          width: 22px;
          height: 22px;
        ">
          <!-- Halo animado -->
          <div style="
            position: absolute;
            width: 22px; height: 22px;
            background: rgba(255,204,0,0.35);
            border-radius: 50%;
            animation: pulso-busqueda 1.8s ease-out infinite;
          "></div>
          <!-- Círculo principal -->
          <div style="
            position: absolute;
            top: 3px; left: 3px;
            width: 16px; height: 16px;
            background: #ffcc00;
            border: 3px solid #163150;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.55);
          "></div>
        </div>
        <style>
          @keyframes pulso-busqueda {
            0%   { transform: scale(1);   opacity: 0.8; }
            70%  { transform: scale(2.2); opacity: 0; }
            100% { transform: scale(2.2); opacity: 0; }
          }
        </style>
      `,
      iconSize:   [22, 22],
      iconAnchor: [11, 11]
    });
  }

  // Construye el HTML del popup con toda la info de la coordenada buscada
  function popupBusqueda(lat, lon) {
    let utmInfo = '';
    try {
      const u = latLonToUTM(lat, lon);
      utmInfo = `
        <div class="coord-line">E: ${u.easting} m</div>
        <div class="coord-line">N: ${u.northing} m</div>
        <div class="coord-line">Zona: ${u.zone}${u.hemisphere}</div>
      `;
    } catch (_) {}

    return `
      <div class="buscar-popup-content">
        <strong>📍 Coordenada buscada</strong>
        <div class="coord-line">Lat: ${lat.toFixed(6)}°</div>
        <div class="coord-line">Lon: ${lon.toFixed(6)}°</div>
        ${utmInfo}
      </div>
    `;
  }

  // Coloca el marcador y vuela al punto
  function irACoordenada(lat, lon) {
    if (marcadorBusqueda) map.removeLayer(marcadorBusqueda);
    marcadorBusqueda = L.marker([lat, lon], { icon: iconoBusqueda(), zIndexOffset: 1000 })
      .bindPopup(popupBusqueda(lat, lon), { maxWidth: 200 })
      .addTo(map)
      .openPopup();

    map.flyTo([lat, lon], 13, { duration: 1.2 });

    buscarSt.textContent = "✓ Coordenada localizada";
    buscarSt.className   = "buscar-status ok";
    btnLimpiarBusq.style.display = "";
  }

  // Botón principal: Ir a coordenada
  document.getElementById("btn-buscar-coord").addEventListener("click", (e) => {
    e.stopPropagation();
    limpiarStatus();

    const esUTM = tabUTM.classList.contains("active");

    if (!esUTM) {
      // ── Modo Geográfico (Decimal Degrees) ──────────────────────────────
      const lat = parseFloat(document.getElementById("buscar-lat").value);
      const lon = parseFloat(document.getElementById("buscar-lon").value);

      if (isNaN(lat) || isNaN(lon)) {
        buscarSt.textContent = "⚠ Ingresa latitud y longitud válidas.";
        buscarSt.className   = "buscar-status error";
        return;
      }
      if (lat < -90 || lat > 90) {
        buscarSt.textContent = "⚠ Latitud debe estar entre -90 y 90.";
        buscarSt.className   = "buscar-status error";
        return;
      }
      if (lon < -180 || lon > 180) {
        buscarSt.textContent = "⚠ Longitud debe estar entre -180 y 180.";
        buscarSt.className   = "buscar-status error";
        return;
      }
      irACoordenada(lat, lon);

    } else {
      // ── Modo UTM ────────────────────────────────────────────────────────
      const E    = parseFloat(document.getElementById("buscar-e").value);
      const N    = parseFloat(document.getElementById("buscar-n").value);
      const zona = parseInt(document.getElementById("buscar-zona").value, 10);
      const hem  = document.getElementById("buscar-hem").value;

      if (isNaN(E) || isNaN(N)) {
        buscarSt.textContent = "⚠ Ingresa Easting y Northing válidos.";
        buscarSt.className   = "buscar-status error";
        return;
      }
      if (isNaN(zona) || zona < 1 || zona > 60) {
        buscarSt.textContent = "⚠ La zona UTM debe ser un número entre 1 y 60.";
        buscarSt.className   = "buscar-status error";
        return;
      }

      try {
        const projStr  = `+proj=utm +zone=${zona} ${hem === 'S' ? '+south' : ''} +datum=WGS84 +units=m +no_defs`;
        const [lon, lat] = proj4(projStr, 'EPSG:4326', [E, N]);

        if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
          buscarSt.textContent = "⚠ Coordenadas fuera de rango. Verifica zona y valores.";
          buscarSt.className   = "buscar-status error";
          return;
        }
        irACoordenada(lat, lon);

      } catch (err) {
        buscarSt.textContent = "⚠ Error al convertir UTM. Verifica los datos.";
        buscarSt.className   = "buscar-status error";
      }
    }
  });

  // Botón: Quitar marcador de búsqueda
  btnLimpiarBusq.addEventListener("click", (e) => {
    e.stopPropagation();
    if (marcadorBusqueda) {
      map.removeLayer(marcadorBusqueda);
      marcadorBusqueda = null;
    }
    limpiarStatus();
    btnLimpiarBusq.style.display = "none";
  });

  // Enter en cualquier input del panel de búsqueda → ejecutar búsqueda
  document.querySelectorAll(
    "#buscar-lat, #buscar-lon, #buscar-e, #buscar-n, #buscar-zona"
  ).forEach(input => {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        document.getElementById("btn-buscar-coord").click();
      }
    });
  });

}); // fin DOMContentLoaded
