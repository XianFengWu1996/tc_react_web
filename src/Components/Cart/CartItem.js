import React from "react";
import { connect } from "react-redux";
import {
  updateCart,
  removeItem,
  calculateTotal,
  setTip,
  clearCart,
} from "../../redux/actions/cart";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Button,
  ListItem,
  Box,
  Divider,useTheme, useMediaQuery, AppBar, Toolbar, Slide
} from "@material-ui/core";
import { Add, Close, Remove } from "@material-ui/icons";
import { FaTrash } from "react-icons/fa";
import { applyRewardPt } from "../../redux/actions/reward";
import * as COLORS from '../../Misc/colors'
import ScreenSize from "../../Helper/ScreenSize";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const CartItem = (props) => {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState(0);
  const [comment, setComment] = React.useState("");
  const [countDiff, setCountDiff] = React.useState(0);
  const { currentStep, tipChoice, cartTotalCount } = props.cart;

  const theme = useTheme();
  const useFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { smallScreen } = ScreenSize();

  const handleClickOpen = () => {
    setOpen(true);
    setCount(props.item.count);
    setComment(props.item.comment);
    setCountDiff(0);
  };

  const handleClose = () => {
    setOpen(false);
    setCount(0);
    setComment("");
    setCountDiff(0);
  };

  // update the item in the cart
  const handleUpdateCart = () => {
    props.updateCart({
      ...props.item, 
      count: count,
      total: props.item.price * count,
      comment: comment,
      countDiff: countDiff,
    });

    // if(tipChoice === '10' || tipChoice === '15' || tipChoice === '20'){
    //   props.setTip({ choice: tipChoice, amount: Number(tipChoice) / 100})
    // }
    
    props.calculateTotal();
    handleClose();
  };

  // remove the item in the cart
  const handleRemoveItem = () => {
    props.removeItem(props.item);
    // if(tipChoice === '10' || tipChoice === '15' || tipChoice === '20'){
    //   props.setTip({ choice: tipChoice, amount: Number(tipChoice) / 100})
    // }
  
    // if(cartTotalCount - props.item.count < 1){
    //   props.clearCart();
    //   props.applyPoint(0);
    // }
    props.calculateTotal();
  }

  // increase the count
  const handleIncreaseCount = () => {
    setCount(count + 1);
    setCountDiff(countDiff + 1);
  }

  // decrease the count
  const handleDecreaseCount = () => {
    if (count > 1) {
      setCount(count - 1);
      setCountDiff(countDiff - 1);
    }
  }

  return (
    <>
      <ListItem button={currentStep !== 1} onClick={currentStep !== 1 ? handleClickOpen : null} key={props.item.foodId}>
        <Box width={1}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box width="10%">
              <Typography variant="button" style={{ fontWeight: "600" }}>
                {props.item.count}
              </Typography>
            </Box>
            <Box width="60%">
              <Typography variant="subtitle2" style={{ fontWeight: "300" }}>
                {props.item.foodId + ". " + props.item.foodName + '  ' +props.item.foodNameChinese}
              </Typography>
            </Box>
            <Box width="15%">
              <Typography variant="button" style={{ fontWeight: "600" }}>
                ${props.item.total.toFixed(2)}
              </Typography>
            </Box>
          </div>
          {props.item.comment ? <Typography variant='caption'>Special Instruction: {props.item.comment}</Typography> : null }

        </Box>
      </ListItem>

      <Divider />

      <Dialog
        open={open}
        onClose={handleClose}
        fullScreen={useFullScreen}
        aria-labelledby="form-dialog-title"
        TransitionComponent={Transition}
      >
          {
          useFullScreen ? 
          <>
            <AppBar>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
                  <Close />
                </IconButton>
              </Toolbar>
            </AppBar>
            <Toolbar />
          </>
           : null
        }
        <DialogTitle id="form-dialog-title">
          {props.item.foodId}. {props.item.foodName} {props.item.foodNameChinese}
        </DialogTitle>
        <DialogContent>
          <TextField
            placeholder="Leave special instruction for the restaurant. (Ex. Allergies, spicy level, etc..)"
            multiline
            variant="outlined"
            value={comment}
            rows={2}
            rowsMax={64}
            fullWidth={true}
            onChange={(e) => setComment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Box
            width={1}
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {/* remove the item  */}
            <IconButton onClick={handleRemoveItem}>
              <FaTrash /> 
            </IconButton>

            <Box style={{ display: "flex" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid #000",
                  borderRadius: "50px",
                  margin: "0 10px",
                }}
              >
                <IconButton disabled={count <= 1} onClick={handleDecreaseCount}>
                  <Remove />
                </IconButton>
                <Typography style={{ margin: "0 5px" }}>{count}</Typography>
                <IconButton onClick={handleIncreaseCount}>
                  <Add />
                </IconButton>
              </div>
              <Button
                onClick={handleUpdateCart}
                style={{ 
                   backgroundColor: COLORS.BUTTON_RED,
                   color: '#fff',
                   fontSize: smallScreen ? '10px' :'15px'
                  }}
                variant="contained"
              >
                Update Cart ${(count * props.item.price).toFixed(2)}
              </Button>
            </Box>
          </Box>
        </DialogActions>
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateCart: (item) => dispatch(updateCart(item)),
    removeItem: (item) => dispatch(removeItem(item)),
    setTip: (choice) => dispatch(setTip(choice)),
    calculateTotal: () => dispatch(calculateTotal()),
    clearCart: () => dispatch(clearCart()),
    applyPoint: (pt) => dispatch(applyRewardPt(pt))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);
