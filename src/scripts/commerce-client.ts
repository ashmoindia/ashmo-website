type Payload = Record<string, string>;
type Membership = { label: string; active: boolean; renews: boolean; canManage: boolean; reference: string };
type Account = {
  items: { id: string; name: string; purchased: boolean }[];
  orders: { name: string; reference: string }[];
  memberships: Membership[];
  member: boolean;
  recoveryConfigured: boolean;
  signedIn: boolean;
};

async function api<T>(action: string, body?: Payload): Promise<T> {
  const res = await fetch(`/api/commerce/${action}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin',
    cache: 'no-store',
    referrerPolicy: 'no-referrer',
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(typeof data.error === 'string' ? data.error : 'Test checkout is temporarily unavailable.');
  return data as T;
}

function message(cause: unknown) {
  return cause instanceof Error ? cause.message : 'Something went wrong. Try again.';
}

function node<K extends keyof HTMLElementTagNameMap>(name: K, text?: string) {
  const element = document.createElement(name);
  if (text) element.textContent = text;
  return element;
}

function actionButton(text: string) {
  const button = node('button', text);
  button.type = 'button';
  button.className = 'commerce-action secondary commerce-sep';
  return button;
}

document.querySelectorAll<HTMLFormElement>('[data-checkout]').forEach(form => {
  let attempt: string;
  let previousEmail: string;
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button')!;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (button.disabled) return;
    button.disabled = true;
    status.textContent = 'Opening Stripe test checkout…';
    const email = String(new FormData(form).get('email') || '').trim();
    if (!attempt || previousEmail !== email) attempt = crypto.randomUUID();
    previousEmail = email;
    try {
      const result = await api<{redirect: string}>('checkout', { offer: form.dataset.checkout || '', email, attempt });
      location.assign(result.redirect);
    } catch (cause) {
      status.textContent = message(cause);
      button.disabled = false;
    }
  });
  window.addEventListener('pageshow', () => { button.disabled = false; });
});

const accountPanel = document.querySelector<HTMLElement>('[data-account]');
const recovery = document.querySelector<HTMLFormElement>('[data-recover]');
if (accountPanel && recovery) {
  initialiseAccount(accountPanel, recovery).catch(cause => {
    accountPanel.querySelector<HTMLElement>('[data-status]')!.textContent = message(cause);
  });
}

async function initialiseAccount(panel: HTMLElement, form: HTMLFormElement) {
  const status = panel.querySelector<HTMLElement>('[data-status]')!;
  const library = panel.querySelector<HTMLElement>('[data-library]')!;
  const signout = panel.querySelector<HTMLButtonElement>('[data-signout]')!;
  const recoverButton = form.querySelector<HTMLButtonElement>('button')!;
  const recoveryStatus = form.querySelector<HTMLElement>('[data-status]')!;
  recoverButton.disabled = true;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (recoverButton.disabled) return;
    recoverButton.disabled = true;
    const data = new FormData(form);
    try {
      const result = await api<{message: string}>('recover', {
        email: String(data.get('email') || ''),
        reference: String(data.get('reference') || ''),
      });
      recoveryStatus.textContent = result.message;
    } catch (cause) {
      recoveryStatus.textContent = message(cause);
    } finally {
      recoverButton.disabled = false;
    }
  });

  const current = new URL(location.href);
  const access = new URLSearchParams(current.hash.slice(1)).get('access');
  const reference = current.searchParams.get('session_id');
  let claimMessage = '';
  if (access || reference) {
    try {
      await api('claim', access ? { access } : { reference: reference! });
      if (access) current.hash = '';
      if (reference) current.searchParams.delete('session_id');
      history.replaceState(null, '', current.pathname + current.search + current.hash);
      claimMessage = 'Access confirmed. ';
    } catch (cause) {
      claimMessage = `${message(cause)} `;
    }
  }

  const account = await api<Account>('account');
  status.textContent = claimMessage + (account.items.length ? 'Your downloads are available below.' : 'There are no workbooks in this library yet.');
  recoverButton.disabled = !account.recoveryConfigured;
  if (!account.recoveryConfigured) recoveryStatus.textContent = 'Test email recovery is awaiting configuration.';
  signout.hidden = !account.signedIn;
  signout.addEventListener('click', async () => {
    try {
      await api('signout', {});
      location.assign('/account/');
    } catch (cause) {
      status.textContent = message(cause);
    }
  });

  for (const item of account.items) {
    const li = node('li');
    li.append(node('strong', item.name));
    li.append(node('p', item.purchased ? 'Purchased edition' : 'Included in your membership'));
    const download = node('a', 'Download staging sample XLSX');
    download.className = 'commerce-action secondary';
    download.href = `/api/commerce/download?item=${encodeURIComponent(item.id)}`;
    li.append(download);
    library.append(li);
  }
  for (const order of account.orders) {
    const li = node('li');
    li.append(node('strong', order.name), node('p', `Order reference: ${order.reference}`));
    library.append(li);
  }
  if (account.member) {
    const li = node('li');
    const button = actionButton('Open month-end review playbook');
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const playbook = await api<{steps: string[]}>('playbook');
        const list = node('ol');
        for (const step of playbook.steps) list.append(node('li', step));
        button.replaceWith(list);
      } catch (cause) {
        status.textContent = message(cause);
        button.disabled = false;
      }
    });
    li.append(button);
    library.append(li);
  }
  for (const membership of account.memberships) {
    const li = node('li');
    const state = membership.active ? (membership.renews ? 'Active' : 'Ends after the paid period') : 'Inactive';
    li.append(node('strong', `${membership.label} membership · ${state}`),
      node('p', `Order reference: ${membership.reference}`));
    if (membership.canManage) {
      const button = actionButton('Manage test billing');
      button.addEventListener('click', async () => {
        button.disabled = true;
        try {
          const result = await api<{redirect: string}>('portal', { reference: membership.reference });
          location.assign(result.redirect);
        } catch (cause) {
          status.textContent = message(cause);
          button.disabled = false;
        }
      });
      li.append(button);
    }
    library.append(li);
  }
}

export {};
