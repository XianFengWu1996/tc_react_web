import { Button, Dialog, DialogActions, DialogContent, Paper, Slide, Typography } from "@material-ui/core";
import React, { useState } from "react";
import * as COLORS from "../Misc/colors";
import {
  handleDeleteCard,
} from "./SendData.js";

import {
    FaCcAmex,
    FaCcVisa,
    FaCcDiscover,
    FaCcMastercard,
    FaCreditCard,
  } from "react-icons/fa";
import LoadingSpinner from "./Loading";
import screenSize from "./ScreenSize";



const Transition = React.forwardRef(function Transition(props, ref) {
return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCard = (props) => {
  const { extraSmallScreen } = screenSize();  
  const { card } = props;

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteDialogClose = () => {
    setOpen(false);
  };

  const handleDeleteCardLoading = () => {
    if (loading) {
      return <LoadingSpinner />;
    } else {
      return "Remove";
    }
  };

  const renderCardIcon = (brand) => {
    switch (brand) {
      case "VISA":
        return <FaCcVisa size="3em" color="#1A1F71" />;
      case "AMERICAN_EXPRESS":
        return <FaCcAmex size="3em" color="#2671B9" />;
      case "MASTERCARD":
        return <FaCcMastercard size="3em" color="#19110B" />;
      case "DISCOVER":
        return <FaCcDiscover size="3em" color="#E55C20" />;
      default:
        return <FaCreditCard size="3em" />;
    }
  };

  const handleComplete = () => {
    setLoading(false);
    setOpen(false);
  }

  const handleError = (error) => {
    setLoading(false)
    setError(error);
  }

  const handleDeleteCardOnClick = async () => {
    // start the loading
    setLoading(true);
  
    // start delete card process
    await handleDeleteCard(card, handleComplete, handleError)

  };

  return (
    <div>
      <Paper
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
          padding: "1.5rem 1rem",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {renderCardIcon(card.brand)}
          <Typography style={{ paddingLeft: "1rem", fontSize: "1rem" }}>
            {!extraSmallScreen ? 
              card.brand === "AMERICAN_EXPRESS"
                ? "**** ****** *"
                : "**** **** **** "
              : 'xx-'
            }
            {card.lastFourDigit}
          </Typography>

          <Typography style={{ paddingLeft: "1.2rem", fontSize: "1rem" }}>
            Expires {card.month}/{card.year}
          </Typography>
        </div>

        <Button size="small" variant="outlined" style={{ backgroundColor: COLORS.FAILED, color: '#fff', marginLeft: '5px'}}
          onClick={() => {
            setOpen(true)
        }}>DELETE</Button>
      </Paper>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        disableBackdropClick
        keepMounted
        onClose={handleDeleteDialogClose}
      >
        <DialogContent>
          <Typography>
            Do you want to remove the {card.brand} card ending in{" "}
            {card.lastFourDigit}?
          </Typography>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : null}
        </DialogContent>

        <DialogActions>
    
        
        <Button onClick={handleDeleteDialogClose}>Cancel</Button>
        <Button
          onClick={() => {
            if (!loading) {
              handleDeleteCardOnClick();
            }
          }}
          variant="contained"
          style={{ backgroundColor: COLORS.FAILED, color: "#fff" }}
        >
          {handleDeleteCardLoading()}
        </Button>
          
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteCard;
