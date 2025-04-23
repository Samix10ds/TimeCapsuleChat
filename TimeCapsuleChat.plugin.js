/**
 * @name TimeCapsuleChat
 * @description Il plugin Time Capsule Chat per Vencord permette di inviare messaggi che restano bloccati fino a una data/ora specifica. Include notifiche e integrazione con Google Calendar.
 * @author Samix10ds
 * @version 1.0.0
 * @license MIT
 */

// ==== UTILS: Crypto ====
function encryptMessage(message) {
  // Simple encryption logic (replace with a robust method in production)
  return btoa(message);
}

function decryptMessage(encryptedMessage) {
  // Simple decryption logic
  return atob(encryptedMessage);
}

// ==== UTILS: Notification ====
function sendNotification(title, message) {
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return;
  }

  if (Notification.permission === "granted") {
    new Notification(title, { body: message });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        new Notification(title, { body: message });
      }
    });
  }
}

// ==== UTILS: Calendar ====
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

function addEventToCalendar(title, description, date) {
  if (typeof gapi === "undefined") {
    console.warn("Google API client (gapi) is not loaded.");
    return;
  }
  gapi.load("client:auth2", () => {
    gapi.client
      .init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(() => {
        gapi.auth2.getAuthInstance().signIn().then(() => {
          const event = {
            summary: title,
            description: description,
            start: {
              dateTime: date.toISOString(),
              timeZone: "UTC",
            },
            end: {
              dateTime: new Date(date.getTime() + 30 * 60 * 1000).toISOString(), // 30 min event
              timeZone: "UTC",
            },
          };

          gapi.client.calendar.events.insert({
            calendarId: "primary",
            resource: event,
          }).then((response) => {
            console.log("Event created: ", response);
          });
        });
      });
  });
}

// ==== PLUGIN ====
module.exports = class TimeCapsuleChat {
  constructor() {
    this.releaseTime = null;
    this.enableNotifications = true;
  }

  start() {
    this.registerMessageHandler();
  }

  stop() {
    // Clean up listeners if needed
    // (Vencord di solito gestisce questo da solo)
  }

  registerMessageHandler() {
    // Questa funzione dovrebbe integrarsi con il sistema di messaggi di Vencord.
    // Lascio un esempio generale, da adattare all'API effettiva di Vencord.
    if (typeof this.addMessageListener === "function") {
      this.addMessageListener((message) => {
        const { content, metadata } = message;
        if (metadata?.timeCapsule && Date.now() < metadata.releaseTime) {
          // Replace the message with a placeholder
          return {
            content: "🔒 This message is locked in a Time Capsule! Check back later.",
            metadata,
          };
        } else if (metadata?.timeCapsule) {
          // Decrypt, show the message and send a notification
          const decryptedMessage = decryptMessage(content);
          if (this.enableNotifications) sendNotification("Time Capsule Unlocked!", decryptedMessage);
          return {
            content: decryptedMessage,
            metadata,
          };
        }
        return message;
      });
    }
  }

  sendTimeCapsuleMessage(content, releaseTime) {
    const encryptedContent = encryptMessage(content);
    if (typeof this.sendMessage === "function") {
      this.sendMessage({
        content: encryptedContent,
        metadata: {
          timeCapsule: true,
          releaseTime: releaseTime,
        },
      });
    }

    // Add event to the user's calendar
    addEventToCalendar("Time Capsule Message", content, new Date(releaseTime));
  }

  settings() {
    return {
      releaseTime: {
        type: "datetime",
        label: "Set Release Time",
      },
      enableNotifications: {
        type: "boolean",
        label: "Enable Notifications",
        default: true,
      },
    };
  }
};