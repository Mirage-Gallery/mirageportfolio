const { createClient } =  require('@supabase/supabase-js')
import { ironOptions } from "../../lib/config";

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

async function handler(req, res) {
    const { username } = req.body

    const signerAddress = req.session.siwe?.address

    const {data: usernameExists} = await supabase
        .from('username')
        .select()
        .eq('username', username)
        .single()

    if(usernameExists) return res.status(500).json( { success: false })

    const {data, error} = await supabase
        .from('username')
        .upsert({
            address: signerAddress,
            username,
        })
        .eq('address', signerAddress)
    
    if (!error) {
        res.status(200).json( { success: true })
    } else {
        res.status(500).json( { success: false })
    }
}
export default withIronSessionApiRoute(handler, ironOptions)