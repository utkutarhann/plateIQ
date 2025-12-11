
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkLogs() {
    // 1. Get User (Assuming we can get the user ID from the environment or hardcode for testing if we knew it, 
    // but here we will just list all logs for today to see what's happening generally or try to find the user)
    // Since we are in a script, we don't have the auth context. 
    // We will query the last 10 logs and print their timestamps.

    const { data: logs, error } = await supabase
        .from('food_logs')
        .select('created_at, user_id')
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Error fetching logs:', error);
        return;
    }

    console.log('Recent Logs (UTC):');
    logs.forEach(log => {
        const date = new Date(log.created_at);
        const trtDate = new Date(date.getTime() + (3 * 60 * 60 * 1000));
        console.log(`User: ${log.user_id} | UTC: ${log.created_at} | TRT: ${trtDate.toISOString()}`);
    });

    // Calculate Start of Day TRT logic verification
    const now = new Date();
    const trtNow = new Date(now.getTime() + (3 * 60 * 60 * 1000));
    trtNow.setUTCHours(0, 0, 0, 0);
    const startOfTrtDay = new Date(trtNow.getTime() - (3 * 60 * 60 * 1000));

    console.log('\nTime Logic Verification:');
    console.log('Current UTC:', now.toISOString());
    console.log('Start of TRT Day (UTC):', startOfTrtDay.toISOString());
}

checkLogs();
