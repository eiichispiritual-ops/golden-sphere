(() => {
  const gallery = document.querySelector('#voices .voices');
  if (!gallery) return;
  const originals = [...gallery.querySelectorAll('.voice-open')];
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = false, listed = preference.matches, inView = false;
  const controls = document.createElement('div');
  controls.className = 'voice-controls';
  const pause = document.createElement('button');
  const list = document.createElement('button');
  pause.type = list.type = 'button';
  controls.append(pause, list);
  gallery.before(controls);
  gallery.id = 'voice-gallery';
  pause.setAttribute('aria-controls', gallery.id);
  list.setAttribute('aria-controls', gallery.id);
  [originals.slice(0, 5), originals.slice(5)].forEach((cards, index) => {
    const lane = document.createElement('div');
    lane.className = 'voice-lane';
    const track = document.createElement('div');
    track.className = 'voice-track';
    track.style.setProperty('--duration', `${cards.length * 16}s`);
    const group = document.createElement('div');
    group.className = 'voice-group';
    cards.forEach(card => group.append(card));
    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    [...clone.children].forEach((card, i) => {
      card.tabIndex = -1;
      card.addEventListener('click', () => cards[i].click());
    });
    track.append(group, clone);
    lane.append(track);
    gallery.append(lane);
  });
  gallery.classList.add('voice-motion');
  function update() {
    gallery.classList.toggle('voice-list', listed);
    gallery.classList.toggle('voice-paused', paused || !inView || document.hidden || preference.matches);
    pause.textContent = paused ? '動きを再開' : '動きを止める';
    pause.hidden = listed || preference.matches;
    list.textContent = listed ? '動く表示に戻す' : '一覧で読む';
    list.hidden = preference.matches;
    controls.hidden = preference.matches;
  }
  pause.addEventListener('click', () => { paused = !paused; update(); });
  list.addEventListener('click', () => { listed = !listed; update(); });
  gallery.addEventListener('pointerdown', () => { paused = true; update(); });
  gallery.addEventListener('focusin', event => {
    paused = true;
    if (event.target.matches(':focus-visible')) listed = true;
    update();
  });
  // Keyboard users can reach every original message, including cards off the track.
  gallery.addEventListener('keydown', event => {
    if (event.key === 'Tab' && !listed) { listed = true; update(); }
  });
  const observer = new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting; update();
  });
  observer.observe(gallery);
  document.addEventListener('visibilitychange', update);
  preference.addEventListener('change', () => { listed = preference.matches; update(); });
  update();
})();
