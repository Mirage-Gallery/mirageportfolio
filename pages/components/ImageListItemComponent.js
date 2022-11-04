import { Box, Fade, ImageListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@mui/material/styles";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

import UserAdminUi from './UserAdminUi'

function ImageListItemComponent({ imgData, showUserAdminUi }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const {title, img, video, address, id} = imgData || { title: '', img: '', video: false, address : '', id: null}
  return (
    <ImageListItem cols={1}>
      <img
        src={img }
        alt={title}
        style={{ borderRadius: theme.borderRadius.image, cursor: "pointer" }}
        onClick={handleOpen}
      />
      {video ? (
        <PlayCircleFilledIcon
          sx={{
            fontSize: 64,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "#FFFFFF",
          }}
          onClick={handleOpen}
        />
      ) : (
        ""
      )}
      <Modal
        open={open}
        onClose={handleClose}
        className={'customModalRoot'}
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 300,
          style: {
            backgroundColor: "black",
            opacity: 0.75
          },
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              p: 4,
            }}
          >
            {video ? (
              <video
                controls
                autoPlay
                src={video}
                loop
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  borderRadius: theme.borderRadius.modal,
                }}
              >
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={img}
                alt={title}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  borderRadius: theme.borderRadius.modal,
                }}
                onClick={handleClose}
              />
            )}

            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mt: 2, color: theme.palette.text.main }}
            >
              Name: {title}
            </Typography>

            <Typography
              variant="h6"
              component="h2"
              sx={{
                mt: 2,
                color: theme.palette.text.main,
                textDecoration: "underline",
              }}
            >
              <a
                href={`https://opensea.io/assets/ethereum/${address}/${id}`} /* {`https://opensea.io/collection/${openSeaLink}`} */
                target="_blank"
                rel="noopener noreferrer"
              >
                View on OpenSea
              </a>

              { showUserAdminUi && (
                <UserAdminUi imgData={imgData} />
              )} 
            </Typography>
          </Box>
        </Fade>
      </Modal>
    </ImageListItem>
  );
}

export default ImageListItemComponent;
