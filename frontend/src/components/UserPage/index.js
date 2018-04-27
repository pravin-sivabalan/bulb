import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Grid, Segment, Button, Icon, Label, Form, Container, ItemGroup, Divider, Header, Card } from 'semantic-ui-react';
import { fetchUser, fetchIdeas, followUser, unFollowUser, unLikeIdea } from '../../actions';
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

	unLike = async (e, id) => {
		console.log('Unliking idea:', id);
		const response = await this.props.unLikeIdea(id);
		this.setState({
			user: {
				...this.state.user,
				likes: this.state.user.likes.filter(like => like._id !== id)
			}
		})
	}

  render() {
		const { user, feed, currentUser, isFollowing } = this.state;
		console.log('UserPage state:', this.state);
		const sameUser = user && this.props.user._id === user._id;
		
		const userInfo = !user ? 
			<p>No user info!</p> : 
			<UserInfo 
				user={user} 
				sameUser={sameUser} 
				currentUser={currentUser} 
				isFollowing={isFollowing}
				follow={this.follow}
				unFollow={this.unFollow}
			/>

		const likeFeed = (user && user.likes && user.likes.length) ? user.likes.map((idea,i) =>
			<Card key={i} fluid>
				<Card.Content>
					<Header as={Link} to={`/idea/${idea._id}`} dividing >{idea.title}</Header>
				<Card.Content description={idea.description} />
				</Card.Content>
				<Card.Content extra >
					{ sameUser && <UnLikeButton likes={idea.likes} handleUnlike={this.unLike} id={idea._id} /> }
					<Header floated='right' dividing >
						Posted By: 
						<Link to={`/user/${idea._user._id}`}> {`${idea._user.firstName} ${idea._user.lastName}`}</Link>
					</Header>
				</Card.Content>
			</Card>
		) : <p>No likes!</p>

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
							<Header textAlign='center'>Posts:</Header>
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
								{/* {
									(user && user.likes && user.likes.length) ?
										user.likes.map((idea,i) => <IdeaItem key={i} id={idea._id} type="feed" idea={idea}/>) :
										<p>No likes!</p>
								} */}
								{likeFeed}
						</ItemGroup>
					</Segment>

				</Grid.Column>

			</Grid>
	 );
  }
}

const FollowButton = ({follow}) => <Button onClick={follow} >Follow</Button>;
const UnFollowButton = ({unFollow}) => <Button onClick={unFollow} >Unfollow</Button>;

const UnLikeButton = ({likes, handleUnlike, id}) =>
	<Button onClick={e => handleUnlike(e, id)} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
		<Button compact color='red' size='small' >
			<Icon name='heart' />
			Unlike
		</Button>
		<Label as='a' basic color='red' pointing='left'>{likes}</Label>
	</Button>

const UserInfo = ({user, sameUser, currentUser, isFollowing, follow, unFollow}) => 
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
			(!isFollowing  ? <FollowButton follow={follow} /> : <UnFollowButton unFollow={unFollow} /> )
		}
	</Form>

export default compose(
	withRouter,
	withAuthorization(),
	connect(null, { followUser, unFollowUser, unLikeIdea })
)(UserPage);
