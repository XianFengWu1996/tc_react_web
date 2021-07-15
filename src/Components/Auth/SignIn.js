import React, { useState } from "react";
import { getFirebase } from "react-redux-firebase";
import { connect } from "react-redux";
import { withRouter, Link as RouteLink } from "react-router-dom";
import { facebook_provider, google_provider } from "../../config/fbConfig";
import { saveUserInfo } from "../../redux/actions/auth.js";
import ForgotPassword from "./forgotPassword";

import * as ROUTES from "../Navigation/routes";
import Axios from 'axios'
import LoadingOverlay from 'react-loading-overlay';


import {
  IconButton,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  CssBaseline,
  Avatar,
  Box,
  makeStyles,
  Paper,
} from "@material-ui/core";
import {  FaFacebookSquare } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import screenSize from "../../Helper/ScreenSize";
import { store } from "../../store";
import { getCustomerInfo } from "../../redux/actions/customer";
import { getRewardInfo } from "../../redux/actions/reward";
import AlertMessage from "../../Helper/AlertMessage";
import { signInUrl } from "../../Misc/url";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
  image: {
    backgroundImage: "url(/login.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: "0.7rem 0",
    fontWeight: 600,
  },
}));

const SignIn = (props) => {
  const firebase = getFirebase();
  const classes = useStyles();
  const { extraSmallScreen } = screenSize();
  const year = new Date().getFullYear();

  const [state, setState] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");
  const [maintenanceError, setMaintenanceError] = useState("");

  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  let sendInfoToStore = async (user, stopLoading) => {   
    await Axios.post(signInUrl, {
      userId: user.uid,
      env: process.env.NODE_ENV,
    }).then((value) => {
      const { customerInfo, orderList, rewardInfo, server } = value.data.result;
      const { isAdmin, status, message } = server;

      if(user.providerData[0].providerId === 'password' && !user.emailVerified){
        setResetError('The email has not been verified. Please verify your email.')
        return;
      }

      // if the server is not on
      if(!status){
          // if not admin, show the user the reason the server is unavailable 
          if(!isAdmin){
            setMaintenanceError(message)
            return;
          }
      }

      store.dispatch(saveUserInfo({
        userId: user.uid,
        email: user.providerData[0].email,
        requestKey: server.requestKey,
        cashReward: server.rewardPercentage.cashReward,
        cardReward: server.rewardPercentage.cardReward,
        isAdmin: server.isAdmin,
        key: server.key,
      }))

      store.dispatch(getCustomerInfo({ 
        customerInfo: customerInfo, 
        order: orderList 
      }))

      store.dispatch(getRewardInfo(rewardInfo));

      stopLoading(false);

      props.history.push(ROUTES.HOME)
    }).catch((e) => {
      throw Error(e.response.data.error ? e.response.data.error : 'Something went wrong...')
    })
  }

  // reset all the error message, when the user click one of the login method
  const resetAllError = () => {
    setResetError('');
    setResetSuccess('');
    setError('');
    setMaintenanceError('')
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    resetAllError();

    try {
      let user = (await firebase.auth().signInWithEmailAndPassword(state.email, state.password)).user;

      await sendInfoToStore(user, setLoading);
    } catch (error) {
      setLoading(false)
      setError(error.message ? error.message : 'Unexpected error has occur, failed to login');
    }
};

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      resetAllError();

      let user = (await firebase.auth().signInWithPopup(facebook_provider)).user;
      await sendInfoToStore(user, setLoading(false))
    } catch (error) {
      setLoading(false)
      setError(error.message ? error.message : 'Unexpected error has occur, failed to login with Facebook');
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      resetAllError();
      
      let user = (await firebase.auth().signInWithPopup(google_provider)).user;
      await sendInfoToStore(user, setLoading(false))
    } catch (error) {
      setLoading(false);
      setError(error.message ? error.message : 'Unexpected error has occur, failed to login with Google');
    }
  };

  const resendVerification = async () => {
    setResetError('');

    await firebase.auth().currentUser.sendEmailVerification().then(() => {
      // once successfully send, show user the success message and reset any error
      setResetSuccess(
        "The verification email has been sent to your email. Please check your email. (Might have to check spam folder)"
      );
    }).catch((error) => {
      // since this request can not be sent too often, Google will block request
      setError(error.message ? error.message : "Request are made too frequent, check your email first. Try again in 30 minutes.");
    })
  };

  return (
    <LoadingOverlay active={loading} spinner text='Signing in...'>
  <div style={{ overflow: "hidden" }}>
      {maintenanceError ? (
        <AlertMessage type='info' message={maintenanceError} close={() => setMaintenanceError('')} />
      ) : null}

      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={false} md={7} className={classes.image} />
        <Grid item xs={12} sm={12} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}></Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
        
            <form className={classes.form} onSubmit={onSubmit}>
              <TextField
                label="Email"
                variant="outlined"
                margin={extraSmallScreen ? "dense" : "normal"}
                fullWidth
                name="email"
                value={state.email}
                onChange={onChange}
                type="email"
                placeholder="Enter your email"
                required
                id="email"
              />

              <TextField
                label="Password"
                variant="outlined"
                name="password"
                value={state.password}
                onChange={onChange}
                type="password"
                placeholder="Enter your password"
                margin={extraSmallScreen ? "dense" : "normal"}
                required
                fullWidth
                id="password"
              />

              <Button
                type="submit"
                fullWidth
                variant="outlined"
                color="primary"
                className={classes.submit}
              >
                Sign In
              </Button>

              <Typography color="error">{error ? error : ""}</Typography>
              {resetError ? (
                <div style={{ marginBottom: '0.3rem'}}>
                  <Typography color="error">
                    {resetError}
                  </Typography>
                  <Link onClick={resendVerification} style={{ fontSize: '0.8rem', textTransform: 'uppercase', cursor: 'pointer'}}>
                    Resend Verification Email
                  </Link>
                </div>
              ) : null}

              <Typography style={{ color: "green" }}>
                {resetSuccess ? resetSuccess : ""}
              </Typography>

              <Grid container>
                <Grid item xs>
                  <ForgotPassword setSuccess={setResetSuccess} />
                </Grid>
                <Grid item>
                  <Typography variant="body2">
                    Don't have an account?{" "}
                    <RouteLink to={ROUTES.SIGNUP}>Sign up here</RouteLink>
                  </Typography>
                </Grid>
              </Grid>
              <div style={{  display: "flex",  justifyContent: "center",  marginTop: "1rem", }} >
                <IconButton onClick={loginWithFacebook} style={{ color: "#3b5998", fontSize: "2.2rem" }}>
                  <FaFacebookSquare />
                </IconButton>

                <IconButton onClick={loginWithGoogle} style={{ fontSize: "2.2rem" }}>
                  <FcGoogle />
                </IconButton>
              </div>
              <Box mt={5}>Copyright &#169; {year} Taipei Cuisine</Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
    </LoadingOverlay>

  
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps,null)(withRouter(SignIn));
