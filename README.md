# SafeRoute AI

SafeRoute AI is a modern, responsive frontend for a Road Safety Hackathon project. It presents an AI-powered roadside emergency assistant for accidents, nearby hospitals, ambulances, police stations, towing support, panic mode actions, an emergency vault, voice activation, and WhatsApp location sharing placeholders.

The app also includes a frontend-only authentication demo with a local emergency profile system. Demo credentials, login session, and emergency details are stored in `localStorage` for hackathon presentation purposes.

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages compatible static deployment

## Project Structure

```text
.
├── index.html
├── login.html
├── register.html
├── style.css
├── script.js
├── .nojekyll
├── .gitignore
└── README.md
```

## GitHub Pages Deployment

This project is designed to deploy from the repository root:

- Source: Deploy from Branch
- Branch: `main`
- Folder: `/ (root)`

The deployable entry point is `index.html` in the repository root.

## Demo Auth Flow

1. Open `login.html` or choose Login from the dashboard.
2. Register a local demo account.
3. After login, complete the emergency profile modal.
4. Saved profile details auto-fill the Emergency Vault, SOS flow, and WhatsApp emergency share message.

Security note: this is a frontend-only demo and does not use a real backend or encrypted credential storage.

## API Integration Placeholders

The frontend includes clearly marked placeholders for:

- Google Maps API
- Gemini/OpenAI API
- Speech Recognition API
- WhatsApp sharing
- localStorage emergency vault data

## Hackathon

Road Safety Hackathon 2026
