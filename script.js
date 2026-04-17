// Δημιουργία χάρτη
const map = L.map('map', {
  zoomControl: false
}).setView([39.0742, 21.8243], 6);

// OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.control.zoom({ position: 'topright' }).addTo(map);

// Storage
const routeLayers = {};
const sidebar = document.getElementById("sidebar");

// 🔥 Load routes dynamically
fetch('routes/routes.json')
  .then(res => res.json())
  .then(routes => {

    const groups = {};

    routes.forEach(r => {

      const parts = r.file.split('/');
      const year = parts[0]; // e.g. "2025"
      const filename = parts[1];

      const name = r.name || filename.replace(/\.[^/.]+$/, "");

      // 🔹 Create year group if not exists
      if (!groups[year]) {
        const yearDiv = document.createElement("div");
        yearDiv.classList.add("year-group");

        const title = document.createElement("h3");
        title.textContent = year;
        title.classList.add("year-title");

        // 👉 Collapse toggle
        title.addEventListener('click', () => {
          yearDiv.classList.toggle('collapsed');
        });

        yearDiv.appendChild(title);
        sidebar.appendChild(yearDiv);

        groups[year] = yearDiv;
      }

      // 🔹 Create checkbox
      const label = document.createElement("label");
      label.innerHTML = `<input type="checkbox" checked id="${name}"> ${name}`;
      groups[year].appendChild(label);

      const fullPath = `routes/${r.file}`;

      // 🔥 Detect file type
      let layer;
      if (r.file.endsWith('.gpx')) {
        layer = omnivore.gpx(fullPath);
      } else {
        layer = omnivore.kml(fullPath);
      }

      // 🎨 Style (works for GPX multi-layers)
      layer.on("ready", function () {
        this.eachLayer(l => {
          if (l.setStyle) {
            l.setStyle({
              color: r.color || "blue",
              weight: 4,
              opacity: 0.75
            });
          }
        });
      }).addTo(map);

      routeLayers[name] = layer;

      // 🔘 Toggle visibility
      document.getElementById(name).addEventListener("change", e => {
        if (e.target.checked) {
          map.addLayer(routeLayers[name]);

          // 🔍 Zoom to route
          if (routeLayers[name].getBounds) {
            map.fitBounds(routeLayers[name].getBounds());
          }

        } else {
          map.removeLayer(routeLayers[name]);
        }
      });

    });

  });

// Sidebar ready animation
window.addEventListener("DOMContentLoaded", () => {
  sidebar.classList.add("ready");
});

// Toggle sidebar button
const toggleButton = document.getElementById('toggleButton');
toggleButton.addEventListener('click', () => {
  sidebar.classList.toggle('open');
});

const toggleAllBtn = document.getElementById("toggleAllBtn");
let allSelected = true;

toggleAllBtn.addEventListener("click", () => {
  const checkboxes = sidebar.querySelectorAll('input[type="checkbox"]');

  allSelected = !allSelected;

  checkboxes.forEach(cb => {
    cb.checked = allSelected;

    const layer = routeLayers[cb.id];

    if (allSelected) {
      map.addLayer(layer);
    } else {
      map.removeLayer(layer);
    }
  });

  toggleAllBtn.textContent = allSelected ? "Deselect All" : "Select All";
});
