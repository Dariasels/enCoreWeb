// Firebase Cloud Functions for Email Notifications
// Install: npm install firebase-functions firebase-admin nodemailer
// Deploy: firebase deploy --only functions

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();

// Configure your email service (use Gmail, SendGrid, or other SMTP service)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: functions.config().email.user, // Set with: firebase functions:config:set email.user="youremail@gmail.com"
    pass: functions.config().email.pass  // Set with: firebase functions:config:set email.pass="yourapppassword"
  }
});

// Send email when someone joins a race
exports.notifyNewRunner = functions.firestore
  .document('events/{eventId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const eventId = context.params.eventId;

    // Check if someone new joined
    const beforeGoing = before.going || [];
    const afterGoing = after.going || [];
    const newRunners = afterGoing.filter(uid => !beforeGoing.includes(uid));

    if (newRunners.length === 0) return null;

    // Get all existing participants who have notifications enabled
    const participants = beforeGoing.filter(uid => !newRunners.includes(uid));
    
    for (const participantUid of participants) {
      try {
        const userDoc = await admin.firestore().collection('users').doc(participantUid).get();
        
        if (!userDoc.exists) continue;
        
        const userData = userDoc.data();
        
        // Check if user wants notifications
        if (!userData.notifications?.newRunners) continue;
        
        // Get new runner's info
        const newRunnerDoc = await admin.firestore().collection('users').doc(newRunners[0]).get();
        const newRunnerName = newRunnerDoc.exists() ? 
          newRunnerDoc.data().displayName : 'Someone';

        // Send email
        const mailOptions = {
          from: functions.config().email.user,
          to: userData.email,
          subject: `${newRunnerName} joined your race!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff6b35;">New Runner Alert! 🏃</h2>
              <p>Hi ${userData.displayName},</p>
              <p><strong>${newRunnerName}</strong> just joined <strong>${after.name}</strong>!</p>
              <p style="margin: 20px 0;">
                <a href="https://your-domain.com/race-details.html?id=${eventId}" 
                   style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  View Race Details
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                You're receiving this because you signed up for notifications when people join your races.
                <a href="https://your-domain.com/edit-profile.html">Update preferences</a>
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Notification sent to ${userData.email}`);
        
      } catch (error) {
        console.error(`Error sending notification to ${participantUid}:`, error);
      }
    }

    return null;
  });

