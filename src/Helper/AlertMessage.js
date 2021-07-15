import { IconButton, makeStyles } from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import React from "react";
import { FaTimes } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  alert:{
    margin: '20px 30px 10px 30px',

    [theme.breakpoints.up('md')]:{
      margin: '20px 55px 10px 55px',
    }
  }
}))

const AlertMessage = (props) => {
  const classes = useStyles();

  return (
    <Alert
      severity={props.type} // error, warning, info, success
      className={classes.alert}
      action={
        props.close ? (
          <IconButton color="inherit" size="small" onClick={props.close}>
            <FaTimes />
          </IconButton>
        ) : null
      }
    >
      <AlertTitle>{props.type.toUpperCase()}</AlertTitle>
      {props.message}
    </Alert>
  );
};

export default AlertMessage;
