# Church App — Expo SDK 54

A 5-screen React Native church app built with Expo SDK 54 (React Native 0.81, React 19.1). Matches the original UI mockups exactly: Home, Bible (English/Telugu), Church directory, Christian Matrimony, and Profile (with church login/registration/admin entry points).

## Screens

- **Home** — greeting header, verse of the day, quick actions, live stream card, reading streak, featured churches
- **Bible** — book/chapter picker, EN/TE language toggle, verse list with highlight state, bottom toolbar (bookmark, highlight, share, audio)
- **Church** — search, filter chips, church directory cards with live stream / song / event post types, "Register" CTA
- **Matrimony** — search, filter chips, 2-column profile grid with interest button states, mutual match banner
- **Profile** — avatar header, church login / register church / admin login entry points, account settings list

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the dev server:
   ```
   npx expo start
   ```

3. Scan the QR code with **Expo Go** (SDK 54 compatible build) on your phone, or press `i` / `a` in the terminal to launch an iOS Simulator / Android Emulator.

## Project structure

```
App.js                       — entry point, loads fonts, mounts navigator
app.json                     — Expo config
src/
  theme/theme.js              — colors, fonts, spacing tokens (single source of truth)
  components/
    Card.js                   — reusable bordered card
    Buttons.js                — pill button + outline pill button
    CustomTabBar.js            — bottom tab bar with gold-dot active indicator
  navigation/
    RootNavigator.js           — bottom tab navigator wiring the 5 screens
  screens/
    HomeScreen.js
    BibleScreen.js
    ChurchScreen.js
    MatrimonyScreen.js
    ProfileScreen.js
```

## Design tokens

Colors, fonts, and spacing all live in `src/theme/theme.js`. Update there to restyle the whole app consistently.

- Background: `#FAFAF7` (paper)
- Text: `#1C1E26` (ink)
- Accent: `#B08D57` (gold) — used for active tab, verse highlight, CTA accents
- Secondary accent: `#7A8B6F` (sage) — verified badges, reading streak
- Tertiary accent: `#B5654F` (rose) — matrimony, live badges
- Display font: Fraunces (serif, headings)
- Body font: Inter (sans, everything else)

## Notes

- This is a UI-only build — all data shown (churches, matrimony profiles, verses) is static sample data in the screen files. Wire up your Spring Boot backend / API calls where marked.
- `expo-splash-screen` and Google Fonts (`@expo-google-fonts/inter`, `@expo-google-fonts/fraunces`) are used for font loading on launch.
- Icons are from `@expo/vector-icons` (Ionicons set) — no custom icon assets needed.
- Placeholder `icon.png` / `splash.png` / `adaptive-icon.png` are included in `/assets` using the app's brand colors — replace with your own artwork before publishing.
