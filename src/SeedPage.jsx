import { useState } from "react";
import { supabase } from "./supabase";
import { initialData } from "./data/initialData";
import { toRow } from "./lib/utils";

export default function SeedPage() {
  const [log, setLog] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  function addLog(msg) {
    setLog(prev => [...prev, msg]);
  }

  async function seedAccount(accountId) {
    addLog(`🗑 Eliminando datos existentes de "${accountId}"...`);
    const { error: delErr } = await supabase.from("contenidos").delete().eq("account_id", accountId);
    if (delErr) { addLog(`❌ Error al eliminar: ${delErr.message}`); return false; }

    const items = initialData[accountId] || [];
    if (items.length === 0) { addLog(`⚠️ No hay datos para "${accountId}"`); return true; }

    addLog(`📤 Insertando ${items.length} items para "${accountId}"...`);
    const { error: insErr } = await supabase.from("contenidos").upsert(items.map(toRow));
    if (insErr) { addLog(`❌ Error al insertar: ${insErr.message}`); return false; }

    addLog(`✅ "${accountId}" cargado correctamente (${items.length} items)`);
    return true;
  }

  async function handleSeed(accountId) {
    setRunning(true);
    setLog([]);
    setDone(false);
    addLog(`🚀 Iniciando carga para: ${accountId === "all" ? "todas las cuentas" : accountId}`);

    const accounts = accountId === "all" ? ["basile", "caro", "suitehouse", "mariano"] : [accountId];
    for (const acc of accounts) {
      await seedAccount(acc);
    }

    addLog("🎉 ¡Listo!");
    setRunning(false);
    setDone(true);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f8", fontFamily: "monospace", padding: 40 }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, marginBottom: 8, color: "#1a202c" }}>🌱 Carga de datos a Supabase</h1>
        <p style={{ color: "#666", marginBottom: 24, fontSize: 14 }}>
          Esta página elimina los datos existentes de una cuenta y los recarga desde el código fuente.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 24 }}>
          {["mariano", "caro", "basile", "suitehouse", "all"].map(acc => (
            <button
              key={acc}
              disabled={running}
              onClick={() => handleSeed(acc)}
              style={{
                padding: "10px 18px", borderRadius: 8, border: "none", cursor: running ? "not-allowed" : "pointer",
                background: acc === "all" ? "#e53e3e" : "#4f46e5", color: "#fff", fontWeight: 700,
                fontSize: 13, opacity: running ? 0.6 : 1,
              }}
            >
              {acc === "all" ? "⚠️ Recargar TODO" : `Recargar ${acc}`}
            </button>
          ))}
        </div>

        {log.length > 0 && (
          <div style={{ background: "#1a202c", borderRadius: 10, padding: 16, color: "#e2e8f0", fontSize: 13, lineHeight: 2 }}>
            {log.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        )}

        {done && (
          <div style={{ marginTop: 16, padding: 14, background: "#c6f6d5", borderRadius: 8, color: "#276749", fontWeight: 700 }}>
            ✅ Datos cargados. Podés cerrar esta página y volver a la app.
          </div>
        )}
      </div>
    </div>
  );
}
