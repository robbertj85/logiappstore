# Product Requirements Document (PRD)

## Logistiek Appstore — Terugsluis Digitalisering Platform

**Version:** 0.2 — Draft
**Date:** 2026-04-10
**Status:** Draft — pending stakeholder review

---

## 1. Executive Summary

The Logistiek Appstore is a multi-sided marketplace platform that connects IT service/product suppliers with small and medium-sized transport companies (SMEs) in the Netherlands. Consumers (transport companies) can spend funds allocated through the **Dutch Truck Toll Terugsluis** system to purchase digital tools and services that accelerate their digital transformation.

The platform is jointly governed by **Connekt**, **TLN** (Transport en Logistiek Nederland), **VERN** (Vereniging Eigen Rijders Nederland), and **evofenedex**, who act as administrators and moderators of the appstore ecosystem.

The product taxonomy is based on the **Mijn Digitale Landschap** scheme developed by TLN, ensuring alignment with the sector's established digital maturity framework.

The platform consists of a **Next.js web application** (for all users) and an **Expo/React Native mobile app** (consumer-focused, Android-first) to serve drivers and transport company staff on the road.

---

## 2. Problem Statement

Dutch transport SMEs face three compounding challenges:

1. **Fragmented software landscape** — Hundreds of IT solutions exist for logistics, but there is no curated, sector-specific marketplace that helps small carriers discover, compare, and procure what they need.
2. **Terugsluis fund utilization** — The Truck Toll Terugsluis system returns toll revenues to the transport sector for sustainability and innovation investments. Transport companies need a clear, trusted channel to spend these funds on eligible digital solutions.
3. **Low digital maturity** — Many small transport companies lack the time or expertise to evaluate and adopt digital tools. A curated, category-driven appstore lowers the barrier to entry.

---

## 3. Goals & Success Metrics

### Goals

| Goal | Description |
|------|-------------|
| **Marketplace adoption** | Become the primary channel for Terugsluis-funded digital investments by transport SMEs |
| **Supplier onboarding** | Attract a critical mass of IT suppliers offering logistics-specific products |
| **Trust & governance** | Establish a jointly governed, moderated marketplace that transport companies trust |
| **Digital maturity** | Help transport SMEs navigate the Mijn Digitale Landschap categories and improve their digital capabilities |

### Key Metrics (KPIs)

| Metric | Target (Year 1) |
|--------|-----------------|
| Registered transport companies | 500+ |
| Listed IT products/services | 100+ |
| Terugsluis transactions processed | TBD with Connekt |
| Average listing rating | >= 4.0 / 5.0 |
| Supplier onboarding completion rate | >= 80% |

---

## 4. User Roles & Personas

### 4.1 Consumer — Transport Company (MKB Vervoerder)

- **Who:** Owner or IT-responsible person at a small/medium transport company (1–100 trucks)
- **Goal:** Find, compare, and purchase IT solutions using their Terugsluis budget
- **Pain points:** Overwhelmed by options, limited IT knowledge, wants sector-endorsed solutions
- **Key actions:** Browse/search listings, view product details, compare products, make purchases, leave reviews, manage Terugsluis budget

### 4.2 Supplier — IT Service/Product Provider (Leverancier)

- **Who:** Software vendor, SaaS company, or IT consultancy serving the logistics sector
- **Goal:** Reach transport SME customers, list products, gain visibility
- **Pain points:** Fragmented sales channels, difficulty reaching small carriers
- **Key actions:** Create/manage product listings (descriptions, screenshots, pricing, tags, categories), view analytics, respond to reviews, manage orders

### 4.3 Administrator — Platform Governance (Beheerder)

- **Who:** Staff from Connekt, TLN, VERN, or evofenedex acting as platform managers
- **Goal:** Ensure quality, moderate listings, manage users, oversee Terugsluis fund compliance
- **Key actions:** Approve/reject listings, moderate reviews, manage categories, manage users, view platform analytics, configure Terugsluis fund rules

---

## 5. Product Category Taxonomy

Based on the **Mijn Digitale Landschap (TLN scheme)**, the appstore uses the following hierarchical category structure. Products can be tagged with one or more subcategories.

### 5.1 Thuisbasis — Backoffice

#### TMS (Transport Management System)
- Orders administratie
- Ritplanning
- Routeplanning
- Tarifering
- Facturatie
- CBS module
- Carbon Foot Printing
- Wagenparkbeheer
- Emballageretouren administratie
- Klachten registratie

#### Route- & Ritplanning
- Ritplanning
- Advanced Planning Systeem (APS)

#### Fleet Management Software
- Communicatie backoffice — chauffeur
- Voertuigvolg- en traceersysteem
- CAO — salaris voorloop
- Brandstofanalyse
- Tacho analyse
- Monitoren en analyseren van rijgedrag

#### WMS (Warehouse Management System)
- Voorraad beheer
- In- en uitslag
- Orderpicking
- Scanning
- Emballageretouren administratie
- Douane entrepot
- VAL (Value Added Logistics)
- Crossdocking
- Replenishment
- Dock- & yard management

#### CRM
- Marketing
- Klachtenbeheer
- Documentenbeheer
- Rapportage en analyse
- Account- & contactenbeheer
- Sales — leadbeheer — offertes

#### Financieel
- Boekhouding
- Facturatie
- Debiteuren- en crediteurenbeheer
- Kostenbeheer
- Rapportage en analyse
- Bankintegratie
- Belastingbeheer
- Budgettering
- Auditing

#### HR-software
- Personeelsadministratie
- Salarisadministratie
- Verlofbeheer
- Arbo
- Medewerkerportal
- Prestatie en beoordeling
- Werving en selectie
- Training en ontwikkeling

