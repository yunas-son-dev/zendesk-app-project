# Customer Data Fetcher for Zendesk + Airtable

This JavaScript module fetches and displays customer information including custom notes, slack channel, project name, organization name and ASID from Airtable CAPS records. It's designed for support engineers who need to quickly view machine-related customer data inside the Zendesk UI.

---

## Features

- Matches machines and retrieves associated ASIDs
- Queries Airtable for customer details linked to those ASIDs
- Displays:
  - Organization name
  - Project name
  - Slack channel
  - DSE specific notes
- Supports collapsible sections per ASID
- "Select All" and "Send Message" buttons included (hooks can be added)
- Gracefully handles errors and missing data

---

## How It Works

1. **Trigger**  
   The user clicks a button (`combinedFetchButton()`).

2. **Zendesk Ticket Data**  
   It fetches the current ticket ID and matched machine groups, extracting ASIDs.

3. **Airtable Query**  
   It queries Airtable for customer info related to those ASIDs.

4. **Render UI**  
   A dynamic UI block appears in the Zendesk sidebar showing customer details grouped by ASID.

---

## Requirements

- You need access to:
  - Zendesk ticket environment
  - Access tokens to Airtable API

---

## How To Use

Click the FetchData button to display the following information:

- Organization name  
- Project name  
- Slack channel  
- DSE Specific notes  
- Grouped by ASID

Each ASID section is collapsible.

---

## Example UI Output
ASID: 1234567 [☑️]
▼
Org: XXX Technologies
Proj: Maintenance_helper project
Slack: #maintenance-helper
DSE Notes:
[ textarea here with notes... ]

---

## To-Do / Extend

- [ ] Add "Send a message" logic (currently just button skeleton)
- [ ] Design a method to securely store configuration data(token) for Airtable


## Demo
https://github.com/user-attachments/assets/da7aafe8-bdd8-46cd-8d38-457c3419b156
