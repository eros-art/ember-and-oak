/* ==========================================================
   Ember & Oak Coffee — i18n.js
   Language switching, translation dictionaries, locale-aware
   helpers.  Exposes window.EOI18n.
   Loading order: data.js → data-tr.js → i18n.js → script.js
   ========================================================== */
(function () {
  'use strict';

  const LANG_KEY = 'eo-lang';
  const SUPPORTED = ['en', 'tr'];

  /* ---------- resolve stored language ---------- */
  let lang = localStorage.getItem(LANG_KEY);
  if (!SUPPORTED.includes(lang)) lang = 'en';

  /* ===========================================================
     DICTIONARIES
     =========================================================== */
  const dict = {

    /* ---------- English (base) ---------- */
    en: {
      /* nav */
      'nav.home': 'Home', 'nav.about': 'About', 'nav.menu': 'Menu', 'nav.contact': 'Contact',
      'nav.login': 'Login', 'nav.orderNow': 'Order Now', 'nav.viewCart': 'View Cart',
      'nav.openCart': 'Open cart', 'nav.openMenu': 'Open menu',

      /* hero */
      'hero.eyebrow': '— Small batch. Slow brewed. —',
      'hero.title': 'Coffee that feels<br /><em>like coming home.</em>',
      'hero.sub': 'Single-origin beans roasted in-house, pastries baked at dawn, and a corner seat with your name on it.',
      'hero.chip1': 'Open today · 7am – 8pm',
      'hero.chip2': '★ 4.9 · 320+ reviews',
      'hero.chip3': 'Plant-based milks free',
      'hero.cta1': 'Explore the Menu',
      'hero.cta2': 'Find Us',
      'hero.scroll': 'Scroll to menu',
      'hero.scrollLabel': 'Scroll',

      /* stats */
      'stat.years': 'Years roasting',
      'stat.farms': 'Single-origin farms',
      'stat.ethical': 'Ethically sourced',
      'stat.rating': 'Average rating',

      /* about */
      'about.eyebrow': '— Our Story —',
      'about.title': 'A small cafe with<br /><em>big standards.</em>',

      /* menu */
      'menu.eyebrow': '— Our Menu —',
      'menu.title': 'Crafted with care,<br /><em>served warm.</em>',
      'menu.sub': 'From pour-overs pulled by hand to flaky morning pastries — every item on our menu is made from scratch, every single day.',
      'menu.filterAll': 'Everything',
      'menu.filterCoffee': 'Coffee',
      'menu.filterSpecialty': 'Specialty',
      'menu.filterFood': 'Food',
      'menu.soldOut': 'Sold out',
      'menu.soldOutOverlay': 'Sold Out',
      'menu.addToCart': 'Add to cart',
      'menu.viewDetails': 'View item details',

      /* stores */
      'stores.eyebrow': '— Four Locations —',
      'stores.title': 'Find your nearest<br /><em>corner.</em>',
      'stores.sub': 'Four neighborhood cafes, each with its own character — but the same beans, the same recipes, and the same warm hello at the door.',
      'stores.orderFrom': 'Order from this store →',
      'stores.prev': 'Previous store',
      'stores.next': 'Next store',
      'stores.show': 'Show',

      /* reviews */
      'reviews.eyebrow': '— Kind Words —',
      'reviews.title': 'From our regulars.',
      'reviews.prev': 'Previous review',
      'reviews.next': 'Next review',
      'reviews.goTo': 'Go to review',

      /* visit */
      'visit.eyebrow': '— Visit Us —',
      'visit.title': 'Find your corner.',
      'visit.sub': 'Tucked between the bookstore and the old oak on Maple Street. Free wifi, plenty of outlets, and a window seat if you ask nicely.',
      'visit.address': 'Address',
      'visit.hours': 'Hours',
      'visit.phone': 'Phone',
      'visit.email': 'Email',

      /* contact */
      'contact.eyebrow': '— Say Hello —',
      'contact.title': 'Drop us a line.',
      'contact.sub': 'Catering, private events, wholesale beans, or just a quick hello — we\'d love to hear from you.',
      'contact.note': 'We typically reply within a few hours.',
      'contact.nameLabel': 'Your name',
      'contact.emailLabel': 'Email',
      'contact.topicLabel': 'What\'s it about?',
      'contact.messageLabel': 'Message',
      'contact.namePlaceholder': 'Jane Doe',
      'contact.emailPlaceholder': 'jane@example.com',
      'contact.topicDefault': 'Pick one…',
      'contact.topic0': 'Just saying hi',
      'contact.topic1': 'Catering inquiry',
      'contact.topic2': 'Private event',
      'contact.topic3': 'Wholesale beans',
      'contact.topic4': 'Press / collaboration',
      'contact.msgPlaceholder': 'Tell us a little about it…',
      'contact.submit': 'Send message',
      'contact.legalNote': 'Submitting sends your name, e-mail and message to',
      'contact.privacy': 'Privacy Policy',
      'contact.success': 'Thanks! Your message is on its way. We\'ll be in touch soon.',
      'contact.error': 'Something went wrong. Please try again or email us directly.',
      'contact.errName': 'Please enter your name',
      'contact.errEmail': 'Please enter a valid email',
      'contact.errTopic': 'Please pick a topic',
      'contact.errMsg': 'Message should be at least 10 characters',

      /* footer */
      'footer.tagline': 'Brewed with intention · Portland, OR',
      'footer.social': 'Social links',
      'footer.legal': 'Legal documents',
      'footer.legalCentre': 'Legal Centre',
      'footer.privacy': 'Privacy Policy',
      'footer.cookies': 'Cookie Policy',
      'footer.terms': 'Terms of Use',
      'footer.returns': 'Returns & Refunds',
      'footer.copy': '© 2026 Ember & Oak. All rights reserved.',
      'footer.top': 'Back to top',

      /* item modal */
      'modal.close': 'Close',
      'modal.fromMenu': '— From the menu —',
      'modal.pickup': 'Choose pickup location',
      'modal.pickStore': 'Pick a store to continue.',
      'modal.pickupAt': 'Pickup at',
      'modal.continue': 'Continue to payment',
      'modal.item': 'Item',
      'modal.at': 'at',
      'modal.storeDefault': 'store',
      'modal.summaryItem': 'Item',
      'modal.summaryPickup': 'Pickup at',
      'modal.summaryTotal': 'Total',
      'modal.qrComing': 'Payment QR code, coming soon',
      'modal.qrSoon': 'SOON',
      'modal.qrPay': 'QR Pay',
      'modal.qrCaption': 'Scan to pay · Coming Soon',
      'modal.payNote': '📱 QR payments are rolling out to all locations soon. We\'ll email you the moment yours is ready.',
      'modal.back': '← Back',
      'modal.done': 'Done',

      /* cart */
      'cart.title': 'Your cart',
      'cart.close': 'Close cart',
      'cart.empty': 'Your cart is empty',
      'cart.emptySub': 'Add a drink or pastry from the menu to get started.',
      'cart.browse': 'Browse menu',
      'cart.subtotal': 'Subtotal',
      'cart.taxNote': 'Taxes and pickup time calculated at the counter.',
      'cart.checkout': 'Checkout',
      'cart.remove': 'Remove',
      'cart.decQty': 'Decrease quantity',
      'cart.incQty': 'Increase quantity',
      'cart.pickupAt': 'Pickup at ',

      /* checkout */
      'checkout.eyebrow': '— Checkout —',
      'checkout.title': 'A few details',
      'checkout.sub': 'Your order will be ready in about 15–20 minutes.',
      'checkout.name': 'Name',
      'checkout.phone': 'Phone',
      'checkout.address': 'Pickup address',
      'checkout.store': 'Store',
      'checkout.when': 'When',
      'checkout.namePlaceholder': 'Jane Doe',
      'checkout.phonePlaceholder': '(555) 123-4567',
      'checkout.addrPlaceholder': '123 Main St',
      'checkout.asap': 'As soon as it\'s ready',
      'checkout.in15': 'In 15 minutes',
      'checkout.in30': 'In 30 minutes',
      'checkout.in45': 'In 45 minutes',
      'checkout.in60': 'In 1 hour',
      'checkout.notes': 'Notes',
      'checkout.optional': '(optional)',
      'checkout.notesPlaceholder': 'Extra foam, less sugar, etc.',
      'checkout.items': 'Items',
      'checkout.total': 'Total',
      'checkout.placeOrder': 'Place order',
      'checkout.legalText': 'By placing this order you accept the',
      'checkout.and': 'and',
      'checkout.distanceContract': 'Distance Selling Contract',
      'checkout.returnPolicy': 'Return & Refund Policy',
      'checkout.orderPlaced': 'Order placed',
      'checkout.thanks': 'Thanks! Your order',
      'checkout.preparing': 'is being prepared.',
      'checkout.keepBrowsing': 'Keep browsing',
      'checkout.summaryPickup': 'Pickup at',
      'checkout.errName': 'Please enter your name',
      'checkout.errPhone': 'Please enter a valid phone',
      'checkout.errAddress': 'Please enter a pickup address',
      'checkout.errStore': 'Please choose a store',
      'checkout.email': 'Email',
      'checkout.emailPlaceholder': 'you@example.com',
      'checkout.errEmail': 'Enter a valid email to pay online',
      'checkout.payTitle': 'One last step',
      'checkout.paySub': 'Your order is placed. Choose how to pay.',
      'checkout.payNow': 'Pay now (QR / card)',
      'checkout.payAtPickup': 'Pay at pickup',
      'checkout.payError': 'Online payment isn\'t available right now — you can pay at pickup.',
      'checkout.payRetry': 'Try again',
      'checkout.payWait': 'Waiting for payment…',
      'checkout.payDoneManual': 'I\'ve finished paying — continue',
      'checkout.payAtPickupNote': 'You\'ll pay when you pick up your order.',
      'checkout.paidOnline': 'Paid online',
      'checkout.payUnavailable': 'Online payment unavailable — you\'ll pay at pickup.',

      /* auth */
      'auth.loginTab': 'Login',
      'auth.signupTab': 'Sign up',
      'auth.loginEyebrow': '— Welcome back —',
      'auth.loginTitle': 'Log in to your account',
      'auth.signupEyebrow': '— Join us —',
      'auth.signupTitle': 'Create an account',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.name': 'Name',
      'auth.phone': 'Phone number',
      'auth.loginBtn': 'Log in',
      'auth.signupBtn': 'Create account',
      'auth.forgot': 'Forgot password?',
      'auth.emailPlaceholder': 'you@example.com',
      'auth.passPlaceholder': '••••••••',
      'auth.namePlaceholder': 'Jane Doe',
      'auth.phonePlaceholder': '(503) 555-0123',
      'auth.passMinPlaceholder': '8+ characters',
      'auth.legalSignup': 'Creating an account means you accept the',
      'auth.and': 'and',
      'auth.marketingNote': 'For marketing messages we ask separately.',
      'auth.alreadyAccount': 'Already have an account? Log in',
      'auth.errEmail': 'Enter your email',
      'auth.errPass': 'Enter your password',
      'auth.errName': 'Enter your name (2+ chars)',
      'auth.errEmailValid': 'Enter a valid email',
      'auth.errPassLen': 'Password must be 8+ characters',
      'auth.errResetEmail': 'Enter your email above first',
      'auth.resetSent': 'Password reset link sent — check your email.',
      'auth.notConfigured': 'Auth is not configured.',
      'auth.loggedIn': 'Logged in',

      /* cookie banner */
      'cookie.heading': 'Your privacy',
      'cookie.body': 'We use essential browser storage so the cart, login and orders work. We don\'t currently use advertising or analytics cookies — any optional cookies we may add will only run with your consent.',
      'cookie.policy': 'Cookie Policy',
      'cookie.privacy': 'Privacy Policy',
      'cookie.accept': 'Accept',
      'cookie.decline': 'Decline',

      /* misc */
      'misc.darkMode': 'Toggle dark mode',
      'misc.itemDefault': 'Item',

      /* 404 page */
      '404.steam': "This one's decaf.",
      '404.title': 'Page not found',
      '404.sub': "Looks like this cup's already empty. The page you're looking for doesn't exist — but the good stuff is right this way.",
      '404.goHome': 'Back to home',
      '404.browseMenu': 'Browse the menu',

      /* pickup time labels (for order summary) */
      'time.asap': 'as soon as it\'s ready',
      'time.15': 'in 15 minutes',
      'time.30': 'in 30 minutes',
      'time.45': 'in 45 minutes',
      'time.60': 'in 1 hour',

      /* admin */
      'admin.orders': 'Live Orders',
      'admin.menu': 'Menu Manager',
      'admin.sales': 'Sales Summary',
      'admin.logout': 'Log out',
      'admin.refresh': 'Refresh',
      'admin.resetAll': 'Reset all overrides',
      'admin.noOrders': 'No orders yet',
      'admin.noOrdersSub': 'New orders will appear here the moment a customer checks out.',
      'admin.noMenu': 'No menu items',
      'admin.noSales': 'No sales yet',
      'admin.markDone': 'Mark done',
      'admin.cancel': 'Cancel',
      'admin.reopen': 'Reopen',
      'admin.paid': 'Paid',
      'admin.unpaid': 'Unpaid',
      'admin.item': 'item',
      'admin.items': 'items',
      'admin.totalRevenue': 'Total revenue',
      'admin.totalOrders': 'Total orders',
      'admin.revenueByStore': 'Revenue by store',
      'admin.store': 'Store',
      'admin.ordersCol': 'Orders',
      'admin.revenue': 'Revenue',
      'admin.itemCol': 'Item',
      'admin.qty': 'Qty',
      'admin.liveOrders': 'live orders',
      'admin.sampleData': 'sample data (no real orders yet)',
      'admin.localStorage': 'orders from localStorage',
      'admin.dataCloud': 'Data source: Supabase (cloud)',
      'admin.dataLocal': 'Data source: local seed',
      'admin.clickToEdit': 'click to edit',
      'admin.enterToSave': 'enter to save / esc to cancel',
      'admin.edited': 'edited',
      'admin.reset': 'reset',
      'admin.addonName': 'Add-on / extra name',
      'admin.priceNet': 'Price (net)',
      'admin.appliesTo': 'Applies to',
      /* admin login */
      'admin.baristaOnly': "Barista's only",
      'admin.crumb': 'Ember & Oak · Coffee Admin',
      'admin.loginTitle': 'Admin Login',
      'admin.loginSub': 'Sign in to manage orders, the menu, and sales.',
      'admin.email': 'Email',
      'admin.password': 'Password',
      'admin.signIn': 'Sign in',
      'admin.forgotPw': 'Forgot password?',
      'admin.backWebsite': '← Back to website',
      'admin.backLogin': '← Back to login',
      'admin.enterEmail': 'Please enter your email.',
      'admin.enterPassword': 'Please enter your password.',
      'admin.unableSignIn': 'Unable to sign in.',
      /* admin reset */
      'admin.resetTitle': 'Set a New Password',
      'admin.checkingReset': 'Checking your reset link…',
      'admin.invalidReset': 'This reset link is invalid or has expired. Request a new one from the login page.',
      'admin.newPassword': 'New password',
      'admin.newPassPlaceholder': 'At least 6 characters',
      'admin.confirmPassword': 'Confirm new password',
      'admin.confirmPassPlaceholder': 'Repeat your password',
      'admin.updatePassword': 'Update password',
      'admin.pwMinLength': 'Password must be at least 6 characters.',
      'admin.pwNoMatch': 'Passwords do not match.',
      'admin.unableUpdate': 'Unable to update password.',
      'admin.pwUpdated': 'Password updated — sign in with your new password.',
      'admin.resetSentMsg': 'Password reset link sent — check your email.',
      'admin.enterEmailFirst': 'Enter your email above, then click forgot password.',
      /* admin dashboard dynamic */
      'admin.menuSub': 'The customer menu (data.js) didn\'t load. Open the site in another tab first.',
      'admin.soldOutBadge': 'Sold out',
      'admin.noStoreData': 'No store data.',
      'admin.noItemsSold': 'No items sold yet.',
      'admin.nonCancelled': 'non-cancelled order',
      'admin.nonCancelledPlural': 'non-cancelled orders',
      'admin.cancelled': 'cancelled',
      'admin.sampleDataShort': 'sample data',
      'admin.liveData': 'live data',
      'admin.localData': 'local data',
      'admin.noDataYet': 'No data yet — sample orders appear when storage is empty.',
      'admin.byQuantity': 'by quantity sold',
      'admin.avgOrder': 'Avg order',
      'admin.topItems': 'Top selling items',
      'admin.today': 'Today',
      'admin.thisWeek': 'This week',
      'admin.thisMonth': 'This month',
      'admin.allTime': 'All time',
      'admin.paidOrders': 'paid',
      'admin.unpaidOrders': 'unpaid',
      'admin.cancelledOrders': 'cancelled',
      'admin.share': 'share',
      'admin.noRevenue': 'No revenue data',
    },

    /* ---------- Turkish ---------- */
    tr: {
      /* nav */
      'nav.home': 'Ana Sayfa', 'nav.about': 'Hakkimizda', 'nav.menu': 'Menu', 'nav.contact': 'Iletisim',
      'nav.login': 'Giris Yap', 'nav.orderNow': 'Siparis Ver', 'nav.viewCart': 'Sepeti Gor',
      'nav.openCart': 'Sepeti ac', 'nav.openMenu': 'Menuyu ac',

      /* hero */
      'hero.eyebrow': '— Kucuk partiler. Yavas demlenmis. —',
      'hero.title': 'Eve donmus gibi<br /><em>hissettiren kahve.</em>',
      'hero.sub': 'Ic mekanda kavrulmus tek kokenli cekirdekler, sabah erken pisirilmis tatlilar ve sizin adiniza ayrilmis bir kose koltuk.',
      'hero.chip1': 'Bugun acik · 7:00 – 20:00',
      'hero.chip2': '★ 4.9 · 320+ yorum',
      'hero.chip3': 'Bitki bazli sutler ucretsiz',
      'hero.cta1': 'Menuyu Kesfet',
      'hero.cta2': 'Bizi Bul',
      'hero.scroll': 'Menuye git',
      'hero.scrollLabel': 'Asagi',

      /* stats */
      'stat.years': 'Yillik kavuruculuk',
      'stat.farms': 'Tek kokenli ciftlik',
      'stat.ethical': 'Etik temin',
      'stat.rating': 'Ortalama puan',

      /* about */
      'about.eyebrow': '— Hikayemiz —',
      'about.title': 'Kucuk bir kafe,<br /><em>buyuk standartlar.</em>',

      /* menu */
      'menu.eyebrow': '— Menumuz —',
      'menu.title': 'Ozenle hazirlanmis,<br /><em>sicak servis.</em>',
      'menu.sub': 'Elle demlenmis pour-over\'lardan gevrek sabah tatlilarina kadar — menumuzdeki her sey her gun sifirdan yapilir.',
      'menu.filterAll': 'Hepsi',
      'menu.filterCoffee': 'Kahve',
      'menu.filterSpecialty': 'Ozel',
      'menu.filterFood': 'Yiyecek',
      'menu.soldOut': 'Tükendi',
      'menu.soldOutOverlay': 'Tükendi',
      'menu.addToCart': 'Sepete ekle',
      'menu.viewDetails': 'Urun detayini gor',

      /* stores */
      'stores.eyebrow': '— Dort Sube —',
      'stores.title': 'En yakin<br /><em>kosenizi bulun.</em>',
      'stores.sub': 'Dort mahalle kafesi, her biri kendi karakteriyle — ama ayni cekirdekler, ayni tarifler ve kapidaki ayni sicak merhaba.',
      'stores.orderFrom': 'Bu subeden siparis ver →',
      'stores.prev': 'Onceki sube',
      'stores.next': 'Sonraki sube',
      'stores.show': 'Goster',

      /* reviews */
      'reviews.eyebrow': '— Guzel Sozler —',
      'reviews.title': 'Duzenli musterilerimizden.',
      'reviews.prev': 'Onceki yorum',
      'reviews.next': 'Sonraki yorum',
      'reviews.goTo': 'Yoruma git',

      /* visit */
      'visit.eyebrow': '— Ziyaret Edin —',
      'visit.title': 'Kosenuzu bulun.',
      'visit.sub': 'Kitap dukanin ve Maple Street\'teki eski meyvenin arasina gizlenmis. Ucretsiz wifi, bol priz ve guzel sorarsaniz bir pencere koltugu.',
      'visit.address': 'Adres',
      'visit.hours': 'Calisma Saatleri',
      'visit.phone': 'Telefon',
      'visit.email': 'E-posta',

      /* contact */
      'contact.eyebrow': '— Merhaba Deyin —',
      'contact.title': 'Bize yazin.',
      'contact.sub': 'Catering, ozel etkinlikler, toptan kahve veya sadece kisa bir merhaba — sizden haber almak isteriz.',
      'contact.note': 'Genellikle birkac saat icinde yanit veririz.',
      'contact.nameLabel': 'Adiniz',
      'contact.emailLabel': 'E-posta',
      'contact.topicLabel': 'Ne hakkinda?',
      'contact.messageLabel': 'Mesaj',
      'contact.namePlaceholder': 'Adiniz Soyadiniz',
      'contact.emailPlaceholder': 'ornek@eposta.com',
      'contact.topicDefault': 'Secin…',
      'contact.topic0': 'Sadece merhaba demek',
      'contact.topic1': 'Catering talebi',
      'contact.topic2': 'Ozel etkinlik',
      'contact.topic3': 'Toptan kahve',
      'contact.topic4': 'Basin / isbirligi',
      'contact.msgPlaceholder': 'Biraz anlatin…',
      'contact.submit': 'Mesaj gonder',
      'contact.legalNote': 'Gonderdiginizde adiniz, e-postaniz ve mesajiniz suna iletilir:',
      'contact.privacy': 'Gizlilik Politikasi',
      'contact.success': 'Tesekkurler! Mesajiniz yolda. Yakinda sizinle iletisime gececegiz.',
      'contact.error': 'Bir seyler ters gitti. Lutfen tekrar deneyin veya bize e-posta gonderin.',
      'contact.errName': 'Lutfen adinizi girin',
      'contact.errEmail': 'Gecerli bir e-posta girin',
      'contact.errTopic': 'Lutfen bir konu secin',
      'contact.errMsg': 'Mesaj en az 10 karakter olmalidir',

      /* footer */
      'footer.tagline': 'Niyetle demlendi · Istanbul, TR',
      'footer.social': 'Sosyal medya',
      'footer.legal': 'Yasal belgeler',
      'footer.legalCentre': 'Yasal Merkez',
      'footer.privacy': 'Gizlilik Politikasi',
      'footer.cookies': 'Cerez Politikasi',
      'footer.terms': 'Kullanim Kosullari',
      'footer.returns': 'Iade & Kusur',
      'footer.copy': '© 2026 Ember & Oak. Tum haklari saklidir.',
      'footer.top': 'Basa don',

      /* item modal */
      'modal.close': 'Kapat',
      'modal.fromMenu': '— Menuden —',
      'modal.pickup': 'Alis yerini secin',
      'modal.pickStore': 'Devam etmek icin bir sube secin.',
      'modal.pickupAt': 'Alis yeri',
      'modal.continue': 'Odemeye devam et',
      'modal.item': 'Urun',
      'modal.at': '@',
      'modal.storeDefault': 'sube',
      'modal.summaryItem': 'Urun',
      'modal.summaryPickup': 'Alis yeri',
      'modal.summaryTotal': 'Toplam',
      'modal.qrComing': 'Odeme QR kodu, yakinda',
      'modal.qrSoon': 'YAKINDA',
      'modal.qrPay': 'QR Ode',
      'modal.qrCaption': 'Odeme icin tarayin · Yakinda',
      'modal.payNote': '📱 QR odemeleri yakinda tum subelerde aktif olacak. Hazir oldugunda size e-posta gondeririz.',
      'modal.back': '← Geri',
      'modal.done': 'Tamam',

      /* cart */
      'cart.title': 'Sepetiniz',
      'cart.close': 'Sepeti kapat',
      'cart.empty': 'Sepetiniz bos',
      'cart.emptySub': 'Baslamak icin menuden bir icecek veya tatli ekleyin.',
      'cart.browse': 'Menüye goz at',
      'cart.subtotal': 'Ara toplam',
      'cart.taxNote': 'Vergiler ve alis zamani kasada hesaplanir.',
      'cart.checkout': 'Odeme',
      'cart.remove': 'Kaldir',
      'cart.decQty': 'Miktar azalt',
      'cart.incQty': 'Miktar artir',
      'cart.pickupAt': 'Alis yeri: ',

      /* checkout */
      'checkout.eyebrow': '— Odeme —',
      'checkout.title': 'Birkaç detay',
      'checkout.sub': 'Siparisiniz yaklasik 15-20 dakika icinde hazir olacak.',
      'checkout.name': 'Ad',
      'checkout.phone': 'Telefon',
      'checkout.address': 'Alis adresi',
      'checkout.store': 'Sube',
      'checkout.when': 'Ne zaman',
      'checkout.namePlaceholder': 'Adiniz Soyadiniz',
      'checkout.phonePlaceholder': '(5XX) XXX-XXXX',
      'checkout.addrPlaceholder': 'Adresiniz',
      'checkout.asap': 'Hazir olur olmaz',
      'checkout.in15': '15 dakika icinde',
      'checkout.in30': '30 dakika icinde',
      'checkout.in45': '45 dakika icinde',
      'checkout.in60': '1 saat icinde',
      'checkout.notes': 'Notlar',
      'checkout.optional': '(opsiyonel)',
      'checkout.notesPlaceholder': 'Ekstra kopuk, az seker vb.',
      'checkout.items': 'Urunler',
      'checkout.total': 'Toplam',
      'checkout.placeOrder': 'Siparis Ver',
      'checkout.legalText': 'Siparis vererek sunu kabul edersiniz:',
      'checkout.and': 've',
      'checkout.distanceContract': 'Mesafeli Satis Sozlesmesi',
      'checkout.returnPolicy': 'Iade & Kusur Politikasi',
      'checkout.orderPlaced': 'Siparis alindi',
      'checkout.thanks': 'Tesekkurler! Siparisiniz',
      'checkout.preparing': 'hazirlaniyor.',
      'checkout.keepBrowsing': 'Alisverise devam et',
      'checkout.summaryPickup': 'Alis yeri',
      'checkout.errName': 'Lutfen adinizi girin',
      'checkout.errPhone': 'Gecerli bir telefon girin',
      'checkout.errAddress': 'Bir alis adresi girin',
      'checkout.errStore': 'Bir sube secin',
      'checkout.email': 'E-posta',
      'checkout.emailPlaceholder': 'ornek@eposta.com',
      'checkout.errEmail': 'Cevrimici odemek icin gecerli bir e-posta girin',
      'checkout.payTitle': 'Son adim',
      'checkout.paySub': 'Siparisiniz alindi. Odeme yontemini secin.',
      'checkout.payNow': 'Simdi ode (QR / kart)',
      'checkout.payAtPickup': 'Teslimatta ode',
      'checkout.payError': 'Cevrimici odeme su an kullanilamiyor — teslimatta odeyebilirsiniz.',
      'checkout.payRetry': 'Tekrar dene',
      'checkout.payWait': 'Odeme bekleniyor…',
      'checkout.payDoneManual': 'Odeme yaptim — devam et',
      'checkout.payAtPickupNote': 'Siparisi teslim alirken odeyeceksiniz.',
      'checkout.paidOnline': 'Cevrimici odendi',
      'checkout.payUnavailable': 'Cevrimici odeme yok — teslimatta odeyeceksiniz.',

      /* auth */
      'auth.loginTab': 'Giris Yap',
      'auth.signupTab': 'Kayit Ol',
      'auth.loginEyebrow': '— Tekrar hoşgeldiniz —',
      'auth.loginTitle': 'Hesabiniza giris yapin',
      'auth.signupEyebrow': '— Bize katilin —',
      'auth.signupTitle': 'Hesap olusturun',
      'auth.email': 'E-posta',
      'auth.password': 'Sifre',
      'auth.name': 'Ad',
      'auth.phone': 'Telefon numarasi',
      'auth.loginBtn': 'Giris Yap',
      'auth.signupBtn': 'Hesap Olustur',
      'auth.forgot': 'Sifremi unuttum',
      'auth.emailPlaceholder': 'ornek@eposta.com',
      'auth.passPlaceholder': '••••••••',
      'auth.namePlaceholder': 'Adiniz Soyadiniz',
      'auth.phonePlaceholder': '(5XX) XXX-XXXX',
      'auth.passMinPlaceholder': '8+ karakter',
      'auth.legalSignup': 'Hesap olusturarak sunu kabul edersiniz:',
      'auth.and': 've',
      'auth.marketingNote': 'Pazarlama mesajlari icin ayrica onay aliriz.',
      'auth.alreadyAccount': 'Zaten hesabiniz var mi? Giris yapin',
      'auth.errEmail': 'E-postanizi girin',
      'auth.errPass': 'Sifrenizi girin',
      'auth.errName': 'Adinizi girin (2+ karakter)',
      'auth.errEmailValid': 'Gecerli bir e-posta girin',
      'auth.errPassLen': 'Sifre 8+ karakter olmalidir',
      'auth.errResetEmail': 'Once yukaridaki e-postanizi girin',
      'auth.resetSent': 'Sifre sifirlama linki gonderildi — e-postanizi kontrol edin.',
      'auth.notConfigured': 'Yetkilendirme yapilandirilmamis.',
      'auth.loggedIn': 'Giris yapildi',

      /* cookie banner */
      'cookie.heading': 'Gizliliginiz',
      'cookie.body': 'Sepet, giris ve siparislerin calismasi icin gerekli tarayici depolamasi kullaniyoruz. Şu an reklam veya analitik cerez kullanmiyoruz — ekleyebilecegimiz istege bagli cerezler yalnizca onayinizla calisacaktir.',
      'cookie.policy': 'Cerez Politikasi',
      'cookie.privacy': 'Gizlilik Politikasi',
      'cookie.accept': 'Kabul Et',
      'cookie.decline': 'Reddet',

      /* misc */
      'misc.darkMode': 'Karanlik modu ac/kapat',
      'misc.itemDefault': 'Urun',

      /* 404 page */
      '404.steam': 'Bu bir decaf.',
      '404.title': 'Sayfa bulunamadi',
      '404.sub': 'Bu fincan bos gorunuyor. Aradiginiz sayfa mevcut degil — ama gercek kahve burada.',
      '404.goHome': 'Ana sayfaya don',
      '404.browseMenu': 'Menuye goz at',

      /* pickup time */
      'time.asap': 'hazir olur olmaz',
      'time.15': '15 dakika icinde',
      'time.30': '30 dakika icinde',
      'time.45': '45 dakika icinde',
      'time.60': '1 saat icinde',

      /* admin */
      'admin.orders': 'Canli Siparisler',
      'admin.menu': 'Menu Yonetimi',
      'admin.sales': 'Satis Ozeti',
      'admin.logout': 'Cikis Yap',
      'admin.refresh': 'Yenile',
      'admin.resetAll': 'Tum override\'lari sifirla',
      'admin.noOrders': 'Henuz siparis yok',
      'admin.noOrdersSub': 'Yeni siparisler musteri odeme yaptiginda burada gorunecek.',
      'admin.noMenu': 'Henuz menu ogesi yok',
      'admin.noSales': 'Henuz satis yok',
      'admin.markDone': 'Tamamla',
      'admin.cancel': 'Iptal Et',
      'admin.reopen': 'Yeniden Ac',
      'admin.paid': 'Odendi',
      'admin.unpaid': 'Odenmedi',
      'admin.item': 'oge',
      'admin.items': 'oge',
      'admin.totalRevenue': 'Toplam gelir',
      'admin.totalOrders': 'Toplam siparis',
      'admin.revenueByStore': 'Subeye gore gelir',
      'admin.store': 'Sube',
      'admin.ordersCol': 'Siparisler',
      'admin.revenue': 'Gelir',
      'admin.itemCol': 'Urun',
      'admin.qty': 'Adet',
      'admin.liveOrders': 'canli siparis',
      'admin.sampleData': 'ornek veri (henuz gercek siparis yok)',
      'admin.localStorage': 'localStorage siparisleri',
      'admin.dataCloud': 'Veri kaynagi: Supabase (bulut)',
      'admin.dataLocal': 'Veri kaynagi: yerel ornek',
      'admin.clickToEdit': 'duzenlemek icin tikla',
      'admin.enterToSave': 'kaydetmek icin enter / iptal esc',
      'admin.edited': 'duzenlendi',
      'admin.reset': 'sifirla',
      'admin.addonName': 'Ekleme / ekstra adi',
      'admin.priceNet': 'Fiyat (net)',
      'admin.appliesTo': 'Uygulanir',
      /* admin login */
      'admin.baristaOnly': 'Sadece baristalar',
      'admin.crumb': 'Ember & Oak · Kahve Yonetimi',
      'admin.loginTitle': 'Admin Giris',
      'admin.loginSub': 'Siparisleri, menuyu ve satislari yonetmek icin giris yapin.',
      'admin.email': 'E-posta',
      'admin.password': 'Sifre',
      'admin.signIn': 'Giris Yap',
      'admin.forgotPw': 'Sifremi unuttum',
      'admin.backWebsite': '← Web sitesine don',
      'admin.backLogin': '← Giris sayfasina don',
      'admin.enterEmail': 'Lutfen e-postanizi girin.',
      'admin.enterPassword': 'Lutfen sifrenizi girin.',
      'admin.unableSignIn': 'Giris yapilamiyor.',
      /* admin reset */
      'admin.resetTitle': 'Yeni Sifre Belirle',
      'admin.checkingReset': 'Sifirlama linkiniz kontrol ediliyor…',
      'admin.invalidReset': 'Bu sifirlama linki gecersiz veya suresi dolmus. Giris sayfasindan yeni bir tane isteyin.',
      'admin.newPassword': 'Yeni sifre',
      'admin.newPassPlaceholder': 'En az 6 karakter',
      'admin.confirmPassword': 'Sifreyi onayla',
      'admin.confirmPassPlaceholder': 'Sifrenizi tekrar girin',
      'admin.updatePassword': 'Sifreyi guncelle',
      'admin.pwMinLength': 'Sifre en az 6 karakter olmalidir.',
      'admin.pwNoMatch': 'Sifreler eslesmiyor.',
      'admin.unableUpdate': 'Sifre guncellenemiyor.',
      'admin.pwUpdated': 'Sifre guncellendi — yeni sifrenizle giris yapin.',
      'admin.resetSentMsg': 'Sifre sifirlama linki gonderildi — e-postanizi kontrol edin.',
      'admin.enterEmailFirst': 'Once yukaridaki e-postanizi girin, sonra sifremi unuttuma tiklayin.',
      /* admin dashboard dynamic */
      'admin.menuSub': 'Musteri menusu (data.js) yuklenemedi. Baska bir sekmede siteyi acin.',
      'admin.soldOutBadge': 'Tükendi',
      'admin.noStoreData': 'Sube verisi yok.',
      'admin.noItemsSold': 'Henuz urun satilmadi.',
      'admin.nonCancelled': 'iptal edilmemis siparis',
      'admin.nonCancelledPlural': 'iptal edilmemis siparis',
      'admin.cancelled': 'iptal edildi',
      'admin.sampleDataShort': 'ornek veri',
      'admin.liveData': 'canli veri',
      'admin.localData': 'yerel veri',
      'admin.noDataYet': 'Henuz veri yok — depolama bosken ornek siparisler gorunecek.',
      'admin.byQuantity': 'satis miktarina gore',
      'admin.avgOrder': 'Ort. siparis',
      'admin.topItems': 'En cok satan urunler',
      'admin.today': 'Bugun',
      'admin.thisWeek': 'Bu hafta',
      'admin.thisMonth': 'Bu ay',
      'admin.allTime': 'Tum zamanlar',
      'admin.paidOrders': 'odendi',
      'admin.unpaidOrders': 'odenmedi',
      'admin.cancelledOrders': 'iptal',
      'admin.share': 'pay',
      'admin.noRevenue': 'Gelir verisi yok',
    }
  };

  /* ===========================================================
     TAG MAP
     =========================================================== */
  const tagMap = {
    en: { 'Bestseller': 'Bestseller', 'Fan Favorite': 'Fan Favorite', 'Signature': 'Signature', 'Refreshing': 'Refreshing' },
    tr: { 'Bestseller': 'En Çok Satan', 'Fan Favorite': 'Hayranların Favorisi', 'Signature': 'İmza', 'Refreshing': 'Ferahlatıcı' }
  };

  /* ===========================================================
     CURRENCY
     =========================================================== */
  const CURRENCY = {
    en: { symbol: '$', dec: '.', sep: ',' },
    tr: { symbol: '₺', dec: ',', sep: '.' }
  };

  /* ===========================================================
     PUBLIC API
     =========================================================== */

  /** translate a UI chrome key */
  function t(key) {
    return (dict[lang] && dict[lang][key]) ?? dict.en[key] ?? key;
  }

  /** locale-aware money: $5.50 / ₺5,50 */
  function money(n) {
    var c = CURRENCY[lang] || CURRENCY.en;
    var parts = Number(n).toFixed(2).split('.');
    var intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, c.sep);
    return c.symbol + intPart + c.dec + parts[1];
  }

  /** translate a menu item object (name, shortDesc, longDesc, tags) */
  function item(o) {
    if (lang !== 'tr' || !o || !window.DATA_TR) return o;
    var m = DATA_TR.menu && DATA_TR.menu[o.id];
    if (!m) return o;
    var copy = Object.assign({}, o);
    if (m.name) copy.name = m.name;
    if (m.shortDesc) copy.shortDesc = m.shortDesc;
    if (m.longDesc) copy.longDesc = m.longDesc;
    if (m.tags) copy.tags = m.tags.slice();
    return copy;
  }

  /** translate an add-on object (name) */
  function addOn(o) {
    if (lang !== 'tr' || !o || !window.DATA_TR) return o;
    var m = DATA_TR.addOns && DATA_TR.addOns[o.id];
    return (m && m.name) ? Object.assign({}, o, { name: m.name }) : o;
  }

  /** translate an English tag string */
  function tag(enTag) {
    return (tagMap[lang] && tagMap[lang][enTag]) ?? enTag;
  }

  /** keep the English tag available for CSS class checks (e.g. Fan Favorite accent) */
  function tagEn(enTag) { return enTag; }

  /* ===========================================================
     buildData — merge DATA_EN + DATA_TR → window.DATA
     =========================================================== */
  function buildData() {
    if (!window.DATA_EN) return;
    var base = structuredClone
      ? structuredClone(window.DATA_EN)
      : JSON.parse(JSON.stringify(window.DATA_EN));
    var tr = (lang === 'tr' && window.DATA_TR) ? DATA_TR : {};

    /* shop tagline */
    if (tr.shop && tr.shop.tagline) base.shop.tagline = tr.shop.tagline;

    /* about */
    if (tr.about) {
      if (tr.about.eyebrow) base.about.eyebrow = tr.about.eyebrow;
      if (tr.about.title) base.about.title = tr.about.title;
      if (tr.about.paragraphs) base.about.paragraphs = tr.about.paragraphs;
      if (tr.about.values) {
        tr.about.values.forEach(function (v, i) {
          if (base.about.values[i]) {
            if (v.title) base.about.values[i].title = v.title;
            if (v.text) base.about.values[i].text = v.text;
          }
        });
      }
    }

    /* add-ons */
    if (tr.addOns) {
      base.addOns.forEach(function (a) {
        var m = tr.addOns[a.id];
        if (m && m.name) a.name = m.name;
      });
    }

    /* menu */
    if (tr.menu) {
      base.menu.forEach(function (m) {
        var t = tr.menu[m.id];
        if (!t) return;
        if (t.name) m.name = t.name;
        if (t.shortDesc) m.shortDesc = t.shortDesc;
        if (t.longDesc) m.longDesc = t.longDesc;
        if (t.tags) m.tags = t.tags.slice();
      });
    }

    /* reviews */
    if (tr.reviews) {
      Object.keys(tr.reviews).forEach(function (i) {
        var idx = Number(i);
        if (base.reviews[idx]) {
          var r = tr.reviews[i];
          if (r.role) base.reviews[idx].role = r.role;
          if (r.quote) base.reviews[idx].quote = r.quote;
        }
      });
    }

    /* contact topics */
    if (tr.contact && tr.contact.topics) base.contact.topics = tr.contact.topics;

    window.DATA = base;
  }

  /* ===========================================================
     applyStatic — walk data-i18n* attributes and update DOM
     =========================================================== */
  function applyStatic() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
      el.setAttribute('title', t(el.dataset.i18nTitle));
    });
    /* update <html lang> and document title */
    document.documentElement.lang = lang;
    if (document.title && dict.en && dict.en['page.title']) {
      /* title stays as-is — brand name in title is not translated */
    }
  }

  /* ===========================================================
     syncSwitcher — highlight active pill
     =========================================================== */
  function syncSwitcher() {
    document.querySelectorAll('.lang-switch__opt').forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.lang === lang);
    });
  }

  /* ===========================================================
     switchLanguage
     =========================================================== */
  function switchLanguage(next) {
    if (!SUPPORTED.includes(next) || next === lang) return;
    lang = next;
    try { localStorage.setItem(LANG_KEY, next); } catch (e) { /* ignore */ }
    document.documentElement.lang = next;
    if (window.DATA_EN) buildData();
    applyStatic();
    syncSwitcher();
    window.dispatchEvent(new CustomEvent('eo:languagechange', { detail: { lang: next } }));
  }

  /* ===========================================================
     WIRE UP SWITCHER BUTTONS
     =========================================================== */
  function wireSwitcher() {
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('.lang-switch__opt');
      if (btn && btn.dataset.lang) switchLanguage(btn.dataset.lang);
    });
  }

  /* ===========================================================
     INIT — runs immediately on load
     =========================================================== */
  if (window.DATA_EN) buildData();
  applyStatic();
  syncSwitcher();
  wireSwitcher();

  /* ===========================================================
     EXPORT
     =========================================================== */
  window.EOI18n = {
    lang: function () { return lang; },
    t: t,
    money: money,
    item: item,
    addOn: addOn,
    tag: tag,
    tagEn: tagEn,
    buildData: buildData,
    applyStatic: applyStatic,
    switchLanguage: switchLanguage,
    SUPPORTED: SUPPORTED
  };

})();
