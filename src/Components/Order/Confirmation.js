import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { withRouter } from 'react-router';
import './order.css'

const Confirmation = (props) => {
    const { order } = props.location.state.order;
    return (
        <div className='container'>
            <FaCheckCircle size={100} color='green'/> 

            <Typography className='main_text'>
                Thank you for ordering with us today.
            </Typography>

            <Typography className='sub_text'>Order Confirmation: {order.orderId}</Typography>


            <Typography className='sub_text'>
                You will receive a confirmation email with order detail.
            </Typography>

            <Button className='view_order_btn' onClick={() => {
                props.history.push('/order')
            }}

            >View Order</Button>

            <Button onClick={() => {        
                props.history.push('/')
            }}>Back to Home</Button>
        </div>
    );
};

export default withRouter(Confirmation);