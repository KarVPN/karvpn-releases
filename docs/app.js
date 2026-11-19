'use strict';
const RAW = 'https://raw.githubusercontent.com/KarVPN/karvpn-releases/main/';
const REL = 'https://github.com/KarVPN/karvpn-releases/releases';
const PLATFORMS = ['linux', 'android', 'macos', 'windows'];
const FILES = {
  stable: { android: 'version.json', linux: 'version-linux.json', macos: 'version-macos.json', windows: 'version-windows.json' },
  beta: { android: 'version-beta.json', linux: 'version-linux-beta.json', macos: 'version-macos-beta.json', windows: 'version-windows-beta.json' },
};
const NAMES = { android: 'Android', linux: 'Linux', macos: 'macOS', windows: 'Windows' };
const COPY_ICON = '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"/></svg>';
const CHEVRON = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M3 4.5 6 7.5 9 4.5"/></svg>';
const OS_ICONS = {
  linux: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1.8c-2.3 0-3.9 1.7-3.9 4.3 0 1.2.3 2.3.7 3.2-1.7 1.6-3.1 4-3.1 6.2 0 1.1.4 2.1 1 2.9-.5.3-.9.8-.9 1.3 0 .8 1.1 1.5 2.5 1.5.8 0 1.6-.3 2-.7.5.1 1.1.1 1.7.1s1.2 0 1.7-.1c.4.4 1.2.7 2 .7 1.4 0 2.5-.7 2.5-1.5 0-.5-.4-1-.9-1.3.6-.8 1-1.8 1-2.9 0-2.2-1.4-4.6-3.1-6.2.4-.9.7-2 .7-3.2 0-2.6-1.6-4.3-3.9-4.3zm-1.3 3.7c.5 0 .9.5.9 1.1s-.4 1.1-.9 1.1-.9-.5-.9-1.1.4-1.1.9-1.1zm2.6 0c.5 0 .9.5.9 1.1s-.4 1.1-.9 1.1-.9-.5-.9-1.1.4-1.1.9-1.1zM12 8.1c1 0 1.9.5 1.9 1.1 0 .6-.9 1.1-1.9 1.1s-1.9-.5-1.9-1.1c0-.6.9-1.1 1.9-1.1zm0 3.2c2 0 3.5 1.9 3.5 4.2 0 2.2-1.5 3.9-3.5 3.9s-3.5-1.7-3.5-3.9c0-2.3 1.5-4.2 3.5-4.2z"/></svg>',
  android: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.43 11.43 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.81 10.81 0 0 0 1 18h22a10.81 10.81 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/></svg>',
  macos: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83zM15.97 6.33c.64-.78 1.08-1.86.96-2.94-.93.04-2.06.62-2.72 1.4-.58.68-1.1 1.79-.96 2.84 1.04.08 2.08-.52 2.72-1.3z"/></svg>',
  windows: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3h8.5v8.5H3V3zm9.5 0H21v8.5h-8.5V3zM3 12.5h8.5V21H3v-8.5zm9.5 0H21V21h-8.5v-8.5z"/></svg>',
};
const STR = {
  ru: {
    stable: 'Стабильная', beta: 'Бета',
    downloadFor: 'Скачать для ',
    androidInstall: 'Откройте скачанный APK и разрешите установку.',
    windowsInstall: 'Запустите скачанный файл .exe.',
    macosInstall: 'Откройте DMG и перетащите KarVPN в Applications.',
    iosNote: 'Для iPhone и iPad установка через TestFlight.',
    tabDeb: 'deb (Ubuntu, Debian)', tabRpm: 'rpm (Fedora)', tabArch: 'Arch',
    archHint: 'или paru -S karvpn',
    details: 'Подробности сборки',
    version: 'Версия', build: 'Сборка', date: 'Дата', size: 'Размер', sha: 'SHA-256',
    noBuild: 'Нет сборки в этом канале',
    releasesPage: 'Перейти к списку релизов',
    loadError: 'Не удалось загрузить данные о сборке.',
    loading: 'Загрузка…',
    copied: 'Скопировано', copyTitle: 'Скопировать',
    releases: 'Все сборки',
  },
  en: {
    stable: 'Stable', beta: 'Beta',
    downloadFor: 'Download for ',
    androidInstall: 'Open the downloaded APK and allow installation.',
    windowsInstall: 'Run the downloaded .exe installer.',
    macosInstall: 'Open the DMG and drag KarVPN to Applications.',
    iosNote: 'For iPhone and iPad, install via TestFlight.',
    tabDeb: 'deb (Ubuntu, Debian)', tabRpm: 'rpm (Fedora)', tabArch: 'Arch',
    archHint: 'or paru -S karvpn',
    details: 'Build details',
    version: 'Version', build: 'Build', date: 'Date', size: 'Size', sha: 'SHA-256',
    noBuild: 'No build in this channel',
    releasesPage: 'Go to releases',
    loadError: 'Could not load build data.',
    loading: 'Loading…',
    copied: 'Copied', copyTitle: 'Copy',
    releases: 'All releases',
  },
};

