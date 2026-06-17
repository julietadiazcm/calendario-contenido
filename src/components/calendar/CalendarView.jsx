import { useState } from "react";
import { STATUS_OPTIONS, CONTENT_TYPES } from "../../constants";
import { Badge } from "../shared/Badge";
import { STATUS_COLORS } from "../../constants";
import { getDayName, getWeekFromDate, todayISO, newContent } from "../../lib/utils";
import { MonthCalendar } from "./MonthCalendar";
import { KanbanBoard } from "./KanbanBoard";
import { DayPanel } from "./DayPanel";

export function CalendarView({ visibleItems, account, accounts, filters, setFilters, view, S, onSelectItem, onNew, onNewForDate }) {
  const B = account.brand;
  const [calendarMode, setCalendarMode] = useState("list");
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDayPanel, setShowDayPanel] = useState(false);

  const Pill = ({ label }) => (
    <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600, background: `${B.primary}25`, color: B.primary, marginRight: 4 }}>
      {label}
    </span>
  );

  function renderCard(item) {
    const done = item.checklist?.filter(c => c.done).length || 0;
    const total = item.checklist?.length || 10;
    return (
      <div
        key={item.id}
        onClick={() => onSelectItem(item)}
        style={{ background: B.cardBg, border: `1px solid ${B.primary}35`, borderLeft: `5px solid ${STATUS_COLORS[item.status] || "#ccc"}`, borderRadius: 14, padding: 16, marginBottom: 10, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", transition: "all 0.18s" }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 6px 20px ${B.primary}30`; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, marginBottom: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15, fontFamily: B.fontTitle, marginBottom: 4 }}>{item.theme || "Sin título"}</div>
            <div style={{ fontSize: 12, color: "#777" }}>
              <Pill label={item.section === "story" ? "Story" : item.type} />
              {getDayName(item.date)}
            </div>
            {view === "manager" && filters.client === "all" && (
              <div style={{ fontSize: 12, color: "#aaa", marginTop: 2 }}>{item.accountName}</div>
            )}
          </div>
          <div style={{ flexShrink: 0 }}><Badge status={item.status} /></div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#aaa", flexWrap: "wrap" }}>
          {(item.clientComments || []).length > 0 && <span>💬 {item.clientComments.length}</span>}
          {view === "manager" && (item.internalNotes || []).length > 0 && <span>📝 {item.internalNotes.length}</span>}
          {view === "manager" && <span style={{ color: done === total ? "#22c55e" : "#aaa" }}>✅ {done}/{total}</span>}
          {item.slides?.length > 0 && <span>📋 {item.slides.length} slides</span>}
          {item.section === "story" && <span style={{ color: B.primary }}>📖 Historia</span>}
        </div>
      </div>
    );
  }

  const grouped = visibleItems.reduce((acc, item) => {
    const k = item.date || "Sin fecha";
    acc[k] = acc[k] || [];
    acc[k].push(item);
    return acc;
  }, {});

  function exportCSV() {
    const rows = [
      ["Cliente","Fecha","Sección","Tipo","Tema","Estado","Copy/Contenido","Guion/Script"],
      ...visibleItems.map(i => [
        i.accountName || account.name, i.date, i.section, i.type, i.theme, i.status,
        (i.copy || i.content || "").replace(/\n/g, " "),
        (i.script || "").replace(/\n/g, " "),
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v || ""}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "calendario.csv"; a.click();
    URL.revokeObjectURL(url);
  }

  const dayPanelItems = selectedDate ? visibleItems.filter(i => i.date === selectedDate) : [];

  return (
    <>
      {/* Account header */}
      <div style={{ background: `linear-gradient(135deg,${B.primary},${B.primarySoft})`, padding: "20px 24px", borderRadius: 16, marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: B.btnText, fontFamily: B.fontTitle }}>{account.emoji} {account.name}</div>
        <div style={{ fontSize: 13, color: `${B.btnText}cc` }}>{account.description}</div>
      </div>

      {/* View mode tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap", alignItems: "center" }}>
        {[["list","📋 Lista"],["month","📅 Mes"],["kanban","🗂 Kanban"]].map(([mode, label]) => (
          <button key={mode} onClick={() => setCalendarMode(mode)} style={{ padding: "7px 16px", borderRadius: 20, border: `1.5px solid ${calendarMode === mode ? B.primary : "#ddd"}`, background: calendarMode === mode ? B.primary : "#fff", color: calendarMode === mode ? B.btnText : "#777", fontWeight: calendarMode === mode ? 700 : 400, fontSize: 12, cursor: "pointer", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Section tabs (list only) */}
      {calendarMode === "list" && (
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
          {[["all","Todo"],["post","Posts & Reels"],["story","Historias"]].map(([val, label]) => (
            <button key={val} onClick={() => setFilters({ ...filters, section: val })} style={{ padding: "8px 18px", borderRadius: 20, border: `1.5px solid ${filters.section === val ? B.primary : "#ddd"}`, background: filters.section === val ? B.primary : "#fff", color: filters.section === val ? B.btnText : "#777", fontWeight: filters.section === val ? 700 : 400, fontSize: 13, cursor: "pointer", transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
          <div style={{ marginLeft: "auto", fontSize: 13, color: "#aaa" }}>
            {visibleItems.filter(i => i.section === "post").length} posts · {visibleItems.filter(i => i.section === "story").length} historias
          </div>
        </div>
      )}

      {/* Filters (list only) */}
      {calendarMode === "list" && (
        <div style={{ background: B.cardBg, padding: 16, borderRadius: 14, marginBottom: 16, border: `1px solid ${B.primary}35` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: 10 }}>
            {view === "manager" && (
              <div>
                <label style={S.label}>Cliente</label>
                <select style={S.input} value={filters.client} onChange={e => setFilters({ ...filters, client: e.target.value })}>
                  <option value="current">Cliente actual</option>
                  <option value="all">Todos</option>
                  {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
            )}
            <div><label style={S.label}>Estado</label><select style={S.input} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}><option value="all">Todos</option>{STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}</select></div>
            <div><label style={S.label}>Tipo</label><select style={S.input} value={filters.type} onChange={e => setFilters({ ...filters, type: e.target.value })}><option value="all">Todos</option>{CONTENT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label style={S.label}>Mes</label><input type="month" style={S.input} value={filters.month} onChange={e => setFilters({ ...filters, month: e.target.value })} /></div>
            <div><label style={S.label}>Semana</label><select style={S.input} value={filters.week} onChange={e => setFilters({ ...filters, week: e.target.value })}><option value="all">Todas</option>{[1,2,3,4,5].map(w => <option key={w} value={w}>Semana {w}</option>)}</select></div>
            <div><label style={S.label}>Buscar</label><input style={S.input} value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} placeholder="Buscar..." /></div>
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 13 }}>
            <label style={{ cursor: "pointer" }}><input type="checkbox" checked={filters.withComments} onChange={e => setFilters({ ...filters, withComments: e.target.checked })} /> Con comentarios</label>
            <label style={{ cursor: "pointer" }}><input type="checkbox" checked={filters.incomplete} onChange={e => setFilters({ ...filters, incomplete: e.target.checked })} /> Incompletos</label>
            <label style={{ cursor: "pointer" }}><input type="checkbox" checked={filters.changes} onChange={e => setFilters({ ...filters, changes: e.target.checked })} /> Cambios solicitados</label>
            {(filters.status !== "all" || filters.type !== "all" || filters.month || filters.week !== "all" || filters.search || filters.withComments || filters.incomplete || filters.changes) && (
              <button onClick={() => setFilters({ ...filters, status: "all", type: "all", month: "", week: "all", search: "", withComments: false, incomplete: false, changes: false })} style={{ ...S.outline, fontSize: 11, padding: "4px 10px" }}>✕ Limpiar</button>
            )}
          </div>
        </div>
      )}

      {calendarMode === "list" && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <strong>{visibleItems.length} contenido{visibleItems.length !== 1 ? "s" : ""}</strong>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={S.outline} onClick={exportCSV}>📥 CSV</button>
            {view === "manager" && <button style={S.btn} onClick={onNew}>+ Nuevo</button>}
          </div>
        </div>
      )}

      {calendarMode === "month" && (
        <MonthCalendar
          visibleItems={visibleItems}
          account={account}
          S={S}
          onDayClick={date => { setSelectedDate(date); setShowDayPanel(true); }}
          onNewForDate={onNewForDate}
        />
      )}

      {calendarMode === "kanban" && (
        <KanbanBoard
          visibleItems={visibleItems}
          account={account}
          filters={filters}
          view={view}
          onSelectItem={onSelectItem}
        />
      )}

      {calendarMode === "list" && (
        <>
          {Object.keys(grouped).length === 0 && (
            <div style={{ padding: 60, textAlign: "center", color: "#aaa" }}>📭 No hay contenidos con estos filtros.</div>
          )}
          {Object.keys(grouped).sort().map(date => (
            <div key={date}>
              <div style={{ fontSize: 11, fontWeight: 800, color: B.primary, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 8, marginTop: 18 }}>
                — {getDayName(date)}
              </div>
              {grouped[date].map(renderCard)}
            </div>
          ))}
        </>
      )}

      {showDayPanel && selectedDate && (
        <DayPanel
          date={selectedDate}
          items={dayPanelItems}
          account={account}
          view={view}
          S={S}
          onClose={() => setShowDayPanel(false)}
          onOpenItem={onSelectItem}
          onNewForDate={date => { setShowDayPanel(false); onNewForDate(date); }}
        />
      )}
    </>
  );
}
