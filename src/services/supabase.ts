import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file",
  );
}

console.log("Supabase initialized with URL:", supabaseUrl);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Tables = {
  profiles: import("../types").Profile;
  wishlists: import("../types").Wishlist;
  items: import("../types").Item;
  categories: import("../types").Category;
  comments: import("../types").Comment;
};
