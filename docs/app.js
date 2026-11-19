'use strict';
const RAW = 'https://raw.githubusercontent.com/KarVPN/karvpn-releases/main/';
const REL = 'https://github.com/KarVPN/karvpn-releases/releases';
const PLATFORMS = ['android', 'linux', 'macos', 'windows'];
const FILES = {
  stable: { android: 'version.json', linux: 'version-linux.json', macos: 'version-macos.json', windows: 'version-windows.json' },
  beta: { android: 'version-beta.json', linux: 'version-linux-beta.json', macos: 'version-macos-beta.json', windows: 'version-windows-beta.json' },
};
const NAMES = { android: 'Android', linux: 'Linux', macos: 'macOS', windows: 'Windows' };
const ICON = '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5"/><path d="M10.5 5.5V4A1.5 1.5 0 0 0 9 2.5H4A1.5 1.5 0 0 0 2.5 4v5A1.5 1.5 0 0 0 4 10.5h1.5"/></svg>';
const STR = {
  ru: {
    tagline: 'VPN-клиент: VLESS, AmneziaWG, WireGuard',
    stable: 'Стабильная', beta: 'Бета',
    yourPlatform: 'Ваша платформа',
    download: 'Скачать', build: 'сборка', sha: 'SHA-256',
    install: 'Установка',
    androidInstall: 'Откройте скачанный APK и разрешите установку из неизвестных источников, когда система спросит.',
    windowsInstall: 'Запустите скачанный установщик .exe.',
    macosInstall: 'Откройте DMG и перетащите KarVPN в Applications.',
    iosNote: 'KarVPN для iPhone и iPad распространяется через TestFlight.',
    tabDeb: 'deb (Ubuntu, Debian)', tabRpm: 'rpm (Fedora, RHEL)', tabArch: 'Arch Linux',
    archHint: '(или paru -S karvpn)',
    archDl: 'скачать .pkg.tar.zst', rpmDl: 'скачать .rpm',
    noBuild: 'нет сборки в этом канале',
    releasesPage: 'страница релизов',
    loadError: 'Не удалось загрузить данные о сборке — попробуйте позже.',
    loading: 'Загрузка…',
    copied: 'Скопировано', copyTitle: 'Скопировать',
    footerNote: 'Целостность сборок проверяется по SHA-256; документы версий подписаны (kid rel1).',
    releases: 'Все сборки', source: 'Исходный код',
  },
  en: {
    tagline: 'VPN client: VLESS, AmneziaWG, WireGuard',
    stable: 'Stable', beta: 'Beta',
    yourPlatform: 'Your platform',
    download: 'Download', build: 'build', sha: 'SHA-256',
    install: 'Install',
    androidInstall: 'Open the downloaded APK and allow installing from unknown sources when prompted.',
    windowsInstall: 'Run the downloaded .exe installer.',
    macosInstall: 'Open the DMG and drag KarVPN to Applications.',
    iosNote: 'KarVPN for iPhone and iPad is distributed via TestFlight.',
    tabDeb: 'deb (Ubuntu, Debian)', tabRpm: 'rpm (Fedora, RHEL)', tabArch: 'Arch Linux',
    archHint: '(or paru -S karvpn)',
    archDl: 'download .pkg.tar.zst', rpmDl: 'download .rpm',
    noBuild: 'no build in this channel',
    releasesPage: 'releases page',
    loadError: 'Could not load build data — try again later.',
    loading: 'Loading…',
    copied: 'Copied', copyTitle: 'Copy',
    footerNote: 'Downloads are verified by SHA-256; version documents are signed (kid rel1).',
    releases: 'All releases', source: 'Source code',
  },
};

const state = { channel: 'stable', lang: 'ru', tab: 'deb', docs: null };
const user = detectOS();
let loadToken = 0;
const t = k => STR[state.lang][k];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dlUrl = (v, f) => REL + '/download/v' + v + '/' + f;
const cmdBlock = c => '<div class="cmd"><code>' + esc(c) + '</code><button class="copy" data-copy="' + esc(c) + '" title="' + t('copyTitle') + '">' + ICON + '</button></div>';

function detectOS() {
  const u = navigator.userAgent;
  if (/android/i.test(u)) return { os: 'android' };
  if (/iphone|ipad|ipod/i.test(u)) return { os: 'macos', ios: true };
  if (/windows/i.test(u)) return { os: 'windows' };
  if (/macintosh|mac os x/i.test(u)) return { os: 'macos' };
  if (/linux/i.test(u)) return { os: 'linux' };
  return {};
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
  document.getElementById('cards').innerHTML = '<p class="muted">' + t('loading') + '</p>';
  const files = FILES[state.channel];
  const docs = await Promise.allSettled(PLATFORMS.map(p => fetchDoc(files[p])));
  if (tok !== loadToken) return;
  state.docs = docs;
  render();
}

