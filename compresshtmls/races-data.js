// Race data structure for automated management
const racesData = {
  // Confirmed upcoming races
  confirmed: [
    {
      id: "garda",
      name: "Garda Half Marathon, Italia",
      url: "https://www.trentinoeventi.it/le-gare/garda-trentino-half-marathon-21k/iscrizioni/",
      date: "Nov 9, 2025",
      image: "pictures/garda.webp",
      location: { lat: 45.8845, lng: 10.8394 },
      status: "confirmed"
    },
    {
      id: "barcelona", 
      name: "Barcelona Half Marathon",
      url: "https://www.mitjamarato.barcelona/",
      date: "Feb 15, 2026",
      image: "pictures/Barcelona.jpg",
      location: { lat: 41.3851, lng: 2.1734 },
      status: "confirmed"
    }
  ],

  // Races on the radar (considering)
  radar: [
    {
      id: "midnight-sun",
      name: "Midnight Sun Half Marathon, Tromsø, Norway",
      url: "https://msm.no/en/events/midnight-sun-marathon/",
      date: "June 20, 2026",
      image: "pictures/MidnightSun.jpg",
      location: { lat: 69.6496, lng: 18.9560 },
      status: "radar"
    },
    {
      id: "helsinki",
      name: "Helsinki Half Marathon, Finland", 
      url: "https://helsinkihalfmarathon.fi/en/home/",
      date: "June 6, 2026",
      image: "pictures/helsinki.png",
      location: { lat: 60.1699, lng: 24.9384 },
      status: "radar"
    },
    {
      id: "seville",
      name: "Seville",
      url: "https://fr.zurichmaratonsevilla.es/zfr-inscripciones",
      image: "pictures/Sevilla.jpg",
      location: { lat: 37.3886, lng: -5.9823 },
      status: "radar"
    },
    {
      id: "madrid",
      name: "Madrid",
      url: "https://en.mediomaratonmadrid.es/web-evento/11295-movistar-madrid-medio-maraton-2026",
      date: "March 22, 2026", 
      image: "pictures/Madrid.jpg",
      location: { lat: 40.4168, lng: -3.7038 },
      status: "radar"
    },
    {
      id: "valencia",
      name: "Valencia",
      url: "https://www.valenciaciudaddelrunning.com/en/half/half-marathon/",
      date: "Oct 26",
      image: "pictures/Valencia.jpg", 
      location: { lat: 39.4699, lng: -0.3763 },
      status: "radar"
    },
    {
      id: "san-sebastian",
      name: "San Sebastian",
      url: "https://mediomaratonsansebastianruralkutxa.com/en",
      date: "Oct 5, 2025",
      image: "pictures/SS.jpg",
      location: { lat: 43.3213, lng: -1.9850 },
      status: "radar"
    },
    {
      id: "hobbiton",
      name: "Hobbiton Half Marathon",
      url: "https://www.hobbitontours.com/halflingmarathon/",
      date: "March 28, 2026",
      image: "pictures/Hobbit.avif",
      location: { lat: -37.8106, lng: 175.7765 },
      status: "radar"
    },
    {
      id: "rome",
      name: "Rome",
      url: "https://www.romehalfmarathon.it/en/",
      date: "October 19",
      image: "pictures/rome.jpg",
      location: { lat: 41.9028, lng: 12.4964 },
      status: "radar"
    },
    {
      id: "big-five",
      name: "Big Five South Africa",
      url: "https://big-five-marathon.com/registration",
      date: "June 13",
      image: "pictures/afrika.webp",
      location: { lat: -24.2856, lng: 30.9330 },
      status: "radar"
    },
    {
      id: "medoc",
      name: "Marathon du Médoc",
      url: "https://www.marathondumedoc.com/",
      date: "Sept 6, 2025",
      image: "pictures/wine.webp",
      location: { lat: 44.8378, lng: -0.5792 },
      status: "radar"
    },
    {
      id: "pyramids",
      name: "Pyramids Half Marathon",
      url: "https://www.thetrifactory.com/event-detail/103",
      date: "Dec 14, 2025",
      image: "pictures/pyramid.png",
      location: { lat: 29.9765, lng: 31.1313 },
      status: "radar"
    },
    {
      id: "wales",
      name: "Love Trails Festival, South Wales",
      url: "https://www.lovetrailsfestival.co.uk/",
      date: "July 26",
      image: "pictures/love-trail.jpg",
      location: { lat: 51.6214, lng: -3.9436 },
      status: "radar"
    },
    {
      id: "praia-grande",
      name: "Marathon Praia Grande, Brazil",
      url: "https://runff.com.br/evento/29",
      date: "June 15, 2025",
      image: "",
      location: { lat: -24.0084, lng: -46.4124 },
      status: "radar"
    },
    {
      id: "tallinn",
      name: "Tallinn Half, Russia",
      url: "https://www.jooks.ee/en/tallinn-marathon/",
      date: "Sep 11",
      image: "pictures/talin.jpg",
      location: { lat: 59.4370, lng: 24.7536 },
      status: "radar"
    },
    {
      id: "osaka",
      name: "Osaka Marathon",
      url: "https://half.osaka-marathon.jp/",
      date: "Jan 25, 2025",
      image: "pictures/osaka.jpeg",
      location: { lat: 34.6937, lng: 135.5023 },
      status: "radar"
    },
    {
      id: "great-wall",
      name: "Great Wall Marathon",
      url: "https://great-wall-marathon.com/",
      date: "May 16, 2026",
      image: "pictures/china.avif",
      location: { lat: 40.3240, lng: 116.6383 },
      status: "radar"
    },
    {
      id: "bangkok",
      name: "Bangkok Marathon",
      url: "https://www.bkkmarathon.com/home",
      date: "Nov 16, 2025",
      image: "pictures/bangkok.webp",
      location: { lat: 13.7563, lng: 100.5018 },
      status: "radar"
    },
    {
      id: "mallorca",
      name: "Mallorca Marathon",
      url: "https://www.palmademallorcamarathon.com/english/registration",
      date: "Nov 2, 2025",
      image: "pictures/mallorca.png",
      location: { lat: 39.5696, lng: 2.6502 },
      status: "radar"
    },
    {
      id: "liege",
      name: "Beerlovers Marathon",
      url: "https://www.visitezliege.be/en/offre/beerlovers-marathon",
      date: "March 15, 2025",
      image: "pictures/beer.jpeg",
      location: { lat: 50.6326, lng: 5.5797 },
      status: "radar"
    },
    {
      id: "venice",
      name: "Venice Half",
      url: "https://www.venicemarathon.it/en/21k-en",
      date: "Oct 26, 2025",
      image: "pictures/venice.webp",
      location: { lat: 45.4408, lng: 12.3155 },
      status: "radar"
    },
    {
      id: "copenhagen",
      name: "Bun Run Copenhagen",
      url: "https://www.tipster.io/event/",
      image: "pictures/bunss.jpeg",
      location: { lat: 55.6761, lng: 12.5683 },
      status: "radar"
    },
    {
      id: "fuji",
      name: "Fuji Marathon",
      url: "https://mtfujimarathon.com/eninfo/regarding-the-mt-fuji-international-marathon-2025-date/",
      date: "Dec 27, 2025",
      image: "pictures/fuji.jpg",
      location: { lat: 35.4876, lng: 138.7770 },
      status: "radar"
    },
    {
      id: "dubai",
      name: "Krispy Kreme Fun Run, Dubai",
      url: "https://raceme.ae/events/run/",
      date: "Dec 2025",
      image: "pictures/donut.jpg",
      location: { lat: 25.2048, lng: 55.2708 },
      status: "radar"
    },
    {
      id: "paris",
      name: "Paris Half",
      url: "https://www.hokasemideparis.fr/en/",
      date: "March 8, 2026",
      image: "pictures/paris.webp",
      location: { lat: 48.8566, lng: 2.3522 },
      status: "radar"
    },
    {
      id: "mexico",
      name: "Mexico City Half",
      url: "https://raceroster.com/events/2025/101032/xviii-half-marathon-mexico-city-bbva-2025",
      date: "Jul 13, 2025",
      image: "pictures/mexico-2.jpg",
      location: { lat: 19.4326, lng: -99.1332 },
      status: "radar"
    },
    {
      id: "ha-giang",
      name: "Ha Giang",
      url: "https://racejungle.com/pages/ha-giang-discovery-marathon-en",
      date: "Feb 21–23, 2025",
      image: "pictures/hagiang.webp",
      location: { lat: 22.8233, lng: 104.9836 },
      status: "radar"
    },
    {
      id: "great-ocean",
      name: "Great Ocean Race, Australia",
      url: "https://greatoceanroadrunfest.com.au/",
      date: "May 16–17, 2026",
      image: "pictures/aus.jpg",
      location: { lat: -38.5420, lng: 143.9735 },
      status: "radar"
    },
    {
      id: "angkor",
      name: "Angkor Empire Marathon",
      url: "https://www.cambodia-events.org/angkor-empire-full-marathon/",
      date: "Aug 3, 2025",
      image: "pictures/angkor.webp",
      location: { lat: 13.3633, lng: 103.8564 },
      status: "radar"
    },
    {
      id: "petra",
      name: "Petra Desert Marathon", 
      url: "https://petra-desert-marathon.com/",
      date: "Sep 6, 2025",
      image: "pictures/petra.jpg",
      location: { lat: 30.3285, lng: 35.4444 },
      status: "radar"
    }
  ],

  // Past races
  past: [
    {
      id: "brussels",
      name: "10k Polish Run",
      url: "https://prod.chronorace.be/registration/SelectActivity.aspx?eventId=2141127096537293&iframe=1&lng=EN&cs=POLISHRUN",
      date: "Sept 6, 2025",
      image: "pictures/polish.jpg",
      location: { lat: 50.8503, lng: 4.3517 },
      status: "past"
    }
  ]
};

