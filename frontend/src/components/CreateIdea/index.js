import React, { Component } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import * as routes from '../../constants';
import { createIdea } from '../../actions';
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
	

	onChange = (e) => this.setState({[e.target.id] : e.target.value});

	onSubmit = async (e) => {
		try {
			e.preventDefault();
			this.setState({error: null})
			if (!this.state.description.length)
				return this.setState({ error: 'Idea must have a description' })
			if (!this.state.title.length)
				return this.setState({ error: 'Idea must have a title' })
			
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
			<form onSubmit={this.onSubmit}>
			
				<label><strong>Title</strong></label><br />
				<input placeholder="Add a title..." id="title" onChange={this.onChange} /><br/>
				<label><strong>Description</strong></label><br/>
				<textarea cols="86" rows ="10" placeholder="Add a description..." id="description" onChange={this.onChange} />
				<br/>

				<label><strong>Tags</strong></label>
				<ReactTags tags={this.state.tags}
                    handleDelete={this.handleDelete}
                    handleAddition={this.handleAddition}
                    handleDrag={this.handleDrag} 
				/>

				<input type="submit" value="Submit" />

				<p>{this.state.error}</p>
			</form>
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