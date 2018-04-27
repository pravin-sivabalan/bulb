import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Divider, Header } from 'semantic-ui-react';

class IdeaComment extends Component {

   parseCreate = (val) => {
      let date = val.substring(0, val.indexOf('T')).split('-')
      let time = val.substring(val.indexOf('T') + 1, val.indexOf('.')).split(':')
      let hour = parseInt(time[0]) % 12
      let finalString = date[1] + '/' + date[2] + '/' + date[0] + ' at ' + hour + ':' + time[1]
      if (parseInt(time[0]) >= 12)
         finalString += ' PM'
      else
         finalString += ' AM'
      return finalString
   }

   render() {
      const { comment } = this.props;
      return (
         <Card fluid>
            <Card.Content>
               <Header dividing >
                  <Link to={`/user/${comment._user._id}`}>
                     {`${comment._user.firstName} ${comment._user.lastName}`}
                  </Link>
               </Header>
               <Card.Content description={comment.comment} />
            </Card.Content>
            <Card.Content extra>
               Created: {this.parseCreate(comment.createdAt)}
            </Card.Content>
         </Card>
      );
   }
}

export default IdeaComment;