// Race Manager - renders race cards grouped by season and status.
// Status ("past" vs upcoming) is computed automatically from the race date
// by raceUtils (see races-data.js). Likes and participation are live data
// from Firestore, wired up by js/race-social.js.
class RaceManager {
  constructor() {
    this.races = racesData;
    this.renderRacesBySeason();
  }

  renderRacesBySeason() {
    const seasons = {
      'fw': { confirmed: [], radar: [], past: [] },
      'ss': { confirmed: [], radar: [], past: [] }
    };

    raceUtils.allRaces().forEach(race => {
      const status = raceUtils.effectiveStatus(race);
      const season = raceUtils.getSeason(race);
      seasons[season][status].push(race);
    });

    Object.keys(seasons).forEach(season => {
      Object.keys(seasons[season]).forEach(status => {
        const container = document.getElementById(`${season}-${status}`);
        if (!container) return;
        container.innerHTML = '';
        raceUtils.sortByDate(seasons[season][status]).forEach(race => {
          container.appendChild(this.createRaceCard(race));
        });
      });
    });
  }

  createRaceCard(race) {
    const status = raceUtils.effectiveStatus(race);
    const card = document.createElement('div');
    card.className = `race-card ${status === 'past' ? 'race-card-past' : ''}`;
    card.id = race.id;

    card.innerHTML = `
      <div class="race-card-content">
        ${race.image ? `<img src="${race.image}" alt="${race.name}" class="race-image" loading="lazy" />` : ''}
        <div class="race-details">
          <h4>${race.name}</h4>
          <p class="race-date"><i class="fa-regular fa-calendar"></i> ${raceUtils.formatDate(race)}</p>

          <div class="race-actions">
            <button class="like-btn" data-race-id="${race.id}" title="Vote for this race">
              <i class="fa-regular fa-heart"></i>
              <span class="like-count">0</span>
            </button>

            ${status !== 'past' ? `
              <a href="race-details.html?id=${race.id}" target="_self" class="join-btn">
                <i class="fa-solid fa-running"></i> Join Run
              </a>
            ` : ''}

            <a href="${race.url}" target="_blank" rel="noopener" class="info-btn">
              <i class="fa-solid fa-circle-info"></i> Info
            </a>
          </div>

          <div class="going-avatars" id="going-${race.id}"></div>
        </div>
      </div>
    `;

    return card;
  }

  // Pin data for the globe visualisation
  globePins() {
    return raceUtils.allRaces().map(race => {
      const status = raceUtils.effectiveStatus(race);
      return {
        lat: race.location.lat,
        lng: race.location.lng,
        label: race.name.split(',')[0],
        link: `#${race.id}`,
        size: status === 'confirmed' ? 0.1 : 0.05,
        color: status === 'past' ? '#888' :
               status === 'confirmed' ? '#ff6b35' : '#ffa500'
      };
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.raceManager = new RaceManager();
  document.dispatchEvent(new Event('races-rendered'));
});
