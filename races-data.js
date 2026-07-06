// Race catalog for enCore.
//
// HOW IT WORKS (automatic updates):
// - `date` is an ISO date "YYYY-MM-DD". Races whose date has passed are
//   automatically shown under "Past Runs" — you never move them by hand.
// - When the next edition of a race is announced, just update its `date`
//   (and `url`) here and it jumps back to the upcoming section by itself.
// - If you only know roughly when a race happens, leave `date: null` and
//   put the rough info in `dateText` (shown as-is, race stays "on the radar").
// - `status` is your human decision: "confirmed" (we're going) or "radar"
//   (considering). "past" is computed automatically from the date.

const racesData = {
  confirmed: [
    {
      id: "garda",
      name: "Garda Half Marathon, Italia",
      url: "https://www.trentinoeventi.it/le-gare/garda-trentino-half-marathon-21k/iscrizioni/",
      date: "2025-11-09",
      image: "pictures/garda.webp",
      location: { lat: 45.8845, lng: 10.8394 },
      status: "confirmed"
    },
    {
      id: "barcelona",
      name: "Barcelona Half Marathon",
      url: "https://www.mitjamarato.barcelona/",
      date: "2026-02-15",
      image: "pictures/Barcelona.jpg",
      location: { lat: 41.3851, lng: 2.1734 },
      status: "confirmed"
    }
  ],

  radar: [
    {
      id: "midnight-sun",
      name: "Midnight Sun Half Marathon, Tromsø, Norway",
      url: "https://msm.no/en/events/midnight-sun-marathon/",
      date: "2026-06-20",
      image: "pictures/MidnightSun.jpg",
      location: { lat: 69.6496, lng: 18.9560 },
      status: "radar"
    },
    {
      id: "helsinki",
      name: "Helsinki Half Marathon, Finland",
      url: "https://helsinkihalfmarathon.fi/en/home/",
      date: "2026-06-06",
      image: "pictures/helsinki.png",
      location: { lat: 60.1699, lng: 24.9384 },
      status: "radar"
    },
    {
      id: "seville",
      name: "Seville Half Marathon, Spain",
      url: "https://fr.zurichmaratonsevilla.es/zfr-inscripciones",
      date: null,
      image: "pictures/Sevilla.jpg",
      location: { lat: 37.3886, lng: -5.9823 },
      status: "radar"
    },
    {
      id: "madrid",
      name: "Madrid Half Marathon, Spain",
      url: "https://en.mediomaratonmadrid.es/web-evento/11295-movistar-madrid-medio-maraton-2026",
      date: "2026-03-22",
      image: "pictures/Madrid.jpg",
      location: { lat: 40.4168, lng: -3.7038 },
      status: "radar"
    },
    {
      id: "valencia",
      name: "Valencia Half Marathon, Spain",
      url: "https://www.valenciaciudaddelrunning.com/en/half/half-marathon/",
      date: null,
      dateText: "Late October (yearly)",
      image: "pictures/Valencia.jpg",
      location: { lat: 39.4699, lng: -0.3763 },
      status: "radar"
    },
    {
      id: "san-sebastian",
      name: "San Sebastian Half Marathon, Spain",
      url: "https://mediomaratonsansebastianruralkutxa.com/en",
      date: "2025-10-05",
      image: "pictures/SS.jpg",
      location: { lat: 43.3213, lng: -1.9850 },
      status: "radar"
    },
    {
      id: "hobbiton",
      name: "Hobbiton Half Marathon, New Zealand",
      url: "https://www.hobbitontours.com/halflingmarathon/",
      date: "2026-03-28",
      image: "pictures/Hobbit.avif",
      location: { lat: -37.8106, lng: 175.7765 },
      status: "radar"
    },
    {
      id: "rome",
      name: "Rome Half Marathon, Italy",
      url: "https://www.romehalfmarathon.it/en/",
      date: null,
      dateText: "Mid October (yearly)",
      image: "pictures/rome.jpg",
      location: { lat: 41.9028, lng: 12.4964 },
      status: "radar"
    },
    {
      id: "big-five",
      name: "Big Five Marathon, South Africa",
      url: "https://big-five-marathon.com/registration",
      date: null,
      dateText: "Mid June (yearly)",
      image: "pictures/afrika.webp",
      location: { lat: -24.2856, lng: 30.9330 },
      status: "radar"
    },
    {
      id: "medoc",
      name: "Marathon du Médoc, France",
      url: "https://www.marathondumedoc.com/",
      date: "2025-09-06",
      image: "pictures/wine.webp",
      location: { lat: 44.8378, lng: -0.5792 },
      status: "radar"
    },
    {
      id: "pyramids",
      name: "Pyramids Half Marathon, Egypt",
      url: "https://www.thetrifactory.com/event-detail/103",
      date: "2025-12-14",
      image: "pictures/pyramid.png",
      location: { lat: 29.9765, lng: 31.1313 },
      status: "radar"
    },
    {
      id: "wales",
      name: "Love Trails Festival, South Wales",
      url: "https://www.lovetrailsfestival.co.uk/",
      date: null,
      dateText: "Late July (yearly)",
      image: "pictures/love-trail.jpg",
      location: { lat: 51.6214, lng: -3.9436 },
      status: "radar"
    },
    {
      id: "praia-grande",
      name: "Marathon Praia Grande, Brazil",
      url: "https://runff.com.br/evento/29",
      date: "2025-06-15",
      image: "",
      location: { lat: -24.0084, lng: -46.4124 },
      status: "radar"
    },
    {
      id: "tallinn",
      name: "Tallinn Half Marathon, Estonia",
      url: "https://www.jooks.ee/en/tallinn-marathon/",
      date: null,
      dateText: "Mid September (yearly)",
      image: "pictures/talin.jpg",
      location: { lat: 59.4370, lng: 24.7536 },
      status: "radar"
    },
    {
      id: "osaka",
      name: "Osaka Marathon, Japan",
      url: "https://half.osaka-marathon.jp/",
      date: "2025-01-25",
      image: "pictures/osaka.jpeg",
      location: { lat: 34.6937, lng: 135.5023 },
      status: "radar"
    },
    {
      id: "great-wall",
      name: "Great Wall Marathon, China",
      url: "https://great-wall-marathon.com/",
      date: "2026-05-16",
      image: "pictures/china.avif",
      location: { lat: 40.3240, lng: 116.6383 },
      status: "radar"
    },
    {
      id: "bangkok",
      name: "Bangkok Marathon, Thailand",
      url: "https://www.bkkmarathon.com/home",
      date: "2025-11-16",
      image: "pictures/bangkok.webp",
      location: { lat: 13.7563, lng: 100.5018 },
      status: "radar"
    },
    {
      id: "mallorca",
      name: "Mallorca Marathon, Spain",
      url: "https://www.palmademallorcamarathon.com/english/registration",
      date: "2025-11-02",
      image: "pictures/mallorca.png",
      location: { lat: 39.5696, lng: 2.6502 },
      status: "radar"
    },
    {
      id: "liege",
      name: "Beerlovers Marathon, Liège, Belgium",
      url: "https://www.visitezliege.be/en/offre/beerlovers-marathon",
      date: "2025-03-15",
      image: "pictures/beer.jpeg",
      location: { lat: 50.6326, lng: 5.5797 },
      status: "radar"
    },
    {
      id: "venice",
      name: "Venice Half Marathon, Italy",
      url: "https://www.venicemarathon.it/en/21k-en",
      date: "2025-10-26",
      image: "pictures/venice.webp",
      location: { lat: 45.4408, lng: 12.3155 },
      status: "radar"
    },
    {
      id: "copenhagen",
      name: "Bun Run Copenhagen, Denmark",
      url: "https://www.tipster.io/event/",
      date: null,
      image: "pictures/bunss.jpeg",
      location: { lat: 55.6761, lng: 12.5683 },
      status: "radar"
    },
    {
      id: "fuji",
      name: "Mt. Fuji Marathon, Japan",
      url: "https://mtfujimarathon.com/eninfo/regarding-the-mt-fuji-international-marathon-2025-date/",
      date: "2025-12-27",
      image: "pictures/fuji.jpg",
      location: { lat: 35.4876, lng: 138.7770 },
      status: "radar"
    },
    {
      id: "dubai",
      name: "Krispy Kreme Fun Run, Dubai",
      url: "https://raceme.ae/events/run/",
      date: "2025-12-31",
      dateText: "Dec 2025",
      image: "pictures/donut.jpg",
      location: { lat: 25.2048, lng: 55.2708 },
      status: "radar"
    },
    {
      id: "paris",
      name: "Paris Half Marathon, France",
      url: "https://www.hokasemideparis.fr/en/",
      date: "2026-03-08",
      image: "pictures/paris.webp",
      location: { lat: 48.8566, lng: 2.3522 },
      status: "radar"
    },
    {
      id: "mexico",
      name: "Mexico City Half Marathon",
      url: "https://raceroster.com/events/2025/101032/xviii-half-marathon-mexico-city-bbva-2025",
      date: "2025-07-13",
      image: "pictures/mexico-2.jpg",
      location: { lat: 19.4326, lng: -99.1332 },
      status: "radar"
    },
    {
      id: "ha-giang",
      name: "Ha Giang Discovery Marathon, Vietnam",
      url: "https://racejungle.com/pages/ha-giang-discovery-marathon-en",
      date: "2025-02-21",
      dateText: "Feb 21–23, 2025",
      image: "pictures/hagiang.webp",
      location: { lat: 22.8233, lng: 104.9836 },
      status: "radar"
    },
    {
      id: "great-ocean",
      name: "Great Ocean Race, Australia",
      url: "https://greatoceanroadrunfest.com.au/",
      date: "2026-05-16",
      dateText: "May 16–17, 2026",
      image: "pictures/aus.jpg",
      location: { lat: -38.5420, lng: 143.9735 },
      status: "radar"
    },
    {
      id: "angkor",
      name: "Angkor Empire Marathon, Cambodia",
      url: "https://www.cambodia-events.org/angkor-empire-full-marathon/",
      date: "2025-08-03",
      image: "pictures/angkor.webp",
      location: { lat: 13.3633, lng: 103.8564 },
      status: "radar"
    },
    {
      id: "petra",
      name: "Petra Desert Marathon, Jordan",
      url: "https://petra-desert-marathon.com/",
      date: "2025-09-06",
      image: "pictures/petra.jpg",
      location: { lat: 30.3285, lng: 35.4444 },
      status: "radar"
    }
  ],

  // Manually archived races (races with a passed `date` are shown as past
  // automatically — this bucket is only for entries without a real date).
  past: [
    {
      id: "brussels",
      name: "10k Polish Run, Brussels",
      url: "https://prod.chronorace.be/registration/SelectActivity.aspx?eventId=2141127096537293&iframe=1&lng=EN&cs=POLISHRUN",
      date: "2025-09-06",
      image: "pictures/polish.jpg",
      location: { lat: 50.8503, lng: 4.3517 },
      status: "past"
    }
  ]
};

