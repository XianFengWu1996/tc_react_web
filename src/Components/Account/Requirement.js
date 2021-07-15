import { makeStyles, Typography } from '@material-ui/core';
import { FaCheck, FaTimes } from 'react-icons/fa'
import React from 'react';

const useStyle = makeStyles({
    container: {
        display: 'flex'
    },
    incorrect:{
        color: 'red',
        marginRight: '5px',
        fontSize: '1rem'
    },
    correct:{
        color: 'green',
        marginRight: '5px',
        fontSize: '1rem'
    }
})

const Requirement = (props) => {

    const classes = useStyle();
    const { checked, lowercase, uppercase, numeric, symbol, qualifyLength } = props.status;


    const checkStatus = () => {
        if(checked){
            return <div>
                <div className={classes.container}>
                    {qualifyLength ? <FaCheck className={classes.correct}/> :<FaTimes className={classes.incorrect}/>}
                    <Typography variant='subtitle2'>Password should be at least 8 characters</Typography>
                </div>

                <div className={classes.container}>
                    {uppercase ? <FaCheck className={classes.correct}/> :<FaTimes className={classes.incorrect}/>}
                    <Typography variant='subtitle2'>Password must contain at least 1 uppercase letter</Typography>
                </div>

                <div className={classes.container}>
                    {lowercase ? <FaCheck className={classes.correct}/> : <FaTimes className={classes.incorrect}/>}
                    <Typography variant='subtitle2'>Password must contain at least 1 lowercase letter</Typography>
                </div>

                <div className={classes.container}>
                     {numeric ? <FaCheck className={classes.correct}/> :<FaTimes className={classes.incorrect}/>}
                    <Typography variant='subtitle2'>Password must contain at least 1 number</Typography>
                </div>

                <div className={classes.container}>
                     {symbol ? <FaCheck className={classes.correct}/> :<FaTimes className={classes.incorrect}/>}
                    <Typography variant='subtitle2'>Password must contain at least 1 of the following symbol:{' ~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'}</Typography>
                </div>


            </div>
        } else{
            return <div>
                <Typography variant='subtitle2'>Password must contain at least 1 uppercase letter</Typography>
                <Typography variant='subtitle2'>Password must contain at least 1 lowercase letter</Typography>
                <Typography variant='subtitle2'>Password must contain at least 1 number</Typography>
                <Typography variant='subtitle2'>Password must contain at least 1 of the following symbol: {' ~`!@#$%^&*()_-+={[}]|\\:;"\'<,>.?/'}</Typography>
            </div>
        }
    }
    return (
        <div>
            {checkStatus()}
            
        </div>
    );
};

export default Requirement;