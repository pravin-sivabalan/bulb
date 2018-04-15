import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'recompose';
import { authCondition } from '../../constants';
import { deleteIdea } from '../../actions';

class IdeaItem extends Component {
	onClick = (e) => {
		this.props.deleteIdea(this.props.post.postId);
	}

	render() {
		const { post, type } = this.props;
		console.log('Idea item:', post);
		return (
			<div className="placeHolder">
				<div className="postTitle">
					<div className="floatRight">{
						type === 'user' ? <button onClick={this.onClick}>X</button> : null
					}</div>
					<h3>{post.title}</h3>
				</div>
				<div className="postInfo">
					<div className="postPicture">
						<img className="itemPicture" alt="itemPicture" src={post.photoUrls[0]}></img>
					</div>
					<div className="postDescription">
						Made by: <Link to={`/user/${post.userId}`}>{post.userId}</Link>
						<ul className="descriptionDetails">
							{post.description}
						</ul>
					</div>
				</div>
			</div>
		)
	}
}

export default compose(
	connect(null, { deleteIdea })
)(IdeaItem);
