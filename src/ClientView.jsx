import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CLIENTS = {
  caro:       { name:"Caro · Nutricionista",         emoji:"🥗", primary:"#99B8B2", primarySoft:"#c8dcd9", accent:"#F791A9", text:"#171820", white:"#FFFDF8", bg:"#E9E7EA", cardBg:"#FFFDF8", btnBg:"#99B8B2",  btnText:"#FFFDF8" },
  basile:     { name:"Distribuidora Basile",          emoji:"📦", primary:"#F6D522", primarySoft:"#FBEA8C", accent:"#EF1C16", text:"#111111", white:"#FFFEF5", bg:"#FFF8D0", cardBg:"#FFFFF8", btnBg:"#EF1C16",  btnText:"#FFFFFF" },
  suitehouse: { name:"Suite House Cariló",            emoji:"🌲", primary:"#AAB8A3", primarySoft:"#d0daca", accent:"#928359", text:"#1A1A1A", white:"#FFFFFF", bg:"#f5f3ef", cardBg:"#FFFFFF", btnBg:"#928359",  btnText:"#FFFFFF" },
  valeria:    { name:"Nutrivaliosa · Valeria",          emoji:"🌿", primary:"#A87DC2", primarySoft:"#D4B8E0", accent:"#F4A0C0", text:"#2D1654", white:"#FFFAFF", bg:"#F5EEFF", cardBg:"#FFFAFF", btnBg:"#A87DC2",  btnText:"#FFFFFF" },
  mariano:    { name:"Mariano Magicaldreamakers",     emoji:"🏰", primary:"#6FA8DC", primarySoft:"#bcd9f0", accent:"#E8B84B", text:"#1c2330", white:"#FFFFFF", bg:"#EFF5FB", cardBg:"#FFFFFF", btnBg:"#6FA8DC",  btnText:"#FFFFFF" },
};

const STATUS_COLORS = {
  "Idea":"#a78bfa","Borrador":"#64748b","En producción":"#0ea5e9",
  "Para revisión interna":"#a855f7","Enviado al cliente":"#f59e0b",
  "Cambios solicitados":"#ef4444","Aprobado":"#22c55e",
  "Programado":"#6366f1","Publicado":"#111827",
};

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DOW_SHORT = ["L","M","X","J","V","S","D"];

function getDayName(date) {
  if (!date) return "Sin fecha";
  return new Date(date + "T00:00:00").toLocaleDateString("es-AR", { weekday:"long", day:"numeric", month:"long" });
}
function todayISO() { return new Date().toISOString().slice(0, 10); }

// Global responsive CSS (injected once)
const MOBILE_CSS = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  /* Scrolling */
  html, body { height: 100%; overflow-x: hidden; }
  body { overscroll-behavior-y: contain; }

  /* Tap highlight */
  * { -webkit-tap-highlight-color: transparent; }

  /* Modal overlay — center on desktop, bottom sheet on mobile */
  .cv-modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.5);
    z-index: 999; display: flex;
    justify-content: center; align-items: center; padding: 16px;
  }
  .cv-modal-inner {
    background: var(--white); border-radius: 16px; width: 100%;
    max-width: 640px; max-height: 92vh; overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0,0,0,0.25);
  }
  .cv-modal-header {
    padding: 16px 20px; border-radius: 16px 16px 0 0;
    display: flex; justify-content: space-between; align-items: center;
    position: sticky; top: 0; z-index: 1;
  }
  .cv-modal-body { padding: 20px; }

  /* Day panel — side on desktop, full-screen on mobile */
  .cv-daypanel {
    background: var(--white); width: 100%; max-width: 420px;
    height: 100%; overflow-y: auto;
    box-shadow: -8px 0 40px rgba(0,0,0,0.2);
  }

  /* Calendar cell */
  .cv-cal-cell {
    min-height: 80px; border-radius: 10px; padding: 6px 7px;
    transition: all 0.15s;
  }

  /* List card */
  .cv-list-card {
    border-radius: 12px; padding: 14px 16px; margin-bottom: 10px;
    cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    transition: all 0.15s; active-scale: 0.98;
  }

  /* Action buttons */
  .cv-action-row {
    display: flex; gap: 10px; margin-bottom: 20px;
    padding: 14px 16px; border-radius: 10px;
  }
  .cv-action-btn {
    flex: 1; padding: 14px 10px; border-radius: 10px;
    font-weight: 700; cursor: pointer; font-size: 15px;
    min-height: 50px;
  }

  /* Comment input row */
  .cv-comment-row { display: flex; gap: 8px; margin-top: 12px; }
  .cv-comment-input {
    flex: 1; padding: 12px; border-radius: 10px;
    font-size: 14px; outline: none; min-height: 44px;
  }
  .cv-comment-send {
    padding: 12px 18px; border-radius: 10px; border: none;
    font-weight: 700; cursor: pointer; font-size: 14px; min-height: 44px;
  }

  @media (max-width: 640px) {
    /* Modal → bottom sheet */
    .cv-modal-overlay {
      align-items: flex-end !important;
      padding: 0 !important;
    }
    .cv-modal-inner {
      border-radius: 20px 20px 0 0 !important;
      max-width: 100% !important;
      max-height: 94dvh !important;
      padding-bottom: env(safe-area-inset-bottom);
    }
    .cv-modal-header {
      border-radius: 20px 20px 0 0 !important;
    }
    .cv-modal-body {
      padding: 16px !important;
    }

    /* Day panel → full width */
    .cv-daypanel {
      max-width: 100% !important;
    }

    /* Calendar → compact cells */
    .cv-cal-cell {
      min-height: 52px !important;
      padding: 4px 3px !important;
      border-radius: 8px !important;
    }
    .cv-cal-label { font-size: 12px !important; }
    .cv-cal-type-tag { display: none !important; }
    .cv-cal-story-tag { display: none !important; }
  }
