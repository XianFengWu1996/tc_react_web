// https://fa022e423c58.ngrok.io/foodorder-43af7/us-central1/app
// https://us-central1-foodorder-43af7.cloudfunctions.net/app

const baseUrl = 'https://us-central1-foodorder-43af7.cloudfunctions.net/app'

// const baseUrl = 'http://localhost:5001/foodorder-43af7/us-central1/app'

export const placeOrderUrl = `${baseUrl}/order/place_order`;

export const calculateDeliveryUrl = `${baseUrl}/delivery/calculate_delivery`;

export const removeCardUrl = `${baseUrl}/payment/remove_card`;

export const sendCodeUrl = `${baseUrl}/auth/send_code`;

export const signInUrl = `${baseUrl}/auth/signin`;

export const getMenuUrl = `${baseUrl}/menu/get`;

export const createCustomerUrl = `${baseUrl}/payment/create_customer`;

export const registerCardUrl = `${baseUrl}/payment/register_card`;

export const getReportUrl = `${baseUrl}/auth/get_report`

export const getOldReportUrl = `${baseUrl}/auth/get_report_old`





