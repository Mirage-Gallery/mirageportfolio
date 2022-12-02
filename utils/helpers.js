import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const URL = process.env.NEXT_PUBLIC_URL;
Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });


export const getHiddenList = async (_address) => {
    const response = await fetch(`${URL}/api/getHiddenList`, {
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
    const response = await fetch(`${URL}/api/getUserAddress`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username: _username,
        }) 
    })
    return await response.json();
}

export const getUsernameFromAddress = async (_address) => {
  const response = await fetch(`${URL}/api/getUsername`, {
      method: 'POST',
      cache: 'no-cache',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        address: _address,
      }) 
  })
  return await response.json();
}

export const getNFTdataByAddress = async (_address, _hiddenList) => {
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.ETHEREUM,
      address: _address,
    });
    return response.jsonResponse.result.filter( result => {
      return !_hiddenList
        .some( hidden => hidden.nftAddress == result.token_address && hidden.nftId == result.token_id)
    });
}