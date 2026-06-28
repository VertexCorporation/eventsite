const fs = require('fs');
const path = require('path');

const LANGUAGES = ['tr', 'en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'id', 'ru', 'ja', 'ko', 'zh', 'hi', 'ar', 'az'];

const langNames = {
  tr: 'Türkçe',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  it: 'Italiano',
  pt: 'Português',
  nl: 'Nederlands',
  id: 'Indonesia',
  ru: 'Русский',
  ja: '日本語',
  ko: '한국어',
  zh: '简体中文',
  hi: 'Hindi',
  ar: 'العربية',
  az: 'Azərbaycan'
};

const LEGAL_DATA = {
  tr: {
    privacyTitle: "Gizlilik Politikası",
    privacySub: "Vertex Corporation LTD tarafından düzenlenen tüm etkinlikler için geçerli olan gizlilik şartları.",
    privacySections: [
      { title: "1. Veri Sorumlusu", content: "Bu web sitesi ve etkinlik kayıt kanalları üzerinden toplanan kişisel veriler, veri sorumlusu sıfatıyla Vertex Corporation LTD (bundan böyle \"Organizatör\" olarak anılacaktır) tarafından işlenmektedir. Katılımcılar, kayıt ve etkinlik sürecinde sağladıkları bilgiler bakımından \"Veri Sahibi\" olarak kabul edilir." },
      { title: "2. Toplanan Kişisel Veriler", content: "Etkinliğe kayıt aşamasında veya etkinlik süresince aşağıda belirtilen veri kategorileri toplanabilir:\n- Kimlik Bilgileri (Ad, soyad)\n- İletişim Bilgileri (E-posta adresi, telefon numarası)\n- Katılım ve İşlem Bilgileri (Bilet, ödeme detayları ve tercih edilen etkinlik seansları)\n- Görsel ve İşitsel Kayıtlar (Etkinlik sırasında çekilen fotoğraf ve videolar)\n- Gönüllü olarak paylaşılan diğer geri bildirim ve anket verileri" },
      { title: "3. Fotoğraf ve Video Çekimi", content: "Etkinliğe katılan her birey, aşağıdaki şartları kabul etmiş sayılır:\n- Etkinlik alanında genel veya bireysel fotoğraf ve video çekimi yapılabilir.\n- Organizatör, bu görsel ve işitsel materyalleri tanıtım, sosyal medya iletişimi, web sitesi yayınları ve kurum içi arşiv amaçlarıyla kullanma hakkına sahiptir.\n- Katılımcı görselleri, ticari olmayan ve organizasyonun tanıtımına yönelik faaliyetlerde paylaşılabilir.\n- Katılımcı, etkinliğe bilet alarak ve katılım sağlayarak bu çekimlere ve materyallerin kullanımına açık rıza verdiğini beyan eder." },
      { title: "4. Verilerin İşlenme ve Kullanım Amacı", content: "Toplanan kişisel veriler, ilgili veri koruma mevzuatlarına uygun olarak yalnızca şu amaçlarla işlenir:\n- Etkinlik kayıt, biletleme ve katılım süreçlerini sorunsuz bir şekilde yönetmek\n- Gerektiğinde katılımcılarla operasyonel veya acil durum iletişimi kurmak\n- Etkinlik öncesi, sırası ve sonrasında gerekli bilgilendirmeleri yapmak\n- Etkinlik alanında güvenlik ve organizasyon süreçlerini koordine etmek\n- Hizmet kalitesini artırmak amacıyla etkinlik analizleri ve istatistiksel iyileştirme çalışmaları yapmak" },
      { title: "5. Veri Paylaşımı ve Aktarımı", content: "Organizatör, kişisel verilerin gizliliğine azami özen gösterir. Bu kapsamda kişisel veriler:\n- Hiçbir koşulda üçüncü şahıslara veya kurumlara satılmaz.\n- Sadece organizasyonun gerçekleşmesi için zorunlu olan yetkili hizmet sağlayıcılarla (biletleme altyapıları, e-posta gönderim servisleri, sunucu/hosting hizmetleri) gizlilik sözleşmeleri çerçevesinde paylaşılabilir.\n- Yasal bir zorunluluk doğması halinde, yetkili resmi kurum ve kuruluşların usulüne uygun taleplerine istinaden paylaşılabilir." },
      { title: "6. Veri Saklama Süresi", content: "Kişisel verileriniz, etkinliğin gerçekleştiği süre boyunca ve mevzuatın gerektirdiği hukuki zamanaşımı süreleri (meşru menfaat) doğrultusunda saklanır. İşlenme amacının ortadan kalkması veya yasal saklama süresinin dolması halinde verileriniz güvenli bir şekilde silinir, yok edilir veya anonim hale getirilir." },
      { title: "7. Katılımcı Hakları", content: "Yürürlükteki veri koruma yasaları (KVKK / GDPR) kapsamında katılımcılar aşağıdaki haklara sahiptir:\n- Kişisel verilerinin işlenip işlenmediğini öğrenme ve erişim talep etme\n- Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme\n- Verilerin silinmesini veya yok edilmesini talep etme (\"Unutulma Hakkı\")\n- Veri işleme faaliyetinin kısıtlanmasını talep etme\nBu haklarınızı kullanmak için Organizatör ile dilediğiniz zaman iletişime geçebilirsiniz." },
      { title: "8. Politika Güncellemeleri", content: "Organizatör, yasal düzenlemeler veya hizmet süreçlerindeki değişiklikler doğrultusunda bu Gizlilik Politikası'nı dilediği zaman güncelleme hakkını saklı tutar. Güncel politika, web sitesinde veya etkinlik kayıt sayfasında yayınlandığı andan itibaren geçerlilik kazanır." }
    ],
    termsTitle: "Şartlar ve Koşullar",
    termsSub: "Vertex Corporation LTD etkinliklerine katılım ve bilet kurallarını içeren yasal sözleşme.",
    termsSections: [
      { title: "1. Genel Kurallar ve Katılımcı Davranışları", content: "- Etkinliğe katılan herkes, Organizatör tarafından belirlenen ve ilan edilen tüm kurallara uymakla yükümlüdür.\n- Etkinlik alanındaki genel güvenliği, huzuru ve organizasyon düzenini bozan, diğer katılımcıları veya personeli rahatsız eden kişiler, bilet iadesi yapılmaksızın etkinlik alanından çıkarılabilir.\n- Tüm katılımcılar, etkinlik alanında uygulanan iş sağlığı ve güvenlik kurallarına uymak zorundadır." },
      { title: "2. Bilet ve Giriş Koşulları", content: "- Satın alınan biletler kişiye özeldir. Organizatör tarafından aksi yazılı olarak belirtilmedikçe biletler üçüncü şahıslara devredilemez veya satılamaz.\n- Etkinlik alanına giriş yapabilmek için katılımcının adına düzenlenmiş, geçerli bir biletin (dijital veya basılı) ibraz edilmesi zorunludur." },
      { title: "3. Etkinlik Değişiklikleri ve İade Politikası", content: "- Etkinlikler hiçbir koşulda iptal edilmeyecektir; ancak etkinlik tarihi, saati, mekanı ve diğer organizasyonel detaylar Organizatör tarafından değiştirilebilir.\n- Gerçekleştirilen bu değişikliklerin kayıtlı katılımcıların etkinliğe katılımını engellemesi durumu da dahil olmak üzere, ortaya çıkabilecek hiçbir senaryoda bilet veya ücret iadesi kesinlikle yapılmayacaktır." },
      { title: "4. Sorumluluk Reddi", content: "- Etkinlik süresince veya etkinlik alanında katılımcılara ait kişisel eşyaların kaybolması, çalınması veya hasar görmesi durumlarından Vertex Corporation LTD ve bağlı personelleri sorumlu tutulamaz.\n- Katılımcılar, etkinliğe tamamen kendi özgür iradeleri ve sorumlulukları altında katılım sağlarlar." },
      { title: "5. Fikri Mülkiyet Hakları", content: "Etkinlik kapsamında sunulan her türlü içerik, sunum, görsel, işitsel materyal, marka logoları ve tasarımlar Vertex Corporation LTD'ye veya ilgili içerik üreticilerine aittir. Bu materyaller organizatörün yazılı izni olmaksızın kopyalanamaz, çoğaltılamaz, dağıtılamaz veya ticari amaçlarla kullanılamaz." },
      { title: "6. Organizasyonel Değişiklik Hakkı", content: "Organizatör, önceden haber vermeksizin etkinlik programında ve akışında değişiklik yapma ile duyurulan konuşmacıları, konukları veya etkinlik partnerlerini değiştirme hakkını saklı tutar." },
      { title: "7. Uygulanacak Hukuk ve Yetki", content: "Bu Gizlilik Politikası ve Şartlar ve Koşullar, İngiltere (Birleşik Krallık) kanunlarına tabidir. İşbu sözleşmeden doğabilecek her türlü ihtilafın çözümünde İngiltere ve Galler Mahkemeleri münhasıran yetkilidir." },
      { title: "8. Şartların Güncellenmesi", content: "Bu şartlar ve koşullar, Organizatör tarafından gerekli görüldüğü hallerde önceden bildirim yapılmaksızın güncellenebilir. Değişiklikler yayınlandığı tarihte yürürlüğe girer." },
      { title: "9. Kabul ve Onay", content: "Etkinliğe bilet alarak veya kayıt formunu doldurarak katılım sağlayan her birey, işbu belgede yer alan \"Gizlilik Politikası\" ve \"Şartlar ve Koşullar\" metninin tamamını okuduğunu, anladığını ve hür iradesiyle peşinen kabul ettiğini gayrikabili rücu beyan ve taahhüt eder." }
    ]
  },
  en: {
    privacyTitle: "Privacy Policy",
    privacySub: "Privacy rules applicable to all events organized by Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Data Controller", content: "Personal data collected through this website and event registration channels is processed by Vertex Corporation LTD (hereinafter referred to as the \"Organizer\") in the capacity of data controller. Participants are considered as \"Data Owners\" in terms of the information they provide during the registration and event process." },
      { title: "2. Collected Personal Data", content: "During the registration stage or the event, the following data categories may be collected:\n- Identity Information (Name, surname)\n- Contact Information (Email address, phone number)\n- Participation & Transaction Information (Ticket, payment details, and preferred event sessions)\n- Visual and Audio Records (Photos and videos taken during the event)\n- Other feedback and survey data shared voluntarily" },
      { title: "3. Photo and Video Recording", content: "Every individual participating in the event is deemed to have accepted the following terms:\n- General or individual photos and videos may be taken in the event area.\n- The Organizer has the right to use these visual and audio materials for promotion, social media communication, website publications, and internal archiving purposes.\n- Participant images may be shared in non-commercial activities aimed at promoting the organization.\n- The participant declares that they give explicit consent to these recordings and the use of materials by purchasing a ticket and attending the event." },
      { title: "4. Purpose of Data Processing and Use", content: "Collected personal data is processed solely for the following purposes in accordance with relevant data protection regulations:\n- Managing event registration, ticketing, and participation processes smoothly\n- Establishing operational or emergency communication with participants when necessary\n- Making necessary announcements before, during, and after the event\n- Coordinating security and organizational processes in the event area\n- Performing event analysis and statistical improvement studies to increase service quality" },
      { title: "5. Data Sharing and Transfer", content: "The Organizer pays maximum attention to the confidentiality of personal data. In this context, personal data:\n- Is never sold to third parties or institutions under any circumstances.\n- Can only be shared with authorized service providers (ticketing infrastructures, email delivery services, server/hosting services) required for the event to take place, within the framework of confidentiality agreements.\n- May be shared in accordance with the due requests of authorized official institutions and organizations if a legal obligation arises." },
      { title: "6. Data Retention Period", content: "Your personal data is stored for the duration of the event and in line with the legal limitation periods required by the legislation (legitimate interest). If the purpose of processing ceases to exist or the legal retention period expires, your data will be securely deleted, destroyed, or anonymized." },
      { title: "7. Participant Rights", content: "Under applicable data protection laws (KVKK / GDPR), participants have the following rights:\n- Learning whether their personal data is processed and requesting access\n- Requesting correction of incomplete or incorrectly processed data\n- Requesting deletion or destruction of data (\"Right to be Forgotten\")\n- Requesting restriction of data processing activities\nYou can contact the Organizer at any time to exercise these rights." },
      { title: "8. Policy Updates", content: "The Organizer reserves the right to update this Privacy Policy at any time in line with legal regulations or changes in service processes. The updated policy becomes effective from the moment it is published on the website or event registration page." }
    ],
    termsTitle: "Terms and Conditions",
    termsSub: "Legal contract including participation and ticketing rules for Vertex Corporation LTD events.",
    termsSections: [
      { title: "1. General Rules and Participant Behavior", content: "- Everyone participating in the event is obliged to comply with all the rules determined and announced by the Organizer.\n- Persons who disrupt the general safety, peace, and organizational order in the event area, or who disturb other participants or staff, may be removed from the event area without ticket refund.\n- All participants must comply with the occupational health and safety rules applied in the event area." },
      { title: "2. Ticket and Entry Conditions", content: "- Purchased tickets are personal. Unless otherwise stated in writing by the Organizer, tickets cannot be transferred or sold to third parties.\n- In order to enter the event area, it is mandatory to present a valid ticket (digital or printed) issued in the name of the participant." },
      { title: "3. Event Changes and Refund Policy", content: "- Events will not be cancelled under any circumstances; however, the date, time, venue, and other organizational details of the event may be changed by the Organizer.\n- No ticket or fee refund will be made under any scenario that may arise, including the case where these changes prevent registered participants from attending the event." },
      { title: "4. Disclaimer", content: "- Vertex Corporation LTD and its associated personnel cannot be held responsible for the loss, theft, or damage of personal belongings belonging to the participants during the event or in the event area.\n- Participants attend the event entirely under their own free will and responsibility." },
      { title: "5. Intellectual Property Rights", content: "All kinds of content, presentations, visuals, audio materials, brand logos, and designs presented within the scope of the event belong to Vertex Corporation LTD or the respective content creators. These materials cannot be copied, reproduced, distributed, or used for commercial purposes without the written permission of the Organizer." },
      { title: "6. Right of Organizational Change", content: "The Organizer reserves the right to change the event program and flow, and to change the announced speakers, guests, or event partners without prior notice." },
      { title: "7. Governing Law and Jurisdiction", content: "This Privacy Policy and Terms and Conditions are governed by the laws of England (United Kingdom). The Courts of England and Wales have exclusive jurisdiction in the resolution of any disputes that may arise from this contract." },
      { title: "8. Updating the Terms", content: "These terms and conditions may be updated by the Organizer when deemed necessary without prior notice. Changes take effect on the date they are published." },
      { title: "9. Acceptance and Approval", content: "Each individual participating by purchasing a ticket to the event or filling out the registration form declares, represents, and warrants that they have read, understood, and accepted in advance the entire text of the \"Privacy Policy\" and \"Terms and Conditions\" in this document with their free will, irrevocably." }
    ]
  },
  de: {
    privacyTitle: "Datenschutzerklärung",
    privacySub: "Datenschutzbestimmungen für alle von Vertex Corporation LTD organisierten Veranstaltungen.",
    privacySections: [
      { title: "1. Verantwortlicher", content: "Die über diese Website und die Registrierungskanäle erhobenen personenbezogenen Daten werden von der Vertex Corporation LTD (im Folgenden \"Veranstalter\") als Verantwortlicher verarbeitet." },
      { title: "2. Erhobene personenbezogene Daten", content: "Folgende Daten können erhoben werden:\n- Identifikationsdaten (Name, Vorname)\n- Kontaktdaten (E-Mail-Adresse, Telefonnummer)\n- Teilnahme- & Transaktionsdaten (Ticket, Zahlungsdetails)\n- Bild- und Tonaufnahmen (Fotos/Videos)\n- Freiwilliges Feedback und Umfragen" },
      { title: "3. Foto- und Videoaufnahmen", content: "Jeder Teilnehmer stimmt Folgendem zu:\n- Aufnahmen im Veranstaltungsbereich sind zulässig.\n- Der Veranstalter darf diese für Werbezwecke, soziale Medien und Archive nutzen." },
      { title: "4. Zweck der Datenverarbeitung", content: "Die Datenverarbeitung dient der Verwaltung der Anmeldung, Sicherheit und Qualitätsverbesserung." },
      { title: "5. Datenweitergabe", content: "Daten werden niemals verkauft. Weitergabe erfolgt nur an Dienstleister zur Vertragserfüllung oder bei gesetzlicher Pflicht." },
      { title: "6. Aufbewahrungsfrist", content: "Daten werden für die Dauer der Veranstaltung und gesetzliche Aufbewahrungsfristen gespeichert." },
      { title: "7. Rechte der Teilnehmer", content: "Teilnehmer haben Rechte auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung." },
      { title: "8. Richtlinienänderungen", content: "Der Veranstalter behält sich das Recht vor, diese Erklärung jederzeit zu ändern." }
    ],
    termsTitle: "Allgemeine Geschäftsbedingungen",
    termsSub: "Rechtliche Vereinbarung über die Teilnahme und Ticketregeln für Vertex-Veranstaltungen.",
    termsSections: [
      { title: "1. Allgemeine Regeln und Verhalten", content: "Teilnehmer müssen alle Regeln befolgen. Bei Störungen ist ein Ausschluss ohne Erstattung möglich." },
      { title: "2. Tickets und Einlass", content: "Tickets sind personalisiert und nicht übertragbar. Ein gültiges Ticket ist beim Einlass vorzuzeigen." },
      { title: "3. Änderungen und Erstattungen", content: "Veranstaltungen werden nicht abgesagt. Datum, Uhrzeit und Ort können sich ändern. Erstattungen sind ausgeschlossen." },
      { title: "4. Haftungsausschluss", content: "Der Veranstalter haftet nicht für verlorene, gestohlene oder beschädigte Gegenstände." },
      { title: "5. Geistiges Eigentum", content: "Inhalte und Präsentationen gehören Vertex. Kopieren oder kommerzielle Nutzung ist verboten." },
      { title: "6. Organisatorische Änderungen", content: "Der Veranstalter darf das Programm oder die Sprecher ohne Vorankündigung ändern." },
      { title: "7. Anwendbares Recht", content: "Es gilt das Recht von England (Vereinigtes Königreich). Gerichtsstand ist England und Wales." },
      { title: "8. Änderungen der Bedingungen", content: "Diese Bedingungen können jederzeit ohne Vorankündigung geändert werden." },
      { title: "9. Einverständnis", content: "Mit Ticketkauf oder Registrierung stimmt der Teilnehmer diesen Bedingungen unwiderruflich zu." }
    ]
  },
  fr: {
    privacyTitle: "Politique de Confidentialité",
    privacySub: "Règles de confidentialité applicables à tous les événements organisés par Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Responsable du traitement", content: "Les données personnelles collectées sont traitées par Vertex Corporation LTD (ci-après l'\"Organisateur\")." },
      { title: "2. Données collectées", content: "Les catégories de données suivantes peuvent être collectées :\n- Informations d'identification (Nom, prénom)\n- Informations de contact (Adresse e-mail, téléphone)\n- Informations de participation (Détails du ticket, paiement)\n- Enregistrements visuels et sonores (Photos, vidéos)\n- Réponses aux questionnaires et sondages" },
      { title: "3. Enregistrements photos et vidéos", content: "Chaque participant accepte que :\n- Des photos et vidéos puissent être prises sur le lieu de l'événement.\n- L'Organisateur utilise ces supports pour sa promotion et ses archives." },
      { title: "4. Finalités du traitement", content: "Les données sont traitées pour la gestion des inscriptions, la sécurité et l'amélioration des services." },
      { title: "5. Partage des données", content: "Vos données ne sont jamais vendues. Elles sont partagées uniquement avec les prestataires techniques ou si la loi l'exige." },
      { title: "6. Durée de conservation", content: "Les données sont conservées pendant la durée de l'événement et les délais de prescription légaux." },
      { title: "7. Droits des participants", content: "Vous disposez de droits d'accès, de rectification, de suppression et de limitation du traitement." },
      { title: "8. Mises à jour", content: "L'Organisateur se réserve le droit de modifier cette politique à tout moment." }
    ],
    termsTitle: "Conditions Générales",
    termsSub: "Contrat légal contenant les règles de participation et de billetterie pour les événements Vertex.",
    termsSections: [
      { title: "1. Règles générales et comportement", content: "Tous les participants doivent respecter les règles. Toute personne perturbant l'ordre peut être exclue sans remboursement." },
      { title: "2. Billets et entrée", content: "Les billets sont nominatifs et non transférables. Un billet valide doit être présenté à l'entrée." },
      { title: "3. Modifications de l'événement et remboursement", content: "Les événements ne seront pas annulés. L'Organisateur peut modifier la date, l'heure ou le lieu. Aucun remboursement ne sera accordé." },
      { title: "4. Limitation de responsabilité", content: "L'Organisateur décline toute responsabilité en cas de perte, vol ou dommage subi par les effets personnels." },
      { title: "5. Propriété intellectuelle", content: "Tous les contenus présentés appartiennent à Vertex. Toute reproduction sans autorisation écrite est interdite." },
      { title: "6. Changements organisationnels", content: "L'Organisateur peut modifier le programme ou les intervenants sans préavis." },
      { title: "7. Droit applicable", content: "Ces conditions sont régies par le droit de l'Angleterre. Les tribunaux d'Angleterre et du Pays de Galles sont seuls compétents." },
      { title: "8. Modification des conditions", content: "Ces conditions peuvent être modifiées à tout moment sans préavis." },
      { title: "9. Acceptation", content: "L'achat d'un billet ou l'inscription implique l'acceptation entière et irrévocable de ces conditions." }
    ]
  },
  es: {
    privacyTitle: "Política de Privacidad",
    privacySub: "Normas de privacidad aplicables a todos los eventos organizados por Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Responsable del Tratamiento", content: "Los datos personales recopilados son tratados por Vertex Corporation LTD (en adelante, el \"Organizador\")." },
      { title: "2. Datos Personales Recopilados", content: "Se pueden recopilar los siguientes datos:\n- Datos de identidad (Nombre, apellido)\n- Datos de contacto (Correo electrónico, teléfono)\n- Datos de participación (Detalles del boleto, pago)\n- Grabaciones audiovisuales (Fotos, videos)\n- Comentarios y encuestas voluntarias" },
      { title: "3. Toma de Fotografías y Videos", content: "Al asistir, el participante acepta que :\n- Se realicen fotos y videos en el evento.\n- El Organizador use estos materiales para promoción, redes sociales y archivos." },
      { title: "4. Finalidad del Tratamiento", content: "Los datos se procesan para gestionar el registro, garantizar la seguridad y mejorar los servicios." },
      { title: "5. Compartición de Datos", content: "Los datos nunca se venden. Solo se comparten con proveedores autorizados o por obligación legal." },
      { title: "6. Retención de Datos", content: "Los datos se conservan durante el evento y los plazos legales de prescripción." },
      { title: "7. Derechos del Participante", content: "El participante tiene derecho al acceso, rectificación, supresión y limitación del tratamiento." },
      { title: "8. Actualizaciones", content: "El Organizador se reserva el derecho de actualizar esta política en cualquier momento." }
    ],
    termsTitle: "Términos y Condiciones",
    termsSub: "Contrato legal que incluye las reglas de participación y venta de entradas para eventos de Vertex.",
    termsSections: [
      { title: "1. Reglas Generales y Conducta", content: "Los participantes deben cumplir las normas. Quienes alteren el orden pueden ser expulsados sin derecho a reembolso." },
      { title: "2. Entradas y Acceso", content: "Las entradas son personales e intransferibles. Es obligatorio presentar una entrada válida para ingresar." },
      { title: "3. Cambios e Inexistencia de Reembolso", content: "Los eventos no se cancelarán. Se pueden modificar fechas, horarios o ubicaciones. No se realizarán reembolsos." },
      { title: "4. Exclusión de Responsabilidad", content: "El Organizador no se hace responsable de la pérdida, robo o daño de objetos personales." },
      { title: "5. Propiedad Intelecual", content: "Los contenidos presentados pertenecen a Vertex. Queda prohibida su copia o distribución sin autorización." },
      { title: "6. Modificaciones Organizativas", content: "El Organizador puede cambiar el programa o ponentes sin previo aviso." },
      { title: "7. Ley Aplicable y Jurisdicción", content: "Se rige por las leyes de Inglaterra. Los tribunales de Inglaterra y Gales tienen jurisdicción exclusiva." },
      { title: "8. Modificación de los Términos", content: "Estos términos pueden ser modificados en cualquier momento sin previo aviso." },
      { title: "9. Aceptación", content: "La compra de una entrada o el registro implica la aceptación plena e irrevocable de estas condiciones." }
    ]
  },
  it: {
    privacyTitle: "Informativa sulla Privacy",
    privacySub: "Regole di privacy applicabili a tutti gli eventi organizzati da Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Titolare del Trattamento", content: "I dati personali raccolti sono trattati da Vertex Corporation LTD (di seguito l'\"Organizzatore\")." },
      { title: "2. Danti Personali Raccolti", content: "Possono essere raccolti i seguenti dati:\n- Dati identificativi (Nome, cognome)\n- Dati di contatto (E-mail, numero di telefono)\n- Dati di partecipazione (Biglietto, dettagli di pagamento)\n- Riprese audiovisive (Foto, video)\n- Feedback e sondaggi volontari" },
      { title: "3. Riprese Foto e Video", content: "Il partecipante acconsente a che:\n- Vengano effettuate foto e video durante l'evento.\n- L'Organizzatore utilizzi tali materiali per promozione, social media e archivi." },
      { title: "4. Finalità del Trattamento", content: "I dati sono trattati per la gestione delle registrazioni, la sicurezza e il miglioramento dei servizi." },
      { title: "5. Condivisione dei Dati", content: "I dati non sono mai venduti. Sono condivisi solo con fornitori autorizzati o per obblighi di legge." },
      { title: "6. Conservazione dei Dati", content: "I dati sono conservati per la durata dell'evento e i periodi di prescrizione legale." },
      { title: "7. Diritti del Partecipante", content: "I partecipanti hanno diritto di accesso, rettifica, cancellazione e limitazione del trattamento." },
      { title: "8. Aggiornamenti", content: "L'Organizzatore si riserva il diritto di aggiornare questa informativa in qualsiasi momento." }
    ],
    termsTitle: "Termini e Condizioni",
    termsSub: "Contratto legale contenente le regole di partecipazione e biglietteria per gli eventi Vertex.",
    termsSections: [
      { title: "1. Regaoe Generali e Comportamento", content: "Tutti i partecipanti devono rispettare le regole. Chi disturba l'ordine può essere allontanato senza rimborso." },
      { title: "2. Biglietti e Ingresso", content: "I biglietti sono nominativi e non trasferibili. È obbligatorio presentare un biglietto valido all'ingresso." },
      { title: "3. Modifiche e Politica di Rimborso", content: "Gli eventi non saranno annullati. Date, orari e luoghi possono subire modifiche. Non sono previsti rimborsi." },
      { title: "4. Esclusione di Responsabilità", content: "L'Organizzatore non risponde di smarrimento, furto o danno agli oggetti personali dei partecipanti." },
      { title: "5. Proprietà Intellettuale", content: "Tutti i contenuti appartengono a Vertex. È vietata la riproduzione senza consenso scritto." },
      { title: "6. Variazioni Organizzative", content: "L'Organizzatore può modificare il programma o i relatori senza preavviso." },
      { title: "7. Legge Applicabile", content: "Regolato dalle leggi dell'Inghilterra. Competenza esclusiva dei tribunali di Inghilterra e Galles." },
      { title: "8. Modifica dei Termini", content: "I termini possono essere modificati in qualsiasi momento senza preavviso." },
      { title: "9. Accettazione", content: "L'acquisto del biglietto o la registrazione costituisce accettazione totale e irrevocabile dei presenti termini." }
    ]
  },
  pt: {
    privacyTitle: "Política de Privacidade",
    privacySub: "Regras de privacidade aplicáveis a todos os eventos organizados pela Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Responsável pelo Tratamento", content: "Os dados pessoais coletados são tratados pela Vertex Corporation LTD (doravante \"Organizador\")." },
      { title: "2. Dados Pessoais Coletados", content: "Podem ser coletados os seguintes dados:\n- Dados de identificação (Nome, sobrenome)\n- Dados de contato (E-mail, telefone)\n- Dados de participação (Ingresso, detalhes de pagamento)\n- Registros fotográficos e em vídeo (Fotos, filmagens)\n- Respostas a pesquisas e comentários" },
      { title: "3. Captação de Fotos e Vídeos", content: "O participante aceita que:\n- Fotos e vídeos gerais ou individuais possam ser captados no evento.\n- O Organizador utilize os materiais para promoção, redes sociais e arquivo." },
      { title: "4. Finalidade do Tratamento", content: "Os dados são tratados para gerenciar inscrições, garantir segurança e aprimorar serviços." },
      { title: "5. Compartilhamento de Dados", content: "Os dados nunca son vendidos. São partilhados apenas com parceiros autorizados ou por obrigação legal." },
      { title: "6. Retenção de Dados", content: "Os dados são mantidos durante o evento e pelos prazos legais de prescrição." },
      { title: "7. Direitos do Participante", content: "O participante tem direito ao acesso, retificação, eliminação e limitação do tratamento." },
      { title: "8. Atualizações", content: "O Organizador reserva-se o direito de atualizar esta política a qualquer momento." }
    ],
    termsTitle: "Termos e Condições",
    termsSub: "Contrato legal contendo regras de participação e bilheteria para eventos da Vertex.",
    termsSections: [
      { title: "1. Regras Gerais e Conduta", content: "Os participantes devem cumprir as regras. Comportamentos inadequados podem resultar em expulsão sem reembolso." },
      { title: "2. Ingressos e Acesso", content: "Os ingressos são pessoais e intransferíveis. Apresentação de ingresso válido é obrigatória para entrar." },
      { title: "3. Alterações e Reembolsos", content: "Os eventos não serão cancelados. Data, hora ou local podem sofrer alterações. Não haverá reembolsos." },
      { title: "4. Isenção de Responsabilidade", content: "O Organizador não se responsabiliza por perdas, roubos ou danos a bens pessoais dos participantes." },
      { title: "5. Propriédade Intelectual", content: "Todo conteúdo apresentado pertence à Vertex. Reprodução sem autorização prévia por escrito é proibida." },
      { title: "6. Alterações de Programação", content: "O Organizador pode alterar a agenda ou os oradores sem aviso prévio." },
      { title: "7. Lei Aplicável", content: "Regido pelas leis da Inglaterra. Jurisdição exclusiva dos tribunais da Inglaterra e País de Gales." },
      { title: "8. Alteração dos Termos", content: "Estes termos podem ser atualizados a qualquer momento sem aviso prévio." },
      { title: "9. Aceitação", content: "A compra do ingresso ou inscrição constitui aceitação plena e irrevogável destes termos." }
    ]
  },
  nl: {
    privacyTitle: "Privacybeleid",
    privacySub: "Privacyregels die van toepassing zijn op alle evenementen georganiseerd door Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Verwerkingsverantwoordelijke", content: "De verzamelde persoonsgegevens worden verwerkt door Vertex Corporation LTD (hierna \"Organisator\")." },
      { title: "2. Verzamelde persoonsgegevens", content: "De volgende gegevens kunnen worden verzameld:\n- Identificatiegegevens (Naam, achternaam)\n- Contactgegevens (E-mailadres, telefoonnummer)\n- Deelname & Transactiegegevens (Ticket, betalingsgegevens)\n- Beeld- en geluidsopnamen (Foto's, video's)\n- Vrijwillige feedback en enquêtes" },
      { title: "3. Foto- en video-opnamen", content: "Elke deelnemer stemt ermee in dat:\n- Foto's en video's kunnen worden gemaakt op de evenementlocatie.\n- De Organisator deze materialen mag gebruiken voor promotie, social media en archivering." },
      { title: "4. Doel van de verwerking", content: "Gegevens worden verwerkt voor verwerking van inschrijvingen, veiligheid en serviceverbetering." },
      { title: "5. Delen van gegevens", content: "Gegevens worden nooit verkocht. Delen gebeurt uitsluitend met geautoriseerde partners of bij wettelijke verplichting." },
      { title: "6. Bewaartermijn", content: "Gegevens worden bewaard voor de duur van het evenement en wettelijke verjaringstermijnen." },
      { title: "7. Rechten van deelnemers", content: "Deelnemers hebben recht op inzage, rectificatie, wissen van gegevens en beperking van verwerking." },
      { title: "8. Updates", content: "De Organisator behoudt zich het recht voor om dit Privacybeleid op elk gewenst moment bij te werken." }
    ],
    termsTitle: "Algemene Voorwaarden",
    termsSub: "Wettelijke overeenkomst met deelname- en ticketregels voor Vertex-evenementen.",
    termsSections: [
      { title: "1. Algemene regels en gedrag", content: "Iedereen dient de regels te volgen. Verstoorders kunnen zonder restitutie van het terrein worden verwijderd." },
      { title: "2. Tickets en toegang", content: "Tickets zijn persoonsgebonden en niet overdraagbaar. Een geldig ticket is vereist bij de ingang." },
      { title: "3. Wijzigingen en restitutiebeleid", content: "Evenementen worden niet geannuleerd. Datum, tijd en locatie kunnen wijzigen. Er worden geen restituties verleend." },
      { title: "4. Disclaimer", content: "De Organisator is niet aansprakelijk voor verlies, diefstal of beschadiging van persoonlijke eigendommen." },
      { title: "5. Intellectueel eigendom", content: "Alle gepresenteerde materialen behoren toe aan Vertex. Kopiëren of verspreiden zonder toestemming is verboten." },
      { title: "6. Organisatorische wijzigingen", content: "De Organisator mag het programma of sprekers zonder voorafgaande kennisgeving wijzigen." },
      { title: "7. Toepasselijk recht", content: "Onderworpen aan het recht van Engeland. Geschillen worden voorgelegd aan de rechtbanken van Engeland en Wales." },
      { title: "8. Update van voorwaarden", content: "Deze voorwaarden kunnen zonder voorafgaande kennisgeving worden gewijzigd." },
      { title: "9. Akkoord", content: "Aanschaf van een ticket of registratie houdt volledige en onherroepelijke acceptatie in van deze voorwaarden." }
    ]
  },
  id: {
    privacyTitle: "Kebijakan Privasi",
    privacySub: "Aturan privasi yang berlaku untuk semua acara yang diselenggarakan oleh Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Pengendali Data", content: "Data pribadi yang dikumpulkan diproses oleh Vertex Corporation LTD (selanjutnya disebut \"Penyelenggara\") sebagai pengendali data." },
      { title: "2. Data Pribadi yang Dikumpulkan", content: "Kategori data berikut dapat dikumpulkan:\n- Informasi Identitas (Nama, nama belakang)\n- Informasi Kontak (Alamat email, nomor telepon)\n- Informasi Partisipasi & Transaksi (Tiket, detail pembayaran)\n- Rekaman Visual dan Audio (Foto dan video selama acara)\n- Umpan balik dan data survei sukarela" },
      { title: "3. Pengambilan Foto dan Video", content: "Setiap peserta dianggap menyetujui ketentuan berikut:\n- Foto dan video umum atau individu dapat diambil di area acara.\n- Penyelenggara berhak menggunakan materi tersebut untuk promosi, media sosial, dan arsip." },
      { title: "4. Tujuan Pemrosesan Data", content: "Data pribadi diproses untuk manajemen pendaftaran, komunikasi operasional, keamanan, dan peningkatan kualitas layanan." },
      { title: "5. Pembagian Data", content: "Data tidak pernah dijual. Data hanya dibagikan dengan penyedia layanan resmi atau jika diwajibkan oleh hukum." },
      { title: "6. Periode Retensi Data", content: "Data disimpan selama acara berlangsung dan sesuai dengan masa kedaluwarsa hukum yang berlaku." },
      { title: "7. Hak Peserta", content: "Peserta memiliki hak untuk mengakses, memperbaiki, menghapus, dan membatasi pemrosesan data mereka." },
      { title: "8. Pembaruan Kebijakan", content: "Penyelenggara berhak memperbarui Kebijakan Privasi ini kapan saja." }
    ],
    termsTitle: "Syarat dan Ketentuan",
    termsSub: "Kontrak hukum yang berisi aturan partisipasi dan tiket untuk acara Vertex Corporation LTD.",
    termsSections: [
      { title: "1. Aturan Umum dan Perilaku Peserta", content: "Semua peserta wajib mematuhi aturan. Peserta yang mengganggu ketertiban dapat dikeluarkan tanpa pengembalian dana." },
      { title: "2. Ketentuan Tiket dan Masuk", content: "Tiket bersifat pribadi dan tidak dapat dipindahtangankan. Tiket yang sah wajib ditunjukkan di pintu masuk." },
      { title: "3. Perubahan Acara dan Kebijakan Pengembalian Uang", content: "Acara tidak akan dibatalkan. Tanggal, waktu, dan lokasi dapat diubah. Tidak ada pengembalian uang dalam kondisi apa pun." },
      { title: "4. Batasan Tanggung Jawab", content: "Penyelenggara tidak bertanggung jawab atas kehilangan, pencurian, atau kerusakan barang pribadi milik peserta." },
      { title: "5. Hak Kekayaan Intelektual", content: "Semua konten yang disajikan adalah milik Vertex. Dilarang menyalin atau mendistribusikan tanpa izin tertulis." },
      { title: "6. Hak Perubahan Organisasi", content: "Penyelenggara berhak mengubah program, pembicara, atau mitra tanpa pemberitahuan sebelumnya." },
      { title: "7. Hukum yang Berlaku", content: "Tunduk pada hukum Inggris. Pengadilan Inggris dan Wales memiliki yurisdiksi eksklusif." },
      { title: "8. Pembaruan Ketentuan", content: "Ketentuan ini dapat diperbarui oleh Penyelenggara kapan saja tanpa pemberitahuan." },
      { title: "9. Penerimaan", content: "Membeli tiket atau mendaftar berarti menerima seluruh syarat dan ketentuan ini secara penuh." }
    ]
  },
  ru: {
    privacyTitle: "Политика конфиденциальности",
    privacySub: "Правила конфиденциальности, применимые ко всем мероприятиям, организуемым Vertex Corporation LTD.",
    privacySections: [
      { title: "1. Контролер данных", content: "Персональные данные обрабатываются компанией Vertex Corporation LTD (далее \"Организатор\") в качестве контролера данных." },
      { title: "2. Собираемые персональные данные", content: "Могут собираться следующие категории данных:\n- Идентификационная информация (Имя, фамилия)\n- Контактные данные (Адрес электронной почты, номер телефона)\n- Информация об участии и транзакциях (Билет, детали оплаты)\n- Фото- и видеоматериалы (Снятые во время мероприятия)\n- Добровольные отзывы и опросы" },
      { title: "3. Фото- и видеосъемка", content: "Каждый участник соглашается с тем, что:\n- На мероприятии может проводиться фото- и видеосъемка.\n- Организатор имеет право использовать эти материалы для рекламы, соцсетей и архивов." },
      { title: "4. Цели обработки данных", content: "Данные обрабатываются для управления регистрацией, обеспечения безопасности и улучшения услуг." },
      { title: "5. Передача данных", content: "Данные никогда не продаются. Передача возможна только авторизованным партнерам или по закону." },
      { title: "6. Срок хранения данных", content: "Данные хранятся в течение периода проведения мероприятия и в соответствии с законом." },
      { title: "7. Права участников", content: "Участники имеют право на доступ, исправление, удаление и ограничение обработки своих данных." },
      { title: "8. Обновления политики", content: "Организатор оставляет за собой право обновлять эту политику в любое время." }
    ],
    termsTitle: "Правила и условия",
    termsSub: "Юридический договор, содержащий правила участия и продажи билетов на мероприятия Vertex.",
    termsSections: [
      { title: "1. Общие правила и поведение участников", content: "Все участники обязаны соблюдать правила. Нарушители порядка могут быть удалены без возврата средств." },
      { title: "2. Билеты и условия входа", content: "Билеты являются именными и не подлежат передаче. На входе необходимо предъявить действующий билет." },
      { title: "3. Изменения мероприятий и возврат средств", content: "Мероприятия не отменяются. Дата, время и место могут быть изменены. Возврат средств не производится." },
      { title: "4. Ограничение ответственности", content: "Организатор не несет ответственности за утерю, кражу или повреждение личных вещей участников." },
      { title: "5. Интеллектуальная собственность", content: "Все материалы принадлежат Vertex. Копирование или коммерческое использование без разрешения запрещено." },
      { title: "6. Право на организационные изменения", content: "Организатор может изменять программу или список спикеров без предварительного уведомления." },
      { title: "7. Применимое право", content: "Регулируется законами Англии. Исключительная юрисдикция судов Англии и Уэльса." },
      { title: "8. Обновление условий", content: "Эти условия могут быть изменены Организатором в любое время без уведомления." },
      { title: "9. Согласие", content: "Покупка билета или регистрация означает полное и безоговоковое согласие с данными условиями." }
    ]
  },
  ja: {
    privacyTitle: "プライバシーポリシー",
    privacySub: "Vertex Corporation LTDが主催するすべてのイベントに適用される個人情報保護方針。",
    privacySections: [
      { title: "1. 個人情報取扱事業者", content: "本ウェブサイトおよびイベント登録を通じて収集された個人情報は、データ管理者としてVertex Corporation LTD（以下「主催者」）によって処理されます。" },
      { title: "2. 収集される個人情報", content: "以下の個人情報を収集する場合があります：\n- 氏名（名、姓）\n- 連絡先（メールアドレス、電話番号）\n- 参加および取引情報（チケット、支払いの詳細、希望セッション）\n- 画像および音声記録（イベント中に撮影された写真およびビデオ）\n- 任意で提供されたフィードバックおよびアンケートデータ" },
      { title: "3. 写真およびビデオ撮影", content: "イベント参加者は以下の条件に同意したものとみなされます：\n- 会場内で全体または個別の写真・動画撮影が行われる場合があります。\n- 主催者は、これらの素材をプロモーション、SNS、ウェブサイト、内部アーカイブ目的で使用する権利を有します。" },
      { title: "4. 個人情報の利用目的", content: "収集された個人情報は、登録管理、緊急連絡、安全確保、サービス向上のための分析にのみ使用されます。" },
      { title: "5. 第三者への開示・提供", content: "個人情報は第三者には販売されません。運営に必要な委託先への開示、または法令に基づく場合を除き、第三者に提供されません。" },
      { title: "6. 個人情報の保存期間", content: "個人情報はイベント期間中、および法令等で定められた期間保存され、その後安全に消去または匿名化されます。" },
      { title: "7. 参加者の権利", content: "参加者は個人情報の開示、訂正、削除（消去権）、処理の制限を請求する権利があります。" },
      { title: "8. プライバシーポリシーの改定", content: "主催者は、法令の変更等に応じて、本ポリシーを予告なく変更することがあります。" }
    ],
    termsTitle: "利用規約",
    termsSub: "Vertex Corporation LTDが主催するイベントへの参加およびチケットに関する規約。",
    termsSections: [
      { title: "1. 一般規則と参加者の行為", content: "参加者は主催者が定める規則に従うものとします。秩序を乱す参加者は返金なしで退場処分となる場合があります。" },
      { title: "2. チケットと入場条件", content: "チケットは記名式であり、第三者への譲渡・転売は禁止されています。入場には有効なチケットの提示が必要です。" },
      { title: "3. イベントの変更および払い戻し方針", content: "イベントはいかなる場合も中止されません。日時や場所が変更される場合がありますが、払い戻しは一切行いません。" },
      { title: "4. 免責事項", content: "会場内での私物の紛失、盗難、破損について、Vertexおよびそのスタッフは一切の責任を负いません。" },
      { title: "5. 知的財産権", content: "イベント内のすべてのコンテンツおよびロゴはVertexに帰属します。事前の書面による許可なく複製・転載することを禁じます。" },
      { title: "6. プログラム等の変更権", content: "主催者は予告なくプログラム、登壇者、パートナーを変更する権利を留保します。" },
      { title: "7. 準拠法および管轄裁判所", content: "本規約はイングランド法に準拠します。一切の紛争はイングランドおよびウェールズの裁判所を専属的管轄とします。" },
      { title: "8. 規約の変更", content: "本規約は主催者が必要と判断した際、事前の予告なく変更されることがあります。" },
      { title: "9. 同意", content: "チケットの購入または登録を完了した時点で、参加者は本規約およびプライバシーポリシーに同意したものとみなされます。" }
    ]
  },
  ko: {
    privacyTitle: "개인정보처리방침",
    privacySub: "Vertex Corporation LTD가 주최하는 모든 이벤트에 적용되는 개인정보 처리 규정입니다.",
    privacySections: [
      { title: "1. 개인정보 처리자", content: "본 웹사이트 및 이벤트 등록 채널을 통해 수집된 개인정보는 개인정보 처리자로서 Vertex Corporation LTD(이하 \"주최자\")에 의해 처리됩니다." },
      { title: "2. 수집하는 개인정보 항목", content: "이벤트 등록 또는 진행 과정에서 다음과 같은 개인정보를 수집할 수 있습니다:\n- 식별 정보 (이름, 성)\n- 연락처 정보 (이메일 주소, 전화번호)\n- 참가 및 결제 정보 (티켓 및 결제 세부 사항)\n- 시각 및 청각 기록 (이벤트 중 촬영된 사진 및 영상)\n- 자발적으로 공유한 피드백 및 설문 데이터" },
      { title: "3. 사진 및 영상 촬영", content: "이벤트에 참가하는 모든 개인은 다음 조건에 동의한 것으로 간주됩니다:\n- 이벤트 장소에서 전체 또는 개인 촬영이 진행될 수 있습니다.\n- 주최자는 이 촬영물을 홍보, SNS 채널, 웹사이트 게시 및 아카이브 목적으로 사용할 수 있습니다." },
      { title: "4. 개인정보의 처리 목적", content: "수집된 개인정보는 참가 등록 관리, 비상 연락, 안전 확보, 서비스 개선 분석 등의 목적으로만 처리됩니다." },
      { title: "5. 개인정보의 제공 및 공유", content: "개인정보는 어떠한 경우에도 제3자에게 판매되지 않으며, 계약 이행을 위한 수탁업체 제공 또는 법적 의무가 발생하는 경우에만 공유됩니다." },
      { title: "6. 개인정보의 보유 기간", content: "개인정보는 이벤트 기간 및 법적 보존 기간 동안 보유하며, 목적 달성 후 안전하게 파기하거나 익명화합니다." },
      { title: "7. 참가자의 권리", content: "참가자는 개인정보 열람, 정정, 삭제(\"잊혀질 권리\"), 처리 제한을 요구할 권리가 있습니다." },
      { title: "8. 정책 변경", content: "주최자는 법령 개정 및 서비스 변경에 따라 본 방침을 변경할 권리를 보유합니다." }
    ],
    termsTitle: "이용약관",
    termsSub: "Vertex Corporation LTD 이벤트 참가 및 티켓 규정을 포함한 법적 계약입니다.",
    termsSections: [
      { title: "1. 일반 규칙 및 참가자 행동 수칙", content: "참가자는 주최자가 공지한 규칙을 준수해야 합니다. 안전과 질서를 해치는 참가자는 환불 없이 퇴장 조치될 수 있습니다." },
      { title: "2. 티켓 및 입장 조건", content: "티켓은 타인에게 양도하거나 재판매할 수 없습니다. 입장 시 본인 명의의 유효한 티켓을 제시해야 합니다." },
      { title: "3. 이벤트 변경 및 환불 규정", content: "이벤트는 취소되지 않습니다. 일정 및 장소는 변경될 수 있으며, 어떠한 경우에도 티켓 환불은 불가능합니다." },
      { title: "4. 책임의 한계", content: "이벤트 장소 내 귀중품 분실, 도난, 파손에 대해 Vertex 및 직원들은 책임을 지지 않습니다." },
      { title: "5. 지적 재산권", content: "이벤트 내 모든 콘텐츠와 디자인은 Vertex에 귀속됩니다. 주최자의 서면 승인 없이 무단 전재 또는 배포할 수 없습니다." },
      { title: "6. 프로그램 변경 권한", content: "주최자는 사전 통지 없이 일정, 연사 또는 파트너를 변경할 권리를 보유합니다." },
      { title: "7. 준거법 및 관할", content: "본 약관은 영국(잉글랜드) 법률의 적용을 받으며, 분쟁 시 잉글랜드 및 웨일스 법원을 전속 관할로 합니다." },
      { title: "8. 약관 개정", content: "본 약관은 필요 시 사전 통지 없이 변경될 수 있으며, 공지 즉시 효력이 발생합니다." },
      { title: "9. 동의 및 수락", content: "티켓 구매 또는 등록 완료 시 본 약관 및 개인정보처리방침의 모든 내용을 읽고 동의한 것으로 간주됩니다." }
    ]
  },
  zh: {
    privacyTitle: "隐私政策",
    privacySub: "适用于 Vertex Corporation LTD 举办的所有活动的隐私条款。",
    privacySections: [
      { title: "1. 数据控制者", content: "通过本网站和活动注册渠道收集的个人数据由 Vertex Corporation LTD（以下简称“主办方”）作为数据控制者进行处理。" },
      { title: "2. 收集的个人数据", content: "在注册或活动期间，可能会收集以下数据：\n- 身份信息（姓名）\n- 联系信息（电子邮件地址、电话号码）\n- 参与及交易信息（门票、付款详情）\n- 视听记录（活动期间拍摄的照片和视频）\n- 自愿分享的其他反馈和调查数据" },
      { title: "3. 照片和视频拍摄", content: "参加活动的每位个人均被视为接受以下条款：\n- 活动区域内可能会进行集体或个人照片及视频拍摄。\n- 主办方有权将这些视听材料用于宣传、社交媒体、网站发布 and 内部归档。" },
      { title: "4. 数据处理目的", content: "个人数据的处理仅用于：管理活动注册和门票、与参会者进行必要沟通、保障活动安全及提升服务质量。" },
      { title: "5. 数据共享与转让", content: "个人数据绝不会出售给第三方。仅在保密协议框架下与活动举办所必需的授权服务商共享，或与官方机构共享。" },
      { title: "6. 数据保留期限", content: "个人数据将在活动期间及法律规定的诉讼时效内保留。处理目的达成或法律保留期届满后，数据将被安全删除或匿名化。" },
      { title: "7. 参会者权利", content: "参会者有权申请访问、更正、删除（“被遗忘权”）或限制处理其个人数据。请联系主办方行使权利。" },
      { title: "8. 政策更新", content: "主办方保留随时根据法律法规或服务流程变化更新本隐私政策的权利。" }
    ],
    termsTitle: "条款和条件",
    termsSub: "包含 Vertex Corporation LTD 活动参会和门票规则的法律合同。",
    termsSections: [
      { title: "1. 一般规则和参会者行为", content: "所有参会者必须遵守主办方制定并公布的规则。扰乱秩序者可能会被驱逐出场且不予退票。" },
      { title: "2. 门票和入场条件", content: "门票为实名制，不可转让或转售。入场时必须出示以参会者姓名登记的有效门票。" },
      { title: "3. 活动变更与退款政策", content: "活动在任何情况下均不会取消；但时间、地点等可能变更。任何情况下均不予退款。" },
      { title: "4. 免责声明", content: "Vertex 对参会者在活动期间或在活动现场丢失、被盗或损坏的个人物品不承担任何责任。" },
      { title: "5. 知识产权", content: "活动范围内的所有内容、演示文稿和徽标均属于 Vertex。未经书面许可，不得复制或用于商业用途。" },
      { title: "6. 组织机构变更权", content: "主办方保留无需事先通知即可更改活动议程、演讲嘉宾或合作伙伴的权利。" },
      { title: "7. 适用法律与管辖权", content: "受英国（联合王国）法律管辖。因本合同引起的任何争议均由英格兰和威尔士法院专属管辖。" },
      { title: "8. 条款更新", content: "主办方可在必要时更新这些条款和条件，无需事先通知。变更自发布之日起生效。" },
      { title: "9. 接受", content: "购买门票或填写注册表即表示完全且不可撤销地接受本隐私政策及条款和条件的全部内容。" }
    ]
  },
  hi: {
    privacyTitle: "गोपनीयता नीति",
    privacySub: "Vertex Corporation LTD द्वारा आयोजित सभी कार्यक्रमों पर लागू होने वाले गोपनीयता नियम।",
    privacySections: [
      { title: "1. डेटा नियंत्रक", content: "इस वेबसाइट और पंजीकरण चैनलों के माध्यम से एकत्र किया गया व्यक्तिगत डेटा Vertex Corporation LTD (इसके बाद \"आयोजक\") द्वारा डेटा नियंत्रक के रूप में संसाधित किया जाता है।" },
      { title: "2. एकत्र किया गया व्यक्तिगत डेटा", content: "पंजीकरण या कार्यक्रम के दौरान निम्नलिखित श्रेणियों का डेटा एकत्र किया जा सकता है:\n- पहचान की जानकारी (नाम, उपनाम)\n- संपर्क जानकारी (ईमेल, फोन नंबर)\n- भागीदारी और लेनदेन विवरण (टिकट, भुगतान विवरण)\n- दृश्य-श्रव्य रिकॉर्डिंग (तस्वीरें और वीडियो)\n- स्वैच्छिक फीडबैक और सर्वेक्षण" },
      { title: "3. फोटो और वीडियो शूटिंग", content: "कार्यक्रम में भाग लेने वाले प्रत्येक व्यक्ति को निम्नलिखित शर्तों को स्वीकार करना माना जाएगा:\n- कार्यक्रम स्थल पर फोटो और वीडियो लिए जा सकते हैं।\n- आयोजक को इनका उपयोग प्रचार, सोशल मीडिया और अभिलेखागार के लिए करने का अधिकार है।" },
      { title: "4. डेटा प्रसंस्करण का उद्देश्य", content: "डेटा पंजीकरण प्रबंधित करने, सुरक्षा सुनिश्चित करने और सेवा की गुणवत्ता में सुधार करने के लिए संसाधित किया जाता है।" },
      { title: "5. डेटा साझाकरण", content: "डेटा कभी बेचा नहीं जाता है। इसे केवल अधिकृत सेवा प्रदाताओं के साथ या कानूनी आवश्यकता होने पर साझा किया जाता है।" },
      { title: "6. डेटा प्रतिधारण अवधि", content: "डेटा कार्यक्रम की अवधि और कानूनी सीमा अवधि तक सुरक्षित रखा जाता है।" },
      { title: "7. प्रतिभागी के अधिकार", content: "प्रतिभागियों को अपने डेटा तक पहुँचने, सुधारने, हटाने या प्रसंस्करण को सीमित करने का अधिकार है।" },
      { title: "8. नीति अपडेट", content: "आयोजक किसी भी समय इस नीति को अपडेट करने का अधिकार सुरक्षित रखता है।" }
    ],
    termsTitle: "नियम और शर्तें",
    termsSub: "Vertex Corporation LTD कार्यक्रमों के लिए टिकट और भागीदारी नियमों वाला कानूनी अनुबंध।",
    termsSections: [
      { title: "1. सामान्य नियम और आचरण", content: "सभी प्रतिभागियों को आयोजक द्वारा घोषित नियमों का पालन करना होगा। व्यवधान उत्पन्न करने वालों को बिना रिफंड के बाहर निकाला जा सकता है।" },
      { title: "2. टिकट और प्रवेश की शर्तें", content: "टिकट व्यक्तिगत हैं और इन्हें हस्तांतरित या बेचा नहीं जा सकता। प्रवेश के लिए वैध टिकट दिखाना अनिवार्य है।" },
      { title: "3. कार्यक्रम में बदलाव और रिफंड नीति", content: "कार्यक्रम रद्द नहीं किए जाएंगे, लेकिन तारीख, समय या स्थान बदला जा सकता है। किसी भी परिस्थिति में रिफंड नहीं दिया जाएगा।" },
      { title: "4. अस्वीकरण", content: "आयोजक व्यक्तिगत वस्तुओं के खोने, चोरी होने या क्षतिग्रस्त होने के लिए ज़िम्मेदार नहीं है।" },
      { title: "5. बौद्धिक संपदा", content: "सभी सामग्री, प्रस्तुतियाँ और लोगो Vertex की संपत्ति हैं। अनुमति के बिना प्रतिलिपि बनाना प्रतिबंधित है।" },
      { title: "6. संगठनात्मक परिवर्तन", content: "आयोजक बिना किसी पूर्व सूचना के वक्ताओं, भागीदारों या कार्यक्रम के प्रवाह को बदलने का अधिकार सुरक्षित रखता है।" },
      { title: "7. लागू कानून", content: "यह इंग्लैंड के कानूनों द्वारा शासित है। विवादों का निपटारा इंग्लैंड और वेल्स की अदालतों में किया जाएगा।" },
      { title: "8. शर्तों का अपडेट", content: "आयोजक बिना किसी पूर्व सूचना के इन नियमों और शर्तों को अपडेट कर सकता है।" },
      { title: "9. स्वीकृति", content: "टिकट खरीदने या पंजीकरण करने से प्रतिभागी इन सभी नियमों और शर्तों को स्वीकार करता है।" }
    ]
  },
  ar: {
    privacyTitle: "سياسة الخصوصية",
    privacySub: "شروط الخصوصية المعمول بها لجميع الفعاليات التي تنظمها شركة Vertex Corporation LTD.",
    privacySections: [
      { title: "1. مراقب البيانات", content: "يتم معالجة البيانات الشخصية التي يتم جمعها بواسطة Vertex Corporation LTD (المشار إليها فيما بعد بـ \"المنظم\") بصفتها مراقب البيانات." },
      { title: "2. البيانات الشخصية التي نجمعها", content: "قد نقوم بجمع البيانات التالية:\n- معلومات الهوية (الاسم واللقب)\n- معلومات الاتصال (البريد الإلكتروني، الهاتف)\n- تفاصيل المشاركة والدفع (التذكرة، المدفوعات)\n- الصور ومقاطع الفيديو الملتقطة أثناء الفعالية\n- استبيانات الرأي والتعليقات الطوعية" },
      { title: "3. التصوير الفوتوغرافي والفيديو", content: "يوافق كل مشارك على ما يلي:\n- يجوز التقاط صور وفيديوهات عامة أو فردية في الفعالية.\n- يحق للمنظم استخدامها للترويج وقنوات التواصل الاجتماعي والأرشيف." },
      { title: "4. الغرض من معالجة البيانات", content: "تُعالج البيانات لإدارة التسجيل، وضمان السلامة، وتحسين جودة الخدمات المقدمة." },
      { title: "5. مشاركة البيانات", content: "لا تباع البيانات للغير أبداً. تتم مشاركتها فقط مع مقدمي الخدمات المعتمدين لتنفيذ الفعالية أو بموجب القانون." },
      { title: "6. فترة الاحتفاظ بالبيانات", content: "تحفظ البيانات طوال فترة الفعالية ووفقاً لمدد التقادم القانوني المعمول بها." },
      { title: "7. حقوق المشاركين", content: "للمشاركين الحق في طلب الوصول إلى البيانات وتصحيحها ومحوها وتقييد معالجتها." },
      { title: "8. التحديثات", content: "يحتفظ المنظم بالحق في تحديث سياسة الخصوصية هذه في أي وقت." }
    ],
    termsTitle: "الشروط والأحكام",
    termsSub: "العقد القانوني الذي يحتوي على قواعد المشاركة والتذاكر لفعاليات Vertex.",
    termsSections: [
      { title: "1. القواعد العامة وسلوك المشاركين", content: "يجب على الجميع الالتزام بالقواعد. يمكن استبعاد أي شخص يخل بالنظام دون استرداد قيمة التذكرة." },
      { title: "2. التذاكر وشروط الدخول", content: "التذاكر شخصية ولا تنقل أو تباع للغير. يجب تقديم تذكرة صالحة عند الدخول." },
      { title: "3. تغييرات الفعالية وسياسة الاسترداد", content: "الفعاليات لا تلغى. يجوز للمنظم تغيير التاريخ أو الوقت أو المكان. لا يتم استرداد الأموال تحت أي ظرف." },
      { title: "4. إخلاء المسؤولية", content: "لا يتحمل المنظم المسؤولية عن ضياع أو سرقة أو تلف المتعلقات الشخصية للمشاركين." },
      { title: "5. الملكية الفكرية", content: "جميع المحتويات المعروضة تعود لشركة Vertex. يمنع نسخها أو توزيعها دون إذن خطي مسبق." },
      { title: "6. التغييرات التنظيمية", content: "يحفظ المنظم بالحق في تعديل البرنامج أو المتحدثين دون إشعار مسبق." },
      { title: "7. القانون المعمول به", content: "تخضع هذه الشروط لقوانين إنجلترا. ويكون لمحاكم إنجلترا وويلز اختصاص قضائي حصري." },
      { title: "8. تحديث الشروط", content: "يجوز للمنظم تحديث هذه الشروط والأحكام في أي وقت دون إشعار مسبق." },
      { title: "9. القبول والموافقة", content: "شراء التذكرة أو التسجيل يعني قبولاً كاملاً وغير قابل للإلغاء بجميع هذه الشروط." }
    ]
  },
  az: {
    privacyTitle: "Gizlilik Siyasəti",
    privacySub: "Vertex Corporation LTD tərəfindən təşkil edilən bütün tədbirlərə şamil olunan məxfilik qaydaları.",
    privacySections: [
      { title: "1. Məlumat Mühafizəçisi", content: "Toplanan fərdi məlumatlar məlumat mühafizəçisi qismində Vertex Corporation LTD (bundan sonra \"Təşkilatçı\") tərəfindən işlənilir." },
      { title: "2. Toplanan Fərdi Məlumatlar", content: "Aşağıdakı kateqoriyalar üzrə məlumatlar toplana bilər:\n- Şəxsiyyət məlumatları (Ad, soyad)\n- Əlaqə məlumatları (E-poçt, telefon nömrəsi)\n- İştirak və əməliyyat məlumatları (Bilet, ödəniş detalları)\n- Foto və video yazılar (Tədbir zamanı çəkilmiş)\n- Könüllü rəylər və sorğular" },
      { title: "3. Foto və Video Çəkilişi", content: "Tədbirdə iştirak edən hər kəs aşağıdakıları qəbul edir:\n- Tədbir məkanında ümumi və ya fərdi çəkilişlər aparıla bilər.\n- Təşkilatçı bu materiallardan təqdimat, sosial media və arxiv məqsədləri üçün istifadə edə bilər." },
      { title: "4. Məlumatların İşlənmə Məqsədi", content: "Fərdi məlumatlar yalnız qeydiyyat, bilet satışı, təhlükəsizlik və xidmət keyfiyyətinin artırılması məqsədilə işlənilir." },
      { title: "5. Məlumatların Paylaşılması", content: "Məlumatlar heç bir halda üçüncü şəxslərə satılmır. Yalnız təşkilati tərəfdaşlarla və ya qanunvericiliyin tələbi ilə paylaşıla bilər." },
      { title: "6. Məlumatların Saxlanma Müddəti", content: "Məlumatlar tədbir müddətində və qanunla müəyyən edilmiş iddia müddəti ərzində saxlanılır." },
      { title: "7. İştirakçının Hüquqları", content: "İştirakçıların məlumatlara daxil olmaq, düzəliş etmək, silmək (\"Unudulmaq hüququ\") və məhdudlaşdırmaq hüququ var." },
      { title: "8. Siyasətin Yenilənməsi", content: "Təşkilatçı bu Gizlilik Siyasətini istənilən vaxt yeniləmək hüququnu saxlayır." }
    ],
    termsTitle: "Şərtlər və Qaydalar",
    termsSub: "Vertex Corporation LTD tədbirlərində iştirak və bilet qaydalarını ehtiva edən hüquqi müqavilə.",
    termsSections: [
      { title: "1. Ümumi Qaydalar və Davranışlar", content: "Hər kəs elan edilmiş qaydalara riayət etməlidir. Qaydaları pozanlar geri ödəniş edilmədən məkandan çıxarıla bilər." },
      { title: "2. Bilet və Giriş Şərtləri", content: "Biletlər şəxsidir və ötürülə bilməz. Girişdə etibarlı biletin təqdim olunması məcburidir." },
      { title: "3. Tədbir Dəyişiklikləri və Geri Ödəniş", content: "Tədbirlər ləğv edilmir. Tarix, saat və məkan dəyişdirilə bilər. Geri ödəniş edilmir." },
      { title: "4. Məsuliyyətdən İmtina", content: "Təşkilatçı itirilmiş, oğurlanmış və ya zədələnmiş şəxsi əşyalara görə məsuliyyət daşımır." },
      { title: "5. Əqli Mülkiyyət", content: "Bütün təqdimatlar, dizaynlar və loqolar Vertex-ə məxsusdur. Yazılı icazə olmadan istifadəsi qadağandır." },
      { title: "6. Təşkilati Dəyişiklik Hüququ", content: "Təşkilatçı spikerləri və proqramı əvvəlcədən xəbərdarlıq etmədən dəyişdirə bilər." },
      { title: "7. Tətbiq Olunan Hüquq", content: "İngiltərə qanunları ilə tənzimlənir. Mübahisələrə İngiltərə və Uels məhkəmələrində baxılır." },
      { title: "8. Şərtlər və Qaydaların Yenilənməsi", content: "Şərtlər əvvəlcədən bildirilmədən yenilənə bilər. Dəyişikliklər dərc edildiyi andan qüvvəyə minir." },
      { title: "9. Qəbul və Təsdiq", content: "Bilet almaq və ya qeydiyyatdan keçmək bu Şərtlər və Qaydaları tam və geri dönməz şəkildə qəbul etmək deməkdir." }
    ]
  }
};

