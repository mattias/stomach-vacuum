(function () {
  "use strict";
  var I18N = window.I18N;
  var LANGS = ["en", "sv", "ja"];
  var LANG_KEY = "sv-lang";
  var DONE_KEY = "vacuum-done";

  function store(op, key, val) {
    try { return op === "get" ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- i18n ---------- */
  // English is the markup itself: capture it once so switching back restores it.
  $$("[data-i18n]").forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in I18N.en)) I18N.en[k] = el.innerHTML;
  });
  $$("[data-i18n-aria]").forEach(function (el) {
    var k = el.getAttribute("data-i18n-aria");
    if (!(k in I18N.en)) I18N.en[k] = el.getAttribute("aria-label");
  });

  var lang = "en";
  function t(key) {
    var d = I18N[lang];
    if (d && key in d) return d[key];
    return key in I18N.en ? I18N.en[key] : "";
  }

  // Mark links that open a new tab; the hidden text is translated in applyLang.
  $$('a[target="_blank"]').forEach(function (a) {
    var s = document.createElement("span");
    s.className = "sr";
    s.setAttribute("data-newtab", "");
    a.appendChild(s);
    var icon = $("svg", a);
    if (icon) { icon.setAttribute("aria-hidden", "true"); icon.setAttribute("focusable", "false"); }
  });

  function applyLang(next, persist) {
    if (LANGS.indexOf(next) < 0) next = "en";
    lang = next;
    document.documentElement.lang = lang;
    document.title = t("title");
    var meta = $('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("desc"));

    $$("[data-i18n]").forEach(function (el) { el.innerHTML = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-aria]").forEach(function (el) { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    $$("a[data-q]").forEach(function (a) {
      a.href = "https://www.youtube.com/results?search_query=" + encodeURIComponent(t(a.getAttribute("data-q")));
    });
    $$("[data-newtab]").forEach(function (s) { s.textContent = t("ui.newtab"); });
    $$(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === lang)); });

    renderTimerText();
    if (persist) {
      store("set", LANG_KEY, lang);
      try {
        var u = new URL(location.href);
        u.searchParams.set("lang", lang);
        history.replaceState(null, "", u.pathname + u.search + u.hash);
      } catch (e) {}
    }
  }

  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.dataset.lang, true); });
  });

  /* ---------- level progress ---------- */
  var done = {};
  try { done = JSON.parse(store("get", DONE_KEY) || "{}"); } catch (e) {}
  if (!done || typeof done !== "object") done = {};
  var doneBtns = $$("[data-done]");
  function paintDone() {
    var n = 0;
    doneBtns.forEach(function (b) {
      var on = !!done[b.dataset.done];
      if (on) n++;
      b.setAttribute("aria-pressed", String(on));
    });
    $("#pbi").style.width = (n / 5 * 100) + "%";
    $("#pb").setAttribute("aria-valuenow", n);
  }
  doneBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      done[b.dataset.done] = !done[b.dataset.done];
      store("set", DONE_KEY, JSON.stringify(done));
      paintDone();
    });
  });
  paintDone();

  /* ---------- hold timer ---------- */
  var tr = $("#tr"), ts = $("#ts"), go = $("#go"), presets = $$("#presets button");
  var sel = 15, left = 15, tick = null, stateKey = "ui.ready";

  function fmt(s) {
    var m = Math.floor(s / 60), r = s % 60;
    return "0" + m + ":" + (r < 10 ? "0" : "") + r;
  }
  function setPresetsDisabled(off) { presets.forEach(function (b) { b.disabled = off; }); }
  function renderTimerText() {
    ts.textContent = t(stateKey);
    go.textContent = t(tick ? "ui.cancel" : "ui.start");
  }
  function setState(key) { stateKey = key; renderTimerText(); }
  function stop(key) {
    clearInterval(tick); tick = null; left = sel;
    setPresetsDisabled(false);
    tr.textContent = fmt(left);
    setState(key);
  }

  presets.forEach(function (b) {
    b.addEventListener("click", function () {
      if (tick) return;
      presets.forEach(function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      sel = left = +b.dataset.s;
      tr.textContent = fmt(left);
      setState("ui.ready");
    });
  });

  go.addEventListener("click", function () {
    if (tick) { stop("ui.cancelled"); return; }
    var prep = 3;                       // 3 s to breathe out, then the hold counts down
    setPresetsDisabled(true);
    tr.textContent = fmt(prep);
    tick = setInterval(function () {
      if (prep > 0) {
        prep--;
        if (prep > 0) { tr.textContent = fmt(prep); return; }
        left = sel; setState("ui.hold"); tr.textContent = fmt(left);
        return;
      }
      left--; tr.textContent = fmt(left);
      if (left <= 0) { stop("ui.finished"); tr.textContent = fmt(0); }
    }, 1000);
    setState("ui.exhale");
  });

  tr.textContent = fmt(left);

  /* ---------- start ---------- */
  var wanted = null;
  try { wanted = new URL(location.href).searchParams.get("lang"); } catch (e) {}
  applyLang(LANGS.indexOf(wanted) >= 0 ? wanted : (store("get", LANG_KEY) || "en"), false);
})();
