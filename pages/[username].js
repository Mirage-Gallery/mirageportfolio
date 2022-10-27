import Head from "next/head";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
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

  const [usersNFTs, setUsersNFTs] = useState();
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const theme = useTheme();
  
  async function queryNFTdata(_address) {
    setLoadingImages(true);
    await Moralis.start({
      apiKey: process.env.NEXT_PUBLIC_MORALIS_API_KEY,
      // ...and any other configuration
    });
    const response = await Moralis.EvmApi.nft.getWalletNFTs({
      chain: EvmChain.ETHEREUM,
      address: _address,
    });

    const l = response.data.result


    setUsersNFTs(l);
    setLoadingImages(false);
  }


  useEffect( () => {
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
      queryNFTdata(j.address);
    }
  
    if (username) {
      getAddressFromUsername(username);
    }
  }, [username]);

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
          <ConnectButton showBalance={false} chainStatus="none" />
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>

        <ImageListComponent imageMetadataArray={usersNFTs} />
      </Grid>
    </div>
  );
}