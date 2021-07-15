import React from 'react';
import { connect} from 'react-redux'
import { AppBar, Button, Dialog, Divider, IconButton, List, ListItem, ListItemText, makeStyles, Paper, Toolbar, Typography } from '@material-ui/core'
import moment from 'moment'
import {Close , Check } from '@material-ui/icons';
import { TransitionDown } from '../../Helper/Animation'
import screenSize from '../../Helper/ScreenSize'
import * as COLORS from '../../Misc/colors'
import SummaryItem from '../../Helper/SummaryItem'
import '../Checkout/ReviewForm/review.css'


const useStyles = makeStyles((theme) => ({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
    // handle order dialog container
    container: {
      padding: '2rem 4rem',
      [theme.breakpoints.down("md")]: {
        padding: '2rem 3rem',
      },
      [theme.breakpoints.down("sm")]: {
        padding: '1.5rem 2rem',
      },
      [theme.breakpoints.down("xs")]: {
        padding: '1.2rem 1rem',
      },
    },
    dialogText: {
      letterSpacing: '0.03rem',
      fontWeight: '200',
      fontSize: '1.2rem',

      [theme.breakpoints.down("md")]: {
        fontSize: '1.1rem',
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: '1rem',
        fontWeight: '600'
      },
    },
    // handle the margin for the order container
    order: {
      margin: '2rem 10rem',

      [theme.breakpoints.down("lg")]: {
        margin: '2rem 7rem',
      },
      [theme.breakpoints.down("md")]: {
        margin: '2rem 4rem',
      },
      [theme.breakpoints.down("sm")]: {
        margin: '2rem 1rem',
      },
      [theme.breakpoints.down("xs")]: {
        margin: '2rem 0.5rem',
      },
    },
    // handle the order title
    orderTitle: {
      fontSize: "2.5rem",
      marginBottom: '1rem',
      fontWeight: '700',

      [theme.breakpoints.down("lg")]: {
        fontSize: "2.1rem",
      },
      [theme.breakpoints.down("md")]: {
        fontSize: "1.7rem",
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "1.3rem",
      },
    },
    // hand the the individual order item
    orderItem: {
      padding: '2rem 3rem',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',

      [theme.breakpoints.down("md")]: {
        padding: '1.7rem 2rem',
      },

      [theme.breakpoints.down("sm")]: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1.5rem',
      },
      [theme.breakpoints.down("xs")]: {
        padding: '1.2rem 1.2rem',
      },
    },
    // handle the text inside the order item
    orderItemText: {
      fontSize: '1.6rem',
      fontWeight: '500',

      [theme.breakpoints.down("lg")]: {
        fontSize: '1.4rem',
      },
      [theme.breakpoints.down("md")]: {
        fontSize: '1.2rem',
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: '1rem',
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: '0.9rem',
        fontWeight: '600'
      }
    },
    orderButton: {
      fontSize: '1.4rem',

      [theme.breakpoints.down("lg")]: {
        fontSize: '1.2rem',
      },
      [theme.breakpoints.down("md")]: {
        fontSize: '1rem',
        marginTop: '0.5rem',
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: '0.8rem',
      },
      
    }
  }));

