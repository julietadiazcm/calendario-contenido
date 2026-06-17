import { STATUS_COLORS } from "../../constants";

const KANBAN_COLS = ["Idea","Borrador","En producción","Enviado al cliente","Cambios solicitados","Aprobado","Programado","Publicado"];

export function KanbanBoard({ visibleItems, account, filters, view, onSelectItem }) {
  const B = account.brand;
  return (
    <div style={{ overflowX: "auto", paddingBottom: 16 }}>
      <div style={{ display: "flex", gap: 12, minWidth: KANBAN_COLS.length * 210 }}>
        {KANBAN_COLS.map(status => {
          const colItems = visibleItems.filter(i => i.status === status);
          return (
            <div key={status} style={{ width: 200, flexShrink: 0 }}>
              <div style={{
                padding: "8px 12px", borderRadius: "10px 10px 0 0",
                background: `${STATUS_COLORS[status]}20`, borderBottom: "none",
                border: `1px solid ${STATUS_COLORS[status]}40`,
                display: "flex", justifyContent: "space-between", alignItems: "center",
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: STATUS_COLORS[status] }}>{status}</span>
                <span style={{ fontSize: 11, background: STATUS_COLORS[status], color: "#fff", borderRadius: 20, padding: "1px 7px", fontWeight: 700 }}>
                  {colItems.length}
                </span>
              </div>
              <div style={{
                background: "#f8f8f8", borderRadius: "0 0 10px 10px",
                border: `1px solid ${STATUS_COLORS[status]}40`, minHeight: 200, padding: 8,
              }}>
                {colItems.length === 0 && <div style={{ fontSize: 12, color: "#ccc", textAlign: "center", padding: "20px 0" }}>Vacío</div>}
                {colItems.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    style={{
                      background: B.cardBg, borderRadius: 8, padding: "10px 12px", marginBottom: 8,
                      cursor: "pointer", border: `1px solid ${B.primary}30`,
                      borderLeft: `3px solid ${STATUS_COLORS[item.status]}`,
                      boxShadow: "0 1px 4px rgba(0,0,0,0.06)", transition: "all 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "none"}
                  >
                    <div style={{ fontWeight: 700, fontSize: 12, marginBottom: 4, fontFamily: B.fontTitle, lineHeight: 1.3 }}>
                      {item.theme || "Sin título"}
                    </div>
                    <div style={{ fontSize: 10, color: "#999", marginBottom: 4 }}>
                      {item.section === "story" ? "📖 " : ""}{item.type} · {item.date}
                    </div>
                    {view === "manager" && filters.client === "all" && (
                      <div style={{ fontSize: 10, color: B.primary, fontWeight: 600 }}>{item.accountName}</div>
                    )}
                    <div style={{ display: "flex", gap: 6, marginTop: 6, fontSize: 10, color: "#bbb" }}>
                      {(item.clientComments || []).length > 0 && <span>💬{item.clientComments.length}</span>}
                      {item.slides?.length > 0 && <span>📋{item.slides.length}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
