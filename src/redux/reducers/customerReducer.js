const initState = {
  address: {
    address: '',
    apt: '',
    business: '',
    deliveryFee: 0,
    zipcode: ''
    },
  billing: {
      customerId: '',
      cards: []
  },
  customer: {
      name: '',
      phone: '',
      verifiedNumbers: []
  },
  orders: []
};

const customerReducer = (state = initState, action) => {

    switch(action.type){
        case 'get_customer_data':
            let address = action.data.customerInfo.address;
            let billing = action.data.customerInfo.billing;
            let customer = action.data.customerInfo.customer;

            return {
                ...state,
                address: {
                    address: address.address ? address.address : '',
                    apt: address.apt ? address.apt : '',
                    business: address.business ? address.business : '',
                    deliveryFee: address.deliveryFee ? address.deliveryFee : 0,
                    zipcode: address.zipcode ? address.zipcode : '',
                },
                billing: {
                    customerId: billing.customerId ? billing.customerId : '',
                    cards: billing.cards ? billing.cards : []
                },
                customer: {
                    name: customer.name ? customer.name : '',
                    phone: customer.phone ? customer.phone : '',
                    verifiedNumbers: customer.verifiedNumbers ? customer.verifiedNumbers : []
                },
                orders: [...action.data.order]
            };

        case 'save_customer_info': 
            return {
                ...state,
                customer: {
                    ...action.info
                }
            }
        case 'save_customer_delivery': 
            return {
                ...state,
                address: {
                    ...action.deliveryInfo
                }
            }
        case 'save_billing_info': 
            return {
                ...state,
                billing: {
                    ...action.billingInfo
                }
            }
           
        case 'update_card': 
            return {
                ...state,
                billing: {
                    ...state.billing,
                    cards: action.cards
                }
            }

        case 'update_customer_id': 
            return {
                ...state,
                billing: {
                    ...state.billing,
                    customerId: action.customerId,
                }
            }   

        case 'add_order': 
            return{
                ...state,
                orders: [
                    action.order,
                    ...state.orders
                ]
            }
        case 'customer_logout': 
            return {
                ...initState
            }
        default: 
            return state;
    }
}

export default customerReducer;