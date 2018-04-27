import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Header, Button, Icon, Label, Item, Container, Divider } from 'semantic-ui-react';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deleteIdea, likeIdea, unLikeIdea } from '../../actions';

class IdeaItem extends Component {
	constructor(props) {
		super(props);
		const liked = this.props.user.likes.find(like => like._id === this.props.idea._id);
		const { likes } = this.props.idea;
		const sameUser = this.props.user._id == this.props.idea._user._id;
		this.state = {
			liked: liked ? true : false,
			likes,
			sameUser
		}
	}
	

	onClick = (e) => {
		this.props.deleteIdea(this.props.idea._id);
	}

	handleLike = async e => {
		await this.props.likeIdea(this.props.idea._id);
		this.setState({
			liked: true,
			likes: this.state.likes+1
		});
		console.log('IdeaItem liked an idea');
	}

	handleUnLike = async e => {
		console.log('Unliking idea');
		await this.props.unLikeIdea(this.props.idea._id);
		this.setState({
			liked: false,
			likes: this.state.likes-1
		});
		console.log('IdeaItem disliked an idea');
	}

	render() {
		const { idea, type } = this.props;
		const { likes, sameUser, liked } = this.state;
		// const liked = this.props.user.likes.includes(this.props.idea._id);
		// const liked = this.props.user.likes.find(like => like._id === this.props.idea._id);
		console.log('Idea Item props:', this.props);
		console.log('Idea Item state:', this.state);

		const likeButton = 
			<Button onClick={this.handleLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					<Icon name='empty heart' />
					Like
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>

		const unLikeButton = 
			<Button onClick={this.handleUnLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					<Icon name='heart' />
					Unlike
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>

		const likeCount =
			<Label basic color='red'>Likes: {idea.likes}</Label>

		return (
			<Card fluid>
				<Card.Content>
					<Header as={Link} to={`/idea/${idea._id}`} dividing >{idea.title}</Header>
				<Card.Content description={idea.description} />
				</Card.Content>
				<Card.Content extra >
					{
						sameUser ? likeCount : (liked ? unLikeButton : likeButton)
					}
					{
						type === 'user' ?		
							<Button color='red' compact size='medium' floated='right' style={{marginTop: 0}} onClick={this.onClick}>X</Button> : 
							null
					}
					<Header floated='right' dividing >
						Posted By: 
						<Link to={`/user/${idea._user._id}`}> {`${idea._user.firstName} ${idea._user.lastName}`}</Link>
					</Header>
				</Card.Content>
			</Card>
		)
	}
}

const mapStateToProps = (state) => ({
	user: state.sessionState.user
});

export default compose(
	connect(mapStateToProps, { deleteIdea, likeIdea, unLikeIdea })
)(IdeaItem);
