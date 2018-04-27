import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Link, withRouter } from 'react-router-dom';
import { Container, Comment, Card, Button, Icon, Label, Header, Form, TextArea } from 'semantic-ui-react';
import { fetchIdea, createComment, likeIdea, unLikeIdea } from '../../actions';
import { IdeaComment, IdeaItem } from '../Common';
import withAuthorization from '../Session/withAuthorization';

class IdeaPage extends Component {
  constructor(props) {
		super(props);
      console.log('User Page Props:', props);
		this.state = {
         idea: null,
         liked: false,
         comment: '',
         error: null
		}
  }

  componentWillMount = async () => {
      try {
         const id = this.props.match.params.id;
         const idea = await fetchIdea(id);
         console.log('Got idea:', idea);
         this.setState({
            idea,
            liked: this.props.user.likes.find(like => like._id === idea._id)
         });
      } catch (error) {
         this.setState({error});
      }
   }

   handleLike = async e => {
		await this.props.likeIdea(this.state.idea._id);
		this.setState({ 
         liked: true,
         idea: { 
            ...this.state.idea,
            likes: this.state.idea.likes+1
         }
      });
		console.log('IdeaItem liked an idea');
	}

	handleUnLike = async e => {
		console.log('Unliking idea');
      await this.props.unLikeIdea(this.state.idea._id);
      this.setState({ 
         liked: false,
         idea: { 
            ...this.state.idea,
            likes: this.state.idea.likes-1
         }
      });
		console.log('IdeaItem disliked an idea');
	}
   
   handleSubmit = async e => {
      const id = this.props.match.params.id;
      const { comment } = this.state;
      const idea = await createComment(id, comment);
      this.setState({idea: idea})
   }

  render() {
    console.log('IdeaPage state:', this.state);
		const { idea, liked } = this.state;      
    if (!idea) return <div>Loading...</div>;
    const sameUser = this.props.user._id === idea._user._id;
		console.log('IdeaPage props:', this.props);

		const likeButton = 
			<Button onClick={this.handleLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					<Icon name='empty heart' />
					Like
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>

		const unLikeButton = 
			<Button onClick={this.handleUnLike} compact floated='left' size='small' as='div' labelPosition='right' style={{marginTop: 0}} >
				<Button compact color='red' size='small' >
					<Icon name='heart' />
					Unlike
				</Button>
				<Label as='a' basic color='red' pointing='left'>{idea.likes}</Label>
			</Button>
      
      

      return (
         <Container style={{ marginTop: '30px' }}>
            <Card.Group>
               <Card fluid>
                  <Card.Content>
                     <Card fluid>
                        <Card.Content>
                           <Header as={Link} to={`/idea/${idea._id}`} dividing >{idea.title}</Header>
                        <Card.Content description={idea.description} />
                        </Card.Content>
                        <Card.Content extra >
                           {
                              (!sameUser) &&
                              (liked ? unLikeButton : likeButton)
                           }
                           <Header floated='right' dividing >
                              Posted By: 
                              <Link to={`/user/${idea._user._id}`}> {`${idea._user.firstName} ${idea._user.lastName}`}</Link>
                           </Header>
                        </Card.Content>
                     </Card>
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

const mapStateToProps = (state) => ({
	user: state.sessionState.user
});

export default compose(
	withAuthorization(),
	connect(mapStateToProps, { likeIdea, unLikeIdea })
)(IdeaPage);
