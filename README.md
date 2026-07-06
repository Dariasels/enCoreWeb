# enCore — run the world together

A website to organize (half) marathons around the world with friends: browse races,
vote for the ones you'd actually attend, hit "I'm in", and chat with the other runners.

## How the site works now

**Automatic race updates** — all races live in `races-data.js`. Each race has an ISO
`date` ("2026-02-15"). Races whose date has passed move to "Past Runs" **automatically**;
you never move them by hand. When the next edition of a race is announced, just update
its `date` (and `url`) and it jumps back to the upcoming section on its own. Races
without a fixed date get `date: null` and an optional human `dateText` like
"Late October (yearly)" — they stay "on the radar".

**Likes & participation** — votes and "I'm in" are stored in Firebase Firestore
(`events/{raceId}` with `likes` and `going` arrays), so **everyone sees the same counts,
live**. The strategy: anyone can *see* votes and who's going (even logged out), but you
must log in to vote or join — one vote per person, and only vote for races you can
actually attend. More votes = higher chance the trip gets organized. Joining happens on
the race page ("I'm in!"), which also unlocks the race chat.

**Login** — email+password or Google, in `login.html`. New users are sent to profile
setup once; returning users go back to the page they came from. There's a
"Forgot your password?" link that emails a reset link.

## ⚠️ One-time safety step (important!)

Open the [Firebase console](https://console.firebase.google.com) → project **encore-v2**
→ **Firestore Database** → **Rules**, paste the contents of `firestore.rules` from this
repo, and press **Publish**. Without this, anyone on the internet can edit your database.
(The Firebase `apiKey` in `js/firebase-config.js` is *meant* to be public — the rules are
what actually protect your data.)

## Files worth knowing

- `races-data.js` — the race catalog + date helpers (`raceUtils`). **Edit this to add/update races.**
- `race-manager.js` — renders the race cards on `running.html`.
- `js/race-social.js` — live likes / who's-going, shared via Firestore.
- `js/login-widget.js` — the little login widget in the corner of every page.
- `firestore.rules` — database security rules (see the step above).
- `firebase-functions.js` — *optional* email notifications; not deployed yet
  (needs `firebase deploy --only functions` and an email account configured).

---

# my website project: technical and personal challange
**Planned features:**
- [ ] Responsive design
- [ ] Contact form
- [ ] Portfolio section
- [ ] Blog functionality
# git commands Ill need
- git commit -m "Add responsive navigation menu"
- git push origin main
- # See all local branches
- git branch
# See all branches (local + remote from GitHub)
- git branch -a
# See branch history with visual graph
- git log --oneline --graph --all
# Branch Management
git branch                    # List branches
git checkout branch-name      # Switch branches
git checkout -b new-branch    # Create and switch to new branch

# Daily Work
git status                   # See what's changed
git add .                    # Stage changes
git commit -m "message"      # Commit changes
git push origin branch-name  # Push to specific branch

# Merging
git checkout main           # Switch to main
git merge development       # Bring development changes into main

# to know for development
- main branch is working code
- development branch is for active development

# step 1: initial setup: create repository
cd /home/daria/Documents/GitHub/enCORE
git init
git add .
git commit -m "Initial commit: basic website structure"

# step 2: create and switch to development branch
# Create development branch AND switch to it
git checkout -b development

# Step 3: Push Both Branches to GitHub
- # First push development branch
git push -u origin development

- # Now switch back to main and push it too
git checkout main
git push -u origin main

- # Go back to development to continue working
git checkout development # go to sth like directory branch

# connect local repository to GH
 - https://github.com/Dariasels/enCoreWeb.git
 - git remote add origin https://github.com/YOUR_USERNAME/enCORE.git

git push -u origin development

# ubuntu terminal
cd /path/to/project    # Change directory
ls                     # List files
pwd                    # Show current directory
cp file1 file2         # Copy files
mv file1 file2         # Move/rename files
sudo apt update        # Update system packages