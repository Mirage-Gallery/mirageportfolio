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
  getUsernameFromAddress
} from "../utils/helpers";

const URL = process.env.NEXT_PUBLIC_URL;

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
      
      getUsernameFromAddress(address)
        .then( data => {
          setUsername(data.username)
        })
    },
    onDisconnect() {
      setUsersNFTs(null);
    },
  });

  const { data: signedMessage, error, isLoading, signMessage } = useSignMessage({
      async onSuccess(data, variables) {
        const response = await fetch(variables.endPoint, {
            method: 'POST',
            cache: 'no-cache',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              message: variables.message,
              signedMessage: data,
              ...variables.data
            }) 
        })
        const json = await response.json();
      },
    })
  
  async function sendUpdateUsername(){
      const content = [address, username].join(':');
      signMessage({
        message: content,
        endPoint: `${URL}/api/setUsername`
      })
  }

  async function hideAll(){
      const content = 'HIDEALL';
      signMessage({
          message: content,
          endPoint: `${URL}/api/hideAll`,
          data: {
            nfts: usersNFTs.map(x => ({token_id: x.token_id, token_address: x.token_address}))
          }
      })
  }
  async function showAll(){
    const content = 'SHOWALL';
    signMessage({
        message: content,
        endPoint: `${URL}/api/showAll`
    })
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
              placeholder={ username || "username"}
              value={username}
              name="username" onChange={e => setUsername(e.target.value)}
            />
            <button 
              className={styles.button}
              onClick={() => sendUpdateUsername?.()}
            >
            Update
            </button>

            <button
              className={styles.button}
              onClick={() => hideAll?.()}>
              Hide All
            </button>
            <button
              className={styles.button}
              onClick={() => showAll?.()}>
              Show All
            </button>
          </div>)}
          <ConnectButton showBalance={false} chainStatus="none" />
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>

        <ImageListComponent imageMetadataArray={usersNFTs} showUserAdminUi={true} />
      </Grid>
    </div>
  );
}