// --- GENERATORE AUTOMATICO DI 500 LOCALI A RUNTIME --- //
// Invece di scrivere 15.000 righe di codice, questo script istanzia in memoria 500 locali iper-realistici e dettagliati.

const CITIES = [
  { name: "Roma", lat: 41.9028, lng: 12.4964 },
  { name: "Milano", lat: 45.4642, lng: 9.1900 },
  { name: "Napoli", lat: 40.8518, lng: 14.2681 },
  { name: "Firenze", lat: 43.7696, lng: 11.2558 },
  { name: "Venezia", lat: 45.4408, lng: 12.3155 },
  { name: "Palermo", lat: 38.1157, lng: 13.3615 },
  { name: "Bologna", lat: 44.4949, lng: 11.3426 },
  { name: "Torino", lat: 45.0703, lng: 7.6869 },
  { name: "Genova", lat: 44.4056, lng: 8.9463 },
  { name: "Bari", lat: 41.1171, lng: 16.8719 },
  { name: "Catania", lat: 37.5079, lng: 15.0830 },
  { name: "Verona", lat: 45.4384, lng: 10.9916 },
  { name: "Siena", lat: 43.3188, lng: 11.3308 },
  { name: "Lecce", lat: 40.3515, lng: 18.1750 },
  { name: "Siracusa", lat: 37.0755, lng: 15.2866 },
  { name: "Parma", lat: 44.8015, lng: 10.3279 },
  { name: "Bergamo", lat: 45.6983, lng: 9.6773 },
  { name: "Lucca", lat: 43.8429, lng: 10.5027 },
  { name: "Matera", lat: 40.6664, lng: 16.6043 },
  { name: "Mantova", lat: 45.1564, lng: 10.7914 },
  { name: "Cagliari", lat: 39.2238, lng: 9.1116 },
  { name: "Trieste", lat: 45.6495, lng: 13.7768 },
  { name: "Perugia", lat: 43.1107, lng: 12.3908 },
  { name: "Pisa", lat: 43.7228, lng: 10.4017 },
  { name: "Ravenna", lat: 44.4184, lng: 12.1973 },
  { name: "Como", lat: 45.8081, lng: 9.0852 }
];