#### Document Management
- Scanning

#### Website & Klantportal
- Website
- Klantenportal
- Klanten app

### 5.2 Identificatie, Authenticatie & Autorisatie
- Toegangspas
- Authenticatiemiddelen
- Autorisatiemiddel
- Identificatiemiddelen
- Password manager

### 5.3 Cyber Security

### 5.4 Uitvoering — Operations

#### Navigatiesoftware
- Route navigatie
- Verkeersinformatie
- Weg waarschuwing
- Voertuigbeperkingen
- Points of interest

#### Registratie & Verantwoording — Boordcomputer
- Uren verantwoording
- Opdrachten — vragenpad
- Tachograaf
- Rijtijden — tacho
- Communicatie
- Navigatie
- Rijstijl
- Scanning
- Track & Trace orders
- Charter app
- Driver app

#### Truck & Trailer Telematica
- Brandstof
- Toegang — deur open/dicht
- Tracking
- Temperatuur- en vochtigheidsmonitoring
- Rijgedrag monitoring
- Voertuig diagnostiek
- Tol
- Videotelematica — dashcams

#### Tachograaf
- Tachograaf uitleesapparatuur

#### Communicatiemiddelen
- Mobiele telefonie
- Berichtenverkeer

#### Proof of Delivery / Vrachtbrief
- eCMR
- Sign on glass
- Printer vrachtbrief

### 5.5 Klant — Overheid — Sector

#### Overheidsportals
- Belastingdienst
- Kamer van Koophandel
- RVO
- Centraal Bureau voor de Statistiek
- NVWA
- Inspectie Leefomgeving en Transport

#### Community Systemen
- Portbase
- CargoNaut

#### Klant- & Sectorspecifiek Systeem
- ERP klant
- Klant portal
- Floriday

#### Douane Software
- Uitvoeraangifte
- NCTS
- Accijns
- Invoeraangifte

### 5.6 Platforms — Communicatie & Integratie
- Visibility platforms
- Lading uitwisseling
- Control Towers
- Integratie platforms
- Communicatie platforms

#### Boeking Portaal
- Boot — trein overtocht
- Boot — trein slotboeking
- Tijdslotboeking

### 5.7 Rapportage & Data-analyse

#### Business Scans
- IT bedrijfs- en landschap scan

#### Business Intelligence & Reporting
- Spreadsheet
- Data verwerking en analyse
- Data integratie
- Data visualisatie
- Dashboards en KPI's
- Data opslag / warehousing

#### Data Opslag — Data Warehousing
- Database
- Data Warehouse
- Query tooling

---

## 6. Listing Content & Media Rules

Inspired by Apple App Store and Google Play Store listing standards, adapted for a B2B IT solutions marketplace.

### 6.1 Listing Text Requirements

| Field | Limit | Rules |
|-------|-------|-------|
| **Title** | Max 60 characters | No ALL CAPS, no keyword stuffing, no unsubstantiated superlatives ("best", "#1", "leading") |
| **Short description** | Max 160 characters | Used on cards and search results. Plain text only, no markdown. |
| **Full description** | Max 4000 characters | Rich text (markdown). No competitor bashing, no misleading claims, no pricing from competing products. |
| **Tags** | Max 8 free-form tags | Lowercase, no duplicating category names. Used for search refinement. |
| **Categories** | 1–3 from TLN taxonomy | At least 1 required. Multi-select from the Mijn Digitale Landschap hierarchy. |
| **What's New** | Max 1000 characters | Changelog field for product updates. Optional. |
| **Key Features** | Max 10 bullet points | Each max 120 characters. Summarize core capabilities. |

### 6.2 Screenshot & Media Requirements

| Requirement | Specification |
|-------------|---------------|
| **Minimum screenshots** | 3 required per listing |
| **Maximum screenshots** | 10 per listing |
| **Dimensions** | 1280x720px (landscape) or 720x1280px (portrait). Consistent orientation within a listing. |
| **Format** | PNG or JPEG, max 5MB per image |
| **Content rules** | Must show actual product UI. Marketing overlays allowed but must not cover >30% of the screenshot. No misleading mockups. |
| **Feature graphic** | 1200x630px, required. Used as listing card hero image and social sharing preview. |
| **Video** | 1 optional video URL (YouTube/Vimeo), 30s–2min recommended |
| **Supplier logo** | 400x400px minimum, square, PNG with transparency preferred |

### 6.3 Prohibited Content

- Misleading screenshots or descriptions that do not reflect actual product functionality
- Pricing information of competing products
- Contact information in the description (use the designated contact fields)
- Promotional codes or time-limited offers in the description
- Content in languages other than Dutch or English

### 6.4 Automated Pre-Submission Checks

Before a listing can be submitted, the system validates:

- All required text fields are filled and within character limits
- Minimum 3 screenshots uploaded with correct dimensions
- Feature graphic uploaded
- At least 1 category selected
- Supplier logo present on organization profile
- KvK number verified on organization (see Section 7.2)

---

## 7. Supplier Verification & Quality Badges

### 7.1 Verification Tiers

| Tier | Requirements | Badge | Automated? |
|------|-------------|-------|------------|
| **Basic** | Email verified + KvK number entered | None | Yes |
| **Geverifieerd** (Verified) | KvK number validated via KvK API + bank account linked + terms accepted | "Geverifieerd" badge | Yes (KvK API lookup) |
| **Vertrouwde Partner** (Trusted Partner) | Verified tier + manual endorsement by a governing body (Connekt/TLN/VERN/evofenedex) | "Vertrouwde Partner" badge | Manual |

