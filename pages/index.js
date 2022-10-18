import Head from "next/head";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/evm-utils";
import ImageListComponent from "./components/ImageListComponent";
import { CircularProgress, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function Home() {
  const [usersNFTs, setUsersNFTs] = useState();
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const theme = useTheme();

  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      queryNFTdata(address); // address
    },
    onDisconnect() {
      setUsersNFTs(null);
    },
  });

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

    setUsersNFTs(response.data.result);
    setLoadingImages(false);
  }

  // prevents hydration error
  useEffect(() => setMounted(true), []);
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
        <Grid sx={{ mt: 2 }}>
          <ConnectButton showBalance={false} chainStatus="none" />
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>
      
        <ImageListComponent imageMetadataArray={usersNFTs} />
      </Grid>
    </div>
  );
}