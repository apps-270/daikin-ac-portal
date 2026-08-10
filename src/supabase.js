import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://vepuimsimaoyuhvldyww.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZlcHVpbXNpbWFveXVodmxkeXd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEyMzQwNzcsImV4cCI6MjA5NjgxMDA3N30.rqubwHTLXL1aCtsYyS9QYyqREmZw_fpSuff8iRnI4wY";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);