### 7.2 KvK Verification Flow

1. Supplier enters KvK number during registration
2. System calls the **KvK Handelsregister API** to validate:
   - KvK number exists and is active
   - Legal entity name matches the entered company name
   - Company is not dissolved or in bankruptcy
3. If valid: organization is marked as `kvkVerified = true`, "Geverifieerd" badge is displayed
4. If invalid: supplier can correct details and retry; cannot submit listings until verified

### 7.3 Quality Badges (displayed on listing cards and detail pages)

| Badge | Criteria | Assignment |
|-------|----------|------------|
| **Geverifieerd** | Supplier passed KvK verification | Automatic |
| **Vertrouwde Partner** | Manual endorsement by governing body | Manual (admin) |
| **Terugsluis Geschikt** | Product is eligible for Terugsluis budget spending | Admin-assigned per listing |
| **Populair** | Listing has >= 10 purchases AND >= 4.0 average rating | Automatic |
| **Aanbevolen** | Editorial recommendation by TLN, VERN, evofenedex, or Connekt | Manual (admin) |

---

## 8. Feature Requirements

### 8.1 Public Storefront (Unauthenticated)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F-001 | Landing page | Hero section, featured listings, category overview, value proposition. Styled per Logistiek Digitaal visual identity. | Must |
| F-002 | Category browsing | Navigate the full Mijn Digitale Landschap taxonomy as a visual, hierarchical category tree | Must |
| F-003 | Product listing cards | Grid/list of products showing name, supplier logo, short description, category tags, rating, pricing indicator | Must |
| F-004 | Search | Full-text search across listing names, descriptions, tags | Must |
| F-005 | Filters | Filter by category, subcategory, price range, rating, tags | Must |
| F-006 | Product detail page | Full description, screenshots/media gallery, pricing, supplier info, category tags, reviews, related products | Must |
| F-007 | Supplier profile page | Public supplier page showing company info, all their listings, aggregate rating | Should |

### 8.2 Consumer Features (Authenticated — Transport Company)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F-010 | Registration & onboarding | Register as transport company with KvK number, company details | Must |
| F-011 | Terugsluis budget dashboard | View available Terugsluis budget, transaction history, remaining balance | Must |
| F-012 | Product purchase / request | Initiate a purchase or contact request for a listed product, linked to Terugsluis budget | Must |
| F-013 | Order history | View past purchases, statuses, invoices | Must |
| F-014 | Reviews & ratings | Leave a star rating (1–5) and text review on purchased products | Must |
| F-015 | Favorites / watchlist | Save products for later comparison | Should |
| F-016 | Product comparison | Side-by-side comparison of 2–3 products in the same category | Could |
| F-017 | Company profile | Manage company details, users, billing info | Must |
| F-018 | Notifications | Email + in-app notifications for order updates, new products in followed categories | Should |
| F-019 | Digital maturity scan | Optional self-assessment based on Mijn Digitale Landschap categories, with product recommendations | Could |

### 8.3 Supplier Features (Authenticated — IT Leverancier)

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F-030 | Supplier registration | Register as IT supplier with KvK number, company details, bank info | Must |
| F-031 | Listing creation wizard | Step-by-step wizard: product name, description (rich text), categories (multi-select from taxonomy), tags, pricing model, screenshots/media upload, key features, system requirements | Must |
| F-032 | Media upload | Upload up to 10 screenshots/images and 1 video URL per listing. Images stored in cloud storage (S3/R2). | Must |
| F-033 | Listing management | Edit, publish, unpublish, archive listings. View status (draft, pending review, published, rejected) | Must |
| F-034 | Pricing configuration | Set pricing model: one-time, subscription (monthly/yearly), per-user, custom/contact, free trial | Must |
| F-035 | Analytics dashboard | View impressions, clicks, conversion rate, reviews per listing | Should |
| F-036 | Review responses | Respond publicly to consumer reviews | Should |
| F-037 | Order management | View incoming purchase requests, update order status | Must |
| F-038 | Supplier profile management | Edit public company profile, logo, description, contact info | Must |

### 8.4 Administrator Features (Connekt / TLN / VERN / evofenedex)

Due to limited staff capacity across the four governing bodies, moderation is **optional and lightweight**. Listings auto-publish after passing automated pre-submission checks (see Section 6.4). Manual moderation is available but not required in the default workflow.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F-050 | Admin dashboard | Overview: total users, listings, transactions, flagged content | Must |
| F-051 | Listing moderation | **Optional** queue-based review. Admins can enable per-category or platform-wide. Default: auto-publish after automated checks pass. | Should |
| F-052 | Review moderation | Community-flagged reviews surface in admin queue. Auto-hide after 3+ flags pending review. | Should |
| F-053 | User management | View, deactivate, or role-manage consumer and supplier accounts | Must |
| F-054 | Category management | Add, edit, reorder categories and subcategories (based on TLN taxonomy) | Must |
| F-055 | Terugsluis fund management | Configure eligible categories, spending rules, budget allocations per company | Must |
| F-056 | Platform analytics | Charts and reports on marketplace activity, growth, category popularity | Should |
| F-057 | Content management | Manage static pages (FAQ, terms, about), announcements | Should |
| F-058 | Multi-organization admin | Role assignments per governing organization (Connekt, TLN, VERN, evofenedex) | Should |
| F-059 | Audit log | Immutable log of all admin actions (moderation decisions, user changes, fund adjustments) | Must |
| F-060 | Badge management | Assign/revoke "Vertrouwde Partner", "Aanbevolen", and "Terugsluis Geschikt" badges | Must |

