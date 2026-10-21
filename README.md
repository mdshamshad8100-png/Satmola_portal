# Satmola Logistics & Delivery Portal

Three small, independent web apps that all read from (and, for one of them, write to) a single Google Sheet called **BP Master**. Each app is one standalone HTML file, so they can be opened, updated and shared separately.

| App | File | Used by | Purpose |
|---|---|---|---|
| Routing Hub | `index.html` | Logistics / planning | Build delivery routes, trip sheets and challans, calculate distances, export PDF |
| Party Lookup & Quick Dispatch | `Location_sender.html` | Dispatch desk (Porter / calling) | Search a party, share its location on WhatsApp, book a Porter drop |
| Sales Field Portal | `Sales_team.html` | Sales officers in the field | Capture a store's GPS location and save it to BP Master |

## Live links

Base URL: `https://mdshamshad8100-png.github.io/Satmola_portal/`

- Routing Hub: `https://mdshamshad8100-png.github.io/Satmola_portal/index.html`
- Party Lookup: `https://mdshamshad8100-png.github.io/Satmola_portal/Location_sender.html`
- Sales Field Portal: `https://mdshamshad8100-png.github.io/Satmola_portal/Sales_team.html`

Share each link only with the people who need that app.

## How it works

```
Sales_team.html  --(POST: lat, lng, accuracy)-->  Google Apps Script  <-->  BP Master (Google Sheet)
index.html            --(GET: all BP rows)---->   (web app /exec)
Location_sender.html  --(GET: all BP rows)---->
```

- The three pages stay separate files. Nothing is shared between them except the Google Apps Script web app URL.
- Whenever BP Master is updated, `index.html` and `Location_sender.html` load the latest rows automatically on page open. No re-upload or redeploy is needed.
- When a sales officer saves a location in `Sales_team.html`, it is written to the Lat / Lng / Accuracy / Last Updated columns of BP Master, and the other two pages pick it up on their next load.
- Once a party has exact coordinates, `index.html` uses them for routing instead of area-level estimates.

## BP Master sheet columns

```
BP Name, City Name, Bill-to Block, Zone Name, Sales Employee, GRoup, State,
Owner, Mobile, Ship-to City, Bill-to City, Lat, Lng, Accuracy, Last Updated
```

Keep these header names exactly as they are. The pages read columns by header name, so renaming or deleting a header breaks the sync. Adding new columns at the end is safe.

## Hosting (GitHub Pages, free)

1. Open the repository on GitHub and go to **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
3. Select branch `main` and folder `/ (root)`, then click **Save**.
4. Wait 1 to 3 minutes. The site is then live at the Base URL above.
5. Open each page on a phone and check that data loads.

Notes:

- GitHub Pages serves over HTTPS, which the phone GPS feature requires. Opening the HTML files directly from a phone's storage will not work for GPS.
- A private repository needs a paid GitHub plan for Pages. On the free plan the repository must be public, so **do not commit the BP Master export or any customer data to this repo** (see Security).
- After you push a change, the update appears on the live site after about a minute. Hard-refresh the page if an old version shows.

## Google Apps Script (the backend)

All three pages use the same web app URL, stored in the `SCRIPT_URL` variable near the top of the `<script>` block in each file. The Apps Script is bound to the BP Master sheet and must be deployed as:

- **Execute as:** Me (the sheet owner)
- **Who has access:** Anyone

It is expected to:

- Answer `GET` with a JSON array of rows, each row an object keyed by the sheet's header names.
- Accept `POST` with `rep`, `bpName`, `city`, `mobile`, `lat`, `lng`, `accuracy`, `mapsUrl`, and update (or add) the matching BP row.

If you edit the script, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same. Creating a brand new deployment gives a new URL, and then `SCRIPT_URL` must be changed in all three HTML files.

Recommended: keep a copy of the script in this repo (for example `apps-script/Code.gs`) so it is not lost.

## Daily use

**Sales officers:** open the Sales Field Portal, choose your name, enter the BP name and area, tap **Acquire Store GPS Coordinates** while standing at the store, then **Submit Location**. Allow location permission when the browser asks. If GPS is weak, paste a Google Maps link or `lat,lng` using the manual option.

**Dispatch desk:** open Party Lookup, search the party, then share the location on WhatsApp or open the Porter booking.

**Planning:** open the Routing Hub, add stops from the directory, set the hub and vehicle, then export the trip sheet or challan as PDF.

## Updating BP data

1. Edit or add rows in the BP Master Google Sheet.
2. Reload the pages. The new data appears without any change to the HTML files.

Do not remove the Lat, Lng, Accuracy or Last Updated columns.

## Troubleshooting

| Problem | Check |
|---|---|
| "Parties loaded" message never appears | Open the `/exec` URL directly in a browser. It should return JSON. If it asks for login, redeploy the script with access set to **Anyone**. |
| GPS button gives an error | Use the HTTPS GitHub Pages link, enable phone Location, allow the browser permission, and try outdoors. |
| Sales portal says "saved" but the sheet is empty | The page sends data in a mode that cannot read the reply, so it always shows success. Check the Apps Script **Executions** log for errors. |
| Old data or old page shows | Hard refresh, or clear the site data for the page. The Routing Hub also keeps the last loaded directory in the browser's local storage and refreshes it on load. |
| A sales officer is missing from the dropdown | The list is written directly in `Sales_team.html`. Add an `<option>` line for the new name. |

## Security

- The Apps Script URL is visible to anyone who opens the pages, and the script allows anyone with the link to read BP data and submit locations. Share the page links only inside the team. If needed, add a shared passcode check inside the Apps Script.
- The repository can be public. Keep customer names, mobile numbers and the BP Master export **out of the repo**. The live data stays in Google Sheets only.
- Only the sheet owner should have edit access to BP Master.

## Repository files

```
index.html             Routing Hub
Location_sender.html   Party Lookup & Quick Dispatch
Sales_team.html        Sales Field Portal
README.md              This file
```
