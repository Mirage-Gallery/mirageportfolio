import { Alchemy, Network } from "alchemy-sdk";

const alchemy = new Alchemy({
  apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
});

const URL = process.env.NEXT_PUBLIC_URL;

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
  
  // Match Moralis data structure
  const alchmeyNFT = (await alchemy.nft
    .getNftsForOwner(_address))
    .ownedNfts
    .map(nft => ({ 
      metadata: JSON.stringify(nft.rawMetadata),
      token_id: nft.tokenId,
      token_address: nft.contract.address
    }))

  return alchmeyNFT.filter( result => {
    return !_hiddenList
      .some( hidden => hidden.nftAddress == result.token_address && hidden.nftId == result.token_id)
  });
}