### 8.5 Mobile App Features (Consumer — React Native / Expo)

The mobile app targets transport company staff who are on the road (drivers, planners, owner-operators). Android-first, iOS secondary. Consumer-only — suppliers and admins use the web app.

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| F-070 | Browse & search | Browse categories, search listings, filter results | Must |
| F-071 | Product detail | View full listing detail, screenshots, reviews | Must |
| F-072 | Terugsluis budget | View remaining Terugsluis budget and transaction history | Must |
| F-073 | Order history | View past purchases and order status | Must |
| F-074 | Reviews | Read and write reviews on purchased products | Must |
| F-075 | Favorites | Save products for later | Should |
| F-076 | Push notifications | Order updates, new products in followed categories | Should |
| F-077 | Offline browse | Cache recently viewed listings for offline access | Could |

---

## 9. Identity, Authentication & Authorization (IAA)

### 9.1 Authentication Strategy (Tiered)

| Tier | Method | Description | Priority |
|------|--------|-------------|----------|
| **Tier 1 (MVP)** | Email/password + OTP | Username/password registration with TOTP-based two-factor authentication (e.g., via authenticator app or SMS) | Must |
| **Tier 2 (Target)** | BDI / DIL integration | Federated login via the **Basis Data Infrastructuur (BDI)** / **Digitale Infrastructuur Logistiek (DIL)** IAA framework, using iSHARE or similar trust framework tokens | Should |
| **Tier 3 (Future)** | eHerkenning | Integration with the Dutch government's eHerkenning (eIDAS-compliant B2B authentication) for verified company identity | Could |

### 9.2 KvK-Based Organization Verification

All suppliers and consumers must register with a KvK (Kamer van Koophandel) number. This is validated automatically at registration:

1. User enters KvK number during signup
2. System validates against the **KvK Handelsregister API**:
   - KvK number is active (not dissolved/bankrupt)
   - Legal name matches entered company name
   - Registered address is in the Netherlands
3. On success: organization is marked `kvkVerified = true`
4. On failure: user can correct and retry; cannot submit listings (suppliers) or make purchases (consumers) until verified

This is analogous to Apple/Google requiring D-U-N-S numbers for organizational developer accounts.

### 9.3 Authorization Model (RBAC)

| Role | Permissions |
|------|-------------|
| `CONSUMER` | Browse, purchase, review, manage own company profile |
| `SUPPLIER` | All consumer permissions + create/manage listings, view analytics |
| `MODERATOR` | Approve/reject listings and reviews, view reports |
| `ADMIN` | All moderator permissions + user management, fund management, category management, badge management, system configuration |
| `SUPER_ADMIN` | All admin permissions + manage admin accounts, platform settings |

### 9.4 Organization-Based Access

- Each user belongs to an **Organization** (transport company or IT supplier)
- Organizations can have multiple users with different roles
- Admin roles are scoped to governing organizations (Connekt, TLN, VERN, evofenedex)

### 9.5 Session & Security Rules

- Session max duration: 30 days (web), 90 days (mobile)
- Re-authentication required for sensitive actions: Terugsluis budget spending, listing publish, profile changes
- Rate limiting on auth endpoints: 5 attempts per 15 minutes per IP
- Passwords: min 10 characters, checked against breached password lists (HaveIBeenPwned API)

---

## 10. Terugsluis Budget Integration

### 10.1 Concept

The Dutch Truck Toll Terugsluis system returns toll revenues to the transport sector. Each eligible transport company receives an allocation that can be spent on approved digital solutions via this platform.

### 10.2 Key Flows

1. **Budget allocation** — Admins allocate Terugsluis budgets per transport company (manual or via import)
2. **Eligible product marking** — Admins flag which product categories/listings are eligible for Terugsluis spending
3. **Purchase flow** — Consumer selects product -> system checks Terugsluis balance -> consumer confirms -> balance deducted, order created
4. **Reconciliation** — Monthly export of all Terugsluis transactions for Connekt/government reporting

### 10.3 Data Model Considerations

- `TerugsluitBudget`: company_id, total_allocated, total_spent, remaining, fiscal_year
- `TerugsluitTransaction`: id, budget_id, order_id, amount, timestamp, status
- All monetary values stored as integers in cents (EUR)

---

## 11. Privacy & Data Declaration (Optional)

Suppliers are **encouraged but not required** to complete a data declaration for their listings. When provided, it is displayed as a standardized "Data Label" card on the listing detail page.

### Declaration Fields (all optional)

| Field | Options |
|-------|---------|
| **Data collected** | Free-text list of data types the product collects from end users |
| **Data storage location** | EU / Netherlands / Other (specify) |
| **Third-party sharing** | Yes / No — if yes, describe |
| **Security certifications** | Multi-select: ISO 27001, SOC 2, NEN 7510, None, Other |
| **GDPR compliant** | Yes / No / In progress |
| **Data deletion** | Users can request deletion: Yes / No |

Listings with a completed data declaration receive a "Data Transparant" indicator on their card. This is not a badge — it simply signals that the supplier has disclosed their data practices.

---

## 12. Visual Design & Branding

### 12.1 Design Reference

The platform follows the visual identity of **Logistiek Digitaal** (logistiekdigitaal.nl):

### 12.2 Color Palette

