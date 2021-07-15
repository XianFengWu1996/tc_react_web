import { combineReducers } from 'redux';
import auth from './authReducer';
import customer from './customerReducer'
import cart from './cartReducer'
import reward from './rewardReducer'
import menu from './menuReducer'

const rootReducer = combineReducers({
   auth,
   customer, 
   cart,
   reward,
   menu,
});

export default rootReducer;