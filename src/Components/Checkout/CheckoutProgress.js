import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import CheckoutForm from "./CheckoutForm/CheckoutForm";
import PaymentForm from "./PaymentForm/PaymentForm";
import { resetErrorAndWarning, setSteps, completeOrder, setError } from "../../redux/actions/cart";
import { connect } from "react-redux";
import {
  checkoutCanProceed,
  paymentCanProceed,
} from "../../Helper/Checkout";
import ReviewForm from "./ReviewForm/ReviewForm";
import { withRouter } from "react-router-dom";
import ScreenSize from "../../Helper/ScreenSize";
import { sendOrder } from "../../Helper/SendData";
import { setRewardInfo } from "../../redux/actions/reward";
import * as COLORS from '../../Misc/colors';
import { addOrder } from "../../redux/actions/customer";


const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
}));

const CheckoutProgress = (props) => {
  const { currentStep } = props.cart;
  const classes = useStyles();
  const steps = getSteps();
  const { smallScreen } = ScreenSize()

  function getSteps() {
    return [
      "Fill out information",
      "Choose Payment",
      "Review Order",
    ];
  }

  function getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0:
        return <CheckoutForm />;
      case 1:
        return <PaymentForm />;
      case 2:
        return <ReviewForm />;
      default:
        return "Unknown stepIndex";
    }
  }

  const handleNext = () => {
    props.resetError();
    if (currentStep === 0) {
      checkoutCanProceed();
      window.scrollTo(0,0)
    } else if (currentStep === 1) {
      window.scrollTo(0,0)
      paymentCanProceed();
    } else if (currentStep === 2) {
      props.setLoading(true)
      sendOrder(handleComplete, handleError);
    }
  };

  const handleComplete = (data) => {
    props.completeOrder();
    props.setReward(data.reward); 
    props.setLoading(false)
    props.addOrder(data.order)

    props.history.push({
      pathname: '/confirmation',
      state: {order: data.order}
    });
   
  }

  const handleError = (message) => {
    props.setLoading(false)
    props.setError(message);
  }

  const handleBack = () => {
    props.setSteps({ action: "decrease" });
    props.resetError();
  };

  const setButtonText = () => {
    switch (currentStep) {
      case 0:
        return "Proceed to Payment";
      case 1:
        return "Continue";
      case 2:
        return "Send Order";
      default:
        break;
    }
  };
  
  const showStep = () => {
    if (!smallScreen) {
      return (
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      );
    }
  };

  return (

    <div className={classes.root}>
      {showStep()}
      <div>
        {getStepContent(currentStep)}

        <div>
          <div style={{ margin: "1.2rem 0 1.2rem 1.2rem" }}>
              <Button
                disabled={currentStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>           
              <Button 
                variant="contained" 
                style={{ backgroundColor: COLORS.BUTTON_RED, color: '#fff'}} 
                onClick={handleNext}>
                  {setButtonText()}
              </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.customer,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setSteps: (step) => dispatch(setSteps(step)),
  setError: (error) => dispatch(setError(error)),
  resetError: () => dispatch(resetErrorAndWarning()),
  completeOrder: () => dispatch(completeOrder()),
  setReward: (data) => dispatch(setRewardInfo(data)),
  addOrder: (order) => dispatch(addOrder(order)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(CheckoutProgress));