| Token | Color | Usage |
|-------|-------|-------|
| `--primary` | `#1B3054` | Dark navy — headers, primary text, nav background |
| `--primary-light` | `#2A4A7F` | Lighter navy — hover states, secondary elements |
| `--accent` | `#7AB648` | Green — CTA buttons, success states, highlights |
| `--accent-dark` | `#5A9A2F` | Darker green — hover on CTAs |
| `--surface` | `#FFFFFF` | White — cards, content areas |
| `--background` | `#F5F6F8` | Light gray — page background |
| `--border` | `#E2E5EB` | Subtle gray — card borders, dividers |
| `--text-primary` | `#1B3054` | Dark navy — headings, primary body text |
| `--text-secondary` | `#6B7280` | Gray — secondary text, descriptions |
| `--text-muted` | `#9CA3AF` | Light gray — placeholders, metadata |
| `--highlight` | `#00A3E0` | Bright blue — links, interactive elements, category pills |
| `--danger` | `#DC2626` | Red — errors, destructive actions |
| `--warning` | `#F59E0B` | Amber — warnings, pending states |

### 12.3 Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Headings | `"Plus Jakarta Sans", sans-serif` | 700 (Bold) | 2rem–1.25rem |
| Body | `"Plus Jakarta Sans", sans-serif` | 400 (Regular) | 1rem (16px) |
| Small/meta | `"Plus Jakarta Sans", sans-serif` | 400 | 0.875rem (14px) |
| Buttons | `"Plus Jakarta Sans", sans-serif` | 600 (Semibold) | 0.875rem–1rem |

Fallback stack: `"Inter", "Segoe UI", system-ui, sans-serif`

### 12.4 Component Style

- **Cards:** White background, `1px` border `--border`, `border-radius: 12px`, subtle shadow on hover
- **Buttons (primary):** `--accent` green background, white text, rounded (`border-radius: 8px`), semibold
- **Buttons (secondary):** White background, `--primary` border, `--primary` text
- **Navigation:** Dark navy `--primary` top bar with white text, green accent for active state
- **Category pills:** Rounded, light blue or green background with dark text
- **Hero sections:** Full-width with overlaid text on darkened image backgrounds, matching Logistiek Digitaal style
- **Icon style:** Lucide Icons, stroke width 1.5–2, matching the clean line-icon aesthetic from Logistiek Digitaal

### 12.5 Layout Principles

