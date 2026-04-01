/* ================================================
   app.js – Guida Ristoranti d'Italia (COMPLETE)
   ================================================ */
console.group("🚀 PREMIUM BOOTSTRAP ACTIVE");
// ── CONFIGURATIONS ──
const TAB_LABELS = {
  antipasti: "🥗 Antipasti", pizze: "🍕 Pizze", colazione: "☕ Colazione", 
  cicchetti: "🍢 Cicchetti", panini: "🥖 Panini", aperitivo: "🍸 Aperitivo",
  gelati: "🍦 Gelati", granite: "🧊 Granite", cioccolato: "🍫 Cioccolato",
  primi: "🍝 Primi", secondi: "🍖 Secondi", dolci: "🍰 Dolci",
  bevande: "🥤 Bevande", vini: "🍷 Vini", birre: "🍺 Birre", bibite: "🥤 Bibite & Caffè"
};
// ── GLOBAL STATE ──
let map;
let markerClusterGroup;
const markers = [];
let quizIdx = 0;
const getR = () => window.RESTAURANTS || [];
const chefQuestions = [
  { q: "Quale di questi formaggi è a 'pasta filata'?", options: ["Pecorino Romano", "Mozzarella di Bufala", "Parmigiano Reggiano", "Gorgonzola"], correct: 1 },
  { q: "Qual è l'ingrediente base del Pesto alla Genovese?", options: ["Prezzemolo", "Salvia", "Basilico", "Menta"], correct: 2 },
  { q: "Quanti mesi di stagionatura richiede un Prosciutto di Parma DOP?", options: ["6 mesi", "12 mesi", "24 mesi", "18 mesi"], correct: 1 },
  { q: "Quale regione è famosa per i 'Canederli'?", options: ["Trentino-Alto Adige", "Sicilia", "Puglia", "Toscana"], correct: 0 },
  { q: "Cosa si intende per cottura 'al dente'?", options: ["Molto cotta", "Cruda", "Resistente al morso", "Bollita a lungo"], correct: 2 }
];
// ── TOAST NOTIFICATIONS ──
window.showToast = function(message, icon = "🍽️") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span class="toast-icon">${icon}</span> <div class="toast-text">${message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</div>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = "0"; setTimeout(() => toast.remove(), 500); }, 4000);
};
// ── FAVORITE SYSTEM ──
window.toggleFav = function(id, el) {
  let favs = JSON.parse(localStorage.getItem("favs") || "[]");
  if (favs.includes(id)) {
    favs = favs.filter(x => x !== id);
    el.classList.remove("active");
    el.querySelector("span").textContent = "🤍";
  } else {
    favs.push(id);
    el.classList.add("active");
    el.querySelector("span").textContent = "❤️";
  }
  localStorage.setItem("favs", JSON.stringify(favs));
};
function isFavorite(id) {
  try { return JSON.parse(localStorage.getItem("favs") || "[]").includes(id); } catch(e) { return false; }
}
// ── MAP SYSTEM ──
function initMap() {
  const mapEl = document.getElementById("map");
  if (!mapEl || map) return;
  try {
    map = L.map("map", { zoomControl: true, scrollWheelZoom: false }).setView([42.4, 13.0], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "© OpenStreetMap", maxZoom: 18 }).addTo(map);
    markerClusterGroup = L.layerGroup();
    populateMarkers();
    map.addLayer(markerClusterGroup);
    setTimeout(() => { if(map) map.invalidateSize(); }, 1000);
    console.log("✅ Map Initialized.");
  } catch (err) { console.error("Map Fail:", err); }
  if (!mapEl || window.map) return;
  
  // Set explicit minimum height to prevent collapse before Leaflet takes over
  mapEl.style.minHeight = "480px";
  mapEl.style.background = "#1a130a"; // Better fallback than plain black
  setTimeout(() => {
    try {
      // Force Leaflet assets to load from external CDN to avoid local relative path errors
      L.Icon.Default.imagePath = 'https://unpkg.com/leaflet@1.9.4/dist/images/';
      window.map = L.map("map", { 
        zoomControl: true, 
        scrollWheelZoom: false,
        fadeAnimation: true,
        markerZoomAnimation: true
      }).setView([42.0, 12.5], 6); // Centered on Italy
      
      // Use no-subdomain Tile Layer to avoid CORS/Mixed Content issues on file:// protocol
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { 
        attribution: "© OpenStreetMap", 
        maxZoom: 18,
        crossOrigin: true
      }).addTo(window.map);
      
      markerClusterGroup = (typeof L.markerClusterGroup === 'function') ? L.markerClusterGroup() : L.layerGroup();
      populateMarkers();
      window.map.addLayer(markerClusterGroup);
      
      // Keep trying to fix map size for the first 5 seconds to catch layout shifts
      [100, 500, 1500, 4000].forEach(delay => {
        setTimeout(() => { 
          if(window.map) {
              window.map.invalidateSize();
              console.log(`📡 Map sync @${delay}ms`);
          }
        }, delay);
      });
      // Monitor tile loading
      let tilesLoaded = false;
      osm.on('tileload', () => { tilesLoaded = true; });
      
      setTimeout(() => {
        if(!tilesLoaded) {
          console.warn("⚠️ Map tiles blocked by browser security (file:// protocol).");
          showToast("Mappa: Caricamento limitato dal browser locale. Usa un server per la vista completa.", "🗺️");
        }
      }, 5000);
      console.log("✅ Map Engine Primed (Final Check).");
    } catch (err) { console.error("Map Fail Detail:", err); }
  }, 300);
}
function populateMarkers() {
  if (typeof RESTAURANTS === 'undefined' || !markerClusterGroup) return;
  const data = getR();
  if (data.length === 0 || !markerClusterGroup) return;
  markerClusterGroup.clearLayers();
  RESTAURANTS.forEach(r => {
    const icon = L.divIcon({ className: "map-marker-icon", html: r.emoji, iconSize: [36, 36], iconAnchor: [18, 36], popupAnchor: [0, -38] });
  data.forEach(r => {
    const icon = L.divIcon({ 
      className: "map-marker-icon", 
      html: `<span style="transform: rotate(45deg); display: block;">${r.emoji}</span>`, 
      iconSize: [36, 36], 
      iconAnchor: [18, 36], 
      popupAnchor: [0, -38] 
    });
    const marker = L.marker([r.lat, r.lng], { icon });
    marker.bindPopup(`<div style="min-width:160px; padding: 5px;"><div class="popup-title">${r.name}</div><div class="popup-city">📍 ${r.city}</div><button class="popup-btn" onclick="openModal(${r.id})">Vedi Menu →</button></div>`, { className: "map-popup" });
    marker.bindPopup(`<div style="min-width:160px; padding: 5px;"><div class="popup-title">${r.name}</div><div class="popup-city">📍 ${r.city}</div><button class="popup-btn" onclick="openModal(${r.id})">Vedi Dettagli →</button></div>`, { className: "map-popup" });
    markers.push({ marker, restaurant: r });
    markerClusterGroup.addLayer(marker);
  });
}
// ── RENDERING ──
function renderCards(list, highlightIds = []) {
  const grid = document.getElementById("cardsGrid");
  if (!grid) return;
  grid.innerHTML = Array.from({length: 8}, () => `<div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line full"></div><div class="skeleton-line mid"></div></div></div>`).join('');
  
  setTimeout(() => {
    grid.innerHTML = "";
    if (!list || list.length === 0) { 
        grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:100px;color:var(--muted)">Nessun gourmet locale soddisfa questi criteri.</div>`; 
        return; 
    }
    list.forEach(r => {
      const isFav = isFavorite(r.id);
      const card = document.createElement("div");
      card.className = `card ${highlightIds.includes(r.id) ? 'ai-highlight' : ''} food-cursor`;
      card.setAttribute("data-tilt", "");
      card.innerHTML = `
        <button class="heart-btn ${isFav ? 'active' : ''}" onclick="toggleFav(${r.id}, this); event.stopPropagation();"><span>${isFav ? '❤️' : '🤍'}</span></button>
        <img src="${r.image}" loading="lazy" alt="${r.name}" class="card-img" />
        <div class="card-body">
          <span class="card-cat">${r.cat}</span><div class="card-name">${r.name}</div><div class="card-city">📍 ${r.city}</div><div class="card-desc">${r.desc.substring(0, 100)}...</div>
          <div class="card-footer">
            <div><div class="card-stars">${r.stars}</div><div class="card-price">Media: <strong>${r.avgPrice}</strong></div></div>
            <button class="card-btn" onclick="openModal(${r.id})">Esplora →</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
    if (window.VanillaTilt) VanillaTilt.init(document.querySelectorAll(".card[data-tilt]"));
  }, 1000);
}
// ── MODALS ──
window.openModal = function(id) {
  const r = RESTAURANTS.find(x => x.id === id);
  const data = getR();
  const r = data.find(x => x.id === id);
  if (!r) return;
  const tabs = Object.keys(r.menu);
  const tabsHTML = tabs.map((k, i) => `<button class="menu-tab ${i === 0 ? "active" : ""}" onclick="switchTab('${k}',this)">${TAB_LABELS[k] || k}</button>`).join("");
  const panelsHTML = tabs.map((k, i) => `<div class="menu-panel ${i === 0 ? "active" : ""}" id="panel-${k}">${r.menu[k].map(item => `<div class="menu-item"><div class="mi-info"><div class="mi-name">${item.name}</div><div class="mi-desc">${item.desc || ''}</div></div><div class="mi-price">${item.price}</div></div>`).join("")}</div>`).join("");
  
  const content = document.getElementById("modalContent");
  if (!content) return;
  
  const reviewsHTML = (r.reviewsList || []).map(rev => `
    <div class="rev-item">
      <div class="rev-user"><strong>${rev.user}</strong> <span class="stars">${rev.stars}</span></div>
      <div class="rev-text">"${rev.text}"</div>
      <div class="rev-date">${rev.date}</div>
    </div>`).join("");
  content.innerHTML = `
    <div class="m-header" style="background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('${r.image}') center/cover;">
      <div class="m-name">${r.name}</div><div class="m-meta">📍 ${r.address} | ⭐ ${r.rating}</div>
      <div class="m-desc">${r.filosofia || ''}</div>
      <div class="m-name">${r.name}</div>
      <div class="m-meta">📍 ${r.address} | ⭐ ${r.rating} (${r.reviewsCount} recensioni)</div>
    </div>
    <div class="menu-tabs">${tabsHTML}</div><div class="menu-body">${panelsHTML}</div>`;
    <div class="m-actions">
        <a href="${r.website}" target="_blank" class="m-btn btn-primary" onclick="showToast('Ti stiamo portando sul sito ufficiale...','🚀')"><span class="material-icons-round">language</span> Visita Sito</a>
        <button class="m-btn btn-secondary" onclick="showToast('Tavolo prenotato con successo!','📅')"><span class="material-icons-round">book_online</span> Prenota</button>
    </div>
    <div class="menu-tabs">${tabsHTML}</div>
    <div class="menu-body">${panelsHTML}</div>
    <div class="tripadvisor-section">
        <h3><span class="material-icons-round">reviews</span> Recensioni TripAdvisor</h3>
        <div class="ta-summary">⭐ ${r.rating} / 5.0 su ${r.reviewsCount} utenti</div>
        <div class="reviews-list">${reviewsHTML}</div>
    </div>`;
  
  document.getElementById("modal").classList.add("open");
  document.body.style.overflow = "hidden";
};
window.closeModal = function() {
  document.getElementById("modal").classList.remove("open");
  document.getElementById("modal")?.classList.remove("open");
  document.getElementById("slotOverlay")?.classList.remove("open");
  document.getElementById("bookModal")?.classList.remove("open");
  document.body.style.overflow = "";
};
window.switchTab = function(key, btn) {
  document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".menu-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  document.getElementById("panel-" + key)?.classList.add("active");
};
// ── SLOT MACHINE ──
function initSlotMachine() {
  const btn = document.getElementById("slotBtn");
  const overlay = document.getElementById("slotOverlay");
  const display = document.getElementById("slotDisplay");
  const go = document.getElementById("slotGoBtn");
  const close = document.getElementById("slotClose");
  if (!btn || !overlay) return;
  btn.addEventListener("click", () => {
    overlay.style.display = "flex";
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("slotFinal").style.display = "none";
    let count = 0;
    const interval = setInterval(() => {
      display.textContent = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)].name;
      if (!overlay.classList.contains("open")) { 
        clearInterval(interval); 
        return; 
      }
      const data = getR();
      display.textContent = data[Math.floor(Math.random() * data.length)].name;
      if (++count > 25) {
        clearInterval(interval);
        const final = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
        const final = data[Math.floor(Math.random() * data.length)];
        display.innerHTML = `<span style="color:var(--gold-l); font-size: 3rem;">✨ ${final.name} ✨</span>`;
        document.getElementById("slotFinal").style.display = "block";
        go.onclick = () => { overlay.style.display = "none"; openModal(final.id); };
        go.onclick = () => { closeModal(); openModal(final.id); };
      }
    }, 80);
  });
  overlay.onclick = (e) => { if(e.target === overlay) overlay.style.display = "none"; };
  
  if (close) close.addEventListener("click", closeModal);
  if (overlay) overlay.addEventListener("click", (e) => { if(e.target === overlay) closeModal(); });
}
// ── CHATBOT SOMMELIER ──
function initChatbot() {
  const fab = document.getElementById("chatbot-fab"), win = document.getElementById("chatbot-window"), overlay = document.getElementById("chatbot-overlay");
  if (!fab) return;
  fab.addEventListener("click", () => { win.classList.toggle("hidden"); overlay.classList.toggle("hidden"); });
  document.getElementById("chatbot-close").onclick = () => { win.classList.add("hidden"); overlay.classList.add("hidden"); };
  document.getElementById("chatbot-close")?.addEventListener("click", () => { win.classList.add("hidden"); overlay.classList.add("hidden"); });
  
  const addMsg = (text, isUser) => {
    const msgs = document.getElementById("chatbot-messages");
    if (!msgs) return;
    const row = document.createElement("div");
    row.className = `msg-row ${isUser ? 'user-row' : 'ai-row'}`;
    row.innerHTML = isUser ? `<div class="msg user-msg">${text}</div><div class="msg-avatar">👤</div>` : `<div class="msg-avatar">🤖</div><div class="msg ai-msg">${text}</div>`;
    msgs.appendChild(row); msgs.scrollTop = msgs.scrollHeight;
  };
  const handleSend = () => {
    const inp = document.getElementById("chat-input-text");
    const val = inp.value.trim(); if (!val) return;
    addMsg(val, true); inp.value = "";
    
    // Show Typing Indicator
    const msgs = document.getElementById("chatbot-messages");
    const typing = document.createElement("div");
    typing.className = "msg-row ai-row typing-indicator";
    typing.innerHTML = `<div class="msg-avatar">🤖</div><div class="msg ai-msg"><small>Il Sommelier sta pensando...</small></div>`;
    msgs.appendChild(typing); msgs.scrollTop = msgs.scrollHeight;
    setTimeout(() => { 
      typing.remove();
      if (val.toLowerCase().includes("chef") || val.toLowerCase().includes("sfida")) {
        addMsg("Vuoi sfidare lo Chef? Clicca sul cappello da Chef nell'header o usa il tasto 'Inizia' qui sotto!", false);
        addMsg("<button onclick='startChefQuiz()' style='background:var(--gold); border:none; padding:8px 12px; border-radius:12px; cursor:pointer; font-weight:700;'>🔥 Avvia Sfida</button>", false);
      } else {
        addMsg("Scelta raffinata. Sto analizzando i 500 locali per '" + val + "'. Ti consiglio di provare il 'Mi Sento Fortunato' (✨) o il Bicchiere di Vino (🍷) per una sorpresa!", false); 
        addMsg("Scelta raffinata per '" + val + "'. Ti consiglio di provare il 'Mi Sento Fortunato' (✨) o il Bicchiere di Vino (🍷) per una sorpresa!", false); 
      }
    }, 1200);
  };
  document.getElementById("chat-send-btn").onclick = handleSend;
  document.getElementById("chat-input-text").onkeypress = (e) => { if(e.key === "Enter") handleSend(); };
  document.getElementById("chat-send-btn")?.addEventListener("click", handleSend);
  document.getElementById("chat-input-text")?.addEventListener("keypress", (e) => { if(e.key === "Enter") handleSend(); });
  
  window.sendQuickReply = (txt) => { addMsg(txt, true); setTimeout(() => addMsg("Ho ricevuto il tuo input. Sto filtrando la selezione boutique...", false), 800); };
  window.sendQuickReply = (txt) => { 
    const inp = document.getElementById("chat-input-text");
    inp.value = txt;
    handleSend();
  };
}
// ── CHEF QUIZ ──
window.startChefQuiz = function() {
  const challenge = document.getElementById("chef-challenge");
  if(challenge) challenge.scrollIntoView({behavior:'smooth'});
  document.getElementById("quizIntro").style.display = "none";
  document.getElementById("quizReward").style.display = "none";
  document.getElementById("quizGame").style.display = "block";
  quizIdx = 0; loadQuizQ();
  showToast("Sfida dello Chef Avviata!", "👨‍🍳");
};
function loadQuizQ() {
  const q = chefQuestions[quizIdx];
  const qEl = document.getElementById("quizQuestion");
  if(!qEl) return;
  qEl.textContent = q.q;
  const opts = document.getElementById("quizOptions");
  opts.innerHTML = "";
  document.getElementById("quizBar").style.width = `${(quizIdx / chefQuestions.length) * 100}%`;
  q.options.forEach((opt, i) => {
    const b = document.createElement("button"); b.className = "quiz-opt"; b.textContent = opt;
    b.onclick = () => {
      if (i === q.correct) {
        b.classList.add("correct");
        setTimeout(() => { if (++quizIdx < chefQuestions.length) loadQuizQ(); else showQuizReward(); }, 800);
      } else {
        b.classList.add("wrong");
        showToast("Riprova! Lo Chef non perdona.", "👨‍🍳");
        setTimeout(() => startChefQuiz(), 800);
      }
    };
    opts.appendChild(b);
  });
}
function showQuizReward() {
  document.getElementById("quizGame").style.display = "none";
  document.getElementById("quizReward").style.display = "block";
  document.getElementById("quizBar").style.width = "100%";
}
// ── BOOTSTRAP ──
console.log("🟢 app.js Parsed & Waiting for DOM...");
document.addEventListener("DOMContentLoaded", () => {
  console.log("🟢 DOM Content Loaded. Initializing...");
  let attempts = 0;
  const run = setInterval(() => {
    if (typeof RESTAURANTS !== 'undefined' && RESTAURANTS.length > 0) {
    const data = window.RESTAURANTS;
    console.log(`🔍 Attempt ${attempts}: RESTAURANTS data is ${data ? data.length : 'empty'}`);
    if (data && data.length > 0) {
      clearInterval(run);
      renderCards(RESTAURANTS);
      renderCards(data);
      initMap();
      initSlotMachine();
      initChatbot();
      console.log("✅ Main Systems Online.");
    }
    if (++attempts > 100) clearInterval(run);
    if (++attempts > 150) { 
      clearInterval(run); 
      console.error("❌ Failed to load RESTAURANTS data after 15s.");
    }
  }, 100);
  // Lucky Button
  document.getElementById("luckyBtn")?.addEventListener("click", () => {
    if (!RESTAURANTS) return;
    const r = RESTAURANTS[Math.floor(Math.random() * RESTAURANTS.length)];
    const data = getR();
    if (data.length === 0) {
      showToast("Sto preparando le eccellenze... un attimo!", "⏳");
      return;
    }
    const r = data[Math.floor(Math.random() * data.length)];
    showToast("✨ La fortuna ti porta da: **" + r.name + "**", "✨");
    openModal(r.id);
  });
  // Filters & Search
  const searchInput = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const catTabs = document.querySelectorAll(".cat-tab");
  const filterAction = () => {
  const sTerm = searchInput?.value.toLowerCase() || "";
  const cat = categoryFilter?.value || "all";
  const price = document.getElementById("priceFilter")?.value || "all";
  const stars = document.getElementById("starsFilter")?.value || "all";
  const data = getR();
  const filtered = data.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(sTerm) || r.city.toLowerCase().includes(sTerm);
    const matchCat = cat === "all" || r.cat === cat;
      
      let matchPrice = true;
      if (price === "low") matchPrice = r.avgPrice.includes("€3–") || r.avgPrice.includes("€5–") || r.avgPrice.includes("€10–"); 
      else if (price === "mid") matchPrice = r.avgPrice.includes("€15–") || r.avgPrice.includes("€20–") || r.avgPrice.includes("€25–");
      else if (price === "high") matchPrice = r.avgPrice.includes("€35–");
      let matchStars = true;
      if (stars === "5") matchStars = r.stars.includes("★★★★★");
      else if (stars === "4") matchStars = r.stars.includes("★★★★☆");
      return matchSearch && matchCat && matchPrice && matchStars;
    });
    renderCards(filtered);
    const m = window.map;
    if(m) {
        markers.forEach(mk => {
          if(filtered.find(f => f.id === mk.restaurant.id)) mk.marker.addTo(markerClusterGroup);
          else markerClusterGroup.removeLayer(mk.marker);
        });
    }
  };
  searchInput?.addEventListener("input", filterAction);
  categoryFilter?.addEventListener("change", (e) => {
    catTabs.forEach(t => t.classList.remove("active"));
    document.querySelector(`.cat-tab[data-cat="${e.target.value}"]`)?.classList.add("active");
    filterAction();
  });
  document.getElementById("priceFilter")?.addEventListener("change", filterAction);
  document.getElementById("starsFilter")?.addEventListener("change", filterAction);
  catTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      catTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      categoryFilter.value = tab.getAttribute("data-cat");
      filterAction();
    });
  });
  // Modal Closure
  document.getElementById("modalClose")?.onclick = closeModal;
  document.getElementById("modalClose")?.addEventListener("click", closeModal);
  document.getElementById("modal")?.addEventListener("click", (e) => { if(e.target === e.currentTarget) closeModal(); });
  // Theme Toggle
  document.getElementById("themeToggle")?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  });
  // Header State
  window.addEventListener("scroll", () => {
    const h = document.querySelector(".site-header");
    if (window.scrollY > 30) h?.classList.add("scrolled");
    else h?.classList.remove("scrolled");
  });
  // Chilli Easter Egg
  document.getElementById("easterEggSpicy")?.addEventListener("click", () => {
    const next = document.documentElement.getAttribute("data-theme") === "spicy" ? "dark" : "spicy";
    document.documentElement.setAttribute("data-theme", next);
    showToast("🔥 Avverti questo calore? Modalità Piccante Attivata!", "🌶️");
  });
});
// ── EASTER EGGS ──
window.addEventListener('keydown', (e) => {
  if (!window.kInp) window.kInp = "";
  window.kInp += e.key.toUpperCase();
  if (window.kInp.includes("PIZZA")) {
    showToast("🍕 Modalità Fame Attivata!", "🍕");
    document.body.style.cursor = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24' x='0'>🍕</text></svg>\"), auto";
    window.kInp = "";
  }
});
console.groupEnd();
