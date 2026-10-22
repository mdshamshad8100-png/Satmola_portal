# Satmola Namkeen – Logistics & Dispatch Suite

A lightweight logistics toolkit for **Satmola Namkeen (Delhi NCR)**. Field staff capture store GPS locations, dispatchers plan routes, and everyone works from **one shared Google Sheet** (`BP Master`).

No server is needed: the web pages are hosted free on **GitHub Pages**, and **Google Apps Script** acts as the bridge to the Google Sheet.

---

## How it works

```
 Sales_team.html ──┐                         ┌── reads all BPs (GET)
 index.html ───────┼──►  Google Apps Script ─┤
 Location_sender ──┘        (Code.gs)        └── adds / updates a BP (POST)
                                  │
                           Google Sheet "BP Master"
```

- Every page loads the **full sheet each time it opens**, so any row you add (manually or from a page) appears everywhere automatically. Nothing has to be changed in the HTML when rows grow.
- A BP (Business Partner) is identified by **Column A – BP Name**. Submitting an existing name **updates** that row; a new name is **appended** as a new row.

---

## Files in this package

| File | Purpose |
|---|---|
| `Code.gs` | Google Apps Script backend. Reads the sheet and writes new or updated BPs. |
| `Sales_team.html` | Field-officer mobile page. Captures live GPS, then saves latitude, longitude, a Google Maps hyperlink and a timestamp to the sheet. Has BP name auto-suggest from the sheet. |
| `index.html` | Dispatch & Routing Hub. Search BPs, build a route, see distances and travel time, export a Trip Sheet (PDF). **+ Add BP** saves a new BP to the sheet. |
| `Location_sender.html` | Party directory. Look up a party, open Porter with the exact drop location, share the Maps pin on WhatsApp, call the party or the sales rep. |
| `README.md` | This guide. |

---

## Google Sheet columns (`BP Master`, row 1 = headers)

| Col | Header | Notes |
|---|---|---|
| A | BP Name | Primary key |
| B | City Name | |
| C | Bill-to Block | Address / block |
| D | Zone Name | |
| E | Sales Employee | |
| F | GRoup | |
| G | State | |
| H | Owner | |
| I | Mobile | |
| J | Ship-to City | |
| K | Bill-to City | |
| L | Latitude | Filled by Sales_team |
| M | Longitude | Filled by Sales_team |
| N | Map Hyperlink | `=HYPERLINK(...)` written automatically |
| O | Last Updated | Timestamp written automatically |

> Keep the header names exactly as above. The script finds columns by header name, so the column order may change, but the names must not.
> The tab should be named **BP Master** (if not, the first tab is used).

---

## Setup (one time)

### 1. Deploy the Google Apps Script
1. Open your Google Sheet and go to **Extensions → Apps Script**.
2. Delete the old code, paste the full content of `Code.gs`, and click **Save**.
3. Click **Deploy → New deployment → type: Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy** and **Authorize** access when Google asks.
5. Copy the **Web app URL** (it ends with `/exec`).

### 2. Connect the pages
In `Sales_team.html`, `index.html` and `Location_sender.html`, find `SCRIPT_URL` and make sure it holds your Web app URL. Skip this if the URL is unchanged.

### 3. Publish on GitHub Pages
1. Upload all files to your GitHub repository (**Add file → Upload files → Commit**).
2. Go to **Settings → Pages**, choose the `main` branch and `/ (root)`, and click **Save**.
3. After 1–2 minutes your pages are live at:
   - `https://<username>.github.io/<repo>/index.html`
   - `https://<username>.github.io/<repo>/Sales_team.html`
   - `https://<username>.github.io/<repo>/Location_sender.html`
4. Share these links with your team.

### 4. Quick test
1. Open the Web app URL in a browser. You should see JSON data from your sheet.
2. Open `Sales_team.html`. The badge should show “N BPs Synced”.
3. Capture a location and submit. Check that the row shows Latitude, Longitude, Map Hyperlink and Last Updated.

---

## Updating the script later
After editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy**. This keeps the **same URL**. Creating a *New deployment* instead gives a different URL that must be updated in all three HTML files.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Badge shows “Sync failed” | The script is not deployed correctly. Redeploy as **Web app**, with access set to **Anyone**. |
| Only the time is saved, no coordinates | An old script version is still deployed. Redeploy with a **New version**. |
| New BP not visible on a page | Reload the page. Pages read the sheet on every load. |
| Header error in the sheet | Make sure row 1 uses the exact header names listed above. |

---

## Notes
- Anyone holding the Web app URL can read and write the sheet. Share it only with your team.
- Porter has no public booking API, so the pages open Porter with the drop location pre-filled and you confirm there.
