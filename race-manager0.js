// Race Manager - Automated system for managing and displaying races
class RaceManager {
  constructor() {
    this.races = loadRacesData();
    this.suggestedRaces = [];
    this.init();
  }

  init() {
    this.renderRaces();
    this.updateGlobe();
    this.setupEventListeners();
  }

  // Render all races in the appropriate sections
  renderRaces() {
    const raceList = document.getElementById('race-list');
    if (!raceList) return;

    raceList.innerHTML = '';

    // Confirmed races section
    if (this.races.confirmed.length > 0) {
      const confirmedHeader = document.createElement('h3');
      confirmedHeader.textContent = 'These are happening!!!';
      raceList.appendChild(confirmedHeader);

      this.races.confirmed.forEach(race => {
        raceList.appendChild(this.createRaceElement(race));
      });
    }

    // Radar races section
    if (this.races.radar.length > 0) {
      const radarHeader = document.createElement('h3');
      radarHeader.textContent = 'On the radar:';
      raceList.appendChild(radarHeader);

      this.races.radar.forEach(race => {
        raceList.appendChild(this.createRaceElement(race));
      });
    }

    // Past races section
    if (this.races.past.length > 0) {
      const pastHeader = document.createElement('h3');
      pastHeader.textContent = 'Past Runs ✓';
      raceList.appendChild(pastHeader);

      this.races.past.forEach(race => {
        raceList.appendChild(this.createRaceElement(race));
      });
    }

    // Suggested races section (for admin)
    if (this.suggestedRaces.length > 0) {
      const suggestedHeader = document.createElement('h3');
      suggestedHeader.textContent = 'Suggested Races (Pending Approval)';
      suggestedHeader.style.color = '#ff6b35';
      raceList.appendChild(suggestedHeader);

      this.suggestedRaces.forEach(race => {
        raceList.appendChild(this.createSuggestedRaceElement(race));
      });
    }
  }

  // Create HTML element for a race
  createRaceElement(race) {
    const raceDiv = document.createElement('div');
    raceDiv.className = 'race-item';
    raceDiv.id = race.id;

    let raceHTML = `<a href="${race.url}" target="_blank">${race.name}</a>`;
    
    if (race.date) {
      raceHTML += ` — <span class="date">${race.date}</span>`;
    }

    if (race.image) {
      raceHTML += `<img src="${race.image}" alt="${race.name}" />`;
    }

    raceDiv.innerHTML = raceHTML;
    return raceDiv;
  }

  // Create HTML element for a suggested race with approval controls
  createSuggestedRaceElement(race) {
    const raceDiv = document.createElement('div');
    raceDiv.className = 'race-item suggested-race';
    raceDiv.id = race.id;
    raceDiv.style.border = '2px dashed #ff6b35';
    raceDiv.style.backgroundColor = '#fff8f5';

    let raceHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <a href="${race.url}" target="_blank">${race.name}</a>
          ${race.date ? ` — <span class="date">${race.date}</span>` : ''}
          <span style="color: #ff6b35; font-size: 0.8em; margin-left: 10px;">(Suggested)</span>
        </div>
        <div class="approval-controls" style="display: flex; gap: 10px;">
          <button onclick="raceManager.approveRace('${race.id}', 'confirmed')" 
                  style="background: #4CAF50; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Confirm
          </button>
          <button onclick="raceManager.approveRace('${race.id}', 'radar')" 
                  style="background: #2196F3; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Add to Radar
          </button>
          <button onclick="raceManager.rejectRace('${race.id}')" 
                  style="background: #f44336; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">
            Reject
          </button>
        </div>
      </div>
    `;

    if (race.image) {
      raceHTML += `<img src="${race.image}" alt="${race.name}" />`;
    }

    raceDiv.innerHTML = raceHTML;
    return raceDiv;
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

  // Suggest a new race (for AI agent)
  suggestRace(raceData) {
    const suggestedRace = {
      ...raceData,
      id: 'suggested-' + Date.now(),
      status: 'suggested',
      suggestedDate: new Date().toISOString()
    };

    this.suggestedRaces.push(suggestedRace);
    this.renderRaces();
    return suggestedRace;
  }

  // Approve a suggested race
  approveRace(suggestedId, category) {
    const suggestedIndex = this.suggestedRaces.findIndex(r => r.id === suggestedId);
    if (suggestedIndex !== -1) {
      const approvedRace = {
        ...this.suggestedRaces[suggestedIndex],
        id: this.suggestedRaces[suggestedIndex].id.replace('suggested-', ''),
        status: category
      };
      delete approvedRace.suggestedDate;

      this.races[category].push(approvedRace);
      this.suggestedRaces.splice(suggestedIndex, 1);
      
      this.saveAndRefresh();
      return approvedRace;
    }
    return null;
  }

  // Reject a suggested race
  rejectRace(suggestedId) {
    const suggestedIndex = this.suggestedRaces.findIndex(r => r.id === suggestedId);
    if (suggestedIndex !== -1) {
      this.suggestedRaces.splice(suggestedIndex, 1);
      this.renderRaces();
      return true;
    }
    return false;
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
    this.renderRaces();
    this.updateGlobe();
  }

  // Setup event listeners for admin controls
  setupEventListeners() {
    // Add race form listener (if form exists)
    const addRaceForm = document.getElementById('add-race-form');
    if (addRaceForm) {
      addRaceForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddRace(new FormData(addRaceForm));
      });
    }

    // AI suggestion button listener
    const suggestButton = document.getElementById('ai-suggest-races');
    if (suggestButton) {
      suggestButton.addEventListener('click', () => {
        this.simulateAISuggestions();
      });
    }
  }

  // Handle add race form submission
  handleAddRace(formData) {
    const raceData = {
      name: formData.get('name'),
      url: formData.get('url'),
      date: formData.get('date'),
      image: formData.get('image'),
      location: {
        lat: parseFloat(formData.get('lat')),
        lng: parseFloat(formData.get('lng'))
      }
    };

    const category = formData.get('category') || 'radar';
    this.addRace(raceData, category);
    
    // Reset form
    document.getElementById('add-race-form').reset();
  }

  // Simulate AI race suggestions
  simulateAISuggestions() {
    const potentialRaces = [
      {
        name: "Tokyo Marathon",
        url: "https://www.marathon.tokyo/en/",
        date: "March 1, 2026",
        image: "pictures/tokyo.jpg",
        location: { lat: 35.6762, lng: 139.6503 }
      },
      {
        name: "Boston Marathon",
        url: "https://www.baa.org/races/boston-marathon",
        date: "April 20, 2026", 
        image: "pictures/boston.jpg",
        location: { lat: 42.3601, lng: -71.0589 }
      },
      {
        name: "London Marathon",
        url: "https://www.virginmoneylondonmarathon.com/",
        date: "April 26, 2026",
        image: "pictures/london.jpg", 
        location: { lat: 51.5074, lng: -0.1278 }
      }
    ];

    // Randomly suggest 1-2 races
    const numSuggestions = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < numSuggestions; i++) {
      const randomRace = potentialRaces[Math.floor(Math.random() * potentialRaces.length)];
      this.suggestRace(randomRace);
    }
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