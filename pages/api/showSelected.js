const { createClient } =  require('@supabase/supabase-js')
import { withIronSessionApiRoute } from 'iron-session/next'
import { ironOptions } from "../../lib/config";

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

async function handler(req, res) {
    const { nfts } = req.body
    const signerAddress = req.session.siwe?.address
    
    const all = nfts.map( nft => {
        return supabase
            .from('hidden')
            .delete()
            .match({
                address: signerAddress,
                nftAddress: nft.token_address,
                nftId: nft.token_id
            })
    });
    const error = (await Promise.all(all)).map(x  => x.error);
       
    if (error.some(x => x !== null)) {
        res.status(500).json( { success: false })
    } else {
        res.status(200).json( { success: true })
    }
}

export default withIronSessionApiRoute(handler, ironOptions)