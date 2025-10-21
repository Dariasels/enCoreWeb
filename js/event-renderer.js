import { auth, db } from './firebase-config.js';
import {
  collection, doc, query, where, onSnapshot,
  updateDoc, arrayUnion, arrayRemove, addDoc, serverTimestamp, orderBy
} from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

export class EventRenderer {
  constructor(destDivId, status, sport, singleRace = null) {
    this.container = document.getElementById(destDivId);
    this.status    = status;
    this.sport     = sport;
    if (singleRace) this.renderCard(singleRace);
    else            this.listenForRealTimeAdds();
  }

  /* ----------  REAL-TIME FETCH  ---------- */
  listenForRealTimeAdds() {
    const q = query(collection(db, 'events'),
                    where('sport',  '==', this.sport),
                    where('status', '==', this.status));
    onSnapshot(q, snap => {
      this.container.innerHTML = '';
      snap.forEach(d => this.renderCard(d.data(), d.id));
    });
  }

  /* ----------  SINGLE CARD  ---------- */
  renderCard(e, id) {
    const div = document.createElement('div');
    div.className = 'event-card';
    div.innerHTML = `
      <h4>${e.name}</h4>
      <p>${e.date || ''} – ${e.location || ''}</p>

      <!-- ATTENDANCE -->
      <div class="going">
        <span id="count-${id}">${e.going?.length || 0}</span> going
        <span class="avatars" id="av-${id}"></span>
      </div>
      <button class="join-btn" data-id="${id}">
        ${e.going?.includes(auth.currentUser?.uid) ? 'Leave' : 'I’m in!'}
      </button>

      <!-- CHAT -->
      <div class="chat-box" id="chat-${id}" style="display:none">
        <input class="chat-input" data-id="${id}" placeholder="say something…">
        <div class="chat-log"></div>
      </div>
      <button class="open-chat" data-id="${id}">Open chat</button>
    `;
    this.container.appendChild(div);
    this.attachListeners(id, e);
  }

  /* ----------  ATTENDANCE + CHAT LISTENERS  ---------- */
  attachListeners(id, e) {
    /* ---- join / leave ---- */
    const joinBtn = document.querySelector(`button[data-id="${id}"].join-btn`);
    joinBtn.onclick = async () => {
      if (!auth.currentUser) return alert('Please login');
      const ref = doc(db, 'events', id);
      const iam = e.going?.includes(auth.currentUser.uid);
      await updateDoc(ref, {
        going: iam ? arrayRemove(auth.currentUser.uid) : arrayUnion(auth.currentUser.uid)
      });
    };

    /* ---- live attendance ---- */
    onSnapshot(doc(db, 'events', id), snap => {
      const data = snap.data();
      const count = document.getElementById(`count-${id}`);
      const av    = document.getElementById(`av-${id}`);
      const btn   = joinBtn;
      count.textContent = data.going?.length || 0;
      av.innerHTML = (data.going || []).slice(0, 5).map(uid =>
        `<img src="https://robohash.org/${uid}?size=24x24" title="${uid}">`
      ).join('');
      btn.textContent = data.going?.includes(auth.currentUser?.uid) ? 'Leave' : 'I’m in!';
    });

    /* ---- open chat ---- */
    document.querySelector(`button[data-id="${id}"].open-chat`).onclick = () => {
      document.getElementById(`chat-${id}`).style.display = 'block';
      this.watchChat(id);
    };
  }

  /* ----------  REAL-TIME CHAT  ---------- */
  watchChat(id) {
    const log = document.querySelector(`#chat-${id} .chat-log`);
    const q   = query(collection(db, 'events', id, 'chats'), orderBy('ts'));
    onSnapshot(q, snap => {
      log.innerHTML = '';
      snap.forEach(c => {
        const m = c.data();
        log.insertAdjacentHTML('beforeend', `<p><b>${m.name}:</b> ${m.text}</p>`);
      });
      log.scrollTop = log.scrollHeight;
    });
  }
}

/* ----------  GLOBAL SEND-MESSAGE LISTENER  ---------- */
document.addEventListener('keydown', e => {
  if (!e.target.classList.contains('chat-input') || e.key !== 'Enter') return;
  const raceId = e.target.dataset.id;
  const text   = e.target.value.trim();
  if (!text || !auth.currentUser) return;

  addDoc(collection(db, 'events', raceId, 'chats'), {
    uid:  auth.currentUser.uid,
    name: auth.currentUser.displayName || auth.currentUser.email.split('@')[0],
    text,
    ts:   serverTimestamp()
  });
  e.target.value = '';
});