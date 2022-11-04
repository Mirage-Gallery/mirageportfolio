import React from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItemComponent from "./ImageListItemComponent";
import { useTheme } from "@mui/material/styles";

function ImageListComponent({ imageMetadataArray, showAdditionalUi }) {
  const theme = useTheme();
  if (!imageMetadataArray) return;

  // processing API response data for our purpose
  let imageListArray = imageMetadataArray.map((nft) => {
    let metadata = JSON.parse(nft.metadata);
    // if no metadata is present leave
    if (metadata == null) return;

    let imageURI;
    if (metadata.image) {
      imageURI = metadata.image;

      let ipfsURI = imageURI.split("ipfs://");

      // corrrecting ipfs URI so everyone will render
      if (ipfsURI[1]) {
        imageURI = "https://ipfs.io/ipfs/" + ipfsURI[1];
      }
    }
    // handle ENS metadata case
    else if (metadata.image_url) {
      imageURI = metadata.image_url;
    } else if (metadata.img) {
      imageURI = metadata.img;
    }
    let videoURI;
    if (metadata.animation_url) {
      /* console.log(metadata.name, nft.token_id);
      console.log(metadata.animation_url); */
      videoURI = metadata.animation_url;
      let checkForIPFS = videoURI.split("ipfs://");

      // corrrecting ipfs URI so everyone will render
      if (checkForIPFS[1]) {
        videoURI = "https://ipfs.io/ipfs/" + checkForIPFS[1];
      }
    }
    // console.log(metadata.name, nft.token_id);
    // console.log("nft data", nft);
    // console.log("metadata", metadata);
    // console.log(metadata.animation_url);
    // constructing the new image metadata object
    return {
      title: metadata.name,
      address: nft.token_address,
      img: imageURI,
      video: videoURI,
      id: nft.token_id,
      hidden: nft.hidden,
    };
  });
  // removing empty entries
  imageListArray = imageListArray.filter((element) => element != null);

  return (
    <Box
      sx={{
        /* 
        overflowY: "auto", */
        backgroundColor: theme.palette.background.main,
        margin: "25px",
      }}
    >
      <ImageList
        variant="masonry"
        /* adjusting col value for responsiveness */
        sx={{
          columnCount: {
            xs: "1 !important",
            sm: "2 !important",
            md: "3 !important",
            lg: "4 !important",
            xl: "6 !important",
          },
        }}
        gap={15}
      >
        {imageListArray.map((item) => (
          <ImageListItemComponent imgData={item} key={item.title} showAdditionalUi={showAdditionalUi}/>
        ))}
      </ImageList>
    </Box>
  );
}

export default ImageListComponent;
