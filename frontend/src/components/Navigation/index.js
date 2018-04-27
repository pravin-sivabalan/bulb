import React, {Component} from 'react';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { SignOutButton } from '../Common';
import { Menu, Header, Button, Search, Responsive, Sidebar, Form } from 'semantic-ui-react';
import { signOut } from '../../actions';
import * as routes from '../../constants';

let visible = false;

const toggle = () => {
  visible = !visible;
  console.log(visible)
}

const NavigationAuth = ({ signOut }) =>
  <div>
    <Responsive as={Menu} {...Responsive.onlyComputer}>
      <Menu fluid compact>
        <Menu.Item as={ Link } name='Bulb' to={routes.HOME}><Header as='h3' color='blue'>Bulb</Header></Menu.Item>
        <Menu.Item><Search/></Menu.Item>
        <Menu.Item as={ Link } name='Home' to={routes.HOME}>Home</Menu.Item>
        <Menu.Item as={ Link } name='CreateIdea' to={routes.CREATE_IDEA}>Create Idea</Menu.Item>
        {/*<Menu.Item as={ Link }  name='Account' to={routes.ACCOUNT}>Account</Menu.Item>*/}
        <Menu.Item  as={ Link } name='Settings' to={routes.SETTINGS}>Settings</Menu.Item>
        <Menu.Item position='right' as={ Link } name="SignOut" to={routes.LOGIN} onClick={signOut} >Sign Out</Menu.Item>
      </Menu>
    </Responsive>
    <Responsive as={Menu} {...Responsive.onlyMobile}>
      <Menu fluid vertical>
        <Menu.Menu style={{ marginBottom:'10px' }}>
          <Menu.Item as={ Link } name='Bulb' to={routes.HOME}>
            <Header style={{ textAlign:'center' }} as='h2' color='blue'>Bulb</Header>
          </Menu.Item>
          <Menu.Item>
            <Search style={{ textAlign:'center' }} fluid/>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Item className='center' as={ Link } name='Home' to={routes.HOME}>
          <p style={{textAlign:'center'}}>Home</p>
        </Menu.Item>
        <Menu.Item className='center' as={ Link } name='CreateIdea' to={routes.CREATE_IDEA}>
          <p style={{textAlign:'center'}}>Create Idea</p>
        </Menu.Item>
        {/*<Menu.Item as={ Link }  name='Account' to={routes.ACCOUNT}>Account</Menu.Item>*/}
        <Menu.Item className='center' as={ Link } name='Settings' to={routes.SETTINGS}>
          <p style={{textAlign:'center'}}>Settings</p>
        </Menu.Item>
        <Menu.Item className='center' as={ Link } name="SignOut" to={routes.LOGIN} onClick={signOut} >
          <p style={{textAlign:'center'}}>Sign Out</p>
        </Menu.Item>
      </Menu>
    </Responsive>
</div>
const NavigationNonAuth = () =>
  <div>
    <Responsive as={Menu} {...Responsive.onlyComputer}>
      <Menu fluid compact>
        <Menu.Item as={ Link } name='Home' to={routes.LOGIN}><Header as='h3' color='blue'>Bulb</Header></Menu.Item>
        <Menu.Item as={ Link } name='Login' to={routes.LOGIN}>Login</Menu.Item>
        <Menu.Item as={ Link } name='Signup' to={routes.SIGN_UP}>Sign Up</Menu.Item>
      </Menu>
    </Responsive>
    <Responsive as={Menu} {...Responsive.onlyMobile}>
      <Menu fluid vertical>
        <Menu.Menu>
          <Menu.Item as={ Link } name='Home' to={routes.LOGIN}>
            <Header style={{ textAlign:'center' }} as='h2' color='blue'>Bulb</Header>
          </Menu.Item>
        </Menu.Menu>
        <Menu.Item as={ Link } name='Login' to={routes.LOGIN}>
          <p style={{textAlign:'center'}}>Login</p>
        </Menu.Item>
        <Menu.Item as={ Link } name='Signup' to={routes.SIGN_UP}>
          <p style={{textAlign:'center'}}>Sign Up</p>
        </Menu.Item>
      </Menu>
    </Responsive>
  </div>

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