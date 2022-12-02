const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {
    const { message, signedMessage, nfts } = req.body
    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    
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
