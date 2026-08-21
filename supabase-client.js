/* =========================================================
   SUPABASE CLIENT
   =========================================================
   Project URL: Dashboard -> Project Settings -> Data API
   The publishable key is safe to expose in the browser
   (RLS policies protect the tables).
   ========================================================= */

import {
    createClient
} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";


const SUPABASE_URL =
    "https://qxslmqrzadtokdumfslv.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_xVqiiApJZZrh3bik5z447w_T4hMMldL";


export const supabase =
    createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
