export function Sidebar({ accounts, activeAccountId, onSelectAccount, tab, onSelectTab, view, B, notifCount }) {
  const menuItems = [
    ["calendar", "📅 Calendario"],
    ...(view === "manager" ? [["dashboard", "📊 Dashboard"]] : []),
    ["brand", "🎨 Brand Kit"],
    ...(view === "manager" ? [
      ["ai", "🤖 Agente IA"],
      ["notifications", notifCount > 0 ? `🔔 Pendientes (${notifCount})` : "🔔 Pendientes"],
    ] : []),
  ];

  return (
    <aside style={{
      width: 230, background: B.sidebar, flexShrink: 0,
      padding: "18px 0", display: "flex", flexDirection: "column",
      borderRight: `2px solid ${B.primary}20`,
    }}>
      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2.5, color: `${B.sidebarText}50`, padding: "10px 18px 6px" }}>
        Cuentas
      </div>
      {accounts.map(acc => {
        if (view === "client" && acc.id !== activeAccountId) return null;
        const isActive = activeAccountId === acc.id;
        return (
          <button
            key={acc.id}
            onClick={() => onSelectAccount(acc.id)}
            style={{
              display: "block", width: "100%", padding: "9px 18px", border: "none",
              textAlign: "left", cursor: "pointer", fontSize: 13, transition: "all 0.15s",
              background: isActive ? acc.brand.primary : "transparent",
              color: isActive ? acc.brand.text : acc.brand.sidebarText,
              fontWeight: isActive ? 800 : 500,
              borderLeft: `3px solid ${isActive ? acc.brand.accent : "transparent"}`,
            }}
          >
            {acc.emoji} {acc.shortName}
          </button>
        );
      })}

      <hr style={{ margin: "14px 0", borderColor: `${B.primary}30` }} />

      <div style={{ fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: 2.5, color: `${B.sidebarText}50`, padding: "0 18px 6px" }}>
        Menú
      </div>
      {menuItems.map(([id, label]) => (
        <button
          key={id}
          onClick={() => onSelectTab(id)}
          style={{
            display: "block", width: "100%", padding: "9px 18px", border: "none",
            textAlign: "left", cursor: "pointer", fontSize: 13, transition: "all 0.15s",
            background: tab === id ? B.primary : "transparent",
            color: tab === id ? B.text : B.sidebarText,
            fontWeight: tab === id ? 800 : 500,
            borderLeft: `3px solid ${tab === id ? B.accent : "transparent"}`,
            position: "relative",
          }}
        >
          {label}
          {id === "notifications" && notifCount > 0 && (
            <span style={{
              position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
              background: "#ef4444", color: "#fff", borderRadius: 20,
              fontSize: 10, fontWeight: 800, padding: "1px 6px",
            }}>
              {notifCount}
            </span>
          )}
        </button>
      ))}

      <div style={{ marginTop: "auto", padding: "14px 18px", borderTop: `1px solid ${B.primary}25` }}>
        <div style={{ fontSize: 10, color: `${B.sidebarText}45`, fontStyle: "italic", lineHeight: 1.4 }}>
          {B.tagline}
        </div>
      </div>
    </aside>
  );
}
