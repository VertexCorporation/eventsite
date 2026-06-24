/* =========================================
   VERTEX EVENTS - DATA & INTERACTIVE LOGIC
   ========================================= */

// --- Default Event Data ---
const DEFAULT_EVENTS = [];

// --- Application State ---
let events = [...DEFAULT_EVENTS];
let showPastEvents = false;
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
    card.className = 'card event-card animated-border';

    const title = lang === 'en' ? (event.title_en || event.title) : event.title;
    const desc = lang === 'en' ? (event.desc_en || event.desc) : event.desc;
    const location = lang === 'en' ? (event.location_en || event.location) : event.location;
    const dateText = lang === 'en' ? (event.dateText_en || event.dateText) : event.dateText;
    
    const statusText = isPast ? trans["event-status-past"] : trans["event-status-upcoming"];
    const priceText = event.price === 0 ? trans["event-price-free"] : `${event.price} TL`;
    
    card.innerHTML = `
      <div class="event-img-container">
        <div class="event-banner-art" style="background: ${event.banner};">
          <span class="event-banner-logo">${event.type}</span>
        </div>
        <span class="event-status-badge ${isPast ? 'status-past' : 'status-upcoming'}">
          ${statusText}
        </span>
      </div>
      <div class="event-body">
        <div class="event-date">📅 ${dateText}</div>
        <h3 class="event-title">${title}</h3>
        <p class="event-desc">${desc}</p>
        <div class="event-meta">
          <span>📍 ${location}</span>
          <span class="event-price">${priceText}</span>
        </div>
        <div class="event-card-actions">
          <button class="btn btn-outline btn-sm view-details-btn" data-id="${event.id}">${trans["event-btn-details"]}</button>
          ${!isPast ? `<button class="btn btn-primary btn-sm register-btn" data-id="${event.id}">${trans["event-btn-register"]}</button>` : ''}
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
    <div class="modal-detail-banner" style="background: ${event.banner};">
      <span class="event-banner-logo" style="font-size: 32px; color: rgba(255,255,255,0.3);">${event.type}</span>
    </div>
    <h3 class="modal-detail-title gradient-text">${title}</h3>
    <div class="modal-detail-meta-row">
      <div class="modal-detail-meta-item">📅 ${dateText}</div>
      <div class="modal-detail-meta-item">📍 ${location}</div>
      <div class="modal-detail-meta-item">💳 ${priceText}</div>
    </div>
    <div class="modal-detail-content">
      <p>${desc}</p>
    </div>
    
    ${agendaHTML}
    ${speakersHTML}

    <div style="margin-top: 32px; display: flex; gap: 12px;">
      ${!isPast ? `<button class="btn btn-primary" style="flex: 1;" onclick="document.getElementById('modal-close-details').click(); document.querySelector('.register-btn[data-id=\\'${event.id}\\']').click();">${trans["modal-detail-btn-register"]}</button>` : ''}
      <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('modal-close-details').click();">${trans["modal-detail-btn-back"]}</button>
    </div>
  `;

  detailModal.classList.add('active');
};

const openRegisterModal = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  selectedEvent = event;
  const lang = window.currentLanguage || 'tr';
  const trans = window.TRANSLATIONS[lang];
  const title = lang === 'en' ? (event.title_en || event.title) : event.title;

  registerEventTitle.textContent = `${title} - ${trans["register-flow-title"]}`;
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
modalCloseDetails.addEventListener('click', () => detailModal.classList.remove('active'));
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
