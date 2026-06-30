/* =========================================
   VERTEX EVENTS - DATA & INTERACTIVE LOGIC
   ========================================= */

// --- Default Event Data ---
const DEFAULT_EVENTS = [
  {
    id: "evt_yat_kutlamasi",
    title: "Vertex Yat Kutlaması",
    title_en: "Vertex Yacht Celebration",
    desc: "Vertex'in ilk resmi kutlaması, 3 yıllık yoğun çalışmaların sonucunda; Cortex'in 100000 indirme barajını geçmesini, Vertex'in Teknopark İstanbul'a kabul almasını, fal.ai gibi büyük şirketlerle yaptığı ortaklıkları ve daha nice başarıyı toplamak için yapılmıştır.",
    desc_en: "Vertex's first official celebration, following 3 years of intense work; gathered to celebrate Cortex surpassing 100,000 downloads, Vertex's acceptance into Teknopark Istanbul, partnerships with major companies like fal.ai, and many more successes.",
    date: "2026-06-19",
    dateText: "19 Haziran 2026",
    dateText_en: "June 19, 2026",
    location: "Türkiye, İstanbul, Beylerbeyi, Beylerbeyi Parkı 34676",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Beylerbeyi+Parkı,+İstanbul,+Türkiye",
    location_en: "Beylerbeyi Park, Istanbul, Turkey 34676",
    price: 0,
    images: [
      "../assets/gallery/yacht-1.jpeg",
      "../assets/gallery/yacht-2.jpeg",
      "../assets/gallery/yacht-3.jpeg",
      "../assets/gallery/yacht-4.jpeg",
      "../assets/gallery/yacht-5.jpeg",
      "../assets/gallery/yacht-6.jpeg",
      "../assets/gallery/yacht-7.jpg"
    ]
  },
  {
    id: "evt_tech_summit",
    title: "Vertex Teknoloji Zirvesi '26",
    title_en: "Vertex Tech Summit '26",
    desc: "Teknoloji dünyasının önde gelen isimleri ile birlikte geleceğin teknolojilerini tartışacağımız büyük zirve. Yapay zeka, Web3 ve daha fazlası hakkında paneller, networking fırsatları ve atölyeler sizi bekliyor.",
    desc_en: "The great summit where we will discuss future technologies with leading names of the tech world. Panels on AI, Web3 and more, networking opportunities and workshops await you.",
    date: "2026-09-27",
    dateText: "27 Eylül 2026",
    dateText_en: "September 27, 2026",
    location: "Türkiye, İstanbul, Pendik, Teknopark İstanbul 34912",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Teknopark+İstanbul,+Pendik,+Türkiye",
    location_en: "Teknopark Istanbul, Pendik, Turkey 34912",
    price: "multiple",
    stripeLinkStandart: "https://buy.stripe.com/7sYaEY3Dw9Zz5V98hleIw00",
    stripeLinkSpesiyal: "https://buy.stripe.com/5kQcN65LE9Zz5V9cxBeIw01",
    banner: "url('../assets/gallery/teknopark.jpg') center/cover",
    detailDesc: "Geleceğin liderlerini ve teknoloji meraklılarını bir araya getireceğimiz bu heyecan dolu buluşma, 27 Eylül 2026 tarihinde kapılarını açmaya hazırlıyor. Teknolojinin kalbinin atacağı zirvemizde, vizyoner konuşmacılarımızın yapacağı ilham verici sunumlar ve ufuk açıcı konuşmalarla katılımcılarımıza yepyeni pencereler aralamayı hedefliyoruz. Sektörün öncülerinden dinlenecek her bir başarı ve deneyim hikayesi, kendi zirvesine ulaşmak isteyen her bir katılımcı için güçlü birer motivasyon kaynağı haline gelecek.<br><br>Bu benzersiz deneyimi tam anlamıyla yaşayabilmek ve üretkenliği en üst seviyede tutabilmek adına, güne dinamik bir başlangıç sunan sabah kahvaltısı ikramımızla başlayacağız. Yoğun ve ilham dolu oturumların arasında enerjimizi tazelemek, fikir alışverişlerine keyifli bir mola vermek için ise öğle yemeği ikramımızla katılımcılarımızı ağırlayacağız. Sabah tam 09.00’da başlayacak olan kesintisiz teknoloji yolculuğumuz, gün boyu sürecek network fırsatları ve öğretici panellerin ardından saat 19.00’da görkemli bir kapanışla sona erecek.<br><br>Sektörün geleceğine yön verecek olan bu ilk zirvemizde, seçkin ve odaklanmış bir topluluk oluşturmak adına 200 katılımcıya ev sahipliği yapmayı planlıyoruz. Dinamik, meraklı ve üretmeye aç genç nesilleri bir araya getirmeyi amaçladığımız etkinliğimizde ana hedef kitlemiz liseli dostlarımız olsa da, kapılarımız en az lise öğrencisi olmak şartıyla vizyonumuza ortak olmak isteyen tüm üniversite öğrencilerine de sonuna kadar açık. Vertex’in birleştirici gücüyle, teknolojinin mutlak odağında buluşmak ve hep birlikte zirveye yürümek için gün sayıyoruz.<br><br>Bu vizyoner yolculukta yalnız olmadığımızı bilmek ve teknoloji dünyasının devleriyle omuz omuza yürümek, en büyük motivasyon kaynaklarımızdan birini oluşturuyor. Henüz ilk yıllarımızda olmamıza rağmen, yapay zekanın küresel aktörlerinden olan milyar dolarlık dev fal.ai başta olmak üzere, sektörün yönünü tayin eden onlarca vizyoner kuruluş bu büyük buluşmaya destek sağlıyor. Katılımcılarımızın yanı sıra, arka planda bu kusursuz deneyimi inşa etmek için gece gündüz çalışan yaklaşık 50 kişilik tam yetkili organizasyon ekibimizle birlikte, zirve günü alanda toplamda 250 kişilik dev bir teknoloji topluluğu olarak tek yürek olacağız.",
    type: "BİLETLİ ETKİNLİK",
    disableRegister: false
  }
];