`;

export default function ClientView() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [section, setSection] = useState("all");
  const [viewMode, setViewMode] = useState("month");
  const [currentMonth, setCurrentMonth] = useState(todayISO().slice(0, 7));
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPanel, setShowDayPanel] = useState(false);
  const [notif, setNotif] = useState(null);

  const client = CLIENTS[clientId];

  useEffect(() => {
    const auth = sessionStorage.getItem(`auth_${clientId}`);
    if (!auth) { navigate(`/cliente/${clientId}`); return; }
    loadItems();
  }, [clientId]);

  async function loadItems() {
    const { data, error } = await supabase
      .from("contenidos").select("*")
      .eq("account_id", clientId).order("date");
    if (!error && data) {
      const mapped = data.map(r => ({
        id: r.id, accountId: r.account_id, section: r.section, type: r.type,
        date: r.date, week: r.week, theme: r.theme, objective: r.objective,
        development: r.development, script: r.script, copy: r.copy,
        content: r.content, status: r.status, slides: r.slides || [],
        clientComments: r.client_comments || [],
      }));
      setItems(mapped);
      // If no items this month, jump to the earliest month that has content
      const today = todayISO().slice(0, 7);
      const hasThisMonth = mapped.some(i => i.date?.startsWith(today));
      if (!hasThisMonth && mapped.length > 0) {
        const months = [...new Set(mapped.map(i => i.date?.slice(0, 7)).filter(Boolean))].sort();
        // prefer upcoming months first, fallback to most recent past
        const future = months.filter(m => m >= today);
        setCurrentMonth(future.length > 0 ? future[0] : months[months.length - 1]);
      }
    }
    setLoading(false);
  }

  function showNotif(msg) { setNotif(msg); setTimeout(() => setNotif(null), 2500); }

  async function approveItem() {
    const updated = { ...selected, status: "Aprobado" };
    await supabase.from("contenidos").update({ status: "Aprobado" }).eq("id", selected.id);
    setItems(prev => prev.map(i => i.id === selected.id ? updated : i));
    setSelected(updated);
    showNotif("✅ Contenido aprobado");
  }

  async function requestChanges() {
    const updated = { ...selected, status: "Cambios solicitados" };
    await supabase.from("contenidos").update({ status: "Cambios solicitados" }).eq("id", selected.id);
    setItems(prev => prev.map(i => i.id === selected.id ? updated : i));
    setSelected(updated);
    showNotif("✏️ Cambios solicitados enviados");
  }

  async function sendComment() {
    if (!comment.trim()) return;
    const newComment = { id: `cc_${Date.now()}`, author: "Cliente", text: comment, date: new Date().toLocaleDateString("es-AR") };
    const updatedComments = [...(selected.clientComments || []), newComment];
    await supabase.from("contenidos").update({ client_comments: updatedComments }).eq("id", selected.id);
    const updated = { ...selected, clientComments: updatedComments };
    setItems(prev => prev.map(i => i.id === selected.id ? updated : i));
    setSelected(updated);
    setComment("");
    showNotif("💬 Comentario enviado");
  }

  if (!client) return null;
  const B = client;

  const visible = items.filter(i => section === "all" ? true : i.section === section);
  const grouped = visible.reduce((acc, item) => {
    const k = item.date || "Sin fecha";
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});

  // ── MONTH CALENDAR ────────────────────────────────────────────────────────────
  function renderMonthCalendar() {
    const [year, month] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const startDow = (firstDay.getDay() + 6) % 7;
    const totalDays = lastDay.getDate();
    const cells = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= totalDays; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    function dayStr(d) { return d ? `${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}` : null; }

    function DayCell({ d }) {
      if (!d) return <div className="cv-cal-cell" style={{ background: "transparent" }} />;
      const ds = dayStr(d);
      const dayItems = items.filter(i => i.date === ds);
      const posts = dayItems.filter(i => i.section === "post");
      const stories = dayItems.filter(i => i.section === "story");
      const isToday = ds === todayISO();
      const hasPending = dayItems.some(i => i.status === "Enviado al cliente" || i.status === "Cambios solicitados");
      const hasApproved = dayItems.some(i => i.status === "Aprobado" || i.status === "Programado");
      const hasPublished = dayItems.some(i => i.status === "Publicado");
      const dotColor = hasPublished ? "#6366f1" : hasApproved ? "#22c55e" : hasPending ? "#f59e0b" : null;

      return (
        <div
          className="cv-cal-cell"
          onClick={() => { if (dayItems.length > 0) { setSelectedDate(ds); setShowDayPanel(true); } }}
          style={{
            background: dayItems.length > 0 ? B.cardBg : "transparent",
            border: isToday ? `2px solid ${B.primary}` : `1px solid ${dayItems.length > 0 ? B.primary + "50" : "#e5e7eb"}`,
            cursor: dayItems.length > 0 ? "pointer" : "default",
          }}
          onMouseEnter={e => { if (dayItems.length > 0) e.currentTarget.style.boxShadow = `0 4px 14px ${B.primary}30`; }}
          onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
        >
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom: 3 }}>
            <span
              className="cv-cal-label"
              style={{
                fontWeight: isToday ? 800 : 600, fontSize: 13,
                color: isToday ? B.primary : B.text,
                background: isToday ? `${B.primary}20` : "transparent",
                borderRadius: "50%", width: 22, height: 22,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >{d}</span>
            {dotColor && <div style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, flexShrink: 0 }} />}
          </div>
          {posts.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap: 2, marginBottom: 2 }}>
              {[...new Set(posts.map(i => i.type))].map(type => (
                <span key={type} className="cv-cal-type-tag" style={{ fontSize:9, padding:"1px 5px", borderRadius:8, background:`${B.primary}40`, color:B.text, fontWeight:700 }}>
                  {type}{posts.filter(i => i.type === type).length > 1 ? ` ×${posts.filter(i=>i.type===type).length}` : ""}
                </span>
              ))}
            </div>
          )}
          {stories.length > 0 && (
            <span className="cv-cal-story-tag" style={{ fontSize:9, padding:"1px 5px", borderRadius:8, background:`${B.accent}30`, color:B.text, fontWeight:700 }}>
              Story{stories.length > 1 ? ` ×${stories.length}` : ""}
            </span>
          )}
        </div>
      );
    }

    return (
      <div>
        {/* Nav */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
          <button
            onClick={() => { const d = new Date(year, month-2, 1); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`); }}
            style={{ width:40, height:40, borderRadius:10, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:700, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
          >‹</button>
          <h2 style={{ flex:1, margin:0, fontSize:17, fontFamily:"'Georgia',serif", fontWeight:800, textAlign:"center" }}>
            {MONTH_NAMES[month - 1]} {year}
          </h2>
          <button
            onClick={() => { const d = new Date(year, month, 1); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`); }}
            style={{ width:40, height:40, borderRadius:10, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:700, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}
          >›</button>
          <button
            onClick={() => setCurrentMonth(todayISO().slice(0, 7))}
            style={{ padding:"6px 12px", borderRadius:10, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:600, cursor:"pointer", fontSize:12, flexShrink:0 }}
          >Hoy</button>
        </div>

        {/* Legend */}
        <div style={{ display:"flex", gap:12, marginBottom:10, fontSize:11, color:"#888", flexWrap:"wrap" }}>
          {[["#22c55e","Aprobado"],["#f59e0b","Pendiente"],["#6366f1","Publicado"]].map(([color, label]) => (
            <span key={label} style={{ display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:7, height:7, borderRadius:"50%", background:color, display:"inline-block" }}/> {label}
            </span>
          ))}
        </div>

        {/* DOW header */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
          {DOW_SHORT.map(d => (
            <div key={d} style={{ textAlign:"center", fontSize:11, fontWeight:800, color:"#bbb", padding:"4px 0", textTransform:"uppercase" }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3, marginBottom:3 }}>
            {week.map((d, di) => <DayCell key={di} d={d} />)}
          </div>
        ))}
      </div>
    );
  }

  // ── DAY PANEL ─────────────────────────────────────────────────────────────────
  function renderDayPanel() {
    if (!showDayPanel || !selectedDate) return null;
    const dayItems = items.filter(i => i.date === selectedDate);
    const posts = dayItems.filter(i => i.section === "post");
    const stories = dayItems.filter(i => i.section === "story");

    return (
      <div
        style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:900, display:"flex", justifyContent:"flex-end" }}
        onClick={e => e.target === e.currentTarget && setShowDayPanel(false)}
      >
        <div className="cv-daypanel">
          <div style={{ padding:"18px 20px", background:B.primary, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:`${B.btnText}90`, fontSize:11, marginBottom:2, textTransform:"uppercase", letterSpacing:1 }}>Contenidos del día</div>
              <div style={{ color:B.btnText, fontWeight:800, fontSize:16, fontFamily:"'Georgia',serif" }}>{getDayName(selectedDate)}</div>
            </div>
            <button
              onClick={() => setShowDayPanel(false)}
              style={{ width:38, height:38, borderRadius:10, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center" }}
            >✕</button>
          </div>
          <div style={{ padding:16 }}>
            {[["Posts & Reels", posts, B.primary], ["Historias", stories, B.accent]].map(([label, arr, color]) =>
              arr.length > 0 && (
                <div key={label} style={{ marginBottom:16 }}>
                  <div style={{ fontSize:11, fontWeight:800, color, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>{label} ({arr.length})</div>
                  {arr.map(item => (
                    <div
                      key={item.id}
                      onClick={() => { setShowDayPanel(false); setSelected(item); }}
                      style={{ background:B.cardBg, borderRadius:12, padding:"14px 16px", marginBottom:8, cursor:"pointer", border:`1px solid ${color}35`, borderLeft:`4px solid ${STATUS_COLORS[item.status]||"#ccc"}` }}
                    >
                      <div style={{ fontWeight:700, fontSize:14, marginBottom:4 }}>{item.theme}</div>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                        <span style={{ fontSize:11, background:`${color}25`, color, padding:"2px 8px", borderRadius:6, fontWeight:600 }}>{item.type}</span>
                        <span style={{ fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status] }}>{item.status}</span>
                      </div>
                      <div style={{ fontSize:12, color, fontWeight:600, marginTop:6 }}>Ver detalle →</div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── CONTENT BLOCKS ────────────────────────────────────────────────────────────
  function renderContent(item) {
    const isStory = item.section === "story";

    const Block = ({ icon, label, text, bg, border, color }) => !text?.trim() ? null : (
      <div style={{ marginBottom:12, background:bg, border:`1px solid ${border}`, borderRadius:12, padding:"12px 14px" }}>
        <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color, marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
          {icon} {label}
        </div>
        <div style={{ fontSize:14, whiteSpace:"pre-wrap", lineHeight:1.7, color:B.text }}>{text}</div>
      </div>
    );

    return (
      <>
        <Block icon="🎯" label="Objetivo" text={item.objective} bg={`${B.accent}12`} border={`${B.accent}30`} color={B.accent} />
        <Block icon="🎬" label={isStory ? "Guion" : "Hook / Título"} text={item.script} bg={`${B.primary}10`} border={`${B.primary}25`} color={B.primary} />
        <Block icon="📝" label={isStory ? "Descripción" : "Desarrollo"} text={item.development} bg="#f8f9fa" border="#e5e7eb" color="#666" />
        <Block icon="📸" label="Recursos / Tomas" text={item.content} bg={`${B.primarySoft}30`} border={`${B.primarySoft}60`} color={B.text} />
        <Block icon="📣" label="Copy / CTA" text={item.copy} bg={`${B.primary}15`} border={`${B.primary}35`} color={B.primary} />
      </>
    );
  }

  // ── LOADING ───────────────────────────────────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ textAlign:"center", color:B.btnText }}>
        <div style={{ fontSize:40, marginBottom:12 }}>{B.emoji}</div>
        <div style={{ fontSize:17, fontWeight:700 }}>Cargando tu calendario…</div>
      </div>
    </div>
  );

  // ── RENDER ────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:B.bg, fontFamily:"'Trebuchet MS',sans-serif", color:B.text }}>
      <style>{MOBILE_CSS}</style>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`, padding:"16px 20px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:22, marginBottom:2 }}>{B.emoji}</div>
          <div style={{ fontWeight:800, fontSize:17, color:B.btnText, fontFamily:"'Georgia',serif" }}>{B.name}</div>
          <div style={{ fontSize:12, color:`${B.btnText}cc` }}>Tu calendario de contenido</div>
        </div>
        <button
          onClick={() => { sessionStorage.removeItem(`auth_${clientId}`); navigate(`/cliente/${clientId}`); }}
          style={{ padding:"8px 14px", borderRadius:10, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:12, fontWeight:600 }}
        >
          Salir
        </button>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"20px 14px", paddingBottom:"calc(20px + env(safe-area-inset-bottom))" }}>

        {/* View mode tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:18 }}>
          {[["month","📅 Mes"],["list","📋 Lista"]].map(([mode, label]) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{ padding:"10px 20px", borderRadius:20, border:`1.5px solid ${viewMode===mode ? B.primary : "#ddd"}`, background:viewMode===mode ? B.primary : "#fff", color:viewMode===mode ? B.btnText : "#777", fontWeight:viewMode===mode ? 700 : 400, fontSize:14, cursor:"pointer", transition:"all 0.2s", minHeight:44 }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Section filter (list only) */}
        {viewMode === "list" && (
          <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
            {[["all","Todo"],["post","Posts"],["story","Stories"]].map(([val, label]) => (
              <button
                key={val}
                onClick={() => setSection(val)}
                style={{ padding:"9px 16px", borderRadius:20, border:`1.5px solid ${section===val ? B.primary : "#ddd"}`, background:section===val ? B.primary : "#fff", color:section===val ? B.btnText : "#777", fontWeight:section===val ? 700 : 400, fontSize:13, cursor:"pointer", minHeight:40 }}
              >
                {label}
              </button>
            ))}
            <div style={{ marginLeft:"auto", fontSize:13, color:"#aaa" }}>{visible.length} pieza{visible.length !== 1 ? "s" : ""}</div>
          </div>
        )}

        {/* Content */}
        {viewMode === "month" && renderMonthCalendar()}

        {viewMode === "list" && (
          <>
            {Object.keys(grouped).sort().map(date => (
              <div key={date}>
                <div style={{ fontSize:11, fontWeight:800, color:B.primary, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, marginTop:18 }}>
                  — {getDayName(date)}
                </div>
                {grouped[date].map(item => {
                  const isStory = item.section === "story";
                  return (
                    <div
                      key={item.id}
                      className="cv-list-card"
                      onClick={() => setSelected(item)}
                      style={{ background:B.cardBg, border:`1px solid ${isStory ? B.accent+"50" : B.primary+"35"}`, borderLeft:`4px solid ${isStory ? B.accent : STATUS_COLORS[item.status]||"#ccc"}` }}
                    >
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:10 }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontWeight:700, fontSize:15, marginBottom:5 }}>{item.theme || "Sin título"}</div>
                          <span style={{ fontSize:12, background:isStory ? `${B.accent}25` : `${B.primary}20`, color:isStory ? B.accent : B.primary, padding:"2px 8px", borderRadius:6, fontWeight:600 }}>
                            {isStory ? "Story" : item.type}
                          </span>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status], border:`1px solid ${STATUS_COLORS[item.status]}40`, flexShrink:0, whiteSpace:"nowrap" }}>
                          {item.status}
                        </span>
                      </div>
                      {(item.clientComments || []).length > 0 && (
                        <div style={{ fontSize:12, color:B.accent, marginTop:8, fontWeight:600 }}>
                          💬 {item.clientComments.length} comentario{item.clientComments.length !== 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
            {visible.length === 0 && (
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#aaa" }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📭</div>
                <div style={{ fontSize:15 }}>No hay contenidos todavía</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="cv-modal-overlay" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="cv-modal-inner" style={{ "--white": B.white }}>
            {/* Modal header */}
            <div className="cv-modal-header" style={{ background: B.primary }}>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:11, color:`${B.btnText}90`, marginBottom:2 }}>
                  {selected.section === "story" ? "Story" : selected.type} · {selected.date}
                </div>
                <div style={{ fontWeight:800, fontSize:16, color:B.btnText, fontFamily:"'Georgia',serif", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                  {selected.theme}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                style={{ width:38, height:38, borderRadius:10, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:18, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginLeft:10 }}
              >✕</button>
            </div>

            {/* Modal body */}
            <div className="cv-modal-body">
              {/* Status badge */}
              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:20, background:`${STATUS_COLORS[selected.status]}20`, color:STATUS_COLORS[selected.status], border:`1px solid ${STATUS_COLORS[selected.status]}40` }}>
                  {selected.status}
                </span>
              </div>

              {/* Action buttons — always visible unless Publicado */}
              {selected.status !== "Publicado" && (
                <div className="cv-action-row" style={{ background:`${B.primary}12`, border:`1px solid ${B.primary}30` }}>
                  <button
                    onClick={approveItem}
                    className="cv-action-btn"
                    style={{ border:"none", background:"#22c55e", color:"#fff" }}
                  >✅ Aprobar</button>
                  <button
                    onClick={requestChanges}
                    className="cv-action-btn"
                    style={{ border:"1.5px solid #ef4444", background:"transparent", color:"#ef4444" }}
                  >✏️ Pedir cambios</button>
                </div>
              )}
              {selected.status === "Publicado" && (
                <div style={{ padding:"12px 16px", borderRadius:10, background:"#f0fdf4", border:"1px solid #86efac", marginBottom:16, fontSize:14, fontWeight:600, color:"#166534" }}>
                  ✅ Este contenido ya está publicado
                </div>
              )}

              {/* Content blocks */}
              {renderContent(selected)}

              {/* Slides */}
              {selected.slides?.length > 0 && (
                <div style={{ marginBottom:14 }}>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:8 }}>
                    Slides ({selected.slides.length})
                  </div>
                  {selected.slides.map((slide, i) => (
                    <div key={slide.id || i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:8 }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", background:B.primary, color:B.btnText, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0, marginTop:1 }}>{i + 1}</div>
                      <div style={{ fontSize:14, lineHeight:1.5 }}>{slide.text}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Comments */}
              <div style={{ borderTop:`1px solid ${B.primary}25`, paddingTop:16 }}>
                <div style={{ fontSize:11, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:10 }}>
                  Comentarios
                </div>
                {(selected.clientComments || []).length === 0 && (
                  <div style={{ fontSize:13, color:"#bbb", marginBottom:12 }}>Sin comentarios aún.</div>
                )}
                {(selected.clientComments || []).map((c, i) => (
                  <div key={c.id || i} style={{ background:`${B.accent}15`, border:`1px solid ${B.accent}30`, borderRadius:10, padding:"10px 13px", marginBottom:8 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:B.accent, marginBottom:4 }}>{c.author} · {c.date}</div>
                    <div style={{ fontSize:14, lineHeight:1.55 }}>{c.text}</div>
                  </div>
                ))}
                <div className="cv-comment-row">
                  <input
                    className="cv-comment-input"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && sendComment()}
                    placeholder="Dejá tu comentario…"
                    style={{ border:`1.5px solid ${B.primary}`, color:B.text, background:B.white }}
                  />
                  <button
                    className="cv-comment-send"
                    onClick={sendComment}
                    style={{ background:B.btnBg, color:B.btnText }}
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderDayPanel()}

      {/* Toast */}
      {notif && (
        <div style={{ position:"fixed", bottom:"calc(24px + env(safe-area-inset-bottom))", left:"50%", transform:"translateX(-50%)", background:"#1e1b4b", color:"#fff", padding:"12px 22px", borderRadius:12, fontSize:14, fontWeight:700, boxShadow:"0 4px 20px rgba(0,0,0,0.25)", zIndex:9999, whiteSpace:"nowrap" }}>
          {notif}
        </div>
      )}
    </div>
  );
}