function formatContent(content) {
  const lines = content.split('\n');
  let inList = false;
  let html = '';
  
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('- ')) {
      if (!inList) {
        html += '<ul style="margin-left: 25px; padding-left: 10px; margin-bottom: 16px;">\n';
        inList = true;
      }
      html += `  <li style="margin-bottom: 8px;">${trimmed.substring(2)}</li>\n`;
    } else {
      if (inList) {
        html += '</ul>\n';
        inList = false;
      }
      if (trimmed.length > 0) {
        html += `<p style="margin: 16px 0; line-height: 1.7;">${trimmed}</p>\n`;
      }
    }
  });
  
  if (inList) {
    html += '</ul>\n';
  }
  
  return html;
}

// 1. Update translations.js
const translationsPath = path.join(__dirname, 'translations.js');
let translationsContent = fs.readFileSync(translationsPath, 'utf8');

LANGUAGES.forEach(lang => {
  const termsText = LEGAL_DATA[lang].termsTitle;
  
  // Create regex pattern to replace "footer-link-terms": "..." for this language
  const regex = new RegExp(`(${lang}:\\s*{[\\s\\S]*?"footer-link-terms":\\s*")[^"]+(")`, 'g');
  translationsContent = translationsContent.replace(regex, `$1${termsText}$2`);
});

