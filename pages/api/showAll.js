const { createClient } =  require('@supabase/supabase-js')
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from "../../lib/config";

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

async function handler(req, res) {
    const signerAddress = req.session.siwe?.address
    
    const {data: result, error} = await supabase
        .from('hidden')
        .delete()
        .eq('address', signerAddress)
       
    if (!error) {
        res.status(200).json( { success: true })
    } else {
        res.status(500).json( { success: false })
    }
}

export default withIronSessionApiRoute(handler, ironOptions)