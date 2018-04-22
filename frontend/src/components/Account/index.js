import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link } from 'react-router-dom';
import { CREATE_IDEA } from '../../constants';
import withAuthorization from '../Session/withAuthorization';
import IdeaItem from '../Common/IdeaItem';
import { fetchUserIdeas, fetchDBUser } from '../../actions';

class AccountPage extends React.Component {
  componentDidMount = () => this.props.fetchUserIdeas();

  render() {
    const { user, userIdeas } = this.props;
    console.log('Rendering userIdeas: ', userIdeas)
    return (
      <div>
        <div>
          {
            userIdeas &&
            userIdeas.length ?
            userIdeas.map((idea,i) => <IdeaItem key={i} id={idea._id} type="user" idea={idea}/>) :
            <p>You have created no ideas!</p>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.sessionState.user,
  userIdeas: state.ideasState.userIdeas,
});

export default compose(
  withAuthorization((authUser) => !!authUser),
  connect(mapStateToProps, { fetchUserIdeas, fetchDBUser })
)(AccountPage);