const TEMPLATES = {
  ristorante: {
    emoji: "🍝", maxP: 180, minP: 35, descVar: "Cucina gourmet di altissimo livello. Piatti della tradizione rivisitati e grandi materie prime, perfetto per una cena romantica o di classe.",
    menu: {
      antipasti: [{name:"Tagliere di Salumi e Formaggi",desc:"Selezione DOP e presidi Slow Food",price:"€18.00"},{name:"Tartare di Manzo",desc:"Con tuorlo marinato e scaglie di tartufo nero",price:"€22.00"},{name:"Fiori di Zucca Fritti",desc:"Ripieni di ricotta speziata",price:"€15.00"},{name:"Polpo Arrostito",desc:"Su vellutata di patate e polvere di olive",price:"€24.00"}],
      primi: [{name:"Risotto allo Zafferano e Midollo",desc:"Riso Carnaroli Acquarello",price:"€24.00"},{name:"Linguine allo Scoglio",desc:"Pasta fresca con astice e frutti di mare",price:"€32.00"},{name:"Tortelli di Zucca Mantovana",desc:"Con burro nocciola e salvia croccante",price:"€20.00"},{name:"Spaghetto all'Astice",desc:"Mezzo astice blu fresco prezzemolato",price:"€36.00"}],
      secondi: [{name:"Filetto al Pepe Verde",desc:"Con patate novelle al rosmarino",price:"€35.00"},{name:"Frittura Mista di Paranza",desc:"Pescato fresco locale del giorno",price:"€28.00"},{name:"Tagliata di Manzo",desc:"Rucola, grana padano 24 mesi e datterini",price:"€26.00"},{name:"Fritto Misto Imperiale",desc:"Scampi, calamari e gamberi rossi",price:"€30.00"}],
      dolci: [{name:"Tiramisù Scomposto Classico",desc:"Mascarpone artigianale",price:"€10.00"},{name:"Panna Cotta",desc:"Al caramello o frutti rossi",price:"€8.00"},{name:"Millefoglie",desc:"Crema chantilly e fragoline di bosco",price:"€12.00"}],
      vini: [{name:"Chianti Classico Riserva DOCG",desc:"Bottiglia 75cl",price:"€45.00"},{name:"Franciacorta Brut",desc:"Bottiglia 75cl",price:"€60.00"},{name:"Gewürztraminer Alto Adige",desc:"Bottiglia 75cl",price:"€38.00"},{name:"Barolo Riserva",desc:"Bottiglia 75cl - Annata 2018",price:"€120.00"}],
      bibite: [{name:"Acqua Panna / San Pellegrino",desc:"75cl",price:"€4.00"},{name:"Caffè Espresso",desc:"Torrefazione locale",price:"€2.50"}]
    }
  },
  osteria: {
    emoji: "🍷", maxP: 35, minP: 15, descVar: "Autentica osteria italiana e trattoria. Atmosfera rustica, vino scaraffato e porzioni abbondanti come faceva la nonna. Ideale per mangiare bene e spendere il giusto.",
    menu: {
      antipasti: [{name:"Crostini Misti",desc:"Fegatini toscani, salsiccia, funghi",price:"€9.00"},{name:"Bruschetta Aglio e Olio",desc:"Pomodoro basilico aglio",price:"€5.00"},{name:"Tagliere del Contadino",desc:"Salumi della casa misti",price:"€14.00"}],
      primi: [{name:"Pasta e Fagioli",desc:"Ricetta contadina",price:"€10.00"},{name:"Pappardelle al Ragù di Cinghiale",desc:"Pasta fresca tirata a mano",price:"€15.00"},{name:"Ravioli Ricotta e Spinaci",desc:"Al sugo di pomodoro o burro e salvia",price:"€12.00"},{name:"Carbonara",desc:"Pecorino e guanciale croccante",price:"€13.00"}],
      secondi: [{name:"Trippa alla Parmigiana",desc:"Cottura 6 ore nel coccio",price:"€14.00"},{name:"Arrosto di Maiale",desc:"Con patate al forno",price:"€16.00"},{name:"Spezzatino in Umido",desc:"Servito con polenta concia",price:"€15.00"}],
      dolci: [{name:"Torta della Nonna",desc:"Frolla, crema e pinoli",price:"€6.00"},{name:"Cantucci e Vin Santo",desc:"Classico toscano fatto in casa",price:"€7.00"}],
      vini: [{name:"Vino della Casa Rosso (Quarto)",desc:"Sfuso",price:"€4.00"},{name:"Vino della Casa Bianco (Mezzo)",desc:"Sfuso",price:"€7.00"},{name:"Barbera",desc:"Bottiglia",price:"€22.00"}],
      bibite: [{name:"Acqua Naturale Frizzante",desc:"1 Litro",price:"€2.00"},{name:"Gassosa Lurisia",desc:"Bottiglia di vetro",price:"€3.50"},{name:"Caffè Corretto",desc:"Grappa o Sambuca",price:"€2.50"}]
    }
  },
  pizzeria: {
    emoji: "🍕", maxP: 25, minP: 10, descVar: "Pizzeria napoletana con forno a legna, impasti a lunga lievitazione di 48h. Ingredienti DOP rigorosamente italiani e mozzarella di bufala campana. Prezzi economici.",
    menu: {
      antipasti: [{name:"Cuoppo Fritto all'Italiana",desc:"Supplì, crocchette, frittatine, zeppoline",price:"€12.00"},{name:"Montanara Fritta",desc:"Pomodoro, parmigiano, basilico",price:"€5.00"},{name:"Bufala Campana DOP",desc:"250g con pomodorini del Piennolo",price:"€10.00"}],
      pizze: [{name:"Margherita DOP",desc:"Pomodoro San Marzano, Bufala fresca",price:"€9.00"},{name:"Marinara",desc:"Aglio dell'Ufita, origano, San Marzano",price:"€7.00"},{name:"Diavola",desc:"Salame piccante Spilinga, fior di latte",price:"€10.00"},{name:"Capricciosa",desc:"Prosciutto cotto, funghi chiodini, carciofini, olive",price:"€11.00"},{name:"Salsiccia e Friarielli",desc:"Pizza bianca, provola affumicata",price:"€12.00"},{name:"Quattro Formaggi",desc:"Gorgonzola DOP, fontina, provola, parmigiano",price:"€11.00"}],
      dolci: [{name:"Pizza alla Nutella XXL",desc:"Con granella di nocciole, per due",price:"€12.00"},{name:"Babà",desc:"Al rum artigianale",price:"€5.00"},{name:"Pastiera Napoletana",desc:"Fetta",price:"€6.00"}],
      birre: [{name:"Birra Bionda Piccola",desc:"Alla spina 20cl",price:"€3.50"},{name:"Birra Bionda Media",desc:"Alla spina 40cl",price:"€5.50"},{name:"Birra Artigianale Ipa",desc:"Bottiglia 33cl",price:"€7.00"},{name:"Ichnusa Non Filtrata",desc:"Bottiglia 50cl",price:"€6.50"}],
      bibite: [{name:"Coca Cola",desc:"Lattina",price:"€2.50"},{name:"Acqua",desc:"Litro",price:"€2.00"}]
    }
  },
  bar: {
    emoji: "🍸", maxP: 20, minP: 5, descVar: "Locale poliedrico: colazioni al bancone, pranzi veloci e soprattutto tapas eccezionali con spritz per un aperitivo economico con gli amici o gli studenti.",
    menu: {
      colazione: [{name:"Espresso",desc:"",price:"€1.20"},{name:"Cappuccino",desc:"",price:"€1.60"},{name:"Cornetto Crema",desc:"Appena sfornato",price:"€1.50"},{name:"Spremuta d'Arancia",desc:"Fresca",price:"€4.00"}],
      panini: [{name:"Toast Prosciutto e Formaggio",desc:"Standard",price:"€4.00"},{name:"Tramezzino Veneziano",desc:"Tonno, cipolline e maionese",price:"€3.00"},{name:"Piadina Crudo e Squacquerone",desc:"Con rucola",price:"€6.00"}],
      aperitivo: [{name:"Spritz Aperol",desc:"Con patatine",price:"€6.00"},{name:"Spritz Campari",desc:"Con olive e taralli",price:"€6.50"},{name:"Cocktail Negroni",desc:"Mixology",price:"€9.00"},{name:"Tagliere Tapas Misto Aperitivo",desc:"Affettati, focaccia e cicchetti",price:"€14.00"}],
      birre: [{name:"Corona",desc:"Con fetta di limone",price:"€5.00"}],
      bibite: [{name:"Acqua 50cl",desc:"",price:"€1.50"},{name:"Estathè",desc:"Pesca o limone",price:"€3.00"},{name:"Chinotto Lurisia",desc:"Vetro",price:"€3.50"}]
    }
  },
  pasticceria: {
    emoji: "🥐", maxP: 25, minP: 3, descVar: "Pasticceria artigianale di altissima qualità. Torte, monoporzioni, mignon e gelati creati ogni mattina perfetti per concedersi una pausa dolcissima.",
    menu: {
      colazione: [{name:"Caffè Espresso",desc:"Miscela 100% arabica",price:"€1.50"},{name:"Marocchino",desc:"Caffè, cioccolato fondente, panna",price:"€2.00"},{name:"Brioche Siciliana col Tuppo",desc:"Vuota",price:"€2.50"}],
      dolci: [{name:"Vassoio Pasticcini Mignon",desc:"500g",price:"€22.00"},{name:"Monoporzione Sette Veli",desc:"Cioccolato estremo",price:"€6.50"},{name:"Cannolo Siciliano DOP",desc:"Ricotta di pecora e pistacchi",price:"€4.50"},{name:"Babà Crema e Amarena",desc:"",price:"€5.00"}],
      gelati: [{name:"Coppetta Media",desc:"2 gusti a scelta",price:"€3.50"},{name:"Cono Grande con Panna",desc:"3 gusti artigianali",price:"€5.00"}],
      bibite: [{name:"Succo Frutta Looza",desc:"Vetro",price:"€3.50"},{name:"Cioccolata Calda con Panna",desc:"Densissima (Inverno)",price:"€5.00"}]
    }
  }
};

