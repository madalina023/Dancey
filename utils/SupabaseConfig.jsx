import { createClient } from "@supabase/supabase-js";

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://mdnzcyibpwdejkbbuqwj.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kbnpjeWlicHdkZWprYmJ1cXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU3OTgxNTEsImV4cCI6MjAzMTM3NDE1MX0.Xp6CKcI3Ddp1SwrsJFNDQW6h2thFnyWs8PsOxej4D64"
);
