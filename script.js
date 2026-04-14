// Δημιουργία χάρτη
const map = L.map('map', {
  zoomControl: false
}).setView([39.0742, 21.8243], 6);

// Προσθήκη OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);

// Λίστα με kml routes
const routes = [
  { name: 'Karystos-2024', file: 'routes/karystos.kml', type: 'klm', color: 'blue' },
  { name: 'Kalavrita-2024', file: 'routes/kalavrita.kml', type: 'klm', color: 'blue' },
  { name: 'Nafplio-2025', file: 'routes/nafplio-trip.kml', type: 'klm', color: 'blue' },
  { name: 'Psatha-Lake Vouliagmeni-2025', file: 'routes/lake-vouliagmenis.kml', type: 'klm', color: '#5438A8' },
  { name: 'Epidavros-2025', file: 'routes/epidavros.kml', type: 'klm', color: '#5438A8' },
  { name: 'Meteora-2025', file: 'routes/meteora-trip.kml', type: 'klm', color: 'red' },
  { name: 'Galaxidi-2025', file: 'routes/galaxidi-trip.kml', type: 'klm', color: 'orange' },
  { name: 'Karpenissi-2025', file: 'routes/karpenissi-trip.kml', type: 'klm', color: 'green' },
  { name: 'Crete-2025', file: 'routes/crete-trip.kml', type: 'klm', color: 'blue' },
  { name: 'Trichonida-Agrafa-2025', file: 'routes/trichonida-trip.kml', type: 'klm', color: 'purple' },
  { name: 'Arvanitsa-Arachova-2025', file: 'routes/arvanitsa-arachova.kml', type: 'klm', color: '#5438A8' },
  { name: 'Psatha-2025', file: 'routes/megara-alepochori-psatha.kml', type: 'klm', color: '#5438A8' },
  { name: 'Poros-2025', file: 'routes/poros-trip.kml', type: 'klm', color: '#5438A8' },
  { name: 'Stropones', file: 'routes/stropones-amfithea.gpx', type: 'gpx', color: 'blue' },
];

// Object για να κρατάμε τα layers
const routeLayers = {};
const sidebar = document.getElementById("sidebar");

// Για κάθε route → checkbox + φόρτωμα layer
routes.forEach(r => {
  // Δημιουργία checkbox
  const label = document.createElement("label");
  label.innerHTML = `<input type="checkbox" checked id="${r.name}"> ${r.name}`;
  sidebar.appendChild(label);
  
  // Φόρτωση KML/GPX
  const layer = (r.type === 'gpx' ? omnivore.gpx(r.file) : omnivore.kml(r.file))
  .on("ready", function() {
    this.setStyle({
      color: r.color,
      weight: 4,
      opacity: 0.75
    });
  }).addTo(map);
  
  // Αποθήκευση στο routeLayers
  routeLayers[r.name] = layer;
  
  // Listener για toggle
  document.getElementById(r.name).addEventListener("change", e => {
    if (e.target.checked) {
      map.addLayer(routeLayers[r.name]);
    } else {
      map.removeLayer(routeLayers[r.name]);
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  sidebar.classList.add("ready");
});

// Toggle button
const toggleButton = document.getElementById('toggleButton');
toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});