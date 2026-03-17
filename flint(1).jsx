import { useState, useEffect, useRef } from "react";

// ─── FLINT MARK ───────────────────────────────────────────────────────────────
function FlintMark({ size = 28, glow = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none"
      style={glow ? { filter: "drop-shadow(0 0 10px #FF4D1C66)" } : {}}>
      <circle cx="60" cy="60" r="56" stroke="#252018" strokeWidth="1" />
      <path d="M38 78 L44 48 L56 52 L52 38 L72 44 L78 58 L68 56 L76 78 Z"
        fill="#1A1710" stroke="#2A2418" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M30 86 L52 56" stroke="#FF4D1C" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M30 86 L52 56" stroke="#FF6B3C" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      <g transform="translate(51,57)">
        <circle cx="0" cy="0" r="2.5" fill="#FF4D1C" />
        <circle cx="0" cy="0" r="1.5" fill="#FFD600" />
        <circle cx="0" cy="0" r="0.7" fill="white" />
        <line x1="0" y1="0" x2="14" y2="-10" stroke="#FF4D1C" strokeWidth="1.4" strokeLinecap="round" opacity="0.9" />
        <line x1="0" y1="0" x2="18" y2="-3" stroke="#FF6B3C" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        <line x1="0" y1="0" x2="16" y2="-16" stroke="#FFD600" strokeWidth="0.9" strokeLinecap="round" opacity="0.8" />
        <line x1="0" y1="0" x2="8" y2="-18" stroke="#FF4D1C" strokeWidth="0.7" strokeLinecap="round" opacity="0.6" />
        <line x1="0" y1="0" x2="20" y2="-8" stroke="#FF8C00" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
        <circle cx="13" cy="-12" r="1" fill="#FFD600" opacity="0.75" />
        <circle cx="17" cy="-6" r="0.8" fill="#FF4D1C" opacity="0.6" />
        <circle cx="9" cy="-16" r="0.7" fill="#FFD600" opacity="0.5" />
      </g>
    </svg>
  );
}

// ─── STORAGE ──────────────────────────────────────────────────────────────────
const K = { streak: "fl-streak", lastday: "fl-lastday", focus: "fl-focus", resisted: "fl-resisted" };
function stor(k) { try { return localStorage.getItem(k); } catch { return null; } }
function storSet(k, v) { try { localStorage.setItem(k, String(v)); } catch {} }
function pad(n) { return String(n).padStart(2, "0"); }
function todayStr() { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }

// ─── DATA ─────────────────────────────────────────────────────────────────────
const GOAL_CATEGORIES = [
  { id:"health",    icon:"💪", name:"Health & Fitness",      color:"#43E97B", desc:"Exercise, nutrition, sleep, wellness",     examples:["Run 5K three times a week","Meditate 10 min daily","Cut out processed sugar","Sleep 8 hours consistently"] },
  { id:"finance",   icon:"💰", name:"Financial Freedom",     color:"#FFD600", desc:"Savings, debt, investing, income",          examples:["Build 6-month emergency fund","Pay off credit card","Invest 20% of income","Start a side income stream"] },
  { id:"career",    icon:"🚀", name:"Career & Skills",       color:"#FF4D1C", desc:"Promotions, learning, entrepreneurship",    examples:["Get promoted to senior role","Launch personal project","Learn a programming language","Build your network"] },
  { id:"mind",      icon:"🧠", name:"Mind & Learning",       color:"#B47FFF", desc:"Reading, education, creativity",            examples:["Read 24 books this year","Learn a new language","Take an online course","Journal daily"] },
  { id:"relations", icon:"❤️", name:"Relationships",         color:"#FF6B6B", desc:"Family, friendships, romance, community",   examples:["Weekly date night","Call parents every Sunday","Make 3 close friends","Volunteer monthly"] },
  { id:"purpose",   icon:"🌱", name:"Purpose & Impact",      color:"#00E5CC", desc:"Values, legacy, spirituality, giving",      examples:["Define personal mission","Start a community initiative","Reduce carbon footprint","Practice gratitude daily"] },
  { id:"lifestyle", icon:"✈️", name:"Lifestyle & Adventure", color:"#F7971E", desc:"Travel, hobbies, experiences, creativity",  examples:["Visit 3 new countries","Learn to cook 10 dishes","Take up a creative hobby","Live abroad for 1 month"] },
  { id:"digital",   icon:"📵", name:"Digital Wellness",      color:"#ee0979", desc:"Screen time, social media, focus, privacy", examples:["No phone first 30 min","Delete doom-scroll apps","1 hour deep work daily","Digital detox weekends"] },
];

const RESISTANCE_TIPS = [
  { title:"Surf the urge",        body:"This craving peaks and fades within 15–20 minutes. Watch it rise and fall without acting.",                       action:"Breathe with me" },
  { title:"Name it to tame it",   body:"Say out loud: 'I notice I am feeling the urge to...' Naming it weakens its grip immediately.",                    action:"I named it" },
  { title:"Your future self",     body:"Picture yourself tomorrow morning — proud. Your future self is cheering you on right now.",                       action:"I see them" },
  { title:"10-minute rule",       body:"Wait just 10 minutes before deciding. Most urges fade. And if they don't, you've already won.",                   action:"Starting timer" },
  { title:"Replace, don't erase", body:"Redirect the impulse. Do 10 push-ups, drink water, text a friend. Give your brain movement instead.",            action:"I'll redirect" },
  { title:"Remember your why",    body:"You set these goals for a reason stronger than this moment. This temptation wants to trade your future for seconds of relief.", action:"I remember" },
];

const TEMPTATIONS = [
  { id:"junkfood",   icon:"🍔", label:"Junk food craving",    category:"health" },
  { id:"scrolling",  icon:"📱", label:"Mindless scrolling",   category:"digital" },
  { id:"spending",   icon:"💳", label:"Impulse spending",     category:"finance" },
  { id:"skipping",   icon:"🛋️", label:"Skipping the gym",    category:"health" },
  { id:"smoking",    icon:"🚬", label:"Cigarette / nicotine", category:"health" },
  { id:"alcohol",    icon:"🍺", label:"Alcohol urge",         category:"health" },
  { id:"procrastin", icon:"⏰", label:"Procrastinating",      category:"career" },
  { id:"latenight",  icon:"🌙", label:"Staying up late",      category:"health" },
  { id:"gambling",   icon:"🎰", label:"Gambling urge",        category:"finance" },
  { id:"custom",     icon:"⚡", label:"Something else…",      category:null },
];

const MOTIVATIONAL = [
  "Strike a spark. Keep the flame.", "One task at a time.", "Done beats perfect.",
  "Make it happen.", "Flint-hard. Every day.", "Small sparks compound.",
  "You are what you repeatedly do.", "The obstacle is the way.",
];

