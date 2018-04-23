import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_IDEA } from '../../constants';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';
import { fetchFeedIdeas, fetchDBUser } from '../../actions';

class HomePage extends Component {  
  componentDidMount = () => {
    this.props.fetchFeedIdeas();
  }

  render() {
    const { user, feedIdeas } = this.props;
    console.log('Rendering feed ideas:', feedIdeas)
    return (
      <div>
        HOME PAGE
        <div>
          {
            feedIdeas &&
            feedIdeas.length ? 
            feedIdeas.map((idea,i) => <IdeaItem key={i} id={i} type="feed" idea={idea}/>) :
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
