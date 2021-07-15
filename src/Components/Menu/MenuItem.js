import React from "react";
import {
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  makeStyles,
  Box,
} from "@material-ui/core";
import { connect } from "react-redux";
import { addToCart } from "../../redux/actions/cart";
import AddToCart from "./AddToCart";


const useStyle = makeStyles((theme) => ({
    primaryText: {
      fontSize: '1.3rem',
      fontWeight: 600,

      [theme.breakpoints.down("lg")]: {
        fontSize: '1.2rem',
      },
      [theme.breakpoints.down("md")]: {
        fontSize: '1.1rem',
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: '1rem',
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: '0.9rem',
      },
    },
    spicyPrimary: {
        color: 'red',
        fontSize: '1.3rem',
        fontWeight: 600,

        [theme.breakpoints.down("lg")]: {
          fontSize: '1.2rem',
        },
        [theme.breakpoints.down("md")]: {
          fontSize: '1.1rem',
        },
        [theme.breakpoints.down("sm")]: {
          fontSize: '1rem',
        },
        [theme.breakpoints.down("xs")]: {
          fontSize: '0.9rem',
        },
    }
}));

const MenuItem = (props) => {
  const classes = useStyle();    
  return (
    <>
      {props.dish.active ? 
          <Paper variant="outlined" key={props.dish.food_id}>
            <ListItem dense >
              <Box width="90%">
                <div>
                <ListItemText
                  primary={props.dish.food_id + ". " + props.dish.food_name + ' ' + props.dish.food_name_chinese}
                  secondary={`$${props.dish.price.toFixed(2)}      ${props.dish.spicy ? '\uD83C\uDF36' : ''}`}
                  classes={{primary: props.dish.spicy ? classes.spicyPrimary : classes.primaryText}}
                />
                </div>
              
              </Box>
              <ListItemSecondaryAction>
                <AddToCart dish={props.dish} />
              </ListItemSecondaryAction>
            </ListItem>
          </Paper> 
    : null}
      
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (item) => dispatch(addToCart(item)),
  };
};

export default connect(null, mapDispatchToProps)(MenuItem);
