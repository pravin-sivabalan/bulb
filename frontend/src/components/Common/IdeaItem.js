import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Header, Button, Icon, Label, Item, Container, Divider } from 'semantic-ui-react';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deleteIdea, likeIdea, unLikeIdea } from '../../actions';
import withAuthorization from '../Session/withAuthorization';
import { unlink } from 'fs';

class IdeaItem extends Component {
	constructor(props) {
		super(props);
		console.log('IdeaItem props:', this.props);
		const liked = this.props.user.likes.includes(this.props.idea._id);
		console.log('Idea liked:', liked);
		this.state = {
			liked
		}
	}
	

	onClick = (e) => {
		this.props.deleteIdea(this.props.idea._id);
	}

	handleLike = async e => {
		await this.props.likeIdea(this.props.idea._id);
		this.setState({liked: true});
	}

	handleUnLike = async e => {
		console.log('Unliking idea');
		await this.props.unLikeIdea(this.props.idea._id);
		this.setState({liked: false});
	}

	render() {
		const { idea, type } = this.props;
		const { liked } = this.state;
		console.log('Idea item idea:', idea);

		const likeButton = 
			<Button onClick={this.handleLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					{/* <Icon name='heart' /> */}
					<Icon name='empty heart' />
					Like
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>

		const unLikeButton = 
			<Button onClick={this.handleUnLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					{/* <Icon name='heart' /> */}
					<Icon name='heart' />
					Unlike
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>

		return (
			<Card fluid>
				<Card.Content>
					<Header as={Link} to={`/idea/${idea._id}`} dividing >{idea.title}</Header>
				<Card.Content description={idea.description} />
				</Card.Content>
				<Card.Content extra >
					{liked ? unLikeButton : likeButton}
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

export default compose(
	withAuthorization(),
	connect(null, { deleteIdea, likeIdea, unLikeIdea })
)(IdeaItem);
