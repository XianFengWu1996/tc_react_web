import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { setTakeoutChoice, calculateTotal, setDelivery, setWarning, resetErrorAndWarning } from "../../../redux/actions/cart";

const useStyle = makeStyles({
  selected: {
    backgroundColor: "#e8385b",
    color: "#fff",
  },
  unSelected: {
    backgroundColor: "#fff",
  },
  layout: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: '0.5rem 0'
  },
});

const TakeoutChoice = (props) => {
  const classes = useStyle();
  return (
    <div className={classes.layout}>
      <Button
        variant="outlined"
        size="large"
        className={
          props.cart.takeoutChoice === "pickup"
            ? classes.selected
            : classes.unSelected
        }
        onClick={() => {
          props.resetWarning();
          props.setTakeoutChoice("pickup");
          props.calculateTotal();
        }}
      >
        Pick Up
      </Button>
      <Button
        variant="outlined"
        size="large"
        className={
          props.cart.takeoutChoice === "delivery"
            ? classes.selected
            : classes.unSelected
        }
        onClick={() => {
          props.resetWarning();
          if(props.cart.cartTotal >= 15){
            props.setTakeoutChoice("delivery");
            props.setDeliveryToCart(props.customer.address.deliveryFee);
            props.calculateTotal();
          } else {
            props.setWarning('The minmum for delivery is $15 in subtotal.');
          }
        }}
      >
        Delivery
      </Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.customer
});

const mapDispatchToProps = (dispatch) => ({
  setTakeoutChoice: (option) => dispatch(setTakeoutChoice(option)),
  calculateTotal: () => dispatch(calculateTotal()),
  setDeliveryToCart: (deliveryFee) => dispatch(setDelivery(deliveryFee)),
  setWarning: (warning) => dispatch(setWarning(warning)),
  resetWarning: () => dispatch(resetErrorAndWarning()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TakeoutChoice);
