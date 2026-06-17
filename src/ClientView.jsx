import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const CLIENTS = {
  caro: { name:"Caro · Nutricionista", emoji:"🥗", primary:"#99B8B2", primarySoft:"#c8dcd9", accent:"#F791A9", text:"#171820", white:"#FFFDF8", bg:"#E9E7EA", cardBg:"#FFFDF8", btnBg:"#99B8B2", btnText:"#FFFDF8" },
  basile: { name:"Distribuidora Basile", emoji:"📦", primary:"#F6D522", primarySoft:"#FBEA8C", accent:"#EF1C16", text:"#111111", white:"#FFFEF5", bg:"#FFF8D0", cardBg:"#FFFFF8", btnBg:"#EF1C16", btnText:"#FFFFFF" },
  suitehouse: { name:"Suite House Cariló", emoji:"🌲", primary:"#AAB8A3", primarySoft:"#d0daca", accent:"#928359", text:"#1A1A1A", white:"#FFFFFF", bg:"#f5f3ef", cardBg:"#FFFFFF", btnBg:"#928359", btnText:"#FFFFFF" },
  mariano: { name:"Mariano Magicaldreamakers", emoji:"🏰", primary:"#6FA8DC", primarySoft:"#bcd9f0", accent:"#E8B84B", text:"#1c2330", white:"#FFFFFF", bg:"#EFF5FB", cardBg:"#FFFFFF", btnBg:"#6FA8DC", btnText:"#FFFFFF" },
};

