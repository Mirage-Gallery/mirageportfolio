import Head from "next/head";

import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import ImageListComponent from "./components/ImageListComponent";
import { CircularProgress, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const router = useRouter();
  const { username } = router.query
  const [userAddress, setUserAddress] = useState('');
  const [usersNFTs, setUsersNFTs] = useState();
  const [usersHiddenList, setUserHiddenList] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const theme = useTheme();
  
  async function queryNFTdata(_address) {
    setLoadingImages(true);
    await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY });
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.ETHEREUM,
      address: _address,
    });

    const filteredList = response.data.result.filter( result => {
      console.log(result)
      return !usersHiddenList
        .some( hidden => {
          console.log(hidden.nftAddress , result.token_address , hidden.nftId , result.token_id)
          return hidden.nftAddress == result.token_address && hidden.nftId == result.token_id
        })
    });

    setUsersNFTs(filteredList);
    setLoadingImages(false);
  }

  const getAddressFromUsername = async (username) => {
    const response = await fetch(`/api/getUsername`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          username,
        }) 
    })
    const j = await response.json();
    setUserAddress(j.address);
  }
  getAddressFromUsername(username);

  useEffect( () => {
    const getHiddenList = async (_address) => {
      
      const response = await fetch(`/api/getHiddenList`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          address: _address,
        }) 
    })
    const j = await response.json();
    setUserHiddenList(j.data);
  }
    if(userAddress) getHiddenList(userAddress)
  }, [userAddress]);

  useEffect( () => {
    if (userAddress && usersHiddenList) queryNFTdata(userAddress);
  }, [userAddress, usersHiddenList]);

  // prevents hydration error
  useEffect(() => {
    
    setMounted(true)
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundColor: theme.palette.background.main,
        overflow: "auto",
      }}
    >
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        <Head>
          <title>NFTGallery</title>
          <meta name="description" content="NFTGallery" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Grid container justifyContent="flex-end" sx={{ mt: 2, ml: -10}}>
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>
        <ImageListComponent imageMetadataArray={usersNFTs} showAdditionalUi={false} />
      </Grid>
    </div>
  );
}