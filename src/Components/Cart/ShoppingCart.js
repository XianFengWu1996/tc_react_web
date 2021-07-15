import React from "react";
import {
  makeStyles,
  Divider,
  List,
  Button,
  Typography,
  IconButton,
  Dialog,
  useMediaQuery,
  useTheme,
  DialogActions,
  DialogTitle,
  DialogContent, Slide
} from "@material-ui/core";
import { connect } from "react-redux";
import {
  removeItem,
  clearCart,
  closeCart,
  calculateTotal,
  setTip,
} from "../../redux/actions/cart";
import { withRouter } from "react-router-dom";
import CartItem from "./CartItem";
import { FaTimes, FaTrash } from "react-icons/fa";
import { applyRewardPt } from "../../redux/actions/reward";

const useStyle = makeStyles((theme) => ({
  cart: {
    display: "block",
    position: "fixed",
    right: "50px",
    top: "70px",
    height: "500px",
    width: "400px",
    padding: "20px",
    zIndex: 1000,
  },
  dialog: {
    position: "absolute",
    right: 10,
    top: 50,
  },
  toolbar: theme.mixins.toolbar,
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ShoppingCart = (props) => {
  const classes = useStyle();
  const theme = useTheme();
  const useFullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [error, setError] = React.useState("");

  const handleCheckout = () => {
    if (props.cart.cartTotalCount < 1) {
      setError("Add items to cart before proceed");
    } else {
      props.history.push("/checkout");
      props.closeCart();
    }
  };

  const handleClearCart = () => {
    setError("");
    props.clearCart();
    if (
      props.cart.tipChoice === "10" ||
      props.cart.tipChoice === "15" ||
      props.cart.tipChoice === "20"
    ) {
      props.setTip({
        choice: props.cart.tipChoice,
        amount: Number(props.cart.tipChoice) / 100,
      });
    }
    props.applyPoint(0);
    props.calculateTotal();
  };

  return (
    <>
      <Dialog
        open={props.cart.cartOpen}
        onClose={() => {
          props.closeCart();
          setError("");
        }}
        fullScreen={useFullScreen}
        classes={{
          paper: useFullScreen ? "" : classes.dialog,
        }}
        fullWidth={true}
        maxWidth = {'xs'}
        TransitionComponent={Transition}
      >
        <IconButton
          onClick={() => {
            setError("");
            props.closeCart();
          }}
          style={{ alignSelf: "start" }}
        >
          <FaTimes />
        </IconButton>

        <DialogTitle>
            Your order
        </DialogTitle>

        <Divider style={{ marginBottom: "5px" }} />

        <DialogContent>
          <List style={{ height: "300px", overflow: "auto" }}>
            {props.cart.cartItems.map((item) => {
              return <CartItem item={item} key={item.foodId} />;
            })}
          </List>
        </DialogContent>

        <Divider />

        <DialogActions>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            style={{
              marginTop: "20px",
              marginLeft: "80px",
            }}
            onClick={handleCheckout}
          >
            Checkout {"$" + Math.abs(props.cart.cartTotal).toFixed(2)}
          </Button>
          <IconButton
            style={{
              marginTop: "20px",
              marginLeft: "15px",
            }}
            onClick={handleClearCart}
          >
            <FaTrash />
          </IconButton>
        </DialogActions>

        {error ? <Typography color="error">{error}</Typography> : <div></div>}
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    customer: state.customer,
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    remove: (item) => dispatch(removeItem(item)),
    clearCart: () => dispatch(clearCart()),
    closeCart: () => dispatch(closeCart()),
    setTip: (choice) => dispatch(setTip(choice)),
    calculateTotal: () => dispatch(calculateTotal()),
    applyPoint: (pt) => dispatch(applyRewardPt(pt)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ShoppingCart));
