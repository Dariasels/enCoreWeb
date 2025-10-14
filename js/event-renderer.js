import { db, auth } from "./firebase-config.js";
import { collection, doc, getDocs, addDoc, onSnapshot, query, where, updateDoc, arrayUnion, arrayRemove } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

export class EventRenderer{
  constructor(containerId, category, sport='running'){
    this.container = document.getElementById(containerId);
    this.category  = category;        // past | confirmed | radar
    this.sport     = sport;
    this.unsub     = null;
    this.init();
  }
  init(){
    const q = query(collection(db, 'events'),
                    where('sport','==',this.sport),
                    where('status','==',this.category));
    this.unsub = onSnapshot(q, snap=>{
      this.container.innerHTML='';
      snap.forEach(d=>this.renderCard(d.data(), d.id));
    });
  }
  renderCard(e, id){
    const div = document.createElement('div'); div.className='event-card';
    div.innerHTML = `
      <h4>${e.name}</h4>
      <p>${e.date} – ${e.location}</p>
      <div class="going">
        <span id="count-${id}">${e.going?.length||0}</span> going
        <span class="avatars" id="av-${id}"></span>
      </div>
      <button class="chat" onclick="openChat('${id}')">Open chat</button>
      <button id="toggle-${id}">I'm in</button>`;
    this.container.appendChild(div);

    const toggleBtn = document.getElementById(`toggle-${id}`);
    const refresh = ()=>{
      const u = auth.currentUser;
      const iam = e.going?.includes(u?.uid);
      toggleBtn.textContent = iam ? 'Leave' : 'Join';
      document.getElementById(`count-${id}`).textContent = e.going?.length||0;
      const av = document.getElementById(`av-${id}`);
      av.innerHTML='';
      e.going?.slice(0,5).forEach(uid=>{
         // you can store avatars in /users/uid/photoURL
         const img=new Image(24,24); img.src=`https://ui-avatars.com/api/?name=${uid}`; av.appendChild(img);
      });
    };
    refresh();
    toggleBtn.onclick = async ()=>{
      if(!auth.currentUser){ alert('Please login'); return; }
      const ref = doc(db,'events',id);
      if(e.going?.includes(auth.currentUser.uid)){
        await updateDoc(ref, { going: arrayRemove(auth.currentUser.uid) });
      }else{
        await updateDoc(ref, { going: arrayUnion(auth.currentUser.uid) });
      }
    };
    onSnapshot(doc(db,'events',id), d=>{ e=d.data(); refresh(); });
  }
}