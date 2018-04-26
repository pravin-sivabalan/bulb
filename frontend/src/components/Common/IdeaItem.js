import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Header, Button, Icon, Label, Item, Container, Divider } from 'semantic-ui-react';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deleteIdea } from '../../actions';

class IdeaItem extends Component {
	onClick = (e) => {
		this.props.deleteIdea(this.props.idea._id);
	}

	render() {
		const { idea, type } = this.props;
		console.log('Idea item idea:', idea);

		return (
			<Card fluid>
				<Card.Content>
					<Header as={Link} to={`/idea/${idea._id}`} dividing >{idea.title}</Header>
				<Card.Content description={idea.description} />
				</Card.Content>
				<Card.Content extra >
					<Button compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
						<Button compact color='red' size='small' >
							<Icon name='heart' />
							Like
						</Button>
						<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
					</Button>
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
	connect(null, { deleteIdea })
)(IdeaItem);
