import { STATUS_COLORS } from "../../constants";

export function DayPanelCard({ item, onOpen, isClient, B }) {
  const isPost = item.section === "post";
  const commentCount = (item.clientComments || []).length;
  return (
    <div
      onClick={onOpen}
      style={{
        background: B.white, borderRadius: 10, padding: "12px 14px", marginBottom: 8,
        cursor: "pointer", border: `1px solid ${B.primary}35`,
        borderLeft: `4px solid ${STATUS_COLORS[item.status] || "#ccc"}`,
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateX(2px)"; e.currentTarget.style.boxShadow = `0 3px 12px ${B.primary}25`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.05)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: B.fontTitle, marginBottom: 3 }}>{item.theme || "Sin título"}</div>
          <div style={{ fontSize: 11, color: "#999", display: "flex", gap: 6, flexWrap: "wrap" }}>
            <span style={{ background: `${B.primary}20`, color: B.primary, padding: "1px 6px", borderRadius: 6, fontWeight: 600 }}>
              {isPost ? item.type : "Story"}
            </span>
            {!isClient && item.accountName && <span style={{ color: "#bbb" }}>{item.accountName}</span>}
          </div>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 20, flexShrink: 0, whiteSpace: "nowrap",
          background: `${STATUS_COLORS[item.status]}20`, color: STATUS_COLORS[item.status], border: `1px solid ${STATUS_COLORS[item.status]}40`,
        }}>
          {item.status}
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 6, fontSize: 11, color: "#bbb" }}>
        {commentCount > 0 && <span>💬 {commentCount}</span>}
        {item.slides?.length > 0 && <span>📋 {item.slides.length} slides</span>}
        <span style={{ marginLeft: "auto", color: B.primary, fontWeight: 600 }}>Ver detalle →</span>
      </div>
    </div>
  );
}
