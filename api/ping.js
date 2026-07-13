const SUPABASE_URL = "https://fzsojmrdqtxdrqkzxwdx.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6c29qbXJkcXR4ZHJxa3p4d2R4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4Njg4ODcsImV4cCI6MjA5NDQ0NDg4N30.92zmAyimyvhV-C1yMSkOvX8Troff4_-GH39mM5KmZRI";

export default async function handler(req, res) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/contenidos?select=id&limit=1`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );
    const ok = response.ok;
    res.json({ ok, status: response.status, time: new Date().toISOString(), msg: "Supabase pinged ✓" });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
