import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navigation from '../Navigation';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import HomePage from '../Home';
import UserPage from '../UserPage';
import IdeaPage from '../IdeaPage';
import AccountPage from '../Account';
import SettingsPage from '../Settings';
import CreateIdeaPage from '../CreateIdea';
import { connect } from 'react-redux';
import { localStorageChanged } from '../../actions';
import * as routes from '../../constants';
import './index.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    window.addEventListener('storage', this.props.localStorageChanged);
  }
  

  render = () =>
    <Router>
      <div>
        <Navigation />
        <br/>
        <div className="app">
          <Switch>
            <Route exact path={routes.HOME} component={HomePage} />
            <Route exact path={routes.SIGN_UP} component={SignUpPage} />
            <Route exact path={routes.LOGIN} component={SignInPage} />
            <Route exact path={routes.ACCOUNT} component={AccountPage} />
            <Route exact path={routes.SETTINGS} component={SettingsPage} />
            <Route exact path={routes.CREATE_IDEA} component={CreateIdeaPage} />
            <Route exact path={routes.USER} component={UserPage} />
            <Route exact path={routes.IDEA} component={IdeaPage} />
            <Route component={({ location }) => <h3> No match for <code>{location.pathname}</code></h3>} />
          </Switch>
          <hr/>
        </div>
      </div>
    </Router>
}

export default connect(null, { localStorageChanged })(App);
