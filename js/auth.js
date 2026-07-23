(function () {
  const KEY  = 'wjj_auth_v1';
  const HASH = '4dd77728a24a26409ac1e9898d5a38dc295cbf46a18c9dfd80b2fa17090a19c4';

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Checked synchronously so the router flag is set before DOMContentLoaded fires
  window.__siteUnlocked = (localStorage.getItem(KEY) === HASH);

  document.addEventListener('DOMContentLoaded', function () {
    const gate    = document.getElementById('auth-gate');
    const content = document.getElementById('main-content');

    if (window.__siteUnlocked) {
      gate.style.display = 'none';
    }

    document.getElementById('auth-form').addEventListener('submit', async function (e) {
      e.preventDefault();
      const val  = document.getElementById('auth-input').value.toLowerCase();
      const hash = await sha256(val);
      if (hash === HASH) {
        localStorage.setItem(KEY, HASH);
        window.__siteUnlocked = true;
        gate.style.display = 'none';
        if (typeof navigate === 'function') navigate(getRoute());
      } else {
        const err = document.getElementById('auth-error');
        err.textContent = 'Incorrect password. Please try again.';
        document.getElementById('auth-input').value = '';
        document.getElementById('auth-input').focus();
        err.style.animation = 'none';
        void err.offsetWidth;
        err.style.animation = '';
      }
    });

    // If the gate element is removed or hidden while locked, wipe content and reload
    new MutationObserver(function () {
      if (window.__siteUnlocked) return;
      const g = document.getElementById('auth-gate');
      if (!g) {
        location.reload();
        return;
      }
      if (g.style.display === 'none' || g.style.visibility === 'hidden' || g.style.opacity === '0') {
        g.style.cssText = '';
        if (content) content.innerHTML = '';
      }
    }).observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    // Belt-and-suspenders: periodic wipe if somehow content appears without auth
    setInterval(function () {
      if (!window.__siteUnlocked && content && content.innerHTML.trim() !== '') {
        content.innerHTML = '';
      }
    }, 800);
  });
})();
