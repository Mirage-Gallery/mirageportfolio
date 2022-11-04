import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";

export const getHiddenList = async (_address) => {
    const response = await fetch(`/api/getHiddenList`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        address: _address,
      }) 
  })
  return await response.json();
}

export const getAddressFromUsername = async (_username) => {
    const response = await fetch(`/api/getUsername`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: _username,
        }) 
    })
    return await response.json();
}

export const getNFTdataByAddress = async (_address, _hiddenList) => {
    await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.ETHEREUM,
      address: _address,
    });

    return response.data.result.filter( result => {
      return !_hiddenList
        .some( hidden => hidden.nftAddress == result.token_address && hidden.nftId == result.token_id)
    });
}