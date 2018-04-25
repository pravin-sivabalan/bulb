import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import { updateDBUser, deleteAccount } from '../../actions';
import { Form, Modal, Header, Button, Icon } from 'semantic-ui-react'

class SettingsPage extends Component {
	constructor(props) {
		super(props);

		console.log('Props:', this.props);
		this.state = {
			firstName: this.props.firstName,
			lastName: this.props.lastName,
			email: this.props.email,
			delete: false,
			submitted: false
		}
	}

	closeSubmitWindow = () => {
		this.setState({error: null})
	}

	closeConfirmWindow = () => {
		this.setState({submitted: false})
	}

	closeDeleteWindow = () => {
		this.setState({delete: false})
	}

	onChange = (event) => {
		event.preventDefault();
		this.setState({ [event.target.id]: event.target.value });
	}

	onSubmit = (event) => {
		this.setState({error: null})
		if (!this.state.firstName || !this.state.firstName.length)
			return this.setState({ error: 'First Name field cannot be blank' })
		if (!this.state.lastName || !this.state.lastName.length)
			return this.setState({ error: 'Last Name field cannot be blank' })
		if (!this.state.email || !this.state.email.length)
			return this.setState({ error: 'Email field cannot be blank' })

		event.preventDefault();
		const { firstName, lastName, email } = this.state;
		const { user } = this.props;
		this.props.updateDBUser({
			firstName: firstName || user.firstName,
			lastName: lastName || user.lastName,
			email: email || user.email,
		})
		this.setState({submitted: true})
	}

	onDelete = () => {
		this.setState({ delete: true })
	}

	deleteAccount = () => {
		console.log("in deleteAccount")
		this.setState({ delete: false })
		this.props.deleteAccount()
	}

	render() {
		console.log('Settings State:', this.state)
		// TODO: Make settings page an HTML Form
		// e => this.props.deleteAccount()
		return (
			<Form>
				<Modal open={ !!this.state.error } close={ this.closeSubmitWindow } basic size="small">
					<Header icon="announcement" content="Unfilled Fields" />
					<Modal.Content>
						<h3>{ this.state.error }</h3>
					</Modal.Content>
					<Modal.Actions>
						<Button color='green' onClick={ this.closeSubmitWindow } inverted>
							<Icon name="checkmark" /> OK
						</Button>
					</Modal.Actions>
				</Modal>
				<Modal open={ this.state.submitted } close={ this.closeConfirmWindow } basic size="small">
					<Header icon="announcement" content="Updated Information" />
					<Modal.Content>
						<h3>Your information has been updated</h3>
					</Modal.Content>
					<Modal.Actions>
						<Button color='green' onClick={ this.closeConfirmWindow } inverted>
							<Icon name="checkmark" /> OK
						</Button>
					</Modal.Actions>
				</Modal>
				<Modal open= { this.state.delete } close={ this.closeDeleteWindow } basic size="small">
					<Header icon="warning circle" content="Confirmation" />
					<Modal.Content>
						<h3>Are you sure you want to delete your account?</h3>
					</Modal.Content>
					<Modal.Actions>
						<Button color='red' onClick={ this.closeDeleteWindow } inverted>
							<Icon name="remove" /> Cancel
						</Button>
						<Button color='green' onClick={ this.deleteAccount } inverted>
							<Icon name="checkmark" /> Confirm
						</Button>
					</Modal.Actions>
				</Modal>
				<h1 className="header">Account Settings</h1>
				<Form.Field required>
					<label>First Name</label>
					<input placeholder="First Name" type="text" id="firstName" onChange={this.onChange} value={this.state.firstName}/><br/>
				</Form.Field>
				<br />
				<Form.Field required>
					<label>Last Name</label>
					<input placeholder="Last Name" type="text" id="lastName" onChange={this.onChange} value={this.state.lastName}/><br/>
				</Form.Field>
				<br />
				<Form.Field required>
					<label>Email</label>
					<input placeholder="Email" type="email" id="email" onChange={this.onChange} value={this.state.email}/><br/>
				</Form.Field>
				<div className="wrapper">
					<Form.Button type="submit" name="submit" value="Update" onClick={this.onSubmit}>Submit</Form.Button>
				</div>
				<div className="wrapper">
					<Form.Button type="button" value="Delete Account" onClick={this.onDelete}>Delete Account</Form.Button>
				</div>
			</Form>
		);
	}
}



const mapStateToProps = (state) => ({
	...state.sessionState.user,
});

export default compose(
  	withAuthorization(authCondition),
	connect(mapStateToProps, { updateDBUser, deleteAccount })
)(SettingsPage);