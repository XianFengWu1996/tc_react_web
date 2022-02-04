import randomstring from 'randomstring';

const initState = {
  order_id: randomstring.generate(18),
  cartItems: [],
  cartTotal: 0,
  calculatedSubtotal: 0,
  cartTotalCount: 0,
  tax: 0,
  tip: 0,
  delivery: 0,
  total: 0,
  lunchCount: 0,
  lunchDiscount: 0,
  discount: 0,
  comment: '',

  allowLunchDiscount: false,
  storeIsOpen:false,
  cartOpen: false,
  saveCard: false,

  takeoutChoice: "pickup",
  tipChoice: '',
  payment:{
    choice:'',
    details:{},
  },

  checkoutWarning: '',
  checkoutError: '',
  homepageWarning: '',

  currentStep: 0,
};

const cartReducer = (state = initState, action) => {
  switch (action.type) {

    // ==============================
    //     CART FUNCTIONALITY 
    // ==============================
    //Adding the item from the menu to the cart
    case "add_cart":
      //check if the cart is empty or not
      if (state.cartItems.length < 1) {
        // if the cart is empty, add the item to the cart
        return {
          ...state,
          lunchCount:  state.lunchCount + (action.item.lunch ? action.item.count : 0),
          cartItems: [...state.cartItems, action.item],
          cartTotal: Math.round((state.cartTotal + action.item.total) * 100) / 100,
          cartTotalCount: state.cartTotalCount + action.item.count,
        };
      } else {
        for (let item of state.cartItems) {
          if (item.foodId === action.item.foodId) {
            return {
              ...state,
              cartItems: state.cartItems.map((item) =>
                item.foodId === action.item.foodId
                  ? {
                      ...action.item,
                      count: item.count + action.item.count,
                      total: Math.round(((item.total + action.item.total)) * 100) / 100,
                    }
                  : item
              ),
              lunchCount:  state.lunchCount + (action.item.lunch ? action.item.count : 0),
              cartTotal: Math.round((state.cartTotal + action.item.total) * 100) / 100,
              cartTotalCount: state.cartTotalCount + action.item.count,
            };
          }
        }
      }

      // if none of the item has the same id, it will exit the loop and add the item to the array of cartItem
      return {
        ...state,
        lunchCount:  state.lunchCount + (action.item.lunch ? action.item.count : 0),
        cartItems: [...state.cartItems, action.item],
        cartTotal:
          Math.round(
            (state.cartTotal + action.item.total) * 100
          ) / 100,
        cartTotalCount: state.cartTotalCount + action.item.count,
      };

    // update cart 
    case "update_cart":
      return {
        ...state,
        cartItems: state.cartItems.map((item) =>
          item.foodId === action.item.foodId
            ? {
                ...action.item,
                count: action.item.count,
                total: action.item.total,
              }
            : item
        ),
        lunchCount: state.lunchCount + (action.item.lunch ? action.item.countDiff : 0),
        cartTotal:Math.round((state.cartTotal + action.item.countDiff * action.item.price + Number.EPSILON) * 100) / 100,
        cartTotalCount: state.cartTotalCount + action.item.countDiff,
      };

    // Remove the item from the array and recalculate the price
    case "remove_item":
      return {
        ...state,
        lunchCount: state.lunchCount - (action.item.lunch ? action.item.count : 0),
        cartTotalCount: state.cartTotalCount - action.item.count,
        cartItems: state.cartItems.filter((item) => item.foodId !== action.item.foodId),
        cartTotal: Math.round((state.cartTotal - action.item.total) * 100) / 100,
      };

    // calculate the cart total including tax
    case "calculate_total":            
      let calcLunchDiscount = state.allowLunchDiscount ? Math.floor(state.lunchCount / 3) * 2.90 : 0;
      let calcSubtotal = Math.round((state.cartTotal - calcLunchDiscount - state.discount) * 100) / 100;
      let calcTax = Math.round((calcSubtotal * 0.07) * 100) / 100;

      return {
        ...state,
        lunchDiscount: calcLunchDiscount,
        calculatedSubtotal: calcSubtotal,
        tax: calcTax,
        total:
          Math.round(
            (calcSubtotal + calcTax +
              (state.takeoutChoice === "delivery" ? state.delivery : 0) + state.tip +Number.EPSILON) *100
          ) / 100,
      };

    case "calculate_discount": 
    return {
      ...state, 
      discount: Math.round(((action.point / 100)) * 100) / 100
    }
      

    // ==============================
    //          CHECKOUT  
    // ==============================

    // set takeout choice
    case "set_takeout_choice":
      return {
        ...state,
        takeoutChoice: action.option,
      };

    // setting the delivery fee
    case "set_delivery_fee":
      return {
        ...state,
        delivery: action.deliveryFee,
      };

    case "set_comment":
      return {
        ...state,
        comment: action.comment,
      };

    case "set_tip":

      if(action.tip.choice === '10' || action.tip.choice === '15' || action.tip.choice === '20'){
        return {
          ...state,
          tip: Math.round(((action.tip.amount * state.cartTotal)) * 100) / 100,
          tipChoice: action.tip.choice
        };
      }

      if(action.tip.choice === 'cash'){
        return {
          ...state,
          tip: 0,
          tipChoice: action.tip.choice
        };
      }
      // if the choice is custom, set the custom value as tip
      if(action.tip.choice === 'custom'){
        return {
          ...state,
          tip: Math.abs(Math.round((Number(action.tip.amount)) * 100) / 100),
          tipChoice: action.tip.choice
        };
      } 
      break;

    case "set_payment": 
      return {
        ...state,
        payment: {
          choice: action.payment.choice,
          details: action.payment.details
        }

    }

    // ==============================
    //            CART 
    // ==============================
    // open shopping cart
    case "open_cart":
      return {
        ...state,
        cartOpen: true,
      };

    // close shopping cart
    case "close_cart":
      return {
        ...state,
        cartOpen: false,
      };

          // Clear the cart
    case "clear_cart":
      return {
        ...state,
        cartItems: [],
        cartTotal: 0,
        calculatedSubtotal: 0,
        cartTotalCount: 0,
        lunchCount: 0,
        lunchDiscount: 0,
        tip: 0,
        tipChoice: '',
        tax: 0,
        total: 0,
        discount: 0,
        payment: {
          choice: '',
          details: {}
        },
      };


  // clear certain value when logging out
  case "cart_logout":
    return {
      ...state,
      tip: 0,
      delivery: 0,
      takeoutChoice: "pickup",
      allowLunchDiscount: false,
      cartOpen: false,
      tipChoice: '',
      payment: {
        choice: '',
        details:{}
      },
      checkoutWarning: '',
      checkoutError: '',
      saveCard: false,
      currentStep: 0,   
      discount: 0,     
    };

    // clear certain value when logging out
  case "complete_order":
    return {
      ...state,
      order_id: randomstring.generate(18),
      cartItems: [],
      cartTotal: 0,
      calculatedSubtotal: 0,
      cartTotalCount: 0,
      tax: 0,
      tip: 0,
      delivery: 0,
      total: 0,
      lunchCount: 0,
      lunchDiscount: 0,
      discount: 0,
      comment: '',
      saveCard: false,
      takeoutChoice: "pickup",
      tipChoice: '',
      payment:{
        choice:'',
        details:{},
      },
      checkoutWarning: '',
      checkoutError: '',
      homepageWarning: '',
    
      currentStep: 0,
    };

    case 'reset_checkout':
      return {
        ...state,
        order_id: randomstring.generate(18),
        tip: 0,
        delivery: 0,
        cartOpen: false,
        saveCard: false, 
        takeoutChoice: "pickup",
        tipChoice: '',
        payment:{
          choice:'',
          details:{},
        },
        currentStep: 0,
      }

    // ==============================
    //            Warning
    // ==============================
    case 'set_warning': 
      window.scrollTo(0, 0);
      return {
        ...state, 
        checkoutWarning: action.warning
      }

    case 'set_home_warning': 
    window.scrollTo(0, 0);
    return {
      ...state, 
      homepageWarning: action.warning
    }

    case 'set_error': 
      window.scrollTo(0, 0);
      return {
        ...state,
        checkoutError: action.error
      }
      
    case 'reset_message': 
      return {
        ...state,
        checkoutError: '',
        checkoutWarning: '',
        homepageWarning: '',
      }

    // ==============================
    //         Set Value
    // ==============================

    case 'save_card':
      return {
        ...state, 
        saveCard: !state.saveCard,
    }
      
      // determine page the checkout should be on 
      case 'change_step':
        switch(action.payload.action){
          case 'increase':
            return {
              ...state,
              currentStep: state.currentStep + 1
            }
          case 'decrease':
            return {
              ...state,
              currentStep: state.currentStep - 1
            }
          case 'reset':
            return {
              ...state,
              currentStep: 0
            }
          default: 
            return {...state};
      }
      
    case 'get_server_status': 
      return {
        ...state,
        allowLunchDiscount: action.status.allowLunchDiscount,
        storeIsOpen: action.status.storeIsOpen
      }

    // resets default payment method and save card after dialog close
    case 'reset_payment':
      return {
        ...state,
        saveCard: false,
      }
    
    case 'reset_cart':
      return {
        ...initState
      }

    default:
      return state;
  }
};

export default cartReducer;
