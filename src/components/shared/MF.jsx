export function MF({ label, value, onChange, editable, textarea, highlight, S, B }) {
  return (
    <div style={S.field}>
      <label style={S.label}>{label}</label>
      {editable
        ? textarea
          ? <textarea style={S.textarea} value={value || ""} onChange={e => onChange(e.target.value)} />
          : <input style={S.input} value={value || ""} onChange={e => onChange(e.target.value)} />
        : (
          <div style={{
            fontSize: 13, whiteSpace: "pre-wrap", lineHeight: 1.65,
            ...(highlight && B ? { background: `${B.primary}12`, padding: "10px 12px", borderRadius: 8, border: `1px solid ${B.primary}25` } : {}),
          }}>
            {value || "—"}
          </div>
        )
      }
    </div>
  );
}