// Function to save races data (for future admin interface)
function saveRacesData(data) {
  localStorage.setItem('racesData', JSON.stringify(data));
}

// Function to load races data from localStorage or use default
function loadRacesData() {
  const saved = localStorage.getItem('racesData');
  return saved ? JSON.parse(saved) : racesData;
}

// AI-suggested races (for approval system)
let suggestedRaces = [];

// Function to suggest new races (AI simulation)
function suggestRace(raceData) {
  suggestedRaces.push({
    ...raceData,
    id: 'suggested-' + Date.now(),
    status: 'suggested',
    suggestedDate: new Date().toISOString()
  });
  return suggestedRaces;
}

// Function to approve suggested race
function approveSuggestedRace(suggestedId, category = 'radar') {
  const suggestedIndex = suggestedRaces.findIndex(r => r.id === suggestedId);
  if (suggestedIndex !== -1) {
    const approvedRace = {
      ...suggestedRaces[suggestedIndex],
      id: suggestedRaces[suggestedIndex].id.replace('suggested-', ''),
      status: category
    };
    delete approvedRace.suggestedDate;
    
    racesData[category].push(approvedRace);
    suggestedRaces.splice(suggestedIndex, 1);
    
    saveRacesData(racesData);
    return approvedRace;
  }
  return null;
}

// Function to reject suggested race
function rejectSuggestedRace(suggestedId) {
  const suggestedIndex = suggestedRaces.findIndex(r => r.id === suggestedId);
  if (suggestedIndex !== -1) {
    suggestedRaces.splice(suggestedIndex, 1);
    return true;
  }
  return false;
}