import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../actions';

class SignOutButton extends React.Component {
  render = () => <button type="button" onClick={this.props.signOut} className="navButton"> Sign Out </button>
}

export default connect(null, { signOut })(SignOutButton);
