(() => {
  const bindHeader = () => {
    const header = document.getElementById('shopify-section-n2d-header');
    if (!header || header.dataset.stickyBound) return;
    header.dataset.stickyBound = 'true';
    const measure = () => document.documentElement.style.setProperty('--n2d-header-height', `${header.getBoundingClientRect().height}px`);
    const scrolled = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
    measure(); scrolled();
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(header);
    else window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('scroll', scrolled, { passive: true });
  };
  const bindCollection = root => {
    if (root.dataset.designFiltersBound) return;
    const panel = root.querySelector('[data-design-filters]');
    const cards = [...root.querySelectorAll('.art-card[data-design-topics]')];
    if (!panel || !cards.length) return;
    root.dataset.designFiltersBound = 'true';
    const buttons = [...panel.querySelectorAll('[data-design-filter]')];
    const status = panel.querySelector('[data-design-status]');
    const clear = panel.querySelector('[data-design-clear]');
    const empty = root.querySelector('[data-design-empty]');
    const topics = new Map(cards.map(card => [card, new Set(card.dataset.designTopics.split('|').map(x => x.trim()).filter(Boolean))]));
    buttons.forEach(button => {
      const key = button.dataset.designFilter;
      const count = key === 'all' ? cards.length : cards.filter(card => topics.get(card).has(key)).length;
      button.querySelector('[data-design-count]').textContent = count;
      button.hidden = count === 0;
    });
    const setFilter = (key, updateURL) => {
      const selected = buttons.find(button => button.dataset.designFilter === key) || buttons[0];
      key = selected.dataset.designFilter;
      let count = 0;
      cards.forEach(card => {
        const visible = key === 'all' || topics.get(card).has(key);
        card.hidden = !visible;
        if (visible) count++;
      });
      root.querySelectorAll('.gender-collection').forEach(section => {
        section.hidden = ![...section.querySelectorAll('.art-card')].some(card => !card.hidden);
      });
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));
      clear.hidden = key === 'all';
      if (empty) empty.hidden = count > 0;
      const name = selected.querySelector('[data-design-label]').textContent;
      status.textContent = key === 'all' ? `${count} ${count === 1 ? 'design' : 'designs'}` : `${count} ${count === 1 ? 'design' : 'designs'} · ${name}`;
      if (updateURL) {
        const url = new URL(window.location.href);
        if (key === 'all') url.searchParams.delete('design');
        else url.searchParams.set('design', key);
        history.replaceState(history.state, '', url);
      }
    };
    buttons.forEach(button => button.addEventListener('click', () => setFilter(button.dataset.designFilter, true)));
    clear.addEventListener('click', () => setFilter('all', true));
    const restore = () => setFilter(new URL(location.href).searchParams.get('design') || 'all', false);
    window.addEventListener('popstate', restore);
    panel.hidden = false;
    restore();
  };
  const init = () => { bindHeader(); document.querySelectorAll('[data-design-collection]').forEach(bindCollection); };
  init();
  document.addEventListener('shopify:section:load', init);
})();
