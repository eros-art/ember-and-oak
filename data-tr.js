/* ==========================================================
   Ember & Oak Coffee — data-tr.js
   Turkish (TR) overlay — only translatable strings.
   Prices, images, IDs, addresses, store names stay in data.js.
   ========================================================== */

window.DATA_TR = {
  shop: {
    tagline: 'Niyetle_demlendi · Istanbul, TR'
  },

  about: {
    eyebrow: '— Hikayemiz —',
    title: 'Kucuk bir kafe,<br /><em>buyuk standartlar.</em>',
    paragraphs: [
      'Ember & Oak, 2014 yilinda Maple Street\'te donusturulmus bir zanaatkar evinde, tek bir La Marzocco, elle calinan bir degirmen ve kahvenin hem bir zanaat hem de bir sarilma olabilecegine dair inatci bir inancla basladi.',
      'On iki yil sonra, hala her sali ve cuma kucuk partiler halinde kavuruyoruz, hala sabah 5\'te tatlilari pisiriyoruz ve hala ilk fincan cikmadan once kendimiz kaldirimi supuruyoruz.',
      'Baktigimiz her cekirdek, ya ziyaret ettigimiz ya da yillik iliski kurugumuz bir ciftlige aittir. Adil Ticaretin uzerinde odeme yapiyoruz, her gram atigi kompostluyoruz ve menumuzu kasitli olarak kucuk tutuyoruz — boylece her seyi iyi yapiyoruz.'
    ],
    values: [
      { title: 'Ozenle temin edilmis', text: 'Sekiz tek-kokenli ciftlik, dort ulke, hepsi bask kavurucumuz tarafindan ziyaret edilmis.' },
      { title: 'Ic mekanda kavrulmus', text: 'Her sali ve cuma kucuk partiler — barda yedi gunden eski olmaz.' },
      { title: 'Hicbir seyi atma', text: 'Kompost programi, yeniden kullanilabilir fincan indirimi ve kahve telvesinin topluluk bahcesine bagisi.' },
      { title: 'Ileriye yatirim', text: 'Her Beans-for-Hope karisimindan bir kisim, kokeninde temiz su projelerini fonlar.' }
    ]
  },

  addOns: {
    oat:     { name: 'Yulaf sutu' },
    shot:    { name: 'Ekstra shot' },
    vanilla: { name: 'Vanilya surubu' },
    honey:   { name: 'Bal' }
  },

  menu: {
    house:    { name: 'Ev Demlemesi', shortDesc: 'Her gun donen tek kokenli cekirdegimiz, pürüzsüz ve dengeli bir fincan icin demlenmis.', longDesc: 'Her gun donen tek kokenli cekirdegimiz, kucuk bir aile ciftliginden temin edilip sabahi kavurulmus. Gun boyunca kucuk partiler halinde demlenir, boylece her fincan taze, pürüzsüz ve dengeli olur — asla aci degil.', tags: ['En Cok Satan'] },
    pourover: { name: 'El Demlemesi', shortDesc: 'Siparis uzerine elle demlenmis. Canli, ciceksi, temiz — bugun barda ne var sorun.', longDesc: 'Egitilmis kahvecilerimizden biri tarafindan siparis uzerine elle demlenir. Her fincan gunun cekirdegi etrafinda insa edilir — canli, ciceksi ve temiz. 4 dakika surer. Her dakikasina degir.', tags: [] },
    french:   { name: 'French Press', shortDesc: 'Dolgun gobekli ve zengin, dort dakika demlenmis ve kremali servis edilmis.', longDesc: 'Kalin ogutulmus, tam olarak dort dakika demlenmis, masada basilmis ve dokulmus. Dolgun gobekli, zengin ve asla aci degil. Kucuk bir krema kartonuyla birlikte gelir.', tags: [] },
    cold:     { name: 'Cold Brew', shortDesc: 'Gece boyunca 16 saat demlenmis. Dogal olarak tatli, dusuk asidite, buz gibi.', longDesc: 'Gece boyunca soguk su filtresinde 16 saat demlenmis. Dogal olarak tatli, dusuk asidite, tek bir buyuk buz küpüyle tamamlanir — hicbir zaman sulanmaz.', tags: ['Ferahlatıcı'] },
    honeyoat: { name: 'Balli Yulaf Latte', shortDesc: 'Espresso, isitilmis yulaf sutu ve yerel cicek balindan bir girdap.', longDesc: 'Iki shot ev espresso'su, kremali isitilmis yulaf sutu ve iki blok otedeki bir kovcudan alinmis ham cicek balindan yavas dokulmus. Dogal olarak tatli, hicbir zaman surubu gibi degil.', tags: ['Hayranlarin Favorisi'] },
    cardamom: { name: 'Kakuleli Kapuçino', shortDesc: 'Cift shot, kadife kopuk, taze ogutulmus kakule ile serpilmis.', longDesc: 'Cift ristretto, kadife mikrokopuk ve taze ogutulmus yesil kakuleden bol serpme. Sicak, kokulu ve hafif baharatli.', tags: [] },
    mocha:    { name: 'Mocha Ember', shortDesc: 'Koyu cikolata, espresso ve tütsülenmis deniz tuzundan bir öpücük. Imza urunu.', longDesc: 'Imza urunumuz. Tek kokenli espresso, %70 koyu cikolata, isitilmis sut ve son dokunus olarak tütsülenmis deniz tuzu. Zengin, tütsülü ve derinlere isleyen.', tags: ['İmza'] },
    matcha:   { name: 'Matcha Yulaf', shortDesc: 'Torensel sinif matcha, kremali yulaf sutuyla cirpilmis. Fincanda huzur.', longDesc: 'Uji, Japonya\'dan torensel sinif matcha, geleneksel yontemle cirpilmis ve ustu kremali yulaf sutuyla tamamlanmis. Canli, otlu ve sessizce enerji veren.', tags: [] },
    almond:   { name: 'Badem Kruvasan', shortDesc: 'Yaprakli, tereyagli, badem frangipane ile cift pisirilmis. Sabah 5\'te pisirilmis.', longDesc: 'Elle acilmis, badem frangipane ile cift pisirilmis, kavrulmis badem dilimleri ve pudra sekeri ile tamamlanmis. Sabah 5\'te pisirilir — ogle yemegine kadar biter.', tags: ['En Cok Satan'] },
    avo:      { name: 'Avokado Tost', shortDesc: 'Ekmeekmayasi, ezilmis avokado, biberli gevrek, yumusak yumurta, limon ve mikro otlar.', longDesc: 'Ev yapimi ekmekmayasi, ezilmis avokado, ev yapimi biberli gevrek, yumusak jölememsi yumurta, limon kabugu rendesi ve bir avuc mikro ot. Kucuk bir yan salatayla birlikte gelir.', tags: [] },
    banana:   { name: 'Muz Ekmegi', shortDesc: 'Ceviz, kahverengi tereyagi ve tarçin fisiytagi. Istek uzerine isitilir.', longDesc: 'Ceviz, kahverengi tereyagi, tarçin fisiytagi ve kabugunu karamelize etmek icin tam yetecek kadar koyu kahverengi seker. Istek uzerine isitilir, tuzlu tereyagiyla servis edilir.', tags: [] },
    yogurt:   { name: 'Yogurt Kasigi', shortDesc: 'Yunan yogurtu, bal, mevsim meyveleri, ev yapimi granola ve ari poleni.', longDesc: 'Kalin Yunan yogurtu, ham yerel bal, mevsim meyveleri (bugun ne var sorun), kendi kavurdugumuz granola ve ari poleni serpilmesi. Canli, taze, doyurucu.', tags: [] }
  },

  reviews: {
    0: { role: 'Gunluk musterim', quote: 'Mocha Ember inanilmaz. Samimi ortam, guleryuzlu personel ve sehirdeki en iyi badem kruvasani. Evimden uzak evim.' },
    1: { role: 'Uzaktan calisan', quote: 'Haftada uc gun uzaktan calisiyorum ve gercekten odaklanabilecegim tek yer burasi. El demlemeleri bir ust seviye.' },
    2: { role: 'Yerel sanatci', quote: 'Annemi dogum gununde buraya getirdim. Sonraki gelisimizde siparisini hatirladilar. Bu tur sicaklik nadir bulunur.' },
    3: { role: 'Ilk ziyaretci', quote: 'Duzgun kahve, duzgun insanlar. Kakuleli kapucino birinin babaannesi yapmis gibi — en iyi sekilde.' }
  },

  contact: {
    topics: [
      'Sadece merhaba demek',
      'Catering talebi',
      'Ozel etkinlik',
      'Toptan kahve',
      'Basin / isbirligi'
    ]
  }
};
