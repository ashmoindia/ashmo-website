const one = (selector, root = document) => root.querySelector(selector);
const all = (selector, root = document) => [...root.querySelectorAll(selector)];

const api = async (path, options = {}) => {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...options,
    headers: {
      ...(options.body instanceof Blob ? {} : { 'content-type': 'application/json' }),
      ...options.headers,
    },
  });
  const data = await response.json().catch(() => ({ ok: false, error: 'The moon shifted unexpectedly.' }));
  return { response, data };
};

const copyText = async (value, notice) => {
  try {
    await navigator.clipboard.writeText(value);
    if (notice) notice.textContent = 'Link copied.';
  } catch {
    const area = document.createElement('textarea');
    area.value = value;
    document.body.append(area);
    area.select();
    document.execCommand('copy');
    area.remove();
    if (notice) notice.textContent = 'Link copied.';
  }
};

const shareLink = async (url) => {
  if (navigator.share) {
    await navigator.share({ text: `A paper moon for you:\n${url}`, url }).catch(() => {});
  } else {
    await copyText(url);
  }
};

const clearBrowserData = async () => {
  localStorage.clear();
  sessionStorage.clear();
  if ('caches' in window) {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name.startsWith('paper-moon')).map((name) => caches.delete(name)));
  }
};

const bindCommonControls = () => {
  const aboutButton = one('[data-about-toggle]');
  const aboutPanel = one('[data-about-panel]');
  aboutButton?.addEventListener('click', () => {
    const next = aboutPanel.hidden;
    aboutPanel.hidden = !next;
    aboutButton.setAttribute('aria-expanded', String(next));
  });
  one('[data-remove-local]')?.addEventListener('click', async (event) => {
    await clearBrowserData();
    event.currentTarget.textContent = 'Local data removed.';
  });
};

