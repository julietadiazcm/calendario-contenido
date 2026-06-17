import { useMemo, useState } from "react";
import { ACCOUNTS } from "./data/accounts";
import { useData } from "./hooks/useData";
import { makeStyles, newContent, getWeekFromDate, todayISO } from "./lib/utils";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Toast } from "./components/shared/Toast";
import { CalendarView } from "./components/calendar/CalendarView";
import { Dashboard } from "./components/Dashboard";
import { BrandKit } from "./components/BrandKit";
import { AIAgent } from "./components/AIAgent";
import { Notifications, getNotifCount } from "./components/Notifications";
import { ContentModal } from "./components/modals/ContentModal";
import { NewContentModal } from "./components/modals/NewContentModal";

export default function App() {
  const { data, setData, loading, toast, updateItem, deleteItem, createItem, duplicateItem } = useData();
  const [accounts, setAccounts] = useState(ACCOUNTS);

  const [view, setView] = useState("manager");
  const [tab, setTab] = useState("calendar");
  const [activeAccountId, setActiveAccountId] = useState("caro");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [newInitialDate, setNewInitialDate] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filters, setFilters] = useState({
    client: "current", status: "all", type: "all", section: "all",
    month: "", week: "all", search: "", withComments: false, incomplete: false, changes: false,
  });

  const account = accounts.find(a => a.id === activeAccountId) || accounts[0];
  const B = account.brand;
  const S = makeStyles(B);

  const allItems = useMemo(() => (
    Object.entries(data).flatMap(([aid, items]) =>
      items.map(item => ({
        ...item,
        accountId: aid,
        accountName: accounts.find(a => a.id === aid)?.name || aid,
      }))
    )
  ), [data, accounts]);

  const visibleItems = useMemo(() => {
    let items = view === "client" ? (data[activeAccountId] || []) : allItems;
    if (view === "manager" && filters.client === "current") items = items.filter(i => i.accountId === activeAccountId);
    if (view === "manager" && filters.client !== "current" && filters.client !== "all") items = items.filter(i => i.accountId === filters.client);
    if (filters.section !== "all") items = items.filter(i => i.section === filters.section);
    if (filters.status !== "all") items = items.filter(i => i.status === filters.status);
    if (filters.type !== "all") items = items.filter(i => i.type === filters.type);
    if (filters.week !== "all") items = items.filter(i => String(i.week) === String(filters.week));
    if (filters.month) items = items.filter(i => i.date?.startsWith(filters.month));
    if (filters.withComments) items = items.filter(i => i.clientComments?.length);
    if (filters.changes) items = items.filter(i => i.status === "Cambios solicitados");
    if (filters.incomplete) items = items.filter(i => !i.date || !i.theme || (i.section === "post" && !i.copy && !i.script) || (i.section === "story" && !i.content));
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      items = items.filter(i => [i.theme, i.copy, i.script, i.content, i.objective].join(" ").toLowerCase().includes(q));
    }
    return items.sort((a, b) => (a.date || "").localeCompare(b.date || ""));
  }, [data, activeAccountId, allItems, filters, view]);

  const stats = useMemo(() => {
    const byClient = accounts.map(acc => {
      const items = data[acc.id] || [];
      return {
        id: acc.id, name: acc.name, emoji: acc.emoji, brand: acc.brand,
        total: items.length,
        drafts: items.filter(i => i.status === "Borrador").length,
        sent: items.filter(i => i.status === "Enviado al cliente").length,
        changes: items.filter(i => i.status === "Cambios solicitados").length,
        approved: items.filter(i => i.status === "Aprobado").length,
        scheduled: items.filter(i => i.status === "Programado").length,
        published: items.filter(i => i.status === "Publicado").length,
        comments: items.reduce((a, i) => a + (i.clientComments?.length || 0), 0),
        noCopy: items.filter(i => i.section === "post" && !i.copy).length,
        noScript: items.filter(i => i.section === "post" && !i.script).length,
      };
    });
    const now = new Date(todayISO() + "T00:00:00");
    const next7 = allItems.filter(i => {
      if (!i.date) return false;
      const diff = (new Date(i.date + "T00:00:00") - now) / 86400000;
      return diff >= 0 && diff <= 7;
    });
    return { byClient, next7 };
  }, [data, accounts, allItems]);

  const notifCount = useMemo(() => getNotifCount(allItems), [allItems]);

  function handleViewChange(v) {
    setView(v);
    if (v === "client") setTab("calendar");
  }

  function handleSaveItem(item) {
    updateItem(item);
    setSelectedItem(null);
  }

  function handleCreateItem(draft) {
    const item = {
      ...draft,
      id: `${activeAccountId}_${Date.now()}`,
      accountId: activeAccountId,
      week: getWeekFromDate(draft.date),
      slides: [],
      clientComments: [],
      internalNotes: [],
      checklist: [],
      metrics: {},
    };
    createItem(item);
  }

  function handleNewForDate(date) {
    setNewInitialDate(date);
    setShowNew(true);
  }

  function updateBrandKit(field, value) {
    setAccounts(prev => prev.map(acc =>
      acc.id === activeAccountId ? { ...acc, brandKit: { ...acc.brandKit, [field]: value } } : acc
    ));
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: B.bg, fontFamily: B.fontBody }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>📅</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: B.primary, marginBottom: 8 }}>Cargando calendario…</div>
          <div style={{ fontSize: 13, color: "#aaa" }}>Sincronizando con Supabase</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: B.bg, color: B.text, fontFamily: B.fontBody }}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}
        ::-webkit-scrollbar-thumb{background:${B.primary}60;border-radius:3px}
        @media(max-width:640px){
          .cm-hamburger{display:flex !important;align-items:center}
          .cm-header-hint{display:none}
          .cm-sidebar{
            position:fixed !important;
            top:58px !important;
            left:0 !important;
            bottom:0 !important;
            z-index:250 !important;
            transform:translateX(-100%) !important;
            transition:transform 0.25s ease !important;
            overflow-y:auto !important;
            box-shadow:none !important;
          }
          .cm-sidebar.cm-sidebar-open{
            transform:translateX(0) !important;
            box-shadow:4px 0 24px rgba(0,0,0,0.25) !important;
          }
          .cm-sidebar-backdrop{
            display:block !important;
            position:fixed !important;
            inset:58px 0 0 0 !important;
            background:rgba(0,0,0,0.4) !important;
            z-index:240 !important;
          }
          .cm-main{padding:12px !important}
        }
      `}</style>

      <Header B={B} view={view} onViewChange={handleViewChange} onMenuToggle={() => setSidebarOpen(o => !o)} sidebarOpen={sidebarOpen} />

      <div style={{ display: "flex", minHeight: "calc(100vh - 58px)" }}>
        <Sidebar
          accounts={accounts}
          activeAccountId={activeAccountId}
          onSelectAccount={id => { setActiveAccountId(id); setFilters(f => ({ ...f, client: "current" })); }}
          tab={tab}
          onSelectTab={setTab}
          view={view}
          B={B}
          notifCount={notifCount}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="cm-main" style={{ flex: 1, padding: 24, overflowY: "auto" }}>
          {tab === "calendar" && (
            <CalendarView
              visibleItems={visibleItems}
              account={account}
              accounts={accounts}
              filters={filters}
              setFilters={f => {
                setFilters(f);
                if (f.client && f.client !== "current" && f.client !== "all") setActiveAccountId(f.client);
              }}
              view={view}
              S={S}
              onSelectItem={setSelectedItem}
              onNew={() => { setNewInitialDate(null); setShowNew(true); }}
              onNewForDate={handleNewForDate}
            />
          )}
          {tab === "dashboard" && view === "manager" && (
            <Dashboard
              stats={stats}
              account={account}
              S={S}
              onSelectItem={setSelectedItem}
              onSelectAccount={setActiveAccountId}
            />
          )}
          {tab === "brand" && (
            <BrandKit
              account={account}
              view={view}
              S={S}
              onUpdate={updateBrandKit}
            />
          )}
          {tab === "ai" && view === "manager" && (
            <AIAgent account={account} selectedItem={selectedItem} S={S} />
          )}
          {tab === "notifications" && view === "manager" && (
            <Notifications
              allItems={allItems}
              accounts={accounts}
              S={S}
              onSelectItem={setSelectedItem}
              onSelectAccount={setActiveAccountId}
            />
          )}
        </main>
      </div>

      {selectedItem && (
        <ContentModal
          item={selectedItem}
          account={accounts.find(a => a.id === selectedItem.accountId) || account}
          view={view}
          S={S}
          onClose={() => setSelectedItem(null)}
          onSave={handleSaveItem}
          onDelete={item => { deleteItem(item); setSelectedItem(null); }}
          onDuplicate={item => { duplicateItem(item); setSelectedItem(null); }}
        />
      )}

      {showNew && (
        <NewContentModal
          account={account}
          S={S}
          onClose={() => { setShowNew(false); setNewInitialDate(null); }}
          onCreate={handleCreateItem}
          initialDate={newInitialDate}
        />
      )}

      <Toast toast={toast} />
    </div>
  );
}
