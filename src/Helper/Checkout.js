import { store } from "../store";
import {
  setSteps,
  setWarning,
  resetErrorAndWarning,
} from "../redux/actions/cart";

export const checkoutCanProceed = () => {
  const { cart, customer } = store.getState();
  const { name, phone } = customer.customer;
  const { address } = customer.address;
  
  store.dispatch(resetErrorAndWarning());

  // check if the user has enter name and phone
  if (name === "" || phone === "") {
    store.dispatch(setWarning("Please make sure the contact information is filled out."));
    return;
  }

  // check if the cart is empty
  if(cart.cartTotalCount < 1){
    store.dispatch(setWarning("Please add items to cart before proceed to payment."));
    return;
  } 

  // check for delivery
  if(cart.takeoutChoice === 'delivery'){
    // if address is entered
    if(address === ''){
      store.dispatch(setWarning("Please make sure the delivery address information is filled out. "));
      return;
    }

    // if subtotal exceeds $15 
    if(cart.cartTotal < 15){
      store.dispatch(setWarning("The minimum for delivery is $15 in subtotal."))
      return;
    }
  }

  store.dispatch(setSteps({ action: "increase" }));
};

export const paymentCanProceed = async () => {
  const { cart } = store.getState();

  store.dispatch(resetErrorAndWarning());

  if(cart.takeoutChoice === 'delivery'){
    if(cart.tip <= 0 && cart.tipChoice !== 'cash'){
      store.dispatch(setWarning("Please select a tip for the driver"));
      return;
    }
  }

  if(cart.payment.choice === ''){
    store.dispatch(setWarning("Please select a payment"));
    return;
  }

  store.dispatch(setSteps({ action: "increase" }));
};

