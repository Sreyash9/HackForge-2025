import { createClient } from "@jsr/supabase__supabase-js";
import { projectId, publicAnonKey } from "./info";

const supabaseUrl = `https://baimricnypnqqasgrdii.supabase.co`;

export const supabase = createClient(supabaseUrl, publicAnonKey);