- Responsive: mobile-first, breakpoints at `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Max content width: 1280px, centered
- Card grids: 1 column mobile, 2 columns tablet, 3–4 columns desktop
- Consistent spacing using Tailwind's spacing scale (4px base)

---

## 13. Technical Architecture

### 13.1 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo |
| **Web Framework** | Next.js 15 (App Router) |
| **Mobile Framework** | Expo / React Native (SDK 52+) |
| **Language** | TypeScript 5 |
| **Styling (Web)** | Tailwind CSS 4 |
| **Styling (Mobile)** | NativeWind (Tailwind for React Native) |
| **UI Components (Web)** | shadcn/ui |
| **UI Components (Mobile)** | React Native built-in + custom components matching shadcn style |
| **Icons** | Lucide Icons (`lucide-react` web, `lucide-react-native` mobile) |
| **Data Storage (Demo)** | JSON files in the Git repository + static image files in `/public`. No database required for demo. |
| **Data Storage (Production)** | Prisma ORM + PostgreSQL 16 (future) |
| **Authentication** | NextAuth.js v5 (Auth.js) — credentials provider (email/password + OTP) with future OAuth/OIDC for BDI/DIL |
| **File Storage** | Git repo `/public/uploads/` (demo), S3-compatible object storage (production) |
| **Search** | Client-side JSON filtering (demo), PostgreSQL full-text search or Meilisearch (production) |
| **Email** | Resend or AWS SES |
| **Deployment (Web)** | Vercel |
| **Deployment (Mobile)** | Expo EAS Build + Google Play Store (Android primary), Apple App Store (iOS secondary) |
| **Monitoring** | Sentry (errors), Vercel Analytics or Plausible (usage) |

### 13.2 Project Structure (Turborepo Monorepo)

```
logiappstore/
├── apps/
│   ├── web/                         # Next.js web application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/        # Public storefront routes
│   │   │   │   │   ├── page.tsx     # Landing page
│   │   │   │   │   ├── products/
│   │   │   │   │   │   ├── page.tsx
│   │   │   │   │   │   └── [slug]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   ├── categories/
│   │   │   │   │   │   └── [slug]/
│   │   │   │   │   │       └── page.tsx
│   │   │   │   │   └── suppliers/
│   │   │   │   │       └── [slug]/
│   │   │   │   │           └── page.tsx
│   │   │   │   ├── (auth)/
│   │   │   │   │   ├── login/
│   │   │   │   │   ├── register/
│   │   │   │   │   └── verify-otp/
│   │   │   │   ├── dashboard/       # Consumer dashboard
│   │   │   │   ├── supplier/        # Supplier dashboard
│   │   │   │   ├── admin/           # Admin panel
│   │   │   │   ├── api/             # API routes
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   ├── components/
│   │   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   ├── layout/
│   │   │   │   ├── listings/
│   │   │   │   ├── categories/
│   │   │   │   ├── reviews/
│   │   │   │   └── dashboard/
│   │   │   ├── lib/
│   │   │   └── hooks/
│   │   ├── public/
│   │   │   ├── images/
│   │   │   ├── fonts/
│   │   │   └── uploads/             # Demo: listing screenshots
│   │   ├── tailwind.config.ts
│   │   ├── next.config.ts
│   │   └── package.json
│   │
│   └── mobile/                      # Expo React Native app
│       ├── app/                     # Expo Router (file-based routing)
│       │   ├── (tabs)/
│       │   │   ├── index.tsx        # Home / browse
│       │   │   ├── search.tsx       # Search
│       │   │   ├── budget.tsx       # Terugsluis budget
│       │   │   ├── orders.tsx       # Order history
│       │   │   └── profile.tsx      # Account
│       │   ├── product/
│       │   │   └── [slug].tsx       # Product detail
│       │   ├── category/
│       │   │   └── [slug].tsx       # Category browse
│       │   ├── login.tsx
│       │   └── _layout.tsx
│       ├── components/
│       ├── hooks/
│       ├── app.json
│       ├── eas.json
│       └── package.json
│
├── packages/
│   └── shared/                      # Shared between web & mobile
│       ├── types/                   # TypeScript types/interfaces
│       │   └── index.ts
│       ├── constants/               # Categories, badges, enums
│       │   └── categories.ts
│       ├── validation/              # Zod schemas
│       │   └── listing.ts
│       └── package.json
│
├── data/                            # Demo data (JSON files)
│   ├── listings.json
│   ├── categories.json
│   ├── suppliers.json
│   ├── reviews.json
│   ├── orders.json
│   └── budgets.json
│
├── prisma/                          # Future: production database
│   ├── schema.prisma
│   └── seed.ts
│
├── turbo.json
├── package.json
└── tsconfig.json
```

### 13.3 Database Schema (Prisma — for production, not demo)

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── USERS & ORGANIZATIONS ──────────────────────────────────────

enum UserRole {
  CONSUMER
  SUPPLIER
  MODERATOR
  ADMIN
  SUPER_ADMIN
}

enum OrganizationType {
  TRANSPORT_COMPANY
  IT_SUPPLIER
  GOVERNING_BODY
}

model Organization {
  id          String           @id @default(cuid())
  name        String
  slug        String           @unique
  type        OrganizationType
  kvkNumber   String?          @unique @map("kvk_number")
  description String?
  logo        String?
  website     String?
  phone       String?
  address     String?
  city        String?
  postalCode  String?          @map("postal_code")
  country     String           @default("NL")
  kvkVerified       Boolean          @default(false) @map("kvk_verified")
  kvkVerifiedAt     DateTime?        @map("kvk_verified_at")
  kvkLegalName      String?          @map("kvk_legal_name")
  verificationTier  String           @default("BASIC") // BASIC, VERIFIED, TRUSTED_PARTNER
  trustedPartner    Boolean          @default(false) @map("trusted_partner")
  createdAt         DateTime         @default(now()) @map("created_at")
  updatedAt         DateTime         @updatedAt @map("updated_at")

  users              User[]
  listings           Listing[]
  terugsluitBudgets  TerugsluitBudget[]
  orders             Order[]          @relation("BuyerOrders")
  supplierOrders     Order[]          @relation("SupplierOrders")

  @@map("organizations")
}

model User {
  id             String   @id @default(cuid())
  email          String   @unique
  passwordHash   String   @map("password_hash")
  name           String
  role           UserRole @default(CONSUMER)
  otpSecret      String?  @map("otp_secret")
  otpEnabled     Boolean  @default(false) @map("otp_enabled")
  emailVerified  Boolean  @default(false) @map("email_verified")
  avatar         String?
  active         Boolean  @default(true)
  organizationId String   @map("organization_id")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id])
  reviews      Review[]
  auditLogs    AuditLog[]
  sessions     Session[]

  @@map("users")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique @map("session_token")
  userId       String   @map("user_id")
  expires      DateTime
  createdAt    DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// ─── CATEGORIES (TLN TAXONOMY) ──────────────────────────────────

model Category {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique
  description String?
  icon        String?
  parentId    String?  @map("parent_id")
  sortOrder   Int      @default(0) @map("sort_order")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  listings ListingCategory[]

  @@map("categories")
}

// ─── LISTINGS ───────────────────────────────────────────────────

enum ListingStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  REJECTED
  ARCHIVED
}

enum PricingModel {
  FREE
  ONE_TIME
  SUBSCRIPTION_MONTHLY
  SUBSCRIPTION_YEARLY
  PER_USER
  CUSTOM
}

model Listing {
  id              String        @id @default(cuid())
  title           String
  slug            String        @unique
  shortDescription String       @map("short_description") @db.VarChar(160)
  description     String        @db.Text
  status          ListingStatus @default(DRAFT)
  pricingModel    PricingModel  @map("pricing_model")
  priceInCents    Int?          @map("price_in_cents")
  pricingDetails  String?       @map("pricing_details")
  website         String?
  demoUrl         String?       @map("demo_url")
  videoUrl        String?       @map("video_url")
  featured            Boolean       @default(false)
  terugsluisEligible  Boolean       @default(false) @map("terugsluis_eligible")
  badgeAanbevolen     Boolean       @default(false) @map("badge_aanbevolen")
  badgeAanbevolenBy   String?       @map("badge_aanbevolen_by") // "TLN", "VERN", "evofenedex", "Connekt"
  rejectionReason     String?       @map("rejection_reason")
  publishedAt     DateTime?     @map("published_at")
  organizationId  String        @map("organization_id")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  organization Organization      @relation(fields: [organizationId], references: [id])
  categories   ListingCategory[]
  tags         ListingTag[]
  media        ListingMedia[]
  reviews      Review[]
  orderItems   OrderItem[]
  favorites    Favorite[]

  @@map("listings")
}

model ListingCategory {
  listingId  String @map("listing_id")
  categoryId String @map("category_id")

  listing  Listing  @relation(fields: [listingId], references: [id], onDelete: Cascade)
  category Category @relation(fields: [categoryId], references: [id], onDelete: Cascade)

  @@id([listingId, categoryId])
  @@map("listing_categories")
}

model ListingTag {
  id        String @id @default(cuid())
  listingId String @map("listing_id")
  tag       String

  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([listingId, tag])
  @@map("listing_tags")
}

model ListingMedia {
  id        String   @id @default(cuid())
  listingId String   @map("listing_id")
  url       String
  alt       String?
  type      String   @default("image") // "image" | "video"
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")

  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@map("listing_media")
}

// ─── REVIEWS ────────────────────────────────────────────────────

model Review {
  id              String   @id @default(cuid())
  listingId       String   @map("listing_id")
  userId          String   @map("user_id")
  rating          Int      // 1-5
  title           String?
  body            String?  @db.Text
  supplierReply   String?  @map("supplier_reply") @db.Text
  supplierRepliedAt DateTime? @map("supplier_replied_at")
  visible         Boolean  @default(true)
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)
  user    User    @relation(fields: [userId], references: [id])

  @@unique([listingId, userId])
  @@map("reviews")
}

// ─── ORDERS & TERUGSLUIS ────────────────────────────────────────

enum OrderStatus {
  PENDING
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
}

model Order {
  id                 String      @id @default(cuid())
  orderNumber        String      @unique @map("order_number")
  buyerOrgId         String      @map("buyer_org_id")
  supplierOrgId      String      @map("supplier_org_id")
  status             OrderStatus @default(PENDING)
  totalInCents       Int         @map("total_in_cents")
  terpigsluisAmountInCents Int?  @map("terugsluis_amount_in_cents")
  notes              String?     @db.Text
  createdAt          DateTime    @default(now()) @map("created_at")
  updatedAt          DateTime    @updatedAt @map("updated_at")

  buyerOrg           Organization         @relation("BuyerOrders", fields: [buyerOrgId], references: [id])
  supplierOrg        Organization         @relation("SupplierOrders", fields: [supplierOrgId], references: [id])
  items              OrderItem[]
  terpigsluisTransaction TerugsluitTransaction?

  @@map("orders")
}

model OrderItem {
  id           String @id @default(cuid())
  orderId      String @map("order_id")
  listingId    String @map("listing_id")
  quantity     Int    @default(1)
  priceInCents Int    @map("price_in_cents")

  order   Order   @relation(fields: [orderId], references: [id], onDelete: Cascade)
  listing Listing @relation(fields: [listingId], references: [id])

  @@map("order_items")
}

model TerugsluitBudget {
  id              String   @id @default(cuid())
  organizationId  String   @map("organization_id")
  fiscalYear      Int      @map("fiscal_year")
  totalAllocated  Int      @map("total_allocated") // in cents
  totalSpent      Int      @default(0) @map("total_spent") // in cents
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  organization Organization          @relation(fields: [organizationId], references: [id])
  transactions TerugsluitTransaction[]

  @@unique([organizationId, fiscalYear])
  @@map("terugsluis_budgets")
}

model TerugsluitTransaction {
  id          String   @id @default(cuid())
  budgetId    String   @map("budget_id")
  orderId     String   @unique @map("order_id")
  amountInCents Int    @map("amount_in_cents")
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  budget TerugsluitBudget @relation(fields: [budgetId], references: [id])
  order  Order            @relation(fields: [orderId], references: [id])

  @@map("terugsluis_transactions")
}

// ─── FAVORITES ──────────────────────────────────────────────────

model Favorite {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  listingId String   @map("listing_id")
  createdAt DateTime @default(now()) @map("created_at")

  listing Listing @relation(fields: [listingId], references: [id], onDelete: Cascade)

  @@unique([userId, listingId])
  @@map("favorites")
}

// ─── AUDIT LOG ──────────────────────────────────────────────────

model AuditLog {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  action     String
  entityType String   @map("entity_type")
  entityId   String   @map("entity_id")
  metadata   Json?
  createdAt  DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id])

  @@index([entityType, entityId])
  @@map("audit_logs")
}
```

