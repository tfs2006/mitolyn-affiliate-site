// assets/js/main.js
// Global affiliate wiring + tiny click tracker + page TID + UTM

const AFFILIATE_URL = "https://4cf15itgfwf3dp8atdvh-i5n2g.hop.clickbank.net";
const REL_ATTRS = "nofollow sponsored noopener";

function pageDefaultTid() {
  const meta = document.querySelector('meta[name="page-tid"]');
  if (meta?.content) return meta.content.trim();
  const bodyTid = document.body?.dataset?.tid;
  return bodyTid ? bodyTid.trim() : "site";
}

function buildAffiliateUrl(tid) {
  try {
    const u = new URL(AFFILIATE_URL);
    const resolvedTid = tid || pageDefaultTid();
    if (resolvedTid) u.searchParams.set("tid", resolvedTid);
    // Basic UTM to see cta performance in analytics
    u.searchParams.set("utm_source", "affiliate_site");
    u.searchParams.set("utm_medium", "cta");
    u.searchParams.set("utm_campaign", "mitolyn");
    u.searchParams.set("utm_content", resolvedTid || "default");
    return u.toString();
  } catch {
    return AFFILIATE_URL;
  }
}

function wireAffiliateCTAs(root = document) {
  root.querySelectorAll("a[data-cta]").forEach(a => {
    const tid = a.dataset.tid || null;
    a.href = buildAffiliateUrl(tid);
    a.rel = REL_ATTRS;
    a.target = "_blank";
    a.addEventListener("click", () => {
      try {
        const KEY = "cta_clicks";
        const store = JSON.parse(localStorage.getItem(KEY) || "{}");
        const k = tid || pageDefaultTid();
        store[k] = (store[k] || 0) + 1;
        localStorage.setItem(KEY, JSON.stringify(store));
      } catch {}
    });
  });
}

function setYear() {
  const el = document.getElementById("y");
  if (el) el.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  wireAffiliateCTAs();
  setYear();
});