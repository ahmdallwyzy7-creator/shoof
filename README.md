# SHOOF LIVE starter scaffold

Early technical scaffold for a native Expo Android app using LiveKit React Native.

## Important
- This is a starter scaffold, not a finished or installable APK.
- LiveKit React Native requires an Expo development build (Expo Go will not work).
- Deploy the `server/` token service to a trusted HTTPS host. Keep API key/secret only on the server, never in the app.
- Set `TOKEN_SERVER` in `App.js` to your deployed token service base URL.
- Configure `server/.env` from `.env.example` with LiveKit Cloud credentials.
- The starter currently has basic connect/room flow; video track UI, room controls, chat, moderation, discovery and production auth still need implementation.

## Build environment
Requires a computer or cloud build environment with Node/npm and EAS/Expo tools. Mobile-only workflow will need cloud build tooling.
