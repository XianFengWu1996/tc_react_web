import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../Navigation/routes'


export default function (Component) {
    class Authenticate extends React.Component{

        componentDidMount() {
            this._checkAndRedirect();
        }
      
          _checkAndRedirect() {
            const { userId} = this.props.auth;
      
            if (userId === '') {
               this.props.history.push(ROUTES.SIGNIN);
            }
          }

        render(){
            const { userId } = this.props.auth;
            return (
                <>
                    {userId !== '' ? <Component {...this.props} /> : null }
                </>
            )
        }

        
    }

    const mapStateToProps = (state) => ({
        auth: state.auth
    })

    return connect(mapStateToProps, null)(withRouter(Authenticate))
}

export const loggedIn = (Component) => {
    class LoggedIn extends React.Component{

        componentDidMount() {
            this._checkAndRedirect();
          }
      
          _checkAndRedirect() {
            const { userId } = this.props.auth;
      
            if (userId !== '') {
               this.props.history.push(ROUTES.HOME)
            } else if(this.props.history.location.pathname === '/signup'){
                this.props.history.push(ROUTES.SIGNUP)
            }else {
                this.props.history.push(ROUTES.SIGNIN)
            }
          }

        render(){
            return (
                <>
                    <Component {...this.props} />
                </>
            )
        }

        
    }

    const mapStateToProps = (state) => ({
        auth: state.auth
    })

    return connect(mapStateToProps, null)(withRouter(LoggedIn))
}
