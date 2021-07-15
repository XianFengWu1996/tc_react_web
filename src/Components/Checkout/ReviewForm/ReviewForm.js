import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { Card, CardContent, Divider, List, ListItem, Typography } from '@material-ui/core'
import { FaCar, FaShoppingBag } from 'react-icons/fa'
import { AiOutlineCreditCard, AiOutlineUser } from 'react-icons/ai'
import './review.css'
import SummaryItem from '../../../Helper/SummaryItem';

class ReviewForm extends Component {

    getPaymentMethod = (payment) => {
        if(payment.choice === 'cash'){
            return 'Cash'
        }

        if(payment.choice === 'card'){
            return 'Card In Store'
        }

        if(payment.choice.includes('cnon') || payment.choice.includes('ccof')){
            return `${payment.details.brand} XX-${payment.details.lastFourDigit}`
        }
    }
    render() {
        const { takeoutChoice, cartItems, discount, cartTotal, tax, tip, delivery, total, comment, payment, cartTotalCount } = this.props.cart;
        const { name, phone } = this.props.customer.customer;
        
        return (
            <div className='review_form'>

            <div>
                <div className='flex_center'>
                    {takeoutChoice === 'pickup' ? <FaShoppingBag size={30}/> : <FaCar size={30} />}
                    <h2 style={{ marginLeft: '25px'}}>{takeoutChoice.toUpperCase()}</h2>
                </div>
                <Typography className='light_text'>Estimate time: {takeoutChoice === 'pickup' ? 15 : 50} Minutes</Typography>
                <Typography className='light_text'>Number of Items: {cartTotalCount}</Typography>
            </div>
             
                <Card className='card'> 
                    <CardContent className='flex_center'>
                        <AiOutlineUser className='c_icon' />
                        <div>
                            <div className='c_title'>Contact</div>
                            <div className='c_content'>Name: {name}</div> 
                            <div className='c_content'>Phone: ({phone.substring(0, 3)})-{phone.substring(3,6)}-{phone.substring(6, 10)}</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className='card'> 
                    <CardContent className='flex_center'>
                        <AiOutlineCreditCard className='c_icon' />
                        <div>
                            <div className='c_title'>Pay With</div>
                            <div className='c_content'>{this.getPaymentMethod(payment)}</div>
                        </div>
                    </CardContent>
                </Card>

                <List className='dish_list'> 
                    <Divider />

                    {
                        cartItems.map((item, i) => {
                        return (
                            <div key={item.foodId}>
                                <ListItem className='dish_list_item' key={item.foodId}> 
                                <div>
                                    <div >{item.foodId}. {item.foodName}</div>
                                    <div>{item.foodNameChinese}</div>
                                </div>

                                <div>
                                    <div>${item.price.toFixed(2)} x {item.count}</div>
                                    <div>Total: ${item.total.toFixed(2)}</div>
                                </div>
                                {item.comment ?<Typography variant='caption'>Special Instruction: {item.comment}</Typography> : null}
                            </ListItem> 
                            { i+1 === cartItems.length ? null : <Divider variant='middle'/>  }
                            </div>  
                        )
                        })
                    }
                        <Divider />
                </List>


                {comment ? 
                    <div>
                        <Divider />
                        <Typography>Comments: {comment}</Typography> 
                        <Divider />
                    </div>
                : null}
                <div className='summary'>
                    <SummaryItem title='Subtotal' data={cartTotal} />
                    <SummaryItem title='Discount' data={discount} discount/>
                    <SummaryItem title='Tax' data={tax} />
                    <SummaryItem title='Tip' data={tip} />
                    {takeoutChoice === 'delivery' ? <SummaryItem title='Delivery' data={delivery} /> : null }
                    <SummaryItem title='Total' data={total} bold/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    cart: state.cart,
    customer: state.customer,
})

export default connect(mapStateToProps, null)(withRouter(ReviewForm));