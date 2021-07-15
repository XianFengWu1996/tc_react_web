export const getCustomerInfo = (data) => ({
    type: 'get_customer_data',
    data
})

export const saveCustomerInfo = (info) => ({
    type: 'save_customer_info',
    info
})

export const saveDeliveryInfo = (deliveryInfo) => ({
    type: 'save_customer_delivery',
    deliveryInfo
})

export const saveBillingInfo = (billingInfo) => ({
    type: 'save_billing_info',
    billingInfo
})

export const updateCustomerId = (customerId) => ({
    type: 'update_customer_id',
    customerId
})

export const updateCard = (cards) => ({
    type: 'update_card',
    cards
})

export const addOrder = (order) => ({
    type: 'add_order',
    order
})

export const customerLogout = () => ({
    type: 'customer_logout'
})
