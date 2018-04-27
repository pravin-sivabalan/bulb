import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Segment, Button, Form, Container, ItemGroup, Divider, Header } from 'semantic-ui-react';
import { fetchUser, fetchIdeas, followUser, unFollowUser } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';

class UserPage extends Component {
  constructor(props) {
		super(props);
		console.log('User Page Props:', props);
		this.state = {
			user: null,
			feed: [],
			isFollowing: false,
			currentUser: this.props.user && this.props.match.params.userid === this.props.user._id
		}
  }

  componentWillMount = async () => {
	  const id = this.props.match.params.userid;
	  const userInfo = await Promise.all([fetchUser(id), fetchIdeas(id)]);
	  console.log('Got userInfo:', userInfo);
	  this.setState({
		  user: userInfo[0],
		  feed: userInfo[1],
		  isFollowing: userInfo[0].followers.includes(this.props.user._id)
		});
	}
	
	follow = async e => {
		await this.props.followUser(this.props.match.params.userid);
		this.setState({isFollowing: true});
	}
	
	unFollow = async e => {
		await this.props.unFollowUser(this.props.match.params.userid);
		this.setState({isFollowing: false});
	}

  render() {
		const { user, feed, currentUser, isFollowing } = this.state;
		console.log('UserPage state:', this.state);
		const followButton = <Button onClick={this.follow} >Follow</Button>;
		const unFollowButton = <Button onClick={this.unFollow} >Unfollow</Button>;
		// const isFollowing = this.props.user && user && user.followers.includes(this.props.user._id);

		const userInfo = !user ? <p>No user info!</p> :
			<Form>
				<Form.Field inline>
					<label>Name:</label>
					<label>{user.firstName} {user.lastName}</label>
				</Form.Field>
				<Form.Field inline>
					<label>Email:</label>
					<label>{user.email}</label>
				</Form.Field>
				<Form.Field inline>
					<label>Followers:</label>
					<label>{user.followers.length}</label>
				</Form.Field>
				<Form.Field inline>
					<label>Following:</label>
					<label>{user.following.length}</label>
				</Form.Field>

				{
					!currentUser && 
					(!isFollowing  ? followButton: unFollowButton )
				}
			</Form>

	 return (
			<Grid>
				<Grid.Column width={4} >
					<Segment>
					<Header textAlign='center'>User Info:</Header>
						<Container>
							{userInfo}
						</Container>
					</Segment>
				</Grid.Column>
				<Grid.Column width={8} >
					<Segment>
							<Header textAlign='center' >Posts:</Header>
							<Divider/>
							
							<ItemGroup divided>
								{
									feed && feed.length ?
										feed.map((idea,i) => <IdeaItem key={i} id={idea._id} type="feed" idea={idea}/>) :
										<p>User has made no ideas!</p>
								}
							</ItemGroup>
					</Segment>
				</Grid.Column>
				<Grid.Column width={4} >
					<Segment>
						<Header textAlign='center' >Likes:</Header>
							<Divider/>
							
							<ItemGroup divided>
								{
									(user && user.likes && user.likes.length) ?
										user.likes.map((idea,i) => <IdeaItem key={i} id={idea._id} type="feed" idea={idea}/>) :
										<p>No likes!</p>
								}
						</ItemGroup>
					</Segment>

				</Grid.Column>

			</Grid>
	 );
  }
}

export default compose(
	withRouter,
	withAuthorization(),
	connect(null, { followUser, unFollowUser })
)(UserPage);
