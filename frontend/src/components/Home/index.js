import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
// import withAuthorization from '../Session/withAuthorization';

class HomePage extends Component {
	render() {
		return (
			<div>Home Page</div>
		);
	}
}

// const mapStateToProps = (state) => ({
//   dbUser: state.sessionState.dbUser,
//   feedPosts: state.postsState.feedPosts
// });

// export default compose(
//   withAuthorization((authUser) => !!authUser),
//   connect(mapStateToProps, { fetchFeedPosts, fetchDBUser })
// )(HomePage);

export default HomePage;
