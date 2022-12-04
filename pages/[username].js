import Head from "next/head";

import { useEffect, useState } from "react";
import { useRouter } from 'next/router'

import ImageListComponent from "./components/ImageListComponent";
import { CircularProgress, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  getHiddenList,
  getAddressFromUsername,
  getNFTdataByAddress,
} from "../utils/helpers";

export default function Home() {
  const router = useRouter();
  const { username } = router.query
  const [userAddress, setUserAddress] = useState('');
  const [usersNFTs, setUsersNFTs] = useState();
  const [usersHiddenList, setUserHiddenList] = useState();
  const [mounted, setMounted] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const theme = useTheme();
  
  getAddressFromUsername(username)
    .then( result => setUserAddress(result.address) );

  useEffect( () => {
    if(userAddress) {
      getHiddenList(userAddress)
        .then( hl => setUserHiddenList(hl.data))
    }
  }, [userAddress]);

  useEffect( () => {
    if (usersHiddenList) {
      setLoadingImages(true);
      getNFTdataByAddress(userAddress, usersHiddenList)
        .then( data => {
          setUsersNFTs(data);
          setLoadingImages(false);
        })
    }
  }, [usersHiddenList]);

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