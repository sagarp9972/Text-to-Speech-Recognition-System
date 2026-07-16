# 🎙️ VoiceFlow — Text-to-Speech Recognition System

> A complete web app that converts **text to speech** and **speech to text**, built with pure HTML, CSS & JavaScript. No frameworks. No installs. No backend. Just open and use.

---

## 📖 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Project Structure](#-project-structure)
4. [How to Run](#-how-to-run)
5. [How to Use](#-how-to-use)
6. [Keyboard Shortcuts](#-keyboard-shortcuts)
7. [Supported Languages](#-supported-languages-33-total)
8. [Browser Support](#-browser-support)
9. [Tech Stack](#-tech-stack)
10. [How It Works](#-how-it-works-under-the-hood)
11. [Customization Guide](#-customization-guide)
12. [Troubleshooting](#-troubleshooting)
13. [Data & Privacy](#-data--privacy)
14. [Roadmap](#-roadmap)
15. [License](#-license)

---

## 🔎 Overview

**VoiceFlow** is a browser-based speech studio with two core tools in one clean interface:

- **Text → Speech**: Type anything and the app reads it out loud in a voice of your choice.
- **Speech → Text**: Speak into your microphone and watch your words appear as text in real time.

It runs entirely in the browser using the native **Web Speech API** — there is no server, no API key, no sign-up, and no data ever leaves your device (aside from the browser's own speech-processing, which for Chrome happens via Google's speech service).

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔊 Text to Speech | Converts typed text into natural spoken audio |
| 🎤 Speech to Text | Converts live microphone input into text in real time |
| 🎛️ Voice Controls | Adjust **speed**, **pitch**, and **volume** with sliders |
| 🗣️ Voice Picker | Choose from every voice installed on your device/browser |
| 🌍 33 Languages | 11 international + all 22 official Indian languages |
| 📋 Copy Button | Copy recognized text to clipboard in one click |
| 🔁 Send to TTS | Instantly send recognized speech back into the Speak box |
| 🕘 Unlimited History | Every recognized phrase is saved automatically — forever |
| ⌨️ Keyboard Shortcuts | Control the whole app without touching the mouse |
| 🌊 Live Waveform | Animated sound bars while the app is speaking |
| 🔴 Recording Indicator | Pulsing mic + ripple animation while listening |
| 🌙 Dark UI | Custom-built dark theme with glowing accents |
| 📱 Responsive | Works on desktop, tablet, and mobile browsers |
| 🔔 Toast Notifications | Friendly on-screen feedback for every action |

---

## 🗂️ Project Structure

```
VoiceFlow/
├── index.html    ← Page structure: layout, buttons, dropdowns, panels
├── style.css     ← All visual design: colors, layout, animations
├── script.js     ← All logic: speech engine, history, events
└── README.md     ← This file
```

No build tools, no `node_modules`, no compiling — just 3 files.

---

## 🚀 How to Run

### Option 1 — Just Open It (fastest)

```
1. Unzip the project folder
2. Double-click index.html
3. It opens in your default browser — done!
```

### Option 2 — VS Code + Live Server (recommended for editing)

```
1. Open the VoiceFlow folder in VS Code
2. Install the "Live Server" extension
3. Right-click index.html → "Open with Live Server"
4. App opens at http://127.0.0.1:5500
5. Any file you save auto-refreshes the page
```

### Option 3 — Any Local Web Server

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .
```
Then visit `http://localhost:8000` (or the port shown).

> ⚠️ Use **Google Chrome** or **Microsoft Edge**. Speech Recognition (the microphone feature) does not work in Firefox, and only partially works in Safari.

---

## 🕹️ How to Use

**Text to Speech:**
1. Type or paste text into the top box
2. Pick a voice, adjust speed/pitch/volume if you like
3. Click **Speak** — click **Pause** to pause, **Stop** to stop, **Clear** to reset

**Speech to Text:**
1. Select your language from the dropdown
2. Tap the big mic button — allow microphone access if asked
3. Start talking — text appears live as you speak
4. Tap the mic again to stop
5. Use **Copy**, **Send to TTS**, or **Clear** on the result
6. Every result is saved automatically in **History** below

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` (or `Cmd + Enter` on Mac) | Start speaking (TTS) |
| `Ctrl + M` (or `Cmd + M`) | Start/stop microphone (STT) |
| `Escape` | Stop all speech and recording immediately |

---

## 🌍 Supported Languages (33 total)

### International (11)
🇺🇸 English (US) · 🇬🇧 English (UK) · 🇪🇸 Spanish · 🇫🇷 French · 🇩🇪 German · 🇮🇹 Italian · 🇧🇷 Portuguese · 🇯🇵 Japanese · 🇰🇷 Korean · 🇨🇳 Chinese · 🇸🇦 Arabic

### Indian Languages (22 — all official scheduled languages)
Assamese · Bengali · Bodo · Dogri · Gujarati · Hindi · Kannada · Kashmiri · Konkani · Maithili · Malayalam · Manipuri (Meitei) · Marathi · Nepali · Odia · Punjabi · Sanskrit · Santali · Sindhi · Tamil · Telugu · Urdu

> ⚠️ **Note:** Speech-to-Text accuracy for each language depends entirely on your browser's speech engine, not this app. Chrome currently has strong support for Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Urdu, and Punjabi. Less common languages (Bodo, Dogri, Sanskrit, Santali, Kashmiri, Konkani, Maithili, Manipuri, Sindhi) may return a "language not supported" message if your browser has no engine for them yet — this will likely improve over time as Google adds more language models.
>
> Text-to-Speech (available voices) depends on what's installed on your operating system/browser, and may include more or fewer languages than the list above.

---

## 🌐 Browser Support

| Browser | Text to Speech | Speech to Text |
|---|---|---|
| Google Chrome | ✅ Full support | ✅ Full support |
| Microsoft Edge | ✅ Full support | ✅ Full support |
| Firefox | ✅ Full support | ❌ Not supported |
| Safari | ✅ Full support | ⚠️ Partial support |
| Mobile Chrome (Android) | ✅ Yes | ✅ Yes |
| Mobile Safari (iOS) | ✅ Yes | ⚠️ Limited |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Structure | HTML5 |
| Styling | CSS3 (custom, no framework) — Google Fonts: Syne + DM Mono |
| Logic | Vanilla JavaScript (ES6) |
| Speech Engine | Web Speech API (`SpeechSynthesis` + `SpeechRecognition`) |
| Storage | Browser `localStorage` (for history) |

No React, no Vue, no build step, no dependencies to install.

---

## ⚙️ How It Works (Under the Hood)

- **Text to Speech** uses the browser's built-in `speechSynthesis` object. When you click Speak, the app creates a `SpeechSynthesisUtterance`, applies your chosen voice/rate/pitch/volume, and hands it to the browser to read aloud.
- **Speech to Text** uses `SpeechRecognition` (or `webkitSpeechRecognition` in Chrome). It streams your microphone audio to the browser's speech engine, which returns text results — both **interim** (still-processing, shown in gray) and **final** (confirmed, shown in white).
- **History** is saved as JSON in `localStorage` under the key `vf_history`. It persists even after closing the browser tab, and is never automatically deleted.

---

## 🎨 Customization Guide

| Want to change... | Edit this file | What to look for |
|---|---|---|
| Colors / theme | `style.css` | CSS variables at the top (`:root { --accent: ... }`) |
| App name / title | `index.html` | `<title>` tag and `.logo span` |
| Add/remove languages | `index.html` | `<select id="langSelect">` options |
| Max history size | `script.js` | `addToHistory()` function |
| Fonts | `index.html` + `style.css` | Google Fonts `<link>` and `--font-head` / `--font-mono` |

---

## ⚠️ Troubleshooting

| Problem | Solution |
|---|---|
| Mic button does nothing | Use Chrome or Edge — Firefox has no Speech Recognition |
| "Microphone access denied" | Click the 🔒 icon in the address bar → allow microphone |
| No voices in the dropdown | Wait a second and refresh — voices load asynchronously |
| Speech cuts off after ~15s | Already handled — app auto-resumes if browser pauses it |
| "Language not supported" error | That language isn't installed in your browser's speech engine yet |
| Nothing happens when clicking Speak | Make sure the text box isn't empty |
| History not saving | Check that your browser allows `localStorage` (not in private/incognito mode restrictions) |

---

## 🔐 Data & Privacy

- All history is stored **locally in your browser** (`localStorage`) — it is never sent to any external server by this app.
- Speech recognition audio is processed by your **browser's own speech service** (e.g., Google's servers for Chrome) — this is standard browser behavior, not something this app controls.
- Clearing your browser data/cache will erase your saved history.

---

## 🗺️ Roadmap

- [ ] Add a "Download as audio file" option for TTS
- [ ] Add dark/light theme toggle
- [ ] Export history as a `.txt` or `.csv` file
- [ ] Add search/filter inside History
- [ ] PWA support (installable, works offline)

---

## 📄 License

This project is open source and free to use, modify, and share under the **MIT License**.

---

> Made with ❤️ using HTML, CSS & JavaScript — no frameworks, no backend, just the browser.
