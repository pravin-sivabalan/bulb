import React, {Component} from 'react';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SignOutButton } from '../Common';
import { Menu, Header, Button, Search } from 'semantic-ui-react';
import { signOut } from '../../actions';
import * as routes from '../../constants';

const NavigationAuth = ({ signOut }) =>
  <Menu fixed='top' fluid compact stackable>
    <Menu.Item as={ Link } name='Bulb' to={routes.HOME}><Header as='h3' color='blue'>Bulb</Header></Menu.Item>
    <Menu.Item><Search/></Menu.Item>
    <Menu.Item as={ Link } name='Home' to={routes.HOME}>Home</Menu.Item>
    <Menu.Item as={ Link } name='CreateIdea' to={routes.CREATE_IDEA}>Create Idea</Menu.Item>
    {/*<Menu.Item as={ Link }  name='Account' to={routes.ACCOUNT}>Account</Menu.Item>*/}
    <Menu.Item position='right' as={ Link } name='Settings' to={routes.SETTINGS}>Settings</Menu.Item>
    <Menu.Item as={ Link } name="SignOut" to={routes.LOGIN} onClick={signOut} >Sign Out</Menu.Item>
  </Menu>

const NavigationNonAuth = () =>
  <Menu>
    <Menu.Item as={ Link } name='Home' to={routes.LOGIN}><Header as='h3' color='blue'>Bulb</Header></Menu.Item>
    <Menu.Item as={ Link } name='Login' to={routes.LOGIN}>Login</Menu.Item>
    <Menu.Item as={ Link } name='Signup' to={routes.SIGN_UP}>Sign Up</Menu.Item>
  </Menu>

class NavigationHeader extends Component {
  render() {
    return (
      <div >
        { this.props.token ? <NavigationAuth signOut={this.props.signOut} /> : <NavigationNonAuth /> }
      </div>
    )
  }
}

const mapStateToProps = (store) => ({
  token: store.sessionState.token,
});

export default compose(
  withRouter,
  connect(mapStateToProps, { signOut })
)(NavigationHeader);