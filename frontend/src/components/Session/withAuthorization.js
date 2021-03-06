import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter, Redirect } from 'react-router-dom';
import { localStorageChanged } from '../../actions';
import * as routes from '../../constants';

const withAuthorization = (props) => (Component) => {
  class WithAuthorization extends React.Component {
    render() {
      return (this.props.token && this.props.user) ? <Component {...this.props} {...props}/> : <Redirect to={routes.LOGIN} />;
    }
  }

  const mapStateToProps = (store) => ({
    token: store.sessionState.token,
    user: store.sessionState.user
  });

  return compose(
    withRouter,
    connect(mapStateToProps, { localStorageChanged }),
  )(WithAuthorization);
}

export default withAuthorization;