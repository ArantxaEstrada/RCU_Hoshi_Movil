import Constants from "expo-constants";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || "";
const supabaseAnon = Constants.expoConfig?.extra?.supabaseAnon || "";

export const supabase = createClient(supabaseUrl, supabaseAnon);
