/* ================================================
   app.js – Guida Ristoranti d'Italia
   ================================================ */

// ── TAB LABELS ──
const TAB_LABELS = {
  antipasti: "🥗 Antipasti",
  pizze: "🍕 Pizze",
  colazione: "☕ Colazione",
  cicchetti: "🍢 Cicchetti",
  panini: "🥖 Panini",
  aperitivo: "🍸 Aperitivo",
  gelati: "🍦 Gelati",
  granite: "🧊 Granite",
  cioccolato: "🍫 Cioccolato",
  primi: "🍝 Primi",
  secondi: "🍖 Secondi",
  dolci: "🍰 Dolci",
  bevande: "🥤 Bevande",
  vini: "🍷 Vini",
  birre: "🍺 Birre",
  bibite: "🥤 Bibite & Caffè",
};

// ── UTILS: ORARI ──
function isCurrentlyOpen(orariStr) {
  if (!orariStr) return false;
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const currentTime = h + m / 60;

  const slots = orariStr.split('·').map(s => s.trim());
  for (let slot of slots) {
    const parts = slot.split(/[-–]/);
    if (parts.length === 2) {
      const [start, end] = parts.map(s => {
        const [sh, sm] = s.split(':').map(Number);
        return sh + (sm || 0) / 60;
      });
      if (currentTime >= start && currentTime <= end) {
        return true;
      }
    }
  }
  return false;
}

// ── DRINK CLASSES ──
const DRINK_CLASSES = { vini: "drink-wine", birre: "drink-beer", bibite: "drink-soft", bevande: "drink-soft" };

// ── MAP INIT ──
let map;
let markerClusterGroup;
const markers = [];

