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
		console.log('Idea item props:', idea);
		return (
			<div>
				{
					type === 'user' ? <button onClick={this.onClick}>X</button> : null
				}
				<h3>{idea.title}</h3>
				<p>
					{idea.description}
				</p>
				Posted by: <Link to={`/user/${idea._user._id}`}>{`${idea._user.firstName} ${idea._user.lastName}`}</Link>
			</div>
		)
	}
}

export default compose(
	connect(null, { deleteIdea })
)(IdeaItem);
