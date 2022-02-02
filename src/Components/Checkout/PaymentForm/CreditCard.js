import React from "react";
import {
  SquarePaymentForm,
  CreditCardNumberInput,
  CreditCardExpirationDateInput,
  CreditCardPostalCodeInput,
  CreditCardCVVInput,
  CreditCardSubmitButton,
} from "react-square-payment-form";
import { FormControlLabel, Checkbox, Typography } from "@material-ui/core";
import "react-square-payment-form/lib/default.css";
import "./payment.css"
import axios from "axios";
import { connect } from "react-redux";
import {
  saveCard,
  setError,
  resetErrorAndWarning,
  setSteps,
  setPayment,
} from "../../../redux/actions/cart";
import { updateCreditCardInStore } from "../../../Helper/SendData";
import LoadingSpinner from "../../../Helper/Loading";
import { updateCustomerId } from "../../../redux/actions/customer";
import { createCustomerUrl, registerCardUrl } from "../../../Misc/url";

class CreditCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: [],
      loading: false,
      requestError: "",
    };
  }

  handleResetLoading = () => {
    this.setState({ loading: false });
  };

  cardNonceResponseReceived = async (
    errors,
    nonce,
    cardData,
    buyerVerificationToken
  ) => {
    console.log(cardData);
    if (!this.state.loading) {
      // start the loader
      this.setState({ loading: true, errorMessage: [], requestError: "" });

      if (errors) {
        this.setState({
          errorMessage: errors.map((error) => error.message),
          loading: false,
        });
        return;
      }

      const { cart, customer, auth } = this.props;
      const { name, phone } = customer.customer;
      const { customerId, cards } = customer.billing;

      try {
        // if there is no customer id 
        if(customerId === ''){
        await axios.post(createCustomerUrl, {
          name: name,
          phone: phone,
          email: auth.email,
          userId: auth.userId,
          cards: cards,
          env: process.env.NODE_ENV,
        }, { headers: { Authorization: this.props.auth.requestKey }
        }).then((value) => {
          this.props.updateCustomerId(value.data.customerId);
        }).catch((error) => {
          // an error occur
          this.setState({requestError: error.response.data.error});
        })
        }

        // ======================================
        //      Credit Card & save the card
        // ======================================
        if(cart.saveCard){
          await axios.post(registerCardUrl, {
            billing: customer.billing,
            customer: customer.customer,
            user: auth,
            nonce,
            env: process.env.NODE_ENV,
          }, { headers: { Authorization: this.props.auth.requestKey }
          }).then((value) => {
            let card = value.data.card;

            updateCreditCardInStore(card);

            // // save the payment details
            this.props.setPayment({
              choice: card.cofId,
              details:{
                cofId: card.cofId,
                brand: card.brand,
                month: card.month,
                year: card.year,
                lastFourDigit: card.lastFourDigit
              }
            })

            this.props.close();
          }).catch((error) => {
            // an error occur
            this.setState({requestError: error.response.data.error});
          })

          this.handleResetLoading();
          return;
        }

        // save the payment details
        this.props.setPayment({
          choice: nonce,
          details:{
            cofId: nonce,
            brand: cardData.card_brand,
            month: cardData.exp_month,
            year: cardData.exp_year,
            lastFourDigit: cardData.last_4
          }
        })

        this.props.close();

      } catch (error) {
        this.setState({requestError: error.message ? error.message : 'Opps, unexpected error has occurred..'});
      }
      this.handleResetLoading();
    }
  }

  createVerificationDetails = () => {
    const { name, phone } = this.props.customer.customer;

    return {
      amount: `${this.props.cart.total}`,
      currencyCode: "USD",
      intent: "CHARGE",
      billingContact: {
        givenName: name,
        phone: phone,
      },
    };
  };

  render() {
    return (
      <div style={{ 
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}>
            <div style={{
              backgroundColor: 'red',
              width: '450px',
              display: 'flex',
              alignSelf: 'center'
            }}>
                <Typography variant="button" style={{ 
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                {this.state.requestError}
              </Typography>
            </div>
      <SquarePaymentForm
        sandbox={process.env.NODE_ENV === "development"}
        applicationId={
          process.env.NODE_ENV === "development"
            ? this.props.auth.key.square_id_dev
            : this.props.auth.key.square_id_prod
        }
        locationId={
          process.env.NODE_ENV === "development"
            ? this.props.auth.key.square_location_dev
            : this.props.auth.key.square_location_prod
        }
        cardNonceResponseReceived={this.cardNonceResponseReceived}
        createVerificationDetails={this.createVerificationDetails}
        
      >
  
        <fieldset className="sq-fieldset">
        <CreditCardNumberInput />

        <div className="sq-form-third">
          <CreditCardExpirationDateInput />
        </div>

        <div className="sq-form-third">
          <CreditCardPostalCodeInput />
        </div>

        <div className="sq-form-third">
          <CreditCardCVVInput />
        </div>
        </fieldset>
          
          {/* <FormControlLabel
            control={
              <Checkbox
                disabled={this.props.customer.billing.cards.length >= 5}
                checked={this.props.cart.saveCard}
                onChange={this.props.saveCard}
                name="save"
              />
            }
            label="Save Card"
          /> */}

          {this.props.customer.billing.cards.length >= 5 ? (
            <Typography color="error" variant="button">
              Max Credit Card: 5
            </Typography>
          ) : null}

          <CreditCardSubmitButton>
            {this.state.loading ? <LoadingSpinner /> : `Continue`}
          </CreditCardSubmitButton>
       

        <div className="sq-error-message">
          {this.state.errorMessage.map((errorMessage) => (
            <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
          ))}
        </div>
      </SquarePaymentForm>
      </div>

    );
  }
}

const mapStateToProps = (state) => ({
  cart: state.cart,
  customer: state.customer,
  auth: state.auth,
  store: state.store,
});

const mapDispatchToProps = (dispatch) => ({
  saveCard: () => dispatch(saveCard()),
  updateCustomerId: (id) => dispatch(updateCustomerId(id)),
  setPayment: (payment) => dispatch(setPayment(payment)),
  setError: (error) => dispatch(setError(error)),
  resetError: () => dispatch(resetErrorAndWarning()),
  setSteps: (step) => dispatch(setSteps(step)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CreditCard);