// Send race reminders 7 days before
exports.sendRaceReminders = functions.pubsub
  .schedule('every day 09:00')
  .timeZone('Europe/Brussels')
  .onRun(async (context) => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    // Get all events
    const eventsSnapshot = await admin.firestore().collection('events').get();
    
    for (const eventDoc of eventsSnapshot.docs) {
      const event = eventDoc.data();
      
      if (!event.date || !event.going || event.going.length === 0) continue;
      
      // Parse date (you may need to adjust this based on your date format)
      const eventDate = new Date(event.date);
      
      // Check if event is in 7 days
      const diffDays = Math.floor((eventDate - now) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 7) {
        // Send reminders to all participants
        for (const uid of event.going) {
          try {
            const userDoc = await admin.firestore().collection('users').doc(uid).get();
            
            if (!userDoc.exists) continue;
            
            const userData = userDoc.data();
            
            if (!userData.notifications?.raceReminders) continue;
            
            const mailOptions = {
              from: functions.config().email.user,
              to: userData.email,
              subject: `Race Reminder: ${event.name} in 7 days! 🏃`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #ff6b35;">Race Day is Coming! 🎉</h2>
                  <p>Hi ${userData.displayName},</p>
                  <p>Just a friendly reminder that <strong>${event.name}</strong> is happening in 7 days!</p>
                  <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="margin: 0 0 10px 0; color: #333;">Race Details</h3>
                    <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${event.date}</p>
                    <p style="margin: 5px 0;"><strong>📍 Location:</strong> ${event.name.split(',').slice(-1)[0]}</p>
                    <p style="margin: 5px 0;"><strong>👥 Runners:</strong> ${event.going.length} joined</p>
                  </div>
                  <p style="margin: 20px 0;">
                    <a href="https://your-domain.com/race-details.html?id=${eventDoc.id}" 
                       style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      View Race & Chat with Runners
                    </a>
                  </p>
                  <p style="margin: 20px 0;">
                    <a href="${event.url}" 
                       style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                      Official Race Website
                    </a>
                  </p>
                  <p style="color: #666; font-size: 14px;">
                    Good luck with your training! 💪
                  </p>
                </div>
              `
            };

            await transporter.sendMail(mailOptions);
            console.log(`Reminder sent to ${userData.email} for ${event.name}`);
            
          } catch (error) {
            console.error(`Error sending reminder to ${uid}:`, error);
          }
        }
      }
    }
    
    return null;
  });

// Send notification when someone sends a chat message (optional)
exports.notifyChatMessage = functions.firestore
  .document('events/{eventId}/chats/{chatId}')
  .onCreate(async (snap, context) => {
    const message = snap.data();
    const eventId = context.params.eventId;
    
    // Get event info
    const eventDoc = await admin.firestore().collection('events').doc(eventId).get();
    if (!eventDoc.exists) return null;
    
    const event = eventDoc.data();
    const participants = event.going || [];
    
    // Don't notify the sender
    const recipients = participants.filter(uid => uid !== message.uid);
    
    for (const uid of recipients) {
      try {
        const userDoc = await admin.firestore().collection('users').doc(uid).get();
        
        if (!userDoc.exists) continue;
        
        const userData = userDoc.data();
        
        if (!userData.notifications?.chatMessages) continue;
        
        const mailOptions = {
          from: functions.config().email.user,
          to: userData.email,
          subject: `New message in ${event.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #ff6b35;">New Chat Message 💬</h2>
              <p>Hi ${userData.displayName},</p>
              <p><strong>${message.name}</strong> sent a message in <strong>${event.name}</strong>:</p>
              <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff6b35;">
                "${message.text}"
              </div>
              <p style="margin: 20px 0;">
                <a href="https://your-domain.com/race-details.html?id=${eventId}" 
                   style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                  Reply in Chat
                </a>
              </p>
              <p style="color: #666; font-size: 14px;">
                <a href="https://your-domain.com/edit-profile.html">Turn off chat notifications</a>
              </p>
            </div>
          `
        };

        await transporter.sendMail(mailOptions);
        
      } catch (error) {
        console.error(`Error sending chat notification to ${uid}:`, error);
      }
    }
    
    return null;
  });

// Welcome email when profile is created
exports.sendWelcomeEmail = functions.firestore
  .document('users/{userId}')
  .onCreate(async (snap, context) => {
    const userData = snap.data();
    
    if (!userData.email) return null;
    
    const mailOptions = {
      from: functions.config().email.user,
      to: userData.email,
      subject: 'Welcome to enCore! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff6b35;">Welcome to enCore, ${userData.displayName}! 🎉</h1>
          <p>We're excited to have you join our global running community!</p>
          <p>enCore is all about running marathons around the world with people you meet on the way. Build connections, share experiences, and create core memories together.</p>
          <h3 style="color: #333;">Get Started:</h3>
          <ul style="line-height: 1.8;">
            <li>🏃 Browse and join races from around the world</li>
            <li>💬 Chat with fellow runners</li>
            <li>📅 Get race reminders</li>
            <li>🌍 Build your global running community</li>
          </ul>
          <p style="margin: 30px 0;">
            <a href="https://your-domain.com/running.html" 
               style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Browse Races
            </a>
          </p>
          <p style="color: #666;">Happy running! 🏃‍♀️🏃‍♂️</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Welcome email sent to ${userData.email}`);
    } catch (error) {
      console.error(`Error sending welcome email:`, error);
    }
    
    return null;
  });


  // 1) Notify all “newEvents” subscribers when a brand-new race is posted
exports.notifyNewEvent = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const event = snap.data();

    // load every user that wants “new event” mails
    const usersSnap = await admin.firestore()
                          .collection('users')
                          .where('notifications.newEvents', '==', true)
                          .get();

    const mails = [];
    usersSnap.forEach(u => {
      const user = u.data();
      if (!user.email) return;
      mails.push({
        from: functions.config().email.user,
        to: user.email,
        subject: `New race just posted: ${event.name} 🌍`,
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
            <h2 style="color:#ff6b35">Hey ${user.displayName || 'runner'}!</h2>
            <p>A fresh race just landed on enCore:</p>
            <div style="background:#f9f9f9;padding:15px;border-radius:8px;margin:20px 0">
              <h3 style="margin:0 0 8px">${event.name}</h3>
              <p style="margin:4px 0"><strong>📅 Race day:</strong> ${event.date || 'TBA'}</p>
              <p style="margin:4px 0"><strong>📍 Location:</strong> ${event.location?.name || event.name.split(',').pop()}</p>
              ${event.subDeadline ? `<p style="margin:4px 0"><strong>📝 Subscribe before:</strong> ${event.subDeadline}</p>` : ''}
              ${event.url ? `<p style="margin:4px 0"><strong>🔗 Official site:</strong> <a href="${event.url}">${event.url}</a></p>` : ''}
            </div>
            <p>
              <a href="https://your-domain.com/race-details.html?id=${snap.id}"
                 style="background:#ff6b35;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">
                View race & join
              </a>
            </p>
            <p style="font-size:12px;color:#666">You receive this because you opted-in to “New events” mails.<br>
               <a href="https://your-domain.com/edit-profile.html">Unsubscribe or change preferences</a></p>
          </div>`
      });
    });

    // send in parallel
    await Promise.all(mails.map(m => transporter.sendMail(m)));
    console.log(`New-event e-mail sent to ${mails.length} users`);
    return null;
  });

// 2) Reminder “subscriptions open / close” X days before the deadline
//    Scheduled to run every morning at 08:00 Brussels time
exports.notifySubscriptionOpen = functions.pubsub
  .schedule('every day 08:00')
  .timeZone('Europe/Brussels')
  .onRun(async (context) => {
    const today = new Date();
    const REMIND_DAYS = 7; // <- change to 3, 5, 10 … if you want

    const events = await admin.firestore().collection('events').get();

    const mails = [];
    for (const doc of events.docs) {
      const ev = doc.data();
      if (!ev.subDeadline) continue; // skip races without deadline

      const deadline = new Date(ev.subDeadline);
      const diffDays = Math.round((deadline - today) / 86400000);

      if (diffDays === REMIND_DAYS) {
        // load subscribers
        const usersSnap = await admin.firestore()
                              .collection('users')
                              .where('notifications.subscriptionReminder', '==', true)
                              .get();

        usersSnap.forEach(u => {
          const user = u.data();
          if (!user.email) return;
          mails.push({
            from: functions.config().email.user,
            to: user.email,
            subject: `Subscription deadline: ${ev.name} 📝`,
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
                <h2 style="color:#ff6b35">Hi ${user.displayName || 'runner'},</h2>
                <p>The subscription window for <strong>${ev.name}</strong> closes in <strong>${REMIND_DAYS} days</strong>!</p>
                <div style="background:#fff3cd;padding:15px;border-left:4px solid #ffc107;margin:20px 0">
                  <strong>Deadline:</strong> ${ev.subDeadline}<br>
                  <strong>Race day:</strong> ${ev.date || 'TBA'}
                </div>
                <p>
                  <a href="https://your-domain.com/race-details.html?id=${doc.id}"
                     style="background:#ff6b35;color:white;padding:12px 24px;text-decoration:none;border-radius:6px;display:inline-block">
                    Subscribe now
                  </a>
                </p>
                <p style="font-size:12px;color:#666">
                  You opted-in to “Subscription reminders”. <a href="https://your-domain.com/edit-profile.html">Change prefs</a>
                </p>
              </div>`
          });
        });
      }
    }

    await Promise.all(mails.map(m => transporter.sendMail(m)));
    console.log(`Subscription-reminder e-mail sent to ${mails.length} users`);
    return null;
  });


  // When a user is deleted in Auth → remove him from every race
exports.cleanupDeletedUser = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const eventsRef = admin.firestore().collection('events');
  const snap = await eventsRef.where('going', 'array-contains', uid).get();

  const batch = admin.firestore().batch();
  snap.docs.forEach(doc => {
    batch.update(doc.ref, { going: admin.firestore.FieldValue.arrayRemove(uid) });
  });
  await batch.commit();
  console.log(`Removed ${uid} from ${snap.size} races`);
});