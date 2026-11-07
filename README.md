# Satmola Field Tools

Field apps for Satmola, hosted on GitHub Pages. They share one sign-in and one Google Sheet backend.

## Apps

| File | App | Used by |
| --- | --- | --- |
| `index.html` | **Satmola All**: installable app that opens the apps below | Everyone |
| `Routing_hub.html` | Routing Hub: route map and party lookup | Approved users, owner |
| `Sales_team.html` | Sales Team: send store location and photo | Approved sales team |
| `Location_sender.html` | Location Sender: share a store pin on WhatsApp or book a pickup | Approved users |
| `Driver_checkin.html` | Driver Check-in: GPS and photo check-in | Approved drivers |

## How it works

- Open `index.html` (or install it as an app on your phone). Tap an app to sign in or register.
- New accounts are approved by the owner, who also chooses which apps each person can use.
- Each person sees only the apps they were given.
- Every page also works on its own link and asks for the same sign-in.

## Files

- `manifest-all.json`, `sw-all.js`, `assets/` : install support for Satmola All.

## Updating

Upload the changed files to the repository root. Keep the file names unchanged.
