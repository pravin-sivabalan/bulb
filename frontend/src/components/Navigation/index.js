import React, {Component} from 'react';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SignOutButton } from '../Common';
import * as routes from '../../constants';

const NavigationAuth = () =>
  <div>
    <Link to={routes.HOME}><button >Home</button></Link>
    <Link to={routes.ACCOUNT}><button >Account</button></Link>
    <Link to={routes.SETTINGS}><button >Settings</button></Link>
    <SignOutButton />
  </div>

const NavigationNonAuth = () =>
  <div>
    <Link to={routes.LOGIN}><button >Log In</button></Link>
    <Link to={routes.SIGN_UP}><button >Sign up</button></Link>
  </div>

class NavigationHeader extends Component {
  render() {
    return (
      <div >
        <Link to={this.props.token ? routes.HOME : routes.LOGIN}>
          <h3>Bulb</h3>
        </Link>
        { this.props.token ? <NavigationAuth /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  token: store.sessionState.token,
});

export default compose(withRouter,connect(mapStateToProps))(NavigationHeader);