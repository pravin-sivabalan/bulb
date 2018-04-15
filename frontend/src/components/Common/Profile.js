import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import IdeaItem from '../Common/IdeaItem';
import defaultPhoto from '../../assets/default.png';

export default class Profile extends Component {
	
  render() {
	const { user, feedIdeas, currentUser } = this.props;
	console.log('Profile Props:', this.props);
	return (
		<div>
			<div className="row">
				<div className="column leftSide">
					<div className="profile">
					<div className="profileCard">

						<img className="profilePhoto" src={user ? user.photoUrl : defaultPhoto} onError={(e)=>{e.target.src=defaultPhoto}}></img>
						{ !!user && <h5 className="userName">{user.displayName}</h5> }
						
					</div>
					</div>

				</div>
				<div className="column rightSide">
					<div className="postFeed">
					{
						feedIdeas &&
						feedIdeas.length ? 
						feedIdeas.map((post,i) => <IdeaItem key={i} id={i} type="feed" post={post}/>) :
						<p>No Ideas!</p>
					}
					</div>
				</div>
			</div>
		</div>
	);
  }
}

