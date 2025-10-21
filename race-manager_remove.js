// Race Manager - Automated system for managing and displaying races
class RaceManager {
  constructor() {
    this.races = loadRacesData();
    this.suggestedRaces = [];
    this.init();
  }

  init() {
    console.log('Race Manager initialized');
    console.log('Races loaded:', this.races);
    this.renderRacesBySeason();
    this.updateGlobe();
    this.setupLikeListeners();
  }

  // Render races by season
  renderRacesBySeason() {
    const seasons = {
      'fw': { confirmed: [], radar: [], past: [] },
      'ss': { confirmed: [], radar: [], past: [] }
    };

    console.log('Starting to categorize races...');

    // Categorize races by season
    ['confirmed', 'radar', 'past'].forEach(status => {
      this.races[status].forEach(race => {
        const season = this.getSeason(race.date);
        console.log(`Race: ${race.name}, Date: ${race.date}, Season: ${season}, Status: ${status}`);
        seasons[season][status].push(race);
      });
    });

    console.log('Categorized races:', seasons);

    // Render each season and status
    Object.keys(seasons).forEach(season => {
      Object.keys(seasons[season]).forEach(status => {
        const containerId = `${season}-${status}`;
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
          seasons[season][status].forEach(race => {
            container.appendChild(this.createRaceCard(race));
          });
          console.log(`Rendered ${seasons[season][status].length} races to ${containerId}`);
        } else {
          console.warn(`Container not found: ${containerId}`);
        }
      });
    });
  }

  // Determine season from date
  getSeason(dateStr) {
    if (!dateStr) return 'fw';
    const dateLower = dateStr.toLowerCase();
    
    // Fall-Winter: Sep, Oct, Nov, Dec, Jan, Feb (months 9-12, 1-2)
    const fallWinter = ['sep', 'oct', 'nov', 'dec', 'jan', 'feb', 'sept', 'september', 'october', 'november', 'december', 'january', 'february'];
    
    // Spring-Summer: Mar, Apr, May, Jun, Jul, Aug (months 3-8)
    const springSummer = ['mar', 'apr', 'may', 'jun', 'jul', 'aug', 'march', 'april', 'june', 'july', 'august'];
    
    // Check for fall-winter months
    for (let month of fallWinter) {
      if (dateLower.includes(month)) {
        return 'fw';
      }
    }
    
    // Check for spring-summer months
    for (let month of springSummer) {
      if (dateLower.includes(month)) {
        return 'ss';
      }
    }
    
    return 'fw'; // default
  }

  // Create interactive race card
  createRaceCard(race) {
    const card = document.createElement('div');
    card.className = 'race-card';
    card.id = race.id;

    const likes = this.getLikes(race.id);
    const userLiked = this.hasUserLiked(race.id);

    card.innerHTML = `
      <div class="race-card-content">
        ${race.image ? `<img src="${race.image}" alt="${race.name}" class="race-image" />` : ''}
        <div class="race-details">
          <h4>${race.name}</h4>
          ${race.date ? `<p class="race-date"><i class="fa-regular fa-calendar"></i> ${race.date}</p>` : ''}
          
          <div class="race-actions">
            <button class="like-btn ${userLiked ? 'liked' : ''}" data-race-id="${race.id}">
              <i class="fa-${userLiked ? 'solid' : 'regular'} fa-heart"></i>
              <span class="like-count">${likes}</span>
            </button>
            
            ${race.status !== 'past' ? `
              <a href="race-details.html?id=${race.id}" class="join-btn">
                <i class="fa-solid fa-running"></i> Join Run
              </a>
            ` : ''}
            
            <a href="${race.url}" target="_blank" class="info-btn">
              <i class="fa-solid fa-circle-info"></i> Info
            </a>
          </div>

          <div class="going-avatars" id="going-${race.id}">
            <!-- Avatars will be rendered here -->
          </div>
        </div>
      </div>
    `;

    return card;
  }

  // Update globe visualization with current race data
  updateGlobe() {
    const allRaces = [
      ...this.races.confirmed,
      ...this.races.radar,
      ...this.races.past
    ];

    const pins = allRaces.map(race => ({
      lat: race.location.lat,
      lng: race.location.lng,
      label: race.name.split(',')[0], // First part of name for cleaner labels
      link: `#${race.id}`,
      size: race.status === 'confirmed' ? 0.1 : 0.05, // Bigger pins for confirmed races
      color: race.status === 'past' ? '#888' : 
             race.status === 'confirmed' ? '#ff6b35' : '#ffa500'
    }));

    // Update the globe if it exists
    if (window.globe) {
      window.globe.pointsData(pins);
    }
  }

  // Add a new race
  addRace(raceData, category = 'radar') {
    const newRace = {
      ...raceData,
      id: raceData.id || this.generateId(raceData.name),
      status: category
    };

    this.races[category].push(newRace);
    this.saveAndRefresh();
    return newRace;
  }

  // Remove a race
  removeRace(raceId, category) {
    const raceIndex = this.races[category].findIndex(r => r.id === raceId);
    if (raceIndex !== -1) {
      this.races[category].splice(raceIndex, 1);
      this.saveAndRefresh();
      return true;
    }
    return false;
  }

  // Move race between categories
  moveRace(raceId, fromCategory, toCategory) {
    const raceIndex = this.races[fromCategory].findIndex(r => r.id === raceId);
    if (raceIndex !== -1) {
      const race = this.races[fromCategory].splice(raceIndex, 1)[0];
      race.status = toCategory;
      this.races[toCategory].push(race);
      this.saveAndRefresh();
      return race;
    }
    return null;
  }

  // Generate ID from race name
  generateId(name) {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  // Save data and refresh display
  saveAndRefresh() {
    saveRacesData(this.races);
    this.renderRacesBySeason();
    this.updateGlobe();
  }

  // Like management
  getLikes(raceId) {
    const likes = this.loadLikes();
    return likes[raceId] || 0;
  }

  hasUserLiked(raceId) {
    const userId = this.getCurrentUserId();
    if (!userId) return false;
    
    const userLikes = this.loadUserLikes();
    return userLikes.includes(raceId);
  }

  toggleLike(raceId) {
    const userId = this.getCurrentUserId();
    if (!userId) {
      alert('Please log in to like races!');
      return;
    }

    const likes = this.loadLikes();
    const userLikes = this.loadUserLikes();
    
    if (userLikes.includes(raceId)) {
      // Unlike
      likes[raceId] = (likes[raceId] || 1) - 1;
      const index = userLikes.indexOf(raceId);
      userLikes.splice(index, 1);
    } else {
      // Like
      likes[raceId] = (likes[raceId] || 0) + 1;
      userLikes.push(raceId);
    }

    this.saveLikes(likes);
    this.saveUserLikes(userLikes);
    this.renderRacesBySeason();
  }

  loadLikes() {
    const saved = localStorage.getItem('raceLikes');
    return saved ? JSON.parse(saved) : {};
  }

  saveLikes(likes) {
    localStorage.setItem('raceLikes', JSON.stringify(likes));
  }

  loadUserLikes() {
    const userId = this.getCurrentUserId();
    if (!userId) return [];
    
    const saved = localStorage.getItem(`userLikes_${userId}`);
    return saved ? JSON.parse(saved) : [];
  }

  saveUserLikes(userLikes) {
    const userId = this.getCurrentUserId();
    if (!userId) return;
    
    localStorage.setItem(`userLikes_${userId}`, JSON.stringify(userLikes));
  }

  getCurrentUserId() {
    // Get current user from Firebase auth
    if (window.auth && window.auth.currentUser) {
      return window.auth.currentUser.uid;
    }
    return null;
  }

  // Setup like button listeners
  setupLikeListeners() {
    document.addEventListener('click', (e) => {
      if (e.target.closest('.like-btn')) {
        const button = e.target.closest('.like-btn');
        const raceId = button.dataset.raceId;
        this.toggleLike(raceId);
      }
    });
  }

  // Export races data
  exportData() {
    return {
      races: this.races,
      suggested: this.suggestedRaces,
      exportDate: new Date().toISOString()
    };
  }

  // Import races data
  importData(data) {
    if (data.races) {
      this.races = data.races;
    }
    if (data.suggested) {
      this.suggestedRaces = data.suggested;
    }
    this.saveAndRefresh();
  }
}

// Initialize race manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.raceManager = new RaceManager();
});