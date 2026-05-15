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
};

const STATUS_COLORS = { "Idea":"#a78bfa","Borrador":"#64748b","En producción":"#0ea5e9","Para revisión interna":"#a855f7","Enviado al cliente":"#f59e0b","Cambios solicitados":"#ef4444","Aprobado":"#22c55e","Programado":"#6366f1","Publicado":"#111827" };

function getDayName(date) { if(!date) return "Sin fecha"; return new Date(date+"T00:00:00").toLocaleDateString("es-AR",{weekday:"long",day:"numeric",month:"long"}); }

export default function ClientView() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [comment, setComment] = useState("");
  const [section, setSection] = useState("all");
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
  const grouped = visible.reduce((acc, item) => { const k = item.date||"Sin fecha"; acc[k]=acc[k]||[]; acc[k].push(item); return acc; }, {});

  if (loading) return (
    <div style={{ minHeight:"100vh", background:`linear-gradient(135deg,${B.primary},${B.primarySoft})`, display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div style={{ color: B.btnText, fontSize: 18, fontWeight: 700 }}>Cargando tu calendario...</div>
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

      <div style={{ maxWidth:720, margin:"0 auto", padding:"24px 16px" }}>
        {/* Section tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["all","Todo"],["post","Posts & Reels"],["story","Historias"]].map(([val,label])=>(
            <button key={val} onClick={()=>setSection(val)}
              style={{ padding:"8px 18px", borderRadius:20, border:`1.5px solid ${section===val?B.primary:"#ddd"}`, background:section===val?B.primary:"#fff", color:section===val?B.btnText:"#777", fontWeight:section===val?700:400, fontSize:13, cursor:"pointer" }}>
              {label}
            </button>
          ))}
          <div style={{ marginLeft:"auto", fontSize:13, color:"#aaa", alignSelf:"center" }}>{visible.length} pieza{visible.length!==1?"s":""}</div>
        </div>

        {/* Content */}
        {Object.keys(grouped).sort().map(date=>(
          <div key={date}>
            <div style={{ fontSize:12, fontWeight:800, color:B.primary, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8, marginTop:16 }}>
              — {getDayName(date)}
            </div>
            {grouped[date].map(item=>{
              const newComments=(item.clientComments||[]).length;
              return(
                <div key={item.id} onClick={()=>setSelected(item)}
                  style={{ background:B.cardBg, borderRadius:12, padding:"14px 16px", marginBottom:10, cursor:"pointer", border:`1px solid ${B.primary}35`, borderLeft:`4px solid ${STATUS_COLORS[item.status]||"#ccc"}`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", transition:"all 0.15s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-1px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="none"}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                    <div>
                      <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{item.theme||"Sin título"}</div>
                      <div style={{ fontSize:12, color:"#999" }}>
                        <span style={{ background:`${B.primary}20`, color:B.primary, padding:"1px 7px", borderRadius:6, fontWeight:600, marginRight:6 }}>{item.section==="story"?"Story":item.type}</span>
                      </div>
                    </div>
                    <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:`${STATUS_COLORS[item.status]}20`, color:STATUS_COLORS[item.status], border:`1px solid ${STATUS_COLORS[item.status]}40`, flexShrink:0 }}>{item.status}</span>
                  </div>
                  {newComments>0&&<div style={{ fontSize:12, color:B.accent, marginTop:6, fontWeight:600 }}>💬 {newComments} comentario{newComments!==1?"s":""}</div>}
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
      </div>

      {/* Modal */}
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
              {/* Status */}
              <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16, flexWrap:"wrap" }}>
                <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:`${STATUS_COLORS[selected.status]}20`, color:STATUS_COLORS[selected.status], border:`1px solid ${STATUS_COLORS[selected.status]}40` }}>{selected.status}</span>
                {selected.status==="Aprobado"&&<span style={{ color:"#22c55e", fontWeight:700, fontSize:13 }}>✅ Aprobado</span>}
              </div>

              {/* Approve / Request changes */}
              {(selected.status==="Enviado al cliente"||selected.status==="Cambios solicitados")&&(
                <div style={{ display:"flex", gap:10, marginBottom:20, padding:"14px 16px", background:`${B.primary}12`, borderRadius:10, border:`1px solid ${B.primary}30` }}>
                  <button onClick={approveItem} style={{ flex:1, padding:12, borderRadius:8, border:"none", background:"#22c55e", color:"#fff", fontWeight:700, cursor:"pointer", fontSize:14 }}>✅ Aprobar</button>
                  <button onClick={requestChanges} style={{ flex:1, padding:12, borderRadius:8, border:"1.5px solid #ef4444", background:"transparent", color:"#ef4444", fontWeight:700, cursor:"pointer", fontSize:14 }}>✏️ Pedir cambios</button>
                </div>
              )}

              {/* Copy */}
              {(selected.copy||selected.content)&&(
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:6 }}>{selected.section==="story"?"Contenido":"Copy del post"}</div>
                  <div style={{ fontSize:13, whiteSpace:"pre-wrap", lineHeight:1.7, background:`${B.primary}12`, padding:"12px 14px", borderRadius:10, border:`1px solid ${B.primary}25` }}>{selected.copy||selected.content}</div>
                </div>
              )}

              {/* Script */}
              {selected.script&&selected.section!=="story"&&(
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:6 }}>Guion</div>
                  <div style={{ fontSize:13, whiteSpace:"pre-wrap", lineHeight:1.65 }}>{selected.script}</div>
                </div>
              )}

              {/* Slides */}
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

              {/* Comments */}
              <div style={{ borderTop:`1px solid ${B.primary}25`, paddingTop:16 }}>
                <div style={{ fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#aaa", marginBottom:10 }}>💬 Comentarios</div>
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
                    style={{ flex:1, padding:"10px 12px", border:`1.5px solid ${B.primary}`, borderRadius:8, fontSize:13, fontFamily:"'Trebuchet MS',sans-serif", color:B.text, background:B.white, outline:"none" }}/>
                  <button onClick={sendComment} style={{ padding:"10px 16px", borderRadius:8, border:"none", background:B.btnBg, color:B.btnText, fontWeight:700, cursor:"pointer" }}>Enviar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {notif&&<div style={{ position:"fixed", bottom:24, right:24, background:notif.type==="error"?"#ef4444":"#22c55e", color:"#fff", padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:700, boxShadow:"0 4px 20px rgba(0,0,0,0.2)", zIndex:9999 }}>{notif.msg}</div>}
    </div>
  );
}
