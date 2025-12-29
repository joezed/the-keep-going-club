// script.js
(function () {
  // -----------------------------
  // Mobile drawer toggle
  // -----------------------------
  const btn = document.querySelector(".hamburger");
  const drawer = document.querySelector(".drawer");

  function closeDrawer() {
    if (!drawer || !btn) return;
    drawer.classList.remove("open");
    btn.setAttribute("aria-expanded", "false");
  }

  if (btn && drawer) {
    btn.addEventListener("click", () => {
      const isOpen = drawer.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(isOpen));
    });

    drawer.addEventListener("click", (e) => {
      if (e.target && e.target.matches("a")) closeDrawer();
    });

    document.addEventListener("click", (e) => {
      if (!drawer.classList.contains("open")) return;
      const clickedInside = drawer.contains(e.target) || btn.contains(e.target);
      if (!clickedInside) closeDrawer();
    });
  }

  // -----------------------------
  // Footer year
  // -----------------------------
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // -----------------------------
  // Volunteers JSON rendering
  // (only runs on pages that have the grid)
  // -----------------------------
  const grid = document.getElementById("volunteer-grid");
  const fallback = document.getElementById("volunteer-fallback");

  const escapeHtml = (str = "") =>
    String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]));

  const renderVolunteerCard = (v) => {
    const name = escapeHtml(v.name || "Name");
    const role = escapeHtml(v.role || "Role");
    const img = (v.image && String(v.image).trim()) ? String(v.image).trim() : "";
    const alt = escapeHtml(v.alt || `${v.name || "Volunteer"} photo`);

    const links = Array.isArray(v.links) ? v.links : [];
    const linksHtml = links
      .filter(l => l && l.label && l.url)
      .map(l => {
        const label = escapeHtml(l.label);
        const url = String(l.url);
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      })
      .join("");

	return `
	  <article class="vol-card">
		<div class="vol-photo">
		  ${
			img
			  ? `<img src="${img}" alt="${alt}" loading="lazy" />`
			  : `<span style="font-weight:900; color: rgba(12,79,94,.55);">Photo</span>`
		  }
		</div>

		<div class="vol-body">
		  <p class="vol-name">${name}</p>
		  <p class="vol-role">${role}</p>
		  ${linksHtml ? `<div class="vol-links">${linksHtml}</div>` : ``}
		</div>
	  </article>
	`;

  };

  async function loadVolunteers() {
    if (!grid) return;

    try {
      const res = await fetch("volunteers.json", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const volunteers = Array.isArray(data.volunteers) ? data.volunteers : [];

      if (!volunteers.length) {
        grid.innerHTML = "";
        if (fallback) {
          fallback.style.display = "block";
          fallback.textContent = "No volunteers found yet — add some in volunteers.json.";
        }
        return;
      }

      grid.innerHTML = volunteers.map(renderVolunteerCard).join("");
      if (fallback) fallback.style.display = "none";
    } catch (err) {
      grid.innerHTML = "";
      if (fallback) {
        fallback.style.display = "block";
        fallback.textContent =
          "Couldn’t load volunteers.json. If you’re opening the file directly, run a local server (e.g. VS Code Live Server or `python -m http.server`).";
      }
      console.warn("Volunteer load failed:", err);
    }
  }

  loadVolunteers();

  // -----------------------------
  // Infinite logo carousel (Support page)
  // -----------------------------
  function setupInfiniteCarousel(trackId) {
    const track = document.getElementById(trackId);
    if (!track) return;

    const carousel = track.closest(".logo-carousel");
    if (!carousel) return;

    const originals = Array.from(track.children);
    if (originals.length === 0) return;

    // Remove any old clones (if re-run)
    Array.from(track.querySelectorAll('[data-clone="true"]')).forEach(n => n.remove());

    // We want multiple viewport widths of content so the loop feels endless
    const targetWidth = carousel.clientWidth * 3;

    const measureWidth = () => track.scrollWidth;

    // Clone until we exceed target width
    let safety = 0;
    while (measureWidth() < targetWidth && safety < 50) {
      for (const node of originals) {
        const clone = node.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.setAttribute("data-clone", "true");
        // Empty alt for clones so screen readers don't repeat
        if (clone.tagName === "IMG") clone.alt = "";
        track.appendChild(clone);
      }
      safety++;
    }

    // Calculate one cycle distance = width of the original set + gaps
    const gapPx = 28; // keep in sync with CSS .logo-track { gap: 28px; }
    const originalSetWidth =
      originals.reduce((sum, el) => sum + el.getBoundingClientRect().width, 0) +
      (originals.length - 1) * gapPx;
  }

  // Run on load (only if the element exists on this page)
  setupInfiniteCarousel("supporter-track");
  
   // -----------------------------
  // Hero background slideshow (landing images 1-4)
  // -----------------------------
  function initHeroSlideshow() {
    const heroBg = document.querySelector(".hero__bg");
    if (!heroBg) return; // only on pages with hero

    const prefersReducedMotion = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const images = [
      "assets/landing/1.jpg",
      "assets/landing/2.jpg",
      "assets/landing/3.jpg",
      "assets/landing/4.jpg"
    ];

    // Preload
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    // Create two layers for crossfade
    const layerA = document.createElement("div");
    layerA.className = "hero__bg-layer is-visible";
    layerA.style.backgroundImage = `url("${images[0]}")`;

    const layerB = document.createElement("div");
    layerB.className = "hero__bg-layer";
    layerB.style.backgroundImage = `url("${images[1]}")`;

    heroBg.appendChild(layerA);
    heroBg.appendChild(layerB);

    if (prefersReducedMotion) {
      // Just keep the first image if reduced motion is preferred
      layerB.remove();
      return;
    }

    let index = 1;
    let showingA = true;

    // Timing
    const DISPLAY_MS = 9000;   // time each image stays on screen
    const FADE_MS = 2500;      // keep in sync with CSS transition

    setInterval(() => {
      const nextIndex = (index + 1) % images.length;

      const front = showingA ? layerA : layerB;
      const back  = showingA ? layerB : layerA;

      // Set next image on the back layer before fading
      back.style.backgroundImage = `url("${images[nextIndex]}")`;

      // Fade to back layer
      back.classList.add("is-visible");
      front.classList.remove("is-visible");

      // swap which layer is "front" for next cycle
      showingA = !showingA;
      index = nextIndex;
    }, DISPLAY_MS);
  }

  initHeroSlideshow();


  // Re-run on resize (debounced)
  let carouselResizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(carouselResizeTimer);
    carouselResizeTimer = setTimeout(() => setupInfiniteCarousel("supporter-track"), 150);
  });
})();
