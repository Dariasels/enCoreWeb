// Add this to your login.html or wherever you handle successful login
// This checks if user has completed their profile and redirects accordingly

import { auth, db } from './js/firebase-config.js';
import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // User is signed in
    console.log('User logged in:', user.email);
    
    try {
      // Check if user profile exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists() || !userDoc.data().profileComplete) {
        // First time user or incomplete profile - redirect to profile setup
        console.log('Redirecting to profile setup...');
        window.location.href = 'profile-setup.html';
      } else {
        // Existing user with complete profile - redirect to dashboard or homepage
        console.log('Profile complete, redirecting to dashboard...');
        
        // Get the redirect URL from session storage (if they were trying to access a specific page)
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
        sessionStorage.removeItem('redirectAfterLogin');
        
        window.location.href = redirectUrl || 'my-runs.html';
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      // On error, still redirect to profile setup to be safe
      window.location.href = 'profile-setup.html';
    }
  } else {
    // User is signed out
    console.log('No user logged in');
  }
});

// Helper function to save current page before redirecting to login
// Call this from protected pages
export function requireAuth() {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      // Save current page to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      window.location.href = 'login.html';
    }
  });
}