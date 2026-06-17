export function Toast({ toast }) {
  if (!toast) return null;

  const bg = toast.type === "error" ? "#ef4444"
    : toast.type === "warn" ? "#f59e0b"
    : "#22c55e";

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      background: bg, color: "#fff", padding: "12px 20px",
      borderRadius: 10, fontSize: 13, fontWeight: 700,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      animation: "fadeIn 0.2s ease",
    }}>
      {toast.msg}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
