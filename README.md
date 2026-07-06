# My website project: technical and personal challenge

GOAL:
The core idea is to run half marathons around the world with friends, and people I meet on my trips. Working towards the same goals and seeing eachother with a common purpose strengthens relationships. This idea quickly expanded to hiking, backpacking trips, as well as diving and skiing trips. This website is a place for everyone to share trips ideas, tips, and stay updated.
Creating a website for me has been a technical challenge to learn to code and to use GitHub, and therefore I purposely didn't vibecode it.

(website is still under construction)

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

**Planned features:**
- [ ] Responsive design
- [ ] Optimize login
- [ ] Portfolio section
- [ ] Blog functionality
- [ ] Bigger avatar collection
- [ ] Strava connection
- [ ] Automatic emails
- [ ] AI tool to detect half marathon runs
- [ ] Shared phot album per event
- [ ] Calendar
- [ ] ...

**https://dariasels.github.io/enCoreWeb/**
