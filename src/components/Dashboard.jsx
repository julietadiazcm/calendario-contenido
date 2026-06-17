import { Badge } from "./shared/Badge";

export function Dashboard({ stats, account, S, onSelectItem, onSelectAccount }) {
  const B = account.brand;

  return (
    <div>
      <h2 style={{ marginBottom: 4, fontFamily: "'Georgia',serif" }}>📊 Dashboard CM</h2>
      <p style={{ color: "#777", marginBottom: 20 }}>Resumen de todos tus clientes.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 14, marginBottom: 20 }}>
        {stats.byClient.map(s => (
          <div key={s.id} style={{ background: s.brand.cardBg, borderRadius: 14, padding: 18, border: `1.5px solid ${s.brand.primary}50` }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, fontFamily: "'Georgia',serif" }}>{s.emoji} {s.name}</div>

            {/* Progress bar */}
            {s.total > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#888", marginBottom: 4 }}>
                  <span>Progreso del mes</span>
                  <span>{s.published}/{s.total} publicados</span>
                </div>
                <div style={{ height: 6, borderRadius: 6, background: "#e5e7eb", overflow: "hidden" }}>
                  <div style={{ height: "100%", borderRadius: 6, background: s.brand.primary, width: `${Math.round((s.published / s.total) * 100)}%`, transition: "width 0.5s" }} />
                </div>
              </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                ["Total", s.total, "#6366f1"],
                ["Enviados", s.sent, "#f59e0b"],
                ["Cambios", s.changes, "#ef4444"],
                ["Aprobados", s.approved, "#22c55e"],
                ["Programados", s.scheduled, "#6366f1"],
                ["Publicados", s.published, "#111"],
                ["Sin copy", s.noCopy, "#f97316"],
                ["Sin guion", s.noScript, "#f97316"],
              ].map(([lbl, val, color]) => (
                <div key={lbl} style={{ background: `${color}10`, border: `1px solid ${color}25`, borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 10, color: "#888" }}>{lbl}</div>
                </div>
              ))}
            </div>
            {s.comments > 0 && (
              <div style={{ marginTop: 10, padding: "6px 10px", background: `${s.brand.accent}20`, borderRadius: 8, fontSize: 12, color: s.brand.accent, fontWeight: 700 }}>
                💬 {s.comments} comentarios
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ background: B.cardBg, padding: 18, borderRadius: 14, border: `1px solid ${B.primary}40` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>📅 Próximos 7 días</div>
        {stats.next7.length === 0 && <p style={{ color: "#aaa" }}>No hay contenidos próximos.</p>}
        {stats.next7.map(i => (
          <div
            key={i.id}
            onClick={() => { onSelectAccount(i.accountId); onSelectItem(i); }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${B.primary}25`, padding: "10px 0", cursor: "pointer" }}
          >
            <div>
              <div style={{ fontWeight: 600 }}>{i.theme}</div>
              <div style={{ fontSize: 12, color: "#999" }}>{i.accountName} · {i.type} · {i.date}</div>
            </div>
            <Badge status={i.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