### 13.4 Key API Routes

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/listings` | List/search/filter listings | Public |
| GET | `/api/listings/[slug]` | Get listing detail | Public |
| POST | `/api/listings` | Create new listing | Supplier |
| PATCH | `/api/listings/[id]` | Update listing | Supplier (owner) |
| POST | `/api/listings/[id]/submit` | Submit for review | Supplier (owner) |
| POST | `/api/upload` | Upload media file | Supplier |
| GET | `/api/categories` | Get category tree | Public |
| GET | `/api/reviews?listingId=X` | Get reviews for listing | Public |
| POST | `/api/reviews` | Create review | Consumer |
| POST | `/api/orders` | Create order | Consumer |
| GET | `/api/orders` | List orders | Consumer/Supplier |
| PATCH | `/api/orders/[id]` | Update order status | Supplier |
| GET | `/api/terugsluis/budget` | Get user's org budget | Consumer |
| POST | `/api/auth/register` | Register new user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/verify-otp` | Verify OTP code | Public |
| GET | `/api/admin/listings/pending` | Get moderation queue | Admin |
| POST | `/api/admin/listings/[id]/approve` | Approve listing | Admin |
| POST | `/api/admin/listings/[id]/reject` | Reject listing | Admin |

---

## 14. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | Page load < 2s (LCP), Time to Interactive < 3s |
| **Availability** | 99.5% uptime |
| **Scalability** | Support 10,000 concurrent users |
| **Security** | OWASP Top 10 compliance, HTTPS only, CSRF protection, rate limiting |
| **Privacy** | GDPR-compliant, data processing agreement with hosting provider |
| **Accessibility** | WCAG 2.1 AA compliance |
| **Localization** | Dutch (primary), English (secondary / future) |
| **Browser support** | Latest 2 versions of Chrome, Firefox, Safari, Edge |
| **SEO** | Server-rendered pages, structured data (JSON-LD) for listings |

