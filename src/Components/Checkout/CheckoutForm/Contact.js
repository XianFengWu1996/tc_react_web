import React from "react";
import {
  Divider,
  Paper,
  Typography,
  makeStyles,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import { connect } from "react-redux";
import { FaPencilAlt } from "react-icons/fa";
import Delivery from "./Delivery";
import { sendContactInfo } from "../../../Helper/SendData";
import { TransitionDown } from "../../../Helper/Animation";
import screenSize from "../../../Helper/ScreenSize";
import TextVerification from "./TextVerification";
import * as COLORS from '../../../Misc/colors'

const useStyle = makeStyles((theme) => ({
  card: {
    padding: "10px 25px",
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    marginBottom: "15px",
  },
  edit: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: "1.5rem",
    fontWeight: 600,
    margin: "0.7rem 0",

    [theme.breakpoints.down("md")]: {
      fontSize: "1.4rem",
      margin: "0.5rem 0",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.3rem",
      margin: "0.3rem 0",
    },
  },
}));

const Contact = (props) => {
  const classes = useStyle();
  const { smallScreen, extraSmallScreen } = screenSize();
  const {
    phone,
    name,
    verifiedNumbers,
  } = props.customer.customer;

  const initState = {
    phoneText: phone ? phone : '',
    nameText: name ? name : '',
    openContactDialog: false, // controls the contact dialog
    verificationStart: false, // will switch to true if the user press the verify button to start the process
    phoneVerifyModal: false, // controls the phone verification dialog
  };

  const [state, setState] = React.useState(initState);

  const [needVerification, setNeedVerification] = React.useState(false);
  const [error, setError] = React.useState("");
  const [complete, setComplete] = React.useState(false);

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleClickOpen = () => {
    setState({
      ...state,
      ...initState,
      openContactDialog: true,
    });
  };

  const handleClose = () => {
    setState({
      ...state,
      openContactDialog: false,
    });
    setNeedVerification(false);
    setComplete(false);
    setError("");
  };

  const handleSaveCustomerInfo = async () => {
    let phoneChange = state.nameText === name && state.phoneText !== phone;

    let noChange = state.nameText === name && state.phoneText === phone;

    let result;
    let tempVerifiedNumbers = verifiedNumbers;

    if (phoneChange) {
      // Scenario 1: if the customer made a change to phone number
      
      // phone number is not in the array, push it into the array
      if (!verifiedNumbers.includes(state.phoneText)) {
        tempVerifiedNumbers.push(state.phoneText);
      }
    } else if (noChange) {
      // Scenario 2: if all three field are the same, which means the customer just opened
      // dialog but didn't make a change or the fields aren't different
      handleClose();
      return;
    }

       // update contact information to database and store
       result = await sendContactInfo({
        name: state.nameText,
        phone: state.phoneText,
        verified: tempVerifiedNumbers,
        closeDialog: handleClose,
      });
  
      if (result.error) {
        // show error if an error has occur during the saving process
        setError(result.error);
        // reset the error after 3 seconds
        setTimeout(() => {
          setError("");
        }, 3000);
      }
  };

  return (
    <div>
      <Typography className={classes.title}>How can we contact you?</Typography>

      {/* Contact information components */}
      <Paper className={classes.card}>
        <div>
          <Typography variant={smallScreen ? "h6" : "h5"}>
            Contact Info
          </Typography>
          <Divider style={{ margin: "5px 0px" }} />
          <Typography variant={smallScreen ? "subtitle2" : "subtitle1"}>
            Name: {name}
          </Typography>
          <Typography variant={smallScreen ? "subtitle2" : "subtitle1"}>
            Phone: {phone}
          </Typography>
        </div>
        <div className={classes.edit}>
          <IconButton
            onClick={handleClickOpen}
            size={extraSmallScreen ? "small" : "medium"}
          >
            <FaPencilAlt />
          </IconButton>
        </div>
      </Paper>

      {props.cart.takeoutChoice === "delivery" ? <Delivery /> : null}

      {/* dialog for editing the contact information */}
      <Dialog
        open={state.openContactDialog}
        onClose={handleClose}
        disableBackdropClick
        aria-labelledby="form-dialog-title"
        fullScreen={smallScreen}
        TransitionComponent={TransitionDown}
      >
        <DialogTitle id="form-dialog-title">Edit Contact Info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Text verification will be require for first time users. Phone number
            associated with the account will not be ask to verify in the future.
          </DialogContentText>
          <TextField
            variant="outlined"
            style={{ display: "block", paddingBottom: "10px" }}
            placeholder="Enter your name"
            label="Name"
            value={state.nameText}
            onChange={onChange}
            name="nameText"
            fullWidth={true}
          />

          <TextField
            variant="outlined"
            style={{ display: "block", paddingBottom: "20px" }}
            placeholder="Enter your Phone"
            value={state.phoneText}
            onChange={(e) => {
              // only allow the customer to type in 10 digits
              if (e.target.value.length <= 10) {
                setState({
                  ...state,
                  phoneText: e.target.value,
                });
                setNeedVerification(false);
              }
              // Check the length of the entered phone number and check if it will need verification
              if (
                e.target.value.length === 10 &&
                !verifiedNumbers.includes(e.target.value)
              ) {
                setState({
                  ...state,
                  phoneText: e.target.value,
                });
                setNeedVerification(true);
              }
            }}
            label="Phone"
            name="phoneText"
            fullWidth={true}
          />

          {error ? <Typography color="error">{error}</Typography> : null}

          {needVerification && !complete ? (
            <Button
              style={{
                backgroundColor: "green",
                color: "white",
              }}
              variant="outlined"
              onClick={() => {
                setState({
                  ...state,
                  verificationStart: true,
                  phoneVerifyModal: true,
                });
              }}
            >
              Verify
            </Button>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleSaveCustomerInfo}
            // disabled={needVerification && state.phoneText.length < 10 && state.nameText === ''}
            disabled={needVerification || state.phoneText.length < 10 || state.nameText === ''}
            style={{
              backgroundColor: COLORS.BUTTON_RED,
              color: '#fff'
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <TextVerification
        open={state.phoneVerifyModal}
        phone={state.phoneText}
        close={() => {
          setState({
            ...state,
            phoneVerifyModal: false,
          });
        }}
        verifyComplete={() => {
          setNeedVerification(false);
          setComplete(true);
          setState({
            ...state,
            phoneVerifyModal: false,
          });
        }}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart,
  customer: state.customer,
});

export default connect(mapStateToProps, null)(Contact);