const NOMI_AGGETTIVI = {
  ristorante: ["La Pergola", "Il Faro", "Da Vittorio", "La Terrazza", "Il Gattopardo", "Dal Pescatore", "La Rosetta", "Antico Arco", "Il Girasole", "Armando", "Cracco", "Piazza Duomo", "Uliassi", "Reale", "Enoteca Pinchiorri", "Le Calandre", "Osteria Francescana", "Don Alfonso", "Il Pagliaccio", "St. Hubertus", "La Peca", "Villa Crespi"],
  osteria: ["La Fraschetta", "Al Bacco", "Del Chianti", "La Vecchia Lira", "Da Peppe", "Il Cinghiale Errante", "Sora Lella", "Del Viandante", "Osteria N.1", "La Cantina", "Trattoria Zà Zà", "Casetta Trastevere", "I Due Ladroni", "Antica Trattoria", "Hostaria", "L'Archetto", "Osteria della Suburra", "Da Enzo", "Nonna Rosa"],
  pizzeria: ["Sorbillo", "Napoli Verace", "La Bufalina", "Vesuvio", "Margherita", "Forno a Legna", "Bellini", "Pizzarium", "Impasto Perfetto", "Il Pomodorino", "Da Michele", "Starita", "50 Kalò", "Seu Pizza", "I Tigli", "Pepe In Grani", "I Masanielli", "Pizzeria Salvo", "L'Antica Pizzeria"],
  bar: ["Centrale", "Navigli", "Sport", "Roma", "Milano", "Gran Caffè", "Il Chiosco", "Nazionale", "Venezia", "Belvedere", "Caffè Florian", "Caffè Greco", "Gambrinus", "Camparino", "Harry's Bar", "Caffè Pedrocchi", "Caffè Paszkowski", "Al Bicerin", "Caffè Platti"],
  pasticceria: ["Marchesi", "Siciliana", "Napoli", "Dolce Vita", "Artigianale", "Delizie", "Pasticceria Reale", "Zucchero a Velo", "L'Eclair", "Il Bignè", "Iginio Massari", "Sal De Riso", "Knam", "Martesana", "Cova", "Pasticceria Veneto", "Pinsa e Dolci", "Il Guelfo"]
};

