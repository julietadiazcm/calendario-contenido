import { useState } from "react";
import { todayISO, getDayName } from "../../lib/utils";

const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DOW = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

export function MonthCalendar({ visibleItems, account, S, onDayClick, onNewForDate }) {
  const B = account.brand;
  const [currentMonth, setCurrentMonth] = useState(todayISO().slice(0, 7));

  const [year, month] = currentMonth.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  const startDow = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  function dayStr(d) {
    return d ? `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}` : null;
  }

  function getItemsByDate(date) {
    return visibleItems.filter(i => i.date === date);
  }

  function DayCell({ d }) {
    if (!d) return <div style={{ background: "transparent", borderRadius: 10, minHeight: 90 }} />;
    const ds = dayStr(d);
    const items = getItemsByDate(ds);
    const isToday = ds === todayISO();
    const hasPending = items.some(i => ["Para revisión interna","Enviado al cliente","Cambios solicitados"].includes(i.status));
    const hasApproved = items.some(i => ["Aprobado","Programado"].includes(i.status));
    const hasPublished = items.some(i => i.status === "Publicado");
    const posts = items.filter(i => i.section === "post");
    const stories = items.filter(i => i.section === "story");
    const typeCounts = {};
    posts.forEach(i => { typeCounts[i.type] = (typeCounts[i.type] || 0) + 1; });
    const dotColor = hasPublished ? "#6366f1" : hasApproved ? "#22c55e" : hasPending ? "#f59e0b" : "#e5e7eb";

    return (
      <div
        onClick={() => onDayClick(ds)}
        style={{
          background: items.length > 0 ? B.cardBg : "transparent",
          borderRadius: 10, minHeight: 90, padding: "7px 8px",
          cursor: "pointer",
          border: isToday ? `2px solid ${B.primary}` : `1px solid ${items.length > 0 ? B.primary + "40" : "#e5e7eb"}`,
          transition: "all 0.18s", position: "relative",
        }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 14px ${B.primary}30`; e.currentTarget.style.transform = "translateY(-1px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{
            fontWeight: isToday ? 800 : 600, fontSize: 13,
            color: isToday ? B.primary : B.text,
            background: isToday ? `${B.primary}20` : "transparent",
            borderRadius: "50%", width: 22, height: 22,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {d}
          </span>
          {items.length > 0 && <div style={{ width: 8, height: 8, borderRadius: "50%", background: dotColor }} />}
        </div>
        {items.length > 0 && (
          <>
            <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>{items.length} pieza{items.length !== 1 ? "s" : ""}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {Object.entries(typeCounts).map(([type, count]) => (
                <span key={type} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 10, background: `${B.primary}30`, color: B.primary, fontWeight: 700 }}>
                  {type} {count > 1 ? `×${count}` : ""}
                </span>
              ))}
              {stories.length > 0 && (
                <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 10, background: `${B.accent}30`, color: B.accent, fontWeight: 700 }}>
                  📖 ×{stories.length}
                </span>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <button
          onClick={() => { const d = new Date(year, month - 2, 1); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); }}
          style={{ ...S.outline, padding: "7px 14px", fontSize: 16 }}
        >‹</button>
        <h2 style={{ margin: 0, fontFamily: "'Georgia',serif", fontSize: 20 }}>
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        <button
          onClick={() => { const d = new Date(year, month, 1); setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`); }}
          style={{ ...S.outline, padding: "7px 14px", fontSize: 16 }}
        >›</button>
        <button
          onClick={() => setCurrentMonth(todayISO().slice(0, 7))}
          style={{ ...S.outline, padding: "6px 12px", fontSize: 12, marginLeft: 4 }}
        >
          Hoy
        </button>
        <div style={{ marginLeft: "auto", fontSize: 13, color: "#888" }}>
          {visibleItems.filter(i => i.date?.startsWith(currentMonth)).length} contenidos este mes
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: "#aaa", padding: "6px 0", textTransform: "uppercase", letterSpacing: 1 }}>
            {d}
          </div>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6, marginBottom: 6 }}>
          {week.map((d, di) => <DayCell key={di} d={d} />)}
        </div>
      ))}

      <div style={{ display: "flex", gap: 16, marginTop: 12, fontSize: 11, color: "#aaa", flexWrap: "wrap" }}>
        {[["#6366f1","Publicado"],["#22c55e","Aprobado/Programado"],["#f59e0b","Pendiente revisión"],["#e5e7eb","Sin estado crítico"]].map(([color, label]) => (
          <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
