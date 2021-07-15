import { Typography } from '@material-ui/core';
import React from 'react';

const SummaryItem = (props) => {
    const { title, data, bold, discount } = props;
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <Typography className={ bold ? 'bold_text' :'light_text'}>{title}: </Typography>
        {
            discount ? 
                <Typography className={ bold ? 'bold_text' :'light_text'}>
                    (${data ? data.toFixed(2) : '0.00'})
                </Typography>
                : <Typography className={ bold ? 'bold_text' :'light_text'}>
                     ${data ? data.toFixed(2) : '0.00'}
                </Typography>
        }
       
    </div>
    );
};

export default SummaryItem;