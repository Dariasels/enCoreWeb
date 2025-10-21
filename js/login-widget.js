import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { auth } from './firebase-config.js';

export function injectLoginWidget() {
  if (document.getElementById('authWidget')) return; // already injected

  const widget = document.createElement('div');
  widget.id = 'authWidget';
  widget.className = 'login-widget';
  widget.innerHTML = `
    <a href="profile-page.html" id="profileLink" style="display:none;">
      <img id="userImg" src="" style="width:32px;height:32px;border-radius:50%;cursor:pointer;" title="My Profile">
    </a>
    <span id="userName"></span>
    <button id="loginOutBtn">Login</button>
  `;
  document.body.appendChild(widget);

  const profileLink = document.getElementById('profileLink');
  const img = document.getElementById('userImg');
  const name = document.getElementById('userName');
  const btn = document.getElementById('loginOutBtn');

  onAuthStateChanged(auth, user => {
    if (user) {
      img.src = user.photoURL;
      profileLink.style.display = 'block';
      name.textContent = user.displayName?.split(' ')[0];
      btn.textContent = 'Logout';
    } else {
      profileLink.style.display = 'none';
      name.textContent = '';
      btn.textContent = 'Login';
    }
  });

  btn.onclick = () => auth.currentUser ? signOut(auth) : location = 'login.html';
}