function initMap() {
  map = L.map("map", { zoomControl: true, scrollWheelZoom: false }).setView([42.4, 13.0], 5);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
    maxZoom: 18,
  }).addTo(map);

  // Utilizziamo un semplice layerGroup invece del cluster per mostrare tutti i "puntini" separati
  markerClusterGroup = L.layerGroup();

  RESTAURANTS.forEach(r => {
    const icon = L.divIcon({
      className: "",
      html: `<div style="background:var(--gold,#c9933a);width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 3px 12px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;font-size:1.1rem;cursor:pointer;">${r.emoji}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -38],
    });

    const marker = L.marker([r.lat, r.lng], { icon });
    marker.bindPopup(`
      <div style="min-width:160px;">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.1rem;font-weight:700;color:#f0c060;">${r.name}</div>
        <div style="font-size:.8rem;color:#9a8060;margin-top:2px;">📍 ${r.city}</div>
        <div style="font-size:.8rem;color:#c4a878;margin-top:4px;">${r.stars} · ${r.avgPrice}</div>
        <button onclick="openModal(${r.id})" style="margin-top:8px;background:#c9933a;color:#1a1208;border:none;border-radius:12px;padding:5px 14px;font-size:.8rem;font-weight:700;cursor:pointer;">Vedi Menu →</button>
      </div>
    `, { className: "map-popup" });

    markers.push({ marker, restaurant: r });
    markerClusterGroup.addLayer(marker);
  });

  map.addLayer(markerClusterGroup);
}

// ── RENDER CARDS ──
function renderCards(list) {
  const grid = document.getElementById("cardsGrid");

  // Mostra skeleton screens per 800ms prima delle card reali
  const skeletonCount = Math.min(list.length, 12);
  grid.innerHTML = Array.from({length: skeletonCount}, () => `
    <div class="skeleton-card">
      <div class="skeleton-img"></div>
      <div class="skeleton-body">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line mid"></div>
        <div class="skeleton-line full"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');

  setTimeout(() => {
    grid.innerHTML = "";
    if (list.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;color:var(--muted)">
        <div style="font-size:3rem;margin-bottom:16px">🍽️</div>
        <strong style="font-size:1.2rem;color:var(--text)">Nessun locale trovato</strong>
        <p style="margin-top:8px">Prova con altri filtri o una diversa citt&agrave;</p>
      </div>`;
      return;
    }
    list.forEach(r => {
      const card = document.createElement("div");
      card.className = "card";
      card.setAttribute("data-id", r.id);
      card.setAttribute("data-cat", r.cat);
      card.innerHTML = `
        <img src="${r.image}" loading="lazy" alt="${r.cat} ${r.name}" class="card-img" />
        <div class="card-body">
          <span class="card-cat">${r.cat}</span>
          <div class="card-name">${r.name}</div>
          <div class="card-city">📍 ${r.city}</div>
          <div class="card-desc">${r.desc}</div>
          <div class="card-footer">
            <div>
              <div class="card-stars">${r.stars}</div>
              <div class="card-price">Medio: <strong>${r.avgPrice}</strong></div>
              <div style="font-size: .8rem; font-weight: 700; margin-top: 4px; color: ${isCurrentlyOpen(r.orari) ? '#2d8a39' : '#d32f2f'}">
                ${isCurrentlyOpen(r.orari) ? '🟢 Aperto Ora' : '🔴 Chiuso'}
              </div>
              ${r.form_available ? (r.postiDisponibili > 0 ? `<div class="card-availability av-green">🟢 ${r.postiDisponibili} Posti disponibili</div>` : `<div class="card-availability av-red">🔴 Completo</div>`) : ''}
            </div>
            <button class="card-btn" onclick="openModal(${r.id})">Vedi Menu →</button>
          </div>
          ${r.website ? `<a href="${r.website}" target="_blank" class="card-website-btn">🌐 Visita sito web</a>` : ''}
        </div>`;
      grid.appendChild(card);
    });
  }, 800);
}

// ── OPEN MODAL ──
function openModal(id) {
  const r = RESTAURANTS.find(x => x.id === id);
  if (!r) return;

  const tabs = Object.keys(r.menu);
  const tabsHTML = tabs.map((k, i) =>
    `<button class="menu-tab ${i === 0 ? "active" : ""}" data-tab="${k}" onclick="switchTab('${k}',this)">${TAB_LABELS[k] || k}</button>`
  ).join("") + `<button class="menu-tab" data-tab="recensioni" onclick="switchTab('recensioni',this)">⭐ Recensioni</button>`;

  const panelsHTML = tabs.map((k, i) => {
    const dClass = DRINK_CLASSES[k] || "";
    const items = r.menu[k].map(item => `
      <div class="menu-item ${dClass}">
        <div class="mi-info">
          <div class="mi-name">${item.name} ${item.allergens ? `<span style="font-size: .8rem; margin-left: 6px;" title="Allergeni e Diete Speciali">${item.allergens}</span>` : ""}</div>
          ${item.desc ? `<div class="mi-desc">${item.desc}</div>` : ""}
        </div>
        <div class="mi-price">${item.price}</div>
      </div>`).join("");
    return `<div class="menu-panel ${i === 0 ? "active" : ""}" id="panel-${k}">${items}</div>`;
  }).join("");

  // Costruzione Pannello Recensioni
  const reviewsHTML = r.reviewsList ? r.reviewsList.map(rev => `
    <div class="review-card">
      <div class="rev-avatar">👤</div>
      <div class="rev-body">
        <div class="rev-header">
          <strong>${rev.user}</strong>
          <span class="rev-date">${rev.date}</span>
        </div>
        <div class="rev-stars">${rev.stars}</div>
        <div class="rev-text">"${rev.text}"</div>
      </div>
    </div>
  `).join("") : "";

  document.getElementById("modalContent").innerHTML = `
    <div class="m-header" style="background: linear-gradient(160deg, rgba(20,12,4,0.8) 0%, rgba(20,12,4,0.4) 60%, rgba(20,12,4,0.85) 100%), url('${r.image}') center/cover no-repeat;">
      <div class="m-cat">${r.cat.toUpperCase()}</div>
      <div class="m-name">${r.name}</div>
      <div class="m-meta">
        <span class="m-meta-item">📍 ${r.address}</span>
        <span class="m-meta-item">📞 ${r.phone}</span>
        <span class="m-meta-item">✉️ ${r.email}</span>
        <span class="m-meta-item">🕐 ${r.orari} <strong style="color: ${isCurrentlyOpen(r.orari) ? '#2d8a39' : '#d32f2f'}">(${isCurrentlyOpen(r.orari) ? '🟢 Aperto Ora' : '🔴 Chiuso'})</strong></span>
        <span class="m-meta-item">${r.stars}</span>
        <span class="m-meta-item">💶 ${r.avgPrice}</span>
        ${r.website ? `<a href="${r.website}" target="_blank" class="m-meta-item website-link">🌐 SITO UFFICIALE</a>` : ''}
        
        <a href="https://www.google.com/maps/dir/?api=1&destination=${r.lat},${r.lng}" target="_blank" class="m-meta-item website-link" style="background: rgba(45,138,57,.15); color: #2d8a39;">🗺️ PORTAMI QUI</a>

        ${r.form_available ?
      `<button class="m-book-action" onclick="openBooking(${r.id})" ${r.postiDisponibili <= 0 ? 'disabled' : ''}>
             ${r.postiDisponibili > 0 ? '📅 PRENOTA UN TAVOLO' : '❌ ESAURITO'}
           </button>`
      : ''}

      </div>
      <div class="m-desc">${r.desc}</div>
      ${r.filosofia ? `<div class="m-filosofia" style="margin-top: 14px; font-size: .85rem; color: #b0956a; border-left: 3px solid rgba(201,147,58,.4); padding-left: 14px;"><strong>🌿 La Nostra Filosofia:</strong> ${r.filosofia}</div>` : ''}
    </div>
    <div class="menu-tabs">${tabsHTML}</div>
    <div class="menu-body">
      ${panelsHTML}
      <div class="menu-panel" id="panel-recensioni">
        <div class="reviews-summary">
          ⭐ <strong>${r.rating} / 5</strong> - Basato su ${r.reviewsCount} recensioni TripAdvisor
        </div>
        ${reviewsHTML}
      </div>
    </div>`;

  const overlay = document.getElementById("modal");
  overlay.classList.add("open");
  document.body.style.overflow = "hidden";

  // fly map to restaurant
  if (map) map.setView([r.lat, r.lng], 12);
}

function switchTab(key, btn) {
  document.querySelectorAll(".menu-tab").forEach(t => t.classList.remove("active"));
  document.querySelectorAll(".menu-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  const panel = document.getElementById("panel-" + key);
  if (panel) panel.classList.add("active");
}

// ── CLOSE MODAL ──
function closeModal() {
  document.getElementById("modal").classList.remove("open");
  document.body.style.overflow = "";
}
document.getElementById("modalClose").addEventListener("click", closeModal);
document.getElementById("modal").addEventListener("click", e => {
  if (e.target === e.currentTarget) closeModal();
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

// ── FILTERS & MAP BOUNDS ──
function applyFilters() {
  const categorySelect = document.getElementById("categoryFilter");
  const cat = categorySelect ? categorySelect.value : "all";
  const q = document.getElementById("searchInput").value.toLowerCase().trim();
  const price = document.getElementById("priceFilter")?.value || "all";
  const starsMin = parseFloat(document.getElementById("starsFilter")?.value) || 0;

  const filtered = RESTAURANTS.filter(r => {
    const matchCat = cat === "all" || r.cat === cat;
    const matchQ = !q || r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q);
    // Parse prezzo numerico da stringa tipo "€25-40"
    let matchPrice = true;
    if (price !== "all" && r.avgPrice) {
      const nums = r.avgPrice.match(/\d+/g);
      if (nums) {
        const avg = (parseInt(nums[0]) + parseInt(nums[nums.length - 1])) / 2;
        if (price === "low")  matchPrice = avg < 30;
        if (price === "mid")  matchPrice = avg >= 30 && avg <= 60;
        if (price === "high") matchPrice = avg > 60;
      }
    }
    const matchStars = !starsMin || parseFloat(r.rating) >= starsMin;
    return matchCat && matchQ && matchPrice && matchStars;
  });
  renderCards(filtered);

  // update map markers visibility and calculate bounding box
  let bounds = [];
  markerClusterGroup.clearLayers();

  markers.forEach(({ marker, restaurant: r }) => {
    const show = filtered.some(f => f.id === r.id);
    if (show) {
      markerClusterGroup.addLayer(marker);
      bounds.push([r.lat, r.lng]);
    }
  });

  // Automatically zoom and pan the map to fit all visible markers
  if (bounds.length > 0) {
    if (bounds.length === 1) {
      // Se c'è solo un risultato, fai zoom diretto sul punto per non sbarellare troppo
      map.setView(bounds[0], 14);
    } else {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }
}

const catTabs = document.querySelectorAll(".cat-tab");
const categorySelect = document.getElementById("categoryFilter");

catTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    catTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    if (categorySelect) categorySelect.value = tab.dataset.cat;
    applyFilters();
  });
});

categorySelect?.addEventListener("change", (e) => {
  const selectedCat = e.target.value;
  catTabs.forEach(t => t.classList.toggle("active", t.dataset.cat === selectedCat));
  applyFilters();
});

document.getElementById("searchInput").addEventListener("input", applyFilters);

// ── INIT ──
document.addEventListener("DOMContentLoaded", () => {
  // Dark Mode: carica preferenza salvata
  const savedTheme = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  const toggleBtn = document.getElementById("themeToggle");
  if (toggleBtn) {
    toggleBtn.textContent = savedTheme === "dark" ? "🌙" : "☀️";
    toggleBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      toggleBtn.textContent = next === "dark" ? "🌙" : "☀️";
    });
  }

  renderCards(RESTAURANTS);
  initMap();
  document.getElementById("countRest").textContent = RESTAURANTS.length;

  const oggi = new Date().toLocaleDateString("it-IT");
  document.getElementById("last-update-bar").innerHTML = `🔄 Ultimo aggior. server: <strong>${oggi} 00:00</strong>`;

  // Filtri aggiuntivi
  document.getElementById("priceFilter")?.addEventListener("change", applyFilters);
  document.getElementById("starsFilter")?.addEventListener("change", applyFilters);
});

// ── AI CHATBOT VIRTUAL SOMMELIER ──
const chatFab = document.getElementById("chatbot-fab");
const chatWindow = document.getElementById("chatbot-window");
const chatClose = document.getElementById("chatbot-close");
const chatInput = document.getElementById("chat-input-text");
const chatSend = document.getElementById("chat-send-btn");
const chatMsgs = document.getElementById("chatbot-messages");
const chatTyping = document.getElementById("chat-typing");
const chatOverlay = document.getElementById("chatbot-overlay");

function openChat() {
  chatOverlay.classList.remove("hidden");
  chatWindow.classList.remove("hidden");
  chatInput.focus();
}

function closeChat() {
  chatOverlay.classList.add("hidden");
  chatWindow.classList.add("hidden");
}

chatFab.addEventListener("click", openChat);
chatClose.addEventListener("click", closeChat);
chatOverlay.addEventListener("click", closeChat);

// Used by the Quick Reply buttons in HTML
window.sendQuickReply = function (text) {
  chatInput.value = text;
  processChat();
};

function scrollToBottom() {
  chatMsgs.scrollTop = chatMsgs.scrollHeight;
}

function addChatMsg(text, isUser, suggestionIds = null) {
  const row = document.createElement("div");
  row.className = `msg-row ${isUser ? 'user-row' : 'ai-row'}`;

  const avatarHtml = isUser ? `<div class="msg-avatar">👤</div>` : `<div class="msg-avatar">🤖</div>`;

  let msgContent = `<div class="msg ${isUser ? 'user-msg' : 'ai-msg'}">${text}</div>`;

  if (isUser) {
    row.innerHTML = msgContent + avatarHtml;
  } else {
    row.innerHTML = avatarHtml + msgContent;
  }

  const msgDiv = row.querySelector('.msg');

  if (suggestionIds && !isUser) {
    // Se è un array di id (Multi-card)
    let ids = Array.isArray(suggestionIds) ? suggestionIds : [suggestionIds];

    ids.forEach(id => {
      const r = RESTAURANTS.find(x => x.id === id);
      if (r) {
        const card = document.createElement("div");
        card.className = "chat-sugg-card";
        card.onclick = () => { openModal(r.id); chatWindow.classList.add("hidden"); };

        const ratingColor = parseFloat(r.rating) >= 4.5 ? '#2d8a39' : '#c9933a';

        card.innerHTML = `
          <div class="chat-sugg-icon">${r.emoji}</div>
          <div class="chat-sugg-info">
            <div class="chat-sugg-title">${r.name}</div>
            <div class="chat-sugg-meta">
              📍 ${r.city} • 💶 ${r.avgPrice}<br>
              <span style="color:${ratingColor};font-weight:700;">${r.rating}/5</span> su ${r.reviewsCount} recensioni
            </div>
          </div>
        `;
        msgDiv.appendChild(card);
      }
    });
  }

  chatMsgs.appendChild(row);
  scrollToBottom();
}

function handleAiResponse(query) {
  chatTyping.classList.add("hidden");

  const q = query.toLowerCase().trim();

  const isVago = q.length < 5 || q === "ciao" || q.includes("ho fame") || q.includes("consigli") || q.includes("aiuto");

  // Specific match: controlliamo se il nome base (es. "Sorbillo" ignorando "Napoli") è nella query
  const specificMatch = RESTAURANTS.find(r => {
    let baseName = r.name.toLowerCase().split(' ')[0];
    return baseName.length > 3 && q.includes(baseName);
  });

  // 1. Dettagli Specifici (TripAdvisor) su Ristorante
  if (specificMatch && (q.includes("info") || q.includes("recension") || q.includes("vota") || q.includes("voto") || q.includes("tripadvisor") || q.includes("dati") || q.includes("dimmi"))) {
    addChatMsg(`Certamente! Ecco i dati TripAdvisor per <strong>${specificMatch.name}</strong> a ${specificMatch.city}.<br><br>🌟 <strong>${specificMatch.rating}/5</strong> (su ${specificMatch.reviewsCount} recensioni)<br><br>💬 Dicono di loro: <br><em>"${specificMatch.topReview}"</em><br><br>Clicca la scheda per prenotare.`, false, [specificMatch.id]);
    return;
  }

  // 2. Query Vaga -> Tre scelte random spettacolari
  if (isVago) {
    const misti = [...RESTAURANTS].sort(() => 0.5 - Math.random()).slice(0, 3).map(r => r.id);
    addChatMsg("Sembri indeciso! Ecco **3 tra i nostri locali meglio recensiti** su TripAdvisor per ispirarti:", false, misti);
    return;
  }

  // 3. MOTORE DI RICERCA SEMANTICA STRICT
  let matches = RESTAURANTS;
  let hasFoodOrCatFilter = false;

  // A) Filtri Categoria Assoluti (Singolari e Plurali)
  if (q.includes("pizza") || q.includes("pizzeria") || q.includes("pizzerie") || q.includes("margherita")) {
    matches = matches.filter(r => r.cat === "pizzeria");
    hasFoodOrCatFilter = true;
  } else if (q.includes("dolce") || q.includes("pasticceria") || q.includes("pasticcerie") || q.includes("gelato") || q.includes("cornetto")) {
    matches = matches.filter(r => r.cat === "pasticceria");
    hasFoodOrCatFilter = true;
  } else if (q.includes("bar") || q.includes("aperitivo") || q.includes("cocktail") || q.includes("spritz") || q.includes("tapas")) {
    matches = matches.filter(r => r.cat === "bar");
    hasFoodOrCatFilter = true;
  } else if (q.includes("osteria") || q.includes("osterie") || q.includes("trattoria") || q.includes("trattorie") || q.includes("nonna")) {
    matches = matches.filter(r => r.cat === "osteria");
    hasFoodOrCatFilter = true;
  } else if (q.includes("ristorante") || q.includes("ristoranti") || q.includes("gourmet")) {
    matches = matches.filter(r => r.cat === "ristorante");
    hasFoodOrCatFilter = true;
  }

  // B) Filtri Cibo Specifico (se non ha matchato la categoria pura)
  if (!hasFoodOrCatFilter) {
    if (q.includes("pesce") || q.includes("mare") || q.includes("sushi")) {
      matches = matches.filter(r => JSON.stringify(r.menu).toLowerCase().includes("pesce") || r.desc.toLowerCase().includes("mare") || JSON.stringify(r.menu).toLowerCase().includes("gamber"));
      hasFoodOrCatFilter = true;
    } else if (q.includes("carne") || q.includes("bistecca") || q.includes("grigliata")) {
      matches = matches.filter(r => JSON.stringify(r.menu).toLowerCase().includes("bistecca") || JSON.stringify(r.menu).toLowerCase().includes("carne") || r.desc.toLowerCase().includes("carne"));
      hasFoodOrCatFilter = true;
    }
  }

  // C) Ricerca Testuale (Solo se non c'è già un filtro Categoria/Cibo forte)
  if (!hasFoodOrCatFilter) {
    matches = matches.filter(r => r.name.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.desc.toLowerCase().includes(q));
  }

  // D) Modificatori Addizionali
  if (q.includes("economico") || q.includes("studenti")) {
    matches = matches.filter(r => parseInt(r.avgPrice.replace(/[^0-9]/g, '').substring(0, 2)) <= 20 || r.cat === 'pizzeria' || r.cat === 'bar');
  }
  if (q.includes("romantica") || q.includes("elegante") || q.includes("lusso") || q.includes("anniversario")) {
    matches = matches.filter(r => r.stars === '★★★★★' || r.stars === '★★★★☆');
  }

  // E) Estrazione automatica CITTÀ (Forza il match della città)
  const allCities = [...new Set(RESTAURANTS.map(r => r.city.toLowerCase()))];
  for (let c of allCities) {
    if (q.includes(c)) {
      matches = matches.filter(r => r.city.toLowerCase() === c);
      break; // fermati alla prima città trovata
    }
  }

  // 4. ELABORAZIONE FINALE DELLA RISPOSTA
  if (matches.length > 0) {
    if (matches.length === 1) {
      const top = matches[0];
      addChatMsg(`Perfetto, ho una scelta miratissima per te! Ecco <strong>${top.name}</strong> a ${top.city}.`, false, [top.id]);
    } else {
      // Prendi fino a 3 migliori (Ordinati per r.rating discendente simulato e presi a caso tra i top)
      const scelti = matches.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating)).slice(0, 3);
      const ids = scelti.map(r => r.id);
      addChatMsg(`Assolutamente! Ho trovato ${matches.length} locali incredibili. Ecco la mia <strong>Top ${ids.length}</strong> assoluta in base a quello che cerchi:`, false, ids);
    }
  } else {
    const misti = [...RESTAURANTS].sort(() => 0.5 - Math.random()).slice(0, 3).map(r => r.id);
    addChatMsg(`Cavolo, non ho trovato un match 100% esatto per questa estrosa richiesta... ma ti prometto che questi 3 posti in giro per l'Italia sono una bomba:`, false, misti);
  }
}

function processChat() {
  const text = chatInput.value.trim();
  if (!text) return;
  addChatMsg(text, true);
  chatInput.value = "";

  // Show typing indicator
  chatMsgs.appendChild(chatTyping); // move it to the bottom
  chatTyping.classList.remove("hidden");
  scrollToBottom();

  // Fake thinking delay for realism
  const thinkingTime = Math.random() * 800 + 800; // 800-1600ms
  setTimeout(() => handleAiResponse(text), thinkingTime);
}

chatSend.addEventListener("click", processChat);
chatInput.addEventListener("keydown", (e) => { if (e.key === "Enter") processChat(); });

// ── SISTEMA PRENOTAZIONI ──
const bookModal = document.getElementById("bookModal");
const bookClose = document.getElementById("bookClose");
const bookForm = document.getElementById("bookForm");
const bookRestName = document.getElementById("bookRestName");
let currentBookingRestId = null;

window.openBooking = function (id) {
  const r = RESTAURANTS.find(x => x.id === id);
  if (!r) return;
  currentBookingRestId = r.id;
  bookRestName.innerHTML = `Prenota da <strong>${r.name}</strong>`;
  bookForm.reset();
  bookModal.classList.add("open");
};

bookClose.addEventListener("click", () => bookModal.classList.remove("open"));

bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const guests = parseInt(document.getElementById("bookGuests").value, 10);

  const r = RESTAURANTS.find(x => x.id === currentBookingRestId);
  if (!r) return;

  if (guests > r.postiDisponibili) {
    alert(`Spiacenti, il locale ha a disposizione solo ${r.postiDisponibili} posti. Non possiamo accettare prenotazioni per ${guests} persone in questo orario.`);
    return;
  }

  // Conferma
  r.postiDisponibili -= guests;
  alert(`✔️ SUCCESS!\n\nLa richiesta per ${guests} persone è stata inviata a ${r.email}.\n\nIl Ristorante ${r.name} ti confermerà a breve il tavolo.`);
  bookModal.classList.remove("open");

  // Ricarica la vista modal e le cards per mostrare i posti scalati
  openModal(r.id);
  applyFilters();
});