const Order = (props) => {
    const classes = useStyles();
    const { smallScreen, mediumScreen } = screenSize();

    let initState = {
      contact: {
        email:"",
        name:"",
        phone:"",
        userId:"",
      },
      square:{
        brand: '',
        lastFourDigit: ''
      },
      orderStatus:{
        refundAmount:0,
        cancel:false,
        refund:false,
      },
      order:{
        subtotal: 0,
        items: [],
        delivery:0,
        pointUsed:0,
        total: 0,
        totalItemCount: 0,
        discount:0,
        tip:0,
        tax:0,
        type:"",
        pointEarned:0,
        lunchDiscount:0,
        isDelivery:false,
        createdAt:0,
        orderId:"",
        address: {
          address: '',
          zipcode: '',
          apt: '',
          business: '',
        },
        comment:"",
      }
    }
    const [open, setOpen] = React.useState(false);
    const [orderInfo, setOrder] = React.useState(initState);

    const handleClickOpen = (temp_order) => {
        setOrder({...temp_order});
        setOpen(true);
    };

    const handleClose = () => {
        setOrder(initState)
        setOpen(false);
    };


    return (
      <div className={classes.order}>
        <Typography variant="h3" className={classes.orderTitle}>Order History</Typography>

            { 
                !Array.isArray(props.customer.orders) || !props.customer.orders.length ? 
                <Typography>No order, try order something first...</Typography>
                :
                props.customer.orders.map((orderInfo) => {
                  const { order} = orderInfo;
                  return (
                    <Paper variant="outlined" className={classes.orderItem} key={order.orderId}>
                      <div>
                        <Typography className={classes.orderItemText}> {moment(order.createdAt).format(mediumScreen ? "MMM D, YYYY" : "MM/DD/YYYY")}</Typography>
                        <Typography className={classes.orderItemText}>Order #: {order.orderId}</Typography>
                        <Typography className={classes.orderItemText}> Total: ${(order.total).toFixed(2)}</Typography>
                      </div>
                      <Button onClick={ () => {
                        handleClickOpen(orderInfo)
                      }} variant="outlined"
                      className={classes.orderButton}>
                        View Details
                      </Button>
                    </Paper>
                )
                })
            }


      <Dialog 
        fullScreen={smallScreen} 
        open={open} 
        onClose={handleClose} 
        TransitionComponent={TransitionDown}
        PaperProps={{
          style: smallScreen ? {
            minWidth: '250px'
          } : {
            minWidth: '750px',
          },
        }}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Order details
            </Typography>
          </Toolbar>
        </AppBar>

            <List className={classes.container}>
            <Typography variant="h5" color="secondary">{orderInfo.order.type.toUpperCase()}</Typography>
            <Typography variant="h3">{orderInfo.order.isDelivery ? 'Delivery' : 'Pickup'}</Typography>

            {
              orderInfo.order.delivery ? 
              ( 
                <div>
                  <Typography variant="h6">{orderInfo.order.address.address.replace('USA', orderInfo.order.address.zipcode)}</Typography> 
                  {orderInfo.order.address.apt ? <Typography variant="h6">Apt:{orderInfo.order.address.apt}</Typography> : null}
                  {orderInfo.order.address.business ? <Typography variant="h6">Apt:{orderInfo.order.address.business}</Typography> : null}
                </div>
              )
            : null}
            <Typography style={{ color: COLORS.SUCESSDARK}} className={classes.dialogText}>Point Earned: {orderInfo.order.pointEarned}</Typography>
            <Divider />

            <Typography className={classes.dialogText}>Order #: {orderInfo.order.orderId}</Typography>
            <Typography className={classes.dialogText}>Date: {moment(orderInfo.order.createdAt).format('MMM DD,YYYY HH:mm')}</Typography>
            <Typography className={classes.dialogText}>Name: {orderInfo.contact.name}</Typography>
            <Typography className={classes.dialogText}>Phone: ({orderInfo.contact.phone.substring(0, 3)})-{orderInfo.contact.phone.substring(3,6)}-{orderInfo.contact.phone.substring(6, 10)}</Typography>
            <Divider />
            <List>
                    {
                        orderInfo.order.items.map((item) => (
                            <ListItem key={item.foodId} style={{ display: 'flex', flexDirection: 'row', alignItems: 'start', justifyContent: 'space-between'}}>
                                <ListItemText classes={{ primary: classes.dialogText}}>X{item.count}</ListItemText>
                                <ListItemText classes={{ primary: classes.dialogText}}>{item.foodId}.{item.foodName} {item.foodNameChinese}</ListItemText>
                                <ListItemText classes={{ primary: classes.dialogText}}>${item.total.toFixed(2)}</ListItemText>
                               {item.comment ?  <Typography variant="caption">Special Instruction: {item.comment}</Typography> : null}
                            </ListItem>
                        ))
                    }
                    {
                        orderInfo.order.lunchDiscount ? <ListItemText classes={{ primary: classes.dialogText}} style={{ color: '#4BB543'}}><Check /> Lunch Discount Applied: (${orderInfo.order.lunchDiscount.toFixed(2)})</ListItemText> : null
                    }
              </List>
            <Divider />
              { orderInfo.order.comment ? <div>
                <Typography>Comment: {orderInfo.order.comment}</Typography>
                <Divider />
              </div> : null}

              <div className='summary' style={{ width: '100%'}}>
                    <SummaryItem title='Subtotal' data={orderInfo.order.subtotal} />
                    <SummaryItem title='Discount' data={orderInfo.order.discount} discount/>
                    <SummaryItem title='Tax' data={orderInfo.order.tax} />
                    <SummaryItem title='Tip' data={orderInfo.order.tip} />
                    {orderInfo.order.isDelivery === 'delivery' ? <SummaryItem title='Delivery' data={orderInfo.order.delivery} /> : null }
                    <SummaryItem title='Total' data={orderInfo.order.total} bold/>
              </div>
            </List>             
      </Dialog>
    </div>
    );
};

const mapStateToProps = (state) => ({
    customer: state.customer
})

export default connect(mapStateToProps, null)(Order);