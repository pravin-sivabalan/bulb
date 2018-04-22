import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IdeaItem from '../Common/IdeaItem';

export default class Profile extends Component {
	
  render() {
	const { user, feedIdeas, currentUser } = this.props;
	console.log('Profile Props:', this.props);
	return (
		<div>
			{
				feedIdeas &&
				feedIdeas.length ? 
				feedIdeas.map((post,i) => <IdeaItem key={i} id={i} type="feed" post={post}/>) :
				<p>No Ideas!</p>
			}	
		</div>
	);
  }
}

