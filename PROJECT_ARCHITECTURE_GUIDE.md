# Fannen.tn Project Architecture Guide

## 1) Project Goal and Product Intent

Fannen.tn is a portfolio and networking platform centered on Tunisian artisans.

The current codebase is a frontend-first implementation using static pages, reusable CSS, Vanilla JavaScript components, and local JSON files as mock data sources.

Core product goals already reflected in the current implementation:
- Discover artisan works in a gallery feed.
- Explore artwork details and engage through kudos/inquiry actions.
- Support role-based behavior (enthusiast vs artisan) in a simulated way.
- Provide artisan-side management pages (dashboard and inbox) with realistic UI behavior.

Current implementation maturity:
- Fully static frontend architecture with dynamic DOM behavior.
- No real backend yet (auth, uploads, persistence, and messaging are mocked).
- Data is currently loaded from local JSON files with fetch.

---

## 2) High-Level Architecture

The project follows a modular static-web architecture with clear separation of concerns:

- Presentation layer:
  - HTML pages define page skeletons and semantic structure.
  - A single global stylesheet provides design tokens, utility classes, and component/page styling.

- Behavior layer:
  - One global script initializes cross-page behavior.
  - Feature scripts in src/js/components are page-specific and attach behavior on DOMContentLoaded.

- Data layer (mock):
  - JSON files in src/js/data emulate backend responses for artworks, conversations, messages, and team members.

- Client-side state layer:
  - localStorage is used to simulate authentication, kudos history, message drafts, and sent messages.

This gives you a pseudo-MVC feeling in a static app:
- View: HTML + CSS
- Controller logic: component JS files
- Model (mock): JSON files + localStorage keys

---

## 3) Repository Structure and Responsibilities

Root level:
- readme.md: product vision, feature goals, stack constraints, and usage notes.
- PROJECT_ARCHITECTURE_GUIDE.md: this technical architecture handover document.
- .gitignore: repository ignore rules.

