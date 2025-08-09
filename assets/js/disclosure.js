// assets/js/disclosure.js
// Site-wide affiliate disclosure bar (FTC/ClickBank compliant)

(function () {
  const STORAGE_KEY = "aff_disclosure_dismissed_v1";

  function isOptedOut() {
    const meta = document.querySelector('meta[name="no-disclosure"]');
    if (meta && meta.content?.toLowerCase() === "true") return true;
    if (document.body && document.body.dataset && "noDisclosure" in document.body.dataset) return true;
    return false;
  }

  function alreadyDismissed() {
    try { return localStorage.getItem(STORAGE_KEY) === "1"; } catch { return false; }
  }

  function rememberDismissed() {
    try { localStorage.setItem(STORAGE_KEY, "1"); } catch {}
  }

  function createStyles() {
    const css = `
      #aff-disclosure{position:sticky;top:0;left:0;right:0;z-index:9999;background:#fff7d6;border-bottom:1px solid #eedc9a;color:#5b4a1a;font-size:14px;line-height:1.4}
      #aff-disclosure .wrap{max-width:1200px;margin:0 auto;padding:.6rem 1rem;display:flex;gap:.75rem;align-items:flex-start}
      #aff-disclosure a{color:inherit;text-decoration:underline}
      #aff-disclosure button.aff-close{margin-left:auto;border:0;background:transparent;font-size:18px;line-height:1;cursor:pointer;color:#5b4a1a}
      @media (prefers-reduced-motion:no-preference){
        #aff-disclosure{transition:transform .25s ease,opacity .25s ease}
        #aff-disclosure.aff-hide{transform:translateY(-100%);opacity:0}
      }
    `;
    const style = document.createElement("style");
    style.setAttribute("data-aff-disclosure", "inline");
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function createBar() {
    const bar = document.createElement("div");
    bar.id = "aff-disclosure";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Affiliate disclosure");
    bar.innerHTML = `
      <div class="wrap">
        <div>
          <strong>Affiliate Disclosure:</strong>
          This site contains affiliate links. If you click and purchase, we may earn a commission at no extra cost to you.
          <a href="/legal/affiliate-disclosure.html" rel="nofollow">Learn more</a>.
        </div>
        <button type="button" class="aff-close" aria-label="Dismiss disclosure" title="Dismiss disclosure">×</button>
      </div>
    `;
    const closeBtn = bar.querySelector("button.aff-close");
    closeBtn.addEventListener("click", () => {
      bar.classList.add("aff-hide");
      rememberDismissed();
      setTimeout(() => bar.remove(), 260);
    });
    return bar;
  }

  function init() {
    if (isOptedOut() || alreadyDismissed()) return;
    createStyles();
    const bar = createBar();
    if (document.body) document.body.prepend(bar);
    else document.addEventListener("DOMContentLoaded", () => document.body.prepend(bar));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();