// --- Application State ---
let events = [...DEFAULT_EVENTS];
let showPastEvents = true;
let isStripeMode = false;
let selectedEvent = null;

// --- DOM References ---
const eventsGrid = document.getElementById('events-grid');
const showPastEventsCheckbox = document.getElementById('show-past-events');
const showPastLabel = document.getElementById('show-past-label');

// Modal Elements
const detailModal = document.getElementById('event-detail-modal');
const modalDetailBody = document.getElementById('modal-detail-body');
const modalCloseDetails = document.getElementById('modal-close-details');

const registerModal = document.getElementById('register-modal');
const modalCloseRegister = document.getElementById('modal-close-register');
const registerEventTitle = document.getElementById('register-event-title');
const registerEventId = document.getElementById('register-event-id');
const registrationForm = document.getElementById('registration-form');

const registerFlowForm = document.getElementById('register-flow-form');
const registerFlowSuccess = document.getElementById('register-flow-success');

// Stripe Simulation Elements
const stripeCheckoutSection = document.getElementById('stripe-checkout-section');
const stripeCheckoutPrice = document.getElementById('stripe-checkout-price');
const cardNumberInput = document.getElementById('card-number');
const cardExpiryInput = document.getElementById('card-expiry');
const cardCvcInput = document.getElementById('card-cvc');

// Ticket Showcase Elements
const ticketEventName = document.getElementById('ticket-event-name');
const ticketUserName = document.getElementById('ticket-user-name');
const ticketEventDate = document.getElementById('ticket-event-date');
const ticketEventLoc = document.getElementById('ticket-event-loc');
const ticketTierBadge = document.getElementById('ticket-tier-badge');
const ticketSerialId = document.getElementById('ticket-serial-id');
const ticketQrCode = document.getElementById('ticket-qr-code');

// --- Helper Functions ---

// Check if a date string is in the past
const isPastDate = (dateStr) => {
  const eventDate = new Date(dateStr);
  const today = new Date("2026-06-23"); // Setting reference time to match system metadata (June 2026)
  return eventDate < today;
};

