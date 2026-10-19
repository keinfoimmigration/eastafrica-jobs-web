// check_app.js
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gbotwkyaagcffzvcyzuy.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Egi9rMCDbL0BP6R9Mbh_0Q_LxEHau5r";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const applicationNumber = "EAC-2026-191882";

async function check() {
  const { data, error } = await supabase
    .from('eacapplications')
    .select('*')
    .eq('application_number', applicationNumber);

  if (error) {
    console.error("Error fetching record:", error);
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log("No record found for:", applicationNumber);
    process.exit(0);
  }

  console.log(JSON.stringify(data[0], null, 2));
}

check();
