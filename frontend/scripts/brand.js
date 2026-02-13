const BRAND_PATH = 'theme/brand.json';

async function fetchText(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.text();
}

async function fetchJson(path) {
  const res = await fetch(path, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return res.json();
}

function applyBrand(brand) {
  if (!brand || typeof brand !== 'object') return;

  if (brand.logoHeader) {
    const logo = document.querySelector('.header-logo');
    if (logo) logo.src = brand.logoHeader;
  }

  if (brand.favicon) {
    let icon = document.querySelector('link[rel~="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      document.head.appendChild(icon);
    }
    icon.href = brand.favicon;
  }

  if (brand.footerHtml) {
    const footer = document.querySelector('.page-footer');
    if (footer) footer.innerHTML = brand.footerHtml;
  }

  if (brand.companyName && document.title) {
    document.title = document.title.replace('Pub Trivia', brand.companyName);
  }
}

function keepTitleBranded(companyName) {
  if (!companyName) return;

  const updateTitle = () => {
    const currentTitle = document.title || '';
    if (!currentTitle.includes('Pub Trivia')) return;
    const nextTitle = currentTitle.replace('Pub Trivia', companyName);
    if (nextTitle !== currentTitle) {
      document.title = nextTitle;
    }
  };

  updateTitle();

  const titleEl = document.querySelector('title');
  if (!titleEl || !window.MutationObserver) return;

  const observer = new MutationObserver(updateTitle);
  observer.observe(titleEl, { childList: true, characterData: true, subtree: true });
}

async function loadBrandAssets() {
  const headerEl = document.getElementById('header');
  const footerEl = document.getElementById('footer');

  try {
    const requests = [fetchJson(BRAND_PATH)];
    if (headerEl) requests.push(fetchText('header.html'));
    if (footerEl) requests.push(fetchText('footer.html'));

    const results = await Promise.all(requests);
    const brand = results[0];
    const headerHtml = headerEl ? results[1] : null;
    const footerHtml = footerEl ? results[headerEl ? 2 : 1] : null;

    if (headerEl && headerHtml) headerEl.innerHTML = headerHtml;
    if (footerEl && footerHtml) footerEl.innerHTML = footerHtml;

    applyBrand(brand);
    keepTitleBranded(brand.companyName);
  } catch (err) {
    console.error('Error loading brand assets:', err);
  }
}

loadBrandAssets();