const STATUS_COLORS = { "Idea":"#a78bfa","Borrador":"#64748b","En producción":"#0ea5e9","Para revisión interna":"#a855f7","Enviado al cliente":"#f59e0b","Cambios solicitados":"#ef4444","Aprobado":"#22c55e","Programado":"#6366f1","Publicado":"#111827" };
const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function getDayName(date) { if(!date) return "Sin fecha"; return new Date(date+"T00:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}); }
function todayISO() { return new Date().toISOString().slice(0,10); }

export default function ClientView() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [section, setSection] = useState("all");
  const [viewMode, setViewMode] = useState("month"); // month | list
  const [currentMonth, setCurrentMonth] = useState(todayISO().slice(0,7));
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
    const { data, error } = await supabase.from("contenidos").select("*").eq("account_id", clientId).order("date");
    if (!error && data) {
      setItems(data.map(r => ({
        id: r.id, accountId: r.account_id, section: r.section, type: r.type,
        date: r.date, week: r.week, theme: r.theme, script: r.script, copy: r.copy,
        content: r.content, status: r.status, slides: r.slides || [],
        clientComments: r.client_comments || [],
      })));
    }
    setLoading(false);
  }

  function showNotif(msg, type="success") { setNotif({msg,type}); setTimeout(()=>setNotif(null),2500); }

  async function approveItem() {
    const updated = { ...selected, status: "Aprobado" };
    await supabase.from("contenidos").update({ status: "Aprobado" }).eq("id", selected.id);
    setItems(prev => prev.map(i => i.id === selected.id ? updated : i));
    setSelected(updated);
    showNotif("Contenido aprobado");
  }

  async function requestChanges() {
    const updated = { ...selected, status: "Cambios solicitados" };
    await supabase.from("contenidos").update({ status: "Cambios solicitados" }).eq("id", selected.id);
    setItems(prev => prev.map(i => i.id === selected.id ? updated : i));
    setSelected(updated);
    showNotif("Cambios solicitados enviados");
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
    showNotif("Comentario enviado");
  }

  if (!client) return null;
  const B = client;

  const visible = items.filter(i => section === "all" ? true : i.section === section);
  const grouped = visible.reduce((acc, item) => { const k = item.date||"Sin fecha"; acc[k]=acc[k]||[]; acc[k].push(item); return acc; }, {});

  // ── MONTH CALENDAR ──────────────────────────────────────────────────────────
  function renderMonthCalendar() {
    const [year, month] = currentMonth.split("-").map(Number);
    const firstDay = new Date(year, month-1, 1);
    const lastDay = new Date(year, month, 0);
    const startDow = (firstDay.getDay()+6)%7;
    const totalDays = lastDay.getDate();
    const cells = [];
    for(let i=0;i<startDow;i++) cells.push(null);
    for(let d=1;d<=totalDays;d++) cells.push(d);
    while(cells.length%7!==0) cells.push(null);
    const weeks = [];
    for(let i=0;i<cells.length;i+=7) weeks.push(cells.slice(i,i+7));
    const DOW = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

    function dayStr(d) { return d?`${year}-${String(month).padStart(2,"0")}-${String(d).padStart(2,"0")}`:null; }

    function DayCell({d}) {
      if(!d) return <div style={{minHeight:80,borderRadius:10,background:"transparent"}}/>;
      const ds = dayStr(d);
      const dayItems = items.filter(i=>i.date===ds);
      const posts = dayItems.filter(i=>i.section==="post");
      const stories = dayItems.filter(i=>i.section==="story");
      const isToday = ds===todayISO();
      const hasPending = dayItems.some(i=>i.status==="Enviado al cliente"||i.status==="Cambios solicitados");
      const hasApproved = dayItems.some(i=>i.status==="Aprobado"||i.status==="Programado");
      const hasPublished = dayItems.some(i=>i.status==="Publicado");
      const dotColor = hasPublished?"#6366f1":hasApproved?"#22c55e":hasPending?"#f59e0b":"transparent";

      return (
        <div onClick={()=>{ if(dayItems.length>0){setSelectedDate(ds);setShowDayPanel(true);} }}
          style={{ minHeight:80, borderRadius:10, padding:"6px 7px", background:dayItems.length>0?B.cardBg:"transparent", border:isToday?`2px solid ${B.primary}`:`1px solid ${dayItems.length>0?B.primary+"50":"#e5e7eb"}`, cursor:dayItems.length>0?"pointer":"default", transition:"all 0.15s" }}
          onMouseEnter={e=>{ if(dayItems.length>0) e.currentTarget.style.boxShadow=`0 4px 14px ${B.primary}30`; }}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:4 }}>
            <span style={{ fontWeight:isToday?800:600, fontSize:13, color:isToday?B.primary:B.text, background:isToday?`${B.primary}20`:"transparent", borderRadius:"50%", width:22, height:22, display:"flex", alignItems:"center", justifyContent:"center" }}>{d}</span>
            {dotColor!=="transparent"&&<div style={{width:7,height:7,borderRadius:"50%",background:dotColor}}/>}
          </div>
          {posts.length>0&&(
            <div style={{ display:"flex", flexWrap:"wrap", gap:2, marginBottom:2 }}>
              {[...new Set(posts.map(i=>i.type))].map(type=>(
                <span key={type} style={{ fontSize:9, padding:"1px 5px", borderRadius:8, background:`${B.primary}40`, color:B.text, fontWeight:700 }}>
                  {type} {posts.filter(i=>i.type===type).length>1?`×${posts.filter(i=>i.type===type).length}`:""}
                </span>
              ))}
            </div>
          )}
          {stories.length>0&&(
            <span style={{ fontSize:9, padding:"1px 5px", borderRadius:8, background:`${B.accent}30`, color:B.text, fontWeight:700 }}>
              Story {stories.length>1?`×${stories.length}`:""}
            </span>
          )}
        </div>
      );
    }

    return (
      <div>
        {/* Nav */}
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:16 }}>
          <button onClick={()=>{const d=new Date(year,month-2,1);setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}}
            style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:700, cursor:"pointer", fontSize:16 }}>‹</button>
          <h2 style={{ margin:0, fontSize:18, fontFamily:"'Georgia',serif", fontWeight:800 }}>{MONTH_NAMES[month-1]} {year}</h2>
          <button onClick={()=>{const d=new Date(year,month,1);setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`);}}
            style={{ padding:"6px 14px", borderRadius:8, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:700, cursor:"pointer", fontSize:16 }}>›</button>
          <button onClick={()=>setCurrentMonth(todayISO().slice(0,7))}
            style={{ padding:"5px 12px", borderRadius:8, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:600, cursor:"pointer", fontSize:12 }}>Hoy</button>
        </div>

        {/* Leyenda */}
        <div style={{ display:"flex", gap:14, marginBottom:12, fontSize:11, color:"#888", flexWrap:"wrap" }}>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:12, height:12, borderRadius:3, background:`${B.primary}40`, display:"inline-block" }}/> Posts & Reels
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:12, height:12, borderRadius:3, background:`${B.accent}30`, display:"inline-block" }}/> Historias
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#22c55e", display:"inline-block" }}/> Aprobado
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#f59e0b", display:"inline-block" }}/> Pendiente
          </span>
          <span style={{ display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#6366f1", display:"inline-block" }}/> Publicado
          </span>
        </div>

        {/* Header días */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
          {DOW.map(d=><div key={d} style={{ textAlign:"center", fontSize:10, fontWeight:800, color:"#aaa", padding:"4px 0", textTransform:"uppercase", letterSpacing:1 }}>{d}</div>)}
        </div>

        {/* Grilla */}
        {weeks.map((week,wi)=>(
          <div key={wi} style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, marginBottom:4 }}>
            {week.map((d,di)=><DayCell key={di} d={d}/>)}
          </div>
        ))}
      </div>
    );
  }

  // ── DAY PANEL ───────────────────────────────────────────────────────────────
  function renderDayPanel() {
    if(!showDayPanel||!selectedDate) return null;
    const dayItems = items.filter(i=>i.date===selectedDate);
    const posts = dayItems.filter(i=>i.section==="post");
    const stories = dayItems.filter(i=>i.section==="story");

    return (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:900, display:"flex", justifyContent:"flex-end" }}
        onClick={e=>e.target===e.currentTarget&&setShowDayPanel(false)}>
        <div style={{ background:B.white, width:"100%", maxWidth:420, height:"100%", overflowY:"auto", boxShadow:"-8px 0 40px rgba(0,0,0,0.2)" }}>
          <div style={{ padding:"18px 20px", background:B.primary, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ color:`${B.btnText}90`, fontSize:11, marginBottom:2, textTransform:"uppercase", letterSpacing:1 }}>Contenidos del día</div>
              <div style={{ color:B.btnText, fontWeight:800, fontSize:16, fontFamily:"'Georgia',serif" }}>{getDayName(selectedDate)}</div>
            </div>
            <button onClick={()=>setShowDayPanel(false)} style={{ padding:"6px 11px", borderRadius:8, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:16 }}>✕</button>
          </div>
          <div style={{ padding:16 }}>
            {posts.length>0&&(
              <div style={{ marginBottom:16 }}>
                <div style={{ fontSize:11, fontWeight:800, color:B.primary, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>Posts & Reels ({posts.length})</div>
                {posts.map(item=>(
                  <div key={item.id} onClick={()=>{setShowDayPanel(false);setSelected(item);}}
                    style={{ background:B.cardBg, borderRadius:10, padding:"12px 14px", marginBottom:8, cursor:"pointer", border:`1px solid ${B.primary}35`, borderLeft:`4px solid ${STATUS_COLORS[item.status]||"#ccc"}` }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{item.theme}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:10, background:`${B.primary}25`, color:B.primary, padding:"1px 7px", borderRadius:6, fontWeight:600 }}>{item.type}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status] }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize:11, color:B.primary, fontWeight:600, marginTop:6 }}>Ver detalle →</div>
                  </div>
                ))}
              </div>
            )}
            {stories.length>0&&(
              <div>
                <div style={{ fontSize:11, fontWeight:800, color:B.accent, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 }}>Historias ({stories.length})</div>
                {stories.map(item=>(
                  <div key={item.id} onClick={()=>{setShowDayPanel(false);setSelected(item);}}
                    style={{ background:B.cardBg, borderRadius:10, padding:"12px 14px", marginBottom:8, cursor:"pointer", border:`1px solid ${B.accent}35`, borderLeft:`4px solid ${B.accent}` }}>
                    <div style={{ fontWeight:700, fontSize:13, marginBottom:3 }}>{item.theme}</div>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:10, background:`${B.accent}25`, color:B.accent, padding:"1px 7px", borderRadius:6, fontWeight:600 }}>{item.type}</span>
                      <span style={{ fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status] }}>{item.status}</span>
                    </div>
                    <div style={{ fontSize:11, color:B.accent, fontWeight:600, marginTop:6 }}>Ver detalle →</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (loading) return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color:B.btnText, fontSize:18, fontWeight:700 }}>Cargando tu calendario...</div>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", background:B.bg, fontFamily:"'Trebuchet MS',sans-serif", color:B.text }}>
      <style>{`*{box-sizing:border-box;margin:0;padding:0}`}</style>

      {/* Header */}
      <div style={{ background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`, padding:"20px 24px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:24, marginBottom:2 }}>{B.emoji}</div>
          <div style={{ fontWeight:800, fontSize:18, color:B.btnText, fontFamily:"'Georgia',serif" }}>{B.name}</div>
          <div style={{ fontSize:13, color:`${B.btnText}cc` }}>Tu calendario de contenido</div>
        </div>
        <button onClick={()=>{ sessionStorage.removeItem(`auth_${clientId}`); navigate(`/cliente/${clientId}`); }}
          style={{ padding:"8px 16px", borderRadius:8, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:12, fontWeight:600 }}>
          Cerrar sesión
        </button>
      </div>

      <div style={{ maxWidth:760, margin:"0 auto", padding:"24px 16px" }}>
        {/* View mode tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["month","📅 Mes"],["list","📋 Lista"]].map(([mode,label])=>(
            <button key={mode} onClick={()=>setViewMode(mode)}
              style={{ padding:"8px 18px", borderRadius:20, border:`1.5px solid ${viewMode===mode?B.primary:"#ddd"}`, background:viewMode===mode?B.primary:"#fff", color:viewMode===mode?B.btnText:"#777", fontWeight:viewMode===mode?700:400, fontSize:13, cursor:"pointer", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Section filter — only for list */}
        {viewMode==="list"&&(
          <div style={{ display:"flex", gap:8, marginBottom:20, flexWrap:"wrap", alignItems:"center" }}>
            {[["all","Todo"],["post","Posts & Reels"],["story","Historias"]].map(([val,label])=>(
              <button key={val} onClick={()=>setSection(val)}
                style={{ padding:"7px 16px", borderRadius:20, border:`1.5px solid ${section===val?B.primary:"#ddd"}`, background:section===val?B.primary:"#fff", color:section===val?B.btnText:"#777", fontWeight:section===val?700:400, fontSize:13, cursor:"pointer" }}>
                {label}
              </button>
            ))}
            <div style={{ marginLeft:"auto", fontSize:13, color:"#aaa" }}>{visible.length} pieza{visible.length!==1?"s":""}</div>
          </div>
        )}

        {/* Content */}
        {viewMode==="month" && renderMonthCalendar()}

        {viewMode==="list" && (
          <>
            {Object.keys(grouped).sort().map(date=>(
              <div key={date}>
                <div style={{ fontSize:12, fontWeight:800, color:B.primary, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, marginTop:16 }}>
                  — {getDayName(date)}
                </div>
                {grouped[date].map(item=>{
                  const isStory = item.section==="story";
                  return(
                    <div key={item.id} onClick={()=>setSelected(item)}
                      style={{ background:B.cardBg, borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer", border:`1px solid ${isStory?B.accent+"50":B.primary+"35"}`, borderLeft:`4px solid ${isStory?B.accent:STATUS_COLORS[item.status]||"#ccc"}`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.15s" }}
                      onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                      onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                        <div>
                          <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{item.theme||"Sin título"}</div>
                          <div style={{ fontSize:12, color:"#999" }}>
                            <span style={{ background:isStory?`${B.accent}25`:`${B.primary}20`, color:isStory?B.accent:B.primary, padding:"1px 7px", borderRadius:6, fontWeight:600, marginRight:6 }}>
                              {isStory?"Story":item.type}
                            </span>
                          </div>
                        </div>
                        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status], border:`1px solid ${STATUS_COLORS[item.status]}40`, flexShrink:0 }}>{item.status}</span>
                      </div>
                      {(item.clientComments||[]).length>0&&<div style={{ fontSize:12, color:B.accent, marginTop:6, fontWeight:600 }}>💬 {item.clientComments.length} comentario{item.clientComments.length!==1?"s":""}</div>}
                    </div>
                  );
                })}
              </div>
            ))}
            {visible.length===0&&(
              <div style={{ textAlign:"center", padding:"60px 20px", color:"#aaa" }}>
                <div style={{ fontSize:36, marginBottom:12 }}>📭</div>
                <div>No hay contenidos todavía</div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selected&&(
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:999, display:"flex", justifyContent:"center", alignItems:"center", padding:16 }}
          onClick={e=>e.target===e.currentTarget&&setSelected(null)}>
          <div style={{ background:B.white, borderRadius:16, width:"100%", maxWidth:640, maxHeight:"92vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.25)" }}>
            <div style={{ padding:"16px 20px", background:B.primary, borderRadius:"16px 16px 0 0", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div>
                <div style={{ fontSize:11, color:`${B.btnText}90`, marginBottom:2 }}>{selected.section==="story"?"Story":selected.type} · {selected.date}</div>
                <div style={{ fontWeight:800, fontSize:17, color:B.btnText, fontFamily:"'Georgia',serif" }}>{selected.theme}</div>
              </div>
              <button onClick={()=>setSelected(null)} style={{ padding:"6px 11px", borderRadius:8, border:`1.5px solid ${B.btnText}50`, background:"transparent", color:B.btnText, cursor:"pointer", fontSize:14 }}>✕</button>
            </div>
            <div style={{ padding:20 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:`${STATUS_COLORS[selected.status]}20`, color:STATUS_COLORS[selected.status], border:`1px solid ${STATUS_COLORS[selected.status]}40` }}>{selected.status}</span>
                {selected.status==="Aprobado"&&<span style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>Aprobado</span>}
              </div>

              {selected.status !== "Publicado" && (
                <div style={{ display:"flex", gap:10, marginBottom:20, padding:"14px 16px", background:`${B.primary}12`, borderRadius:10, border:`1px solid ${B.primary}30` }}>
                  <button onClick={approveItem} style={{ flex:1, padding:12, borderRadius:8, border:"none", background:"#22c55e", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>✅ Aprobar</button>
                  <button onClick={requestChanges} style={{ flex:1, padding:12, borderRadius:8, border:"1.5px solid #ef4444", background:"transparent", color:"#ef4444", fontWeight:700, cursor:"pointer", fontSize:14 }}>✏️ Pedir cambios</button>
                </div>
              )}

              {/* Parsed content blocks: Hook, Desarrollo, Visual, CTA */}
              {(() => {
                const isStory = selected.section === "story";
                const rawScript = selected.script || "";
                const rawCopy = selected.copy || "";
                const rawContent = selected.content || "";
                const fullText = isStory ? rawContent : (rawScript + "\n" + rawCopy);

                function extractBlock(text, label) {
                  const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n(?:HOOK|CTA|VISUAL)[:]|$)`, "is");
                  const m = text.match(regex);
                  return m ? m[1].trim() : "";
                }

                const hook = extractBlock(fullText, "HOOK");
                const visual = extractBlock(fullText, "VISUAL");
                const cta = extractBlock(fullText, "CTA");
                // "Development" = everything else minus the labeled blocks
                let development = fullText
                  .replace(/HOOK:.+?(?=\n(?:HOOK|CTA|VISUAL)[:]|$)/is, "")
                  .replace(/VISUAL:.+?(?=\n(?:HOOK|CTA|VISUAL)[:]|$)/is, "")
                  .replace(/CTA:.+?(?=\n(?:HOOK|CTA|VISUAL)[:]|$)/is, "")
                  .trim();

                const hasStructure = hook || visual || cta;

                if (!hasStructure) {
                  // fallback: show raw fields as before
                  return (
                    <>
                      {(rawCopy||rawContent)&&(
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:6 }}>{isStory?"Contenido":"Copy del post"}</div>
                          <div style={{ fontSize:13, whiteSpace:"pre-wrap", lineHeight:1.7, background:`${B.primary}12`, padding:"12px 14px", borderRadius:10, border:`1px solid ${B.primary}25` }}>{rawCopy||rawContent}</div>
                        </div>
                      )}
                      {rawScript&&!isStory&&(
                        <div style={{ marginBottom:16 }}>
                          <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:6 }}>Guion</div>
                          <div style={{ fontSize:13, whiteSpace:"pre-wrap", lineHeight:1.65 }}>{rawScript}</div>
                        </div>
                      )}
                    </>
                  );
                }

                const Block = ({icon, label, text, bg, border, color}) => !text ? null : (
                  <div style={{ marginBottom:14, background:bg, border:`1px solid ${border}`, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color, marginBottom:6, display:"flex", alignItems:"center", gap:6 }}>
                      <span>{icon}</span>{label}
                    </div>
                    <div style={{ fontSize:13.5, whiteSpace:"pre-wrap", lineHeight:1.7, color:B.text }}>{text}</div>
                  </div>
                );

                return (
                  <>
                    <Block icon="🎯" label="Hook" text={hook} bg={`${B.accent}15`} border={`${B.accent}35`} color={B.accent}/>
                    <Block icon="📝" label="Desarrollo" text={development} bg="#f8f9fa" border="#e5e7eb" color="#666"/>
                    <Block icon="🎬" label="Visual" text={visual} bg={`${B.primary}10`} border={`${B.primary}25`} color={B.primary}/>
                    <Block icon="📣" label="Llamado a la acción" text={cta} bg={`${B.primary}18`} border={`${B.primary}40`} color={B.primary}/>
                  </>
                );
              })()}

              {selected.slides?.length>0&&(
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:8 }}>Slides ({selected.slides.length})</div>
                  {selected.slides.map((slide,i)=>(
                    <div key={slide.id||i} style={{ display:"flex", gap:10, alignItems:"center", marginBottom:8 }}>
                      <div style={{ width:26, height:26, borderRadius:"50%", background:B.primary, color:B.btnText, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>{i+1}</div>
                      <div style={{ fontSize:13 }}>{slide.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ borderTop:`1px solid ${B.primary}25`, paddingTop:16 }}>
                <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:10 }}>Comentarios</div>
                {(selected.clientComments||[]).length===0&&<div style={{ fontSize:12, color:"#bbb", marginBottom:12 }}>Sin comentarios aún.</div>}
                {(selected.clientComments||[]).map((c,i)=>(
                  <div key={c.id||i} style={{ background:`${B.accent}15`, border:`1px solid ${B.accent}30`, borderRadius:10, padding:"10px 13px", marginBottom:8 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:B.accent, marginBottom:4 }}>{c.author} · {c.date}</div>
                    <div style={{ fontSize:13, lineHeight:1.55 }}>{c.text}</div>
                  </div>
                ))}
                <div style={{ display:"flex", gap:8, marginTop:10 }}>
                  <input value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendComment()}
                    placeholder="Dejá tu comentario o pedí cambios..."
                    style={{ flex:1, padding:"10px 12px", border:`1.5px solid ${B.primary}`, borderRadius:8, fontSize:13, color:B.text, background:B.white, outline:"none" }}/>
                  <button onClick={sendComment} style={{ padding:"10px 16px", borderRadius:8, border:"none", background:B.btnBg, color:B.btnText, fontWeight:700, cursor:"pointer" }}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderDayPanel()}
      {notif&&<div style={{ position:"fixed", bottom:24, right:24, background:"#22c55e", color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:700, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", zIndex:9999 }}>{notif.msg}</div>}
    </div>
  );
}