// Generate stylized custom SVG QR code matrix (simulated)
const generateDynamicQRCode = (data) => {
  let dots = "";
  const size = 80;
  const resolution = 12;
  const cellSize = size / resolution;
  
  let seed = 0;
  for (let i = 0; i < data.length; i++) {
    seed += data.charCodeAt(i);
  }
  
  const randomBit = (x, y) => {
    if (
      (x < 3 && y < 3) || 
      (x >= resolution - 3 && y < 3) || 
      (x < 3 && y >= resolution - 3) 
    ) {
      if ((x === 0 || x === 2 || y === 0 || y === 2) && x < 3 && y < 3) return true;
      if ((x === resolution - 1 || x === resolution - 3 || y === 0 || y === 2) && x >= resolution - 3 && y < 3) return true;
      if ((x === 0 || x === 2 || y === resolution - 1 || y === resolution - 3) && x < 3 && y >= resolution - 3) return true;
      
      if (x === 1 && y === 1) return true;
      if (x === resolution - 2 && y === 1) return true;
      if (x === 1 && y === resolution - 2) return true;
      
      return false;
    }
    
    const val = Math.sin(seed + x * 12.9898 + y * 78.233) * 43758.5453;
    return (val - Math.floor(val)) > 0.48;
  };

  for (let y = 0; y < resolution; y++) {
    for (let x = 0; x < resolution; x++) {
      if (randomBit(x, y)) {
        const cx = x * cellSize + cellSize / 2;
        const cy = y * cellSize + cellSize / 2;
        const r = cellSize / 2.5; 
        dots += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#000000" />`;
      }
    }
  }

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      ${dots}
    </svg>
  `;
};

// Calculate Stripe simulated price based on event
const updateCheckoutPrice = () => {
  if (!selectedEvent) return;
  stripeCheckoutPrice.textContent = `${selectedEvent.price} TL`;
};

// Auto formatting card inputs
if (cardNumberInput) {
  cardNumberInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    let formatted = val.match(/.{1,4}/g)?.join(' ') || '';
    e.target.value = formatted.substring(0, 19); 
  });
}

if (cardExpiryInput) {
  cardExpiryInput.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) {
      e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
    } else {
      e.target.value = val;
    }
  });
}

if (cardCvcInput) {
  cardCvcInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '').substring(0, 3);
  });
}

// --- Render Functions ---


window.moveCarousel = (id, direction) => {
  const container = document.getElementById('carousel-' + id);
  if (!container) return;
  const slides = container.querySelectorAll('.carousel-slide');
  let current = parseInt(container.getAttribute('data-current') || '0');
  slides[current].classList.remove('active');
  current = (current + direction + slides.length) % slides.length;
  slides[current].classList.add('active');
  container.setAttribute('data-current', current);
};

const renderEvents = () => {
  eventsGrid.innerHTML = '';
  
  // Sort events chronologically by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filtered = sortedEvents.filter(event => {
    const past = isPastDate(event.date);
    // If showPastEvents is true, we display all events. Otherwise, show only upcoming events.
    return showPastEvents ? true : !past;
  });

  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];

  if (filtered.length === 0) {
    eventsGrid.innerHTML = '';
    return;
  }

  filtered.forEach(event => {
    const isPast = isPastDate(event.date);
    const card = document.createElement('div');
    card.className = 'card event-card horizontal-card animated-border';

    const title = lang === 'en' ? (event.title_en || event.title) : event.title;
    const desc = lang === 'en' ? (event.desc_en || event.desc) : event.desc;
    const location = lang === 'en' ? (event.location_en || event.location) : event.location;
    const dateText = lang === 'en' ? (event.dateText_en || event.dateText) : event.dateText;
    
    const statusText = isPast ? trans["event-status-past"] : trans["event-status-upcoming"];
    let priceText = "";
    if (event.price === "multiple") {
      priceText = "Bilet Seçenekleri";
    } else if (event.price === 0) {
      priceText = trans["event-price-free"];
    } else {
      priceText = `${event.price} TL`;
    }
    
    card.innerHTML = `
      <div class="event-img-container">
        ${event.images && event.images.length > 0 ? `
          <div class="event-carousel" id="carousel-${event.id}" data-current="0">
            ${event.images.map((img, i) => `<div class="carousel-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>`).join('')}
            <button class="carousel-btn prev-btn" onclick="moveCarousel('${event.id}', -1)">❮</button>
            <button class="carousel-btn next-btn" onclick="moveCarousel('${event.id}', 1)">❯</button>
          </div>
        ` : `
          <div class="event-banner-art" style="background: ${event.banner || 'var(--bg-secondary)'};">
            <span class="event-banner-logo">${event.type || ''}</span>
          </div>
        `}
        <span class="event-status-badge ${isPast ? 'status-past' : 'status-upcoming'}">
          ${statusText}
        </span>
      </div>
      <div class="event-body">
        <div class="event-date"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${dateText}</div>
        <h3 class="event-title">${title}</h3>
        <p class="event-desc">${desc}</p>
        <div class="event-meta">
          <span><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${event.mapUrl ? `<a href="${event.mapUrl}" target="_blank" style="color: inherit; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">${location}</a>` : location}</span>
          
        </div>
        <div class="event-card-actions">
          <button class="btn btn-outline btn-sm view-details-btn" data-id="${event.id}">${trans["event-btn-details"]}</button>
          ${!isPast ? `<button class="btn btn-primary btn-sm register-btn" data-id="${event.id}" ${event.disableRegister ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>${trans["event-btn-register"]}</button>` : ''}
        </div>
      </div>
    `;
    eventsGrid.appendChild(card);
  });

  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => openDetailModal(btn.dataset.id));
  });

  document.querySelectorAll('.register-btn').forEach(btn => {
    btn.addEventListener('click', () => openRegisterModal(btn.dataset.id));
  });
};

