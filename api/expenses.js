// api/expenses.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 
// SERVICE ROLE KEY is needed for inserts from serverless functions
// Ensure it is added only in Vercel environment variables (never commit)

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "POST") {
    const { description, amount } = req.body;

    if (!description || !amount) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("expenses")
      .insert([{ description, amount }])
      .select();

    if (error) return res.status(500).json({ error: error.message });

    return res.status(201).json(data[0]);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
