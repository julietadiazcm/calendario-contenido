import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import { STORAGE_KEY } from "../constants";
import { initialData } from "../data/initialData";
import { createChecklist, createMetrics, toRow } from "../lib/utils";

export function useData() {
  const [data, setData] = useState(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      return s ? JSON.parse(s) : initialData;
    } catch {
      return initialData;
    }
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  function showToast(msg, type = "success") {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 3000);
  }

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data: rows, error } = await supabase.from("contenidos").select("*");

      if (error) {
        showToast("Sin conexión a Supabase — usando datos locales", "warn");
        setLoading(false);
        return;
      }

      const mapped = { basile: [], caro: [], suitehouse: [], mariano: [] };

      if (!rows || rows.length === 0) {
        // DB completely empty — seed everything
        const items = Object.values(initialData).flat();
        const { error: seedErr } = await supabase.from("contenidos").upsert(items.map(toRow));
        if (seedErr) showToast("Error al sincronizar datos iniciales", "error");
        else showToast("Datos sincronizados con Supabase ✓");
        setLoading(false);
        return;
      }

      rows.forEach(r => {
        const item = {
          id: r.id,
          accountId: r.account_id,
          section: r.section,
          type: r.type,
          date: r.date,
          week: r.week,
          theme: r.theme,
          objective: r.objective,
          development: r.development,
          script: r.script,
          copy: r.copy,
          content: r.content,
          status: r.status,
          slides: r.slides || [],
          clientComments: r.client_comments || [],
          internalNotes: r.internal_notes || [],
          checklist: r.checklist || createChecklist(),
          metrics: r.metrics || createMetrics(),
        };
        if (mapped[r.account_id] !== undefined) {
          mapped[r.account_id].push(item);
        }
      });

      // Seed any account that has initialData but 0 rows in Supabase
      const toSeed = Object.entries(initialData)
        .filter(([accountId, items]) => items.length > 0 && mapped[accountId]?.length === 0);
      if (toSeed.length > 0) {
        const seedItems = toSeed.flatMap(([, items]) => items);
        await supabase.from("contenidos").upsert(seedItems.map(toRow));
        toSeed.forEach(([accountId, items]) => { mapped[accountId] = items; });
        showToast("Nuevas cuentas sincronizadas ✓");
      }

      if (Object.values(mapped).some(arr => arr.length > 0)) {
        setData(mapped);
      }
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {}
  }, [data]);

  const updateItem = useCallback(async (item) => {
    setData(prev => ({
      ...prev,
      [item.accountId]: prev[item.accountId].map(i => i.id === item.id ? item : i),
    }));
    const { error } = await supabase.from("contenidos").upsert(toRow(item));
    if (error) showToast("Error al guardar", "error");
    else showToast("Guardado ✓");
  }, []);

  const deleteItem = useCallback(async (item) => {
    setData(prev => ({
      ...prev,
      [item.accountId]: prev[item.accountId].filter(i => i.id !== item.id),
    }));
    const { error } = await supabase.from("contenidos").delete().eq("id", item.id);
    if (error) showToast("Error al eliminar", "error");
    else showToast("Eliminado");
  }, []);

  const createItem = useCallback(async (item) => {
    setData(prev => ({
      ...prev,
      [item.accountId]: [...(prev[item.accountId] || []), item],
    }));
    const { error } = await supabase.from("contenidos").insert(toRow(item));
    if (error) showToast("Error al crear", "error");
    else showToast("Contenido creado ✓");
  }, []);

  const duplicateItem = useCallback(async (item) => {
    const dup = {
      ...item,
      id: `${item.accountId}_${Date.now()}`,
      theme: `${item.theme} (copia)`,
      status: "Borrador",
      clientComments: [],
      internalNotes: [],
      metrics: createMetrics(),
      checklist: createChecklist(),
    };
    setData(prev => ({
      ...prev,
      [item.accountId]: [...prev[item.accountId], dup],
    }));
    const { error } = await supabase.from("contenidos").insert(toRow(dup));
    if (error) showToast("Error al duplicar", "error");
    else showToast("Contenido duplicado ✓");
  }, []);

  return { data, setData, loading, toast, updateItem, deleteItem, createItem, duplicateItem };
}
