import { useState } from "react";
import { Badge } from "./shared/Badge";

export function AIAgent({ account, selectedItem, S }) {
  const B = account.brand;
  const [aiInput, setAiInput] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const actions = [
    ["💡 Crear ideas de posts", "Generame 5 ideas de posts para este cliente basadas en su tono y objetivo"],
    ["✍️ Mejorar copy", "Mejorar el copy del contenido seleccionado manteniendo el tono del cliente"],
    ["🎬 Generar guion para reel", "Generar un guion completo con hook, desarrollo y CTA para el contenido seleccionado"],
    ["📖 Crear historias", "Crear 3 historias para acompañar el contenido seleccionado"],
    ["📣 Generar opciones de CTA", "Generame 3 opciones de CTA distintos para este contenido"],
    ["🔍 Revisar equilibrio del calendario", "Analizá si el calendario tiene buen equilibrio entre venta, comunidad, educación y autoridad"],
    ["💬 Gestionar cambios del cliente", "Resumí los comentarios del cliente del contenido seleccionado y convertirlos en tareas concretas"],
    ["📊 Armar reporte mensual", "Armame la estructura de un reporte mensual profesional para enviarle al cliente"],
  ];

  async function runAI(prompt) {
    setAiLoading(true);
    setAiOutput("");
    const kit = account.brandKit;
    const fullPrompt = `Sos una experta Community Manager y estratega de contenido para redes sociales.

CLIENTE: ${account.name}
DESCRIPCIÓN: ${account.description}
PÚBLICO: ${kit.audience}
OBJETIVO: ${kit.objective}
TONO: ${kit.tone}
PALABRAS SÍ: ${kit.wordsYes}
PALABRAS NO: ${kit.wordsNo}
NOTAS: ${kit.notes}
${selectedItem ? `\nCONTENIDO ACTIVO:\n- Tema: ${selectedItem.theme}\n- Tipo: ${selectedItem.type}\n- Estado: ${selectedItem.status}\n- Copy: ${selectedItem.copy || "sin copy"}\n- Guion: ${selectedItem.script || "sin guion"}` : ""}
${(selectedItem?.clientComments || []).length ? `\nCOMENTARIOS DEL CLIENTE:\n${selectedItem.clientComments.map(c => c.text).join("\n")}` : ""}

PEDIDO: ${prompt}

Respondé de forma clara, concreta y lista para usar. Sin rodeos.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 1000, messages: [{ role: "user", content: fullPrompt }] }),
      });
      const json = await res.json();
      setAiOutput(json.content?.filter(b => b.type === "text").map(b => b.text).join("\n") || "Sin respuesta.");
    } catch {
      setAiOutput("Error al conectar. Intentá de nuevo.");
    }
    setAiLoading(false);
  }

  return (
    <div>
      <h2 style={{ marginBottom: 4, fontFamily: "'Georgia',serif" }}>🤖 Agente IA · {account.name}</h2>
      <p style={{ color: "#777", marginBottom: 16 }}>
        Trabajá con el contexto completo del cliente
        {selectedItem ? ` y el contenido: "${selectedItem.theme}"` : ". Seleccioná un contenido del calendario para trabajar sobre él."}
      </p>

      {selectedItem && (
        <div style={{ background: `${B.primary}18`, border: `1px solid ${B.primary}35`, borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13 }}>
          <strong>Contenido activo:</strong> {selectedItem.theme} · {selectedItem.type} · <Badge status={selectedItem.status} />
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "230px 1fr", gap: 16 }}>
        <div style={{ background: B.cardBg, padding: 14, borderRadius: 14, border: `1px solid ${B.primary}40`, display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 4 }}>Acciones rápidas</div>
          {actions.map(([label, prompt]) => (
            <button key={label} style={{ ...S.outline, width: "100%", textAlign: "left", fontSize: 12, padding: "7px 10px" }} onClick={() => { setAiInput(prompt); runAI(prompt); }}>
              {label}
            </button>
          ))}
        </div>

        <div style={{ background: B.cardBg, padding: 16, borderRadius: 14, border: `1px solid ${B.primary}40` }}>
          <div style={S.field}>
            <label style={S.label}>¿Qué necesitás?</label>
            <textarea
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              style={{ ...S.textarea, minHeight: 70 }}
              placeholder={"Ej: Generame 5 ideas para Caro sobre menopausia\nEj: Mejorar el hook de este reel\nEj: Crear historias para este carrusel de Basile"}
            />
          </div>
          <button style={{ ...S.btn, marginBottom: 16 }} onClick={() => runAI(aiInput)} disabled={aiLoading}>
            {aiLoading ? "⏳ Generando..." : "🚀 Enviar a IA"}
          </button>

          {aiOutput && (
            <div>
              <label style={S.label}>Respuesta</label>
              <div style={{ whiteSpace: "pre-wrap", background: `${B.primary}12`, padding: 16, borderRadius: 12, fontSize: 13, lineHeight: 1.7, border: `1px solid ${B.primary}25`, maxHeight: 380, overflowY: "auto" }}>
                {aiOutput}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button style={{ ...S.outline, fontSize: 11, padding: "5px 12px" }} onClick={() => navigator.clipboard?.writeText(aiOutput)}>📋 Copiar</button>
              </div>
            </div>
          )}
          {!aiOutput && !aiLoading && (
            <div style={{ padding: 40, textAlign: "center", color: "#aaa", background: `${B.primary}08`, borderRadius: 12, fontSize: 13 }}>
              Seleccioná una acción o escribí tu pedido 👆
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
