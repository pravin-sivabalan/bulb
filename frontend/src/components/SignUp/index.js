import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import axios from 'axios';
import { setAuthUser, createUser } from '../../actions'
import * as routes from '../../constants';

class SignUpPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="signUpPageBackground">
        <SignUpForm {...this.props} />
      </div>
    )
  }
  
}

const INITIAL_STATE = {
  firstName: '',
  lastName: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = async (event) => {
    event.preventDefault();
    const { firstName, lastName, email, passwordOne } = this.state;
    const { history } = this.props;
    try {
      const data = await this.props.createUser(
        {
            firstName,
            lastName,
            email,
            password: passwordOne
        }
      )
      console.log(data)
      this.setState(() => ({ ...INITIAL_STATE }));
      history.push(routes.HOME);
    } catch (error) {
      console.error(error)
      this.setState( {error: error } );
    }
  }

  render() {
    const { firstName, lastName, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      firstName === '' ||
      lastName === '' ||
      email === '';

    return (
      <div>
        <h1>SIGN UP</h1>
        <form onSubmit={this.onSubmit}>
          <label>First Name</label>
          <input
            value={firstName}
            onChange={event => this.setState({ firstName: event.target.value})}
            type="text"
            autoComplete='given-name'
            placeholder="First Name"
          /><br/>
          <label>Last Name</label>
          <input
            value={lastName}
            onChange={event => this.setState({ lastName: event.target.value})}
            type="text"
            autoComplete='family-name'
            placeholder="Last Name"
          /><br/>
          <label>Email</label>
          <input
            value={email}
            onChange={event => this.setState( {email: event.target.value} )}
            type="email"
            autoComplete='email'
            placeholder="Email Address"
          /><br/>
          <label>Password</label>
          <input
            value={passwordOne}
            onChange={event => this.setState( {passwordOne: event.target.value} )}
            type="password"
            autoComplete="new-password"
            placeholder="Password"
          /><br/>
          <label>Confirm Password</label>
          <input
            value={passwordTwo}
            onChange={event => this.setState( {passwordTwo: event.target.value} )}
            type="password"
            autoComplete="new-password"
            placeholder="Confirm Password"
          /><br/>
          <button disabled={isInvalid} type="submit">
            Sign Up
          </button>
          { error && <p>{error}</p> }
        </form>
      </div>
    );
  }
}

const SignUpLink = () =>
  <div>
    <div>
      Don't have an account?
      {' '}
      <Link className="formats" to={routes.SIGN_UP}>Sign Up</Link>
    </div>
  </div>

export default compose(
  withRouter,
  connect(null, { createUser }),
)(SignUpPage);

