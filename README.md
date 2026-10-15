# LASTMILE AI
### Nigeria's Address Intelligence Network
> *"Every building has an address. Every delivery deserves to find it."*

**Founder & Technical Architect:** Yusuf Ridwanulahi Adeleke  
**Project Context:** Prototype built for the *"Built on Nigeria's Postcode"* showcase convened by the **Federal Ministry of Communications, Innovation and Digital Economy (FMCIDE)** and the **Nigerian Postal Service (NIPOST)**.

---

## 1. Executive Overview

On **1 October 2026**, Nigeria's digital postcode went live nationwide, assigning a structured **11-character postcode** to each addressable building. 

**LastMile AI** is a production-grade address intelligence and delivery coordination platform designed for Nigerian merchants, small and medium enterprises (SMEs), 3PL logistics couriers, and e-commerce vendors (Chowdeck, Kwik, GIGL, Jumia merchants, local businesses). 

It replaces error-prone, subjective route directions (*"behind yellow gate after the transformer, beside chemist"*) with verified building-level digital postcodes, preventing wasted rider fuel, reducing delivery failure rates, and organizing dispatch manifests by administrative boundaries.

---

## 2. Core Functional Workflow

1. **Order Creation:** Merchants log customer name, contact details, package weight, and delivery priority.
2. **Postcode Validation:** Customer supplies their official 11-character building postcode. The application validates format compliance and queries the official NIPOST API.
3. **Structured Breakdown:** The platform displays returned administrative components (State, Local Government Area [LGA], District, Area/Street Axis, and Building Identifier).
4. **Smart Address AI Assistant:** Uses server-side Google Gemini 3.8 Flash to analyze descriptive addresses, identify missing components, diagnose courier navigation risks, and generate customer follow-up templates.
5. **Merchant Order Management:** Complete CRUD dashboard calculating deterministic operational metrics (Total Orders, Ready to Dispatch, Validated Postcodes, Incomplete Address Quarantine, Delivered, Failed, and 1st-Attempt Success Rate).
6. **Delivery Intelligence:** Groups parcels strictly by verified LGA and District boundaries, quarantines unverified addresses, and provides a daily dispatch handover checklist.
7. **AI Operations Insights:** Combines deterministic performance math with qualitative AI synthesis to highlight delivery bottlenecks and actionable logistics recommendations.

---

## 3. Postcode Architecture (11-Character Standard)

Nigeria's digital building postcode is composed of 11 alphanumeric characters:
```
LA 100 01 B019
│  │   │  └──── Pos 8-11: Building Door Identifier (e.g. B019, Silicon Gate Plaza)
│  │   └─────── Pos 6-7:  Delivery Sector / Sub-district (01)
│  └─────────── Pos 3-5:  Local Government Area / Primary District (100 = Ikeja)
└────────────── Pos 1-2:  State Code (LA = Lagos, AB = Abuja FCT, KN = Kano, RV = Rivers, etc.)
```

---

## 4. Environment Variables

Configure these variables in your deployment environment or local `.env` file:

| Variable | Description | Default / Example | Required for |
| :--- | :--- | :--- | :--- |
| `PORT` | Node.js listening port | `3000` | Server runtime |
| `GEMINI_API_KEY` | Server-side Gemini API key | User injected in Secrets | Smart Address AI & Insights |
| `APP_URL` | Application domain or Cloud Run service URL | `https://...` | Self-referencing & webhooks |
| `NIPOST_API_URL` | Official NIPOST Postcode API base URL | `https://api.nipost.gov.ng/v1/postcodes` | Live building verification |
| `NIPOST_API_KEY` | Server-side NIPOST Bearer token / API Key | *Private secret* | Live NIPOST verification |
| `NIPOST_CLIENT_ID` | Registered Merchant or Client ID | `lastmile-ai-merchant` | NIPOST rate limiting & audit |

> **Security Guarantee:** Private credentials (`NIPOST_API_KEY`, `GEMINI_API_KEY`) remain strictly on the backend and are **never exposed to frontend code or client bundles**.

---

## 5. Demonstration Mode vs Configured Deployment

When official NIPOST credentials are not configured, LastMile AI seamlessly runs in **Demonstration Mode**:
- Postcode lookups display the exact prompt requirement:
  > *"Live postcode verification is not configured. You can explore the demonstration interface, but this result has not been verified against NIPOST."*
- Every demonstration record is clearly marked with a persistent **DEMONSTRATION RECORD** badge.
- Pre-seeded with authentic commercial demonstration postcodes across:
  - `LA10001B019`: Ikeja Computer Village (Lagos State)
  - `LA10101B042`: Broad Street / Marina (Lagos Island)
  - `LA10502B088`: Admiralty Way (Lekki Phase 1)
  - `AB90001B008`: Federal Secretariat Complex (Abuja CBD, FCT)
  - `AB90103B025`: Adetokunbo Ademola Crescent (Wuse 2, Abuja)
  - `KN70001B012`: Kurmi Market Trade Quarter (Kano Municipal)
  - `RV50001B031`: Aba Road / Port Harcourt GRA Phase 2 (Rivers State)
  - `OY20001B015`: Cocoa House / Dugbe Commercial District (Ibadan, Oyo State)

When production credentials are added to `NIPOST_API_URL` and `NIPOST_API_KEY`, the isolated service module immediately begins dispatching live HTTP requests to NIPOST without any code changes.

---

## 6. Local Development Instructions

### Prerequisites
- Node.js (v20 or newer)
- npm or pnpm

### Installation & Run
```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start full-stack development server (Express + Vite on Port 3000)
npm run dev

# 4. Open in browser
# http://localhost:3000
```

### Build & Verification
```bash
# Typecheck
npm run lint

# Production build
npm run build

# Start production server
npm start
```

---

## 7. Security & Nigeria Data Protection Act (NDPA 2023) Alignment

LastMile AI is designed with Nigerian data protection and governance principles:
1. **Data Minimisation:** We only collect information essential for parcel handover (recipient reference, masked telephone, package description, building postcode).
2. **Purpose Limitation:** Address components and postcodes are used strictly for dispatch planning and courier delivery routing.
3. **No Precise GPS Tracking Without Verification:** In strict adherence to realistic logistics design, we do not simulate speculative GPS routes or fake driver dots on maps.
4. **Right to Erasure:** Merchants can clear all local orders and reset their store dataset at any time directly from the **Settings & Integrations** panel.

---

## 8. Disclaimer

**LastMile AI** is an independent technical prototype developed by **Yusuf Ridwanulahi Adeleke** for the *"Built on Nigeria's Postcode"* showcase. It is not owned, operated, certified, or endorsed by NIPOST or the Federal Ministry of Communications, Innovation and Digital Economy (FMCIDE).
