
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role to bypass RLS for this check

if (!supabaseKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is missing. Please set it in .env.local or environment.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkUser() {
    // 1. List all users in public.users to see what's there
    const { data: users, error } = await supabase
        .from('users')
        .select('*');

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log('Total users in public.users:', users.length);
    console.table(users);
}

checkUser();
