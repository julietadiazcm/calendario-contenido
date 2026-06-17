import { Badge } from "./shared/Badge";

const ATTENTION_STATUSES = ["Cambios solicitados", "Para revisión interna", "Enviado al cliente"];

export function Notifications({ allItems, accounts, S, onSelectItem, onSelectAccount }) {
  const cambios = allItems.filter(i => i.status === "Cambios solicitados");
  const revision = allItems.filter(i => i.status === "Para revisión interna");
  const enviados = allItems.filter(i => i.status === "Enviado al cliente");
  const sinFecha = allItems.filter(i => !i.date && i.status !== "Publicado");
  const sinCopy = allItems.filter(i => i.section === "post" && !i.copy && !i.script && i.status !== "Publicado");

  function ItemRow({ item, icon }) {
    const acc = accounts.find(a => a.id === item.accountId);
    const B = acc?.brand || { primary: "#aaa", cardBg: "#fff", accent: "#aaa", fontTitle: "sans-serif" };
    return (
      <div
        onClick={() => { onSelectAccount(item.accountId); onSelectItem(item); }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderRadius: 10, marginBottom: 6, cursor: "pointer", background: B.cardBg, border: `1px solid ${B.primary}30`, transition: "all 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 3px 12px ${B.primary}25`; e.currentTarget.style.transform = "translateX(2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: B.fontTitle, marginBottom: 2 }}>
            {icon} {item.theme || "Sin título"}
          </div>
          <div style={{ fontSize: 11, color: "#999" }}>
            {acc?.name} · {item.type} · {item.date || "Sin fecha"}
            {(item.clientComments || []).length > 0 && ` · 💬 ${item.clientComments.length} comentarios`}
          </div>
        </div>
        <Badge status={item.status} />
      </div>
    );
  }

  function Section({ title, items, icon, emptyMsg, color }) {
    return (
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1.5, color }}>{title}</div>
          <span style={{ background: color, color: "#fff", borderRadius: 20, fontSize: 10, fontWeight: 800, padding: "1px 8px" }}>{items.length}</span>
        </div>
        {items.length === 0
          ? <div style={{ fontSize: 13, color: "#bbb", padding: "12px 0" }}>{emptyMsg}</div>
          : items.map(item => <ItemRow key={item.id} item={item} icon={icon} />)
        }
      </div>
    );
  }

  const totalPending = cambios.length + revision.length + enviados.length;

  return (
    <div>
      <h2 style={{ marginBottom: 4, fontFamily: "'Georgia',serif" }}>🔔 Pendientes</h2>
      <p style={{ color: "#777", marginBottom: 20 }}>
        Items que necesitan tu atención en todos los clientes.
        {totalPending > 0 && <strong style={{ color: "#ef4444" }}> {totalPending} urgentes.</strong>}
      </p>

      {totalPending === 0 && sinFecha.length === 0 && sinCopy.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#aaa" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Todo en orden</div>
          <div style={{ fontSize: 13 }}>No hay items pendientes de atención.</div>
        </div>
      )}

      <Section
        title="Cambios solicitados por el cliente"
        items={cambios}
        icon="✏️"
        emptyMsg="Ningún cliente pidió cambios."
        color="#ef4444"
      />
      <Section
        title="Para revisión interna"
        items={revision}
        icon="👁"
        emptyMsg="Sin items para revisar internamente."
        color="#a855f7"
      />
      <Section
        title="Enviados al cliente — esperando respuesta"
        items={enviados}
        icon="📤"
        emptyMsg="Ningún item esperando respuesta del cliente."
        color="#f59e0b"
      />
      <Section
        title="Sin fecha asignada"
        items={sinFecha}
        icon="📅"
        emptyMsg="Todos los items tienen fecha."
        color="#64748b"
      />
      <Section
        title="Sin copy ni guion"
        items={sinCopy}
        icon="✍️"
        emptyMsg="Todos los posts tienen copy o guion."
        color="#f97316"
      />
    </div>
  );
}

export function getNotifCount(allItems) {
  return allItems.filter(i => ATTENTION_STATUSES.includes(i.status)).length;
}
