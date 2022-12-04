const { createClient } =  require('@supabase/supabase-js')
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from "../../lib/config";

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

async function handler(req, res) {
    const { tokenId, tokenAddress } = req.body
    const signerAddress = req.session.siwe?.address
    
    const {data: result, error} = await supabase
        .from('hidden')
        .delete()
        .match({
            address: signerAddress,
            nftAddress: tokenAddress,
            nftId: tokenId
        })
    
    if (!error) {
        res.status(200).json( { success: true })
    } else {
        res.status(200).json( { success: false })
    }
}
export default withIronSessionApiRoute(handler, ironOptions)