function render() {
  document.documentElement.lang = state.lang;
  document.getElementById('tagline').textContent = t('tagline');
  document.querySelectorAll('#seg button').forEach(b => {
    b.textContent = t(b.dataset.ch);
    b.classList.toggle('on', b.dataset.ch === state.channel);
  });
  document.getElementById('langBtn').textContent = state.lang === 'ru' ? 'EN' : 'RU';
  document.getElementById('footRel').textContent = t('releases');
  document.getElementById('footSrc').textContent = t('source');
  document.getElementById('footNote').textContent = t('footerNote');
  if (!state.docs) return;
  const order = user.os && PLATFORMS.includes(user.os)
    ? [user.os, ...PLATFORMS.filter(p => p !== user.os)] : PLATFORMS;
  document.getElementById('cards').innerHTML =
    order.map(p => card(p, state.docs[PLATFORMS.indexOf(p)], user.os === p)).join('');
  document.querySelectorAll('[data-tab]').forEach(b => b.addEventListener('click', () => {
    state.tab = b.dataset.tab;
    render();
  }));
  document.querySelectorAll('.copy').forEach(b => b.addEventListener('click', () => copyCmd(b)));
}

function card(p, res, mine) {
  const hint = mine ? '<div class="hint">' + t('yourPlatform') + '</div>' : '';
  const head = hint + '<h2>' + NAMES[p] + '</h2>';
  if (res.status === 'rejected') {
    const missing = res.reason && res.reason.message === 'missing';
    return '<div class="card' + (mine ? ' mine' : '') + '">' + head +
      '<p class="muted">' + (missing ? t('noBuild') : t('loadError')) + '</p>' +
      '<a href="' + REL + '">' + t('releasesPage') + '</a></div>';
  }
  const b = res.value.body;
  const date = (res.value.issued_at || '').slice(0, 10);
  const size = b.size ? ' · ' + (b.size / 1048576).toFixed(1) + ' MB' : '';
  return '<div class="card' + (mine ? ' mine' : '') + '">' + head +
    '<p class="ver">' + esc(b.version) + ' · ' + t('build') + ' ' + esc(String(b.build)) + (date ? ' · ' + date : '') + '</p>' +
    (b.notes && b.notes[state.lang] ? '<p>' + esc(b.notes[state.lang]) + '</p>' : '') +
    '<a class="btn" href="' + esc(b.url) + '">' + t('download') + size + '</a>' +
    '<p class="sha">' + t('sha') + ': ' + esc(b.sha256 || '') + '</p>' +
    '<h3>' + t('install') + '</h3>' + install(p, b) + '</div>';
}

function install(p, b) {
  if (p === 'android') return '<p>' + t('androidInstall') + '</p>';
  if (p === 'windows') return '<p>' + t('windowsInstall') + '</p>';
  if (p === 'macos') return '<p>' + t('macosInstall') + '</p>' +
    (user.ios ? '<p class="muted">' + t('iosNote') + '</p>' : '');
  const debFn = String(b.url || '').split('/').pop();
  const rpmFn = 'karvpn-' + b.version + '-1.x86_64.rpm';
  const archFn = 'karvpn-' + String(b.version).replace(/-/g, '_') + '-1-x86_64.pkg.tar.zst';
  let panel;
  if (state.tab === 'deb') panel = cmdBlock('sudo apt install ./' + debFn);
  else if (state.tab === 'rpm') panel =
    '<p><a href="' + esc(dlUrl(b.version, rpmFn)) + '">' + t('rpmDl') + '</a></p>' +
    cmdBlock('sudo dnf install ./' + rpmFn);
  else if (state.channel === 'stable') panel =
    cmdBlock('yay -S karvpn') + '<p class="muted">' + t('archHint') + '</p>';
  else panel =
    '<p><a href="' + esc(dlUrl(b.version, archFn)) + '">' + t('archDl') + '</a></p>' +
    cmdBlock('sudo pacman -U ./' + archFn);
  const tab = id => '<button class="' + (state.tab === id ? 'on' : '') + '" data-tab="' + id + '">' + t('tab' + id[0].toUpperCase() + id.slice(1)) + '</button>';
  return '<div class="tabs">' + tab('deb') + tab('rpm') + tab('arch') + '</div>' + panel;
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
  setTimeout(() => { btn.innerHTML = old; btn.classList.remove('ok'); }, 1600);
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
