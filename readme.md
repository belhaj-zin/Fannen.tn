# 🎨 Fannen.tn

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

> 🎓 **Academic Project** | 🖼️ **Artisan Portfolio** | 🇹🇳 **Made in Tunisia**

**Fannen.tn** is a digital portfolio and networking platform designed specifically for Tunisian artisans, such as potters, weavers, and woodworkers. Developed as an academic project for a "Développement Web" course, it aims to provide a modern showcase for physical crafts while omitting standard e-commerce features. The primary objectives are visual showcasing of Tunisian heritage, positive social reinforcement through an appreciation badge system, and direct lead generation via internal messaging.

---

> 🛠️ **Current Status**: The current implementation focuses on the static HTML5 structure and CSS3 styling. **Vanilla JavaScript interactions and the Native PHP backend functionality are planned for later implementation**.

## 📸 Visual Showcase

Explore the design and user journey envisioned for Fannen.tn through these high-fidelity mockups created during the design phase:

### 🏠 **Global Feed (index.html)**
*Mockup placeholder: Index page showing masonry grid of artisan works*

The homepage serves as the global discovery feed, utilizing a masonry-style grid to display uploaded artworks. It features visual category filter buttons that allow users to dynamic filter the feed (e.g., viewing only "Ceramics") without reloading the page.

### 🛡️ **Authentication Hub (auth.html)**
*Mockup placeholder: Split-screen login/register form with role selection*

The authentication interface includes toggleable login and registration forms. A critical feature here is the role selection via radio buttons, allowing users to register specifically as either an **Artisan** (content creator) or a standard **User** (browser/interactor).

### ⭐ **Artwork Showcase (artwork_detail.html)**
*Mockup placeholder: Detailed view with large image, description, and Kudos badges*

This page provides a detailed view of a specific craft, featuring a large high-resolution image, detailed description, and an artisan profile snippet. It serves as the hub for interaction, hosting the unique "Kudos" badge system and the primary "Contact Artisan" button.

### 💰 **Kudos & Messaging Flow**
*Mockup placeholder: Close-up of Kudos badges and the messaging modal interface*

Fannen.tn replaces numerical ratings with specific appreciation badges (e.g., "Incredible Technique", "Creative Idea"). Users can also click "Contact Artisan" to open a messaging form regarding a specific artwork, facilitating direct inquiries.

### 📋 **Artisan Dashboard (dashboard.html)**
*Mockup placeholder: Artisan backend view with upload form and active listings*

Artisans have access to a private workspace featuring an upload form for new listings (Title, Category, Description, Image) and a grid view of their own active portfolio items with Edit/Delete capabilities.

### 🔍 **Messaging Inbox (inbox.html)**
*Mockup placeholder: Two-pane communication hub layout*

The communication hub utilizes a classic two-pane layout: a conversation list on the left and the active message thread on the right, displaying inquiries linked to specific artworks.

## ✨ Key Features

- 👥 **Role-Based Access Control (RBAC)** — Distinct user roles for Artisans (content management) and Users (browsing and interaction).

- 🖼️ **Portfolio CRUD** — Artisans can completely manage their digital portfolio, including uploading high-resolution images, categorizing crafts (e.g., Ceramics, Textiles), and adding detailed descriptions.

- ⭐ **Asynchronous "Kudos" System** — A positive social reinforcement mechanism utilizing specific appreciation badges instead of 1-5 star ratings.

- 💬 **Direct Messaging (Inquiry System)** — Private communication channel allowing users to send direct inquiries to Artisans regarding specific artworks.

- 🌀 **Dynamic Gallery** — A masonry-style grid feed that supports filtering by category without page reloads (to be handled via JS DOM manipulation).

## 🛠️ Tech Stack (Strict Constraints)

This project strictly adheres to a foundational web development stack to demonstrate core competency without external frameworks.

| Technology | Purpose | Constraint |
|------------|---------|------------|
| **HTML5** | Semantic structure | Native, semantic markup |
| **CSS3** | Styling & Layout | Native CSS (Grid, Flexbox, variables, transitions). No frameworks like Tailwind |
| **Vanilla JavaScript** | Frontend Logic | ES6+, strict DOM manipulation, Event Listeners, and Fetch API (Planned) |
| **Native PHP** | Backend Logic | Handling routing, form validation, file uploads, and session management (Planned) |
| **SQL (MySQL/PostgreSQL)** | Database | Normalized relational structure. Must use prepared statements (PDO) (Planned) |

