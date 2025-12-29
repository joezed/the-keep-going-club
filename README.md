# The Keep Going Club Website

This repository contains the static website for **The Keep Going Club**, a grassroots mental-health movement based in Nottingham. The latest version lives in the `web/` directory and introduces the club, its values, supporter opportunities, and the volunteer team.

## What's in the new version
- **Homepage (`web/index.html`)** — Full hero with an accessibility-aware background slideshow, mission highlights, and a dynamic volunteer grid populated from `volunteers.json`.
- **About (`web/about.html`)** — The club’s core values plus Maxi’s story, using the shared layout and typography system.
- **Support (`web/support.html`)** — Explains how businesses can help and showcases supporters in an infinite logo carousel, with clear calls to action for sponsorships and volunteering.
- **Styling (`web/styles.css`)** — Centralized design tokens, responsive layout rules, and shared components (navigation, hero, cards, CTA pills).
- **Behavior (`web/script.js`)** — Handles the mobile drawer, volunteer rendering, hero slideshow, and supporter carousel setup.
- **Assets (`web/assets/`)** — Brand imagery, landing photography, supporter logos, and team avatars referenced across the site.

## Getting started
1. Clone the repository and move into the project folder:
   ```bash
   git clone https://example.com/the-keep-going-club.git
   cd the-keep-going-club
   ```
2. Serve the site locally from the `web/` directory (recommended to avoid JSON fetch issues):
   ```bash
   cd web
   python -m http.server 8000
   # then visit http://localhost:8000
   ```
   You can also open `web/index.html` directly, but the volunteer grid requires a local server to load `volunteers.json`.

## Project structure
```
.
├── README.md
└── web/
    ├── index.html       # Homepage with hero, mission, and volunteer grid
    ├── about.html       # Values and Maxi’s story
    ├── support.html     # Support options and supporter logo carousel
    ├── styles.css       # Shared styling, layout, and responsive rules
    ├── script.js        # Navigation, hero slideshow, volunteers, carousel
    ├── volunteers.json  # Volunteer data rendered on the homepage
    └── assets/          # Images, supporter logos, team avatars, icons
```

## Contributing
This website represents The Keep Going Club’s official public presence. To suggest updates or report issues, please contact the maintainers or open a pull request for review. Contributions are accepted at the maintainers’ discretion.

## License
Copyright (c) 2025 The Keep Going Club. All rights reserved.

This repository is provided for reference and collaboration with explicit permission. No part of the code, design, images, or written content may be reproduced, distributed, or used in other projects without prior written consent from The Keep Going Club. Unauthorized use is prohibited.
