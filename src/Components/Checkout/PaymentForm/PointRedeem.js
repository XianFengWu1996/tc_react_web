import React from 'react';
import { connect } from 'react-redux';
import { TextField, Typography, makeStyles, Button } from '@material-ui/core';
import { applyRewardPt } from '../../../redux/actions/reward';
import { calculateTotal, calculateDiscount } from '../../../redux/actions/cart';
import * as COLORS from '../../../Misc/colors'

const useStyle = makeStyles((theme) => ({
    layout: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
        margin: '25px 0 15px 0'
    },
    text: {
        [theme.breakpoints.down('sm')]: {
            fontSize: '0.70rem',
            fontWeight: 700
        },
    }
}))

const PointRedeem = (props) => {
    const classes = useStyle();
    const [ptApplied, setPtApplied] = React.useState('');
    const [error, setError] = React.useState('');

    const handleOnChange = (e) => {
        setPtApplied(e.target.value ? e.target.value : 0);
        setError('');
    }

    const handleOnClick = () => {
        
        let points = Math.abs(Math.round(ptApplied));
        // // check if the point applied is greater than what the users has
        if(points > props.reward.point){
            setError('Not enough points')
            return;
        }

        // // allow the user to applied only 50% of the order total
        let limit = ((props.cart.cartTotal - props.cart.lunchDiscount) * 0.5) * 100;
        if(points  >= limit){
            props.applyPoint(parseInt(limit));
            props.calculateDiscount(parseInt(limit));
            props.calculateTotal();
            return;
        }
       
        // // if the other option does not apply, then just apply the point
        props.applyPoint(parseInt(points));
        props.calculateDiscount(parseInt(points));
        props.calculateTotal();
    }
    
    return (
        <div className={classes.layout}>
            <Typography variant="button" className={classes.text}>Point Redemption (cover up to 50% of the order)</Typography>
            <div>
            <TextField 
                type="number"
                variant="outlined" 
                size='small' 
                label={`Available Points: ${props.reward.point}`}
                value={ptApplied}
                onChange={handleOnChange}
            />
            <Button 
                onClick={handleOnClick}
                variant="contained"
                style={{ backgroundColor: COLORS.BUTTON_RED, color: 'white' }}
                
            >Apply</Button>
            </div>
            
        {props.reward.pointApply > 0 ? <Typography variant="button">Point Left: {props.reward.point - props.reward.pointApply}</Typography> : <div></div>}
        {error !== '' ? <Typography color="error">{error}</Typography> : <div></div>}
        </div>
    );
};

const mapStateToProps = (state) => ({
    reward: state.reward,
    cart: state.cart,
})

const mapDispatchToProps = (dispatch) => ({
    applyPoint: (point) => dispatch(applyRewardPt(point)),
    calculateTotal: () => dispatch(calculateTotal()),
    calculateDiscount: (point) => dispatch(calculateDiscount(point)),
})

export default connect(mapStateToProps, mapDispatchToProps)(PointRedeem);