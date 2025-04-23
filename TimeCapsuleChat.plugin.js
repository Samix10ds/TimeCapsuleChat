// Time Capsule Chat Plugin for Vencord
import { Plugins } from "Vencord";
import { encryptMessage, decryptMessage } from "./utils/cryptoTools";
import { sendNotification } from "./utils/notificationUtils";
import { addEventToCalendar } from "./utils/calendarUtils.js";

export default class TimeCapsuleChat extends Plugin {
  start() {
    this.registerMessageHandler();
  }

  registerMessageHandler() {
    // Intercept messages to check for time capsule metadata
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
        sendNotification("Time Capsule Unlocked!", decryptedMessage);
        return {
          content: decryptedMessage,
          metadata,
        };
      }
      return message;
    });
  }

  sendTimeCapsuleMessage(content, releaseTime) {
    const encryptedContent = encryptMessage(content);
    this.sendMessage({
      content: encryptedContent,
      metadata: {
        timeCapsule: true,
        releaseTime: releaseTime,
      },
    });

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
}
