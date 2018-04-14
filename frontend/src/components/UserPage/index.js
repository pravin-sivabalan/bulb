import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import axios from 'axios';
import { fetchUser, fetchIdeas } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import Profile from '../Common/Profile';

class UserPage extends Component {
  constructor(props) {
		super(props);
		console.log('User Page Props:', props);
		this.state = {
			user: null,
			feedIdeas: [],
			currentUser: false
		}
  }

  componentWillMount = async () => {
	  const id = this.props.match.params.userid;
		const userInfo = await Promise.all([fetchUser(id), fetchIdeas(id)]);
		if (this.props.authUser.uid === userInfo[0].uid) this.setState({currentUser: true});
	  this.setState({user: userInfo[0]});
	  this.setState({feedIdeas: userInfo[1]});
  }

  render() {
    return (
      <Profile user={this.state.user} feedIdeas={this.state.feedIdeas} currentUser={this.state.currentUser} />
    );
  }
}

export default compose(
	withRouter,
  	withAuthorization((authUser) => !!authUser),
)(UserPage);
