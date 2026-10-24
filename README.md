# Satmola Field Location System: README

A set of four mobile-friendly web pages and two Google Apps Scripts that collect store locations and photos from the Sales team and Drivers, verify them against Google Maps, and use the best pin for route planning.

---

## 1. What is in the system

| File | Who uses it | What it does |
|---|---|---|
| `index.html` | Dispatch / planning | Routing hub: search BPs, build a route, trip sheet, WhatsApp share, Porter. Shows a pin and a confidence label for every store. |
| `Sales_team.html` | Sales team | Submit a store's GPS location and storefront photo (or paste a Google Maps link). |
| `Driver_checkin.html` | Drivers | Check in at a store: pick the shop name, take a photo, GPS is captured at that moment. |
| `Location_sender.html` | Anyone (phone) | Look up a party, see its verified pin and photo, share on WhatsApp, call the rep, open Maps or Porter. |
| `1_BP_Master_Script.txt` | (Apps Script) | Backend for the **BP Master** sheet. |
| `2_Store_Visit_Script.txt` | (Apps Script) | Backend for the **Satmola Store Visit Check** sheet. |

### Connections

```
Sales_team.html  --POST-->  BP Master script  --> BP Master sheet  (+ Drive: Satmola Sales Photos)
Driver_checkin   --POST-->  Store Visit script --> Satmola Store Visit Check sheet (+ Drive: Satmola Driver Photos)
index.html / Location_sender.html  --GET-->  BP Master script  (read-only)
Driver_checkin.html  --GET-->  BP Master script  (only to fill the shop-name list)
```

The Web App URLs are already set inside the pages:
- **BP Master script** is used by `index.html`, `Sales_team.html`, `Location_sender.html` and (for the name list) `Driver_checkin.html`.
- **Store Visit script** is used only by `Driver_checkin.html`.

---

## 2. How a store's final pin is chosen

For every BP the script combines three sources: **Sales pin**, **Driver pin** and **Google Maps** (geocoded from BP name + bill-to + city).

| Situation | Pin used | Confidence |
|---|---|---|
| Sales and Driver pins within 100 m | Driver pin | High |
| Pins differ, one agrees with Google Maps (within 300 m) | The one that agrees | High |
| Pins differ and neither agrees | Driver pin | Low ("CHECK") |
| Only one pin, and it agrees with Google Maps | That pin | High |
| Only one pin, no Google match | That pin | Medium |
| No Sales/Driver pin, store found on Google Maps | Google pin | Medium / Low |
| Nothing | Area guess only | None |

A pin set by hand in `index.html` ("Set lat,lng" or dragging a marker) is marked **Manual**, overrides everything and is remembered on that device.

Labels shown in the pages: ✔ Verified pin, ● Pin (one source), ⚠ Check pin, ○ Area estimate only.

**Important:** Google verification is strong but not a 100% guarantee. Small shops that are not registered on Google Maps can only be matched by address.

---

## 3. Sheet columns

### BP Master
Existing columns are never renamed. The script fills these:

- Written by Sales submissions: `Sales Lat`, `Sales Lng`, `Sales Map Link`, `Sales Photo Link`, `Sales Last Updated`
- Created automatically when needed: `Mobile` (party mobile entered in the Sales form), `Map Lat`, `Map Lng`, `Map Match` (`Business Found` / `Exact Address` / `Address Approx` / `Area Only` / `Not Found`)
- Filled by the script: `Calibration Status`
- Filled by you (copy from the Store Visit sheet): `Driver Lat`, `Driver Lng`, `Driver Map Link`, `Driver Photo Link`

An existing BP's rep, city, group and block are only filled if they are blank. They are never overwritten. A new BP is added as a new row.

### Satmola Store Visit Check
`Timestamp, Daily Sr. No., Driver Name, Latitude, Longitude, Google Maps Link, Photo Link, Status` plus two columns added automatically: `Shop Name`, `Accuracy (m)`.

`Status` is `Recorded`, or `Low Accuracy (+-Xm) - re-check` when GPS error is above 50 m.

---

## 4. One-time setup (already done, for reference)

For each sheet: **Extensions > Apps Script**, paste the matching script, **Deploy > New deployment > Web app**, *Execute as: Me*, *Who has access: Anyone*, then copy the `/exec` URL into the pages.

**After the first deployment of the BP Master script:** open the sheet, use the new **Satmola** menu and choose **Verify locations (Google Map)**. It checks up to 120 BPs per run, so run it about 5 times for ~600 BPs. The menu **Calibration Status refresh** recalculates the status column.

---

## 5. Daily use

- **Sales team:** open `Sales_team.html`, choose your name, group and BP, tap *Click Photo* at the store (GPS is taken automatically), then *Submit*. If GPS shows a weak signal, step into the open and tap *Acquire GPS* again.
- **Drivers:** open `Driver_checkin.html`, choose the shop name, take the storefront photo, submit. Location is captured when the photo is taken.
- **Dispatch:** open `index.html`. It refreshes from the sheet each time you return to the tab. Check the pin label on each stop before sending the route.
- **Driver data into BP Master:** copy driver rows from the Store Visit sheet into the `Driver ...` columns of BP Master (matched by `Shop Name`).

---

## 6. Changing a script later

Edits to the Apps Script do **not** go live until you create a new version:
**Deploy > Manage deployments > pencil icon > Version: New version > Deploy.** The URL stays the same.

If you ever create a *new* deployment, the URL changes and must be updated in the HTML pages.

---

## 7. Troubleshooting

| Problem | Likely cause / fix |
|---|---|
| Page says "Sync failed" or shows no BPs | Script URL wrong, or deployment access is not *Anyone*. Open the URL in a browser: it should show JSON. |
| Data not reaching the sheet | Script changed but not re-deployed as a new version. |
| Photos do not show | Photo file is not shared as "Anyone with the link", or the Drive folder was changed. |
| `Map Match` stays empty | Run **Satmola > Verify locations** (Maps permission must be allowed). Google's daily limit may require continuing the next day. |
| Many "CHECK" statuses | Sales and Driver pins differ by more than 100 m. Review those stores and set a manual pin in `index.html`. |
| Weak GPS message | Move outdoors or away from tall buildings. Submitting is blocked above 100 m error on purpose. |

---

## 8. Known limits and notes

- The pages send data with a "fire and forget" request, so the success message means the page sent it, not that the sheet confirmed it. Check the sheet after setting up.
- The driver admin password is written in the page code, so it is visible to anyone who views the source. Treat it as a light lock only.
- The `Mobile` column holds the party's mobile. `S.e Mobile` is the sales executive's number and is not used for the party.
- Driver pin is preferred over Sales pin when both agree. To reverse this, change the order in `decide_()` in the BP Master script and in the pin-selection list in the pages.
- Google geocoding uses Apps Script's built-in Maps service, which has daily quotas. A Google Places API key would give a stricter "is this business registered" check, but needs billing.
