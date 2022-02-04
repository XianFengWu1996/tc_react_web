import React, { Component } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
  withStyles
} from "@material-ui/core";
import CheckoutProgress from "./CheckoutProgress";
import { connect } from "react-redux";
import { setWarning, resetErrorAndWarning, setError, getServerStatus, calculateTotal, setHomeWarning, resetCheckout } from "../../redux/actions/cart";
import AlertMessage from '../../Helper/AlertMessage'
import * as ROUTES from '../Navigation/routes'
import moment from 'moment'
import { tz } from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import { store } from '../../store';


const style= (theme) => ({
  formBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: '10px 0',
  },
  container: {
    width: '90%',
    [theme.breakpoints.down("xs")]: {
      width: '100%'
    },

  }
});

class Checkout extends Component {
  constructor(props){
    super(props);
    this.state = {
      dialogOpen: false,
      timeoutId: 0,
      loading: false
    }
  } 

  async componentDidMount(){
    const { cart, menu } = this.props;
  
    this.props.resetError();
    // lunch special time is going to be quite consistent
    // need to convert the time to utc, because the getHours will return the time on the machine
      let date = moment(Date.now()).tz('America/New_York');
      let currentTime = (date.hour() * 60) + date.minute();
      let storeIsOpen = (menu.storeTime.storeOpen <= currentTime) && (menu.storeTime.storeClose >= currentTime);
      let isLunchTime = (menu.storeTime.lunchStart <= currentTime) && (menu.storeTime.lunchEnds >= currentTime);

      this.props.getServerStatus({
        allowLunchDiscount: isLunchTime,
        storeIsOpen: storeIsOpen,
      });
      this.props.calculateTotal();   
            
      if(!storeIsOpen){
        // show dialog to inform the user the kitchen is closed
        this.setState({ dialogOpen: true});

        // set a timer to close the dialog and redirect the user to the home page
        let id = setTimeout(() => {
          this.setState({ dialogOpen: false});
          this.props.history.push(ROUTES.HOME)
        }, 5000);

        this.setState({ timeoutId: id})
      } else {
        // if the store is still open, we will want the check if the customer has anything in the cart
        // if the cart is empty, we will want the customer to add something before proceed
        if (cart.cartTotalCount < 1) {
          this.props.history.push(ROUTES.HOME);
          this.props.setHomeWarning("Add items to cart before checkout");
        }
      }     
  }

  componentWillUnmount(){
    // clear the timer when the component unmount
    clearTimeout(this.state.timeoutId);
    store.dispatch(resetCheckout());
  }

  

  render() {
    const { classes } = this.props;


    const setLoading = (loading = false) => {
      this.setState({ loading: loading });
    }

    const showMessage = () => {
      // show the success message once the order is completed
      if (this.props.cart.orderCompleted) {
        return <AlertMessage 
        type='success' 
        message='The order has been successfully placed and sent to the restaurant.'
        />
      }
  
      // show the warning if the user is not following the procedure
      if (this.props.cart.checkoutWarning !== "") {
        return <AlertMessage 
          type='warning' 
          message={this.props.cart.checkoutWarning} 
          close={this.props.resetError}
        />
      }
  
      // show the error message if something went wrong during the checkout process
      if (this.props.cart.checkoutError !== "") {
        return <AlertMessage 
          type='error' 
          message={this.props.cart.checkoutError} 
          close={this.props.resetError}
        />
      }
    };
    return (
      <LoadingOverlay
      active={this.state.loading}
      spinner
      text='Loading...'
      >
      <div>
      {showMessage()}

      <div className={classes.formBox}>
        <Paper className={classes.container}>
          <CheckoutProgress setLoading={setLoading}/>
        </Paper>
      </div>


        <Dialog
          onClose={() => this.setState({dialogOpen: false})} 
          aria-labelledby="customized-dialog-title" 
          open={this.state.dialogOpen}
          disableBackdropClick
          disableEscapeKeyDown
        >
        <DialogTitle>Kitchen Closed</DialogTitle>
        <DialogContent dividers>
         <Typography>The kitchen is currently close, please check back tomorrow morning.</Typography>
         <Typography>Return to home page in a few seconds...</Typography>
        </DialogContent>
      </Dialog>
    </div>
      </LoadingOverlay>
    
    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  auth: state.auth,
  menu: state.menu,
});

const mapDispatchToProps = (dispatch) => ({
  setWarning: (warning) => dispatch(setWarning(warning)),
  setHomeWarning: (warning) => dispatch(setHomeWarning(warning)),
  setError: (error) =>dispatch(setError(error)),
  resetError: () => dispatch(resetErrorAndWarning()),
  getServerStatus: (status) => dispatch(getServerStatus(status)), 
  calculateTotal: () => dispatch(calculateTotal())
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(style)(Checkout));
