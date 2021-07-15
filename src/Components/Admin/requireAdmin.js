import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom'


export default function (Component) {
    class Authenticate extends React.Component{

        componentDidMount() {
            this._checkAndRedirect();
          }
      
          _checkAndRedirect() {
            const { isAdmin, userId } = this.props.auth;
      
            if(userId === ''){
               this.props.history.push('/signin')
            } else if (!isAdmin) {
               this.props.history.push('/')
            } 
          }

        render(){
            const { isAdmin } = this.props.auth;
            return (
                <>
                    {isAdmin ? <Component {...this.props} /> : null}
                </>
            )
        }

        
    }

    const mapStateToProps = (state) => ({
        auth: state.auth
    })

    return connect(mapStateToProps, null)(withRouter(Authenticate))
}