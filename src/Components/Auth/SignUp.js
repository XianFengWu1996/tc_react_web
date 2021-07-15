import React, { useState } from "react";
import { getFirebase } from "react-redux-firebase";
import { withRouter, Link } from "react-router-dom";

import * as ROUTES from "../Navigation/routes";
import { validate } from "email-validator";
import Requirement from '../Account/Requirement'
import LoadingOverlay from 'react-loading-overlay';

import {
  Typography,
  TextField,
  Button,
  Grid,
  CssBaseline,
  Avatar,
  Box,
  makeStyles, Paper
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import { Check } from "@material-ui/icons";
import screenSize from '../../Helper/ScreenSize'
import { checkPassword } from "../../Helper/CheckPassword.js";


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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    padding: '0.7rem 0',
    fontWeight: 600
  },
}));

const SignUp = (props) => {
  const firebase = getFirebase();
  const classes = useStyles();
  const { extraSmallScreen } = screenSize();
  const year = new Date().getFullYear();

  let INITSTATE = {
    email: "",
    password: "",
    confirmPassword: "",
    success: false,
    status: {
      uppercase: false,
      lowercase: false,
      numeric: false,
      symbol: false,
      checked: false,
      qualifyPassword: false,
      qualifyLength: false,
   },
  }

  const [state, setState] = useState(INITSTATE);
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // if the email is valid
    if(!validate(state.email)){
      setError('Enter a valid email to proceed.')
      return;
    }

    // if the password is a match
    if(state.password !== state.confirmPassword){
      setError('The password does not match.')
      return;
    }

    // if the password fits the criteria
    if(!state.status.qualifyPassword){
      setError('The password does not fit the criteria.')
      return;
    }

    setLoading(true)

    try {
      let result = await firebase.auth().createUserWithEmailAndPassword(state.email, state.password);
            
      // send verification email to the user
      await result.user.sendEmailVerification();  

      setState({
        ...state, 
        ...INITSTATE,
        success: true
      });
    } catch (error) {
      setError(error.message ? error.message : 'Failed to create new user')
    } finally {
      window.scrollTo(0,0);
      setLoading(false)
    }

  };

  return (
    <LoadingOverlay active={loading} spinner text='Creating new user...'>
    <div>
      {state.success ? (
        <Alert
          icon={<Check fontSize="inherit" />}
          severity="success"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => {
                props.history.push(ROUTES.SIGNIN);
                setState({
                  ...state,
                  error: '',
                  success: false
                })
              }}
            >
              Sign in
            </Button>
          }
        >
          <AlertTitle>Success</AlertTitle>
          Success, check your email for a confirmation email.
        </Alert>
      ) : null}
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={false} md={7} className={classes.image} />
        <Grid
          item
          xs={12}
          sm={12}
          md={5}
          component={Paper}
          elevation={6}
          square
        >
          <div className={classes.paper}>
            <Typography></Typography>
            <Avatar className={classes.avatar}></Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>
            <form className={classes.form} onSubmit={onSubmit}>
              <TextField
                label="Email"
                margin={extraSmallScreen ? "dense" : "normal"}
                variant="outlined"
                fullWidth
                name="email"
                value={state.email}
                onChange={(e) => {
                  setState({
                    ...state,
                    email: e.target.value,
                  })
                }}
                type="email"
                placeholder="Enter your Email"
                required
              />
              <TextField
                label="Password"
                variant="outlined"
                name="password"
                value={state.password}
                onChange={(e) => {
                  let result = checkPassword(e.target.value);
                    setState({
                        ...state, 
                        password: e.target.value,
                        status: {
                          ...result
                        },
                    });
                }}
                type="password"
                placeholder="Enter your password"
                margin={extraSmallScreen ? "dense" : "normal"}
                required
                fullWidth
              />
              <TextField
                label="Confirm Password"
                variant="outlined"
                name="confirmPassword"
                value={state.confirmPassword}
                onChange={(e) => {
                  setState({
                    ...state,
                    confirmPassword: e.target.value
                  })
                }}
                type="password"
                placeholder="Confirm your password"
                margin={extraSmallScreen ? "dense" : "normal"}
                required
                fullWidth
              />

              {state.password ? <Requirement status={state.status}/> : null}

              <Button
                type="submit"
                variant="outlined"
                color="primary"
                className={classes.submit}
                fullWidth
              >
                Sign Up
              </Button>{" "}
              {error ? <Typography color="error">{error}</Typography> : null}
              
              <Typography>
                Already have an account?{" "}
                <Link to={ROUTES.SIGNIN}> Sign in here</Link>
              </Typography>
              <Box mt={5}>Copyright &#169; {year} Taipei Cuisine</Box>
            </form>
          </div>
        </Grid>
      </Grid>
    </div>
    </LoadingOverlay>

  );
};

export default withRouter(SignUp);