// --- Modal Handlers ---

const openDetailModal = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  const isPast = isPastDate(event.date);
  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];
  
  const title = lang === 'en' ? (event.title_en || event.title) : event.title;
  const desc = lang === 'en' ? (event.desc_en || event.desc) : event.desc;
  const location = lang === 'en' ? (event.location_en || event.location) : event.location;
  const dateText = lang === 'en' ? (event.dateText_en || event.dateText) : event.dateText;
  const priceText = event.price === 0 ? trans["event-price-free-detail"] : `${event.price} TL`;

  let speakersHTML = "";
  if (event.speakers && event.speakers.length > 0) {
    speakersHTML = `
      <div class="agenda-title" style="margin-top: 32px;">${trans["modal-detail-speakers"]}</div>
      <div class="speakers-row mb-6">
        ${event.speakers.map(s => {
          const sRole = lang === 'en' ? (s.role_en || s.role) : s.role;
          return `
            <div class="speaker-card">
              <img src="${s.img}" alt="${s.name}" class="speaker-img" onerror="this.src='../assets/favicon.webp'">
              <div class="speaker-info">
                <h5>${s.name}</h5>
                <span>${sRole}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  let agendaHTML = "";
  if (event.agenda && event.agenda.length > 0) {
    agendaHTML = `
      <div class="modal-detail-agenda">
        <div class="agenda-title">${trans["modal-detail-agenda"]}</div>
        ${event.agenda.map(a => {
          const aTime = lang === 'en' ? (a.time_en || a.time) : a.time;
          const aDesc = lang === 'en' ? (a.desc_en || a.desc) : a.desc;
          return `
            <div class="agenda-item">
              <span class="agenda-time">${aTime}</span>
              <span class="agenda-desc">${aDesc}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  modalDetailBody.innerHTML = `
    ${event.images && event.images.length > 0 ? `
      <div style="position: relative; height: 180px; margin-bottom: 24px; border-radius: 12px; overflow: hidden; width: 100%;">
        <div class="event-carousel" id="carousel-modal-${event.id}" data-current="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
          ${event.images.map((img, i) => `<div class="carousel-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>`).join('')}
          <button class="carousel-btn prev-btn" onclick="moveCarousel('modal-${event.id}', -1)">❮</button>
          <button class="carousel-btn next-btn" onclick="moveCarousel('modal-${event.id}', 1)">❯</button>
        </div>
      </div>
    ` : `
      <div class="modal-detail-banner" style="background: ${event.banner || 'var(--bg-secondary)'};">
        <span class="event-banner-logo" style="font-size: 32px; color: rgba(255,255,255,0.3);">${event.type || ''}</span>
      </div>
    `}
    <h3 class="modal-detail-title gradient-text">${title}</h3>
    <div class="modal-detail-meta-row">
      <div class="modal-detail-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${dateText}</div>
      <div class="modal-detail-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${event.mapUrl ? `<a href="${event.mapUrl}" target="_blank" style="color: inherit; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">${location}</a>` : location}</div>
      
    </div>
    <div class="modal-detail-content">
      <p>${event.detailDesc ? event.detailDesc : desc}</p>
    </div>
    
    ${agendaHTML}
    ${speakersHTML}

    <div style="margin-top: 32px; display: flex; gap: 12px;">
      ${!isPast ? `<button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('event-detail-modal').classList.remove('active'); document.querySelector('.register-btn[data-id=\\'${event.id}\\']').click();">${trans["modal-detail-btn-register"]}</button>` : ''}
      <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('event-detail-modal').classList.remove('active');">${trans["modal-detail-btn-back"]}</button>
    </div>
  `;

  detailModal.classList.add('active');
};

const openRegisterModal = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];
  const title = lang === 'en' ? (event.title_en || event.title) : event.title;

  // Özel bilet seçim paneli: Vertex Teknoloji Zirvesi '26 için
  if (event.id === "evt_tech_summit") {
    registerEventTitle.textContent = lang === 'en' ? `${title} - Ticket Selection` : `${title} - Bilet Seçimi`;
    registerEventTitle.style.textAlign = 'center';
    const subTitle = document.querySelector('#register-flow-form p');
    if (subTitle) subTitle.style.textAlign = 'center';
    
    // Normal formu gizle
    registrationForm.style.display = 'none';
    registerFlowForm.style.display = 'block';
    registerFlowSuccess.style.display = 'none';
    
    // Butonları enjekte edeceğimiz div
    let ticketSelectionDiv = document.getElementById('ticket-selection-div');
    if (!ticketSelectionDiv) {
      ticketSelectionDiv = document.createElement('div');
      ticketSelectionDiv.id = 'ticket-selection-div';
      ticketSelectionDiv.style.display = 'flex';
      ticketSelectionDiv.style.flexDirection = 'column';
      ticketSelectionDiv.style.gap = '15px';
      ticketSelectionDiv.style.marginTop = '20px';
      registerFlowForm.appendChild(ticketSelectionDiv);
    }
    
    const ticketSelectText = lang === 'en' ? 'Please select the ticket type you want to buy:' : 'Lütfen satın almak istediğiniz bilet türünü seçin:';
    
    const standartDisabled = event.standartSoldOut ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const standartText = event.standartSoldOut 
      ? (lang === 'en' ? 'Standard Ticket Sold Out' : 'Standart Bilet Tükendi') 
      : (lang === 'en' ? 'Buy Standard Ticket (500 TL)' : 'Standart Bilet Satın Al (500 TL)');
    
    const spesiyalDisabled = event.spesiyalSoldOut ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const spesiyalText = event.spesiyalSoldOut 
      ? (lang === 'en' ? 'Special Ticket Sold Out' : 'Spesiyal Bilet Tükendi') 
      : (lang === 'en' ? 'Buy Special Ticket (1000 TL)' : 'Spesiyal Bilet Satın Al (1000 TL)');
    
    ticketSelectionDiv.innerHTML = `
      <p style="color: var(--text-muted); font-size: 14px; text-align: center; margin-bottom: 10px;">${ticketSelectText}</p>
      <button class="btn btn-outline" ${spesiyalDisabled ? '' : `onclick="window.open('${event.stripeLinkSpesiyal}', '_blank')"`} ${spesiyalDisabled} style="padding: 15px; font-size: 16px; border-color: var(--primary); color: var(--text);">${spesiyalText}</button>
      <button class="btn btn-primary" ${standartDisabled ? '' : `onclick="window.open('${event.stripeLinkStandart}', '_blank')"`} ${standartDisabled} style="padding: 15px; font-size: 16px;">${standartText}</button>
    `;
    ticketSelectionDiv.style.display = 'flex';
    
    registerModal.classList.add('active');
    return;
  }

  // Stripe Payment Links Integration for normal paid events
  if (event.price > 0 && event.price !== "multiple") {
    const link = event.stripeLink || "https://buy.stripe.com/test_placeholder";
    window.open(link, '_blank');
    return;
  }

  // Default flow for free events
  const ticketSelectionDivLocal = document.getElementById('ticket-selection-div');
  if (ticketSelectionDivLocal) ticketSelectionDivLocal.style.display = 'none';
  registrationForm.style.display = 'block';

  selectedEvent = event;

  registerEventTitle.textContent = `${title} - ${trans["register-flow-title"]}`;
  registerEventTitle.style.textAlign = 'left';
  const subTitleLocal = document.querySelector('#register-flow-form p');
  if (subTitleLocal) subTitleLocal.style.textAlign = 'left';
  registerEventId.value = event.id;

  registerFlowForm.style.display = 'block';
  registerFlowSuccess.style.display = 'none';
  registrationForm.reset();

  updateStripeVisibility();
  
  registerModal.classList.add('active');
};

const updateStripeVisibility = () => {
  isStripeMode = selectedEvent && selectedEvent.price > 0;
  const submitBtn = document.getElementById('submit-reg-btn');
  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];

  if (isStripeMode) {
    stripeCheckoutSection.style.display = 'block';
    
    cardNumberInput.setAttribute('required', 'true');
    cardExpiryInput.setAttribute('required', 'true');
    cardCvcInput.setAttribute('required', 'true');
    
    if (submitBtn) submitBtn.textContent = trans["form-btn-submit-paid"];
    updateCheckoutPrice();
  } else {
    stripeCheckoutSection.style.display = 'none';
    
    cardNumberInput.removeAttribute('required');
    cardExpiryInput.removeAttribute('required');
    cardCvcInput.removeAttribute('required');
    
    if (submitBtn) submitBtn.textContent = trans["form-btn-submit-free"];
  }
};

// Form Submit Handler (Ticket Registration)
registrationForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const submitBtn = document.getElementById('submit-reg-btn');
  const originalText = submitBtn.textContent;
  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];
  
  submitBtn.disabled = true;
  if (isStripeMode) {
    submitBtn.innerHTML = `<span style="display:inline-block; animation: rotate-art 1s linear infinite; margin-right: 8px;">⏳</span> ${trans["form-submitting-paid"]}`;
  } else {
    submitBtn.innerHTML = trans["form-submitting-free"];
  }

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
    
    const name = document.getElementById('reg-name').value;

    const title = lang === 'en' ? (selectedEvent.title_en || selectedEvent.title) : selectedEvent.title;
    const dateText = lang === 'en' ? (selectedEvent.dateText_en || selectedEvent.dateText) : selectedEvent.dateText;
    const location = lang === 'en' ? (selectedEvent.location_en || selectedEvent.location) : selectedEvent.location;
    
    ticketEventName.textContent = title.toUpperCase();
    ticketUserName.textContent = name;
    ticketEventDate.textContent = dateText;
    ticketEventLoc.textContent = location;
    
    if (selectedEvent.price > 0) {
      ticketTierBadge.textContent = trans["ticket-pass-paid"];
      ticketTierBadge.style.background = 'var(--gradient-accent)';
      ticketTierBadge.style.color = '#ffffff';
    } else {
      ticketTierBadge.textContent = trans["ticket-pass-free"];
      ticketTierBadge.style.background = 'var(--primary)';
      ticketTierBadge.style.color = 'var(--btn-text-color)';
    }
    
    const serial = `VTX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    ticketSerialId.textContent = serial;
    
    const qrData = `https://events.vertexishere.com/validate?id=${serial}&name=${encodeURIComponent(name)}&event=${encodeURIComponent(selectedEvent.title)}`;
    ticketQrCode.innerHTML = generateDynamicQRCode(qrData);

    registerFlowForm.style.display = 'none';
    registerFlowSuccess.style.display = 'block';
  }, 1500);
});

