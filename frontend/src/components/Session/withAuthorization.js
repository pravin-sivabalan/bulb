import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import * as routes from '../../constants';

const withAuthorization = (props) => (Component) => {
  class WithAuthorization extends React.Component {
    render() {
      const token = JSON.parse(this.props.token);
      console.log('withAuthorization token:', token);
      return token ? <Component {...this.props} {...props}/> : null;
    }
  }

  const mapStateToProps = (store) => ({
    token: store.sessionState.token,
  });
  return compose(
    withRouter,
    connect(mapStateToProps, { }),
  )(WithAuthorization);
}

export default withAuthorization;