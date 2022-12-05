import { Box, Fade, ImageListItem, Typography } from "@mui/material";
import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import { useTheme } from "@mui/material/styles";
import PlayCircleFilledIcon from "@mui/icons-material/PlayCircleFilled";

import UserAdminUi from './UserAdminUi'

function ImageListItemComponent({ imgData, showUserAdminUi, selectHandler }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [imgAvailable, setImgAvailable] = useState(true);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const {title, img, video, address, id, hidden, selected } = imgData || { title: '', img: '', video: false, address : '', id: null, hidden: null, selected: null}
  return (
    imgAvailable && <ImageListItem cols={1}>
      {showUserAdminUi && (
      <button
          onClick={() => selectHandler({token_id: id, token_address: address})}
          className={'button'}
          style={{
              backgroundColor:  (selected ? '#ff4300' : '#0043ff'),
              color: '#fafafa',
              cursor: 'pointer',
              position: 'absolute',
              bottom: '1rem',
              left: '1rem',
              height: '3rem',
              width: '3rem',
              zIndex: '1'
          }}
      ><span>{selected ? '-' : '+'}</span></button>)}
      {hidden && (
        <div
          className={'overlay'}
          style={{ 
            border: (selected ? 'solid 6px blue' : 'none')
          }}
        >
            <svg x="0" y="0" version="1.1" viewBox="0 0 100 100"><path fill="#fff" d="M33 33.1c-3.1 1.6-5.9 3.7-8.4 6.2l-9.9 9.9c-.7.7-.7 1.7 0 2.4l9.9 9.9c6.6 6.6 15.6 10.4 25 10.4 5.8 0 11.5-1.4 16.6-4.1.8-.4 1.1-1.5.7-2.3-.4-.8-1.5-1.1-2.3-.7-4.6 2.4-9.7 3.7-15 3.7C41.1 68.4 33 65 27 59l-8.7-8.7 8.7-8.7c2.3-2.3 4.8-4.2 7.6-5.6.8-.4 1.1-1.5.7-2.3-.5-.8-1.5-1.1-2.3-.6zM74.6 61.4l9.9-9.9c.7-.7.7-1.7 0-2.4l-9.9-9.9C68 32.7 59 28.9 49.6 28.9c-1.8 0-3.6.1-5.3.4-.9.1-1.6 1-1.4 1.9.1.9 1 1.6 1.9 1.4 1.6-.2 3.2-.4 4.8-.4 8.5 0 16.6 3.4 22.6 9.4l8.7 8.7-8.6 8.7c-.7.7-.7 1.7 0 2.4.6.7 1.7.7 2.3 0z" /><path fill="#fff" d="M55.6 56.3c-1.5 1.5-3.6 2.5-6 2.5-4.7 0-8.4-3.8-8.4-8.4 0-2.3.9-4.4 2.5-6 .7-.7.7-1.7 0-2.4s-1.7-.7-2.4 0c-2.1 2.1-3.5 5.1-3.5 8.3 0 6.5 5.3 11.8 11.8 11.8 3.3 0 6.2-1.3 8.3-3.5.7-.7.7-1.7 0-2.4-.6-.5-1.7-.5-2.3.1zM51 42c3.5.6 6.3 3.4 6.9 6.9.2.9 1 1.5 1.9 1.4.9-.2 1.5-1 1.4-1.9-.8-4.9-4.7-8.8-9.7-9.7-.9-.2-1.8.5-1.9 1.4-.1.9.5 1.8 1.4 1.9z" /><path fill="#fff" d="m18.1 21.2 60.7 60.7c.7.7 1.7.7 2.4 0s.7-1.7 0-2.4L20.5 18.8c-.7-.7-1.7-.7-2.4 0s-.7 1.7 0 2.4z" /></svg>
        </div>)}
      <img
        src={ img }
        alt={title}
        style={{ 
            borderRadius: theme.borderRadius.image,
            cursor: "pointer",
            border: (selected ? 'solid 6px blue' : 'none')
          }}
        onClick={handleOpen}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; 
          setImgAvailable(false)
        }}
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
          onError={({ currentTarget }) => {
            currentTarget.onerror = null; 
            setImgAvailable(false)
          }}
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
                src="Error.src" onerror="this.style.display='none'"
                //src={img}
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
