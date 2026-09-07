/* ==========================================================
   Ember & Oak Coffee — data.js
   Single source of truth for all business content.
   Exposes window.DATA for the existing IIFE in script.js.
   ========================================================== */

window.DATA = {
  version: 1,

  /* ---------------- Shop ---------------- */
  shop: {
    name: 'Ember & Oak Coffee',
    tagline: 'Brewed with intention · Portland, OR',
    email: 'hello@emberandoak.coffee',
    phone: '(503) 555-0147',
    social: {
      instagram: '#',
      facebook: '#',
      tiktok: '#'
    },
    hours: {
      'Mon–Fri': '7am – 8pm',
      'Sat–Sun': '8am – 9pm'
    }
  },

  /* ---------------- Hero ---------------- */
  hero: {
    eyebrow: '— Small batch. Slow brewed. —',
    title: 'Coffee that feels<br /><em>like coming home.</em>',
    sub: 'Single-origin beans roasted in-house, pastries baked at dawn, and a corner seat with your name on it.',
    chips: [
      { dot: true, text: 'Open today · 7am – 8pm' },
      { text: '★ 4.9 · 320+ reviews' },
      { text: 'Plant-based milks free' }
    ]
  },

  /* ---------------- Stats strip ---------------- */
  stats: [
    { num: '12+',  label: 'Years roasting' },
    { num: '8',    label: 'Single-origin farms' },
    { num: '100%', label: 'Ethically sourced' },
    { num: '4.9',  label: 'Average rating' }
  ],

  /* ---------------- About ---------------- */
  about: {
    eyebrow: '— Our Story —',
    title: 'A small cafe with<br /><em>big standards.</em>',
    paragraphs: [
      'Ember & Oak started in a converted craftsman bungalow on Maple Street in 2014, with a single La Marzocco, a hand grinder, and a stubborn belief that coffee could be both a craft and a hug.',
      'Twelve years later, we are still small-batch roasting every Tuesday and Friday, still baking pastries at 5am, and still sweeping the sidewalk ourselves before the first cup goes out.',
      'Every bean we serve is traceable to a farm we have either visited or built a multi-year relationship with. We pay above Fair Trade, we compost every gram of waste, and we keep our menu small on purpose — so each thing we make, we make well.'
    ],
    values: [
      { icon: 'bean',  title: 'Sourced with care',  text: 'Eight single-origin farms, four countries, all visited by our head roaster.' },
      { icon: 'flame', title: 'Roasted in-house',   text: 'Small batches every Tuesday and Friday — never older than seven days on the bar.' },
      { icon: 'leaf',  title: 'Waste nothing',      text: 'Compost program, reusable cup discount, and grounds donated to a community garden.' },
      { icon: 'heart', title: 'Pay it forward',     text: 'A portion of every Beans-for-Hope blend funds clean water projects at origin.' }
    ]
  },

  /* ---------------- Add-ons (shared catalog) ---------------- */
  addOns: [
    { id: 'oat',     name: 'Oat milk',      price: 0.50, appliesTo: ['coffee', 'specialty'] },
    { id: 'shot',    name: 'Extra shot',    price: 1.00, appliesTo: ['coffee', 'specialty'] },
    { id: 'vanilla', name: 'Vanilla syrup', price: 0.50, appliesTo: ['coffee', 'specialty'] },
    { id: 'honey',   name: 'Honey',         price: 0.50, appliesTo: ['coffee', 'specialty'] }
  ],

  /* ---------------- Menu ---------------- */
  menu: [
    /* Coffee */
    {
      id: 'house',
      category: 'coffee',
      name: 'House Drip',
      price: 3.50,
      shortDesc: 'Our daily-rotating single origin, brewed in batches for a smooth, balanced cup.',
      longDesc: 'Our daily-rotating single origin, sourced from a small family farm and roasted in-house the morning of. Brewed in small batches throughout the day so every cup is fresh, smooth, and balanced — never bitter.',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=480&q=70',
      tags: ['Bestseller'],
      availableAddOns: ['oat', 'shot', 'vanilla', 'honey']
    },
    {
      id: 'pourover',
      category: 'coffee',
      name: 'Pour Over',
      price: 5.00,
      shortDesc: 'Hand-poured to order. Bright, floral, clean — ask what\'s on the bar today.',
      longDesc: 'Hand-poured to order by one of our trained baristas. Each cup is built around the day\'s bean — bright, floral, and clean. Takes 4 minutes. Worth every one.',
      image: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1497636577773-f1231844b336?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: ['oat', 'shot']
    },
    {
      id: 'french',
      category: 'coffee',
      name: 'French Press',
      price: 4.50,
      shortDesc: 'Full-bodied and rich, steeped for four minutes and served with cream.',
      longDesc: 'Coarse-ground, steeped for exactly four minutes, pressed and poured tableside. Full-bodied, rich, and never bitter. Comes with a small pitcher of cream.',
      image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: ['oat']
    },
    {
      id: 'cold',
      category: 'coffee',
      name: 'Cold Brew',
      price: 4.75,
      shortDesc: 'Steeped overnight for 16 hours. Naturally sweet, low acidity, ice cold.',
      longDesc: 'Steeped overnight in cold filtered water for 16 hours. Naturally sweet, low acidity, finished with a single large ice cube so it never waters down.',
      image: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1517959105821-eaf2591984ca?auto=format&fit=crop&w=480&q=70',
      tags: ['Refreshing'],
      availableAddOns: ['oat', 'vanilla']
    },

    /* Specialty */
    {
      id: 'honeyoat',
      category: 'specialty',
      name: 'Honey Oat Latte',
      price: 5.50,
      shortDesc: 'Espresso, steamed oat milk, and a swirl of local wildflower honey.',
      longDesc: 'Two shots of our house espresso, creamy steamed oat milk, and a slow-pour of raw wildflower honey from a beekeeper two blocks away. Naturally sweet, never syrupy.',
      image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=480&q=70',
      tags: ['Fan Favorite'],
      availableAddOns: ['oat', 'shot', 'vanilla']
    },
    {
      id: 'cardamom',
      category: 'specialty',
      name: 'Cardamom Cappuccino',
      price: 5.25,
      shortDesc: 'Double shot, velvet foam, dusted with freshly ground cardamom.',
      longDesc: 'A double ristretto, velvet microfoam, and a generous dusting of freshly ground green cardamom. Warm, fragrant, and gently spiced.',
      image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: ['oat', 'shot']
    },
    {
      id: 'mocha',
      category: 'specialty',
      name: 'Mocha Ember',
      price: 5.75,
      shortDesc: 'Dark chocolate, espresso, and a kiss of smoked sea salt. House signature.',
      longDesc: 'Our house signature. Single-origin espresso, 70% dark chocolate, steamed milk, and a finishing pinch of smoked sea salt. Rich, smoky, and deeply satisfying.',
      image: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=480&q=70',
      tags: ['Signature'],
      availableAddOns: ['oat', 'shot', 'honey']
    },
    {
      id: 'matcha',
      category: 'specialty',
      name: 'Matcha Oat',
      price: 5.00,
      shortDesc: 'Ceremonial-grade matcha whisked with creamy oat milk. Calm in a cup.',
      longDesc: 'Ceremonial-grade matcha from Uji, Japan, whisked the traditional way and topped with creamy oat milk. Bright, grassy, and quietly energizing.',
      image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: ['oat']
    },

    /* Food */
    {
      id: 'almond',
      category: 'food',
      name: 'Almond Croissant',
      price: 4.25,
      shortDesc: 'Flaky, buttery, double-baked with almond frangipane. Baked at 5am.',
      longDesc: 'Laminated by hand, double-baked with almond frangipane, and finished with toasted sliced almonds and powdered sugar. Baked at 5am — gone by noon.',
      image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=480&q=70',
      tags: ['Bestseller'],
      availableAddOns: []
    },
    {
      id: 'avo',
      category: 'food',
      name: 'Avocado Toast',
      price: 9.50,
      shortDesc: 'Sourdough, smashed avo, chili crisp, soft egg, lemon, and micro herbs.',
      longDesc: 'House-baked sourdough, smashed avocado, house-made chili crisp, a soft jammy egg, lemon zest, and a handful of micro herbs. Comes with a small side salad.',
      image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: []
    },
    {
      id: 'banana',
      category: 'food',
      name: 'Banana Bread',
      price: 3.75,
      shortDesc: 'Walnut, brown butter, and a whisper of cinnamon. Toasted on request.',
      longDesc: 'Walnut, brown butter, a whisper of cinnamon, and just enough dark brown sugar to caramelize the crust. Toasted on request, served with salted butter.',
      image: 'https://images.unsplash.com/photo-1632931057819-4eefffa8e007?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1632931057819-4eefffa8e007?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: []
    },
    {
      id: 'yogurt',
      category: 'food',
      name: 'Yogurt Bowl',
      price: 7.25,
      shortDesc: 'Greek yogurt, honey, seasonal fruit, house granola, and bee pollen.',
      longDesc: 'Thick Greek yogurt, raw local honey, seasonal fruit (ask what\'s in today), house-toasted granola, and a sprinkle of bee pollen. Bright, fresh, filling.',
      image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1200&q=80',
      thumb: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=480&q=70',
      tags: [],
      availableAddOns: []
    }
  ],

  /* ---------------- Stores ---------------- */
  stores: [
    {
      id: 'maple',
      name: 'Maple Street',
      neighborhood: 'Inner SE',
      address: '247 Maple St, Portland, OR 97214',
      phone: '(503) 555-0147',
      email: 'maple@emberandoak.coffee',
      hours: 'Mon–Fri 7am–8pm · Sat–Sun 8am–9pm',
      mapBbox: '-122.6644,45.5119,-122.6244,45.5319',
      mapMarker: '45.5219,-122.6444',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1600&q=80',
      thumb: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=70'
    },
    {
      id: 'pearl',
      name: 'Pearl District',
      neighborhood: 'Pearl District',
      address: '812 NW Glisan St, Portland, OR 97209',
      phone: '(503) 555-0284',
      email: 'pearl@emberandoak.coffee',
      hours: 'Daily · 7am – 9pm',
      mapBbox: '-122.7044,45.5219,-122.6644,45.5419',
      mapMarker: '45.5319,-122.6844',
      image: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=1600&q=80',
      thumb: 'https://images.unsplash.com/photo-1453614512568-c4024d13c247?auto=format&fit=crop&w=600&q=70'
    },
    {
      id: 'hawthorne',
      name: 'Hawthorne',
      neighborhood: 'Hawthorne',
      address: '3611 SE Hawthorne Blvd, Portland, OR 97214',
      phone: '(503) 555-0392',
      email: 'hawthorne@emberandoak.coffee',
      hours: 'Daily · 7am – 8pm',
      mapBbox: '-122.6444,45.5019,-122.6044,45.5219',
      mapMarker: '45.5119,-122.6244',
      image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1600&q=80',
      thumb: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=600&q=70'
    },
    {
      id: 'beaverton',
      name: 'Beaverton',
      neighborhood: 'Beaverton',
      address: '4550 SW Hall Blvd, Beaverton, OR 97005',
      phone: '(503) 555-0418',
      email: 'beaverton@emberandoak.coffee',
      hours: 'Mon–Sat 7am – 8pm · Closed Sun',
      mapBbox: '-122.8244,45.4719,-122.7844,45.4919',
      mapMarker: '45.4819,-122.8044',
      image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1600&q=80',
      thumb: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=600&q=70'
    }
  ],

  /* ---------------- Reviews ---------------- */
  reviews: [
    {
      name: 'Sarah A.',
      role: 'Daily regular',
      quote: 'The Mocha Ember is unreal. Cozy vibe, friendly staff, and the best almond croissant in the city. My home away from home.',
      rating: 5,
      initials: 'SA',
      avatarColor1: '#C67B4E',
      avatarColor2: '#5D3A2E'
    },
    {
      name: 'Marcus R.',
      role: 'Remote worker',
      quote: 'I work remote three days a week and this is the only place where I can actually focus. The pour overs are next level.',
      rating: 5,
      initials: 'MR',
      avatarColor1: '#5D3A2E',
      avatarColor2: '#2C1810'
    },
    {
      name: 'Jamie L.',
      role: 'Local artist',
      quote: 'Brought my mom here on her birthday. They remembered her order the next time we came in. That kind of warmth is rare.',
      rating: 5,
      initials: 'JL',
      avatarColor1: '#E8DFD0',
      avatarColor2: '#C67B4E'
    },
    {
      name: 'Dana K.',
      role: 'First-time visitor',
      quote: 'Honest coffee, honest people. The cardamom cappuccino tastes like someone\'s grandma made it — in the best way.',
      rating: 5,
      initials: 'DK',
      avatarColor1: '#A65D35',
      avatarColor2: '#2C1810'
    }
  ],

  /* ---------------- Contact ---------------- */
  contact: {
    topics: [
      'Just saying hi',
      'Catering inquiry',
      'Private event',
      'Wholesale beans',
      'Press / collaboration'
    ]
  },

  /* ---------------- Misc ---------------- */
  primaryStoreId: 'maple'
};
