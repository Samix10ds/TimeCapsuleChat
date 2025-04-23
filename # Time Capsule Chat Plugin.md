# Time Capsule Chat Plugin

## Overview
The Time Capsule Chat plugin for Vencord enables users to send messages that remain locked until a specified date and time. It includes:
- **Notifications**: Get notified when a time capsule message is unlocked.
- **Calendar Integration**: Add events to your Google Calendar for time capsule messages.

## Installation
1. Download the plugin files.
2. Place the files in your Vencord plugins folder.
3. Enable the plugin in the Vencord settings.

## Setup for Google Calendar
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project and enable the Google Calendar API.
3. Generate your `API_KEY` and `CLIENT_ID`.
4. Replace `YOUR_GOOGLE_CLIENT_ID` and `YOUR_API_KEY` in `calendarUtils.js`.

## Usage
1. Type your message.
2. Set a release date and time in the plugin settings.
3. Send the message! It will remain locked until the specified time and notify you when it unlocks.

## License
This project is licensed under the MIT License.