// ─── NOTIFICATIONS HOOK ───────────────────────────────────────────────────────
function useNotifications(streak, focusTask) {
  const [permission, setPermission] = useState(typeof Notification !== "undefined" ? Notification.permission : "denied");
  const [settings, setSettings] = useState({
    morning:      { enabled: true, time: "08:00" },
    midday:       { enabled: true, time: "12:30" },
    evening:      { enabled: true, time: "20:00" },
    streakDanger: { enabled: true, time: "18:00" },
    focusRemind:  { enabled: true, intervalMins: 120 },
    shield:       { enabled: true, intervalHours: 6 },
  });
  const timers = useRef([]);
  const permRef = useRef(permission);
  useEffect(() => { permRef.current = permission; }, [permission]);

  async function requestPermission() {
    if (typeof Notification === "undefined") return "denied";
    const r = await Notification.requestPermission(); setPermission(r); return r;
  }
  function sendNotif(tpl) {
    if (permRef.current === "granted" && typeof Notification !== "undefined") {
      try { new Notification(tpl.title, { body: tpl.body }); } catch {}
    }
  }
  function msUntil(t) {
    const [h, m] = t.split(":").map(Number), now = new Date(), d = new Date(now);
    d.setHours(h, m, 0, 0); if (d <= now) d.setDate(d.getDate() + 1); return d - now;
  }
  useEffect(() => {
    timers.current.forEach(id => { clearTimeout(id); clearInterval(id); }); timers.current = [];
    if (permission !== "granted") return;
    const s = settings;
    const sched = (key, build) => {
      if (!s[key]?.enabled || !s[key]?.time) return;
      const t = setTimeout(() => {
        sendNotif(build());
        const i = setInterval(() => { sendNotif(build()); }, 86400000);
        timers.current.push(i);
      }, msUntil(s[key].time));
      timers.current.push(t);
    };
    sched("morning",      () => ({ title: "☀️ Good morning — FLINT", body: streak > 1 ? `Day ${streak} streak. Set your spark for today.` : "A new day. Strike your spark." }));
    sched("midday",       () => ({ title: "⚡ Midday check — FLINT", body: "Half the day gone — what can you ignite?" }));
    sched("evening",      () => ({ title: "🌙 Evening check-in — FLINT", body: "Take 2 minutes to log your progress." }));
    if (streak > 0) sched("streakDanger", () => ({ title: "🔥 Don't let the flame die!", body: `Your ${streak}-day streak needs a spark today.` }));
    if (s.focusRemind?.enabled && focusTask) {
      const ft = (focusTask?.text || "").slice(0, 50);
      const i = setInterval(() => { sendNotif({ title: "🎯 Focus task waiting", body: `"${ft}" — ready when you are.` }); }, (s.focusRemind.intervalMins || 120) * 60000);
      timers.current.push(i);
    }
    if (s.shield?.enabled) {
      const i = setInterval(() => { sendNotif({ title: "🛡 Temptation Guard — FLINT", body: "Feeling a pull? Your Shield is one tap away." }); }, (s.shield.intervalHours || 6) * 3600000);
      timers.current.push(i);
    }
    return () => { timers.current.forEach(id => { clearTimeout(id); clearInterval(id); }); timers.current = []; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permission, settings, streak, focusTask]);

  return { permission, requestPermission, settings, setSettings, sendNotif };
}

// ─── UTILS ────────────────────────────────────────────────────────────────────
function spawnConfetti(x, y, count = 24, colors) {
  const c = colors || ["#FF4D1C","#FFD600","#00E5CC","#B47FFF","#FF6B6B","#43E97B","#F7971E"];
  const root = document.getElementById("cr"); if (!root) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    const col = c[i % c.length], a = Math.random() * 360, d = 70 + Math.random() * 120, s = 3 + Math.random() * 6;
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${s}px;height:${s}px;background:${col};border-radius:${Math.random() > .5 ? "50%" : "2px"};pointer-events:none;z-index:9999;transform:translate(-50%,-50%);animation:cfly 0.9s ease-out forwards;--dx:${Math.cos(a * Math.PI / 180) * d}px;--dy:${Math.sin(a * Math.PI / 180) * d}px;`;
    root.appendChild(el); setTimeout(() => el.remove(), 1000);
  }
}
function useTicker() { const [t, s] = useState(new Date()); useEffect(() => { const id = setInterval(() => s(new Date()), 1000); return () => clearInterval(id); }, []); return t; }
function Ring({ pct, color, size = 56, stroke = 3 }) {
  const r = (size - stroke * 2) / 2, circ = 2 * Math.PI * r, off = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1C1814" strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={off}
        style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)", strokeLinecap: "round" }} />
    </svg>
  );
}

// ─── TOAST ────────────────────────────────────────────────────────────────────
function ToastStack({ toasts, onDismiss }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", bottom: 28, right: 28, zIndex: 8000, display: "flex", flexDirection: "column", gap: 10, maxWidth: 340 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: "linear-gradient(135deg,#1A1610,#141008)",
          border: `1px solid ${t.color || "#FF4D1C"}22`,
          borderLeft: `3px solid ${t.color || "#FF4D1C"}`,
          borderRadius: 12, padding: "14px 16px",
          display: "flex", gap: 12, alignItems: "flex-start",
          animation: "toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: `0 12px 40px rgba(0,0,0,0.8), 0 0 0 1px ${t.color || "#FF4D1C"}0A`,
        }}>
          <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{t.icon || "🔔"}</span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: t.color || "#E8E2D6", letterSpacing: "0.04em", marginBottom: 3 }}>{t.title}</div>
            <div style={{ fontSize: 10, color: "#4A4540", lineHeight: 1.5 }}>{t.body}</div>
          </div>
          <button onClick={() => onDismiss(t.id)} style={{ background: "none", border: "none", color: "#2E2A24", cursor: "pointer", fontSize: 16, lineHeight: 1, flexShrink: 0 }}>×</button>
        </div>
      ))}
    </div>
  );
}

// ─── TEMPTATION SHIELD ────────────────────────────────────────────────────────
function TemptationShield({ onResisted, onClose }) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [tipIdx, setTipIdx] = useState(0);
  const [breath, setBreath] = useState("inhale");
  const [secs, setSecs] = useState(4);
  const timer = useRef(null);
  const tip = RESISTANCE_TIPS[tipIdx];

  useEffect(() => {
    if (step !== 1) return;
    const phases = [{ l: "inhale", d: 4 }, { l: "hold", d: 4 }, { l: "exhale", d: 6 }, { l: "hold", d: 2 }];
    let pi = 0, rem = phases[0].d;
    setBreath(phases[0].l); setSecs(phases[0].d);
    timer.current = setInterval(() => {
      rem--; setSecs(rem);
      if (rem <= 0) { pi = (pi + 1) % phases.length; rem = phases[pi].d; setBreath(phases[pi].l); setSecs(phases[pi].d); }
    }, 1000);
    return () => clearInterval(timer.current);
  }, [step]);

  const bc = { inhale: "#00E5CC", hold: "#FFD600", exhale: "#B47FFF" }[breath] || "#00E5CC";

  function next() {
    if (step === 0 && selected) setStep(1);
    else if (step === 1) { clearInterval(timer.current); setTipIdx(Math.floor(Math.random() * RESISTANCE_TIPS.length)); setStep(2); }
    else if (step === 2) setStep(3);
    else if (step === 3) onResisted(selected);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500, background: "#08060400", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 32 }}>
      {/* Rich background */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 70% at 50% 50%, #1A0E0600, #080604)" }} />
      <div style={{ position: "absolute", inset: 0, background: "#080604F0" }} />

      <style>{`.sopt{background:#131008;border:1px solid #1E1A12;color:#4A4540;font-family:inherit;font-size:11px;letter-spacing:0.06em;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all 0.18s;text-align:left;display:flex;align-items:center;gap:12px;}.sopt:hover{background:#1C1610;border-color:#2A2418;color:#E8E2D6;}.sopt.sel{border-color:var(--a);color:var(--a);background:var(--a)0D;}`}</style>

      <button onClick={onClose} style={{ position: "absolute", top: 24, right: 28, background: "none", border: "none", color: "#3A3530", cursor: "pointer", fontFamily: "inherit", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", zIndex: 1 }}>← Back</button>

      {step === 0 && (
        <div style={{ animation: "fadeUp 0.3s ease", width: "100%", maxWidth: 520, position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: "0.06em", lineHeight: 0.9, marginBottom: 12 }}>
              <span style={{ color: "#E8E2D6" }}>Temptation</span><br />
              <span style={{ background: "linear-gradient(135deg,#FF4D1C,#FF8C44)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Shield</span>
            </div>
            <div style={{ fontSize: 11, color: "#3A3530", letterSpacing: "0.14em", textTransform: "uppercase" }}>What are you resisting right now?</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
            {TEMPTATIONS.map(t => {
              const cat = GOAL_CATEGORIES.find(c => c.id === t.category); const a = cat ? cat.color : "#888";
              return (
                <button key={t.id} className={`sopt${selected === t.id ? " sel" : ""}`} style={{ "--a": a }} onClick={() => setSelected(t.id)}>
                  <span style={{ fontSize: 20 }}>{t.icon}</span><span>{t.label}</span>
                </button>
              );
            })}
          </div>
          <button onClick={next} disabled={!selected} style={{
            width: "100%", border: "none", color: selected ? "#080604" : "#2A2418",
            fontFamily: "inherit", fontSize: 12, letterSpacing: "0.14em", padding: "16px",
            borderRadius: 10, cursor: selected ? "pointer" : "default", fontWeight: 700,
            textTransform: "uppercase", transition: "all 0.22s",
            background: selected ? "linear-gradient(135deg,#FF4D1C,#CC3010)" : "#131008",
            boxShadow: selected ? "0 6px 28px #FF4D1C44" : "none",
          }}>I need help resisting this →</button>
        </div>
      )}

      {step === 1 && (
        <div style={{ animation: "fadeUp 0.3s ease", textAlign: "center", maxWidth: 380, position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3530", marginBottom: 32 }}>Step 1 of 3 — Ground yourself</div>
          <div style={{ position: "relative", width: 200, height: 200, margin: "0 auto 36px" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${bc}18`, animation: "breathe 8s ease-in-out infinite" }} />
            <div style={{ position: "absolute", inset: 20, borderRadius: "50%", border: `1px solid ${bc}28`, animation: "breathe 8s ease-in-out infinite", animationDelay: "0.4s" }} />
            <div style={{ position: "absolute", inset: 40, borderRadius: "50%", border: `2px solid ${bc}`, background: `radial-gradient(circle,${bc}12,transparent 70%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transition: "all 1s" }}>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 22, color: bc, letterSpacing: "0.1em", textTransform: "uppercase", transition: "color 1s" }}>{breath}</div>
              <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: bc, fontVariantNumeric: "tabular-nums", lineHeight: 1, transition: "color 1s" }}>{secs}</div>
            </div>
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 18, color: "#4A4540", marginBottom: 10, lineHeight: 1.55 }}>"The urge is peaking right now.<br />It will pass within minutes."</div>
          <div style={{ fontSize: 10, color: "#3A3530", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 32 }}>Do 2–3 full cycles, then continue</div>
          <button onClick={next} style={{ background: "transparent", border: "1px solid #2A2418", color: "#5A5550", fontFamily: "inherit", fontSize: 11, letterSpacing: "0.12em", padding: "12px 32px", borderRadius: 8, cursor: "pointer", textTransform: "uppercase", transition: "all 0.18s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = bc; e.currentTarget.style.color = bc; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#2A2418"; e.currentTarget.style.color = "#5A5550"; }}>
            I feel calmer →
          </button>
        </div>
      )}

      {step === 2 && (
        <div style={{ animation: "fadeUp 0.3s ease", maxWidth: 480, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#3A3530", marginBottom: 24 }}>Step 2 of 3 — Reframe it</div>
          <div style={{ background: "linear-gradient(160deg,#181410,#100E0A)", border: "1px solid #2A2418", borderRadius: 16, padding: "32px 30px", marginBottom: 24 }}>
            <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 34, letterSpacing: "0.06em", color: "#FFD600", marginBottom: 14, lineHeight: 1 }}>{tip.title}</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 18, color: "#6A6560", lineHeight: 1.65, marginBottom: 20 }}>{tip.body}</div>
            <div style={{ fontSize: 9, color: "#3A3530", letterSpacing: "0.14em", textTransform: "uppercase" }}>Tap when done: "{tip.action}"</div>
          </div>
          <button onClick={() => setTipIdx(i => (i + 1) % RESISTANCE_TIPS.length)} style={{ background: "transparent", border: "none", color: "#3A3530", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.1em", cursor: "pointer", textTransform: "uppercase", marginBottom: 14 }}>Try a different tip ↻</button><br />
          <button onClick={next} style={{ background: "linear-gradient(135deg,#FFD600,#CC9900)", border: "none", color: "#080604", fontFamily: "inherit", fontSize: 12, letterSpacing: "0.14em", padding: "14px 40px", borderRadius: 10, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", boxShadow: "0 6px 28px #FFD60044" }}>{tip.action} →</button>
        </div>
      )}

      {step === 3 && (
        <div style={{ animation: "fadeUp 0.3s ease", textAlign: "center", maxWidth: 400, position: "relative", zIndex: 1 }}>
          <div style={{ marginBottom: 24, display: "flex", justifyContent: "center" }}>
            <div style={{ animation: "emberGlow 2s ease-in-out infinite" }}><FlintMark size={80} /></div>
          </div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: "0.04em", lineHeight: 0.9, marginBottom: 16 }}>
            <span style={{ color: "#43E97B" }}>You Held</span><br /><span style={{ color: "#E8E2D6" }}>The Line</span>
          </div>
          <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 17, color: "#4A4540", lineHeight: 1.7, marginBottom: 32 }}>Every time you resist, you literally rewire your brain.<br />That moment of choice just made you stronger.</div>
          <button onClick={next} style={{ background: "linear-gradient(135deg,#43E97B,#2AB85C)", border: "none", color: "#080604", fontFamily: "inherit", fontSize: 12, letterSpacing: "0.14em", padding: "16px 44px", borderRadius: 12, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", boxShadow: "0 6px 32px #43E97B44" }}>Record this win ✓</button>
        </div>
      )}
    </div>
  );
}

// ─── GOAL CATEGORY PICKER ─────────────────────────────────────────────────────
function CategoryPicker({ onPick }) {
  const [hover, setHover] = useState(null);
  return (
    <div style={{ animation: "fadeUp 0.28s ease" }}>
      <div style={{ marginBottom: 36 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "#3A3530", textTransform: "uppercase", marginBottom: 10 }}>Explore</div>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 58, letterSpacing: "0.04em", lineHeight: 0.88, marginBottom: 12 }}>
          <span style={{ color: "#E8E2D6" }}>What are you</span><br />
          <span style={{ background: "linear-gradient(135deg,#FF4D1C,#FF8C44)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Building?</span>
        </div>
        <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 16, color: "#3A3530", lineHeight: 1.6 }}>Pick a goal area to get started — you can always add more later.</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {GOAL_CATEGORIES.map(cat => (
          <div key={cat.id}
            onClick={() => onPick(cat)}
            onMouseEnter={() => setHover(cat.id)}
            onMouseLeave={() => setHover(null)}
            style={{
              background: hover === cat.id ? "#141008" : "#0E0C08",
              border: `1px solid ${hover === cat.id ? cat.color + "33" : "#1C1814"}`,
              borderRadius: 14, padding: "24px 22px", cursor: "pointer",
              transition: "all 0.2s", position: "relative", overflow: "hidden",
              transform: hover === cat.id ? "translateY(-3px)" : "none",
              boxShadow: hover === cat.id ? `0 16px 48px rgba(0,0,0,0.7), 0 0 0 1px ${cat.color}18` : "none",
            }}>
            {/* Bottom accent line */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${cat.color}66,transparent)`, opacity: hover === cat.id ? 1 : 0, transition: "opacity 0.2s" }} />
            <div style={{ fontSize: 30, marginBottom: 14, lineHeight: 1 }}>{cat.icon}</div>
            <div style={{ fontFamily: "'Instrument Serif',serif", fontSize: 16, color: hover === cat.id ? cat.color : "#C8C2B6", marginBottom: 8, lineHeight: 1.2, transition: "color 0.2s" }}>{cat.name}</div>
            <div style={{ fontSize: 10, color: "#3A3530", letterSpacing: "0.02em", lineHeight: 1.55 }}>{cat.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── NOTIFICATION SETTINGS ────────────────────────────────────────────────────
function NotifSettings({ permission, requestPermission, settings, setSettings, onTest, onClose }) {
  const ITEMS = [
    { key: "morning",      icon: "☀️", label: "Morning check-in",   desc: "Daily prompt to set your spark",        type: "time" },
    { key: "midday",       icon: "⚡", label: "Midday momentum",    desc: "Midday nudge to stay on track",          type: "time" },
    { key: "evening",      icon: "🌙", label: "Evening recap",      desc: "Log progress before sleeping",           type: "time" },
    { key: "streakDanger", icon: "🔥", label: "Flame guardian",     desc: "Alert before your streak breaks",        type: "time" },
    { key: "focusRemind",  icon: "🎯", label: "Focus reminder",     desc: "Nudge about your pinned task",           type: "interval_mins",  label2: "mins" },
    { key: "shield",       icon: "🛡", label: "Temptation guard",   desc: "Reminder your Shield is ready",          type: "interval_hours", label2: "hrs" },
  ];
  const toggle = key => setSettings(s => ({ ...s, [key]: { ...s[key], enabled: !s[key]?.enabled } }));
  const setTime = (key, v) => setSettings(s => ({ ...s, [key]: { ...s[key], time: v } }));
  const setNum = (key, field, v) => setSettings(s => ({ ...s, [key]: { ...s[key], [field]: Number(v) } }));

  return (
    <div style={{ animation: "fadeUp 0.28s ease", maxWidth: 580 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "#3A3530", textTransform: "uppercase", marginBottom: 10 }}>Settings</div>
          <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 52, letterSpacing: "0.04em", lineHeight: 0.88, color: "#E8E2D6" }}>Alerts &<br /><span style={{ color: "#FF4D1C" }}>Reminders</span></div>
        </div>
        <button onClick={onClose} style={{ background: "#131008", border: "1px solid #1E1A12", color: "#4A4540", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.1em", padding: "9px 18px", borderRadius: 8, cursor: "pointer", textTransform: "uppercase", marginTop: 8, transition: "all 0.16s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#2A2418"; e.currentTarget.style.color = "#8A8480"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#1E1A12"; e.currentTarget.style.color = "#4A4540"; }}>
          ← Back
        </button>
      </div>

      {/* Permission banner */}
      <div style={{
        background: permission === "granted" ? "#43E97B08" : "#FF4D1C08",
        border: `1px solid ${permission === "granted" ? "#43E97B22" : "#FF4D1C22"}`,
        borderRadius: 12, padding: "18px 22px", marginBottom: 20,
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 11, color: permission === "granted" ? "#43E97B" : "#FF6B3C", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5, fontWeight: 600 }}>
            {permission === "granted" ? "✓ Notifications active" : permission === "denied" ? "✗ Blocked in browser settings" : "◎ Permission needed"}
          </div>
          <div style={{ fontSize: 10, color: "#4A4540", lineHeight: 1.55 }}>
            {permission === "granted" ? "Alerts fire while the tab is open. Background push needs a service worker." : permission === "denied" ? "Go to browser site settings → Notifications → Allow." : "Grant permission to receive alerts on your device."}
          </div>
        </div>
        {permission !== "granted" && permission !== "denied" && (
          <button onClick={requestPermission} style={{ background: "linear-gradient(135deg,#FF4D1C,#CC3010)", border: "none", color: "#fff", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.12em", padding: "10px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 700, textTransform: "uppercase", flexShrink: 0, boxShadow: "0 4px 20px #FF4D1C44" }}>Enable</button>
        )}
        {permission === "granted" && (
          <button onClick={onTest} style={{ background: "transparent", border: "1px solid #43E97B2A", color: "#43E97B", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.1em", padding: "9px 18px", borderRadius: 8, cursor: "pointer", textTransform: "uppercase", flexShrink: 0 }}>Test →</button>
        )}
      </div>

      {/* Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ITEMS.map(item => {
          const s = settings[item.key] || {}, on = s.enabled !== false;
          return (
            <div key={item.key} style={{
              background: "#0E0C08", border: "1px solid #1A1814", borderRadius: 12,
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
              opacity: on ? 1 : 0.35, transition: "opacity 0.2s",
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: "#151208", border: "1px solid #201C14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 18 }}>{item.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: "#C8C2B6", letterSpacing: "0.03em", marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: "#3A3530", letterSpacing: "0.02em" }}>{item.desc}</div>
              </div>
              {item.type === "time" && on && (
                <input type="time" value={s.time || "08:00"} onChange={e => setTime(item.key, e.target.value)}
                  style={{ background: "#131008", border: "1px solid #1E1A12", color: "#6A6560", fontFamily: "inherit", fontSize: 10, padding: "5px 8px", borderRadius: 6, outline: "none", width: 80, flexShrink: 0 }} />
              )}
              {(item.type === "interval_mins" || item.type === "interval_hours") && on && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                  <input type="number" min="1" max="999"
                    value={item.type === "interval_mins" ? (s.intervalMins || 120) : (s.intervalHours || 6)}
                    onChange={e => setNum(item.key, item.type === "interval_mins" ? "intervalMins" : "intervalHours", e.target.value)}
                    style={{ background: "#131008", border: "1px solid #1E1A12", color: "#6A6560", fontFamily: "inherit", fontSize: 10, padding: "5px 8px", borderRadius: 6, outline: "none", width: 52, textAlign: "center" }} />
                  <span style={{ fontSize: 9, color: "#3A3530", textTransform: "uppercase", letterSpacing: "0.1em" }}>{item.label2}</span>
                </div>
              )}
              {/* Toggle */}
              <div onClick={() => toggle(item.key)} style={{ width: 36, height: 20, borderRadius: 10, background: on ? "#FF4D1C" : "#1C1814", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0, boxShadow: on ? "0 0 12px #FF4D1C44" : "none" }}>
                <div style={{ position: "absolute", top: 3, left: on ? 19 : 3, width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : "#2E2A24", transition: "left 0.2s" }} />
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16, padding: "13px 16px", background: "#0C0A06", border: "1px solid #141008", borderRadius: 8, fontSize: 10, color: "#2A2620", lineHeight: 1.65 }}>
        💡 In-app toasts always work while the tab is open. True background push (tab closed) needs a service worker on deploy.
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [projects, setProjects] = useState(() => GOAL_CATEGORIES.slice(0, 3).map((cat, i) => ({
    id: cat.id, name: cat.name, color: cat.color, icon: cat.icon,
    tasks: cat.examples.slice(0, 3).map((ex, j) => ({ id: i * 10 + j + 1, text: ex, done: j === 0, priority: j === 0 ? "high" : "medium" }))
  })));
  const [activeId, setActiveId]           = useState(null);
  const [view, setView]                   = useState("today");
  const [newTaskText, setNewTaskText]     = useState("");
  const [newPriority, setNewPriority]     = useState("medium");
  const [addingProject, setAddingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [focusTaskId, setFocusTaskId]     = useState(null);
  const [streak, setStreak]               = useState(0);
  const [resistedCount, setResistedCount] = useState(0);
  const [justCompleted, setJustCompleted] = useState(null);
  const [shieldActive, setShieldActive]   = useState(false);
  const [toasts, setToasts]               = useState([]);
  const [loaded, setLoaded]               = useState(false);
  const toastId  = useRef(0);
  const inputRef = useRef(null);
  const time     = useTicker();

  const allTasks     = projects.flatMap(p => p.tasks);
  const focusTask    = focusTaskId ? allTasks.find(t => t.id === focusTaskId) : null;
  const focusProject = focusTask ? projects.find(p => p.tasks.some(t => t.id === focusTaskId)) : null;
  const notif        = useNotifications(streak, focusTask);

  useEffect(() => {
    const sk = parseInt(stor(K.streak) || "0", 10);
    const rc = parseInt(stor(K.resisted) || "0", 10);
    const fi = stor(K.focus);
    setStreak(isNaN(sk) ? 0 : sk);
    setResistedCount(isNaN(rc) ? 0 : rc);
    if (fi && fi !== "") { const n = parseInt(fi, 10); if (!isNaN(n)) setFocusTaskId(n); }
    setLoaded(true);
  }, []);

  const totalDone  = allTasks.filter(t => t.done).length;
  const totalAll   = allTasks.length;
  const globalPct  = totalAll ? Math.round((totalDone / totalAll) * 100) : 0;
  const PRIO       = { high: { label: "HIGH", dot: "#FF4D1C" }, medium: { label: "MED", dot: "#FFD600" }, low: { label: "LOW", dot: "#00E5CC" } };
  const prioOf     = p => PRIO[p] || PRIO.medium;
  const todayTasks = allTasks.filter(t => !t.done && t.priority === "high").slice(0, 4).concat(allTasks.filter(t => !t.done && t.priority !== "high").slice(0, 3)).slice(0, 6);
  const motivational = MOTIVATIONAL[new Date().getDay() % MOTIVATIONAL.length];
  const timeStr    = `${pad(time.getHours())}:${pad(time.getMinutes())}:${pad(time.getSeconds())}`;
  const dateStr    = time.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const activeProject = projects.find(p => p.id === activeId);
  const projDone   = activeProject ? activeProject.tasks.filter(t => t.done).length : 0;
  const projTotal  = activeProject ? activeProject.tasks.length : 0;
  const projPct    = projTotal ? Math.round((projDone / projTotal) * 100) : 0;

  function addToast(title, body, icon, color = "#FF4D1C") {
    const id = ++toastId.current;
    setToasts(t => [...t, { id, title, body, icon, color }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 5500);
  }

  async function toggleTask(pid, tid, e) {
    const task = projects.find(p => p.id === pid)?.tasks.find(t => t.id === tid);
    if (!task) return;
    const completing = !task.done;
    setProjects(ps => ps.map(p => { if (p.id !== pid) return p; return { ...p, tasks: p.tasks.map(t => t.id !== tid ? t : { ...t, done: !t.done }) }; }));
    if (completing) {
      if (e) spawnConfetti(e.clientX, e.clientY, 16);
      setJustCompleted(tid); setTimeout(() => setJustCompleted(null), 900);
      const today = todayStr(), lastDay = stor(K.lastday);
      if (lastDay !== today) {
        const yest = new Date(); yest.setDate(yest.getDate() - 1);
        const yk = `${yest.getFullYear()}-${pad(yest.getMonth() + 1)}-${pad(yest.getDate())}`;
        const ns = lastDay === yk ? streak + 1 : 1; setStreak(ns);
        storSet(K.streak, ns); storSet(K.lastday, today);
        if (ns === 1) addToast("🔥 First spark!", "You started. That's everything.", "🔥", "#FF4D1C");
        else addToast(`🔥 ${ns}-day streak!`, "Consistency is your superpower.", "🔥", "#FF4D1C");
      }
    }
  }

  function deleteTask(pid, tid) { setProjects(ps => ps.map(p => p.id !== pid ? p : { ...p, tasks: p.tasks.filter(t => t.id !== tid) })); if (focusTaskId === tid) setFocusTaskId(null); }
  function addTask() { if (!newTaskText.trim()) return; setProjects(ps => ps.map(p => p.id !== activeId ? p : { ...p, tasks: [...p.tasks, { id: Date.now(), text: newTaskText.trim(), done: false, priority: newPriority }] })); setNewTaskText(""); inputRef.current?.focus(); }
  function addProject() { if (!newProjectName.trim()) return; const ap = GOAL_CATEGORIES.find(c => c.id === activeId) || GOAL_CATEGORIES[0]; const np = { id: Date.now() + "", name: newProjectName.trim(), color: ap.color, icon: ap.icon || "📌", tasks: [] }; setProjects(ps => [...ps, np]); setActiveId(np.id); setNewProjectName(""); setAddingProject(false); }
  function setFocus(tid) { const nf = focusTaskId === tid ? null : tid; setFocusTaskId(nf); storSet(K.focus, nf != null ? String(nf) : ""); if (nf != null) addToast("🎯 Focus set", "You'll get reminders about this task.", "🎯", "#FFD600"); }
  function handleResisted() { const nc = resistedCount + 1; setResistedCount(nc); storSet(K.resisted, nc); setShieldActive(false); setView("today"); spawnConfetti(window.innerWidth / 2, window.innerHeight / 2, 40); addToast("🛡 Temptation resisted!", "Every win rewires your brain.", "🛡", "#43E97B"); }
  function addGoalCategory(cat) { if (projects.find(p => p.id === cat.id)) { setActiveId(cat.id); setView("project"); return; } const np = { id: cat.id, name: cat.name, color: cat.color, icon: cat.icon, tasks: cat.examples.map((ex, i) => ({ id: Date.now() * 100 + i, text: ex, done: false, priority: i < 2 ? "high" : "medium" })) }; setProjects(ps => [...ps, np]); setActiveId(np.id); setView("project"); }

  // ─── LOADING SCREEN ──────────────────────────────────────────────────────────
  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#080604", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28, position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 40% at 50% 55%,#FF4D1C0D,transparent)" }} />
      <div style={{ animation: "ls 2.5s ease-in-out infinite", position: "relative", zIndex: 1 }}><FlintMark size={60} /></div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 32, letterSpacing: "0.3em", color: "#1C1814" }}>FLINT</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 9, letterSpacing: "0.28em", color: "#2A2418", textTransform: "uppercase" }}>Striking a spark…</div>
      </div>
      <style>{`@keyframes ls{0%,100%{filter:drop-shadow(0 0 8px #FF4D1C22);}50%{filter:drop-shadow(0 0 30px #FF4D1C77) drop-shadow(0 0 60px #FF4D1C1A);}}`}</style>
    </div>
  );

  // ─── SHIELD ──────────────────────────────────────────────────────────────────
  if (shieldActive) return (
    <><div id="cr" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />
      <TemptationShield onResisted={handleResisted} onClose={() => setShieldActive(false)} /></>
  );

  // ─── MAIN RENDER ─────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080604", color: "#E8E2D6", fontFamily: "'DM Mono','Courier New',monospace", display: "flex", flexDirection: "column" }}>
      <div id="cr" style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999 }} />
      <ToastStack toasts={toasts} onDismiss={id => setToasts(t => t.filter(x => x.id !== id))} />

      {/* ── Ambient atmosphere ── */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{ position: "absolute", top: -240, left: -180, width: 800, height: 800, background: "radial-gradient(ellipse,#FF4D1C0B 0%,transparent 50%)" }} />
        <div style={{ position: "absolute", bottom: -160, right: -120, width: 600, height: 600, background: "radial-gradient(ellipse,#B47FFF05 0%,transparent 55%)" }} />
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.018 }}>
          <filter id="g"><feTurbulence type="fractalNoise" baseFrequency="0.68" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#g)" />
        </svg>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Bebas+Neue&family=Instrument+Serif:ital@0;1&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1C1814; border-radius: 4px; }

        @keyframes cfly      { to { transform: translate(calc(-50% + var(--dx)), calc(-50% + var(--dy))); opacity: 0; } }
        @keyframes fadeUp    { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes riseIn    { from { opacity: 0; transform: translateY(7px);  } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn     { 0%   { transform: scale(0.55); opacity: 0; } 60% { transform: scale(1.18); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes breathe   { 0%,100% { opacity: 0.35; transform: scale(1);    } 50% { opacity: 1;    transform: scale(1.08); } }
        @keyframes emberGlow { 0%,100% { filter: drop-shadow(0 0 6px #FF4D1C33); } 50% { filter: drop-shadow(0 0 22px #FF4D1C99); } }
        @keyframes topbarPulse { 0%,100% { box-shadow: 0 0 0 0 #FF4D1C33; } 55% { box-shadow: 0 0 0 10px transparent; } }
        @keyframes toastIn   { from { opacity: 0; transform: translateX(28px) scale(0.94); } to { opacity: 1; transform: translateX(0) scale(1); } }

        /* ─── SIDEBAR NAV ─────────────────── */
        .nav-item {
          display: flex; align-items: center; gap: 11px; padding: 10px 14px;
          border-radius: 10px; cursor: pointer; font-size: 10px; letter-spacing: 0.1em;
          text-transform: uppercase; font-weight: 500; color: #2E2A24;
          position: relative; border: 1px solid transparent; transition: all 0.18s;
        }
        .nav-item:hover { background: #100E0A; color: #5A5550; border-color: #1E1A12; }
        .nav-item.active { background: #141008; color: #E8E2D6; border-color: #221E14; }
        .nav-item.active::before {
          content: ''; position: absolute; left: -1px; top: 24%; bottom: 24%;
          width: 3px; border-radius: 0 3px 3px 0;
          background: var(--a, #E8E2D6); box-shadow: 0 0 16px var(--a, #E8E2D6)66;
        }

        /* ─── TASK ROWS ───────────────────── */
        .task-row {
          display: flex; align-items: center; gap: 13px; padding: 15px 24px;
          border-bottom: 1px solid #0E0C08; transition: background 0.12s;
          cursor: default; position: relative; animation: riseIn 0.24s ease both;
        }
        .task-row:hover { background: #0C0A06; }
        .task-row:last-child { border-bottom: none; }
        .task-row::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 0;
          background: var(--a, #FF4D1C); opacity: 0; transition: width 0.22s, opacity 0.22s;
        }
        .task-row:hover::before { width: 3px; opacity: 0.7; }

        /* ─── CHECKBOXES ──────────────────── */
        .cb {
          width: 20px; height: 20px; border: 1.5px solid #222018; border-radius: 6px;
          cursor: pointer; display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; transition: all 0.16s; background: #0E0C08;
        }
        .cb:hover:not(.on) { border-color: #302C24; background: #141008; }
        .cb.on { border-color: var(--a); background: var(--a); animation: popIn 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 0 20px var(--a)55; }

        /* ─── ACTION BUTTONS ──────────────── */
        .delbtn  { opacity: 0; transition: opacity 0.14s; cursor: pointer; color: #2A2624; font-size: 18px; line-height: 1; padding: 2px 5px; flex-shrink: 0; }
        .task-row:hover .delbtn { opacity: 1; }
        .delbtn:hover { color: #FF4D1C !important; }
        .focusbtn { opacity: 0; transition: opacity 0.14s; cursor: pointer; font-size: 14px; padding: 2px 4px; flex-shrink: 0; }
        .task-row:hover .focusbtn { opacity: 0.6; }
        .focusbtn:hover { opacity: 1 !important; }

        /* ─── PRIORITY BADGE ──────────────── */
        .badge { font-size: 8px; letter-spacing: 0.14em; padding: 3px 8px; border-radius: 4px; font-weight: 700; flex-shrink: 0; text-transform: uppercase; }

        /* ─── INPUTS ──────────────────────── */
        .task-input { background: transparent; border: none; outline: none; color: #E8E2D6; font-family: inherit; font-size: 12px; flex: 1; letter-spacing: 0.02em; }
        .task-input::placeholder { color: #1C1814; }
        .proj-input { background: #0E0C08; border: 1px solid #1E1A12; color: #E8E2D6; font-family: inherit; font-size: 11px; padding: 10px 13px; border-radius: 8px; outline: none; width: 100%; letter-spacing: 0.03em; transition: border-color 0.16s; }
        .proj-input:focus { border-color: #2E2A24; }

        /* ─── PROGRESS ────────────────────── */
        .pbar { height: 3px; background: #141008; border-radius: 3px; overflow: hidden; }
        .pfill { height: 100%; border-radius: 3px; transition: width 0.9s cubic-bezier(0.4,0,0.2,1); }

        /* ─── PRIORITY BUTTONS ────────────── */
        .priobtn { font-size: 9px; letter-spacing: 0.1em; padding: 5px 10px; border-radius: 5px; cursor: pointer; border: 1px solid transparent; font-family: inherit; text-transform: uppercase; transition: all 0.16s; font-weight: 600; }

        /* ─── TODAY TASK CARDS ────────────── */
        .today-card {
          display: flex; align-items: center; gap: 13px; padding: 15px 20px;
          border-radius: 12px; background: #0E0C08; border: 1px solid #181410;
          transition: all 0.2s; cursor: default; animation: riseIn 0.24s ease both;
        }
        .today-card:hover { background: #121008; border-color: #201C14; transform: translateX(5px); }

        /* ─── GOAL RING CARDS ─────────────── */
        .goal-card {
          background: #0E0C08; border: 1px solid #181410; border-radius: 14px;
          padding: 22px 16px; cursor: pointer; display: flex; flex-direction: column;
          align-items: center; text-align: center; gap: 12px;
          transition: all 0.24s; position: relative; overflow: hidden;
        }
        .goal-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
          background: radial-gradient(ellipse at 50% 120%, var(--gc, transparent) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.24s; pointer-events: none;
        }
        .goal-card:hover { background: #121008; border-color: #242018; transform: translateY(-5px); box-shadow: 0 20px 56px rgba(0,0,0,0.8); }
        .goal-card:hover::after { opacity: 0.15; }

        /* ─── SECTION DIVIDERS ────────────── */
        .sec { display: flex; align-items: center; gap: 12px; font-size: 8px; letter-spacing: 0.28em; color: #2E2A24; text-transform: uppercase; padding: 20px 6px 10px; }
        .sec::after { content: ''; flex: 1; height: 1px; background: linear-gradient(90deg, #181410, transparent); }
      `}</style>

      {/* ══════════════════════════════════════
          TOP BAR
      ══════════════════════════════════════ */}
      <div style={{
        borderBottom: "1px solid #141008", padding: "0 28px", height: 58,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexShrink: 0, position: "sticky", top: 0, zIndex: 100,
        background: "rgba(8,6,4,0.96)", backdropFilter: "blur(24px) saturate(180%)",
      }}>
        {/* Left — brand + stats */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {/* Logo lockup */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ animation: "emberGlow 4s ease-in-out infinite" }}><FlintMark size={30} /></div>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
              <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 24, letterSpacing: "0.24em", color: "#E8E2D6" }}>
                <span style={{ color: "#FF4D1C" }}>F</span>LINT
              </span>
            </div>
          </div>

          <div style={{ width: 1, height: 20, background: "#1C1814", flexShrink: 0 }} />

          {/* Free badge */}
          <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", textTransform: "uppercase", color: "#43E97B", background: "#43E97B0E", border: "1px solid #43E97B22", padding: "4px 10px", borderRadius: 5 }}>Free</span>

          {/* Streak */}
          {streak > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#1A0E06,#140A04)", border: "1px solid #2A1A0E", padding: "5px 14px", borderRadius: 22 }}>
              <span style={{ fontSize: 14 }}>🔥</span>
              <div>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#B83818", letterSpacing: "0.04em", lineHeight: 1 }}>{streak}</span>
                <span style={{ fontSize: 8, color: "#3A1A08", letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: 4 }}>day</span>
              </div>
            </div>
          )}

          {/* Resisted */}
          {resistedCount > 0 && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "linear-gradient(135deg,#061A10,#041408)", border: "1px solid #0E2A1A", padding: "5px 14px", borderRadius: 22 }}>
              <span style={{ fontSize: 14 }}>🛡</span>
              <div>
                <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: "#1E6B3C", letterSpacing: "0.04em", lineHeight: 1 }}>{resistedCount}</span>
                <span style={{ fontSize: 8, color: "#0A2018", letterSpacing: "0.12em", textTransform: "uppercase", marginLeft: 4 }}>won</span>
              </div>
            </div>
          )}
        </div>

        {/* Right — controls */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: "0.12em", color: "#2A2420", fontVariantNumeric: "tabular-nums", minWidth: 88, textAlign: "right" }}>{timeStr}</span>
          <div style={{ width: 1, height: 16, background: "#1C1814" }} />
          <button onClick={() => setView("notifications")} style={{
            background: view === "notifications" ? "#141008" : "transparent",
            border: `1px solid ${view === "notifications" ? "#222018" : "#141008"}`,
            color: view === "notifications" ? "#8A8480" : "#2E2A24",
            fontFamily: "inherit", fontSize: 12, padding: "7px 14px", borderRadius: 9, cursor: "pointer", transition: "all 0.16s",
          }}>🔔</button>
          <button onClick={() => setShieldActive(true)} style={{
            background: "linear-gradient(135deg,#FF4D1C 0%,#CC2E08 100%)",
            border: "none", color: "#fff", fontFamily: "inherit", fontSize: 10,
            letterSpacing: "0.16em", padding: "10px 24px", borderRadius: 24,
            cursor: "pointer", fontWeight: 700, textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: 7,
            animation: "topbarPulse 2.8s ease-in-out infinite",
            boxShadow: "0 4px 28px #FF4D1C44, inset 0 1px 0 #FF6B3C44",
          }}>🛡 Resist</button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          BODY
      ══════════════════════════════════════ */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden", position: "relative", zIndex: 1 }}>

        {/* ══ SIDEBAR ══ */}
        <div style={{
          width: 220, borderRight: "1px solid #141008", padding: "16px 10px 20px",
          display: "flex", flexDirection: "column", gap: 2,
          flexShrink: 0, overflowY: "auto", background: "rgba(8,6,4,0.8)",
        }}>
          <div className={`nav-item${view === "today" ? " active" : ""}`} style={{ "--a": "#E8E2D6" }} onClick={() => { setView("today"); setActiveId(null); }}>
            <span style={{ fontSize: 15, opacity: 0.5 }}>◈</span>
            <span>Today</span>
            {todayTasks.length > 0 && <span style={{ marginLeft: "auto", background: "#FF4D1C", color: "#fff", fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 10 }}>{todayTasks.length}</span>}
          </div>
          <div className={`nav-item${view === "goals" ? " active" : ""}`} style={{ "--a": "#B47FFF" }} onClick={() => setView("goals")}>
            <span>🧭</span><span>Goal Areas</span>
          </div>
          <div className={`nav-item${view === "notifications" ? " active" : ""}`} style={{ "--a": "#00E5CC" }} onClick={() => setView("notifications")}>
            <span>🔔</span><span>Alerts</span>
          </div>

          <div className="sec">My Goals</div>

          {projects.map(p => {
            const d = p.tasks.filter(t => t.done).length, tot = p.tasks.length, pc = tot ? Math.round((d / tot) * 100) : 0;
            return (
              <div key={p.id}
                className={`nav-item${p.id === activeId && view === "project" ? " active" : ""}`}
                style={{ "--a": p.color, flexDirection: "column", alignItems: "flex-start", gap: 8, padding: "11px 14px", height: "auto" }}
                onClick={() => { setActiveId(p.id); setView("project"); }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, width: "100%" }}>
                  <span style={{ fontSize: 13 }}>{p.icon}</span>
                  <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 10, letterSpacing: "0.04em" }}>{p.name}</span>
                  <span style={{ fontSize: 9, color: "#2A2620", fontWeight: 400 }}>{d}/{tot}</span>
                </div>
                <div className="pbar" style={{ width: "100%", marginLeft: 22 }}>
                  <div className="pfill" style={{ width: `${pc}%`, background: `linear-gradient(90deg,${p.color}44,${p.color})` }} />
                </div>
              </div>
            );
          })}

          {addingProject ? (
            <div style={{ padding: "8px 4px", display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <input autoFocus className="proj-input" placeholder="Project name…"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") addProject(); if (e.key === "Escape") setAddingProject(false); }} />
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={addProject} style={{ flex: 1, background: "#141008", border: "1px solid #201C14", color: "#8A8480", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.09em", padding: "7px", borderRadius: 6, cursor: "pointer", textTransform: "uppercase" }}>Add</button>
                <button onClick={() => setAddingProject(false)} style={{ flex: 1, background: "transparent", border: "1px solid #141008", color: "#2E2A24", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.09em", padding: "7px", borderRadius: 6, cursor: "pointer", textTransform: "uppercase" }}>Cancel</button>
              </div>
            </div>
          ) : (
            <div className="nav-item" style={{ color: "#242018", marginTop: 4 }} onClick={() => setAddingProject(true)}>
              <span style={{ fontSize: 18, lineHeight: 1, marginRight: -2 }}>+</span><span>New project</span>
            </div>
          )}
        </div>

        {/* ══ MAIN PANEL ══ */}
        <div style={{ flex: 1, overflowY: "auto", padding: "44px 52px", display: "flex", flexDirection: "column", gap: 32 }}>

          {/* NOTIFICATIONS VIEW */}
          {view === "notifications" && <NotifSettings permission={notif.permission} requestPermission={notif.requestPermission} settings={notif.settings} setSettings={notif.setSettings} onTest={() => notif.sendNotif({ title: "🔔 Test — FLINT", body: "Notifications are working. Strike a spark today." })} onClose={() => setView("today")} />}

          {/* GOAL AREAS VIEW */}
          {view === "goals" && <CategoryPicker onPick={addGoalCategory} />}

          {/* TODAY VIEW */}
          {view === "today" && (<>

            {/* ── Hero header ── */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 28, animation: "fadeUp 0.32s ease" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.32em", color: "#2E2A24", textTransform: "uppercase", marginBottom: 14 }}>{dateStr}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", letterSpacing: "0.04em", lineHeight: 0.86, marginBottom: 18 }}>
                  <div style={{ fontSize: 72, color: "#E8E2D6" }}>Today's</div>
                  <div style={{ fontSize: 72, background: "linear-gradient(135deg,#FF4D1C 30%,#FF8C44 80%,#FFD600)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Mission</div>
                </div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 18, color: "#3A3530", lineHeight: 1.55 }}>{motivational}</div>
              </div>

              {/* Stat cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, paddingTop: 10 }}>
                {/* Progress ring */}
                <div style={{
                  background: "linear-gradient(160deg,#141008,#0E0C08)",
                  border: "1px solid #1C1814", borderRadius: 18,
                  padding: "22px 22px 18px",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
                  boxShadow: "inset 0 1px 0 #201C14, 0 8px 32px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ position: "relative" }}>
                    <Ring pct={globalPct} color="#FF4D1C" size={64} stroke={4} />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 15, color: "#FF4D1C", letterSpacing: "0.06em" }}>{globalPct}%</span>
                    </div>
                  </div>
                  <div style={{ fontSize: 8, letterSpacing: "0.22em", color: "#2A2620", textTransform: "uppercase" }}>Overall</div>
                </div>

                {/* Streak */}
                <div style={{
                  background: "linear-gradient(160deg,#1C0E06,#140A04)",
                  border: "1px solid #2A1808", borderRadius: 14,
                  padding: "16px 20px", textAlign: "center", minWidth: 88,
                  boxShadow: "inset 0 1px 0 #3A2010, 0 8px 32px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>🔥</div>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 40, color: "#CC3810", lineHeight: 1, letterSpacing: "0.02em" }}>{streak}</div>
                  <div style={{ fontSize: 8, color: "#3A1A08", letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 6 }}>Streak</div>
                </div>
              </div>
            </div>

            {/* ── Focus task ── */}
            {focusTask && focusProject ? (
              <div style={{
                background: `linear-gradient(135deg,${focusProject.color}0D,${focusProject.color}06,#0A0806)`,
                border: `1px solid ${focusProject.color}2A`, borderRadius: 18,
                padding: "28px 32px", position: "relative", overflow: "hidden",
                animation: "fadeUp 0.32s ease 0.06s both",
                boxShadow: `0 0 0 1px ${focusProject.color}0A, 0 20px 60px rgba(0,0,0,0.6)`,
              }}>
                {/* Decorative orbs */}
                <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle,${focusProject.color}0C,transparent 70%)`, pointerEvents: "none" }} />
                <div style={{ position: "absolute", bottom: -40, left: 20, width: 120, height: 120, borderRadius: "50%", background: `radial-gradient(circle,${focusProject.color}06,transparent 70%)`, pointerEvents: "none" }} />
                {/* Left glow bar */}
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 4, background: `linear-gradient(180deg,${focusProject.color},${focusProject.color}44)`, borderRadius: "18px 0 0 18px" }} />

                <div style={{ fontSize: 9, letterSpacing: "0.26em", textTransform: "uppercase", color: focusProject.color, marginBottom: 14, opacity: 0.85 }}>🎯 Your Focus</div>
                <div style={{ fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 26, color: "#D8D2C6", marginBottom: 20, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{focusTask.text}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#0A0806", border: `1px solid ${focusProject.color}18`, padding: "6px 14px", borderRadius: 22 }}>
                    <span style={{ fontSize: 14 }}>{focusProject.icon}</span>
                    <span style={{ fontSize: 9, color: "#4A4540", letterSpacing: "0.08em", textTransform: "uppercase" }}>{focusProject.name}</span>
                  </div>
                  <span className="badge" style={{ background: prioOf(focusTask.priority).dot + "18", color: prioOf(focusTask.priority).dot, border: `1px solid ${prioOf(focusTask.priority).dot}2A` }}>{prioOf(focusTask.priority).label}</span>
                  <button onClick={e => toggleTask(focusProject.id, focusTask.id, e)} style={{
                    marginLeft: "auto", background: `linear-gradient(135deg,${focusProject.color},${focusProject.color}CC)`,
                    border: "none", color: "#080604", fontFamily: "inherit", fontSize: 11,
                    letterSpacing: "0.14em", padding: "11px 26px", borderRadius: 10,
                    cursor: "pointer", fontWeight: 800, textTransform: "uppercase",
                    boxShadow: `0 6px 28px ${focusProject.color}55`,
                  }}>Mark Done ✓</button>
                </div>
              </div>
            ) : (
              <div style={{
                background: "#0E0C08", border: "1px dashed #1C1814", borderRadius: 18,
                padding: "26px 30px", display: "flex", alignItems: "center", gap: 20,
                animation: "fadeUp 0.32s ease 0.06s both",
              }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#141008", border: "1px solid #201C14", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>🎯</div>
                <div>
                  <div style={{ fontSize: 11, color: "#2E2A24", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>No focus task set</div>
                  <div style={{ fontSize: 14, color: "#1E1C18", fontFamily: "'Instrument Serif',serif", fontStyle: "italic" }}>Hover any task and tap 🎯 to ignite your mission for today</div>
                </div>
              </div>
            )}

            {/* ── Goal rings ── */}
            <div style={{ animation: "fadeUp 0.32s ease 0.1s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "#2E2A24", textTransform: "uppercase" }}>Goal Progress</span>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#1C1814,transparent)" }} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 12 }}>
                {projects.map(p => {
                  const d = p.tasks.filter(t => t.done).length, tot = p.tasks.length, pc = tot ? Math.round((d / tot) * 100) : 0;
                  return (
                    <div key={p.id} className="goal-card" style={{ "--gc": p.color }} onClick={() => { setActiveId(p.id); setView("project"); }}>
                      <div style={{ position: "relative", width: 62, height: 62 }}>
                        <Ring pct={pc} color={p.color} size={62} stroke={3.5} />
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 16 }}>{p.icon}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 9, letterSpacing: "0.07em", color: "#3A3530", textTransform: "uppercase", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 120, marginBottom: 5 }}>{p.name}</div>
                        <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 20, color: p.color, letterSpacing: "0.06em" }}>{pc}<span style={{ fontSize: 13, opacity: 0.6 }}>%</span></div>
                      </div>
                    </div>
                  );
                })}
                <div className="goal-card" style={{ "--gc": "#444" }} onClick={() => setView("goals")}>
                  <div style={{ width: 62, height: 62, borderRadius: "50%", border: "2px dashed #201C14", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 24, color: "#1C1814" }}>+</span>
                  </div>
                  <div style={{ fontSize: 9, color: "#1C1814", letterSpacing: "0.16em", textTransform: "uppercase" }}>Add goal</div>
                </div>
              </div>
            </div>

            {/* ── Up next ── */}
            <div style={{ animation: "fadeUp 0.32s ease 0.14s both" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ fontSize: 9, letterSpacing: "0.28em", color: "#2E2A24", textTransform: "uppercase" }}>Up Next</span>
                <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg,#1C1814,transparent)" }} />
                {todayTasks.length > 0 && <span style={{ fontSize: 9, color: "#2E2A24" }}>{todayTasks.length} task{todayTasks.length !== 1 ? "s" : ""}</span>}
              </div>
              {todayTasks.length === 0 ? (
                <div style={{ padding: "40px 32px", textAlign: "center", background: "#0E0C08", borderRadius: 16, border: "1px solid #141008" }}>
                  <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 28, color: "#1C1814", letterSpacing: "0.1em", marginBottom: 8 }}>All caught up</div>
                  <div style={{ fontSize: 14, color: "#1A1814", fontFamily: "'Instrument Serif',serif", fontStyle: "italic" }}>You've done the work. Rest well.</div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {todayTasks.map((task, i) => {
                    const proj = projects.find(p => p.tasks.some(t => t.id === task.id)); if (!proj) return null;
                    return (
                      <div key={task.id} className="today-card" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className={`cb${task.done ? " on" : ""}`} style={{ "--a": proj.color }} onClick={e => toggleTask(proj.id, task.id, e)}>
                          {task.done && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#080604" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                        </div>
                        <span style={{ flex: 1, fontSize: 12, color: task.done ? "#1C1814" : "#8A8480", letterSpacing: "0.02em", textDecoration: task.done ? "line-through" : "none", lineHeight: 1.5 }}>{task.text}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
                          <span style={{ fontSize: 16 }}>{proj.icon}</span>
                          <span className="badge" style={{ background: prioOf(task.priority).dot + "14", color: prioOf(task.priority).dot, border: `1px solid ${prioOf(task.priority).dot}22` }}>{prioOf(task.priority).label}</span>
                          <span className="focusbtn" style={{ color: focusTaskId === task.id ? "#CC9900" : "#1C1814" }} onClick={() => setFocus(task.id)}>🎯</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>)}

          {/* PROJECT VIEW */}
          {view === "project" && activeProject && (
            <div style={{ animation: "fadeUp 0.28s ease" }}>

              {/* Header */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.28em", color: "#2E2A24", textTransform: "uppercase", marginBottom: 12 }}>{activeProject.icon} {activeProject.name}</div>
                <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 68, letterSpacing: "0.04em", lineHeight: 0.86 }}>
                  <span style={{ background: `linear-gradient(135deg,${activeProject.color},${activeProject.color}99)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Your Goals</span>
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: "flex", gap: 10, marginBottom: 28 }}>
                {/* Progress bar card */}
                <div style={{ flex: 1, background: "#0E0C08", border: "1px solid #1A1814", borderRadius: 14, padding: "18px 22px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 9, letterSpacing: "0.22em", color: "#2E2A24", textTransform: "uppercase" }}>Progress</span>
                    <span style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 26, color: activeProject.color, letterSpacing: "0.06em" }}>{projPct}<span style={{ fontSize: 16, opacity: 0.6 }}>%</span></span>
                  </div>
                  <div className="pbar" style={{ height: 5 }}>
                    <div className="pfill" style={{ width: `${projPct}%`, background: `linear-gradient(90deg,${activeProject.color}55,${activeProject.color})` }} />
                  </div>
                  <div style={{ fontSize: 9, color: "#2E2A24", marginTop: 10, letterSpacing: "0.06em" }}>{projDone} of {projTotal} complete</div>
                </div>
                {/* Priority cards */}
                {["high", "medium", "low"].map(pr => {
                  const cnt = activeProject.tasks.filter(t => t.priority === pr).length;
                  return (
                    <div key={pr} style={{ background: "#0E0C08", border: "1px solid #1A1814", borderRadius: 14, padding: "18px 20px", textAlign: "center", minWidth: 72 }}>
                      <div style={{ fontSize: 8, letterSpacing: "0.18em", color: "#201C14", textTransform: "uppercase", marginBottom: 10 }}>{PRIO[pr].label}</div>
                      <div style={{ fontFamily: "'Bebas Neue',sans-serif", fontSize: 36, color: PRIO[pr].dot, lineHeight: 1 }}>{cnt}</div>
                    </div>
                  );
                })}
              </div>

              {/* Suggested goals */}
              {GOAL_CATEGORIES.find(c => c.id === activeProject.id) && activeProject.tasks.length < 2 && (
                <div style={{ background: "#0C0A06", border: "1px dashed #1A1814", borderRadius: 14, padding: "22px 26px", marginBottom: 20 }}>
                  <div style={{ fontSize: 9, color: "#2E2A24", letterSpacing: "0.22em", textTransform: "uppercase", marginBottom: 16 }}>Suggested Goals</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {GOAL_CATEGORIES.find(c => c.id === activeProject.id)?.examples.map((ex, i) => (
                      <button key={i}
                        onClick={() => setProjects(ps => ps.map(p => p.id !== activeProject.id ? p : { ...p, tasks: [...p.tasks, { id: Date.now() * 100 + i, text: ex, done: false, priority: "medium" }] }))}
                        style={{ background: "transparent", border: "1px solid #1C1814", color: "#3A3530", fontFamily: "inherit", fontSize: 10, letterSpacing: "0.03em", padding: "8px 14px", borderRadius: 7, cursor: "pointer", transition: "all 0.18s" }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = activeProject.color + "44"; e.currentTarget.style.color = activeProject.color; e.currentTarget.style.background = activeProject.color + "0C"; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = "#1C1814"; e.currentTarget.style.color = "#3A3530"; e.currentTarget.style.background = "transparent"; }}>
                        + {ex}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Task list */}
              <div style={{ background: "#0C0A06", border: "1px solid #141008", borderRadius: 16, overflow: "hidden" }}>
                {activeProject.tasks.length === 0 && (
                  <div style={{ padding: "44px", textAlign: "center", fontFamily: "'Instrument Serif',serif", fontStyle: "italic", fontSize: 16, color: "#1C1814" }}>
                    No goals yet — add one below
                  </div>
                )}
                {activeProject.tasks.map((task, i) => (
                  <div key={task.id} className="task-row"
                    style={{ "--a": activeProject.color, animationDelay: `${i * 0.03}s`, background: justCompleted === task.id ? `${activeProject.color}08` : undefined }}>
                    <div className={`cb${task.done ? " on" : ""}`} style={{ "--a": activeProject.color }} onClick={e => toggleTask(activeProject.id, task.id, e)}>
                      {task.done && <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L4 7.5L8.5 2.5" stroke="#080604" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <span style={{ flex: 1, fontSize: 12, color: task.done ? "#1C1814" : "#9A9490", textDecoration: task.done ? "line-through" : "none", letterSpacing: "0.02em", transition: "color 0.2s", lineHeight: 1.5 }}>{task.text}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, flexShrink: 0 }}>
                      <span className="badge" style={{ background: prioOf(task.priority).dot + "14", color: prioOf(task.priority).dot, border: `1px solid ${prioOf(task.priority).dot}22` }}>{prioOf(task.priority).label}</span>
                      <span className="focusbtn" style={{ color: focusTaskId === task.id ? "#CC9900" : "#1C1814" }} onClick={() => setFocus(task.id)}>🎯</span>
                      <span className="delbtn" onClick={() => deleteTask(activeProject.id, task.id)}>×</span>
                    </div>
                  </div>
                ))}

                {/* Add row */}
                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 24px", borderTop: "1px solid #0E0C08", background: "#0A0806" }}>
                  <div style={{ color: "#1C1814", fontSize: 20, lineHeight: 1, flexShrink: 0 }}>+</div>
                  <input className="task-input" placeholder="Add a goal or task…"
                    ref={inputRef} value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && addTask()} />
                  <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                    {["high", "medium", "low"].map(pr => (
                      <button key={pr} className="priobtn" onClick={() => setNewPriority(pr)}
                        style={{
                          background: newPriority === pr ? PRIO[pr].dot + "14" : "transparent",
                          borderColor: newPriority === pr ? PRIO[pr].dot + "55" : "#181410",
                          color: newPriority === pr ? PRIO[pr].dot : "#2A2620",
                          fontFamily: "inherit",
                        }}>
                        {PRIO[pr].label}
                      </button>
                    ))}
                  </div>
                  <button onClick={addTask} style={{
                    background: `linear-gradient(135deg,${activeProject.color},${activeProject.color}CC)`,
                    border: "none", color: "#080604", fontFamily: "inherit", fontSize: 9,
                    letterSpacing: "0.16em", padding: "10px 20px", borderRadius: 7,
                    cursor: "pointer", textTransform: "uppercase", fontWeight: 800, flexShrink: 0,
                    boxShadow: `0 4px 20px ${activeProject.color}44`,
                  }}>Add</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
