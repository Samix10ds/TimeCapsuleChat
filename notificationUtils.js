// Notification utilities for the plugin

export function sendNotification(title, message) {
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