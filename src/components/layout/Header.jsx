export function Header({ B, view, onViewChange, onMenuToggle, sidebarOpen }) {
  return (
    <header style={{
      background: B.sidebar, padding: "0 16px", display: "flex",
      justifyContent: "space-between", alignItems: "center",
      height: 58, position: "sticky", top: 0, zIndex: 300,
      boxShadow: "0 2px 14px rgba(0,0,0,0.15)",
    }}>
      {/* Hamburger — only visible on mobile via CSS class */}
      <button
        className="cm-hamburger"
        onClick={onMenuToggle}
        style={{
          background: "none", border: "none", cursor: "pointer",
          color: B.sidebarText, fontSize: 22, padding: "4px 8px 4px 0",
          display: "none", // overridden by mobile CSS
          lineHeight: 1,
        }}
        aria-label="Menú"
      >
        {sidebarOpen ? "✕" : "☰"}
      </button>

      <strong style={{ fontSize: 14, color: B.sidebarText, fontFamily: B.fontTitle, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
        📅 Calendario Pro
      </strong>

      <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: 3, flexShrink: 0 }}>
        {[["manager", "✏️ CM"], ["client", "👤 Cliente"]].map(([v, label]) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            style={{
              padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 700,
              background: view === v ? B.sidebarText : "transparent",
              color: view === v ? B.sidebar : B.sidebarText,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="cm-header-hint" style={{ fontSize: 11, color: `${B.sidebarText}70`, whiteSpace: "nowrap" }}>
        {view === "client" ? "Solo lectura" : ""}
      </div>
    </header>
  );
}
