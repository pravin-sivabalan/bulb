import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import { setAuthUser, fetchDBUser } from '../../actions';
import * as routes from '../../constants';

const withAuthorization = (props) => (Component) => {
  class WithAuthorization extends React.Component {
    render() {
      return this.props.token ? <Component {...this.props} {...props}/> : null;
    }
  }

  const mapStateToProps = (store) => ({
    token: store.sessionState.token,
  });
  return compose(
    withRouter,
    connect(mapStateToProps, { setAuthUser, fetchDBUser }),
  )(WithAuthorization);
}

export default withAuthorization;