import { makeStyles, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import React from 'react';
import { store } from '../../store';
import { FiPlus, FiMinus } from 'react-icons/fi'
import moment from 'moment';
import ScreenSize from '../../Helper/ScreenSize';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

const Reward = () => {
    const { reward } = store.getState();
    const classes = useStyles();
    const { extraSmallScreen } = ScreenSize();

    return (
        <div style={{ margin: '20px'}}>
            <div style={{ margin: '20px 0'}}>
            <Typography>Available Points: {reward.point}</Typography>
            <Typography>Estimate: {reward.point} ≈ ${reward.point/100}</Typography>
            </div>
            <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          {
              extraSmallScreen ? null :  <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell align="left">Date</TableCell>
                <TableCell align="left">Order #</TableCell>
                <TableCell align="left">Amount</TableCell>
              </TableRow>
            </TableHead>
          }
          <TableBody>
            {reward.pointDetails.map((row) => (
              <TableRow key={`${row.orderId}${row.action}`} style={{ display: 'flex', flexDirection: 'column', backgroundColor: row.action === 'add' ? '#bedebe9e' : '#ffd5d5b8'}}>
                {
                    extraSmallScreen ? <>
                        <TableCell component="th" >
                        {row.action === 'add' ? <FiPlus size={extraSmallScreen ? 20 : 30}/>: <FiMinus size={extraSmallScreen ? 20 : 30}/>}
                        <span>&nbsp;&nbsp;&nbsp;</span>{row.orderId}
                        </TableCell>
                        <TableCell align="left" size='small'>{moment(row.createdAt).format('MMM DD,YYYY HH:mm')} <span>&nbsp;&nbsp;&nbsp;</span> Points:{row.amount}</TableCell>
                        </>
                     : <>
                        <TableCell component="th" scope="row">
                        {row.action === 'add' ? <FiPlus size={30}/>: <FiMinus size={30}/>}
                        </TableCell>
                        <TableCell align="left">{moment(row.createdAt).format('MMM DD,YYYY HH:mm')}</TableCell>
                        <TableCell align="left">{row.orderId}</TableCell>
                        <TableCell align="left">{row.amount}</TableCell>
                    </>
                }
                
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
        </div>
    );
};

export default Reward;