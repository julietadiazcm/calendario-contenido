import { DayPanelCard } from "../shared/DayPanelCard";
import { getDayName } from "../../lib/utils";

export function DayPanel({ date, items, account, view, S, onClose, onOpenItem, onNewForDate }) {
  const B = account.brand;
  if (!date) return null;

  const posts = items.filter(i => i.section === "post");
  const stories = items.filter(i => i.section === "story");
  const isClient = view === "client";
  const sTitle = { fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8 };

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 900, display: "flex", justifyContent: "flex-end" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background: B.white, width: "100%", maxWidth: 480, height: "100%", overflowY: "auto", boxShadow: "-8px 0 40px rgba(0,0,0,0.2)", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "18px 20px", background: B.primary, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <div>
            <div style={{ color: `${B.btnText}90`, fontSize: 11, marginBottom: 2, textTransform: "uppercase", letterSpacing: 1 }}>Contenidos del día</div>
            <div style={{ color: B.btnText, fontWeight: 800, fontSize: 17, fontFamily: B.fontTitle }}>{getDayName(date)}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {!isClient && (
              <button
                onClick={() => { onClose(); onNewForDate(date); }}
                style={{ padding: "7px 14px", borderRadius: 8, border: `1.5px solid ${B.btnText}`, background: "transparent", color: B.btnText, fontWeight: 700, fontSize: 12, cursor: "pointer" }}
              >
                + Nuevo
              </button>
            )}
            <button
              onClick={onClose}
              style={{ padding: "7px 12px", borderRadius: 8, border: `1.5px solid ${B.btnText}50`, background: "transparent", color: B.btnText, cursor: "pointer", fontSize: 16 }}
            >✕</button>
          </div>
        </div>

        <div style={{ padding: 18, flex: 1 }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 20px", color: "#aaa" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: 14, marginBottom: 16 }}>No hay contenidos para este día</div>
              {!isClient && (
                <button
                  onClick={() => { onClose(); onNewForDate(date); }}
                  style={{ ...S.btn, padding: "9px 20px" }}
                >
                  + Crear contenido para este día
                </button>
              )}
            </div>
          ) : (
            <>
              {posts.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ ...sTitle, marginBottom: 10 }}>📌 Posts & Reels ({posts.length})</div>
                  {posts.map(item => (
                    <DayPanelCard key={item.id} item={item} onOpen={() => { onClose(); onOpenItem(item); }} isClient={isClient} B={B} />
                  ))}
                </div>
              )}
              {stories.length > 0 && (
                <div>
                  <div style={{ ...sTitle, marginBottom: 10 }}>📖 Historias ({stories.length})</div>
                  {stories.map(item => (
                    <DayPanelCard key={item.id} item={item} onOpen={() => { onClose(); onOpenItem(item); }} isClient={isClient} B={B} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
