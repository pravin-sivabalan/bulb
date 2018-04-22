import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deleteIdea } from '../../actions';

class IdeaItem extends Component {
	onClick = (e) => {
		this.props.deleteIdea(this.props.idea._id);
	}

	render() {
		const { idea, type } = this.props;
		console.log('Idea item:', idea);
		return (
			<div>
				{
					type === 'user' ? <button onClick={this.onClick}>X</button> : null
				}
				<h3>{idea.title}</h3>
				<p>
					{idea.description}
				</p>
			</div>
		)
	}
}

export default compose(
	connect(null, { deleteIdea })
)(IdeaItem);
