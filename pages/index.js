import Head from "next/head";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

import ImageListComponent from "./components/ImageListComponent";
import { SignInButton } from "./components/SignIn";

import { CircularProgress, Grid, Snackbar, Alert} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import styles from '../styles/Home.module.css';

import {
  getHiddenList,
  getNFTdataByAddress,
  getUsernameFromAddress
} from "../utils/helpers";



const URL = process.env.NEXT_PUBLIC_URL;

export default function Home() {
  const theme = useTheme();
  const [usersNFTs, setUsersNFTs] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [username, setUsername] = useState('');
  const [snackbar, setSnackbar] = useState({ status: false});
  const [selectedNFTs, setSelectedNFTs] = useState([]);
  const [ethAuth, setEthAuth] = useState({})

  
  const { address, isConnected } = useAccount({
    onConnect({ address, connector, isReconnected }) {
      setLoadingImages(true);
  
      getNFTdataByAddress(address, [])
        .then( data => {
          setHiddenList(address, data)
            .then( dataInHidden => {
              setUsersNFTs(dataInHidden)
              setLoadingImages(false);
            })
        })

      getUsernameFromAddress(address)
        .then( data =>setUsername(data.username))

    },
    onDisconnect() {
      setUsersNFTs([]); 
    },
  });

  async function sendAction(data){
    const response = await fetch(`${URL}/api/${data.endPoint}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          ...data.data
        }) 
    })
    const json = await response.json();
    if(json.success) {
      setSnackbar({
        status: true,
        type: 'success',
        message: data.successMessage
      })
      resetNFTStatus()
    } else if (!json.success){
      setSnackbar({
          status: true,
          type: 'error',
          message: data.errorMessage
      })
    }
  }
  
  async function sendUpdateUsername(){
      sendAction({
        endPoint: `setUsername`,
        successMessage: 'Username updated',
        errorMessage: 'Username is already taken',
        data: {
          username: username
        }
      })
  }

  async function hideSelected(){
    sendAction({
        endPoint: `hideAll`,
        successMessage: 'Selected NFTs Hidden',
        errorMessage: 'Action Failed - Please Try Again',
        data: {
          nfts: selectedNFTs.map(x => ({token_id: x.token_id, token_address: x.token_address}))
        }
    })
  }

  async function showSelected(){
    sendAction({
        endPoint: `showSelected`,
        successMessage: 'Selected NFTs Visible',
        errorMessage: 'Action Failed - Please Try Again',
        data: {
          nfts: selectedNFTs.map(x => ({token_id: x.token_id, token_address: x.token_address}))
        }
    })
  }

  async function hideAll(){
      sendAction({
          endPoint: `hideAll`,
          successMessage: 'All NFTs Hidden',
          errorMessage: 'Action Failed - Please Try Again',
          data: {
            nfts: usersNFTs.map(x => ({token_id: x.token_id, token_address: x.token_address}))
          }
      })
  }

  async function showAll(){
    sendAction({
        endPoint: `showAll`,
        successMessage: 'All NFTs Showing',
        errorMessage: 'Action Failed - Please Try Again',
    })
}

async function getLink() {
  const username = getUsernameFromAddress(address)
  .then(data => {return data.username})
  const copyAddress = async () => {
    const a = await username;
    if (a != undefined){
      {navigator.clipboard.writeText(URL + '/' + a)}
      setSnackbar({
        status: true,
        type: 'success',
        message: 'Link copied to clipboard'
      })
    } else {
      setSnackbar({
        status: true,
        type: 'error',
        message: 'Set a username first'
      })
    }
  }
  copyAddress()
}

function selectNFT(nft) {
  const selectedGroup = selectedNFTs;
  const index = selectedGroup.findIndex(sel => sel.token_address === nft.token_address && sel.token_id === nft.token_id);
  let list = usersNFTs;

  if(index > -1){
    selectedGroup.splice(index, 1); 
    setSelectedNFTs(selectedGroup);
    const nftIndex = list.findIndex(l => l.token_address === nft.token_address && l.token_id === nft.token_id);
    list[nftIndex] = {...list[nftIndex], selected: false} 
  } else {
    selectedGroup.push(nft)
    setSelectedNFTs(selectedGroup);
  }

  list = list.map(nft => {
    if (selectedGroup.some( h => h.token_address == nft.token_address && h.token_id == nft.token_id)){
      return {...nft, selected: true};
    } else {
      return nft
    }
  })
  setUsersNFTs(list);
}


async function setHiddenList(address, nfts) {
  const hl = await getHiddenList(address);
  console.log(hl)
  return nfts.map(nft => {
    if (hl.data.some( h => h.nftAddress == nft.token_address && h.nftId == nft.token_id)){
      return {...nft, hidden: true};
    } else {
      return {...nft, hidden: false};
    }
  })
}

  async function resetNFTStatus() {
    const nfts = (await setHiddenList(address, usersNFTs))
      .map(nft => ({...nft, selected: false}))
    
    setSelectedNFTs([])
    setUsersNFTs(nfts);
  }

  useEffect(() => {
    const handler = async () => {
      try {
        const res = await fetch('/api/me')
        const json = await res.json()
        setEthAuth((x) => ({ ...x, address: json.address }))
      } catch (_error) {}
    }
    // 1. page loads
    handler()
 
    // 2. window is focused (in case user logs out of another window)
    window.addEventListener('focus', handler)
    return () => window.removeEventListener('focus', handler)
  }, [])

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

        <Snackbar open={snackbar.status} autoHideDuration={3000} onClose={() => setSnackbar(snackbar.status) } anchorOrigin={{...{ vertical: 'top', horizontal: 'center' }}}>
          <Alert severity={snackbar.type} sx={{ width: '100%' }}>{snackbar.message}</Alert>
        </Snackbar>

        <Grid container justifyContent="flex-end" sx={{ mt: 2, ml: -10}}>
          { ethAuth.address && (
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
            Update Username
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
            <button
              className={styles.button}
              onClick={() => getLink()}>
              Copy Shareable Link
            </button>
          </div>)}
          {
            ethAuth.address && selectedNFTs.length > 0 && (
              <div>
                <button
                  className={styles.button}
                  onClick={() => hideSelected?.()}>
                  Hide Selected
                </button>

                <button
                  className={styles.button}
                  onClick={() => showSelected?.()}>
                  Show Selected
                </button>
              </div>)
          }
          
          <ConnectButton showBalance={false} chainStatus="none" />
           
          { isConnected && (
              <div>
                {ethAuth.address ? (
                    <button
                      className={styles.button}
                      onClick={async () => {
                        await fetch('/api/logout')
                        setEthAuth({})
                      }}
                      style={{
                        marginLeft: '1rem',
                      }}
                    >
                      Sign Out - {ethAuth.address.slice(0, 5)}
                    </button>
                ) : (
                  <SignInButton
                    onSuccess={({ address }) => setEthAuth((x) => ({ ...x, address }))}
                    onError={({ error }) => setEthAuth((x) => ({ ...x, error }))}
                  />
                )}
              </div>
            )}
          
        </Grid>
        <Grid sx={{ mt: 2 }}>{loadingImages ? <CircularProgress /> : ""}</Grid>

        <ImageListComponent imageMetadataArray={usersNFTs} showUserAdminUi={true} selectHandler={selectNFT}/>
      </Grid>
    </div>
  );
}