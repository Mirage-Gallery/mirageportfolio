const { createClient } =  require('@supabase/supabase-js')
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from "../../lib/config";

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

async function handler(req, res) {
    const { nfts } = req.body
    const signerAddress = req.session.siwe?.address
    
    const all = nfts.map( nft => {
        return {
            address: signerAddress,
            nftAddress: nft.token_address,
            nftId: nft.token_id
        }
    })

    const {data: result, error} = await supabase
        .from('hidden')
        .insert(all)
       
    if (!error) {
        res.status(200).json( { success: true })
    } else {
        res.status(500).json( { success: false })
    }
}

export default withIronSessionApiRoute(handler, ironOptions)