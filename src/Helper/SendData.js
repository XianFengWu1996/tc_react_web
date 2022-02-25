import firebase from "../config/fbConfig";
import { store } from "../store/index";
import Axios from 'axios'
import { saveCustomerInfo,  saveDeliveryInfo, updateCard } from "../redux/actions/customer";
import { calculateTotal, setDelivery } from "../redux/actions/cart";
import { placeOrderUrl, removeCardUrl } from '../Misc/url'


// CONTACT 
export const sendContactInfo = async (info) => {
  const { auth } = store.getState();
  let {name, phone, verified, closeDialog} = info;

  try {
    await firebase.firestore().collection(`${process.env.NODE_ENV === 'development' ? 'usersTest' : 'users'}/${auth.userId}/customer`)
    .doc("details").update({
      customer: {
        name: name,
        phone: phone,
        verifiedNumbers: verified,
      },
    })

    store.dispatch(
      saveCustomerInfo({
        name: name,
        phone: phone,
        verifiedNumbers: verified,
      })
    );
    closeDialog();
    return { success: 'Sucessfully update informaton'}
  } catch (error) {
    console.log(error);
    return { error: error.message ? error.message : 'Failed to update contract information.'}
  }
};

// DELIVERY
export const updateAddress = async (details) => {
  const { auth } = store.getState();
  const { address, deliveryFee, handleClose } = details;

  try {
    // update the new data to the database
    firebase.firestore().collection(`${process.env.NODE_ENV === 'development' ? 'usersTest' : 'users'}/${auth.userId}/customer`)
    .doc("details")
    .update({
      address: {
        address: address.address,
        zipcode: address.zipcode,
        apt: address.apt,
        business: address.buildingName,
        deliveryFee: deliveryFee,
      },
    })

    // if no error occurred, then update the store as well
    store.dispatch(saveDeliveryInfo({
      address: address.address,
      zipcode: address.zipcode,
      apt: address.apt,
      business: address.buildingName,
      deliveryFee: deliveryFee,
    }));

    // this is for cart
    store.dispatch(setDelivery(deliveryFee))
    store.dispatch(calculateTotal())

    // close the dialog
    handleClose();
    return {};
  } catch (error) {
    // if an error occurred, return the error object
    return { error: 'Failed to update address, try again later'};
  }
}

export const sendOrder = async (handleComplete, handleError) => {
  try {
    const { auth, customer: customerInfo, cart, reward } = store.getState();
    const { customer, address, billing } = customerInfo;


    await Axios.post(placeOrderUrl, {
      idKey: cart.order_id,
      order: {
        items: cart.cartItems,
        subtotal: cart.calculatedSubtotal,
        tax: cart.tax,
        tip: cart.tip,
        delivery: cart.delivery,
        total: cart.total,
        totalItemCount: cart.cartTotalCount,
        discount: cart.discount,
        lunchDiscount: cart.lunchDiscount,
        isDelivery: cart.takeoutChoice === 'delivery',
        pointEarned: Math.round(cart.calculatedSubtotal * (cart.payment.choice === 'cash' ? auth.cashReward : auth.cardReward)),
        pointUsed: (cart.discount * 100),
        comment: cart.comment,
        address: cart.takeoutChoice === 'delivery' ? {
          address: address.address,
          apt: address.apt,
          business: address.business,
          zipcode: address.zipCode,
        } : {},
      },
      contact:{
        name: customer.name,
        phone: customer.phone,
        email: auth.email,
        userId: auth.userId,
      },
      // type includes 'cash', 'card', and 'cofIds'
      payment:{
        type: cart.payment.choice.includes('ccof') || cart.payment.choice.includes('cnon') ? 'Prepaid' : cart.payment.choice,
        customerId: billing.customerId,
        card: Object.keys(cart.payment.details).length === 0 && cart.payment.details.constructor === Object
        ? {} : {
          cofId: cart.payment.details.cofId,
          brand: cart.payment.details.brand,
          month: cart.payment.details.month,
          year: cart.payment.details.year,
          lastFourDigit: cart.payment.details.lastFourDigit,
        },
      },
      rewards:{
        point: reward.point,
        details: reward.pointDetails
      },


      env: process.env.NODE_ENV
    }, { headers: { 
      "Authorization": auth.requestKey, 
    }}).then((value) => {
      console.log(value.data)
      handleComplete(value.data);
    }).catch((e) => {
      console.log(e);
      handleError(e.response.data.error ? e.response.data.error : 'Failed to send order, try again later..');
    })
  } catch (error) {
    handleError(error.message ? error.message : 'Failed to send order, try again later..')
  }
}

// dispatch to update the card to be use
export const updateCreditCardInStore = (card) =>{
  const { customer } = store.getState();
  let tempCard = customer.billing.cards;
  tempCard.unshift(card);
  store.dispatch(updateCard(tempCard));
}

// remove card from the store and database
export const handleDeleteCard = async (card, handleComplete, handleError) => {
  const { auth, customer } = store.getState();
  // the card object pass in should contain the brand, cofid, and the last four digit
  const { cards, customerId } = customer.billing;
  // the cards array will contain all the cards

  try {
  // filter will return all the result that is true,
  // in this case, all the result which the cofId does not match the one thats being deleted
  await Axios.post(removeCardUrl, {
      card,
      cards,
      customerId,
      userId: auth.userId,
      env: process.env.NODE_ENV
    }, { headers: { "Authorization": auth.requestKey }}).then((value) => {
      handleComplete();

      store.dispatch(updateCard(value.data.result));
    }).catch((error) => {
      handleError(error.response.data.error);
    })
  } catch (error) {
    handleError(error.message ? error.message : 'Opps, unable to delete card, try again later...')
  }  
}