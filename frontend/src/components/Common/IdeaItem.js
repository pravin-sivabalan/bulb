import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, Item, Container, Divider, Header, Icon, Label } from 'semantic-ui-react';
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
			<Item>
				<Container>
					<Item.Content>
						<Item.Header style={{display: 'inline-block'}}>
							<Link to={`/idea/${idea._id}`}>{idea.title}</Link>
						</Item.Header>
						<p>
							Posted by:  
							<Link to={`/user/${idea._user._id}`}>
								{`${idea._user.firstName} ${idea._user.lastName}`}
							</Link>
						</p>
						{/* <Divider/> */}
						<Item.Description>{idea.description}</Item.Description>
						<Item.Extra>
							<Button compact floated='left' size='small' as='div' labelPosition='right'>
								<Button compact color='red' size='small' >
									<Icon name='heart' />
									Like
								</Button>
								<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
							</Button>
							{
								type === 'user' ?		
									<Button color='red' compact size='medium' floated='right' onClick={this.onClick}>X</Button> : 
									null
							}
						</Item.Extra>
					</Item.Content>
				</Container>
			</Item>
		)
	}
}

export default compose(
	connect(null, { deleteIdea })
)(IdeaItem);
