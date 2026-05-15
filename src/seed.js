import { createClient } from "@supabase/supabase-js";
import { initialData } from "./data.js";

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function seed() {
  const items = Object.values(initialData).flat();
  console.log(`Subiendo ${items.length} contenidos...`);
  const { error } = await supabase.from("contenidos").upsert(
    items.map(i => ({
      id: i.id,
      account_id: i.accountId,
      section: i.section,
      type: i.type,
      date: i.date,
      week: i.week,
      theme: i.theme,
      objective: i.objective || "",
      development: i.development || "",
      script: i.script || "",
      copy: i.copy || "",
      content: i.content || "",
      status: i.status,
      slides: i.slides || [],
      client_comments: i.clientComments || [],
      internal_notes: i.internalNotes || [],
      checklist: i.checklist || [],
      metrics: i.metrics || {},
    }))
  );
  if(error) console.error("Error:", error);
  else console.log("✓ Datos subidos correctamente");
}

seed();
