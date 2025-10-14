import { db, auth } from "./firebase-config.js";
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

window.openChat = (eventId)=>{
  const aside = document.createElement('aside');
  aside.style.cssText = 'position:fixed; inset:10% 20%; background:#fff; color:#000; border-radius:12px; display:flex; flex-direction:column; padding:1rem; z-index:1000';
  aside.innerHTML = `
    <h3>Chat</h3>
    <div id="msgBox" style="flex:1; overflow:auto; border:1px solid #ddd; padding:.5rem"></div>
    <input id="msgInput" placeholder="type…" style="margin-top:.5rem">
    <button onclick="this.parentElement.remove()">Close</button>`;
  document.body.appendChild(aside);

  const msgBox = document.getElementById('msgBox');
  const q = query(collection(db,'events',eventId,'messages'), orderBy('time'));
  onSnapshot(q, snap=>{
    msgBox.innerHTML='';
    snap.forEach(m=>{
      const div = document.createElement('div');
      div.textContent = `${m.data().name}: ${m.data().text}`;
      msgBox.appendChild(div);
    });
    msgBox.scrollTop=1e9;
  });

  document.getElementById('msgInput').onkeyup = async e=>{
    if(e.key!=='Enter') return;
    if(!auth.currentUser) return;
    await addDoc(collection(db,'events',eventId,'messages'),{
      text: e.target.value,
      name: auth.currentUser.displayName,
      time: serverTimestamp()
    });
    e.target.value='';
  };
};