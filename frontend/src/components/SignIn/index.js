import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from '../Common';
import { signIn } from '../../actions';
import * as routes from '../../constants';
import './index.css'

class SignInPage extends Component {
  render = () =>
    <div className="pageBackground">
      <SignInForm {...this.props}/>
    </div>
}

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;

    try {
      await this.props.signIn(email, password);
      this.setState(() => ({ ...INITIAL_STATE }));
      history.push(routes.HOME);
    } catch (error) {
      this.setState({error});
    }
  }

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    
    return (
      <div>
        <div className="loginBackground">
          <h1 className="loginHeader">LOG IN</h1>
          <form onSubmit={this.onSubmit}>
            <div className="emailBar">
              <input
                className="textBox"
                value={email}
                onChange={event => this.setState({email: event.target.value})}
                type="text"
                placeholder="Email Address"
              />
            </div>

            <div className="emailBar">
              <input
                className="textBoxPass"
                value={password}
                onChange={event => this.setState({password: event.target.value})}
                type="password"
                placeholder="Password"
              />
            </div>
            <div className="centerLogIn">
              <button 
                className="signInButton"
                disabled={isInvalid} type="submit">
                Log In
              </button>
            </div>
            { error && <p>{error.message}</p> }
          </form>
          <SignUpLink />
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  userIdeas: state.ideasState.userIdeas,
});

// export default compose(
//   // withAuthorization((authUser) => !!authUser),
//   connect(mapStateToProps, { signIn })
// )(SignInPage);

export default connect(mapStateToProps, { signIn })(SignInPage);


export {
  SignInForm,
};