## 🌟 Try It Out!

As this is an academic project currently focused on frontend structure and design, a live interactive demo is not yet available. However, you can explore the design language and intended structure:

### 🚀 Option 1: Explore the live demo (Recommended)
**Explore the envisioned user interface immediately!**

- [![Visit Fannen.tn Design Gallery](https://img.shields.io/badge/Visit_Live_URL-D8603B?style=for-the-badge&logoColor=white)](https://roaring-cendol-b1e95b.netlify.app/src/index.html)

---

### 🔧 Option 2: Run Frontend Locally
**Explore the HTML/CSS structure on your local machine.**

#### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari).

#### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [https://github.com/tammam-bt/fannen.tn.git](https://github.com/tammam-bt/fannen.tn.git)
   cd fannen.tn
   ```
2. **Navigate to the source files**
   ```bash
   cd src
   ```
Open index.html
Double-click index.html to open it directly in your web browser. You can navigate between the existing static pages using the links in the header.

**💡 Development Note**: Interactivity requiring JavaScript (filtering, Kudos updates) and backend functionality (login, uploads, messaging) are not yet implemented in the codebase.

### 📁 Project Structure
Fannen.tn is organized with a clear separation between raw resources and the main application source code.
```
📦 Fannen.tn/
│
├── 🖼️ Resources/                      # Non-code assets
│   ├── img/                           # Placeholder photos & design mockups
│   └── logo/                          # Site & brand logos
│
├── 💻 src/                            # Application Source Code
│   ├── index.html                     # Global Feed / Discovery page (Level 1)
│   │
│   ├── 📄 html/                       # Secondary HTML pages (Level 2)
│   │   ├── auth.html                  # Authentication Hub
│   │   ├── artwork_detail.html        # Detailed Showcase
│   │   ├── dashboard.html             # Artisan Workspace
│   │   └── inbox.html                 # Communication Hub
│   │
│   └── 🎨 css/                        # Stylesheets
│       └── styles.css                 # Centralized global styles (vars, grid, flex)
│
└── 📄 README.md                       # Project documentation
```
### 🔄 Planned Workflow Overview (Mental Model)
**`index.html`** (JS) → Fetches artworks via API → Renders Masonry Grid

**`auth.html`** (Backend) → Validates inputs → Hashes passwords → Initiates $_SESSION

**`artwork_detail.html`** (Fetch API) → Updates Kudos count asynchrounously

**`dashboard.html`** (PHP) → Handles multipart/form-data for file uploads → Executes INSERT queries

**`inbox.html`** (SQL) → Queries messages table based on session ID

### 🚀 Skills Developed
This project provides hands-on experience with:

**🏗️ Monolithic Architecture** — Designing a tightly coupled backend/frontend system using native technologies.

**🎨 Component-Based Styling** — Utilizing native CSS variables and utility classes for a cohesive design system without frameworks.

**👥 Role-Based logic** — Structuring user journeys and page access based on distinct user roles.

**🗃️ Normalized DB Design** — Planning relational SQL structures to handle users, artworks, kudos, and messages with integrity (Planned).

**⚡ Asynchronous UX** — Planning Fetch API implementations for features like live filtering and real-time social engagement (Planned).

### 🤝 Support & Contribution
We'd love to hear from you! Fannen.tn is an open academic project, and community interaction helps improve the learning experience.

**🌟 Ways to Get Involved:**
⭐ Star this repository if you find the concept or design interesting

🐛 Report design inconsistencies or HTML/CSS bugs by opening an issue on GitHub

💡 Suggest feature enhancements for future PHP/JS implementation through discussions

📖 Share your experience - let us know if you have tips for native PHP/JS development!

### 📬 Get in Touch
GitHub Issues: For bug reports and technical questions regarding the existing code.

Discussions: For general conversation about the project concept.

### 🎓 Academic Project Notice

This is a non-commercial, educational-focused project built for learning purposes within the context of university coursework. It is not intended for commercial competition or profit generation of any kind.

### 🙏 Special Thanks
This project is guided and inspired by the Tunisian web development community and standard bodies. Thank you for empowering the next generation of Tunisian developers! 🚀
