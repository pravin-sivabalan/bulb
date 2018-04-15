import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_IDEA } from '../../constants';
import defaultPhoto from '../../assets/default.png';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';
import { fetchFeedIdeas, fetchDBUser } from '../../actions';

class HomePage extends Component {  
  componentDidMount = () => {
    this.props.fetchFeedIdeas();
  }

  render() {
    const { user, feedIdeas } = this.props;
    console.log('Rendering feed posts:', feedIdeas)
    return (
      <div>
        HOME PAGE
        <div className="postFeed">
          {
            feedIdeas &&
            feedIdeas.length ? 
            feedIdeas.map((post,i) => <IdeaItem key={i} id={i} type="feed" post={post}/>) :
            <p>No Ideas!</p>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  feedIdeas: state.ideasState.feedIdeas
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchFeedIdeas, fetchDBUser })
)(HomePage);
