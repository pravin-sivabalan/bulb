import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Tab, Container, Item } from 'semantic-ui-react';
import { CREATE_IDEA } from '../../constants';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';
import { fetchFollowFeed, fetchGlobalFeed, fetchUserFeed, fetchDBUser } from '../../actions';

class HomePage extends Component {  
  componentWillMount = () => {
    this.props.fetchGlobalFeed();
    this.props.fetchFollowFeed();
    this.props.fetchUserFeed();
    this.props.fetchDBUser();
  }

  handleChange = (e, data) => {
    switch (data.activeIndex) {
      case 0:
        this.props.fetchGlobalFeed();
        break;
      case 1:
        this.props.fetchFollowFeed();
        break;
      case 2:
        this.props.fetchUserFeed();
        break;

      default:
        break;
    }
  };

  render() {
    const { user, globalFeed, followFeed, userFeed } = this.props;
    console.log('Rendering feed ideas:', globalFeed);
    const panes = [
      { menuItem: 'Global Feed',
        render: () => (
          <Tab.Pane key='globalTab' active attached={false} >
            <Item.Group divided>
              {
                globalFeed &&
                globalFeed.length ? 
                  globalFeed.map((idea,i) => <IdeaItem key={i} id={i} type="feed" idea={idea}/>) :
                  <p>No Ideas!</p>
              }
            </Item.Group>
          </Tab.Pane>
        ) 
      },
      { menuItem: 'Follow Feed',
        render: () => (
          <Tab.Pane key='followTab' attached={false} >
            <Item.Group divided>
              {
                followFeed &&
                followFeed.length ? 
                  followFeed.map((idea,i) => <IdeaItem key={i} id={i} type="feed" idea={idea}/>) :
                  <p>No Ideas!</p>
              }
            </Item.Group>
          </Tab.Pane>
        )
      },
      { menuItem: 'User Feed',
        render: () => (
          <Tab.Pane key='userTab' attached={false} >
            <Item.Group divided>
              {
                userFeed &&
                userFeed.length ? 
                  userFeed.map((idea,i) => <IdeaItem key={i} id={i} type="feed" idea={idea}/>) :
                  <p>No Ideas!</p>
              }
            </Item.Group>
          </Tab.Pane>
        )
      },
    ];
    return (
      <Container>
        <Tab
          onTabChange={this.handleChange}
          defaultActiveIndex={0}
          menu={{ secondary: true, pointing: true }}
          panes={panes}
        />
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  ...state.ideasState
});

export default compose(
  withAuthorization(),
  connect(mapStateToProps, { fetchFollowFeed, fetchGlobalFeed, fetchUserFeed, fetchDBUser })
)(HomePage);
