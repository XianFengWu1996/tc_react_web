import React from "react";
import {makeStyles, Divider, TextField} from "@material-ui/core";
import CheckoutSummary from "../CheckoutSummary";
import Contact from "./Contact";
import TakeoutChoice from "./TakeoutChoice";
import { setComment } from "../../../redux/actions/cart";
import { connect } from "react-redux";
import ScreenSize from "../../../Helper/ScreenSize";

const useStyle = makeStyles((theme) => ({
  layout: {
    display: "grid", 
    gridTemplateColumns: "2fr 1fr",

    [theme.breakpoints.down('sm')]:{
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
  },
}));

const CheckoutForm = (props) => {
  const classes = useStyle();
  const { smallScreen } = ScreenSize()
  
  return (
    <div className={classes.layout}>
      <form className={classes.form}>

        <TakeoutChoice />
        {smallScreen ? <CheckoutSummary /> : null}

        <Contact />
        <Divider style={{ margin: '20px 0' }}/>

        <TextField
          style={{ paddingBottom: "30px" }}
          placeholder="Leave special instruction for the restaurant. (Ex. Allergies, spicy level, etc..)"
          multiline
          variant="outlined"
          rows={2}
          rowsMax={64}
          fullWidth={true}
          value={props.cart.comment}
          onChange={(e) => props.setComment(e.target.value)}
        />
      </form>
      {!smallScreen ? <CheckoutSummary /> : null}
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart
})

const mapDispatchToProps = (dispatch) => ({
  setComment: (comment) => dispatch(setComment(comment))
})



export default connect(mapStateToProps, mapDispatchToProps)(CheckoutForm);
