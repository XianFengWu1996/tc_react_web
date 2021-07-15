import React from "react";
import {
  ButtonGroup,
  Button,
  Typography,
  Dialog,
  DialogContent,
  Slide,
  IconButton,
  makeStyles,
  Card,
  CardContent,
} from "@material-ui/core";
import { resetPayment, setPayment } from "../../../redux/actions/cart";
import { connect } from "react-redux";
import CreditCard from "./CreditCard";
import screenSize from "../../../Helper/ScreenSize";
import { CloseRounded } from "@material-ui/icons";
import { store } from "../../../store";
import DeleteCard from "../../../Helper/DeleteCard";
import './payment.css'
import { FaCcAmex, FaCcVisa, FaCcMastercard, FaCcDiscover, FaCreditCard, FaCheck, FaMoneyBillWave } from "react-icons/fa";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const useStyle = makeStyles(() => ({
  paper: {
    minWidth: '500px',
    minHeight: '400px',
    maxWidth: '600px',  
  }
}));

const PaymentSelection = (props) => {
  const { total, payment } = props.cart;
  const { cards } = props.customer.billing;
  const { extraSmallScreen } = screenSize();
  const classes = useStyle();
  

  const [open, setOpen] = React.useState(false);

  const [showOption, setShowOption] = React.useState(false);

  const [estPoint, setEstPoint] = React.useState(0);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleChangeCard = () => {
    props.setPayment("");
    setShowOption(!showOption);
  };

  const handleClose = () => {
    setOpen(false);
    store.dispatch(resetPayment());
  };

  const handlePayInStore = () => {
    if (props.cart.takeoutChoice === "pickup" && total >= 10) {
      return (
        <Button
          startIcon={<FaCreditCard />}
          onClick={() => {
            props.setPayment({
              choice:"card",
              details: {}
            });
            setEstPoint(props.cart.calculatedSubtotal * props.auth.cardReward)
          }}
          variant={payment.choice === "card" ? "contained": "outlined"}
        >
          PAY CARD
        </Button>
      );
    }
  };

  const handleNewCard = () => {
    if (total >= 10) {
      return (
        <Button
          onClick={() => {
            props.setPayment({
              choice: '',
              details: {}
            })
            handleClickOpen();
          }}>
          Add New Card
        </Button>
      );
    }
  };

  const handleCardIcon = (brand, size) => {
    switch(brand){
      case 'VISA':
        return <FaCcVisa color='#1A1F71' size={size} />
      case 'MASTERCARD':
        return <FaCcMastercard color='#19110B' size={size} />
      case 'AMERICAN_EXPRESS':
        return <FaCcAmex color='#2671B9' size={size} />
      case 'DISCOVER':
        return <FaCcDiscover color='#E55C20' size={size} />
      default: 
        return <FaCreditCard size={size} />
    }
  }

  return (
    <div>
      <Typography style={{ marginTop: "0.5rem" }}>
        PAY IN {props.cart.takeoutChoice === "pickup" ? "STORE" : "PERSON"}{" "}
      </Typography>
      <ButtonGroup
        color="primary"
        aria-label="outlined primary button group"
        orientation={extraSmallScreen ? "vertical" : "horizontal"}
        fullWidth={extraSmallScreen ? true : false}
      >
        <Button
          startIcon={<FaMoneyBillWave />}
          onClick={() => {
            props.setPayment({
              choice: 'cash',
              details: {}
            })
            setEstPoint(props.cart.calculatedSubtotal * props.auth.cashReward)
          }}
          variant={ payment.choice === "cash" ? "contained" : "outlined"}
        >
          Cash
        </Button>
        {handlePayInStore()}
      </ButtonGroup>

      {total < 10 ? null : (
        <div
          className='pay_online'
        >
          <Typography style={{ marginRight: "1rem" }}>PAY ONLINE</Typography>
          <Button
            onClick={handleChangeCard}
            style={{ padding: "0.2rem" }}
            variant="outlined"
          >
            Manage Card
          </Button>
      </div>        
      )}

      {total < 10 ? null : (
        <div>
           {showOption ? (
        <div style={{ display: "flex", flexDirection: "column" }}>
          {cards.map((card) => {
            return (
               <DeleteCard card={card} key={card.cofId} />
            );
          })}
        </div>
      ) : null}

      <ButtonGroup
        color="primary"
        aria-label="outlined primary button group"
        style={{ marginTop: "0.5rem" }}
        orientation="vertical"
        fullWidth={extraSmallScreen ? true : false}
      >
        {
          cards.map((card) => {
            return (
                <Button
                  startIcon={handleCardIcon(card.brand)}
                  key={card.cofId}
                  onClick={() => {
                    props.setPayment({
                      choice: card.cofId,
                      details: {
                        cofId: card.cofId,
                        brand: card.brand,
                        month: card.month,
                        year: card.year,
                        lastFourDigit: card.lastFourDigit
                      }
                    });
                    setEstPoint(props.cart.calculatedSubtotal * props.auth.cardReward)
                  }}
                  endIcon={(payment.choice === card.cofId) ? <FaCheck color="green" size={20}/>  : null}
                >
                  xx-{card.lastFourDigit}
                </Button>
            )
          })
        }
        {handleNewCard()}
      </ButtonGroup>

        </div>
      )}


      {
        payment.choice !== undefined && payment.choice.includes('cnon') ?  
        <div className='new_cc_card'>
        <Typography>(Card will be verify later and will not be save)</Typography>
        <Card>
          <CardContent className='new_cc_card_content'>
            {handleCardIcon(payment.details.brand, 35)}
            <Typography style={{ marginLeft: '20px'}}>
              {payment.details.brand} {' '}
              XX-{payment.details.lastFourDigit} 
            </Typography>
  
            <Typography>EXP: {payment.details.month}/{payment.details.year}</Typography>
            <FaCheck size={20} color='green'/>
          </CardContent>
        </Card>
        </div>
        : null
      }
    

      {estPoint > 0 ? 
      <Typography variant="caption" className='earned_point' >ESTIMATE POINTS EARN: {estPoint.toFixed(0)}</Typography> 
      : null}

      <Dialog
        open={open}
        TransitionComponent={Transition}
        fullScreen={extraSmallScreen}
        disableBackdropClick
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        classes={{
          paper: classes.paper
        }}
      >
        <DialogContent>
          <IconButton onClick={handleClose} size="medium" className="payment_close_button">
            <CloseRounded />
          </IconButton>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CreditCard close={handleClose} open={open} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  customer: state.customer,
  cart: state.cart,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  setPayment: (payment) => dispatch(setPayment(payment)),
});

export default connect(mapStateToProps, mapDispatchToProps)(PaymentSelection);
