export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekFromDate(date) {
  if (!date) return 1;
  return Math.ceil(new Date(date + "T00:00:00").getDate() / 7);
}

export function getDayName(date) {
  if (!date) return "Sin fecha";
  return new Date(date + "T00:00:00").toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "short",
  });
}

export function createChecklist() {
  return [
    { id: "idea", label: "Idea definida", done: false },
    { id: "copy", label: "Copy listo", done: false },
    { id: "script", label: "Guion listo", done: false },
    { id: "design", label: "Diseño listo", done: false },
    { id: "visual", label: "Material visual listo", done: false },
    { id: "sent", label: "Enviado al cliente", done: false },
    { id: "approved", label: "Aprobado", done: false },
    { id: "scheduled", label: "Programado", done: false },
    { id: "published", label: "Publicado", done: false },
    { id: "metrics", label: "Métricas cargadas", done: false },
  ];
}

export function createMetrics() {
  return { reach:"", likes:"", comments:"", shares:"", saves:"", clicks:"", profileVisits:"", inquiries:"", websiteClicks:"", notes:"" };
}

let _id = 0;
export function mk(accountId, o) {
  _id++;
  return {
    id: `${accountId}_${_id}`,
    accountId, section: "post", type: "Reel",
    date: todayISO(), week: 1,
    theme: "", objective: "", development: "", script: "", copy: "", content: "",
    status: "Borrador", slides: [], clientComments: [], internalNotes: [],
    checklist: createChecklist(), metrics: createMetrics(),
    ...o,
  };
}

export function newContent(accountId) {
  return mk(accountId, {});
}

export function toRow(item) {
  return {
    id: item.id,
    account_id: item.accountId,
    section: item.section,
    type: item.type,
    date: item.date,
    week: item.week,
    theme: item.theme,
    objective: item.objective || "",
    development: item.development || "",
    script: item.script || "",
    copy: item.copy || "",
    content: item.content || "",
    status: item.status,
    slides: item.slides || [],
    client_comments: item.clientComments || [],
    internal_notes: item.internalNotes || [],
    checklist: item.checklist || [],
    metrics: item.metrics || {},
  };
}

export function makeStyles(B) {
  return {
    input: { width:"100%", padding:"9px 11px", border:`1.5px solid ${B.inputBorder}`, borderRadius:8, fontSize:13, fontFamily:B.fontBody, color:B.text, background:B.white, boxSizing:"border-box", outline:"none" },
    textarea: { width:"100%", padding:"9px 11px", border:`1.5px solid ${B.inputBorder}`, borderRadius:8, fontSize:13, fontFamily:B.fontBody, color:B.text, background:B.white, boxSizing:"border-box", outline:"none", resize:"vertical", minHeight:80, lineHeight:1.65 },
    label: { display:"block", fontSize:10, fontWeight:800, textTransform:"uppercase", letterSpacing:1.2, color:"#888", marginBottom:5 },
    btn: { padding:"9px 16px", borderRadius:8, border:"none", background:B.btnBg, color:B.btnText, fontWeight:700, cursor:"pointer", fontSize:13 },
    outline: { padding:"9px 16px", borderRadius:8, border:`1.5px solid ${B.primary}`, background:"transparent", color:B.primary, fontWeight:700, cursor:"pointer", fontSize:13 },
    field: { marginBottom:14 },
    sTitle: { fontSize:11, fontWeight:800, color:B.primary, textTransform:"uppercase", letterSpacing:1.5, marginBottom:8 },
  };
}
