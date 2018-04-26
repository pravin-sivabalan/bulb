import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { SignUpLink } from '../Common';
import { signIn } from '../../actions';
import * as routes from '../../constants';
import { Form, Button, Icon, Header, Modal } from 'semantic-ui-react';
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
  error: '',
  fail: false,
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
      this.setState( {error: error.response.data.error } );
      this.setState({fail: true})
    }
  }

  closeSubmitWindow = () => {
    this.setState({error: null})
    this.setState({fail: false})
  }

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    
    return (
      <div>
        <h1 className="login"> Login </h1>
        <div className="login-div">
          <Form className="login-form" onSubmit={this.onSubmit}>
            <Modal open={ this.state.fail } onClose={ this.closeSubmitWindow } basic size="small">
              <Header icon="warning circle" content="Error" />
              <Modal.Content>
                <h3>{ this.state.error }</h3>
              </Modal.Content>
              <Modal.Actions>
                <Button color='green' onClick={ this.closeSubmitWindow } inverted>
                  <Icon name="checkmark" /> OK
                </Button>
              </Modal.Actions>
            </Modal>
            <Form.Field required>
              <label>Email:</label>
              <Form.Input
                value={email}
                onChange={event => this.setState({email: event.target.value})}
                type="email"
                autoComplete='email'
                placeholder='Email'
              />
            </Form.Field>
            <br />
            <Form.Field required>
              <label>Password:</label>
              <Form.Input
                value={password}
                onChange={event => this.setState({password: event.target.value})}
                type="password"
                autoComplete='new-password'
                placeholder='Password'
              />
            </Form.Field>
            <br />
            <SignUpLink />
            <div className="wrapper">
              <Form.Button type="button" disabled={isInvalid} type="submit"> Login </Form.Button>
            </div>
          </Form>
        </div>
        { error && <p>{error}</p> }
      </div>
    );
  }
}


const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  userIdeas: state.ideasState.userIdeas,
});

export default connect(mapStateToProps, { signIn })(SignInPage);

export {
  SignInForm,
};
