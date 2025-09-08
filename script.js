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
  { name: 'Nafplio', file: 'routes/nafplio-trip.kml', color: 'blue' },
  { name: 'Meteora', file: 'routes/meteora-trip.kml', color: 'red' },
  { name: 'Galaxidi', file: 'routes/galaxidi-trip.kml', color: 'orange' },
  { name: 'Karpenissi', file: 'routes/karpenissi-trip.kml', color: 'green' },
  { name: 'Trichonida-Agrafa', file: 'routes/trichonida-trip.kml', color: 'purple' },
  { name: 'Crete', file: 'routes/crete-trip.kml', color: 'blue' },
  { name: 'Kalavrita', file: 'routes/kalavrita.kml', color: 'blue' },
  { name: 'Karystos', file: 'routes/karystos.kml', color: 'blue' },
  { name: 'Psatha-Lake Vouliagmeni', file: 'routes/lake-vouliagmenis.kml', color: '#5438A8' },
  { name: 'Arvanitsa-Arachova', file: 'routes/arvanitsa-arachova.kml', color: '#5438A8' },
  { name: 'Epidavros', file: 'routes/epidavros.kml', color: '#5438A8' },
  { name: 'Epidavros', file: 'routes/megara-alepochori-psatha.kml', color: '#5438A8' },
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
  
  // Φόρτωση KML
  const layer = omnivore.kml(r.file).on("ready", function() {
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