fs.writeFileSync(translationsPath, translationsContent, 'utf8');
console.log('Updated translations.js successfully with new Terms and Conditions keys.');

// 2. Loop over language directories and compile privacy.html and terms.html
LANGUAGES.forEach(lang => {
  const langDir = path.join(__dirname, '..', lang);
  const indexHtmlPath = path.join(langDir, 'index.html');
  
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn(`File not found: ${indexHtmlPath}`);
    return;
  }
  
  let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
  
  // Re-write footer legal links in index.html
  const legalLinksRegex = /<div class="footer-legal-links">([\s\S]*?)<\/div>/;
  const privacyText = LEGAL_DATA[lang].privacyTitle;
  const termsText = LEGAL_DATA[lang].termsTitle;
  
  const updatedLegalLinks = `<div class="footer-legal-links">\n          <a href="privacy.html" data-i18n="footer-link-privacy">${privacyText}</a>\n          <a href="terms.html" data-i18n="footer-link-terms">${termsText}</a>\n        </div>`;
  
  indexHtml = indexHtml.replace(legalLinksRegex, updatedLegalLinks);
  fs.writeFileSync(indexHtmlPath, indexHtml, 'utf8');
  console.log(`Updated footer links in ${lang}/index.html`);
  
  // Extract head elements
  const headMatch = indexHtml.match(/<head>([\s\S]*?)<\/head>/);
  if (!headMatch) return;
  let headContent = headMatch[1];
  
  // Clean titles & tags for search engine consistency
  headContent = headContent.replace(/<title>[\s\S]*?<\/title>/, `<title>${privacyText} | Vertex Events</title>`);
  headContent = headContent.replace(/<meta property="og:title"[\s\S]*?>/, `<meta property="og:title" content="${privacyText} | Vertex Events">`);
  
  // Inject internal CSS specifically matching vertexishere.com/privacy-policy
  const styleInjection = `
  <style>
    :root {
      --background-color: #f4f7f9;
      --content-bg-color: #ffffff;
      --text-primary-color: #1a202c;
      --text-secondary-color: #4a5568;
      --link-color: #3182ce;
      --link-hover-color: #2b6cb0;
      --shadow-color: rgba(0, 0, 0, 0.05);
      --triangle-color: rgba(0, 0, 0, 0.04);
      --warning-bg-color: #fffaf0;
      --warning-border-color: #f6e05e;
      --border-color: #e2e8f0;
    }

    [data-theme="dark"] {
      --background-color: #050505;
      --content-bg-color: #0c0c0d;
      --text-primary-color: #f4f4f5;
      --text-secondary-color: #a1a1aa;
      --link-color: #60a5fa;
      --link-hover-color: #93c5fd;
      --shadow-color: rgba(0, 0, 0, 0.4);
      --triangle-color: rgba(255, 255, 255, 0.03);
      --warning-bg-color: #1c1917;
      --warning-border-color: #ca8a04;
      --border-color: #27272a;
    }

    html, body {
      background-color: var(--background-color) !important;
      color: var(--text-primary-color) !important;
      transition: background-color 0.3s ease, color 0.3s ease;
    }

    .legal-container {
      max-width: 900px;
      margin: 50px auto;
      background: var(--content-bg-color);
      padding: 50px;
      border-radius: 12px;
      box-shadow: 0 10px 30px var(--shadow-color);
      border: 1px solid var(--border-color);
      position: relative;
      z-index: 5;
      opacity: 0;
      transform: translateY(30px);
      animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

    .legal-container h1 {
      text-align: center;
      font-size: 2.6em;
      font-weight: 800;
      margin-bottom: 10px;
      letter-spacing: -1px;
      color: var(--text-primary-color);
    }

    .legal-container h2 {
      font-size: 1.7em;
      margin-top: 40px;
      padding-bottom: 10px;
      border-bottom: 2px solid var(--border-color);
      color: var(--text-primary-color);
      letter-spacing: -0.5px;
    }

    .legal-container p,
    .legal-container ul,
    .legal-container li {
      color: var(--text-secondary-color);
      font-size: 1.05em;
    }

    .legal-container p {
      margin: 20px 0;
    }

    .legal-container ul {
      margin-left: 25px;
      padding-left: 10px;
    }

    .legal-container li {
      margin-bottom: 12px;
    }

    .legal-container a {
      color: var(--link-color);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }

    .legal-container a:hover {
      color: var(--link-hover-color);
      text-decoration: underline;
    }

    .disclaimer {
      background-color: var(--warning-bg-color);
      border-left: 4px solid var(--warning-border-color);
      padding: 20px;
      margin-top: 25px;
      border-radius: 6px;
      transition: background-color 0.3s ease, border-color 0.3s ease;
    }

    .disclaimer p {
      margin: 10px 0;
      color: var(--text-secondary-color);
    }
    
    .disclaimer p:first-child {
      margin-top: 0;
    }
    
    .disclaimer p:last-child {
      margin-bottom: 0;
    }

    .triangles {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
      pointer-events: none;
    }

    .triangles li {
      position: absolute;
      display: block;
      list-style: none;
      width: 20px;
      height: 20px;
      background: var(--triangle-color);
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
      animation: triangleAnimate 25s linear infinite;
      bottom: -180px;
    }

    .triangles li:nth-child(1) { left: 25%; width: 80px; height: 80px; animation-delay: 0s; }
    .triangles li:nth-child(2) { left: 10%; width: 20px; height: 20px; animation-delay: 2s; animation-duration: 12s; }
    .triangles li:nth-child(3) { left: 70%; width: 20px; height: 20px; animation-delay: 4s; }
    .triangles li:nth-child(4) { left: 40%; width: 60px; height: 60px; animation-delay: 0s; animation-duration: 18s; }
    .triangles li:nth-child(5) { left: 65%; width: 20px; height: 20px; animation-delay: 0s; }
    .triangles li:nth-child(6) { left: 75%; width: 110px; height: 110px; animation-delay: 3s; }
    .triangles li:nth-child(7) { left: 35%; width: 150px; height: 150px; animation-delay: 7s; }
    .triangles li:nth-child(8) { left: 50%; width: 25px; height: 25px; animation-delay: 15s; animation-duration: 45s; }
    .triangles li:nth-child(9) { left: 20%; width: 15px; height: 15px; animation-delay: 2s; animation-duration: 35s; }
    .triangles li:nth-child(10) { left: 85%; width: 150px; height: 150px; animation-delay: 0s; animation-duration: 11s; }

    @keyframes triangleAnimate {
      0% { transform: translateY(0) rotate(0deg); opacity: 1; border-radius: 0; }
      100% { transform: translateY(-120vh) rotate(720deg); opacity: 0; border-radius: 50%; }
    }

    @keyframes fadeInUp {
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 768px) {
      .legal-container {
        padding: 30px;
        margin: 40px 16px;
      }
      .legal-container h1 { font-size: 2.1em; }
      .legal-container h2 { font-size: 1.4em; }
    }
  </style>
  `;
  
  headContent = headContent + styleInjection;
  
  // Statically define geometric background glows
  const geoBgContent = `
  <div class="geo-bg">
    <div class="geo-blob geo-blob-1"></div>
    <div class="geo-blob geo-blob-2"></div>
    <div class="geo-blob geo-blob-3"></div>
  </div>
  `;
  
  const triangleMarkup = `
  <ul class="triangles">
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
    <li></li>
  </ul>
  `;
  
  // ----------------- GENERATE PRIVACY POLICY -----------------
  let privacyBodyHtml = `
    ${triangleMarkup}
    <div class="legal-container">
      <h1>${privacyText}</h1>
      <p style="text-align: center; font-style: italic; color: var(--text-secondary-color); margin-top: 5px; margin-bottom: 30px;">${LEGAL_DATA[lang].privacySub}</p>
  `;
  
  LEGAL_DATA[lang].privacySections.forEach(sec => {
    const isDisclaimer = sec.title.toLowerCase().includes('disclaimer') || 
                         sec.title.toLowerCase().includes('sorumluluk reddi') || 
                         sec.title.toLowerCase().includes('haftungsausschluss') || 
                         sec.title.toLowerCase().includes('exclusión de responsabilidad') ||
                         sec.title.toLowerCase().includes('limitation de responsabilité') ||
                         sec.title.toLowerCase().includes('esclusione di responsabilità') ||
                         sec.title.toLowerCase().includes('isenção de responsabilidade') ||
                         sec.title.toLowerCase().includes('условия и положения') ||
                         sec.title.toLowerCase().includes('免責事項') ||
                         sec.title.toLowerCase().includes('책임의 한계') ||
                         sec.title.toLowerCase().includes('免责声明') ||
                         sec.title.toLowerCase().includes('yasal') ||
                         sec.title.toLowerCase().includes('legal') ||
                         sec.title.toLowerCase().includes('sharing') ||
                         sec.title.toLowerCase().includes('paylaşımı');
                         
    const formattedContent = formatContent(sec.content);
    
    if (isDisclaimer) {
      privacyBodyHtml += `
      <h2>${sec.title}</h2>
      <div class="disclaimer">
        ${formattedContent}
      </div>
      `;
    } else {
      privacyBodyHtml += `
      <h2>${sec.title}</h2>
      ${formattedContent}
      `;
    }
  });
  
  privacyBodyHtml += `
    </div>
  `;
  
  const finalPrivacyHtml = `<!DOCTYPE html>
<html lang="${lang}" data-theme="dark">
<head>
  ${headContent}
</head>
<body>
  ${geoBgContent}
  <main>
    ${privacyBodyHtml}
  </main>
</body>
</html>`;
  
  fs.writeFileSync(path.join(langDir, 'privacy.html'), finalPrivacyHtml, 'utf8');
  console.log(`Generated: ${lang}/privacy.html`);
  
  // ----------------- GENERATE TERMS AND CONDITIONS -----------------
  let termsBodyHtml = `
    ${triangleMarkup}
    <div class="legal-container">
      <h1>${termsText}</h1>
      <p style="text-align: center; font-style: italic; color: var(--text-secondary-color); margin-top: 5px; margin-bottom: 30px;">${LEGAL_DATA[lang].termsSub}</p>
  `;
  
  LEGAL_DATA[lang].termsSections.forEach(sec => {
    const isDisclaimer = sec.title.toLowerCase().includes('disclaimer') || 
                         sec.title.toLowerCase().includes('sorumluluk reddi') || 
                         sec.title.toLowerCase().includes('haftungsausschluss') || 
                         sec.title.toLowerCase().includes('exclusión de responsabilidad') ||
                         sec.title.toLowerCase().includes('limitation de responsabilité') ||
                         sec.title.toLowerCase().includes('esclusione di responsabilità') ||
                         sec.title.toLowerCase().includes('isenção de responsabilidade') ||
                         sec.title.toLowerCase().includes('условия и положения') ||
                         sec.title.toLowerCase().includes('免責事項') ||
                         sec.title.toLowerCase().includes('책임의 한계') ||
                         sec.title.toLowerCase().includes('免责声明');
                         
    const formattedContent = formatContent(sec.content);
    
    if (isDisclaimer) {
      termsBodyHtml += `
      <h2>${sec.title}</h2>
      <div class="disclaimer">
        ${formattedContent}
      </div>
      `;
    } else {
      termsBodyHtml += `
      <h2>${sec.title}</h2>
      ${formattedContent}
      `;
    }
  });
  
  termsBodyHtml += `
    </div>
  `;
  
  let termsHeadContent = headMatch[1];
  termsHeadContent = termsHeadContent.replace(/<title>[\s\S]*?<\/title>/, `<title>${termsText} | Vertex Events</title>`);
  termsHeadContent = termsHeadContent.replace(/<meta property="og:title"[\s\S]*?>/, `<meta property="og:title" content="${termsText} | Vertex Events">`);
  termsHeadContent = termsHeadContent + styleInjection;
  
  const finalTermsHtml = `<!DOCTYPE html>
<html lang="${lang}" data-theme="dark">
<head>
  ${termsHeadContent}
</head>
<body>
  ${geoBgContent}
  <main>
    ${termsBodyHtml}
  </main>
</body>
</html>`;
  
  fs.writeFileSync(path.join(langDir, 'terms.html'), finalTermsHtml, 'utf8');
  console.log(`Generated: ${lang}/terms.html`);
});

console.log('Legal pages generation complete.');
