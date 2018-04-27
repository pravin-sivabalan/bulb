import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Container, Comment, Card, Button, Icon, Label, Header, Form, TextArea } from 'semantic-ui-react';
import { fetchIdea, createComment } from '../../actions';
import { IdeaComment, IdeaItem } from '../Common';
import withAuthorization from '../Session/withAuthorization';

class IdeaPage extends Component {
  constructor(props) {
		super(props);
		console.log('User Page Props:', props);
		this.state = {
         idea: null,
         comment: '',
         error: null
		}
  }

  componentWillMount = async () => {
      try {
         const id = this.props.match.params.id;
         const idea = await fetchIdea(id);
         console.log('Got idea:', idea);
         this.setState({idea});
      } catch (error) {
         this.setState({error});
      }
   }
   
   handleSubmit = async e => {
      const id = this.props.match.params.id;
      const { comment } = this.state;
      // console.log('Going to comment:', comment);
      const idea = await createComment(id, comment);
      this.setState({idea: idea})
   }

  render() {
		const { idea } = this.state;
      console.log('IdeaPage state:', this.state);
      
      if (!idea) return <div>Loading...</div>;

      return (
         <Container style={{ marginTop: '30px' }}>
            <Card.Group>
               <Card fluid>
                  <Card.Content>
                     <IdeaItem idea={idea} type='feed' />
                  </Card.Content>
               </Card>
               <Card fluid>
                  <Card.Content>
                     <Header dividing>Comments</Header>
                     <Card.Content>
                        {idea.comments.map((comment, i) => <IdeaComment key={i} comment={comment} /> )}
                        <Card fluid>
                           <TextArea autoHeight placeholder='Add a comment' onChange={e => this.setState({comment: e.target.value})} />
                           <Button content='Add Comment' labelPosition='left' icon='edit' primary onClick={this.handleSubmit} />
                        </Card>
                     </Card.Content>
                  </Card.Content>
               </Card>
            </Card.Group>
         </Container>
      );
  }
}

export default compose(
	withRouter,
	withAuthorization(),
	// connect(null, { followUser, unFollowUser })
)(IdeaPage);
