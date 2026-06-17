import { useState } from "react";
import { STATUS_OPTIONS, CONTENT_TYPES } from "../../constants";
import { MF } from "../shared/MF";
import { getWeekFromDate, todayISO } from "../../lib/utils";

export function NewContentModal({ account, S, onClose, onCreate, initialDate }) {
  const B = account.brand;
  const [draft, setDraft] = useState({
    section: "post",
    type: "Reel",
    theme: "",
    date: initialDate || todayISO(),
    week: getWeekFromDate(initialDate || todayISO()),
    status: "Borrador",
    objective: "",
    copy: "",
    content: "",
  });

  function handleCreate() {
    if (!draft.theme.trim()) return;
    onCreate(draft);
    onClose();
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 999, display: "flex", justifyContent: "center", alignItems: "center", padding: 20 }}>
      <div style={{ background: B.white, borderRadius: 16, width: "100%", maxWidth: 640, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 64px rgba(0,0,0,0.25)" }}>
        <div style={{ padding: "16px 20px", background: B.primary, borderRadius: "16px 16px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ color: B.btnText, fontWeight: 800, fontSize: 16, fontFamily: B.fontTitle }}>Nuevo contenido · {account.name}</div>
          <button onClick={onClose} style={{ padding: "6px 11px", borderRadius: 8, border: `1.5px solid ${B.btnText}50`, background: "transparent", color: B.btnText, cursor: "pointer" }}>✕</button>
        </div>
        <div style={{ padding: 20 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {["post", "story"].map(sec => (
              <button key={sec} onClick={() => setDraft({ ...draft, section: sec })} style={{ padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${B.primary}`, background: draft.section === sec ? B.primary : "transparent", color: draft.section === sec ? B.btnText : B.primary, fontWeight: 700, cursor: "pointer" }}>
                {sec === "post" ? "📌 Post / Reel" : "📖 Story"}
              </button>
            ))}
          </div>
          <MF label="Tema *" value={draft.theme} editable onChange={v => setDraft({ ...draft, theme: v })} S={S} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={S.field}>
              <label style={S.label}>Fecha</label>
              <input type="date" style={S.input} value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value, week: getWeekFromDate(e.target.value) })} />
            </div>
            <div style={S.field}>
              <label style={S.label}>Tipo</label>
              <select style={S.input} value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}>
                {CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div style={S.field}>
            <label style={S.label}>Estado</label>
            <select style={S.input} value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value })}>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <MF label="Objetivo" value={draft.objective} editable onChange={v => setDraft({ ...draft, objective: v })} S={S} />
          {draft.section === "post"
            ? <MF label="Copy" value={draft.copy} textarea editable onChange={v => setDraft({ ...draft, copy: v })} S={S} />
            : <MF label="Contenido / Guion" value={draft.content} textarea editable onChange={v => setDraft({ ...draft, content: v })} S={S} />
          }
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 8 }}>
            <button style={S.outline} onClick={onClose}>Cancelar</button>
            <button style={{ ...S.btn, opacity: !draft.theme.trim() ? 0.5 : 1 }} onClick={handleCreate} disabled={!draft.theme.trim()}>Crear</button>
          </div>
        </div>
      </div>
    </div>
  );
}
