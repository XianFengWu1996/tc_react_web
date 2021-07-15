import React, { useState } from "react";

import Drawer from "@material-ui/core/Drawer";
import {
  List,
  ListItemIcon,
  Toolbar,
  AppBar,
  IconButton,
  Typography,
  Button,
  Divider,
} from "@material-ui/core";
import {
  RestaurantMenu,
  Menu,
  ShoppingCart,
  HistoryOutlined,
  AccountCircle,
  VerifiedUser
} from "@material-ui/icons";
import { FaTimes } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import * as ROUTES from "../Navigation/routes";
import { authLogout } from "../../redux/actions/auth";
import { rewardLogout } from "../../redux/actions/reward";
import { customerLogout } from "../../redux/actions/customer";
import { openCart, closeCart, cartLogout } from "../../redux/actions/cart";

import Cart from "../Cart/ShoppingCart";
import { FaCoins } from "react-icons/fa";

const useStyles = makeStyles((theme) => ({
  drawer: {
    display:'flex',
    flexDirection: 'column',
    alignItems:'center',
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-start",
  },
  drawerTitle: {
    flex: 1,
    marginLeft: '1rem',
    [theme.breakpoints.down('md')]:{
      marginLeft: '0.3rem',
    },
    [theme.breakpoints.down('sm')]:{
      marginLeft: '0.1rem',
    },
  },
  drawerTitleText: {
    fontSize: '1.6rem',
    [theme.breakpoints.down('md')]:{
      fontSize: '1.3rem',
    },
    [theme.breakpoints.down('sm')]:{
      fontSize: '1rem',
    },
  },
  toolbar: theme.mixins.toolbar,
  appBar: {
    backgroundColor: '#4b5173',
  },
  appTitle: {
    flex: 1,
  },
  showInNav: {
    display: "flex",

    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  showInDrawer: {
    display: "none",

    [theme.breakpoints.down("sm")]: {
      display: "block",
    },
  },
  pointContainer: {
    padding: "1rem 3rem",
    border: "1px solid #000",
    borderRadius: '30px'
  },
  pointTitle: {
    fontSize: '0.6rem',
    marginBottom: '0.3rem'
  },
  points: {
    fontSize: '1.5rem'
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1rem 0'
  },
  linkItem: {
    margin: '0.1rem 0',
    textTransform: 'uppercase',
    padding: '1rem 10rem',

    '&:hover': {
      backgroundColor: '#ddd'
    },
    [theme.breakpoints.down('md')]:{
      padding: '1rem 7rem',
    },
    [theme.breakpoints.down('sm')]:{
      padding: '1rem 3rem',
    },
  }
}));

const Navigation = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    props.authLogout();
    props.cartLogout();
    props.customerLogout();
    props.rewardLogout();
    props.history.push(ROUTES.SIGNIN);
  };

  const unauth_list = [
    {
      title: "Menu",
      icon: <RestaurantMenu />,
      path: ROUTES.HOME,
    },
  ];

  const auth_list = [
    {
      title: "Menu",
      icon: <RestaurantMenu />,
      path: ROUTES.HOME,
    },
    {
      title: "Order History",
      icon: <HistoryOutlined />,
      path: ROUTES.ORDER,
    },
    {
      title: "Account",
      icon: <AccountCircle />,
      path: ROUTES.ACCOUNT,
    },
  ];

  let temp_list = props.auth.userId ? auth_list : unauth_list;
  return (
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
          >
            <Menu />
          </IconButton>

          <div className={classes.drawerTitle}>
            <Typography className={classes.drawerTitleText}>台北风味 Taipei Cuisine </Typography>
          </div>
        
          {/* the shopping cart will not be present at the confirmation page */}
          {props.cart.currentStep === 2 ||
          props.cart.currentStep === 1 ? null : (
            <IconButton
              color="inherit"
              onClick={() => {
                props.cart.cartOpen ? props.closeCart() : props.openCart();
              }}
            >
              <ShoppingCart />
              <span>{props.cart.cartTotalCount}</span>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <div className={classes.toolbar} />

      <Drawer open={open} anchor="top" disableBackdropClick={false} onClose={handleDrawerClose}>
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            <FaTimes />
          </IconButton>
        </div>

        <div className={classes.drawer}>
          {props.auth.userId ? (
            <div className={classes.pointContainer}>
              <Typography className={classes.pointTitle}>Available Points</Typography>
              <div style={{ display: 'flex'}}>
                <FaCoins className={classes.points} style={{ marginRight: '0.3rem'}}/>
                <Typography className={classes.points}>{props.reward.point}</Typography>
              </div>
              
            </div>
          ) : null}

          <List className={classes.linkList}>
            {temp_list.map((item, index) => {
              const { title, icon, path } = item;
              return (
                <div key={index} className={classes.linkItem}>
                  <Link to={path} style={{ textDecoration: 'none', color: 'inherit'}} onClick={handleDrawerClose}>
                    <div style={{ display: 'flex'}}>
                      <ListItemIcon>{icon}</ListItemIcon>
                      <Typography>{title}</Typography>
                    </div>
                  </Link>
                </div>
              );
            })}

            { props.auth.isAdmin ? <div className={classes.linkItem}>
              <Link to={ROUTES.ADMIN} style={{ textDecoration: 'none', color: 'inherit'}} onClick={handleDrawerClose}>
                <div style={{ display: 'flex'}}>
                  <ListItemIcon><VerifiedUser /></ListItemIcon>
                  <Typography>Admin</Typography>
                </div>
              </Link>
            </div> : null }
          </List>

          <Divider />

          {!props.auth.userId ? (
            <Button
              size="large"
              variant='contained'
              color="secondary"
              style={{ marginBottom: '1rem'}}
              onClick={() => {
                props.history.push(ROUTES.SIGNIN);
                handleDrawerClose();
              }}
            >
              Login
            </Button>
          ) : (
            <Button
              size="large"
              variant='contained'
              color="secondary"
              style={{ marginBottom: '1rem'}}
              onClick={() => {
                handleLogout();
                handleDrawerClose();
              }}
            >
              Logout
            </Button>
          )}
        </div>
      </Drawer>

      <Cart />
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  cart: state.cart,
  reward: state.reward,
});

const mapDispatchToProps = (dispatch) => ({
  authLogout: () => dispatch(authLogout()),
  customerLogout: () => dispatch(customerLogout()),
  cartLogout: () => dispatch(cartLogout()),
  rewardLogout: () => dispatch(rewardLogout()),
  openCart: () => dispatch(openCart()),
  closeCart: () => dispatch(closeCart()),
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Navigation));
