import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CLIENTS = {
  caro: {
    name: "Caro · Nutricionista",
    emoji: "🥗",
    password: "caro",
    primary: "#99B8B2",
    primarySoft: "#c8dcd9",
    btnBg: "#99B8B2",
    btnText: "#FFFDF8",
    bg: "#E9E7EA",
    text: "#171820",
    white: "#FFFDF8",
  },
  basile: {
    name: "Distribuidora Basile",
    emoji: "📦",
    password: "basile",
    primary: "#F6D522",
    primarySoft: "#FBEA8C",
    btnBg: "#EF1C16",
    btnText: "#FFFFFF",
    bg: "#FFF8D0",
    text: "#111111",
    white: "#FFFEF5",
  },
  suitehouse: {
    name: "Suite House Cariló",
    emoji: "🌲",
    password: "suitehouse",
    primary: "#AAB8A3",
    primarySoft: "#d0daca",
    btnBg: "#928359",
    btnText: "#FFFFFF",
    bg: "#f5f3ef",
    text: "#1A1A1A",
    white: "#FFFFFF",
  },
};

export default function ClientLogin() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const client = CLIENTS[clientId];

  if (!client) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f5" }}>
        <div style={{ textAlign: "center", color: "#888" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
          <div style={{ fontSize: 18 }}>Cliente no encontrado</div>
        </div>
      </div>
    );
  }

  function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (password.toLowerCase().trim() === client.password) {
        sessionStorage.setItem(`auth_${clientId}`, "true");
        navigate(`/cliente/${clientId}/ver`);
      } else {
        setError(true);
        setLoading(false);
        setPassword("");
      }
    }, 600);
  }

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${client.primary}, ${client.primarySoft})`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, fontFamily: "'Trebuchet MS', sans-serif" }}>
      <div style={{ background: client.white, borderRadius: 20, padding: "48px 40px", width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>{client.emoji}</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: client.text, marginBottom: 4, fontFamily: "'Georgia', serif" }}>{client.name}</h1>
        <p style={{ fontSize: 14, color: "#888", marginBottom: 32 }}>Calendario de contenido</p>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Contraseña"
              autoFocus
              style={{ width: "100%", padding: "14px 16px", border: `2px solid ${error ? "#ef4444" : client.primary}`, borderRadius: 10, fontSize: 16, fontFamily: "'Trebuchet MS', sans-serif", color: client.text, background: "#fafafa", boxSizing: "border-box", outline: "none", textAlign: "center", letterSpacing: 2 }}
            />
            {error && <div style={{ color: "#ef4444", fontSize: 13, marginTop: 8 }}>Contraseña incorrecta. Intentá de nuevo.</div>}
          </div>

          <button type="submit" disabled={loading || !password.trim()}
            style={{ width: "100%", padding: "14px", borderRadius: 10, border: "none", background: client.btnBg, color: client.btnText, fontSize: 16, fontWeight: 700, cursor: loading || !password.trim() ? "not-allowed" : "pointer", opacity: !password.trim() ? 0.6 : 1, transition: "all 0.2s" }}>
            {loading ? "Entrando..." : "Entrar →"}
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#bbb", marginTop: 24 }}>Acceso exclusivo para clientes</p>
      </div>
    </div>
  );
}
