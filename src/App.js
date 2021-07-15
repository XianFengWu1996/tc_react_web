import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

import * as ROUTES from "./Components/Navigation/routes";

import SignIn from "./Components/Auth/SignIn";
import SignUp from "./Components/Auth/SignUp";
import Menu from "./Components/Menu";
import Navigation from "./Components/Navigation";
import Admin from './Components/Admin';
import Checkout from './Components/Checkout';
import requireAuth, { loggedIn} from './Components/Auth/requireAuth';
import requireAdmin from './Components/Admin/requireAdmin';
import Order from "./Components/Order/Index";
import Account from "./Components/Account/Account";
import Confirmation from "./Components/Order/Confirmation";
import Reward from "./Components/Reward/Reward";
import { store } from "./store";
import { resetCart } from "./redux/actions/cart";

const App = (props) => {
  useEffect(() => {
    const { cart } = store.getState();
    if(cart.payment === undefined){
      store.dispatch(resetCart());
    }
  })

  return (
      <Router>
        <Navigation />

        <Switch>
          <Route path={ROUTES.HOME} exact component={Menu} />
          <Route path={ROUTES.ORDER} component={requireAuth(Order)} />
          <Route path={ROUTES.SIGNIN} component={loggedIn(SignIn)} />
          <Route path={ROUTES.SIGNUP} component={loggedIn(SignUp)} />
          <Route path={ROUTES.ADMIN} component={requireAdmin(Admin)} />
          <Route path={ROUTES.CHECKOUT} component={requireAuth(Checkout)}/>
          <Route path={ROUTES.ACCOUNT} component={requireAuth(Account)}/>
          <Route path={ROUTES.CONFIRMATION} component={requireAuth(Confirmation)}/>
          <Route path={ROUTES.REWARD} component={requireAuth(Reward)}/>
        </Switch>
        
      </Router>
  );
};

export default App;