---

## 15. Development Phases

### Phase 1 — Demo / Prototype

- **Data:** JSON files in Git repo, no database
- Monorepo setup (Turborepo: `apps/web`, `apps/mobile`, `packages/shared`)
- Public storefront (web): landing page, category browsing, listing cards, listing detail, search
- Listing content rules enforced in UI (character limits, screenshot dimensions)
- Quality badges displayed on listings (Geverifieerd, Terugsluis Geschikt, Aanbevolen, Populair)
- Seed data: TLN taxonomy categories, sample listings with screenshots
- Responsive design with Logistiek Digitaal styling
- Mobile app (Expo): browse, search, product detail — reading from same JSON data via API

### Phase 2 — MVP (Functional)

- Consumer registration & login (email/password + OTP)
- KvK verification flow (KvK API integration)
- Supplier registration & listing creation wizard with content rule validation
- Auto-publish after automated checks pass (moderation optional)
- Basic Terugsluis budget display (manual allocation)
- Migrate from JSON to Prisma + PostgreSQL
- Mobile app: authentication, budget view, push notifications

### Phase 3 — Marketplace

- Orders & purchase flow with Terugsluis budget deduction
- Reviews & ratings (verified purchasers only, supplier replies)
- Supplier analytics dashboard
- Admin dashboard, user management, audit log
- Badge management for admins (Vertrouwde Partner, Aanbevolen assignment)
- Optional privacy/data declaration per listing
- Email notifications
- Favorites / watchlist
- Mobile app: orders, reviews, favorites

### Phase 4 — Advanced Features

- BDI/DIL IAA integration for federated authentication
- Optional listing moderation workflows (per-category toggleable)
- Product comparison
- Digital maturity scan with recommendations
- Advanced search (Meilisearch)
- Platform-wide analytics & reporting
- Multi-organization admin roles
- Content management (FAQ, static pages)

### Phase 5 — Scale & Integrate

- eHerkenning integration
- API for external systems integration
- Terugsluis fund API integration (if/when available from Connekt)
- Advanced recommendation engine
- Mobile app: offline mode, deep linking

---

## 16. Governance Model

| Organization | Role |
|--------------|------|
| **Connekt** | Platform owner, Terugsluis fund administration, strategic direction |
| **TLN** | Category taxonomy maintenance, transport sector expertise, member outreach |
| **VERN** | Representation of owner-operators (eigen rijders), member outreach |
| **evofenedex** | Shipper/logistics perspective, quality standards |

### Moderation Workflow (Optional — Lightweight)

Due to limited staff capacity, the default workflow is **auto-publish** after automated checks pass. Manual moderation can be enabled per category or platform-wide when resources allow.

**Default flow (auto-publish):**
1. Supplier submits listing
2. Automated checks run (required fields, screenshot dimensions, KvK verified, category selected)
3. All checks pass -> status: `PUBLISHED`, listing visible in store
4. Checks fail -> status: `DRAFT`, supplier sees specific validation errors

**Optional manual moderation (when enabled):**
1. Supplier submits listing -> automated checks pass -> status: `PENDING_REVIEW`
2. Moderator from any governing org reviews listing
3. **Approve** -> status: `PUBLISHED`
4. **Reject** -> status: `REJECTED`, supplier receives feedback with reason
5. Supplier can edit and resubmit rejected listings

**Community moderation:**
- Users can flag listings or reviews
- After 3+ flags: content auto-hidden pending admin review
- Admins review flagged content in a lightweight queue

---

## 17. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Low supplier adoption | Empty marketplace | Pre-launch outreach program via TLN/evofenedex networks; seed with known logistics IT vendors |
| Terugsluis fund rules change | Budget model becomes invalid | Abstract Terugsluis logic behind a configurable rules engine; maintain close relationship with Connekt |
| BDI/DIL IAA not ready | Cannot use federated auth | Tier 1 (email/password + OTP) is fully functional standalone; BDI/DIL is additive |
| Low transport SME digital literacy | Poor adoption | Simple, guided UX; onboarding wizard; Dutch-language throughout; alignment with Logistiek Digitaal educational content |
| Multi-stakeholder governance complexity | Slow decision-making | Clear RACI matrix; defined SLAs for moderation response times |

---

## 18. Open Questions

| # | Question | Owner |
|---|----------|-------|
| 1 | What are the exact Terugsluis fund eligibility criteria per product category? | Connekt |
| 2 | What is the Terugsluis budget allocation mechanism — per-company flat rate, fleet-size based, or other? | Connekt |
| 3 | Is there an existing API or data feed for Terugsluis budget allocations, or will this be manual? | Connekt |
| 4 | What is the current status/timeline of BDI/DIL IAA framework availability for third-party integration? | BDI/DIL |
| 5 | Should suppliers pay a listing fee or commission, or is the platform fully funded by Terugsluis/governing bodies? | Connekt / TLN |
| 6 | Are there existing agreements with IT vendors to seed the marketplace at launch? | TLN / evofenedex |
| 7 | What is the legal entity that will operate the platform (Connekt, a joint foundation, or other)? | All stakeholders |
| 8 | Should the platform support hardware products (e.g., tachograph readers, dashcams) or software-only? | TLN |
| 9 | What moderation SLAs should apply (e.g., review within 48h)? | All stakeholders |
| 10 | Will the Mijn Digitale Landschap taxonomy be maintained by TLN separately, or managed within this platform? | TLN |

---

*This is a living document. It will be refined through stakeholder review before development begins.*
