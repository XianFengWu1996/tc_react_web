import React, { Component } from 'react';
import { connect } from "react-redux";
import CategoryList from "./MenuList";
import { Button, withStyles } from "@material-ui/core";
import { resetErrorAndWarning } from "../../redux/actions/cart";
import Axios from 'axios'
import { getMenu, resetMenu } from "../../redux/actions/menu";
import AlertMessage from '../../Helper/AlertMessage'
import LoadingSpinner from '../../Helper/Loading'
import { getMenuUrl } from '../../Misc/url';

const style = (theme) => ({
  choiceButton: {
    fontSize: '1.2rem',
    padding: '1rem 1.5rem',

    [theme.breakpoints.down('md')]:{
      padding: '0.8rem 1.3rem',
    },
    [theme.breakpoints.down('sm')]:{
      fontSize: '1.0rem',
      padding: '0.6rem 1.1rem',
    },
    [theme.breakpoints.down('xs')]:{
      fontSize: '0.8rem',
      padding: '0.4rem 0.9rem',
    },
  },
  outlinedPrimary: {
    backgroundColor:"#e8385b",
    '&:hover': {
      backgroundColor: '#ff757b',
      color: "#000",
    },
    color: 'white'
  },
  outlinedSecondary:{
    backgroundColor:"none"
  },
  flexCentering: {
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center'
  }
})

class Menu extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: '',
      isFullday: true,
      menuLoading: false,
      loadingTimeoutId: 0,
    };
  }

  componentDidMount(){
    const { menu, getMenu } = this.props;
    
    try {
      // check if the menu data has expired or not, if the timestamp is greater than the expiration
      // then we will make a request to the backend to retrieve a new version of the menu
      if(Date.now() >= menu.expiration){

        // start the loading while retrieving the menu
        this.setState({ menuLoading: true })

        Axios.get(getMenuUrl).then((result) => {
          if(result.data.error){
            throw new Error(result.data.error)
          } 
            
          getMenu(result.data);

          // delay the loading for a few seconds 
          let id = setTimeout(() => {
            this.setState({ menuLoading: false })
          }, 3000)
          this.setState({ loadingTimeoutId: id})
        })
      }
    } catch (error) {      
      this.setState({ menuLoading: false , error: error.message ? error.message : 'Failed to retrieve menu, please try to refresh the page'});
    }
  }

  componentWillUnmount(){

    // clear the timeout with the id
    clearTimeout(this.state.loadingTimeoutId);
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div>
        {this.props.cart.homepageWarning !== "" ?  
        <AlertMessage type='warning' message={this.props.cart.homepageWarning} close={() => this.props.resetError()} />
        : null}
      
        <div>
          
          <div className={classes.flexCentering} style={{ margin: '2rem 0'}}>
            <Button
              variant='outlined'
              size='small'
              className={`${this.state.isFullday ? classes.outlinedPrimary : classes.outlinedSecondary} ${classes.choiceButton}`}
              onClick={() => this.setState({ isFullday: true})}
            >Full-day  全天菜单</Button>
            <Button 
              className={`${this.state.isFullday ? classes.outlinedSecondary : classes.outlinedPrimary} ${classes.choiceButton}`}
              variant='outlined'
              size='small'
              onClick={() =>  this.setState({ isFullday: false})}
            >Lunch  特价午餐</Button>
          </div>
          {this.state.error ? <div className={classes.flexCentering}>{this.state.error}</div> : null}

          {this.state.menuLoading 
          ? <LoadingSpinner type='Oval' color='#00BFFF' width={80} height={80}/> 
          :<CategoryList dishes={this.state.isFullday ? this.props.menu.fullday : this.props.menu.lunch}/>  
          }

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth,
    customer: state.customer,
    cart: state.cart,
    menu: state.menu
  };
};

const mapDispatchToProps = (dispatch) => ({
  resetError: () => dispatch(resetErrorAndWarning()),
  getMenu: (data) => dispatch(getMenu(data)),
  resetMenu: () => dispatch(resetMenu())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(style)(Menu));




