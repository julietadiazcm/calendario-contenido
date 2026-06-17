export function BrandKit({ account, view, S, onUpdate }) {
  const B = account.brand;
  const kit = account.brandKit;

  const fields = [
    ["audience", "Público objetivo"],
    ["objective", "Objetivo de la cuenta"],
    ["tone", "Tono de comunicación"],
    ["wordsYes", "Palabras que SÍ usa"],
    ["wordsNo", "Palabras que NO usa"],
    ["instagram", "Instagram"],
    ["whatsapp", "WhatsApp"],
    ["drive", "Drive"],
    ["canva", "Canva"],
    ["website", "Tienda online / web"],
    ["notes", "Observaciones estratégicas"],
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 4, fontFamily: "'Georgia',serif" }}>🎨 Brand Kit · {account.name}</h2>
      <p style={{ color: "#777", marginBottom: 20 }}>
        {view === "manager" ? "Editá los datos estratégicos del cliente." : "Datos del cliente."}
      </p>

      <div style={{ background: B.cardBg, padding: 20, borderRadius: 14, border: `1px solid ${B.primary}40`, marginBottom: 16 }}>
        {fields.map(([key, label]) => (
          <div key={key} style={S.field}>
            <label style={S.label}>{label}</label>
            {view === "manager"
              ? <textarea value={kit[key] || ""} onChange={e => onUpdate(key, e.target.value)} style={S.textarea} />
              : <div style={{ fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.6, color: B.text }}>{kit[key] || "—"}</div>
            }
          </div>
        ))}
      </div>

      <div style={{ background: B.cardBg, padding: 16, borderRadius: 14, border: `1px solid ${B.primary}40` }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 }}>Paleta de colores</div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[["Principal", B.primary], ["Suave", B.primarySoft], ["Acento", B.accent], ["Fondo", B.bg], ["Botón", B.btnBg]].map(([lbl, color]) => (
            <div key={lbl} style={{ textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: 10, background: color, border: "1px solid #ddd", marginBottom: 4 }} />
              <div style={{ fontSize: 10, color: "#888" }}>{lbl}</div>
              <div style={{ fontSize: 9, color: "#aaa" }}>{color}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
