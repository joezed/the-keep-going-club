(function () {
  const marquee = document.querySelector('.supporter-marquee');
  const track = marquee?.querySelector('.supporter-track');
  const originalSlide = track?.querySelector('.supporter-slide');

  if (!marquee || !track || !originalSlide) return;

  const cloneAndFillTrack = () => {
    track.innerHTML = '';
    const baseSlide = originalSlide.cloneNode(true);
    track.appendChild(baseSlide);

    while (track.scrollWidth < marquee.offsetWidth * 2) {
      const duplicate = baseSlide.cloneNode(true);
      duplicate.setAttribute('aria-hidden', 'true');
      track.appendChild(duplicate);
    }

    const slideWidth = baseSlide.getBoundingClientRect().width;
    const loopDistance = slideWidth || track.scrollWidth / Math.max(track.childElementCount, 1);
    track.style.setProperty('--supporter-loop-distance', `${loopDistance}px`);

    const baseDuration = Math.max(12, Math.round(loopDistance * track.childElementCount * 0.04));
    track.style.setProperty('--supporter-duration', `${baseDuration}s`);

    track.classList.add('is-ready');
  };

  const waitForImages = () => {
    const images = Array.from(originalSlide.querySelectorAll('img'));
    if (!images.length) {
      cloneAndFillTrack();
      return;
    }

    let loaded = 0;
    const onComplete = () => {
      loaded += 1;
      if (loaded >= images.length) {
        cloneAndFillTrack();
      }
    };

    images.forEach((img) => {
      if (img.complete && img.naturalWidth !== 0) {
        onComplete();
      } else {
        img.addEventListener('load', onComplete, { once: true });
        img.addEventListener('error', onComplete, { once: true });
      }
    });
  };

  waitForImages();
  window.addEventListener('resize', cloneAndFillTrack);
})();
