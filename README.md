# WAN Lens
**Supplemental visibility for Cisco Meraki MX**

WAN Lens fills the gaps that the Meraki Dashboard doesn't easily show — org-wide WAN MAC addresses, uplink packet loss, ISP grouping, HA pair validation, and automated support checks.

## Features
- **MAC Calculator** — Calculate WAN interface MACs from base MAC, no API key needed
- **WAN Overview** — Org-wide MACs, WAN IPs, geolocation, firmware, and device status
- **Uplink Health** — Org-wide packet loss and latency table
- **ISP View** — Sites grouped by ISP to spot ISP-wide outages
- **HA Pairs** — Model and firmware validation for warm spare pairs
- **Support Checks** — 10 automated checks surfacing issues invisible in the Dashboard
- **Snapshot** — Shareable support report that never includes your API key

## Deployment
This project uses a Netlify serverless function to proxy Meraki API requests, bypassing browser CORS restrictions.

### Deploy to Netlify via GitHub
1. Push this repository to GitHub
2. Go to app.netlify.com → Add new site → Import from GitHub
3. Select this repository
4. Build settings are auto-detected from netlify.toml
5. Click Deploy

### Privacy
- Your API key is sent to the Netlify proxy function via a custom header
- The function forwards it to api.meraki.com and returns the response
- The API key is **never stored, logged, or retained** anywhere
- All geolocation is handled by ip-api.com (public IPs only)

## Project Structure
```
wanlens/
├── public/
│   └── index.html          # Main app
├── netlify/
│   └── functions/
│       └── meraki.js       # API proxy function
├── netlify.toml            # Netlify config
└── package.json
```
