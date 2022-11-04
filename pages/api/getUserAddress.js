const { createClient } =  require('@supabase/supabase-js')

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {
    const { username } = req.body

    const {data, error} = await supabase
        .from('username')
        .select('address')
        .eq('username', username)
        .single()
    
    if (!error) {
        res.status(200).json( { success: true, address: data.address })
    } else {
        res.status(200).json( { success: false })
    }
}
