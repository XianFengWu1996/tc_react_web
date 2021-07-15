import React from "react";
import { Paper, Typography, Divider, makeStyles } from "@material-ui/core";
import { connect } from "react-redux";
import CartItem from "../Cart/CartItem";

const useStyle = makeStyles((theme) => ({
  summary: {
    padding: "1.6rem 1.4rem",
    margin: "0 15px",

    [theme.breakpoints.down('md')]: {
      padding: "0.8rem 1.3rem",
      marginRight: "0",
    },
    [theme.breakpoints.down('sm')]: {
      padding: "0.6rem 1.3rem",
    },
    [theme.breakpoints.down('xs')]: {
      padding: "0.5rem 1.3rem",
    }
  },
  orderText: {
    fontWeight: 'bold',
    margin: '25px 0 15px 0',
  },
  summaryItem: {
    display: "flex",
    justifyContent: "space-between",
  },
  boldFont: {
    fontWeight: 600
  },
  lightFont: {
    fontWeight: 200
  }
}));

const CheckoutSummary = (props) => {
  const classes = useStyle();
  return (
    <Paper className={classes.summary}>
      <Typography variant="h5" className={classes.orderText} >Your order</Typography>
      <Divider />
      <div style={{ minHeight: "100px" }}>
        {props.cart.cartItems.map((item) => {
          return <CartItem item={item} key={item.foodId} />;
        })}
      </div>
      <Divider />
      <div>
        {props.cart.lunchDiscount > 0 ? 
        <div className={classes.summaryItem}>
          <Typography variant="subtitle1" className={classes.lightFont}>Lunch Discount:</Typography>
          <Typography variant="subtitle1" className={classes.lightFont}>
            (${props.cart.lunchDiscount.toFixed(2)})
          </Typography>
        </div> : null
        }
        {
          props.cart.discount > 0 
          ? <div className={classes.summaryItem}>
              <Typography variant="subtitle1" className={classes.lightFont}>Discount:</Typography>
              <Typography variant="subtitle1" className={classes.lightFont}>
                (${props.cart.discount.toFixed(2)})
              </Typography>
           </div> : null 
        }
        {
          props.cart.discount > 0 || props.cart.lunchDiscount > 0 ? <Divider /> : null
        }
         <div className={classes.summaryItem}>
          <Typography variant="subtitle1" className={classes.lightFont}>Subtotal:</Typography>
          <Typography variant="subtitle1" className={classes.lightFont}>
            ${props.cart.calculatedSubtotal.toFixed(2)}
          </Typography>
        </div>
        <div className={classes.summaryItem}>
          <Typography variant="subtitle1" className={classes.lightFont}>Tax:</Typography>
          <Typography variant="subtitle1" className={classes.lightFont}>
            ${props.cart.tax.toFixed(2)}
          </Typography>
        </div>
        {props.cart.takeoutChoice === "delivery" ? (
          <div className={classes.summaryItem}>
            <Typography variant="subtitle1" className={classes.lightFont}>Delivery:</Typography>
            <Typography variant="subtitle1" className={classes.lightFont}>
              ${props.cart.delivery ? props.cart.delivery.toFixed(2) : 0.00}
            </Typography>
          </div>
        ) : null}

        <div className={classes.summaryItem}>
          <Typography variant="subtitle1" className={classes.lightFont}>Tip:</Typography>
          <Typography variant="subtitle1" className={classes.lightFont}>{`$${props.cart.tip.toFixed(2)}`}</Typography>
        </div>
        <div className={classes.summaryItem}>
          <Typography variant="subtitle1" className={classes.boldFont}>Total:</Typography>
          <Typography variant="subtitle1" className={classes.boldFont}>
            ${props.cart.total.toFixed(2)}
          </Typography>
        </div>
      </div>
    </Paper>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, null)(CheckoutSummary);