// Helpers shared by all pages (running.html, race-details.html, profile-page.html)
const raceUtils = {
  allRaces() {
    return [...racesData.confirmed, ...racesData.radar, ...racesData.past];
  },

  getRace(id) {
    return this.allRaces().find(r => r.id === id) || null;
  },

  isPast(race) {
    if (!race.date) return race.status === 'past';
    return new Date(race.date + 'T23:59:59') < new Date();
  },

  // "confirmed" / "radar" while upcoming, "past" once the date has passed
  effectiveStatus(race) {
    return this.isPast(race) ? 'past' : race.status;
  },

  // 'fw' = Fall–Winter (Sep–Feb), 'ss' = Spring–Summer (Mar–Aug)
  getSeason(race) {
    if (!race.date) return 'fw';
    const month = new Date(race.date + 'T12:00:00').getMonth(); // 0-11
    return (month >= 8 || month <= 1) ? 'fw' : 'ss';
  },

  formatDate(race) {
    if (race.dateText) return race.dateText;
    if (!race.date) return 'Date TBA';
    return new Date(race.date + 'T12:00:00')
      .toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  // Soonest first; races without a date go last
  sortByDate(races) {
    return [...races].sort((a, b) => (a.date || '9999') .localeCompare(b.date || '9999'));
  }
};

window.racesData = racesData;
window.raceUtils = raceUtils;
