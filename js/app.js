(function () {
  "use strict";

  /* ================= helpers ================= */
  var $ = function (id) { return document.getElementById(id); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var num = function (id) { var v = parseFloat($(id).value); return isFinite(v) ? v : 0; };
  var fmt = function (n, d) { return Number(n).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[c]; }); };
  var stat = function (v, l) { return '<div class="stat"><b>' + v + '</b><span>' + l + '</span></div>'; };
  var pad = function (n, w) { return String(n).padStart(w || 2, "0"); };
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var addDays = function (iso, n) { var d = new Date(iso + "T12:00:00"); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); };
  var days = function (iso) { return iso ? Math.max(0, Math.round((new Date(today() + "T12:00:00") - new Date(iso + "T12:00:00")) / 864e5)) : ""; };
  var uid = function (p) { return p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); };
  var SP = window.SPECIES || [];
  var spBy = function (code) { return SP.filter(function (s) { return s.code === code; })[0] || SP[SP.length - 1]; };
  var DRY_LABEL = { 1: "Easy", 2: "Moderate", 3: "Difficult" };
  var DRY_FACTOR = { 1: 0.8, 2: 1.0, 3: 1.45 };

  /* ================= router ================= */
  var VIEWS = ["guide", "log", "species", "tools"];
  function route() {
    var h = (location.hash || "#guide").slice(1);
    var view = VIEWS.indexOf(h) >= 0 ? h : null, target = null;
    if (!view) {
      target = document.getElementById(h);
      var host = target && target.closest("[data-view]");
      view = host ? host.getAttribute("data-view") : "guide";
    }
    $$("[data-view]").forEach(function (v) { v.hidden = v.getAttribute("data-view") !== view; });
    $$("[data-view-link]").forEach(function (a) { if (a.getAttribute("data-view-link") === view) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current"); });
    if (target && target.getAttribute("data-view") == null) { target.scrollIntoView({ behavior: "auto" }); }
    else window.scrollTo(0, 0);
    if (view === "log") renderLog();
  }
  window.addEventListener("hashchange", route);

  /* ================= species library & ID key ================= */
  function speciesOptions(withAll) {
    return (withAll ? '<option value="">All species</option>' : "") + SP.map(function (s) { return '<option value="' + s.code + '">' + esc(s.code + " · " + s.name) + '</option>'; }).join("");
  }
  $$(".sp-select").forEach(function (sel) { sel.innerHTML = speciesOptions(false); sel.value = "EP"; });
  $("s-sp").innerHTML = speciesOptions(false);
  $("j-sp").innerHTML = speciesOptions(true);
  $("w-sp").value = "MP"; $("l-sp").value = "MP";

  var KEYS = [
    { k: "color", label: "Heartwood color", multi: true },
    { k: "leaf", label: "Leaves" },
    { k: "fruit", label: "Pod / fruit" },
    { k: "scent", label: "Scent of fresh wood" },
    { k: "heavy", label: "Weight in hand" }
  ];
  function keyValues(k) {
    var set = {};
    SP.forEach(function (s) { var v = s[k]; (Array.isArray(v) ? v : [v]).forEach(function (x) { if (x) set[x] = 1; }); });
    return Object.keys(set).sort();
  }
  $("idkey").innerHTML = KEYS.map(function (g) {
    return '<fieldset><legend>' + g.label + '</legend>' + keyValues(g.k).map(function (v, i) {
      var id = "k-" + g.k + "-" + i;
      return '<label for="' + id + '"><input type="checkbox" id="' + id + '" data-k="' + g.k + '" value="' + esc(v) + '">' + esc(v) + '</label>';
    }).join("") + '</fieldset>';
  }).join("") + '<fieldset><legend>UV test</legend><label for="k-fluor"><input type="checkbox" id="k-fluor" data-k="fluor" value="true">Heartwood fluoresces under UV</label></fieldset>';

  function renderSpecies() {
    var picks = $$("#idkey input:checked").map(function (c) { return { k: c.getAttribute("data-k"), v: c.value }; });
    var q = $("sp-q").value.trim().toLowerCase();
    var list = SP.map(function (s) {
      var score = 0;
      picks.forEach(function (p) {
        if (p.k === "fluor") { if (s.fluor) score++; return; }
        var v = s[p.k]; if (Array.isArray(v) ? v.indexOf(p.v) >= 0 : v === p.v) score++;
      });
      return { s: s, score: score };
    }).filter(function (x) {
      if (!q) return true;
      return (x.s.name + " " + x.s.sci + " " + x.s.aka.join(" ") + " " + x.s.code).toLowerCase().indexOf(q) >= 0;
    });
    if (picks.length) list.sort(function (a, b) { return b.score - a.score; });
    var best = picks.length && list.length ? list[0].score : 0;
    $("sp-grid").innerHTML = list.map(function (x) {
      var s = x.s, sh = s.shrink;
      var cites = /CITES Appendix/.test(s.regs);
      return '<article class="sp' + (best && x.score === best ? ' hit' : '') + '" id="sp-' + s.code + '">' +
        '<div class="sp-top"><div><h3>' + esc(s.name) + '</h3><div class="sci">' + esc(s.sci) + '</div></div><span class="sp-code">' + s.code + '</span></div>' +
        (picks.length ? '<div class="score">' + x.score + ' of ' + picks.length + ' observations match</div>' : '') +
        (s.aka.length ? '<div class="aka">Also: ' + esc(s.aka.join(", ")) + '</div>' : '') +
        '<div class="sp-nums"><div><b>' + s.dryD + '</b><span>lb/ft³ dry</span></div><div><b>' + s.greenD + '</b><span>lb/ft³ green</span></div><div><b>' + (sh ? sh.t + ' / ' + sh.r : (s.dry === 3 ? "high" : "low–mod")) + '</b><span>' + (sh ? 'shrink T / R %' : 'shrinkage') + '</span></div></div>' +
        '<div><span class="pill ' + (s.dry === 1 ? 'p-dry' : s.dry === 2 ? 'p-air' : 'p-green') + '">' + DRY_LABEL[s.dry] + ' drying</span>' + (s.fluor ? ' <span class="pill p-kiln">Fluoresces</span>' : '') + (cites ? ' <span class="pill p-green">CITES</span>' : '') + '</div>' +
        '<h4>Identify</h4><ul>' + s.id.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join("") + '</ul>' +
        '<p class="small">' + esc(s.notes) + '</p>' +
        (s.region ? '<p class="small"><b>Range:</b> ' + esc(s.region) + '</p>' : '') +
        '<p class="small"><b>Safety:</b> ' + esc(s.caution) + '</p>' +
        '<p class="reg' + (cites ? ' cites' : '') + '"><b>Rules:</b> ' + esc(s.regs) + '</p>' +
        '<p class="small"><b>Market:</b> ' + esc(s.value) + '</p>' +
        '</article>';
    }).join("") || '<p>No species match that search.</p>';
  }
  $("idkey").addEventListener("change", renderSpecies);
  $("sp-q").addEventListener("input", renderSpecies);
  $("key-reset").addEventListener("click", function () { $$("#idkey input").forEach(function (c) { c.checked = false; }); renderSpecies(); });
  renderSpecies();

  /* ================= calculators ================= */
  function planCuts() {
    var s = spBy($("cp-sp").value), D = num("cp-d"), L = num("cp-l"), t = num("cp-t"), k = num("cp-k"), minW = num("cp-min"), mill = num("cp-mill");
    var R = D / 2, rows = [], out = $("cp-out"), body = $("cp-rows");
    if (!(R > 0 && t > 0 && L > 0)) { out.innerHTML = ""; body.innerHTML = ""; return; }
    var chord = function (y) { return Math.abs(y) >= R ? 0 : 2 * Math.sqrt(R * R - y * y); };
    var yTop = Math.sqrt(Math.max(R * R - (minW / 2) * (minW / 2), 0));
    var y = yTop, i = 0, bfTot = 0, wtTot = 0, heavy = 0;
    while (y - t >= -yTop && i < 300) {
      var top = y, bot = y - t, w = chord(y - t / 2);
      var wMax = (top > 0 && bot < 0) ? D : Math.max(chord(top), chord(bot));
      var bf = t * w * L * 12 / 144, wt = (t / 12) * (w / 12) * L * s.greenD;
      var note = [];
      if (top >= 0 && bot <= 0) note.push("Pith slab");
      if (wMax > mill) note.push('<span class="flag">Wider than mill (' + fmt(wMax, 0) + '″)</span>');
      i++; bfTot += bf; wtTot += wt; heavy = Math.max(heavy, wt);
      rows.push('<tr><td>' + pad(i) + '</td><td class="r">' + fmt(w, 1) + '</td><td class="r">' + fmt(bf, 0) + '</td><td class="r">' + fmt(wt, 0) + '</td><td>' + note.join(" · ") + '</td></tr>');
      y = bot - k;
    }
    body.innerHTML = rows.join("") || '<tr><td colspan="5">No slabs fit. Check the numbers.</td></tr>';
    out.innerHTML = stat(i, "slabs") + stat(fmt(bfTot, 0), "board feet, green") + stat(fmt(heavy, 0) + " lb", "heaviest slab, green") + stat(fmt(wtTot / 2000, 1) + " t", "total green weight (short tons)");
  }
  function weightCalc() {
    var s = spBy($("w-sp").value), t = num("w-t"), w = (num("w-w1") + num("w-w2") + num("w-w3")) / 3, l = num("w-l"), p = num("w-p");
    var d = $("w-state").value === "dry" ? s.dryD : s.greenD;
    var bf = t * w * l / 144, wt = t * w * l / 1728 * d;
    $("w-out").innerHTML = stat(fmt(bf, 1), "board feet") + stat(fmt(w, 1) + "″", "average width") + stat(fmt(wt, 0) + " lb", ($("w-state").value === "dry" ? "dry" : "green") + " weight") + stat("$" + fmt(bf * p, 0), "at $" + fmt(p, 0) + "/bf");
  }
  function dryCalc() {
    var s = spBy($("d-sp").value), t = num("d-t"), cl = parseFloat($("d-cl").value) || 1;
    var air = 1.1 * Math.pow(t, 1.5) * DRY_FACTOR[s.dry] * cl, kiln = air * 0.25;
    var start = $("d-start").value || today();
    var mo = function (m) { return m < 1.5 ? fmt(m * 4.3, 0) + " wk" : fmt(m, 1) + " mo"; };
    var ready = addDays(start, Math.round((air + kiln) * 30.4));
    $("d-out").innerHTML = stat(mo(air * 0.8) + "–" + mo(air * 1.25), "air dry to ~20–25%") + stat(mo(kiln * 0.8) + "–" + mo(kiln * 1.3), "solar kiln to target") + stat(ready, "ready around") + stat(DRY_LABEL[s.dry], s.name + " drying class");
  }
  var BOX = { "20": { ft3: 1170, fill: 0.42, label: "20′" }, "40": { ft3: 2390, fill: 0.42, label: "40′" }, "40hc": { ft3: 2700, fill: 0.42, label: "40′ HC" } };
  function loadCalc() {
    var s = spBy($("l-sp").value), bf = num("l-bf"), b = BOX[$("l-box").value], lim = num("l-lim");
    var wt = bf / 12 * s.dryD;
    var cubeBf = b.ft3 * b.fill * 12, weightBf = lim / s.dryD * 12;
    var cap = Math.min(cubeBf, weightBf);
    var boxes = cap > 0 ? Math.ceil(bf / cap) : 0;
    $("l-out").innerHTML = stat(fmt(wt, 0) + " lb", "dry weight of " + fmt(bf, 0) + " bf") + stat(fmt(cap, 0) + " bf", "per " + b.label + " (" + (cubeBf < weightBf ? "fills space first" : "hits weight first") + ")") + stat(boxes, boxes === 1 ? "container needed" : "containers needed");
  }
  function split() {
    var n = parseInt($("p-n").value, 10), rev = num("p-rev"), own = rev * num("p-own") / 100, shared = num("p-ship");
    var costs = [num("p-c1"), num("p-c2"), num("p-c3"), num("p-c4")].slice(0, n);
    for (var i = 1; i <= 4; i++) $("p-c" + i).closest("label").hidden = i > n;
    var reimb = costs.reduce(function (a, b) { return a + b; }, 0);
    var profit = rev - own - shared - reimb, share = profit / n;
    var money = function (v) { return (v < 0 ? "−$" : "$") + fmt(Math.abs(v), 0); };
    $("p-out").innerHTML = stat(money(own), "landowner") + stat(money(profit), profit < 0 ? "loss after costs" : "profit to split") +
      costs.map(function (c, i) { return stat(money(c + share), "Partner " + (i + 1) + " (" + money(c) + " back + " + money(share) + ")"); }).join("");
  }
  [["planner", planCuts], ["wcalc", weightCalc], ["dcalc", dryCalc], ["lcalc", loadCalc], ["split", split]].forEach(function (pair) {
    $(pair[0]).addEventListener("input", pair[1]); $(pair[0]).addEventListener("change", pair[1]); pair[1]();
  });
  $("d-start").value = today(); dryCalc();

  /* ================= storage (IndexedDB, memory fallback) ================= */
  var idb = null, mem = { slabs: {}, reads: {}, photos: {}, meta: {} };
  function openDB() {
    return new Promise(function (res) {
      try {
        var rq = indexedDB.open("slabyard", 1);
        rq.onupgradeneeded = function () {
          var d = rq.result;
          d.createObjectStore("slabs", { keyPath: "id" });
          d.createObjectStore("reads", { keyPath: "rid" });
          d.createObjectStore("photos", { keyPath: "pid" });
          d.createObjectStore("meta", { keyPath: "k" });
        };
        rq.onsuccess = function () { idb = rq.result; res(true); };
        rq.onerror = function () { res(false); };
        rq.onblocked = function () { res(false); };
      } catch (e) { res(false); }
    });
  }
  var KEYF = { slabs: "id", reads: "rid", photos: "pid", meta: "k" };
  function all(store) {
    if (!idb) return Promise.resolve(Object.keys(mem[store]).map(function (k) { return mem[store][k]; }));
    return new Promise(function (res, rej) { var rq = idb.transaction(store).objectStore(store).getAll(); rq.onsuccess = function () { res(rq.result); }; rq.onerror = function () { rej(rq.error); }; });
  }
  function put(store, obj) {
    if (!idb) { mem[store][obj[KEYF[store]]] = obj; return Promise.resolve(); }
    return new Promise(function (res, rej) { var tx = idb.transaction(store, "readwrite"); tx.objectStore(store).put(obj); tx.oncomplete = function () { res(); }; tx.onerror = function () { rej(tx.error); }; });
  }
  function del(store, key) {
    if (!idb) { delete mem[store][key]; return Promise.resolve(); }
    return new Promise(function (res, rej) { var tx = idb.transaction(store, "readwrite"); tx.objectStore(store).delete(key); tx.oncomplete = function () { res(); }; tx.onerror = function () { rej(tx.error); }; });
  }
  function clearAll() {
    if (!idb) { mem = { slabs: {}, reads: {}, photos: {}, meta: mem.meta }; return Promise.resolve(); }
    return Promise.all(["slabs", "reads", "photos"].map(function (s) {
      return new Promise(function (res) { var tx = idb.transaction(s, "readwrite"); tx.objectStore(s).clear(); tx.oncomplete = res; tx.onerror = res; });
    }));
  }

  /* ================= state ================= */
  var S = { slabs: [], reads: [], photos: [], settings: { target: 8, pwh: null }, example: false, ready: false, openId: null };
  var urlCache = {};
  function photoURL(p) {
    if (p.src) return p.src;
    if (!urlCache[p.pid]) urlCache[p.pid] = URL.createObjectURL(p.blob);
    return urlCache[p.pid];
  }

  /* soft password lock */
  function hash(str) {
    var h1 = 0x811c9dc5, h2 = 0x01000193;
    str = "slabyard|" + str;
    for (var i = 0; i < str.length; i++) {
      var c = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 16777619) >>> 0;
      h2 = Math.imul(h2 ^ c, 2246822507) >>> 0;
      h2 = (h2 ^ (h2 >>> 13)) >>> 0;
    }
    return h1.toString(16) + h2.toString(16);
  }
  var DEFAULT_PWH = hash("abcd");
  var unlocked = false;
  try { unlocked = sessionStorage.getItem("slabyard-unlocked") === "1"; } catch (e) {}
  function setLock(open) {
    unlocked = open;
    try { if (open) sessionStorage.setItem("slabyard-unlocked", "1"); else sessionStorage.removeItem("slabyard-unlocked"); } catch (e) {}
    var bar = $("lockbar");
    bar.className = "lockbar " + (open ? "open" : "locked");
    $("lock-text").innerHTML = open ? "<b>Unlocked.</b> You can add and edit on this device until you lock it or close the tab." : "<b>View only.</b> Enter the password to add or edit slabs, readings and photos.";
    $("f-unlock").hidden = open; $("btn-lock").hidden = !open;
    $$("[data-write]").forEach(function (b) { b.disabled = !open; });
    if (!open) {
      var cur = $$(".tabs [aria-selected='true']")[0];
      if (cur && cur.hasAttribute("data-write")) showTab("inv");
    }
    renderDetail();
  }
  $("f-unlock").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = hash($("unlock-pw").value) === (S.settings.pwh || DEFAULT_PWH);
    $("unlock-pw").value = "";
    $("unlock-msg").textContent = ok ? "" : "Wrong password.";
    if (ok) setLock(true);
  });
  $("btn-lock").addEventListener("click", function () { setLock(false); });

  /* examples (shown until the first real slab; never stored) */
  function examples() {
    var m = addDays(today(), -120);
    var slabs = [
      { id: "MP01-A-04", sp: "MP", tree: "Tree 1, example property", date: m, t: 2.5, w: 44, l: 120, loc: "Stack 1 · layer 2", gw: 520, gmc: 90, sample: "yes", grade: "A", status: "In kiln", price: "", notes: "Bookmatch with -05" },
      { id: "MP01-A-05", sp: "MP", tree: "Tree 1, example property", date: m, t: 2.5, w: 45, l: 120, loc: "Stack 1 · layer 2", gw: "", gmc: "", sample: "no", grade: "A", status: "In kiln", price: "", notes: "Bookmatch with -04" },
      { id: "NR02-A-07", sp: "NR", tree: "Tree 2, street tree removal", date: m, t: 4.5, w: 52, l: 108, loc: "Stack 2 · bottom", gw: 1010, gmc: 80, sample: "yes", grade: "B", status: "In yard", price: "", notes: "Near pith, watch for crack" },
      { id: "EP03-A-02", sp: "EP", tree: "Tree 3", date: addDays(m, 20), t: 2.5, w: 58, l: 122, loc: "Stack 3 · top", gw: "", gmc: "", sample: "no", grade: "B", status: "In yard", price: "", notes: "" },
      { id: "DR04-A-01", sp: "DR", tree: "Tree 4, documented removal", date: addDays(m, -200), t: 2.25, w: 22, l: 84, loc: "Shed", gw: "", gmc: "", sample: "no", grade: "A", status: "Dry stock", price: 1400, notes: "Keep origin paperwork with this slab" }
    ];
    var reads = [
      { rid: "e1", id: "MP01-A-04", date: addDays(m, 14), stage: "Air", who: "JS", wt: 470, shell: "", core: "", cond: "", notes: "" },
      { rid: "e2", id: "MP01-A-04", date: addDays(m, 45), stage: "Air", who: "JS", wt: 395, shell: "", core: "", cond: "Dry month", notes: "" },
      { rid: "e3", id: "MP01-A-04", date: addDays(m, 80), stage: "Air", who: "AB", wt: 340, shell: "", core: "", cond: "", notes: "" },
      { rid: "e4", id: "MP01-A-04", date: addDays(m, 110), stage: "Kiln", who: "AB", wt: 305, shell: "", core: "", cond: "Kiln 136°F / 48% RH", notes: "Into kiln" },
      { rid: "e5", id: "NR02-A-07", date: addDays(m, 60), stage: "Air", who: "JS", wt: 830, shell: "", core: "", cond: "", notes: "" },
      { rid: "e6", id: "NR02-A-07", date: addDays(m, 112), stage: "Air", who: "AB", wt: 730, shell: 22, core: 38, cond: "", notes: "Small end check" },
      { rid: "e7", id: "EP03-A-02", date: addDays(m, 100), stage: "Air", who: "AB", wt: "", shell: 17, core: 21, cond: "", notes: "" },
      { rid: "e8", id: "MP01-A-05", date: addDays(m, 110), stage: "Kiln", who: "AB", wt: "", shell: 12, core: 15, cond: "", notes: "" },
      { rid: "e9", id: "DR04-A-01", date: addDays(m, 60), stage: "Stored", who: "JS", wt: "", shell: 8, core: 9, cond: "", notes: "Heat-treated, 133°F core 45 min" }
    ];
    return { slabs: slabs, reads: reads };
  }

  async function loadAll() {
    var ok = await openDB();
    try {
      var meta = await all("meta");
      meta.forEach(function (m) { if (m.k === "settings") S.settings = Object.assign(S.settings, m.v); });
      S.slabs = await all("slabs"); S.reads = await all("reads"); S.photos = await all("photos");
      // one-time migration from the earlier single-page journal
      if (!S.slabs.length) {
        var old = null; try { old = JSON.parse(localStorage.getItem("earpod-slab-journal-v1") || "null"); } catch (e) {}
        if (old && !old.example && Array.isArray(old.slabs) && old.slabs.length) {
          for (var i = 0; i < old.slabs.length; i++) { var o = old.slabs[i]; await put("slabs", normSlab(Object.assign({ sp: "EP", status: "In yard" }, o))); }
          for (var j = 0; j < (old.reads || []).length; j++) { await put("reads", Object.assign({ rid: uid("r") }, old.reads[j])); }
          S.slabs = await all("slabs"); S.reads = await all("reads");
        }
      }
    } catch (e) { ok = false; }
    if (!ok) $("x-msg").textContent = "This browser isn't allowing storage here, so the log only lasts until you close the page. Save a backup before leaving.";
    S.example = !S.slabs.length;
    if (S.example) { var ex = examples(); S.slabs = ex.slabs; S.reads = ex.reads; S.photos = []; }
    S.ready = true;
    setLock(unlocked);
    renderLog();
  }
  function saveSettings() { return put("meta", { k: "settings", v: S.settings }); }
  async function dropExamples() {
    if (!S.example) return;
    S.example = false; S.slabs = []; S.reads = []; S.photos = []; S.openId = null;
  }
  function normSlab(o) {
    return { id: String(o.id || "").trim().toUpperCase(), sp: o.sp || "XX", tree: o.tree || "", date: o.date || "", t: o.t || "", w: o.w || "", l: o.l || "", loc: o.loc || "", gw: o.gw || "", gmc: o.gmc || "", sample: o.sample || "no", grade: o.grade || "", status: o.status || "In yard", price: o.price || "", notes: o.notes || "" };
  }

  /* ================= moisture math ================= */
  function mcOf(slab, r) {
    var gw = parseFloat(slab.gw), gmc = parseFloat(slab.gmc), w = parseFloat(r.wt);
    if (gw > 0 && gmc >= 0 && w > 0) { var od = gw / (1 + gmc / 100); return { v: (w / od - 1) * 100, src: "weight" }; }
    var s = parseFloat(r.shell), c = parseFloat(r.core);
    if (isFinite(s) && isFinite(c)) return { v: (s + c) / 2, src: "meter avg" };
    if (isFinite(c)) return { v: c, src: "meter core" };
    if (isFinite(s)) return { v: s, src: "meter shell" };
    return null;
  }
  function readsOf(id) { return S.reads.filter(function (r) { return r.id === id; }).sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; }); }
  function latest(slab) {
    var rs = readsOf(slab.id);
    for (var i = rs.length - 1; i >= 0; i--) { var m = mcOf(slab, rs[i]); if (m) return { mc: m, n: rs.length, all: rs }; }
    return { mc: null, n: rs.length, all: rs };
  }
  function mPill(mc) {
    if (!mc) return '<span class="pill p-none">No reading</span>';
    var v = mc.v, t = S.settings.target;
    if (v > 25) return '<span class="pill p-green">Air drying</span>';
    if (v > 15) return '<span class="pill p-air">Kiln ready</span>';
    if (v > t + 1) return '<span class="pill p-kiln">Finishing</span>';
    return '<span class="pill p-dry">Dry</span>';
  }
  function sPill(st) { return '<span class="pill ' + (st === "Sold" || st === "Shipped" ? "p-sold" : st === "Reserved" ? "p-kiln" : "p-none") + '">' + esc(st || "In yard") + '</span>'; }
  var bfOf = function (s) { return (parseFloat(s.t) || 0) * (parseFloat(s.w) || 0) * (parseFloat(s.l) || 0) / 144; };
  var photosOf = function (id) { return S.photos.filter(function (p) { return p.slabId === id; }).sort(function (a, b) { return a.date < b.date ? -1 : 1; }); };

  /* ================= log UI ================= */
  function showTab(name) {
    $$(".tabs [data-tab]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-tab") === name ? "true" : "false"); });
    $$("[data-panel]").forEach(function (p) { p.hidden = p.getAttribute("data-panel") !== name; });
  }
  document.querySelector(".tabs").addEventListener("click", function (e) {
    var b = e.target.closest("[data-tab]"); if (!b || b.disabled) return;
    if (b.getAttribute("data-tab") === "add" && editing) endEdit();
    showTab(b.getAttribute("data-tab"));
  });

  function renderLog() {
    if (!S.ready) return;
    $("j-example").hidden = !S.example;
    var q = $("j-filter").value.trim().toLowerCase(), sp = $("j-sp").value, st = $("j-st").value, sort = $("j-sort").value;
    var list = S.slabs.map(function (s) { return { s: s, L: latest(s) }; });
    var c = { n: list.length, bf: 0, wet: 0, dry: 0, sold: 0 };
    list.forEach(function (x) { c.bf += bfOf(x.s); if (x.L.mc && x.L.mc.v > 25) c.wet++; if (x.L.mc && x.L.mc.v <= S.settings.target + 1) c.dry++; if (x.s.status === "Sold" || x.s.status === "Shipped") c.sold++; });
    $("j-stats").innerHTML = stat(c.n, "slabs") + stat(fmt(c.bf, 0), "board feet") + stat(c.wet, "over 25% MC") + stat(c.dry, "dry, at or near target") + stat(c.sold, "sold or shipped");
    if (q) list = list.filter(function (x) { return (x.s.id + " " + x.s.tree + " " + x.s.loc + " " + x.s.notes + " " + spBy(x.s.sp).name).toLowerCase().indexOf(q) >= 0; });
    if (sp) list = list.filter(function (x) { return x.s.sp === sp; });
    if (st) list = list.filter(function (x) { return (x.s.status || "In yard") === st; });
    list.sort(function (a, b) {
      if (sort === "mc") return (b.L.mc ? b.L.mc.v : -1) - (a.L.mc ? a.L.mc.v : -1);
      if (sort === "age") return (days(b.s.date) || 0) - (days(a.s.date) || 0);
      if (sort === "bf") return bfOf(b.s) - bfOf(a.s);
      return a.s.id < b.s.id ? -1 : 1;
    });
    $("j-rows").innerHTML = list.map(function (x) {
      var s = x.s, m = x.L.mc, ph = photosOf(s.id)[0];
      return '<tr data-open="' + esc(s.id) + '"' + (S.openId === s.id ? ' class="sel"' : '') + '><td>' + (ph ? '<img class="mini-thumb" alt="" src="' + photoURL(ph) + '">' : '') + '</td><td><span class="id">' + esc(s.id) + '</span>' + (s.sample === "yes" ? '<br><span class="small">sample</span>' : '') + '</td><td>' + esc(spBy(s.sp).name) + '</td><td class="r">' + esc(s.t) + '</td><td class="r">' + esc(s.w) + '×' + esc(s.l) + '</td><td class="r">' + fmt(bfOf(s), 0) + '</td><td>' + esc(s.loc) + '</td><td class="r">' + (m ? fmt(m.v, 1) + '%' : '–') + '</td><td>' + mPill(m) + '</td><td>' + sPill(s.status) + '</td><td class="r">' + days(s.date) + '</td></tr>';
    }).join("") || '<tr><td colspan="11">No slabs match.</td></tr>';
    $("r-ids").innerHTML = S.slabs.map(function (s) { return '<option value="' + esc(s.id) + '">'; }).join("");
    renderDetail();
  }
  ["j-filter", "j-sp", "j-st", "j-sort"].forEach(function (id) { $(id).addEventListener("input", renderLog); $(id).addEventListener("change", renderLog); });
  $("j-rows").addEventListener("click", function (e) {
    var tr = e.target.closest("[data-open]"); if (!tr) return;
    S.openId = S.openId === tr.getAttribute("data-open") ? null : tr.getAttribute("data-open");
    renderLog();
    if (S.openId) $("j-detail").scrollIntoView({ block: "nearest" });
  });

  function chartSVG(slab, rs) {
    var pts = rs.map(function (r) { var m = mcOf(slab, r); return m ? { d: r.date, v: m.v } : null; }).filter(Boolean);
    if (pts.length < 2) return '<p class="small">Two or more readings draw the drying curve.</p>';
    var W = 600, H = 190, l = 40, r = 12, t = 12, b = 26;
    var t0 = Math.min(new Date((slab.date || pts[0].d) + "T12:00:00").getTime(), new Date(pts[0].d + "T12:00:00").getTime()), t1 = new Date(pts[pts.length - 1].d + "T12:00:00").getTime();
    if (t1 <= t0) t0 = t1 - 864e5;
    var vmax = Math.max(30, Math.ceil(Math.max.apply(null, pts.map(function (p) { return p.v; })) / 10) * 10);
    var X = function (d) { return l + (new Date(d + "T12:00:00").getTime() - t0) / (t1 - t0) * (W - l - r); };
    var Y = function (v) { return t + (1 - v / vmax) * (H - t - b); };
    var grid = "", step = vmax > 60 ? 20 : 10;
    for (var g = 0; g <= vmax; g += step) grid += '<line class="grid" x1="' + l + '" x2="' + (W - r) + '" y1="' + Y(g) + '" y2="' + Y(g) + '"/><text x="' + (l - 6) + '" y="' + (Y(g) + 4) + '" text-anchor="end">' + g + '%</text>';
    var line = pts.map(function (p, i) { return (i ? "L" : "M") + X(p.d).toFixed(1) + " " + Y(p.v).toFixed(1); }).join(" ");
    var area = line + " L" + X(pts[pts.length - 1].d).toFixed(1) + " " + Y(0) + " L" + X(pts[0].d).toFixed(1) + " " + Y(0) + " Z";
    var tgt = S.settings.target;
    var last = pts[pts.length - 1];
    return '<div class="chart"><svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Moisture content over time for ' + esc(slab.id) + '">' + grid +
      '<line class="tg" x1="' + l + '" x2="' + (W - r) + '" y1="' + Y(tgt) + '" y2="' + Y(tgt) + '"/><text x="' + (W - r) + '" y="' + (Y(tgt) - 5) + '" text-anchor="end">target ' + tgt + '%</text>' +
      '<path class="ar" d="' + area + '"/><path class="ln" d="' + line + '"/>' +
      pts.map(function (p) { return '<circle class="pt" cx="' + X(p.d).toFixed(1) + '" cy="' + Y(p.v).toFixed(1) + '" r="' + (p === last ? 5 : 3) + '"/>'; }).join("") +
      '<text x="' + l + '" y="' + (H - 6) + '">' + esc(new Date(t0).toISOString().slice(0, 10)) + '</text><text x="' + (W - r) + '" y="' + (H - 6) + '" text-anchor="end">' + esc(last.d) + ' · ' + fmt(last.v, 1) + '%</text></svg></div>';
  }

  var confirmDel = false;
  function renderDetail() {
    var box = $("j-detail");
    var s = S.slabs.filter(function (x) { return x.id === S.openId; })[0];
    if (!s) { box.innerHTML = ""; return; }
    var sp = spBy(s.sp), L = latest(s), ph = photosOf(s.id), w = !!unlocked && !S.example;
    var od = (parseFloat(s.gw) > 0 && parseFloat(s.gmc) >= 0) ? fmt(parseFloat(s.gw) / (1 + parseFloat(s.gmc) / 100), 1) + " lb" : "—";
    var wtGreen = bfOf(s) / 12 * sp.greenD, wtDry = bfOf(s) / 12 * sp.dryD;
    var kv = [["Species", sp.name + " (" + sp.code + ")"], ["Tree / source", s.tree || "—"], ["Milled", (s.date || "—") + (s.date ? " · " + days(s.date) + " days" : "")], ["Size", s.t + "″ × " + s.w + "″ × " + s.l + "″"], ["Board feet", fmt(bfOf(s), 1)], ["Est. weight", fmt(wtGreen, 0) + " lb green · " + fmt(wtDry, 0) + " lb dry"], ["Location", s.loc || "—"], ["Grade · price", (s.grade || "—") + " · " + (s.price ? "$" + fmt(s.price, 0) : "—")], ["Green wt · MC", (s.gw || "—") + " lb · " + (s.gmc || "—") + "%"], ["Oven-dry est.", od], ["Latest MC", L.mc ? fmt(L.mc.v, 1) + "% (" + L.mc.src + ")" : "—"]];
    var rows = L.all.map(function (r) {
      var m = mcOf(s, r), rp = S.photos.filter(function (p) { return p.rid === r.rid; });
      return '<tr><td>' + esc(r.date) + '</td><td>' + esc(r.stage) + '</td><td>' + esc(r.who) + '</td><td class="r">' + esc(r.wt) + '</td><td class="r">' + esc(r.shell) + '</td><td class="r">' + esc(r.core) + '</td><td class="r">' + (m ? fmt(m.v, 1) + '%' : '–') + '</td><td>' + esc(r.cond) + (r.cond && r.notes ? ' · ' : '') + esc(r.notes) + (rp.length ? ' <span class="small">· ' + rp.length + ' photo' + (rp.length > 1 ? 's' : '') + '</span>' : '') + '</td><td>' + (w ? '<button type="button" class="ghost" data-delread="' + esc(r.rid) + '">Delete</button>' : '') + '</td></tr>';
    }).join("");
    box.innerHTML = '<div class="detail">' +
      '<div class="detail-head"><h3>' + esc(s.id) + '</h3><div>' + mPill(L.mc) + ' ' + sPill(s.status) + (/CITES Appendix/.test(sp.regs) ? ' <span class="pill p-green">CITES species</span>' : '') + '</div></div>' +
      '<div class="kv">' + kv.map(function (p) { return '<div><span>' + p[0] + '</span>' + esc(p[1]) + '</div>'; }).join("") + '</div>' +
      (s.notes ? '<p>' + esc(s.notes) + '</p>' : '') +
      chartSVG(s, L.all) +
      '<h4>Photos (' + ph.length + ')</h4>' +
      (ph.length ? '<div class="thumbs">' + ph.map(function (p, i) { return '<figure><button type="button" class="ph" data-lb="' + i + '" aria-label="Open photo ' + (i + 1) + '"><img alt="" src="' + photoURL(p) + '"></button>' + (w ? '<button type="button" class="ph-del" data-delph="' + esc(p.pid) + '" aria-label="Delete photo">✕</button>' : '') + '<figcaption>' + esc(p.date) + (p.caption ? ' · ' + esc(p.caption) : '') + '</figcaption></figure>'; }).join("") + '</div>' : '<p class="small">No photos yet.</p>') +
      (w ? '<label for="d-photos">Add photos to this slab<input id="d-photos" type="file" accept="image/*" multiple></label>' : '') +
      '<h4>Readings (' + L.all.length + ')</h4>' +
      '<div class="tbl"><table><thead><tr><th>Date</th><th>Stage</th><th>Who</th><th class="r">Wt lb</th><th class="r">Shell</th><th class="r">Core</th><th class="r">MC</th><th>Notes</th><th></th></tr></thead><tbody>' + (rows || '<tr><td colspan="9">No readings yet.</td></tr>') + '</tbody></table></div>' +
      '<div class="btns">' + (w ? '<button type="button" class="primary" data-act="log">Log a reading</button><button type="button" data-act="edit">Edit slab</button><button type="button" class="danger" data-act="del">Delete slab</button>' : (S.example ? '<span class="small">Example slab. Add your own slabs to start the log.</span>' : '<span class="small">Unlock to add readings, photos or edits.</span>')) +
      '<button type="button" class="ghost" data-act="close">Close</button>' +
      (confirmDel ? '<span><b class="flag">Delete ' + esc(s.id) + ' with its readings and photos?</b> <button type="button" class="danger" data-act="delyes">Yes, delete</button> <button type="button" data-act="delno">Keep it</button></span>' : '') +
      '</div><p class="msg" id="d-msg"></p></div>';
    var dp = $("d-photos");
    if (dp) dp.addEventListener("change", async function () {
      $("d-msg").textContent = "Adding photos…";
      var n = await addPhotos(dp.files, s.id, null, "");
      $("d-msg").textContent = n + " photo" + (n === 1 ? "" : "s") + " added.";
      renderLog();
    });
  }
  $("j-detail").addEventListener("click", async function (e) {
    var s = S.slabs.filter(function (x) { return x.id === S.openId; })[0]; if (!s) return;
    var lb = e.target.closest("[data-lb]"); if (lb) { openLightbox(photosOf(s.id), parseInt(lb.getAttribute("data-lb"), 10)); return; }
    var dp = e.target.closest("[data-delph]");
    if (dp && unlocked) { var pid = dp.getAttribute("data-delph"); await del("photos", pid); S.photos = S.photos.filter(function (p) { return p.pid !== pid; }); renderLog(); return; }
    var dr = e.target.closest("[data-delread]");
    if (dr && unlocked) {
      var rid = dr.getAttribute("data-delread"); await del("reads", rid);
      S.reads = S.reads.filter(function (r) { return r.rid !== rid; });
      var rp = S.photos.filter(function (p) { return p.rid === rid; });
      for (var i = 0; i < rp.length; i++) { rp[i].rid = null; await put("photos", rp[i]); }
      renderLog(); return;
    }
    var a = e.target.closest("[data-act]"); if (!a) return;
    var act = a.getAttribute("data-act");
    if (act === "close") { S.openId = null; confirmDel = false; renderLog(); }
    if (!unlocked) return;
    if (act === "log") { showTab("read"); $("r-id").value = s.id; $("r-wt").focus(); }
    if (act === "edit") startEdit(s);
    if (act === "del") { confirmDel = true; renderDetail(); }
    if (act === "delno") { confirmDel = false; renderDetail(); }
    if (act === "delyes") {
      confirmDel = false;
      var id = s.id;
      await del("slabs", id);
      var rs = S.reads.filter(function (r) { return r.id === id; }), ps = S.photos.filter(function (p) { return p.slabId === id; });
      for (var j = 0; j < rs.length; j++) await del("reads", rs[j].rid);
      for (var k = 0; k < ps.length; k++) await del("photos", ps[k].pid);
      S.slabs = S.slabs.filter(function (x) { return x.id !== id; }); S.reads = S.reads.filter(function (r) { return r.id !== id; }); S.photos = S.photos.filter(function (p) { return p.slabId !== id; });
      S.openId = null; renderLog();
    }
  });

  /* photos */
  function shrinkImage(file) {
    return new Promise(function (res) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var max = 1600, sc = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
        var c = document.createElement("canvas"); c.width = Math.round(img.naturalWidth * sc); c.height = Math.round(img.naturalHeight * sc);
        c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { res(b || file); }, "image/jpeg", 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(url); res(null); };
      img.src = url;
    });
  }
  async function addPhotos(files, slabId, rid, caption) {
    var n = 0;
    for (var i = 0; i < (files ? files.length : 0); i++) {
      var blob = await shrinkImage(files[i]); if (!blob) continue;
      var p = { pid: uid("p"), slabId: slabId, rid: rid, date: today(), caption: caption || "", blob: blob };
      await put("photos", p); S.photos.push(p); n++;
    }
    return n;
  }

  /* lightbox */
  var LB = { list: [], i: 0 };
  function openLightbox(list, i) { LB.list = list; LB.i = i; showLB(); $("lightbox").hidden = false; $("lb-close").focus(); }
  function showLB() { var p = LB.list[LB.i]; if (!p) return; $("lb-img").src = photoURL(p); $("lb-img").alt = "Photo of " + p.slabId; $("lb-cap").textContent = p.slabId + " · " + p.date + " · " + (LB.i + 1) + "/" + LB.list.length; }
  $("lb-close").addEventListener("click", function () { $("lightbox").hidden = true; });
  $("lb-prev").addEventListener("click", function () { LB.i = (LB.i - 1 + LB.list.length) % LB.list.length; showLB(); });
  $("lb-next").addEventListener("click", function () { LB.i = (LB.i + 1) % LB.list.length; showLB(); });
  document.addEventListener("keydown", function (e) {
    if ($("lightbox").hidden) return;
    if (e.key === "Escape") $("lightbox").hidden = true;
    if (e.key === "ArrowLeft") $("lb-prev").click();
    if (e.key === "ArrowRight") $("lb-next").click();
  });

  /* add / edit slab */
  var editing = null, idTouched = false;
  function genId() {
    if (editing || idTouched) return;
    $("s-id").value = $("s-sp").value + pad(parseInt($("s-treeno").value, 10) || 1) + "-" + ($("s-log").value || "A").toUpperCase() + "-" + pad(parseInt($("s-no").value, 10) || 1);
  }
  ["s-sp", "s-treeno", "s-log", "s-no"].forEach(function (id) { $(id).addEventListener("input", genId); $(id).addEventListener("change", genId); });
  $("s-id").addEventListener("input", function () { idTouched = !!$("s-id").value; });
  $("s-sp").value = "EP"; $("s-date").value = today(); $("r-date").value = today(); genId();

  var FIELDS = { sp: "s-sp", tree: "s-tree", date: "s-date", t: "s-t", w: "s-w", l: "s-l", loc: "s-loc", gw: "s-gw", gmc: "s-gmc", sample: "s-sample", grade: "s-grade", status: "s-status", price: "s-price", notes: "s-notes" };
  function startEdit(s) {
    editing = s.id;
    Object.keys(FIELDS).forEach(function (k) { $(FIELDS[k]).value = s[k] == null ? "" : s[k]; });
    $("s-id").value = s.id; $("s-id").readOnly = true;
    $("s-title").textContent = "Edit " + s.id; $("s-save").textContent = "Save changes"; $("s-cancel").hidden = false; $("s-msg").textContent = "";
    showTab("add");
  }
  function endEdit() {
    editing = null; idTouched = false; $("s-id").readOnly = false;
    $("s-title").textContent = "Add slab"; $("s-save").textContent = "Save slab"; $("s-cancel").hidden = true;
    ["s-w", "s-gw", "s-gmc", "s-notes", "s-price"].forEach(function (id) { $(id).value = ""; });
    $("s-grade").value = ""; $("s-status").value = "In yard"; $("s-sample").value = "no";
    genId();
  }
  $("s-cancel").addEventListener("click", function () { endEdit(); showTab("inv"); });
  $("f-slab").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!unlocked) { $("s-msg").textContent = "Unlock the log first."; return; }
    await dropExamples();
    var o = { id: $("s-id").value };
    Object.keys(FIELDS).forEach(function (k) { o[k] = $(FIELDS[k]).value; });
    var s = normSlab(o);
    if (!s.id) { $("s-msg").textContent = "Enter a slab ID."; return; }
    if (!editing && S.slabs.some(function (x) { return x.id === s.id; })) { $("s-msg").textContent = s.id + " already exists. Change the slab number, or open it and choose Edit."; return; }
    await put("slabs", s);
    var i = S.slabs.findIndex(function (x) { return x.id === s.id; });
    if (i >= 0) S.slabs[i] = s; else S.slabs.push(s);
    var n = await addPhotos($("s-photos").files, s.id, null, "At milling");
    $("s-photos").value = "";
    $("s-msg").textContent = (editing ? "Updated " : "Saved ") + s.id + (n ? " with " + n + " photo" + (n > 1 ? "s" : "") : "") + ".";
    if (editing) { endEdit(); S.openId = s.id; showTab("inv"); }
    else { idTouched = false; $("s-no").value = (parseInt($("s-no").value, 10) || 0) + 1; ["s-w", "s-gw", "s-notes", "s-price"].forEach(function (id) { $(id).value = ""; }); genId(); $("s-w").focus(); }
    renderLog();
  });

  /* reading */
  $("f-read").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!unlocked) { $("r-msg").textContent = "Unlock the log first."; return; }
    if (S.example) { $("r-msg").textContent = "Add your own slab first. Example slabs can't take readings."; return; }
    var id = $("r-id").value.trim().toUpperCase();
    var s = S.slabs.filter(function (x) { return x.id === id; })[0];
    if (!s) { $("r-msg").textContent = id + " isn't in the log. Add the slab first."; return; }
    var r = { rid: uid("r"), id: id, date: $("r-date").value, stage: $("r-stage").value, who: $("r-who").value.trim(), wt: $("r-wt").value, shell: $("r-shell").value, core: $("r-core").value, cond: $("r-cond").value.trim(), notes: $("r-notes").value.trim() };
    var files = $("r-photos").files;
    if (!r.wt && !r.shell && !r.core && !r.notes && !(files && files.length)) { $("r-msg").textContent = "Enter a weight, a meter reading, a note or a photo."; return; }
    await put("reads", r); S.reads.push(r);
    var n = await addPhotos(files, id, r.rid, r.stage + (r.notes ? ": " + r.notes : ""));
    $("r-photos").value = "";
    var m = mcOf(s, r);
    $("r-msg").textContent = "Saved for " + id + (m ? " · MC " + fmt(m.v, 1) + "% (" + m.src + ")" : "") + (n ? " · " + n + " photo" + (n > 1 ? "s" : "") : "") + ".";
    ["r-id", "r-wt", "r-shell", "r-core", "r-notes"].forEach(function (x) { $(x).value = ""; });
    $("r-id").focus();
    renderLog();
  });

  /* settings */
  $("f-settings").addEventListener("submit", async function (e) {
    e.preventDefault();
    if (!unlocked) return;
    var t = parseFloat($("set-target").value); if (t >= 4 && t <= 15) S.settings.target = t;
    var pw = $("set-pw").value; if (pw) { S.settings.pwh = hash(pw); $("set-pw").value = ""; }
    await saveSettings();
    $("set-msg").textContent = "Settings saved" + (pw ? ". New password is active on this device." : ".");
    renderLog();
  });
  $("x-clear").addEventListener("click", function () { if (unlocked) $("x-confirm").hidden = false; });
  $("x-no").addEventListener("click", function () { $("x-confirm").hidden = true; });
  $("x-yes").addEventListener("click", async function () {
    await clearAll(); S.slabs = []; S.reads = []; S.photos = []; S.openId = null; S.example = false;
    $("x-confirm").hidden = true; $("set-msg").textContent = "All log data deleted on this device."; renderLog();
  });

  /* ================= export / import ================= */
  var SCOLS = ["id", "sp", "tree", "date", "t", "w", "l", "loc", "gw", "gmc", "sample", "grade", "status", "price", "notes"];
  var SHEAD = ["slab_id", "species_code", "tree", "date_milled", "thickness_in", "width_in", "length_in", "location", "green_weight_lb", "green_mc_pct", "sample_slab", "grade", "status", "price_usd", "notes"];
  var RCOLS = ["id", "date", "stage", "who", "wt", "shell", "core", "cond", "notes"];
  var RHEAD = ["slab_id", "date", "stage", "who", "weight_lb", "meter_shell_pct", "meter_core_pct", "conditions", "notes"];
  var cell = function (v) { v = String(v == null ? "" : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  function toCSV(rows, cols, head, extra) {
    return [head.concat(extra ? extra.head : []).join(",")].concat(rows.map(function (r) { return cols.map(function (c) { return cell(r[c]); }).concat(extra ? extra.row(r).map(cell) : []).join(","); })).join("\n");
  }
  var slabsCSV = function () { return toCSV(S.example ? [] : S.slabs, SCOLS, SHEAD, { head: ["species", "board_feet", "latest_mc_pct"], row: function (s) { var L = latest(s); return [spBy(s.sp).name, bfOf(s).toFixed(1), L.mc ? L.mc.v.toFixed(1) : ""]; } }); };
  var readsCSV = function () { return toCSV(S.example ? [] : S.reads, RCOLS, RHEAD); };
  function parseCSV(text) {
    var rows = [], row = [], f = "", q = false;
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (q) { if (ch === '"') { if (text[i + 1] === '"') { f += '"'; i++; } else q = false; } else f += ch; }
      else if (ch === '"') q = true;
      else if (ch === ",") { row.push(f); f = ""; }
      else if (ch === "\n" || ch === "\r") { if (ch === "\r" && text[i + 1] === "\n") i++; row.push(f); rows.push(row); row = []; f = ""; }
      else f += ch;
    }
    if (f !== "" || row.length) { row.push(f); rows.push(row); }
    return rows.filter(function (r) { return r.some(function (c) { return c.trim() !== ""; }); });
  }
  async function importCSV(text) {
    var rows = parseCSV(text.trim());
    if (rows.length < 2) return "Nothing to import. Include the header row.";
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    var isS = head.indexOf("date_milled") >= 0, isR = head.indexOf("weight_lb") >= 0;
    if (!isS && !isR) return "Header not recognized. Use the columns from a slabs.csv or readings.csv export.";
    await dropExamples();
    var H = isS ? SHEAD : RHEAD, C = isS ? SCOLS : RCOLS, n = 0;
    for (var x = 1; x < rows.length; x++) {
      var r = rows[x], o = {};
      H.forEach(function (h, k) { var ix = head.indexOf(h); o[C[k]] = ix >= 0 ? (r[ix] || "").trim() : ""; });
      if (!o.id) continue;
      o.id = o.id.toUpperCase();
      if (isS) {
        var s = normSlab(o); await put("slabs", s);
        var i = S.slabs.findIndex(function (z) { return z.id === s.id; }); if (i >= 0) S.slabs[i] = s; else S.slabs.push(s);
      } else {
        if (!S.slabs.some(function (z) { return z.id === o.id; })) { var ns = normSlab({ id: o.id, date: o.date, notes: "Added from readings import" }); await put("slabs", ns); S.slabs.push(ns); }
        var dup = S.reads.some(function (z) { return RCOLS.every(function (c) { return String(z[c]) === String(o[c]); }); });
        if (!dup) { o.rid = uid("r"); await put("reads", o); S.reads.push(o); }
      }
      n++;
    }
    renderLog();
    return "Imported " + n + (isS ? " slabs." : " readings.");
  }
  function blobToDataURL(b) { return new Promise(function (res) { var fr = new FileReader(); fr.onload = function () { res(fr.result); }; fr.readAsDataURL(b); }); }
  function dataURLToBlob(u) {
    var parts = u.split(","), mime = (parts[0].match(/:(.*?);/) || [])[1] || "image/jpeg", bin = atob(parts[1]), arr = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return new Blob([arr], { type: mime });
  }
  async function makeBackup() {
    var parts = ['{"app":"slabyard","version":1,"exported":' + JSON.stringify(new Date().toISOString()) + ',"settings":' + JSON.stringify({ target: S.settings.target }) + ',"slabs":' + JSON.stringify(S.slabs) + ',"reads":' + JSON.stringify(S.reads) + ',"photos":['];
    for (var i = 0; i < S.photos.length; i++) {
      var p = S.photos[i];
      parts.push((i ? "," : "") + JSON.stringify({ pid: p.pid, slabId: p.slabId, rid: p.rid, date: p.date, caption: p.caption, data: await blobToDataURL(p.blob) }));
    }
    parts.push("]}");
    return new Blob(parts, { type: "application/json" });
  }
  async function importBackup(text) {
    var d; try { d = JSON.parse(text); } catch (e) { return "That file isn't a valid backup."; }
    if (!d || d.app !== "slabyard") return "That file isn't a Slabyard backup.";
    await dropExamples();
    var ns = 0, nr = 0, np = 0;
    for (var i = 0; i < (d.slabs || []).length; i++) { var s = normSlab(d.slabs[i]); await put("slabs", s); var ix = S.slabs.findIndex(function (z) { return z.id === s.id; }); if (ix >= 0) S.slabs[ix] = s; else S.slabs.push(s); ns++; }
    for (var j = 0; j < (d.reads || []).length; j++) { var r = d.reads[j]; if (!r.rid || S.reads.some(function (z) { return z.rid === r.rid; })) continue; await put("reads", r); S.reads.push(r); nr++; }
    for (var k = 0; k < (d.photos || []).length; k++) {
      var p = d.photos[k]; if (!p.pid || !p.data || S.photos.some(function (z) { return z.pid === p.pid; })) continue;
      var rec = { pid: p.pid, slabId: p.slabId, rid: p.rid || null, date: p.date, caption: p.caption || "", blob: dataURLToBlob(p.data) };
      await put("photos", rec); S.photos.push(rec); np++;
    }
    renderLog();
    return "Merged " + ns + " slabs, " + nr + " new readings, " + np + " new photos.";
  }

  var dl = null;
  async function saveFile(name, data) {
    try {
      if (window.claude && typeof window.claude.use === "function") {
        if (!dl) dl = await window.claude.use("downloads");
        if (dl) { await dl.save({ filename: name, data: data }); $("x-msg").textContent = "Saved " + name + "."; return; }
      }
    } catch (e) {
      if (e && e.code === "declined") { $("x-msg").textContent = "Save cancelled."; return; }
    }
    try {
      var blob = data instanceof Blob ? data : new Blob([data], { type: "text/plain" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 4000);
      $("x-msg").textContent = "Saving " + name + ". If nothing downloads here, use the Copy buttons.";
    } catch (e2) { $("x-msg").textContent = "Saving files isn't available here. Use the Copy buttons."; }
  }
  function copy(text, label) {
    $("x-text").value = text;
    var fail = function () { $("x-text").focus(); $("x-text").select(); $("x-msg").textContent = label + " is in the box below and selected. Copy it with Ctrl+C / Cmd+C."; };
    try { navigator.clipboard.writeText(text).then(function () { $("x-msg").textContent = label + " copied. Paste into a spreadsheet."; }, fail); } catch (e) { fail(); }
  }
  var stamp = function () { return today(); };
  $("x-backup").addEventListener("click", async function () {
    if (S.example) { $("x-msg").textContent = "Nothing to back up yet. Add your first slab."; return; }
    $("x-msg").textContent = "Preparing backup…";
    saveFile("slabyard-backup-" + stamp() + ".json", await makeBackup());
  });
  $("x-dl-slabs").addEventListener("click", function () { saveFile("slabs-" + stamp() + ".csv", slabsCSV()); });
  $("x-dl-reads").addEventListener("click", function () { saveFile("readings-" + stamp() + ".csv", readsCSV()); });
  $("x-copy-slabs").addEventListener("click", function () { copy(slabsCSV(), "Slabs CSV"); });
  $("x-copy-reads").addEventListener("click", function () { copy(readsCSV(), "Readings CSV"); });
  $("x-import").addEventListener("click", async function () { if (!unlocked) return; $("x-msg").textContent = await importCSV($("x-text").value); });
  $("x-restore").addEventListener("change", function (e) {
    var f = e.target.files && e.target.files[0]; if (!f) return;
    if (!unlocked) { $("x-msg").textContent = "Unlock the log to import."; e.target.value = ""; return; }
    var rd = new FileReader();
    rd.onload = async function () {
      var t = String(rd.result);
      $("x-msg").textContent = /^\s*\{/.test(t) ? await importBackup(t) : await importCSV(t);
      e.target.value = "";
    };
    rd.readAsText(f);
  });

  /* ================= boot ================= */
  $("set-target").value = S.settings.target;
  route();
  loadAll().then(function () { $("set-target").value = S.settings.target; });
})();
