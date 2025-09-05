(function () {
  const ds    = document.currentScript.dataset || {};
  const theme = (ds.theme || "dark").toLowerCase();   // dark | light
  const align = (ds.align || "center").toLowerCase(); // left | center | right
  const token = ds.token || "default";
  const host  = "https://inspoquotes.net";

  const PALETTE = {
    dark:  { bg:"#111827", fg:"#f9fafb", sub:"#cbd5e1", link:"#93c5fd",
             border:"none", shadow:"0 18px 40px rgba(0,0,0,.35)",
             btnBg:"#1f2937", btnBgHover:"#273244", btnBorder:"#334155", btnText:"#93c5fd" },
    light: { bg:"#ffffff", fg:"#111827", sub:"#4b5563", link:"#2563eb",
             border:"1px solid #e5e7eb", shadow:"0 18px 40px rgba(17,24,39,.10)",
             btnBg:"#eaf2ff", btnBgHover:"#dbeafe", btnBorder:"#bfdbfe", btnText:"#1d4ed8" }
  };
  const C = PALETTE[theme] || PALETTE.dark;

  const box = document.createElement("div");
  Object.assign(box.style, {
    fontFamily:"Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    maxWidth:"520px",
    margin: align==="center" ? "0 auto" : (align==="right" ? "0 0 0 auto" : "0"),
    padding:"16px 18px",
    borderRadius:"20px",
    background:C.bg, color:C.fg, border:C.border, boxShadow:C.shadow
  });

  const qEl = document.createElement("div");
  Object.assign(qEl.style, {
    fontSize:"18px", lineHeight:"1.55", fontWeight:"700",
    marginBottom:"10px", wordBreak:"break-word", hyphens:"auto",
    maxWidth:"60ch", textWrap:"balance"
  });

  const aEl = document.createElement("div");
  Object.assign(aEl.style, { color:C.sub, marginBottom:"14px", fontWeight:"600" });

  const link = document.createElement("a");
  link.target = "_blank"; link.rel = "noopener";
  Object.assign(link.style, {
    display:"none", fontSize:"13px", fontWeight:"700", textDecoration:"none",
    padding:"8px 12px", borderRadius:"10px", background:C.btnBg, color:C.btnText,
    border:`1px solid ${C.btnBorder}`, transition:"background .2s, transform .05s"
  });
  const ico = document.createElement("span"); ico.textContent = "\uD83D\uDD17 ";
  link.appendChild(ico); link.appendChild(document.createTextNode("Read more at InspoQuotes"));
  link.onmouseenter = () => { link.style.background = C.btnBgHover; };
  link.onmouseleave = () => { link.style.background = C.btnBg; };
  link.onmousedown  = () => { link.style.transform  = "translateY(1px)"; };
  link.onmouseup    = () => { link.style.transform  = "none"; };

  box.appendChild(qEl); box.appendChild(aEl); box.appendChild(link);
  const mountId = ds.target;
  if (mountId && document.getElementById(mountId)) {
    document.getElementById(mountId).appendChild(box);
  } else if (document.currentScript && document.currentScript.parentNode) {
    document.currentScript.parentNode.insertBefore(box, document.currentScript);
  } else {
    document.body.appendChild(box);
  }

  const FALLBACK_TIMEOUT_MS = 3500;
  const PROMO_URL_BASE = host + "/";
  function withUtm(u){const sep=u.includes("?")?"&":"?";return u+sep+"utm_source=embed&utm_medium=fallback&utm_campaign="+encodeURIComponent(token);}
  function renderPromo(){
    const goto = withUtm(PROMO_URL_BASE);
    qEl.textContent = "Discover daily quotes on InspoQuotes";
    aEl.textContent = "Fresh, serious, culturally diverse quotes — updated daily.";
    link.href = host + "/api/embed_click.php"
      + "?token=" + encodeURIComponent(token)
      + "&quote_id=0&goto=" + encodeURIComponent(goto);
    link.style.display = "inline-block";
  }

  const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;
  const to = setTimeout(() => { try { ctrl?.abort(); } catch(_){} }, FALLBACK_TIMEOUT_MS);

  fetch(host + "/api/daily-embed.php?token=" + encodeURIComponent(token) + "&_=" + Date.now(),
        { cache:"no-store", signal: ctrl?.signal })
  .then(async (r) => {
    clearTimeout(to);
    let data=null; try{ data=await r.json(); }catch(e){}
    if (!r.ok || !data || typeof data!=="object" || data.error) { renderPromo(); return; }

    const quoteTxt  = (typeof data.quote==="string"  && data.quote.trim()) ? data.quote.trim() : null;
    const authorTxt = (typeof data.author==="string" && data.author.trim())? data.author.trim(): "Unknown";
    if (!quoteTxt) { renderPromo(); return; }

    qEl.textContent = "\u201C" + quoteTxt + "\u201D";
    aEl.textContent = "\u2014 " + authorTxt;

    const baseUrl = (data.link || (host + "/"));
    const goto = baseUrl + (baseUrl.includes("?") ? "&" : "?")
               + "utm_source=embed&utm_medium=partner&utm_campaign=" + encodeURIComponent(token);

    const clickUrl = host + "/api/embed_click.php"
      + "?token=" + encodeURIComponent(token)
      + "&quote_id=" + encodeURIComponent(data.quote_id || 0)
      + "&goto=" + encodeURIComponent(goto);

    link.href = clickUrl;
    link.style.display = "inline-block";
  }).catch(() => { renderPromo(); });
})();