Assets:
- Resources/logo/logo.svg: platform logo used in navbars and branding blocks.
- Resources/img/*.jpg: team images used by the Our Story page.

Application source (src):
- src/index.html: homepage gallery and marketing hero.
- src/css/styles.css: global design system and page styles.
- src/html/auth.html: login/register UX and role selection.
- src/html/artwork_detail.html: artwork deep-dive page + inquiry action.
- src/html/dashboard.html: artisan workspace (portfolio table, upload area).
- src/html/inbox.html: conversation list + chat thread page.
- src/html/our_story.html: narrative/about page with dynamic team cards.

JavaScript:
- src/js/main.js: global runtime behaviors shared across pages.
- src/js/components/about.js: team rendering logic for our_story page.
- src/js/components/auth.js: auth form interaction + mock login flow.
- src/js/components/gallery.js: homepage gallery fetch/render/filter + kudos toggling.
- src/js/components/interaction.js: artwork detail population, kudos badge behavior, inquiry modal.
- src/js/components/dashboard.js: dashboard route guard, upload mock, portfolio table render and interactions.
- src/js/components/inbox.js: inbox route guard, conversations/messages rendering, chat input behavior.

Mock data:
- src/js/data/artworks.json: artwork catalog + metadata (category, kudos, status, views).
- src/js/data/conversations.json: inbox conversation summaries.
- src/js/data/messages.json: per-conversation message thread entries.
- src/js/data/team.json: team cards used on Our Story page.

---

## 4) Page-Level Build and Script Composition

### 4.1 Home page (src/index.html)
Purpose:
- Entry point and discovery feed.

Composition:
- Navbar + hero + category filters + gallery grid + footer.
- Loads scripts in this order:
  1. src/js/main.js
  2. src/js/components/gallery.js

Why order matters:
- gallery.js optionally calls initImageFallbacks from main.js after dynamic rendering.

### 4.2 Auth page (src/html/auth.html)
Purpose:
- Simulated sign-in/register UI.

Composition:
- Split layout: visual branding side + form side.
- Loads:
  1. src/js/main.js
  2. src/js/components/auth.js

Behavior:
- Form submit writes auth state into localStorage.
- Redirect target depends on selected role.

### 4.3 Artwork detail (src/html/artwork_detail.html)
Purpose:
- Detailed artwork story and engagement.

Composition:
- Left visual panel + right info/interaction panel.
- Loads:
  1. src/js/main.js
  2. src/js/components/interaction.js

Behavior:
- Reads query param id, fetches artwork from artworks.json, renders details.
- Provides follow toggle, per-badge kudos interaction, and inquiry modal.

### 4.4 Dashboard (src/html/dashboard.html)
Purpose:
- Artisan control center for portfolio and upload simulation.

Composition:
- Top bar + sidebar + stats + upload zone + portfolio table.
- Loads:
  1. src/js/main.js
  2. src/js/components/dashboard.js

Behavior:
- Route guard checks role from localStorage.
- Fetches artworks.json and renders portfolio rows.
- Supports mocked edit/delete table actions and drag/drop upload UI.

### 4.5 Inbox (src/html/inbox.html)
Purpose:
- Artisan communication center.

Composition:
- Sidebar + conversation list + active chat panel + input area.
- Loads:
  1. src/js/main.js
  2. src/js/components/inbox.js

Behavior:
- Route guard checks artisan role.
- Fetches conversations then thread messages by selected conversation.
- Allows local sending simulation and localStorage persistence.

### 4.6 Our Story (src/html/our_story.html)
Purpose:
- Brand narrative + team showcase.

Composition:
- Narrative sections and dynamic team card grid.
- Loads:
  1. src/js/main.js
  2. src/js/components/about.js

Behavior:
- Fetches team.json and injects cards into the team grid.

---

## 5) JavaScript Architecture and Runtime Conventions

### 5.1 Global script role (src/js/main.js)
Responsibilities:
- On DOMContentLoaded:
  - initNavbar(): rewrites navbar actions based on local auth state.
  - initImageFallbacks(): attaches image error fallback handlers.
- Defines isLevel2() helper to differentiate path logic for pages under src/html.
- Adds notifications popup behavior for buttons with aria-label Notifications.

Important pattern:
- Main script exposes utility functions globally by function declarations, enabling component scripts to reuse them when loaded afterward.

### 5.2 Component scripts pattern
Every component script:
- Uses DOMContentLoaded to avoid race conditions.
- Scope-checks required container elements and returns early if not present.
- Uses fetch for JSON data.
- Uses event delegation or direct listener attachment.
- Uses localStorage for mock persistence.

### 5.3 State model in localStorage
Keys currently used:
- fannen_auth_state:
  - Shape: { isLoggedIn: boolean, role: string, userId: string }
  - Set in auth.js, consumed by main.js, dashboard.js, inbox.js.

- fannen_kudos_history:
  - Gallery-level array of artwork IDs user liked in gallery feed.

- fannen_kudos_history_0 / _1 / _2 / ...:
  - Artwork-detail per-badge tracking arrays for each badge index.

- fannen_sent_messages:
  - Locally sent messages from inbox and inquiry modal.

- fannen_draft_messages:
  - Draft text preserved for inquiry modal textarea.

This approach provides user-session realism while staying backend-free.

---

## 6) Data Contracts (Mock JSON Schemas)

### 6.1 artworks.json
Represents gallery + dashboard portfolio records.

Fields used in code:
- id: unique artwork ID (used in URLs and kudos tracking).
- title
- artisanId
- artisanName
- category
- description
- image
- kudos.count and kudos.badges
- status
- views
- dateAdded
- timestamp

Consumption points:
- gallery.js: renders card feed and category filtering.
- interaction.js: resolves artwork by query param id.
- dashboard.js: renders table rows.

### 6.2 conversations.json
Represents inbox left-panel summary entries.

Fields:
- id
- partnerName
- avatar
- lastMessage
- timestamp
- unreadCount
- isActive

Consumption point:
- inbox.js for list rendering and active selection logic.

### 6.3 messages.json
Represents message history records by conversation.

Fields:
- id
- conversationId
- type (sent or received)
- content
- time

Consumption point:
- inbox.js filters messages by selected conversation id.

### 6.4 team.json
Represents cards for team showcase.

Fields:
- id
- name
- image
- role
- description

Consumption point:
- about.js renders dynamic team grid on our_story page.

---

## 7) UI and CSS Architecture

The stylesheet src/css/styles.css is a centralized design system with four layers:

1. Design tokens in :root:
- Color palette
- Typography families
- Spacing scale
- Radius values
- Shadow values

2. Base and reset:
- Box model normalization
- Typography defaults
- Global element styling (body, headings, links, images, buttons)

3. Utility classes:
- Layout helpers (flex, grid, gap, alignment)
- Typography helpers (font and text utility classes)
- Reusable button/form classes

4. Page/component blocks:
- Navbar, hero, gallery, footer
- Auth layout
- Modal styles
- Dashboard layout, stats cards, table, upload zone
- Inbox layout and message bubbles
- Artwork detail layout

Design implication:
- You can build future screens quickly by combining utility classes and existing block styles before adding new CSS rules.

---

## 8) Navigation, Pathing, and Relative-URL Strategy

The project uses mixed page depth:
- Level 1: src/index.html
- Level 2: src/html/*.html

Because of this, script and asset paths are depth-aware:
- index page uses paths like js/... and css/...
- level 2 pages use ../js/... and ../css/...

Global helper isLevel2() in main.js is used for redirect and navbar-link correction.

Practical rule for future pages:
- If new page is under src/html, always verify every asset/script/fetch path begins with ../ as needed.

---

## 9) End-to-End Runtime Flows

### 9.1 Visitor browsing flow
1. User lands on index page.
2. gallery.js fetches artworks.json and renders cards.
3. Category buttons filter in-memory artwork array.
4. Kudos toggle updates localStorage and UI state.

### 9.2 Login flow (mock)
1. User opens auth page.
2. Form submission writes fannen_auth_state.
3. Role decides redirect:
   - artisan -> dashboard.html
   - user -> ../index.html
4. main.js updates navbar on subsequent pages.

### 9.3 Dashboard flow
1. dashboard.js validates artisan role from fannen_auth_state.
2. If unauthorized, redirects to auth page.
3. Fetches artworks.json and injects portfolio rows.
4. Mock controls support upload/select/edit/delete interactions.

### 9.4 Inbox flow
1. inbox.js validates artisan role.
2. Fetches conversations and renders list.
3. Selecting a conversation fetches messages and renders bubbles.
4. Sending a new message appends to UI and persists in localStorage.

### 9.5 Artwork detail inquiry flow
1. artwork_detail page reads id from query string.
2. interaction.js fetches artworks.json and renders detail view.
3. Inquiry button opens modal.
4. Draft is autosaved in localStorage.
5. Sending pushes a message object into fannen_sent_messages.

---

## 10) Current Strengths and Technical Debt Snapshot

Strengths:
- Clean separation between global and feature-specific scripts.
- Predictable page initialization with DOMContentLoaded.
- Reusable CSS system and shared UI language.
- Realistic local mock behavior for auth, kudos, and messaging.
- JSON datasets are consistent and easy to evolve.

Technical debt and caveats to keep in mind while continuing:
- No backend/API integration yet, so all security and persistence are simulated.
- Role-based protection is client-side only (easy to bypass, expected at this stage).
- Some interactions rely on inline styles and alert/confirm mocks.
- artwork detail image fallback path and placeholder dependency should be verified if adding local image assets.
- There is category mismatch potential: UI has jewelry filter while sample data currently includes woodwork; this can cause empty filter results unless expanded.

---

## 11) How To Continue Development Safely

Recommended incremental roadmap:

Phase A: Stabilize frontend contracts
- Define final JSON contracts for artworks, users, conversations, messages.
- Remove duplicate assumptions (e.g., category values and status enums).
- Move inline styles to CSS classes where possible.

Phase B: Introduce real backend endpoints
- Replace local JSON fetch with API routes.
- Replace localStorage auth with session/JWT flow.
- Implement real upload endpoint for dashboard.

Phase C: Connect inbox and inquiry pipelines
- Persist inquiries/messages server-side.
- Load sent messages from backend, not localStorage only.
- Add message status and timestamps from server source of truth.

Phase D: Quality and maintainability
- Add input validation and error boundaries.
- Add JS unit/integration tests for key flows.
- Add linting and formatting standards.

---

## 12) Quick Start Mental Map (for a new contributor)

If you only have 30 minutes to regain full context, inspect in this order:
1. src/index.html (global UX entry)
2. src/js/main.js (cross-page runtime rules)
3. src/js/components/gallery.js (dynamic rendering baseline)
4. src/js/components/auth.js + dashboard.js (role simulation)
5. src/js/components/inbox.js + interaction.js (message/inquiry behaviors)
6. src/js/data/*.json (current data shape contracts)
7. src/css/styles.css (design system and reusable classes)

After this sequence, you can safely implement new features without breaking existing architecture assumptions.

---

## 13) Practical Extension Patterns

To add a new page:
- Create src/html/new_page.html.
- Include ../css/styles.css and ../js/main.js.
- Create src/js/components/new_page.js and load it after main.js.
- Use an explicit root container ID and early-return if container missing.
- If data-driven, add a dedicated JSON file under src/js/data or wire to API in later phases.

To add a new dataset field:
- Update JSON records first.
- Update render logic in all consumers (gallery, detail, dashboard, etc.).
- Ensure fallback UI exists for missing values.

To add a new auth-protected page:
- Reuse the route-guard logic pattern from dashboard.js/inbox.js.
- Decide allowed roles and redirect strategy.

---

## 14) Final Summary

This project is already organized as a strong frontend foundation for a future full-stack artisan platform:
- Structured pages with clear user journeys.
- Reusable global style system.
- Modular Vanilla JS components.
- Mock data and state models that simulate real workflows.

You can now continue confidently by preserving this separation:
- Keep page structure in HTML.
- Keep reusable visual language in styles.css.
- Keep behavior isolated per feature in src/js/components.
- Keep data contracts explicit and versioned as you move from JSON mocks to real APIs.