const REVIEWS_POOL = {
  ristorante: ["Cibo spettacolare, la cura del dettaglio è folle. Consigliatissimo!", "Una location da sogno e piatti prelibati.", "Il conto è importante, ma l'esperienza li vale tutti.", "Personale fantastico, ritornerò sicuramente per l'anniversario.", "Un percorso di degustazione indimenticabile."],
  osteria: ["La vera cucina di una volta, come a casa di nonna!", "Porzioni enormi e vino della casa di qualità. Prezzi top.", "Ambiente rustico, personale alla mano e cibo verace.", "Carbonara pazzesca, la migliore della città senza dubbio.", "Un tuffo nei sapori genuini, ci siamo sentiti in famiglia."],
  pizzeria: ["La vera pizza napoletana, cornicione alto e impasto leggerissimo.", "Sono rimasto sbalordito dal sapore della bufala. Locale sempre pieno!", "Ottimo rapporto qualità/prezzo, la diavola era perfetta.", "Pizze gourmet fantastiche e fritti asciutti e croccanti.", "Difficile trovare una pizza così buona fuori da Napoli!"],
  bar: ["Cocktail strepitosi, il miglior aperitivo in centro.", "Spritz abbondante e tante tapas gratis, consigliato per studenti.", "Caffè buonissimo e cornetti caldi anche a tarda mattinata.", "Atmosfera rilassata, perfetto per lo smart working o due chiacchiere.", "Servizio veloce e personale simpaticissimo, una garanzia."],
  pasticceria: ["I loro cannoncini sono illegali, dolci pazzeschi!", "Torte moderne bellissime e buonissime. Ideale per compleanni.", "Il miglior cannolo siciliano mai mangiato al nord.", "Brioche enormi ripieni di pistacchio... un paradiso.", "Qualità artigianale altissima, prezzi onesti e locale profumatissimo."]
};

