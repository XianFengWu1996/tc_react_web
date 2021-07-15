import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React from "react";
import ReactCodeInput from "react-code-input";
import Randomstring from "randomstring";
import * as COLOR from "../../../Misc/colors";
import Axios from "axios";
import { store } from "../../../store";
import Loader from "react-loader-spinner";
import { sendCodeUrl } from "../../../Misc/url";

const useStyle = makeStyles({
  container: {
    width: "450px",
    height: "300px",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignContent: "space-between",
  },
  cancelButton: {
    backgroundColor: COLOR.FAILEDLIGHT,
    color: "#fff",
    "&:hover": {
      backgroundColor: COLOR.FAILED,
    },
  },
  enableButton: {
    backgroundColor: COLOR.SUCESSDARK,
    color: "#fff",

    "&:hover": {
      backgroundColor: COLOR.SUCESS,
    },
  },
  disableButton: {
    backgroundColor: COLOR.DISABLED,
    color: "#fff",
  },
});

const TextVerification = (props) => {
  const classes = useStyle();

  let initialTimer = 120; // timer for count down to allow resend
  // handle count down timer
  let [countDown, setCountDown] = React.useState(initialTimer);
  let [send, setSend] = React.useState(false);
  let [codeMatch, setCodeMatch] = React.useState(false);

  const [loading, setLoading] = React.useState(false); // handle loading components
  const [error, setError] = React.useState(''); // handle any error message

  // generate a four digit code 
  const generateNewCode = () => {
    return Randomstring.generate({
      charset: "numeric",
      length: 4,
    });
  };

  const [code, setCode] = React.useState(generateNewCode()); // handle code and re-generating code

  const [intervalId, setIntervalId] = React.useState();

  // toggle component base on user action
  const toggleLoading = (text) => {
    if (loading) {
      // return the loading component
      return (
        <Loader
          type={"ThreeDots"}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          color="#FFF"
          height={20}
          width={25}
        />
      );
    } else {
      return text;
    }
  };

  const { auth } = store.getState(); // request key 

  // handle sending verification code and count down timer
  const handleCountDown = async () => {
    setLoading(true)
    // send the code
    await Axios.post(
      sendCodeUrl,
      { phone: props.phone, code, env: process.env.NODE_ENV}, { headers: { Authorization: auth.requestKey } }
      // change the phone number
    ).then(() => {
      // the code is sent successfully
      setSend(true);
    }).catch((e) => {
      setError(e.message ? e.message : 'Failed to send code');
    })
    setLoading(false);
  }

  const handleSent = async () => {
      // setLoading(true);
      if(!send){
        await handleCountDown();
      }
     
      let id = setInterval(() => {
        if(countDown > 1){
          // if the count down is not done yet
          setCountDown(countDown -= 1);
        } else {
          // set the send status
          setSend(false);
          // reset the timer
          setCountDown(initialTimer);
          
          clearInterval(id);
        }        
      }, 1000)
      setIntervalId(id);
  }

  // reset the verification process
  const resetVerification = () => {

    // reset status
    setSend(false);
    setCodeMatch(false);
    // reset the count down timer
    setCountDown(initialTimer);
    // generate a new code 
    setCode(generateNewCode());

    // reset error 
    setError('');
    // reset loading 
    setLoading(false);
    // clear interval 
    clearInterval(intervalId);
    // close the dialog
    props.close();
  };

  return (
    <div>
      <Dialog
        open={props.open}
        classes={{ paper: classes.container }}
        disableBackdropClick
      >
        <DialogTitle>Text Verification</DialogTitle>
        <DialogContent
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "30px 20px",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Typography variant="subtitle2">
            {send
              ? "(A 4-digit verification code has been sent to your phone.)"
              : "Send a one time verification code"}
          </Typography>

          <ReactCodeInput
            type="tel"
            fields={4}
            onChange={(enteredCode) => {
              if(enteredCode.length === 4){
                if(enteredCode === code){
                  setCodeMatch(true);
                } else {
                  setError('Code does not match');
                }
              } else {
                setCodeMatch(false);
                // reset error
                setError('');
              }
            }}
          />

        {
          send ? <Typography>{countDown}s to send again</Typography> :  <Button
          variant="contained"
          className={classes.enableButton}
          disabled={loading || codeMatch}
          onClick={handleSent}
          >
            { toggleLoading('Send') }
          </Button>
        }
      

        <Typography color='error' variant="subtitle2">{error}</Typography>
        </DialogContent>

        <DialogActions>
         <Button
            variant="contained"
            className={classes.enableButton}
            fullWidth
            disabled={!codeMatch}
            onClick={() => {
              props.verifyComplete();
            }}
          >
            Continue
          </Button> 
          <Button
            variant="contained"
            className={classes.cancelButton}
            fullWidth
            onClick={() => {
              resetVerification();
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TextVerification;
