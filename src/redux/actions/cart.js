
export const addToCart = (item) => ({
    type: 'add_cart',
    item
})

export const updateCart = (item) => ({
    type: 'update_cart',
    item
})

export const removeItem = (item) => ({
    type: 'remove_item',
    item
})

export const getServerStatus = (status) => ({
    type: 'get_server_status',
    status
})

export const calculateDiscount = (point) => ({
    type: 'calculate_discount',
    point
})

export const clearCart = () => ({
    type: 'clear_cart',
})

export const completeOrder = () => ({
    type: 'complete_order'
})

export const openCart = () => ({
    type: 'open_cart'
})

export const closeCart = () => ({
    type: 'close_cart'
})

export const calculateTotal = () => ({
    type: 'calculate_total'
})

export const setTakeoutChoice = (option) => ({
    type: 'set_takeout_choice',
    option
})

export const setDelivery = (deliveryFee) => ({
    type: 'set_delivery_fee',
    deliveryFee
})

export const setComment = (comment) => ({
    type: 'set_comment',
    comment
})

export const setTip = (tip) => ({
    type: 'set_tip',
    tip
})

export const setPayment = (payment) => ({
    type: 'set_payment',
    payment
})

export const setSteps = (step) => ({
    type: 'change_step',
    payload: step
})

export const saveCard = () => ({
    type: 'save_card',
})

export const resetPayment = () => ({
    type: 'reset_payment'
})

export const setWarning = (warning) => ({
    type: 'set_warning',
    warning
})

export const setError= (error) => ({
    type: 'set_error',
    error
})

export const setHomeWarning= (warning) => ({
    type: 'set_home_warning',
    warning
})

export const resetErrorAndWarning = () => ({
    type: 'reset_message'
})

export const resetCart = () => ({
    type: 'reset_cart'
})

export const resetCheckout = () => ({
    type: 'reset_checkout'
})

export const cartLogout = () => ({
    type: 'cart_logout'
})