const bindCreatePage = () => {
  const form = one('[data-moon-form]');
  if (!form) return;
  const nameInput = one('#moon-name');
  const notice = one('[data-form-notice]');
  const button = one('[data-make-button]');
  const alternatives = one('[data-alternatives]');

  const chooseName = (name) => {
    nameInput.value = name;
    nameInput.focus();
  };
  all('[data-name-chip]').forEach((chip) => {
    chip.addEventListener('click', () => chooseName(chip.dataset.nameChip));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    notice.textContent = '';
    button.disabled = true;
    button.firstElementChild.textContent = 'Folding...';
    const values = new FormData(form);
    const payload = {
      name: values.get('name'),
      mooncrumb: values.get('mooncrumb'),
      duration: values.get('duration'),
      firstTrace: values.get('firstTrace'),
    };
    const { response, data } = await api('/api/pm/moons', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    button.disabled = false;
    button.firstElementChild.textContent = 'Make Moon';
    if (!response.ok) {
      notice.textContent = data.error || 'The moon shifted unexpectedly.';
      if (Array.isArray(data.alternatives)) {
        alternatives.replaceChildren(...data.alternatives.map((name) => {
          const choice = document.createElement('button');
          choice.type = 'button';
          choice.textContent = name;
          choice.addEventListener('click', () => chooseName(name));
          return choice;
        }));
        alternatives.hidden = false;
      }
      return;
    }

    if (data.ownerToken) {
      localStorage.setItem(`paper-moon-maker:${data.slug}`, data.ownerToken);
    }
    form.hidden = true;
    const card = one('[data-share-card]');
    const link = one('[data-share-link]');
    link.href = data.url;
    link.textContent = data.url;
    card.hidden = false;
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    one('[data-copy-link]', card)?.addEventListener('click', () => copyText(data.url, notice));
    one('[data-share-link-button]', card)?.addEventListener('click', () => shareLink(data.url));
  });
};

const linkify = (text) => {
  const fragment = document.createDocumentFragment();
  const pattern = /(https?:\/\/[^\s]+)/gi;
  let cursor = 0;
  for (const match of text.matchAll(pattern)) {
    if (match.index > cursor) fragment.append(document.createTextNode(text.slice(cursor, match.index)));
    const anchor = document.createElement('a');
    anchor.href = match[0];
    anchor.textContent = match[0];
    anchor.target = '_blank';
    anchor.rel = 'noreferrer noopener';
    fragment.append(anchor);
    cursor = match.index + match[0].length;
  }
  if (cursor < text.length) fragment.append(document.createTextNode(text.slice(cursor)));
  return fragment;
};

const formatTime = (value) =>
  new Intl.DateTimeFormat([], { hour: 'numeric', minute: '2-digit' }).format(new Date(value));

const compressPhoto = async (file) => {
  if (file.size <= 900_000 && ['image/jpeg', 'image/webp'].includes(file.type)) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const context = canvas.getContext('2d', { alpha: false });
  context.fillStyle = '#070711';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let quality = 0.82;
  let blob;
  do {
    blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    quality -= 0.12;
  } while (blob && blob.size > 1_000_000 && quality >= 0.34);
  if (!blob || blob.size > 1_000_000) throw new Error('Photo too large. Keep it under 1 MB.');
  return blob;
};

const bindMoonPage = () => {
  const slug = location.pathname.split('/').filter(Boolean).at(-1);
  if (!slug) return;
  const crumbStage = one('[data-crumb-stage]');
  const stateStage = one('[data-state-stage]');
  const traceStage = one('[data-trace-stage]');
  const tracesRoot = one('[data-traces]');
  const threadNotice = one('[data-thread-notice]');
  const unfoldNotice = one('[data-unfold-notice]');
  const menu = one('[data-menu]');
  let active = false;
  let side = 'visitor';
  let lastTraceSignature = '';

  const showState = (state) => {
    active = false;
    crumbStage.hidden = true;
    traceStage.hidden = true;
    stateStage.hidden = false;
    one('[data-state-title]').textContent = state === 'deleted'
      ? 'This moon is no longer here.'
      : 'This moon has disappeared.';
  };

  const showCrumb = () => {
    active = false;
    traceStage.hidden = true;
    stateStage.hidden = true;
    crumbStage.hidden = false;
  };

  const renderTraces = (traces) => {
    const signature = traces.map((trace) => `${trace.id}:${trace.photoUrl}`).join('|');
    if (signature === lastTraceSignature) return;
    lastTraceSignature = signature;
    tracesRoot.replaceChildren(...traces.map((trace) => {
      const item = document.createElement('article');
      item.className = `pm-trace pm-trace-${trace.side}`;
      const label = document.createElement('div');
      label.className = 'pm-trace-label';
      label.textContent = `${trace.side === side ? 'You' : trace.side === 'creator' ? 'Maker' : 'Visitor'} · ${formatTime(trace.createdAt)}`;
      const piece = document.createElement('div');
      piece.className = 'pm-trace-piece';
      if (trace.photoUrl) {
        const image = document.createElement('img');
        image.src = trace.photoUrl;
        image.alt = 'A light photo left on this moon';
        image.loading = 'lazy';
        piece.append(image);
      }
      if (trace.body) {
        const copy = document.createElement('p');
        copy.append(linkify(trace.body));
        piece.append(copy);
      }
      item.append(label, piece);
      return item;
    }));
    requestAnimationFrame(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
  };

  const loadTraces = async ({ quiet = false } = {}) => {
    const { response, data } = await api(`/api/pm/moons/${encodeURIComponent(slug)}/traces`);
    if (response.status === 401) {
      if (!quiet) showCrumb();
      return false;
    }
    if (response.status === 404 || response.status === 410) {
      showState(data.state);
      return false;
    }
    if (!response.ok) {
      if (!quiet) threadNotice.textContent = data.error || 'The moon shifted unexpectedly.';
      return false;
    }
    active = true;
    side = data.moon.side;
    crumbStage.hidden = true;
    stateStage.hidden = true;
    traceStage.hidden = false;
    one('[data-moon-name]').textContent = data.moon.name;
    one('[data-stay-label]').textContent = data.moon.stayLabel;
    one('[data-remove-moon]').hidden = side !== 'creator';
    renderTraces(data.traces);
    return true;
  };

  one('[data-unfold-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    unfoldNotice.textContent = '';
    const mooncrumb = new FormData(event.currentTarget).get('mooncrumb');
    const ownerToken = localStorage.getItem(`paper-moon-maker:${slug}`) || '';
    const submit = one('button[type="submit"]', event.currentTarget);
    submit.disabled = true;
    submit.textContent = 'Unfolding...';
    const { response, data } = await api(`/api/pm/moons/${encodeURIComponent(slug)}/unfold`, {
      method: 'POST',
      body: JSON.stringify({ mooncrumb, ownerToken }),
    });
    submit.disabled = false;
    submit.textContent = 'Unfold';
    if (response.status === 410) return showState(data.state);
    if (!response.ok) {
      unfoldNotice.textContent = data.error || 'The moon didn’t remember that.';
      return;
    }
    event.currentTarget.reset();
    await loadTraces();
  });

  one('[data-trace-form]')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const textarea = one('textarea', event.currentTarget);
    const body = textarea.value.trim();
    if (!body) return;
    threadNotice.textContent = '';
    const { response, data } = await api(`/api/pm/moons/${encodeURIComponent(slug)}/traces`, {
      method: 'POST',
      body: JSON.stringify({ body }),
    });
    if (!response.ok) {
      threadNotice.textContent = data.error || 'The moon shifted unexpectedly.';
      return;
    }
    textarea.value = '';
    lastTraceSignature = '';
    await loadTraces();
  });

  one('[data-photo-input]')?.addEventListener('change', async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const progress = one('[data-upload-line]');
    const bar = one('span', progress);
    progress.hidden = false;
    bar.style.width = '22%';
    threadNotice.textContent = '';
    try {
      const blob = await compressPhoto(file);
      bar.style.width = '62%';
      const caption = one('textarea', one('[data-trace-form]')).value.trim() || 'A light photo.';
      const { response, data } = await api(`/api/pm/moons/${encodeURIComponent(slug)}/photo`, {
        method: 'POST',
        body: blob,
        headers: {
          'content-type': blob.type,
          'x-paper-caption': encodeURIComponent(caption),
        },
      });
      if (!response.ok) throw new Error(data.error || 'The moon shifted unexpectedly.');
      bar.style.width = '100%';
      one('textarea', one('[data-trace-form]')).value = '';
      lastTraceSignature = '';
      await loadTraces();
    } catch (error) {
      threadNotice.textContent = error instanceof Error ? error.message : 'Photo too large. Keep it under 1 MB.';
    } finally {
      setTimeout(() => {
        progress.hidden = true;
        bar.style.width = '0';
      }, 500);
      event.currentTarget.value = '';
    }
  });

  one('[data-menu-toggle]')?.addEventListener('click', (event) => {
    menu.hidden = !menu.hidden;
    event.currentTarget.setAttribute('aria-expanded', String(!menu.hidden));
  });
  one('[data-copy-link]')?.addEventListener('click', () => copyText(location.href, threadNotice));
  one('[data-share-link-button]')?.addEventListener('click', () => shareLink(location.href));
  one('[data-fold-away]')?.addEventListener('click', async () => {
    await api('/api/pm/fold', { method: 'POST', body: '{}' });
    menu.hidden = true;
    lastTraceSignature = '';
    showCrumb();
  });
  one('[data-remove-moon]')?.addEventListener('click', async () => {
    if (!confirm('Make this moon disappear?')) return;
    const { response, data } = await api(`/api/pm/moons/${encodeURIComponent(slug)}/remove`, {
      method: 'POST',
      body: '{}',
    });
    if (!response.ok) {
      threadNotice.textContent = data.error || 'The moon shifted unexpectedly.';
      return;
    }
    showState('deleted');
  });

  window.addEventListener('offline', () => {
    one('[data-connection-note]').textContent = 'The sky is offline.';
  });
  window.addEventListener('online', () => {
    one('[data-connection-note]').textContent = 'link only';
    if (active) loadTraces({ quiet: true });
  });
  loadTraces();
  setInterval(() => {
    if (active && navigator.onLine) loadTraces({ quiet: true });
  }, 5000);
};

bindCommonControls();
if (document.body.dataset.pmPage === 'create') bindCreatePage();
if (document.body.dataset.pmPage === 'moon') bindMoonPage();
