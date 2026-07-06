// Live likes + participation for race cards.
// Data lives in Firestore under events/{raceId}:
//   likes: [uid, ...]   -> everyone sees the same vote count, in real time
//   going: [uid, ...]   -> who pressed "I'm in" (managed on race-details.html)
// Anyone can look; you must be logged in to vote or join (see firestore.rules).
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { auth, db } from './firebase-config.js';
import {
  collection, doc, getDoc, setDoc, updateDoc,
  arrayUnion, arrayRemove, onSnapshot
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

let currentUser = null;
const eventData = new Map();   // raceId -> Firestore doc data
const nameCache = new Map();   // uid -> display name

export function initRaceSocial() {
  onAuthStateChanged(auth, user => {
    currentUser = user;
    refreshAllCards();
  });

  // One listener for the whole events collection keeps every card live.
  onSnapshot(collection(db, 'events'), snap => {
    snap.docChanges().forEach(change => {
      eventData.set(change.doc.id, change.doc.data());
      refreshCard(change.doc.id);
    });
  }, err => console.error('events listener error:', err));

  // Re-decorate once cards exist (race-manager renders on DOMContentLoaded).
  document.addEventListener('races-rendered', refreshAllCards);

  document.addEventListener('click', e => {
    const btn = e.target.closest('.like-btn');
    if (btn) toggleLike(btn.dataset.raceId);
  });
}

function refreshAllCards() {
  document.querySelectorAll('.like-btn[data-race-id]').forEach(btn => {
    refreshCard(btn.dataset.raceId);
  });
}

function refreshCard(raceId) {
  const data = eventData.get(raceId) || {};
  const likes = data.likes || [];
  const going = data.going || [];

  const btn = document.querySelector(`.like-btn[data-race-id="${raceId}"]`);
  if (btn) {
    const liked = !!currentUser && likes.includes(currentUser.uid);
    btn.classList.toggle('liked', liked);
    btn.querySelector('i').className = `fa-${liked ? 'solid' : 'regular'} fa-heart`;
    btn.querySelector('.like-count').textContent = likes.length;
  }

  const avatarDiv = document.getElementById(`going-${raceId}`);
  if (avatarDiv) renderAvatars(avatarDiv, going);
}

async function renderAvatars(container, uids) {
  const limit = 5;
  container.innerHTML = '';

  for (const uid of uids.slice(0, limit)) {
    const img = document.createElement('img');
    img.src = `https://robohash.org/${encodeURIComponent(uid)}?size=32x32`;
    img.title = 'Runner';
    img.alt = 'Runner';
    img.addEventListener('click', () => {
      window.location.href = `profile-page.html?uid=${encodeURIComponent(uid)}`;
    });
    container.appendChild(img);
    // Names load lazily; logged-out visitors just see the avatars.
    displayNameFor(uid).then(name => { if (name) { img.title = name; img.alt = name; } });
  }

  if (uids.length > limit) {
    const more = document.createElement('span');
    more.className = 'going-more';
    more.textContent = `+${uids.length - limit} more`;
    container.appendChild(more);
  }
}

async function displayNameFor(uid) {
  if (nameCache.has(uid)) return nameCache.get(uid);
  if (!currentUser) return null; // user profiles are only readable when logged in
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    const name = snap.exists()
      ? (snap.data().displayName || snap.data().name || null)
      : null;
    nameCache.set(uid, name);
    return name;
  } catch {
    return null;
  }
}

async function toggleLike(raceId) {
  if (!currentUser) {
    sessionStorage.setItem('redirectAfterLogin', window.location.href);
    window.location.href = 'login.html';
    return;
  }

  const ref = doc(db, 'events', raceId);
  const data = eventData.get(raceId);

  try {
    if (!data) {
      // First interaction with this race: create its Firestore doc.
      const race = window.raceUtils?.getRace(raceId);
      await setDoc(ref, {
        id: raceId,
        name: race?.name || raceId,
        date: race?.date || '',
        url: race?.url || '',
        image: race?.image || '',
        location: race?.location || null,
        sport: 'running',
        status: race?.status || 'radar',
        going: [],
        likes: [currentUser.uid]
      });
    } else {
      const liked = (data.likes || []).includes(currentUser.uid);
      await updateDoc(ref, {
        likes: liked ? arrayRemove(currentUser.uid) : arrayUnion(currentUser.uid)
      });
    }
  } catch (err) {
    console.error('Could not update like:', err);
    alert('Could not save your vote — please try again.');
  }
}