// URL Immagini Unsplash stabili e senza blocchi CORS
// URL Immagine singola e rappresentativa per categoria
const CATEGORY_IMAGE = {
  ristorante: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
  osteria: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
  pizzeria: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
  bar: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=600&q=80",
  pasticceria: "https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=600&q=80"
};

function generate500Restaurants() {
  const result = [];
  let id = 1;
  const cats = ["ristorante", "osteria", "pizzeria", "bar", "pasticceria"];

  for (let i = 0; i < 500; i++) {
    const cat = cats[i % cats.length];
    const cityObj = CITIES[i % CITIES.length];
    const tpl = TEMPLATES[cat];
    
    // Creazione del nome univoco randomico reale
    const nomePrefix = NOMI_AGGETTIVI[cat][Math.floor(Math.random() * NOMI_AGGETTIVI[cat].length)];
    const randomSuffix = Math.random() > 0.4 ? " " + cityObj.name : "";
    const nome = (Math.random() > 0.3 ? cat.charAt(0).toUpperCase() + cat.slice(1) + " " : "") + nomePrefix + randomSuffix;
    
    let urlSlug = encodeURIComponent(nome + " " + cityObj.name + " ristorante");
    let website = "https://www.google.com/search?q=" + urlSlug;

    let latOffset = (Math.random() - 0.5) * 0.08;
    let lngOffset = (Math.random() - 0.5) * 0.08;
    
    // Novità: Email e Prenotazioni
    let urlSlugSimple = nome.toLowerCase().replace(/[^a-z0-9]/g, '');
    let email = `info@${urlSlugSimple}.it`;
    let form_available = Math.random() > 0.1; // 90% ha prenotazioni online libere
    // Generazione posti liberi (tra 0 e 50). 15% di probabilità di essere completo (0).
    let postiDisponibili = Math.random() < 0.15 ? 0 : Math.floor(Math.random() * 45) + 5;
    
    // TripAdvisor Data
    let ratingVal = (Math.random() * (5.0 - 3.8) + 3.8).toFixed(1); // da 3.8 a 5.0
    let reviewsCount = Math.floor(Math.random() * 2500) + 50; 
    let topReview = REVIEWS_POOL[cat][Math.floor(Math.random() * REVIEWS_POOL[cat].length)];

    // Generazione Array di 3 Recensioni "Reali" Utenti
    const nomiUtenti = ["Marco R.", "Giulia T.", "Alessandro M.", "Chiara F.", "Luca P.", "Francesca S.", "Matteo B.", "Sara V.", "Davide C.", "Elena N."];
    let recensioniReali = [];
    for(let k=0; k<3; k++) {
      let nomeRandom = nomiUtenti[Math.floor(Math.random() * nomiUtenti.length)];
      let testoRandom = REVIEWS_POOL[cat][Math.floor(Math.random() * REVIEWS_POOL[cat].length)];
      let starsUtente = Math.floor(Math.random() * 2) + 4; // 4 o 5 stelle
      let dateOffset = Math.floor(Math.random() * 30) + 1; // da 1 a 30 giorni fa
      recensioniReali.push({
        user: nomeRandom,
        text: testoRandom,
        stars: "★".repeat(starsUtente) + "☆".repeat(5 - starsUtente),
        date: `${dateOffset} giorni fa`
      });
    }

    // Stelle in base alla categoria
    let starsArr = ["★★★★☆", "★★★★★"];
    if (cat === "osteria" || cat === "bar") starsArr = ["★★★☆☆", "★★★★☆"];

    // Generazione allergeni random nel menu
    let clonedMenu = JSON.parse(JSON.stringify(tpl.menu));
    Object.keys(clonedMenu).forEach(category => {
      clonedMenu[category].forEach(item => {
        let hasVegetarian = Math.random() > 0.70 ? "🌱" : "";
        let hasGlutenFree = Math.random() > 0.85 ? "🌾" : "";
        let hasNuts = Math.random() > 0.90 ? "🥜" : "";
        item.allergens = (hasVegetarian + " " + hasGlutenFree + " " + hasNuts).trim();
      });
    });

    let filosofia = "Siamo fieri promotori della filiera corta e del KM zero. Le nostre materie prime provengono da produttori locali selezionati, garantendo freschezza assoluta, rispetto della stagionalità e sostenibilità ambientale.";
    
    let imageUrl = CATEGORY_IMAGE[cat];

    let item = {
      id: id++,
      name: nome,
      city: cityObj.name,
      cat: cat,
      emoji: tpl.emoji,
      image: imageUrl,
      stars: starsArr[Math.floor(Math.random() * starsArr.length)],
      avgPrice: `€${tpl.minP}–${tpl.maxP}`,
      address: `Via ${["Roma", "Garibaldi", "Mazzini", "Dante", "Verdi", "Cavour", "Europa"][Math.floor(Math.random()*7)]} ${Math.floor(Math.random()*150)+1}, ${cityObj.name}`,
      phone: "0" + (Math.floor(Math.random() * 900000000) + 100000000),
      orari: cat === 'bar' ? "07:00–20:00" : (cat === 'pasticceria' ? "07:30–13:00 · 15:30-19:30" : "12:00–15:00 · 19:00–23:30"),
      desc: tpl.descVar,
      lat: cityObj.lat + latOffset,
      lng: cityObj.lng + lngOffset,
      website: website,
      email: email,
      filosofia: filosofia,
      form_available: form_available,
      postiDisponibili: postiDisponibili,
      rating: ratingVal,
      reviewsCount: reviewsCount,
      topReview: topReview,
      reviewsList: recensioniReali,
      menu: clonedMenu
    };
    result.push(item);
  }
  return result;
}

// ── ESECUZIONE & CACHE GIORNALIERA ──
// Il database si aggiorna a mezzanotte. Finché la giornata non cambia, usa la cache salvata.
const todayStr = new Date().toLocaleDateString("it-IT"); // Es: "01/04/2026"
const LS_KEY = "resto_data_v5_" + todayStr.replace(/\//g, "-");

let RESTAURANTS = [];
let storedData = localStorage.getItem(LS_KEY);

if (storedData) {
  // Se l'utente ha già caricato il sito oggi, carica il database fisso (Persistenza)
  RESTAURANTS = JSON.parse(storedData);
} else {
  // Se è un nuovo giorno (o il primissimo accesso), pulisci i giorni vecchi per non intasare la memoria browser
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith("resto_data_") || key.startsWith("booking_")) {
      localStorage.removeItem(key);
    }
  });

  // Genera i 500 locali aggionati
  RESTAURANTS = generate500Restaurants();

  // Salvalo nel LocalStorage per bloccarlo per tutto il resto della giornata
  localStorage.setItem(LS_KEY, JSON.stringify(RESTAURANTS));
}
