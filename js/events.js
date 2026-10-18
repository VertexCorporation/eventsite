import QRCode from 'qrcode';
/* =========================================
   VERTEX EVENTS - DATA & INTERACTIVE LOGIC
   ========================================= */

// --- Default Event Data ---


// --- Application State ---
let events = [];
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
const escapeText = value => String(value ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#39;');
const displayText = value => { const decoder=document.createElement('textarea'); decoder.innerHTML=value; return decoder.value; };
const safePublicUrl = value => {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, document.baseURI);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    return url.href.replace(/['"()\\<>]/g, char => encodeURIComponent(char));
  } catch { return ''; }
};
const safeRichText = value => escapeText(value)
  .replace(/&lt;br\s*\/?&gt;/gi, '<br>')
  .replace(/&lt;b&gt;/gi, '<b>')
  .replace(/&lt;\/b&gt;/gi, '</b>');
const safeEventBanner = value => {
  if (typeof value !== 'string') return '';
  if (/^#[a-f0-9]{3,8}$/i.test(value)) return value;
  const image = /^url\(['"]?([^'"]+)['"]?\)\s+center\/cover$/i.exec(value);
  return image && safePublicUrl(image[1]) ? `url("${safePublicUrl(image[1])}") center/cover` : '';
};
const preparePublicEvent = event => {
  const copy = {...event};
  for (const key of ['title','title_en','desc','desc_en','location','location_en','type','type_en','price_en']) if(copy[key]) copy[key] = escapeText(copy[key]);
  if (typeof copy.price === 'string') copy.price = escapeText(copy.price);
  copy.detailDesc = safeRichText(copy.detailDesc || '');
  copy.detailDesc_en = safeRichText(copy.detailDesc_en || '');
  copy.cover = safePublicUrl(copy.cover);
  copy.images = (Array.isArray(copy.images) ? copy.images : []).map(safePublicUrl).filter(Boolean);
  copy.mapUrl = safePublicUrl(copy.mapUrl);
  for (const key of ['stripeLink','stripeLinkStandart','stripeLinkSpesiyal']) copy[key] = safePublicUrl(copy[key]);
  copy.banner = safeEventBanner(copy.banner) || 'var(--bg-secondary)';
  copy.ticketCategories = (Array.isArray(copy.ticketCategories) ? copy.ticketCategories : []).map(t=>({...t,stripeLink:safePublicUrl(t.stripeLink)}));
  copy.speakers = (Array.isArray(copy.speakers) ? copy.speakers : []).map(s=>({...s,img:safePublicUrl(s.img),name:escapeText(s.name),role:escapeText(s.role),role_en:escapeText(s.role_en)}));
  copy.agenda = (Array.isArray(copy.agenda) ? copy.agenda : []).map(a=>Object.fromEntries(Object.entries(a).map(([k,v])=>[k,escapeText(v)])));
  copy.translations = Object.fromEntries(Object.entries(copy.translations || {}).map(([lang,t])=>[lang,Object.fromEntries(Object.entries(t).map(([k,v])=>[k,k==='detailDesc'?safeRichText(v):escapeText(v)]))]));
  return copy;
};
const api = async (name, data = {}) => {
  const response = await fetch(`https://europe-west1-vertex-ai-1618.cloudfunctions.net/${name}`, {
    method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({data})
  });
  const body = await response.json();
  if (!response.ok || body.error) throw new Error(body.error?.message || 'Service unavailable');
  return body.result;
};
const formatEventDate = (event, lang) => event.startsAt
  ? new Intl.DateTimeFormat(lang,{dateStyle:'long',timeStyle:'short',timeZone:event.timeZone}).format(new Date(event.startsAt)) + ` (${event.timeZone})`
  : new Intl.DateTimeFormat(lang,{dateStyle:'long',timeZone:'UTC'}).format(new Date(event.date+'T00:00:00Z'));
const isPastDate = (dateStr, event = {}) => {
  if (event.endsAt) return Date.parse(event.endsAt) < Date.now();
  const today = new Intl.DateTimeFormat('en-CA', {timeZone:event.timeZone || 'Europe/Istanbul', year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
  return dateStr < today;
};
const unavailable = event => event.status === 'cancelled' || event.salesStatus !== 'open' || event.disableRegister || (event.capacity !== null && event.capacity !== undefined && event.registeredCount >= event.capacity);
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

const revealLoadedEvents = skeleton => {
  if (!skeleton) {
    // A successful retry after an error should still enter gently.
    eventsGrid.classList.add('events-direct-reveal');
    window.setTimeout(() => eventsGrid.classList.remove('events-direct-reveal'), 600);
    return;
  }
  eventsGrid.classList.add('events-transitioning');
  // Establish the starting opacity before the next frame, even on fast APIs.
  void eventsGrid.offsetWidth;
  window.requestAnimationFrame(() => {
    eventsGrid.classList.add('events-visible');
    window.setTimeout(() => {
      skeleton.remove();
      eventsGrid.classList.remove('events-transitioning', 'events-visible');
    }, 560);
  });
};

const renderEvents = (reveal = false) => {
  const skeleton = reveal ? eventsGrid.querySelector('.events-loading-skeleton') : null;
  if (!skeleton) {
    eventsGrid.replaceChildren();
    eventsGrid.classList.remove('events-transitioning', 'events-visible');
  }
  
  // Sort events chronologically by date
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  const filtered = sortedEvents.filter(event => {
    const past = isPastDate(event.date, event);
    // If showPastEvents is true, we display all events. Otherwise, show only upcoming events.
    return showPastEvents ? true : !past;
  });

  const lang = document.documentElement.lang || 'tr';
  const trans = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;

  if (filtered.length === 0) {
    const notice = document.createElement('p');
    notice.className = 'events-empty';
    notice.setAttribute('role', 'status');
    notice.textContent = lang === 'tr' ? 'Henüz yayımlanmış etkinlik bulunmuyor.' : 'No events have been published yet.';
    if(skeleton) eventsGrid.appendChild(notice);
    else eventsGrid.replaceChildren(notice);
    if(reveal) revealLoadedEvents(skeleton);
    return;
  }

  filtered.forEach(event => {
    const isPast = isPastDate(event.date, event);
    const card = document.createElement('div');
    card.className = 'card event-card horizontal-card';

    const title = event.translations?.[lang]?.title || (lang !== 'tr' ? (event.title_en || event.title) : event.title);
    const desc = event.translations?.[lang]?.desc || (lang !== 'tr' ? (event.desc_en || event.desc) : event.desc);
    const location = event.translations?.[lang]?.location || (lang !== 'tr' ? (event.location_en || event.location) : event.location);
    const dateText = formatEventDate(event,lang);
    
    const statusText = event.status === 'cancelled' ? trans['event-status-cancelled'] : event.salesStatus === 'sold_out' || event.capacity != null && event.registeredCount >= event.capacity ? trans['event-status-sold-out'] : isPast ? trans["event-status-past"] : trans["event-status-upcoming"];
    let priceText = "";
    if (event.price === "multiple") {
      priceText = lang !== 'tr' ? 'Ticket Options' : 'Bilet Seçenekleri';
    } else if (event.price === 0) {
      priceText = trans["event-price-free"];
    } else if (typeof event.price === 'string') {
      priceText = lang !== 'tr' && event.price_en ? event.price_en : event.price;
    } else {
      priceText = `${event.price} TL`;
    }
    
    card.innerHTML = `
      <div class="event-img-container">
        ${(event.cover || event.images?.length) ? `
          <div class="event-carousel" id="carousel-${event.id}" data-current="0">
            ${(event.cover ? [event.cover, ...(event.images || [])] : event.images).map((img, i) => `<div class="carousel-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>`).join('')}
            <button class="carousel-btn prev-btn" onclick="moveCarousel('${event.id}', -1)">❮</button>
            <button class="carousel-btn next-btn" onclick="moveCarousel('${event.id}', 1)">❯</button>
          </div>
        ` : `
          <div class="event-banner-art" style="background: ${event.banner || 'var(--bg-secondary)'};">
            <span class="event-banner-logo">${lang !== 'tr' ? (event.type_en || event.type || '') : (event.type || '')}</span>
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
          ${!isPast && !unavailable(event) ? `<button class="btn btn-primary btn-sm register-btn" data-id="${event.id}" ${unavailable(event) ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>${trans["event-btn-register"]}</button>` : ''}
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
  if(reveal) revealLoadedEvents(skeleton);
};

// --- Modal Handlers ---

const openDetailModal = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event) return;

  const isPast = isPastDate(event.date, event);
  const lang = document.documentElement.lang || 'tr';
  const trans = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;
  
  const title = event.translations?.[lang]?.title || (lang !== 'tr' ? (event.title_en || event.title) : event.title);
  const desc = event.translations?.[lang]?.desc || (lang !== 'tr' ? (event.desc_en || event.desc) : event.desc);
  const location = event.translations?.[lang]?.location || (lang !== 'tr' ? (event.location_en || event.location) : event.location);
  const dateText = formatEventDate(event,lang);
  const priceText = event.price === 0 ? trans["event-price-free-detail"] : `${event.price} TL`;

  let speakersHTML = "";
  if (event.speakers && event.speakers.length > 0) {
    speakersHTML = `
      <div class="agenda-title" style="margin-top: 32px;">${trans["modal-detail-speakers"]}</div>
      <div class="speakers-row mb-6">
        ${event.speakers.map(s => {
          const sRole = lang !== 'tr' ? (s.role_en || s.role) : s.role;
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
          const aTime = lang !== 'tr' ? (a.time_en || a.time) : a.time;
          const aDesc = lang !== 'tr' ? (a.desc_en || a.desc) : a.desc;
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
    ${(event.cover || event.images?.length) ? `
      <div style="position: relative; height: 180px; margin-bottom: 24px; border-radius: 12px; overflow: hidden; width: 100%;">
        <div class="event-carousel" id="carousel-modal-${event.id}" data-current="0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
          ${(event.cover ? [event.cover, ...(event.images || [])] : event.images).map((img, i) => `<div class="carousel-slide ${i === 0 ? 'active' : ''}" style="background-image: url('${img}')"></div>`).join('')}
          <button class="carousel-btn prev-btn" onclick="moveCarousel('modal-${event.id}', -1)">❮</button>
          <button class="carousel-btn next-btn" onclick="moveCarousel('modal-${event.id}', 1)">❯</button>
        </div>
      </div>
    ` : `
      <div class="modal-detail-banner" style="background: ${event.banner || 'var(--bg-secondary)'};">
        <span class="event-banner-logo" style="font-size: 32px; color: rgba(255,255,255,0.3);">${lang !== 'tr' ? (event.type_en || event.type || '') : (event.type || '')}</span>
      </div>
    `}
    <h3 id="modal-detail-heading" class="modal-detail-title">${title}</h3>
    <div class="modal-detail-meta-row">
      <div class="modal-detail-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>${dateText}</div>
      <div class="modal-detail-meta-item"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px; transform: translateY(2px);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>${event.mapUrl ? `<a href="${event.mapUrl}" target="_blank" style="color: inherit; text-decoration: underline; text-decoration-style: dotted; text-underline-offset: 4px; transition: opacity 0.2s;" onmouseover="this.style.opacity=0.7" onmouseout="this.style.opacity=1">${location}</a>` : location}</div>
      
    </div>
    <div class="modal-detail-content">
      <p>${event.detailDesc ? (event.translations?.[lang]?.detailDesc || (lang !== 'tr' ? (event.detailDesc_en || event.detailDesc) : event.detailDesc)) : desc}</p>
    </div>
    
    ${agendaHTML}
    ${speakersHTML}

    <div style="margin-top: 32px; display: flex; gap: 12px;">
      ${!isPast && !unavailable(event) ? `<button class="btn btn-primary" style="flex: 1;" id="modal-register-btn">${trans["modal-detail-btn-register"]}</button>` : ''}
      <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('event-detail-modal').classList.remove('active');">${trans["modal-detail-btn-back"]}</button>
    </div>
  `;

  document.getElementById('modal-register-btn')?.addEventListener('click',()=>{detailModal.classList.remove('active');openRegisterModal(event.id);});
  detailModal.classList.add('active');
};

const openRegisterModal = (eventId) => {
  const event = events.find(e => e.id === eventId);
  if (!event || draftPreview || isPastDate(event.date, event) || unavailable(event)) return;

  const lang = document.documentElement.lang || 'tr';
  const trans = window.TRANSLATIONS[lang] || window.TRANSLATIONS.en;
  const title = event.translations?.[lang]?.title || (lang !== 'tr' ? (event.title_en || event.title) : event.title);

  if (event.ticketCategories?.length) {
    registerEventTitle.textContent = displayText(title);
    registrationForm.style.display = 'none';
    registerFlowForm.style.display = 'block';
    registerFlowSuccess.style.display = 'none';
    let tiers = document.getElementById('ticket-selection-div');
    if (!tiers) { tiers = document.createElement('div'); tiers.id = 'ticket-selection-div'; registerFlowForm.append(tiers); }
    tiers.replaceChildren(); tiers.style.display = 'grid'; tiers.style.gap = '12px';
    for (const tier of event.ticketCategories) {
      const link = document.createElement('a'); link.className = 'btn btn-primary';
      link.textContent = `${tier.name} · ${tier.price} ${tier.currency || 'TRY'}`;
      if (tier.stripeLink && tier.salesStatus !== 'closed' && tier.salesStatus !== 'sold_out') { link.href = tier.stripeLink; link.target = '_blank'; link.rel = 'noopener noreferrer'; }
      else { link.setAttribute('aria-disabled','true'); }
      tiers.append(link);
      if(tier.description){const description=document.createElement('p');description.textContent=tier.description;tiers.append(description);}
    }
    registerModal.classList.add('active'); return;
  }
  // Özel bilet seçim paneli: Vertex Teknoloji Zirvesi '26 için
  if (event.id === "evt_tech_summit") {
    registerEventTitle.textContent = lang !== 'tr' ? `${displayText(title)} - Ticket Selection` : `${displayText(title)} - Bilet Seçimi`;
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
    
    const ticketSelectText = lang !== 'tr' ? 'Please select the ticket type you want to buy:' : 'Lütfen satın almak istediğiniz bilet türünü seçin:';
    
    const standartDisabled = event.standartSoldOut || !event.stripeLinkStandart ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const standartText = event.standartSoldOut 
      ? (lang !== 'tr' ? 'Standard Ticket Sold Out' : 'Standart Bilet Tükendi') 
      : (lang !== 'tr' ? 'Buy Standard Ticket (500 TL)' : 'Standart Bilet Satın Al (500 TL)');
    
    const spesiyalDisabled = event.spesiyalSoldOut || !event.stripeLinkSpesiyal ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
    const spesiyalText = event.spesiyalSoldOut 
      ? (lang !== 'tr' ? 'Special Ticket Sold Out' : 'Spesiyal Bilet Tükendi') 
      : (lang !== 'tr' ? 'Buy Special Ticket (1000 TL)' : 'Spesiyal Bilet Satın Al (1000 TL)');
    
    const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: text-bottom; margin-right: 6px;"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
    const benefitsTr = `<b>${checkIcon}Spesiyal Bilet Avantajları (+500 TL):</b> Daha zengin yiyecek/içecek menüsü, spesiyal açılış ve kapanış konuşmalarında yer alma, sana özel basılı bilet ve yaka kartı, spesiyal alana ve özel gruba erişim, ön sıra garantisi ve sıra beklemeden hızlı geçiş hakkı!`;
    const benefitsEn = `<b>${checkIcon}Special Ticket Benefits (+500 TL):</b> Richer food/beverage menu, take part in special opening and closing speeches, custom printed ticket and badge, access to special area and group, front row guarantee and fast-track entry without waiting in line!`;
    
    ticketSelectionDiv.innerHTML = `
      <p style="color: var(--text-muted); font-size: 14px; text-align: center; margin-bottom: 10px;">${ticketSelectText}</p>
      
      <div style="background: var(--bg-secondary); border: 1px solid var(--primary); border-radius: 8px; padding: 12px; margin-bottom: 15px; text-align: left; font-size: 13px; line-height: 1.5; color: var(--text);">
        ${lang !== 'tr' ? benefitsEn : benefitsTr}
      </div>

      <button class="btn btn-outline" ${spesiyalDisabled ? '' : `onclick="window.open('${event.stripeLinkSpesiyal}', '_blank', 'noopener,noreferrer')"`} ${spesiyalDisabled} style="padding: 15px; font-size: 16px; border-color: var(--primary); color: var(--text);">${spesiyalText}</button>
      <button class="btn btn-primary" ${standartDisabled ? '' : `onclick="window.open('${event.stripeLinkStandart}', '_blank', 'noopener,noreferrer')"`} ${standartDisabled} style="padding: 15px; font-size: 16px;">${standartText}</button>
    `;
    ticketSelectionDiv.style.display = 'flex';
    
    registerModal.classList.add('active');
    return;
  }

  // Stripe Payment Links Integration for normal paid events
  if (event.stripeLink && event.price !== "multiple") {
    const link = event.stripeLink;
    window.open(link, '_blank');
    return;
  }

  if (event.price !== 0) { alert(trans['event-payment-unavailable']); return; }

  // Default flow for free events
  const ticketSelectionDivLocal = document.getElementById('ticket-selection-div');
  if (ticketSelectionDivLocal) ticketSelectionDivLocal.style.display = 'none';
  registrationForm.style.display = 'block';

  selectedEvent = event;

  registerEventTitle.textContent = `${displayText(title)} - ${trans["register-flow-title"]}`;
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
  stripeCheckoutSection.hidden = true;
  const lang = document.documentElement.lang || 'tr';
  document.getElementById('submit-reg-btn').textContent = window.TRANSLATIONS[lang]['form-btn-submit-free'];
};

// Form Submit Handler (Ticket Registration)
registrationForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const button = document.getElementById('submit-reg-btn');
  if (button.disabled) return;
  button.disabled = true;
  try {
    if (selectedEvent.price !== 0) throw new Error('Please use the Stripe payment link.');
    const result = await api('registerForEvent', {eventId:selectedEvent.id, name:document.getElementById('reg-name').value, email:document.getElementById('reg-email').value});
    ticketEventName.textContent = displayText(selectedEvent.title);
    ticketUserName.textContent = document.getElementById('reg-name').value;
    const ticketLang = document.documentElement.lang || 'tr';
    ticketEventDate.textContent = (ticketLang !== 'tr' ? selectedEvent.dateText_en : selectedEvent.dateText) || formatEventDate(selectedEvent, ticketLang);
    ticketEventLoc.textContent = displayText(selectedEvent.location);
    ticketSerialId.textContent = result.registrationId;
    ticketQrCode.replaceChildren();
    const link = document.createElement('a');
    link.href = `/validate.html?id=${encodeURIComponent(result.registrationId)}`;
    link.textContent = result.registrationId;
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, link.href, {width:160,margin:2});
    ticketQrCode.append(canvas, link);
    registerFlowForm.style.display = 'none';
    registerFlowSuccess.style.display = 'block';
  } catch(error) { alert(window.TRANSLATIONS[document.documentElement.lang || 'tr']['event-registration-error']); }
  finally { button.disabled = false; }
});

// Close Modals
if (modalCloseDetails) modalCloseDetails.addEventListener('click', () => detailModal.classList.remove('active'));
modalCloseRegister.addEventListener('click', () => registerModal.classList.remove('active'));
document.getElementById('close-success-btn').addEventListener('click', () => registerModal.classList.remove('active'));

window.addEventListener('click', (e) => {
  if (e.target === detailModal) detailModal.classList.remove('active');
  if (e.target === registerModal) registerModal.classList.remove('active');
});

document.getElementById('download-ticket-btn').addEventListener('click', () => window.print());
// A draft preview runs this SAME public renderer in a sandboxed Eventsite iframe.
// It never fetches, publishes or submits a registration.
const draftPreview = new URLSearchParams(location.search).get('vertexPreview') === '1'
  && window.parent !== window;
const previewReferrer = (() => {
  try { return new URL(document.referrer).origin; } catch { return ''; }
})();
const previewParentAllowed = /^https:\/\/admin\.vertexishere\.com$/.test(previewReferrer)
  || /^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?$/.test(previewReferrer);
if (draftPreview) {
  document.documentElement.classList.add('event-draft-preview');
  const indicator = document.createElement('div');
  indicator.className = 'event-preview-watermark';
  indicator.setAttribute('role','status');
  indicator.textContent = (document.documentElement.lang === 'tr' ? 'TASLAK ÖNİZLEME · KAYIT KAPALI' : 'DRAFT PREVIEW · REGISTRATION DISABLED');
  document.body.append(indicator);
  document.addEventListener('click', event => {
    if(event.target.closest('.register-btn,#modal-register-btn,#register-modal,.btn[href*="stripe.com"]')){
      event.preventDefault();event.stopImmediatePropagation();
    }
  }, true);
  if (previewParentAllowed) {
    window.addEventListener('message', message => {
      if(message.source !== window.parent || message.origin !== previewReferrer)return;
      if(message.data?.type !== 'vertex:event-preview:render' || message.data.version !== 1)return;
      const draft=message.data.event;
      if(!draft || typeof draft !== 'object' || Array.isArray(draft) ||
        typeof draft.id !== 'string' || !/^[A-Za-z0-9_-]{1,100}$/.test(draft.id) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(draft.date) ||
        JSON.stringify(draft).length > 64000)return;
      try {
        const safe=preparePublicEvent({...draft,status:'published',salesStatus:'closed',disableRegister:true});
        events=[safe];
        showPastEvents=true;
        if(showPastEventsCheckbox)showPastEventsCheckbox.checked=true;
        eventsGrid.dataset.state='ready';
        renderEvents(false);
        if(detailModal)openDetailModal(safe.id);
        window.parent.postMessage({type:'vertex:event-preview:rendered',version:1,id:safe.id},previewReferrer);
      } catch (error) {
        console.error('[EVENT PREVIEW] Failed to render draft',error.message);
      }
    });
    window.parent.postMessage({type:'vertex:event-preview:ready',version:1},previewReferrer);
  }
}
let loadingEvents = false;
eventsGrid.setAttribute('aria-live', 'polite');
const loadEvents = async () => {
  if (loadingEvents) return;
  loadingEvents = true;
  try {
    const result = await api('getPublishedEvents');
    if (!Array.isArray(result?.events)) throw new Error('getPublishedEvents returned an invalid payload');
    events = result.events
      .filter(event => event && typeof event === 'object' && /^[A-Za-z0-9_-]{1,100}$/.test(event.id) && /^\d{4}-\d{2}-\d{2}$/.test(event.date))
      .map(preparePublicEvent);
    const firstReveal = eventsGrid.dataset.state !== 'ready';
    eventsGrid.dataset.state = 'ready';
    renderEvents(firstReveal);
  } catch (error) {
    console.error('[VERTEX EVENTS] Public events could not be loaded:', error);
    if (!events.length) {
      const notice = document.createElement('p');
      notice.className = 'events-empty events-error';
      notice.setAttribute('role', 'alert');
      const lang = document.documentElement.lang || 'tr';
      notice.textContent = (window.TRANSLATIONS[lang] || window.TRANSLATIONS.en)['event-service-unavailable'];
      const skeleton = eventsGrid.querySelector('.events-loading-skeleton');
      if(skeleton) {
        eventsGrid.appendChild(notice);
        revealLoadedEvents(skeleton);
      } else {
        eventsGrid.replaceChildren(notice);
      }
      eventsGrid.dataset.state = 'error';
    }
  } finally {
    loadingEvents = false;
  }
};
window.addEventListener('focus',()=>{if(!draftPreview)loadEvents();});
setInterval(()=>{if(!draftPreview)loadEvents();},60000);
// --- Filter Interactions ---

if (showPastEventsCheckbox) {
  showPastEventsCheckbox.addEventListener('change', (e) => {
    showPastEvents = e.target.checked;
    if (eventsGrid.dataset.state === 'ready') renderEvents();
  });
}

if (showPastLabel && showPastEventsCheckbox) {
  showPastLabel.addEventListener('click', () => {
    showPastEventsCheckbox.checked = !showPastEventsCheckbox.checked;
    showPastEvents = showPastEventsCheckbox.checked;
    if (eventsGrid.dataset.state === 'ready') renderEvents();
  });
}

// --- Initialize ---
const init = () => {
  if(draftPreview)return; // No public API request from an unpublished preview.
  loadEvents();
};

init();

// Accessible modal focus, Escape dismissal and focus restoration.
let activeEventModal = null;
let eventModalTrigger = null;
const syncEventModals = () => {
  const next = [detailModal, registerModal].find(modal=>modal.classList.contains('active')) || null;
  for(const modal of [detailModal,registerModal])modal.setAttribute('aria-hidden',String(modal!==next));
  if(next===activeEventModal)return;
  if(next){
    if(!activeEventModal)eventModalTrigger=document.activeElement;
    next.querySelector('button,a[href],input:not([type="hidden"]),select,textarea')?.focus();
  } else eventModalTrigger?.focus();
  activeEventModal=next;
  document.documentElement.classList.toggle('event-modal-open',!!next);
};
const eventModalObserver = new MutationObserver(syncEventModals);
for(const modal of [detailModal,registerModal])eventModalObserver.observe(modal,{attributes:true,attributeFilter:['class']});
document.addEventListener('keydown',e=>{
  if(!activeEventModal)return;
  if(e.key==='Escape'){activeEventModal.classList.remove('active');return;}
  if(e.key!=='Tab')return;
  const controls=[...activeEventModal.querySelectorAll('button:not(:disabled),a[href],input:not([type="hidden"]):not(:disabled),select:not(:disabled),textarea:not(:disabled)')].filter(el=>el.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
});
