import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { Container, ItemGroup, Divider, Header } from 'semantic-ui-react';
import { CREATE_IDEA } from '../../constants';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';
import { fetchUserFeed, fetchDBUser } from '../../actions';

class AccountPage extends React.Component {
  componentDidMount = () => this.props.fetchUserFeed();

  render() {
    const { user, userFeed } = this.props;
    console.log('Rendering userFeed: ', userFeed)
    return (
      <Container>
        <Header>Your Posts:</Header>
        <Divider/>
        
        <ItemGroup divided>
          {
            userFeed &&
            userFeed.length ?
            userFeed.map((idea,i) => <IdeaItem key={i} id={idea._id} type="user" idea={idea}/>) :
            <p>You have created no ideas!</p>
          }
        </ItemGroup>
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  userFeed: state.ideasState.userFeed,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchUserFeed, fetchDBUser })
)(AccountPage);
