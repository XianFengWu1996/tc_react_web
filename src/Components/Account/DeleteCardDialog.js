import { Dialog, DialogContent, DialogTitle, IconButton, Slide } from '@material-ui/core';
import { CloseRounded } from '@material-ui/icons';
import React from 'react';
import { connect } from 'react-redux';
import DeleteCard from '../../Helper/DeleteCard';
import ScreenSize from '../../Helper/ScreenSize';
import '../Checkout/PaymentForm/payment.css'

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DeleteCardDialog = (props) => {
    const { cards } = props.customer.billing;
    const { extraSmallScreen } = ScreenSize();

    return (
      <Dialog open={props.open} onClose={props.onClose} fullScreen={extraSmallScreen} TransitionComponent={Transition}>
        <DialogTitle>Manage Card</DialogTitle>
        <DialogContent>
          {
            cards.map((card) => {
              return <DeleteCard card={card} key={card.cofId} />
            })
          }
          <IconButton onClick={props.onClose} size="medium" className="payment_close_button">
            <CloseRounded />
          </IconButton>
        </DialogContent>
      </Dialog>
    );
};

const mapStateToProps = (state) => ({
  customer: state.customer,
});


export default connect(mapStateToProps, null)(DeleteCardDialog);