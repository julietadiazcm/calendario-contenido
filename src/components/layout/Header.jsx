export function Header({ B, view, onViewChange }) {
  return (
    <header style={{
      background: B.sidebar, padding: "0 24px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      height: 58, position: "sticky", top: 0, zIndex: 200,
      boxShadow: "0 2px 14px rgba(0,0,0,0.15)",
    }}>
      <strong style={{ fontSize: 15, color: B.sidebarText, fontFamily: B.fontTitle }}>
        📅 Calendario de Contenido Pro
      </strong>
      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3 }}>
        {[["manager", "✏️ CM"], ["client", "👤 Cliente"]].map(([v, label]) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            style={{
              padding: "5px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
              background: view === v ? B.sidebarText : "transparent",
              color: view === v ? B.sidebar : B.sidebarText,
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div style={{ fontSize: 12, color: `${B.sidebarText}70` }}>
        {view === "client" ? "Solo lectura · Podés aprobar y comentar" : ""}
      </div>
    </header>
  );
}
