// Creates the two dummy players. Run once: node --env-file=.env.local scripts/create-users.mjs
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const password = process.env.NEXT_PUBLIC_DUMMY_PASSWORD;

if (!url || !serviceKey || !password) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_DUMMY_PASSWORD");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

for (const email of ["player1@dummy.local", "player2@dummy.local"]) {
  const { error } = await supabase.auth.admin.createUser({ email, password, email_confirm: true });
  if (error && !/already/i.test(error.message)) {
    console.error(`${email}: ${error.message}`);
    process.exit(1);
  }
  console.log(`${email}: ${error ? "already exists" : "created"}`);
}
