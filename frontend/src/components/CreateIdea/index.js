import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import * as routes from '../../constants';
import { createIdea } from '../../actions';
import { Form, Input, TextArea, Modal, Icon, Button, Header } from 'semantic-ui-react'
import axios from 'axios';
import './index.css';

class CreateIdeaPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			tags: [],
			description: '',
			title: '',
			error: this.props.userIdeasError
		}
	}

	componentWillReceiveProps(nextProps) {
		if(JSON.stringify(this.props.userIdeasError) !== JSON.stringify(nextProps.userIdeasError))
			this.setState({ error: nextProps.userIdeasError })
	}

	closeSubmitWindow = () => {
		this.setState({error: null})
	}


	onChange = (e) => this.setState({[e.target.id] : e.target.value});

	onSubmit = async (e) => {
		try {
			e.preventDefault();
			this.setState({error: null})
			if (!this.state.title.length)
				return this.setState({ error: 'Idea must have a title' })
			if (!this.state.description.length)
				return this.setState({ error: 'Idea must have a description' })

			console.log('State:', this.state);
			console.log('Creating idea:', {
				title: this.state.title,
				description: this.state.description,
				_tags: this.state.tags.map(tag => tag.text)
			});

			const idea = await this.props.createIdea({
				title: this.state.title,
				description: this.state.description,
				_tags: this.state.tags.map(tag => tag.text)
			});

			console.log('CreateIdea created idea:', idea);
			this.props.history.push(routes.HOME);
		} catch (error) {
			console.log('Received error:', error);
			this.setState({error})
		}


	}

	handleDelete = (i) => {
        const { tags } = this.state;
        this.setState({
         tags: tags.filter((tag, index) => index !== i),
        });
    }

    handleAddition = (tag) => {
        const { tags } = this.state;
        this.setState({tags: [...tags, ...[tag]] });
    }

    handleDrag = (tag, currPos, newPos) => {
        const tags = [...this.state.tags];
        const newTags = tags.slice();

        newTags.splice(currPos, 1);
        newTags.splice(newPos, 0, tag);

        this.setState({ tags: newTags });
    }

	render = () => {
		return (
			<Form onSubmit={this.onSubmit}>
				<Modal open={ !!this.state.error } close={ this.closeSubmitWindow } basic size="small">
					<Header icon="announcement" content="Unfilled Fields" />
					<Modal.Content>
						<h3>{ this.state.error }</h3>
					</Modal.Content>
					<Modal.Actions>
						<Button color='green' onClick={ this.closeSubmitWindow } inverted>
							<Icon name="checkmark" /> OK
						</Button>
					</Modal.Actions>
				</Modal>
				<h1 className="header">Create Idea</h1>
				<Form.Input id="title" fluid label='Title' placeholder='Add a title...' onChange={this.onChange} />
				<Form.TextArea id="description" cols="86" rows ="5" label='Description' placeholder="Add a description..." id="description" onChange={this.onChange} />

				<label><strong>Tags</strong></label>
				<ReactTags tags={this.state.tags}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag}
				/>

				<div className="wrapper">
					<Form.Button type="submit" value="Submit">Submit</Form.Button>
				</div>

				<p>{this.state.error}</p>
			</Form>
		)
	}
}


const mapStateToProps = (state) => ({
	...state.sessionState.user,
	userIdeasError: state.ideasState.userIdeasError
});

export default compose(
  	withAuthorization(authCondition),
	connect(mapStateToProps, { createIdea })
)(CreateIdeaPage);
