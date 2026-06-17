import { useState } from "react";
import { STATUS_OPTIONS, CONTENT_TYPES } from "../../constants";
import { Badge } from "../shared/Badge";
import { MF } from "../shared/MF";

export function ContentModal({ item, account, view, S, onClose, onSave, onDelete, onDuplicate }) {
  const B = account.brand;
  const [localItem, setLocalItem] = useState(item);
  const [clientComment, setClientComment] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [showChecklist, setShowChecklist] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);

  const editable = view === "manager";
  const isClient = view === "client";
  const isPost = localItem.section === "post";
  const checkDone = localItem.checklist?.filter(c => c.done).length || 0;
  const checkTotal = localItem.checklist?.length || 10;

  const bStyle = (bg, color = "#fff") => ({ padding: "8px 14px", borderRadius: 8, border: "none", background: bg, color, fontWeight: 700, cursor: "pointer", fontSize: 12 });
  const oStyle = (color) => ({ padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${color}`, background: "transparent", color, fontWeight: 700, cursor: "pointer", fontSize: 12 });

  function addClientComment() {
    if (!clientComment.trim()) return;
    const c = { id: `cc_${Date.now()}`, author: isClient ? "Cliente" : "CM", text: clientComment, date: new Date().toLocaleDateString("es-AR") };
    setLocalItem(prev => ({ ...prev, clientComments: [...(prev.clientComments || []), c] }));
    setClientComment("");
  }

  function addInternalNote() {
    if (!internalNote.trim()) return;
    const n = { id: `in_${Date.now()}`, author: "CM", text: internalNote, date: new Date().toLocaleDateString("es-AR") };
    setLocalItem(prev => ({ ...prev, internalNotes: [...(prev.internalNotes || []), n] }));
    setInternalNote("");
  }

  function removeInternalNote(id) {
    setLocalItem(prev => ({ ...prev, internalNotes: prev.internalNotes.filter(n => n.id !== id) }));
  }

  function toggleChecklist(id) {
    setLocalItem(prev => ({ ...prev, checklist: prev.checklist.map(c => c.id === id ? { ...c, done: !c.done } : c) }));
  }

  function updateMetric(key, value) {
    setLocalItem(prev => ({ ...prev, metrics: { ...prev.metrics, [key]: value } }));
  }

  function handleApprove() {
    const updated = { ...localItem, status: "Aprobado" };
    setLocalItem(updated);
    onSave(updated);
  }

  function handleRequestChanges() {
    const updated = { ...localItem, status: "Cambios solicitados" };
    setLocalItem(updated);
    onSave(updated);
  }

  function getWeekFromDate(date) {
    if (!date) return 1;
    return Math.ceil(new Date(date + "T00:00:00").getDate() / 7);
  }

  // Extract structured blocks from script/copy
  function extractBlock(text, label) {
    const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n(?:HOOK|CTA|VISUAL)[:]|$)`, "is");
    const m = text.match(regex);
    return m ? m[1].trim() : "";
  }

  const fullText = isPost ? ((localItem.script || "") + "\n" + (localItem.copy || "")) : (localItem.content || "");
  const hook = extractBlock(fullText, "HOOK");
  const visual = extractBlock(fullText, "VISUAL");
  const cta = extractBlock(fullText, "CTA");
  const hasStructured = !!(hook || visual || cta);

  const Block = ({ icon, label, text, bg, border, color }) => !text ? null : (
    <div style={{ marginBottom: 10, background: bg, border: `1px solid ${border}`, borderRadius: 10, padding: "10px 13px" }}>
      <div style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.2, color, marginBottom: 5, display: "flex", alignItems: "center", gap: 6 }}>
        <span>{icon}</span>{label}
      </div>
      <div style={{ fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{text}</div>
    </div>
  );

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center", padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: B.white, borderRadius: 16, width: "100%", maxWidth: 820, maxHeight: "93vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.3)" }}>
        {/* Header */}
        <div style={{ padding: "16px 20px", background: B.primary, borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", position: "sticky", top: 0, zIndex: 1 }}>
          <div>
            <div style={{ color: `${B.btnText}90`, fontSize: 12, marginBottom: 2 }}>{isPost ? localItem.type : "Story"} · {localItem.date} · {localItem.accountId}</div>
            <div style={{ color: B.btnText, fontWeight: 800, fontSize: 17, fontFamily: B.fontTitle }}>{localItem.theme || "Contenido"}</div>
          </div>
          <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
            {editable && (
              <>
                <button style={oStyle(B.btnText)} onClick={() => onDuplicate(localItem)}>Duplicar</button>
                <button style={bStyle(B.accent)} onClick={() => onSave(localItem)}>Guardar</button>
                <button style={bStyle("#ef4444")} onClick={() => { onDelete(localItem); onClose(); }}>Eliminar</button>
              </>
            )}
            {isClient && (localItem.status === "Enviado al cliente" || localItem.status === "Cambios solicitados") && (
              <>
                <button style={bStyle("#22c55e")} onClick={handleApprove}>✅ Aprobar</button>
                <button style={bStyle("#ef4444")} onClick={handleRequestChanges}>✏️ Pedir cambios</button>
              </>
            )}
            <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 8, border: `1.5px solid ${B.btnText}50`, background: "transparent", color: B.btnText, cursor: "pointer", fontSize: 14 }}>✕</button>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          {/* Status row */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16, flexWrap: "wrap" }}>
            <Badge status={localItem.status} />
            {editable && (
              <>
                <select style={{ ...S.input, width: "auto" }} value={localItem.status} onChange={e => setLocalItem({ ...localItem, status: e.target.value })}>
                  {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                </select>
                <input type="date" style={{ ...S.input, width: 155 }} value={localItem.date || ""} onChange={e => setLocalItem({ ...localItem, date: e.target.value, week: getWeekFromDate(e.target.value) })} />
                <select style={{ ...S.input, width: "auto" }} value={localItem.type} onChange={e => setLocalItem({ ...localItem, type: e.target.value })}>
                  {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
                </select>
              </>
            )}
            {isClient && localItem.status === "Aprobado" && <span style={{ color: "#22c55e", fontWeight: 700 }}>✅ Aprobado</span>}
          </div>

          {/* Client action banner */}
          {isClient && (localItem.status === "Enviado al cliente" || localItem.status === "Cambios solicitados") && (
            <div style={{ background: `${B.primary}12`, border: `1px solid ${B.primary}30`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", gap: 10 }}>
              <button onClick={handleApprove} style={{ flex: 1, padding: 10, borderRadius: 8, border: "none", background: "#22c55e", color: "#fff", fontWeight: 700, cursor: "pointer" }}>✅ Aprobar contenido</button>
              <button onClick={handleRequestChanges} style={{ flex: 1, padding: 10, borderRadius: 8, border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontWeight: 700, cursor: "pointer" }}>✏️ Pedir cambios</button>
            </div>
          )}

          {/* Structured preview */}
          {hasStructured && (
            <div style={{ marginBottom: 16, padding: 14, background: "#fafafa", borderRadius: 12, border: "1px dashed #ddd" }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: "#999", textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>👁 Vista previa estructurada</div>
              <Block icon="🎯" label="Hook" text={hook} bg={`${B.accent}15`} border={`${B.accent}35`} color={B.accent} />
              <Block icon="🎬" label="Visual" text={visual} bg={`${B.primary}10`} border={`${B.primary}25`} color={B.primary} />
              <Block icon="📣" label="CTA" text={cta} bg={`${B.primary}18`} border={`${B.primary}40`} color={B.primary} />
            </div>
          )}

          {/* Fields */}
          <MF label="Tema" value={localItem.theme} editable={editable} onChange={v => setLocalItem({ ...localItem, theme: v })} S={S} />
          {editable && <MF label="Objetivo interno" value={localItem.objective} editable onChange={v => setLocalItem({ ...localItem, objective: v })} S={S} />}
          {editable && <MF label="Desarrollo interno" value={localItem.development} textarea editable onChange={v => setLocalItem({ ...localItem, development: v })} S={S} />}

          {isPost ? (
            <>
              <MF label="Guion" value={localItem.script} textarea editable={editable} onChange={v => setLocalItem({ ...localItem, script: v })} S={S} />
              <MF label="Copy del post" value={localItem.copy} textarea highlight editable={editable} onChange={v => setLocalItem({ ...localItem, copy: v })} S={S} B={B} />
              {(localItem.type === "Carrusel" || localItem.slides?.length > 0) && (
                <div style={S.field}>
                  <label style={S.label}>Slides ({localItem.slides?.length || 0})</label>
                  {(localItem.slides || []).map((slide, i) => (
                    <div key={slide.id} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                      <div style={{ width: 26, height: 26, borderRadius: "50%", background: B.primary, color: B.btnText, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                      {editable
                        ? <><input style={{ ...S.input, flex: 1 }} value={slide.text} onChange={e => setLocalItem({ ...localItem, slides: localItem.slides.map(s => s.id === slide.id ? { ...s, text: e.target.value } : s) })} /><button onClick={() => setLocalItem({ ...localItem, slides: localItem.slides.filter(s => s.id !== slide.id) })} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 15 }}>✕</button></>
                        : <div style={{ fontSize: 13, flex: 1 }}>{slide.text || "—"}</div>
                      }
                    </div>
                  ))}
                  {editable && <button style={{ ...S.outline, fontSize: 11, padding: "5px 12px" }} onClick={() => setLocalItem({ ...localItem, slides: [...(localItem.slides || []), { id: `sl_${Date.now()}`, text: "" }] })}>+ Agregar slide</button>}
                </div>
              )}
            </>
          ) : (
            <MF label="Contenido / Guion" value={localItem.content} textarea highlight editable={editable} onChange={v => setLocalItem({ ...localItem, content: v })} S={S} B={B} />
          )}

          {/* Checklist */}
          {editable && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setShowChecklist(!showChecklist)} style={{ ...S.outline, fontSize: 12, padding: "6px 14px", marginBottom: showChecklist ? 10 : 0 }}>
                {showChecklist ? "▲" : "▼"} Checklist ({checkDone}/{checkTotal})
              </button>
              {showChecklist && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 7, marginTop: 10 }}>
                  {localItem.checklist.map(c => (
                    <label key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, background: c.done ? `${B.primary}20` : "transparent", border: `1px solid ${c.done ? B.primary : "#e5e7eb"}`, cursor: "pointer", fontSize: 13 }}>
                      <input type="checkbox" checked={c.done} onChange={() => toggleChecklist(c.id)} style={{ accentColor: B.primary }} />
                      <span style={{ color: c.done ? B.primary : "#555" }}>{c.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Metrics */}
          {editable && localItem.status === "Publicado" && (
            <div style={{ marginBottom: 16 }}>
              <button onClick={() => setShowMetrics(!showMetrics)} style={{ ...S.outline, fontSize: 12, padding: "6px 14px", marginBottom: showMetrics ? 10 : 0 }}>
                {showMetrics ? "▲" : "▼"} 📊 Métricas
              </button>
              {showMetrics && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 8, marginTop: 10 }}>
                  {Object.keys(localItem.metrics || {}).map(key => (
                    <div key={key} style={S.field}>
                      <label style={S.label}>{key}</label>
                      {key === "notes"
                        ? <textarea style={S.textarea} value={localItem.metrics[key]} onChange={e => updateMetric(key, e.target.value)} />
                        : <input style={S.input} value={localItem.metrics[key]} onChange={e => updateMetric(key, e.target.value)} />
                      }
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Internal notes */}
          {editable && (
            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>📝 Notas internas (solo CM)</label>
              {(localItem.internalNotes || []).length === 0 && <div style={{ fontSize: 12, color: "#bbb", marginBottom: 8 }}>Sin notas.</div>}
              {(localItem.internalNotes || []).map(n => (
                <div key={n.id} style={{ background: "#fff8e7", border: "1px solid #f6d52255", borderRadius: 8, padding: "8px 12px", marginBottom: 6, display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, color: "#888", marginBottom: 2 }}><strong>{n.author}</strong> · {n.date}</div>
                    <div style={{ fontSize: 13, lineHeight: 1.5 }}>{n.text}</div>
                  </div>
                  <button onClick={() => removeInternalNote(n.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 14, flexShrink: 0 }}>✕</button>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <input style={{ ...S.input, flex: 1 }} value={internalNote} onChange={e => setInternalNote(e.target.value)} onKeyDown={e => e.key === "Enter" && addInternalNote()} placeholder="Agregar nota interna..." />
                <button style={S.btn} onClick={addInternalNote}>+</button>
              </div>
            </div>
          )}

          {/* Client comments */}
          <div style={{ borderTop: `1px solid ${B.primary}25`, paddingTop: 16 }}>
            <label style={S.label}>💬 Comentarios del cliente</label>
            {(localItem.clientComments || []).length === 0 && <div style={{ fontSize: 12, color: "#bbb", marginBottom: 10 }}>Sin comentarios aún.</div>}
            {(localItem.clientComments || []).map(c => (
              <div key={c.id} style={{ background: `${B.accent || B.primary}12`, border: `1px solid ${B.accent || B.primary}30`, borderRadius: 10, padding: "10px 13px", marginBottom: 8 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: B.accent || B.primary, marginBottom: 4 }}>{c.author} · {c.date}</div>
                <div style={{ fontSize: 13, lineHeight: 1.55 }}>{c.text}</div>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <input style={{ ...S.input, flex: 1 }} value={clientComment} onChange={e => setClientComment(e.target.value)} onKeyDown={e => e.key === "Enter" && addClientComment()} placeholder={isClient ? "Dejá tu comentario o pedí cambios..." : "Escribir como cliente..."} />
              <button style={S.btn} onClick={addClientComment}>Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
