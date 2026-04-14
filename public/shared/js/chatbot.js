(() => {
  const WIDGET_ID = 'ml-chatbot-widget';

  function cssVar(name, fallback) {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return v || fallback;
  }

  function palette() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      dark,
      surface: cssVar('--surface', dark ? 'rgba(22,27,34,0.92)' : 'rgba(255,255,255,0.92)'),
      elevated: cssVar('--bg-elevated', dark ? '#0f1419' : '#ffffff'),
      border: cssVar('--border', dark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)'),
      text: cssVar('--text-main', dark ? '#e2e8f0' : '#1e293b'),
      muted: cssVar('--text-muted', dark ? '#94a3b8' : '#64748b'),
      accent: cssVar('--accent', dark ? '#22d3ee' : '#0891b2'),
      shadow: cssVar('--shadow-card', dark ? '0 20px 50px rgba(0,0,0,0.55)' : '0 12px 40px rgba(15,23,42,0.08)'),
    };
  }

  function ensureStyles() {
    if (document.getElementById('ml-chatbot-styles')) return;
    const s = document.createElement('style');
    s.id = 'ml-chatbot-styles';
    s.textContent = `
      #${WIDGET_ID} { position: fixed; right: 18px; bottom: 18px; z-index: 9999; font-family: Inter, system-ui, -apple-system, Segoe UI, Arial, sans-serif; }
      #${WIDGET_ID} * { box-sizing: border-box; }
      .mlcb-fab {
        width: 54px; height: 54px; border-radius: 999px; border: 1px solid var(--mlcb-border);
        background: radial-gradient(circle at 30% 20%, rgba(255,255,255,0.24), transparent 55%), linear-gradient(135deg, var(--mlcb-accent), rgba(99,102,241,0.95));
        color: #06121a; cursor: pointer; display:flex; align-items:center; justify-content:center;
        box-shadow: 0 16px 44px rgba(8,145,178,0.22);
        transition: transform .15s ease, filter .15s ease;
      }
      .mlcb-fab:hover { transform: translateY(-2px); filter: brightness(1.03); }
      .mlcb-fab:active { transform: translateY(0); }
      .mlcb-icon { font-weight: 900; letter-spacing: .04em; font-family: Orbitron, Inter, sans-serif; font-size: 14px; }

      .mlcb-panel {
        position: absolute; right: 0; bottom: 66px;
        width: min(360px, calc(100vw - 36px));
        max-height: min(520px, calc(100vh - 120px));
        background: var(--mlcb-surface);
        border: 1px solid var(--mlcb-border);
        border-radius: 16px;
        box-shadow: var(--mlcb-shadow);
        overflow: hidden;
        display: none;
      }
      .mlcb-panel.open { display: flex; flex-direction: column; }

      .mlcb-header {
        padding: 12px 12px;
        display:flex; align-items:center; justify-content:space-between; gap: 10px;
        border-bottom: 1px solid var(--mlcb-border);
        background: linear-gradient(180deg, rgba(127,127,127,0.06), transparent);
      }
      .mlcb-title { display:flex; flex-direction:column; gap:2px; }
      .mlcb-title strong { color: var(--mlcb-text); font-size: 13px; }
      .mlcb-title span { color: var(--mlcb-muted); font-size: 11px; }
      .mlcb-close {
        border: 1px solid var(--mlcb-border);
        background: var(--mlcb-elevated);
        color: var(--mlcb-text);
        border-radius: 10px;
        height: 32px; width: 36px;
        cursor: pointer;
      }

      .mlcb-body { padding: 12px; overflow:auto; display:flex; flex-direction:column; gap: 10px; }
      .mlcb-msg { padding: 10px 10px; border-radius: 12px; border: 1px solid var(--mlcb-border); background: var(--mlcb-elevated); color: var(--mlcb-text); line-height: 1.35; font-size: 13px; white-space: pre-wrap; }
      .mlcb-msg.user { background: rgba(8,145,178,0.10); border-color: rgba(8,145,178,0.22); }
      html[data-theme="dark"] .mlcb-msg.user { background: rgba(34,211,238,0.10); border-color: rgba(34,211,238,0.22); }

      .mlcb-footer { border-top: 1px solid var(--mlcb-border); padding: 10px; display:flex; gap: 8px; background: linear-gradient(0deg, rgba(127,127,127,0.06), transparent); }
      .mlcb-input {
        flex: 1;
        border: 1px solid var(--mlcb-border);
        background: var(--mlcb-elevated);
        color: var(--mlcb-text);
        border-radius: 12px;
        padding: 10px 10px;
        outline: none;
        font-size: 13px;
      }
      .mlcb-send {
        border: 1px solid rgba(8,145,178,0.35);
        background: linear-gradient(135deg, rgba(8,145,178,0.95), rgba(99,102,241,0.95));
        color: #06121a;
        border-radius: 12px;
        padding: 10px 12px;
        cursor: pointer;
        font-weight: 800;
        font-family: Orbitron, Inter, sans-serif;
        letter-spacing: .06em;
        font-size: 12px;
      }
      html[data-theme="dark"] .mlcb-send {
        border-color: rgba(34,211,238,0.35);
        background: linear-gradient(135deg, rgba(34,211,238,0.95), rgba(167,139,250,0.95));
      }
      .mlcb-send:disabled { opacity: .6; cursor: not-allowed; }
    `;
    document.head.appendChild(s);
  }

  function applyThemeVars() {
    const p = palette();
    const root = document.documentElement;
    root.style.setProperty('--mlcb-surface', p.surface);
    root.style.setProperty('--mlcb-elevated', p.elevated);
    root.style.setProperty('--mlcb-border', p.border);
    root.style.setProperty('--mlcb-text', p.text);
    root.style.setProperty('--mlcb-muted', p.muted);
    root.style.setProperty('--mlcb-accent', p.accent);
    root.style.setProperty('--mlcb-shadow', p.shadow);
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (k === 'class') node.className = v;
      else if (k === 'text') node.textContent = v;
      else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const c of children) node.appendChild(c);
    return node;
  }

  function appendMsg(body, role, text) {
    const msg = el('div', { class: `mlcb-msg ${role === 'user' ? 'user' : 'assistant'}` });
    msg.textContent = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
  }

  async function sendToApi(messages) {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg = data?.error || 'Chat failed.';
      throw new Error(msg);
    }
    return data.reply || '';
  }

  function init() {
    if (document.getElementById(WIDGET_ID)) return;
    ensureStyles();
    applyThemeVars();

    const body = el('div', { class: 'mlcb-body' });
    const input = el('input', { class: 'mlcb-input', type: 'text', placeholder: 'Ask ML question…' });
    const sendBtn = el('button', { class: 'mlcb-send', type: 'button', text: 'SEND' });

    const panel = el('div', { class: 'mlcb-panel', role: 'dialog', 'aria-label': 'ML Chatbot' }, [
      el('div', { class: 'mlcb-header' }, [
        el('div', { class: 'mlcb-title' }, [
          el('strong', { text: 'ML Tutor Bot' }),
          el('span', { text: 'Short answers • ML only' }),
        ]),
        el('button', { class: 'mlcb-close', type: 'button', text: '×' }),
      ]),
      body,
      el('div', { class: 'mlcb-footer' }, [input, sendBtn]),
    ]);

    const fab = el('button', { class: 'mlcb-fab', type: 'button', 'aria-label': 'Open chatbot' }, [
      el('span', { class: 'mlcb-icon', text: 'AI' }),
    ]);

    const wrap = el('div', { id: WIDGET_ID }, [panel, fab]);
    document.body.appendChild(wrap);

    const state = {
      open: false,
      messages: [],
      sending: false,
    };

    function open() {
      state.open = true;
      panel.classList.add('open');
      setTimeout(() => input.focus(), 0);
      if (state.messages.length === 0) {
        const greet = 'Ask me any Machine Learning question.\nI will answer in 3–6 short lines.';
        state.messages.push({ role: 'assistant', content: greet });
        appendMsg(body, 'assistant', greet);
      }
    }

    function close() {
      state.open = false;
      panel.classList.remove('open');
    }

    function toggle() {
      state.open ? close() : open();
    }

    async function doSend() {
      const text = (input.value || '').trim();
      if (!text || state.sending) return;
      input.value = '';
      state.messages.push({ role: 'user', content: text });
      appendMsg(body, 'user', text);

      state.sending = true;
      sendBtn.disabled = true;
      appendMsg(body, 'assistant', 'Thinking…');
      const thinkingNode = body.lastElementChild;

      try {
        const reply = await sendToApi(state.messages);
        state.messages.push({ role: 'assistant', content: reply });
        if (thinkingNode) thinkingNode.textContent = reply;
      } catch (e) {
        const msg = (e && e.message) ? e.message : 'Chat failed.';
        if (thinkingNode) thinkingNode.textContent = msg;
      } finally {
        state.sending = false;
        sendBtn.disabled = false;
      }
    }

    fab.addEventListener('click', toggle);
    panel.querySelector('.mlcb-close')?.addEventListener('click', close);
    sendBtn.addEventListener('click', doSend);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') doSend();
      if (e.key === 'Escape') close();
    });

    // keep colors in sync with theme toggle
    window.addEventListener('ml-theme-change', () => {
      applyThemeVars();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

