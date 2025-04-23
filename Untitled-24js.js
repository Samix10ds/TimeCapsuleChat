// Calendar utilities for Google Calendar integration

const CLIENT_ID = "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";
const API_KEY = "AIzaSyAxKG1fUdiWP9KRNuxTWQpnYyBTDjx7Btw";
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
const SCOPES = "https://www.googleapis.com/auth/calendar.events";

export function addEventToCalendar(title, description, date) {
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