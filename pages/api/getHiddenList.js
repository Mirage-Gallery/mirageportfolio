const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {

    const { address } = req.body
    const { data, error} = await supabase
        .from('hidden')
        .select()
        .eq('address', address)
    
    if (!error) {
        res.status(200).json( { success: true, data })
    } else {
        res.status(500).json( { success: false })
    }
}