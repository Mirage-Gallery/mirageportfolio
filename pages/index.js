import Head from "next/head";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import { useEffect, useState } from "react";

import ImageListComponent from "./components/ImageListComponent";
import { CircularProgress, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from '../styles/Home.module.css';

import {
  getHiddenList,
  getNFTdataByAddress,
} from "../utils/helpers";

export default function Home() {
  const [usersNFTs, setUsersNFTs] = useState();
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const theme = useTheme();
  const [username, setUsername] = useState('');
  
  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setLoadingImages(true);
      getNFTdataByAddress(address, [])
        .then( data => {
          setUsersNFTs(data);
          setLoadingImages(false);
        })
    },
    onDisconnect() {
      setUsersNFTs(null);
    },
  });

  const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      const response = await fetch(`/api/setUsername`, {
          method: 'POST',
          cache: 'no-cache',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            message: variables.message,
            signedMessage: data
          }) 
      })
      const json = await response.json();
    },
  })

  async function send(){
    const content = [address, username].join(':');
    signMessage({message: content})
  }

  useEffect(() => {
    if(usersNFTs){
      getHiddenList(address)
      .then( hl => {
        const list = usersNFTs.map(nft => {
          if (hl.data.some( h => h.nftAddress == nft.token_address && h.nftId == nft.token_id)){
            return {...nft, hidden: true};
          } else {
            return {...nft, hidden: false};
          }
        })
        setUsersNFTs(list)
      });
    }
  }, [usersNFTs]);

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



        <Grid container justifyContent="flex-end" sx={{ mt: 2, ml: -10}}>
          { isConnected && (
          <div>
            <input
              className={styles.input}
              placeholder="username"
              value={username}
              name="username" onChange={e => setUsername(e.target.value)}
            />
            <button 
              className={styles.button}
              onClick={() => send?.()}
            >
            Update
            </button>
          </div>)}
          <ConnectButton showBalance={false} chainStatus="none" />
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>

        <ImageListComponent imageMetadataArray={usersNFTs} showAdditionalUi={true} />
      </Grid>
    </div>
  );
}