// Close Modals
if (modalCloseDetails) modalCloseDetails.addEventListener('click', () => detailModal.classList.remove('active'));
modalCloseRegister.addEventListener('click', () => registerModal.classList.remove('active'));
document.getElementById('close-success-btn').addEventListener('click', () => registerModal.classList.remove('active'));

window.addEventListener('click', (e) => {
  if (e.target === detailModal) detailModal.classList.remove('active');
  if (e.target === registerModal) registerModal.classList.remove('active');
});

// Download ticket simulation
document.getElementById('download-ticket-btn').addEventListener('click', () => {
  const btn = document.getElementById('download-ticket-btn');
  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];

  btn.textContent = trans["ticket-action-download-success"];
  btn.style.background = "#00c864";
  btn.style.borderColor = "#00c864";
  
  setTimeout(() => {
    alert(trans["ticket-download-alert"] + ticketSerialId.textContent);
    btn.textContent = trans["ticket-action-download"];
    btn.style.background = "";
    btn.style.borderColor = "";
  }, 500);
});

// Load Custom Events from LocalStorage
const loadEvents = () => {
  // Clear any existing custom events from localStorage to keep the agenda completely empty
  localStorage.removeItem('vtx_custom_events');
  events = [...DEFAULT_EVENTS];
};

// --- Filter Interactions ---

if (showPastEventsCheckbox) {
  showPastEventsCheckbox.addEventListener('change', (e) => {
    showPastEvents = e.target.checked;
    renderEvents();
  });
}

if (showPastLabel && showPastEventsCheckbox) {
  showPastLabel.addEventListener('click', () => {
    showPastEventsCheckbox.checked = !showPastEventsCheckbox.checked;
    showPastEvents = showPastEventsCheckbox.checked;
    renderEvents();
  });
}

// --- Initialize ---
const init = () => {
  loadEvents();
  renderEvents();
};

init();
