import React from "react";
import TipSelection from "./TipSelection";
import CheckoutSummary from "../CheckoutSummary";
import { makeStyles } from "@material-ui/core";
import PaymentSelection from "./PaymentSelection";
import PointRedeem from "./PointRedeem";

const useStyle = makeStyles((theme) => ({
  layout: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",

    [theme.breakpoints.down('sm')]: {
      gridTemplateColumns: "1fr",
    }
  },
  form: {
    padding: "0 5rem",
    [theme.breakpoints.down('md')]:{
      padding: "0 3rem",
    },
    [theme.breakpoints.down('sm')]:{
      padding: "0 1rem",
    },
  }
}));

const PaymentForm = () => {
  const classes = useStyle();
  
  return (
       <div className={classes.layout}>
      <form className={classes.form}>
        <TipSelection />
        <PaymentSelection />
        <PointRedeem />

      </form>

      <CheckoutSummary />
    </div>
   
  );
};

export default PaymentForm ;
