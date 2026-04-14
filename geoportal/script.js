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

  const biota = L.tileLayer.wms(
    "https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?",
    { layers: 'MODIS_Terra_CorrectedReflectance_TrueColor', format: 'image/png', transparent: true, opacity: 0.8 }
  );
 const NASAGIBS_ModisTerraTrueColorCR = L.tileLayer(
      'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
      {
        attribution: 'Imagery provided by NASA GIBS (ESDIS)',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 9,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
      }
    );
const NASAGIBS_ModisTerraBands367CR = L.tileLayer(
      'https://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_CorrectedReflectance_Bands367/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
      {
        attribution: 'Imagery provided by NASA GIBS (ESDIS)',
        bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
        minZoom: 1,
        maxZoom: 9,
        format: 'jpg',
        time: '',
        tilematrixset: 'GoogleMapsCompatible_Level'
      }
    );
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
    )
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
    e.target.checked ? map.addLayer(NASAGIBS_ModisTerraBands367CR) : map.removeLayer(NASAGIBS_ModisTerraBands367CR);
  });
document.getElementById("toggle-Lansat").addEventListener("change", e => {
    e.target.checked ? map.addLayer(NASAGIBS_ModisTerraTrueColorCR) : map.removeLayer(NASAGIBS_ModisTerraTrueColorCR);
  });
document.getElementById("toggle-geologia").addEventListener("change", e => {
    e.target.checked ? map.addLayer(geologyLayer) : map.removeLayer(geologyLayer);
  });
document.getElementById("toggle-geologiasub").addEventListener("change", e => {
    e.target.checked ? map.addLayer(geologysudamerica) : map.removeLayer(geologysudamerica);
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

}); // fin DOMContentLoaded
