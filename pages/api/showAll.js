const { createClient } =  require('@supabase/supabase-js')
import { ethers } from 'ethers';

const {
  DATABASE_URL,
  SUPABASE_SERVICE_API_KEY,
} = process.env;

const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

export default async function handler(req, res) {
    const { message, signedMessage } = req.body
    const signerAddress = ethers.utils.verifyMessage(message, signedMessage);
    
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