const user = detectOS();
const state = { channel: 'stable', lang: 'ru', os: user.os || 'linux', tab: 'deb', docs: {} };
let loadToken = 0;
const t = k => STR[state.lang][k];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dlUrl = (v, f) => REL + '/download/v' + v + '/' + f;
const cmdBlock = c => '<div class="cmd"><code>' + esc(c) + '</code><button class="copy" data-copy="' + esc(c) + '" title="' + t('copyTitle') + '">' + COPY_ICON + '</button></div>';

function detectOS() {
  const u = navigator.userAgent;
  if (/android/i.test(u)) return { os: 'android' };
  if (/iphone|ipad|ipod/i.test(u)) return { os: 'macos', ios: true };
  if (/windows/i.test(u)) return { os: 'windows' };
  if (/macintosh|mac os x/i.test(u)) return { os: 'macos' };
  if (/linux/i.test(u)) return { os: 'linux' };
  return { os: 'windows' };
}

async function fetchDoc(file) {
  const r = await fetch(RAW + file, { cache: 'no-store' });
  if (r.status === 404) throw new Error('missing');
  if (!r.ok) throw new Error('http ' + r.status);
  const env = await r.json();
  const bytes = Uint8Array.from(atob(env.payload), c => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

async function load() {
  const tok = ++loadToken;
  renderChrome();
  document.getElementById('view').innerHTML = '<div class="card"><p class="note">' + t('loading') + '</p></div>';
  const files = FILES[state.channel];
  const results = await Promise.allSettled(PLATFORMS.map(p => fetchDoc(files[p])));
  if (tok !== loadToken) return;
  state.docs = {};
  PLATFORMS.forEach((p, i) => { state.docs[p] = results[i]; });
  render();
}

function renderChrome() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('#seg button').forEach(b => {
    b.textContent = t(b.dataset.ch);
    b.classList.toggle('on', b.dataset.ch === state.channel);
  });
  document.getElementById('langBtn').textContent = state.lang === 'ru' ? 'EN' : 'RU';
  document.getElementById('footRel').textContent = t('releases');
  document.getElementById('pills').innerHTML = PLATFORMS.map(p =>
    '<button class="' + (state.os === p ? 'on' : '') + '" data-os="' + p + '">' + OS_ICONS[p] + '<span>' + NAMES[p] + '</span></button>'
  ).join('');
  document.querySelectorAll('[data-os]').forEach(b => b.addEventListener('click', () => {
    state.os = b.dataset.os;
    render();
  }));
}

function render() {
  renderChrome();
  const p = state.os;
  const res = state.docs[p];
  if (!res) return;
  const hero = '<div class="hero">' + OS_ICONS[p] + '<h2>' + NAMES[p] + '</h2></div>';
  if (res.status === 'rejected') {
    const missing = res.reason && res.reason.message === 'missing';
    document.getElementById('view').innerHTML = '<div class="card">' + hero +
      '<p class="note">' + (missing ? t('noBuild') : t('loadError')) + '</p>' +
      '<p class="note"><a href="' + REL + '">' + t('releasesPage') + '</a></p></div>';
    return;
  }
  const doc = res.value;
  const b = doc.body;
  const action = buildAction(p, b);
  const details = buildDetails(doc, b);
  document.getElementById('view').innerHTML = '<div class="card">' + hero + action + details + '</div>';
  document.querySelectorAll('[data-tab]').forEach(btn => btn.addEventListener('click', () => {
    state.tab = btn.dataset.tab;
    render();
  }));
  document.querySelectorAll('.copy').forEach(btn => btn.addEventListener('click', () => copyCmd(btn)));
}

function buildAction(p, b) {
  const label = t('downloadFor') + NAMES[p];
  if (p === 'android') {
    return '<a class="dl" href="' + esc(b.url) + '">' + label + '</a>' +
      '<p class="note">' + t('androidInstall') + '</p>';
  }
  if (p === 'windows') {
    return '<a class="dl" href="' + esc(b.url) + '">' + label + '</a>' +
      '<p class="note">' + t('windowsInstall') + '</p>';
  }
  if (p === 'macos') {
    return '<a class="dl" href="' + esc(b.url) + '">' + label + '</a>' +
      '<p class="note">' + t('macosInstall') + '</p>' +
      (user.ios ? '<p class="note">' + t('iosNote') + '</p>' : '');
  }
  const debFn = String(b.url || '').split('/').pop();
  const rpmFn = 'karvpn-' + b.version + '-1.x86_64.rpm';
  const archFn = 'karvpn-' + String(b.version).replace(/-/g, '_') + '-1-x86_64.pkg.tar.zst';
  const sub = id => '<button class="' + (state.tab === id ? 'on' : '') + '" data-tab="' + id + '">' + t('tab' + id[0].toUpperCase() + id.slice(1)) + '</button>';
  const tabs = '<div class="subpills">' + sub('deb') + sub('rpm') + sub('arch') + '</div>';
  if (state.tab === 'deb') {
    return '<a class="dl" href="' + esc(b.url) + '">' + label + ' (.deb)</a>' +
      tabs + cmdBlock('sudo apt install ./' + debFn);
  }
  if (state.tab === 'rpm') {
    return '<a class="dl" href="' + esc(dlUrl(b.version, rpmFn)) + '">' + label + ' (.rpm)</a>' +
      tabs + cmdBlock('sudo dnf install ./' + rpmFn);
  }
  if (state.channel === 'stable') {
    return tabs + cmdBlock('yay -S karvpn') + '<p class="hint">' + t('archHint') + '</p>';
  }
  return '<a class="dl" href="' + esc(dlUrl(b.version, archFn)) + '">' + label + ' (.pkg.tar.zst)</a>' +
    tabs + cmdBlock('sudo pacman -U ./' + archFn);
}

function buildDetails(doc, b) {
  const date = (doc.issued_at || '').slice(0, 10);
  const size = b.size ? (b.size / 1048576).toFixed(1) + ' MB' : '';
  const row = (k, v) => v ? '<div class="kv"><span class="k">' + k + '</span><span class="v">' + v + '</span></div>' : '';
  const sha = b.sha256
    ? '<div class="kv"><span class="k">' + t('sha') + '</span><span class="v sha"><code>' + esc(b.sha256) + '</code><button class="copy" data-copy="' + esc(b.sha256) + '" title="' + t('copyTitle') + '">' + COPY_ICON + '</button></span></div>'
    : '';
  return '<details><summary>' + t('details') + ' ' + CHEVRON + '</summary>' +
    row(t('version'), esc(b.version)) +
    row(t('build'), esc(String(b.build))) +
    row(t('date'), esc(date)) +
    row(t('size'), esc(size)) +
    sha + '</details>';
}

async function copyCmd(btn) {
  const text = btn.dataset.copy;
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
  }
  const old = btn.innerHTML;
  btn.textContent = t('copied');
  btn.classList.add('ok');
  setTimeout(() => { btn.innerHTML = old; btn.classList.remove('ok'); }, 1400);
}

document.querySelectorAll('#seg button').forEach(b => b.addEventListener('click', () => {
  if (state.channel !== b.dataset.ch) {
    state.channel = b.dataset.ch;
    load();
  }
}));
document.getElementById('langBtn').addEventListener('click', () => {
  state.lang = state.lang === 'ru' ? 'en' : 'ru';
  render();
});
load();
