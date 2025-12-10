(function () {
  const marquee = document.querySelector('.supporter-marquee');
  const track = marquee?.querySelector('.supporter-track');
  const originalSlide = track?.querySelector('.supporter-slide');

  if (!marquee || !track || !originalSlide) return;

  const template = originalSlide.cloneNode(true);
  const templateImages = Array.from(template.querySelectorAll('img'));

  const computeSlideWidth = (slide) => {
    const rect = slide.getBoundingClientRect();
    if (rect.width > 0) return rect.width;

    // Fallback: sum natural image widths to avoid zero width calculations.
    const naturalWidth = Array.from(slide.querySelectorAll('img')).reduce(
      (total, img) => total + (img.naturalWidth || 0),
      0,
    );
    return naturalWidth;
  };

  const cloneAndFillTrack = () => {
    track.innerHTML = '';
    const baseSlide = template.cloneNode(true);
    track.appendChild(baseSlide);

    const baseWidth = computeSlideWidth(baseSlide) || marquee.offsetWidth || 1;
    const minimumRepeats = Math.max(2, Math.ceil((marquee.offsetWidth * 2) / baseWidth));

    for (let i = 1; i < minimumRepeats; i += 1) {
      const duplicate = template.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      track.appendChild(duplicate);
    }

    const loopDistance = baseWidth;
    track.style.setProperty('--supporter-loop-distance', `${loopDistance}px`);

    const duration = Math.max(12, Math.round(loopDistance * track.childElementCount * 0.04));
    track.style.setProperty('--supporter-duration', `${duration}s`);

    track.classList.add('is-ready');
  };

  const waitForImages = () => {
    if (!templateImages.length) {
      cloneAndFillTrack();
      return;
    }

    let loaded = 0;
    const markLoaded = () => {
      loaded += 1;
      if (loaded >= templateImages.length) cloneAndFillTrack();
    };

    templateImages.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        markLoaded();
      } else {
        img.addEventListener('load', markLoaded, { once: true });
        img.addEventListener('error', markLoaded, { once: true });
      }
    });
  };

  waitForImages();
  window.addEventListener('resize', cloneAndFillTrack);
})();
