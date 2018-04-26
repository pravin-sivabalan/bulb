import React, { Component } from 'react';
import { Card, Divider, Header } from 'semantic-ui-react';

class IdeaComment extends Component {
   render() {
      const { comment } = this.props;
      return (
         <Card fluid>
            <Card.Content>
               <Header dividing >{`${comment._user.firstName} ${comment._user.lastName}`}</Header>
               <Card.Content description={comment.comment} />
            </Card.Content>
            <Card.Content extra>
               Created at: {comment.createdAt}
            </Card.Content>
         </Card>
      );
   }
}

export default IdeaComment;