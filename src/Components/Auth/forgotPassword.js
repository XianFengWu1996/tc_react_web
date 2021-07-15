import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Link,
  Typography,
} from "@material-ui/core";

import firebase from '../../config/fbConfig'
import { validate } from "email-validator";

const ForgotPassword = (props) => {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleClickOpen = () => {
    setOpen(true);
    setError('');
  };

  const handleClose = () => {
    setOpen(false);
    setError('');
    setEmail('');
  };

  const resetPassword = (email) => {
    // check if the email is valid
    if(validate(email)){
        // request to send a reset email to the email entered
        firebase.auth().sendPasswordResetEmail(email)
        .then(()=> {
          props.setSuccess('Password reset email has been send to your email.')
            // if the request is successful, reset the state
            handleClose();
        })
        // set the error
        .catch(e => setError(e.message ? e.message :'Failed to send the reset email.'));       
    } else {
        // set the error
        setError('Please enter a valid email.');
    }
  }

  return (
    <div>
      <Link href="#" onClick={handleClickOpen}>
        Forgot Password?
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Forgot Password</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter your email address below and we'll email instruction 
            on setting a new password. (Might have to check the spam folder)
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            onChange={(e) => {setEmail(e.target.value)}}
          />
          <Typography color='error'>{error !== '' ? error : ''}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={() => resetPassword(email)} color="primary">
            Reset
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ForgotPassword;
