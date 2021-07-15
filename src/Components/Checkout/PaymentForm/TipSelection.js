import React from "react";
import {
  ButtonGroup,
  Button,
  Typography,
  DialogActions,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
} from "@material-ui/core";
import { setTip, calculateTotal } from "../../../redux/actions/cart";
import { connect } from "react-redux";
import screenSize from '../../../Helper/ScreenSize'

const TipSelection = (props) => {
  const [open, setOpen] = React.useState(false);
  const [customTip, setCustomTip] = React.useState("");
  const { extraSmallScreen } = screenSize();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTips = (tip) => {
    props.setTip({choice: tip.choice, amount: tip.amount});
    props.calculateTotal();
  }

  return (
    <div style={{margin: '25px 0'}}>
      <Typography>
        {props.cart.takeoutChoice === "pickup"
          ? "ADD TIP (OPTIONAL)"
          : "ADD TIP FOR DRIVER"}
      </Typography>
      <ButtonGroup color="primary" aria-label="outlined primary button group" 
      orientation={extraSmallScreen ? 'vertical' : 'horizontal'}
      fullWidth={extraSmallScreen ? true : false}
      >
        <Button
          onClick={() => {
            handleTips({choice: "10", amount: 0.10});
          }}
          variant={props.cart.tipChoice === "10" ? "contained" : "outlined"}
        >
          10%
        </Button>
        <Button
          onClick={() => {
            handleTips({choice: "15", amount: 0.15});
          }}
          variant={props.cart.tipChoice === "15" ? "contained" : "outlined"}
        >
          15%
        </Button>
        <Button
          onClick={() => {
            handleTips({choice: "20", amount: 0.20});
          }}
          variant={props.cart.tipChoice === "20" ? "contained" : "outlined"}
        >
          20%
        </Button>
        <Button
          onClick={() => {
            handleTips({choice: "cash", amount: 0});
          }}
          variant={props.cart.tipChoice === "cash" ? "contained" : "outlined"}
        >
          Cash
        </Button>
        <Button
          onClick={handleClickOpen}
          variant={props.cart.tipChoice === "custom" ? "contained" : "outlined"}
        >
          Custom
        </Button>
      </ButtonGroup>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Custom Tip</DialogTitle>
        <DialogContent>
          <TextField
            autoComplete="off"
            autoFocus
            margin="dense"
            id="name"
            label="Custom Tip"
            type="number"
            value={customTip}
            fullWidth
            onChange={(e) => {
              setCustomTip(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleTips({choice: "custom", amount: customTip });
              handleClose();
            }}
            color="secondary"
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

const mapDispatchToProps = (dispatch) => ({
  setTip: (tip) => dispatch(setTip(tip)),
  calculateTotal: () => dispatch(calculateTotal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TipSelection);
