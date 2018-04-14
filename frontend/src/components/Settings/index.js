import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import withAuthorization from '../Session/withAuthorization';
import { authCondition } from '../../constants';
import { updateDBUser, deleteAccount } from '../../actions';

class SettingsPage extends Component {
	constructor(props) {
		super(props);

		console.log('Props:', this.props);
		this.state = {
			firstName: this.props.firstName,
			lastName: this.props.lastName,
			email: this.props.email
		}
	}
	

	onChange = (event) => {
		event.preventDefault();
		this.setState({ [event.target.id]: event.target.value });
	}

	onSubmit = (event) => {
		event.preventDefault();
		const { firstName, lastName, email } = this.state;
		const { user } = this.props;
		this.props.updateDBUser({
			firstName: firstName || user.firstName,
			lastName: lastName || user.lastName,
			email: email || user.email,
		})
	}

	render() {
		console.log('Settings State:', this.state)
		// TODO: Make settings page an HTML Form
		return (
			<div>
				<form >
					<h4>Account Settings</h4>
					<hr></hr>
					<div>
						<p>First Name</p>
						<p>Last Name</p>
						<p>Email</p>
					</div>
					<div >
						<input type="text" id="firstName" onChange={this.onChange} value={this.state.firstName}/><br/>
						<input type="text" id="lastName" onChange={this.onChange} value={this.state.lastName}/><br/>
						<input type="email" id="email" onChange={this.onChange} value={this.state.email}/><br/>
					</div>
					<div >
						{ !!this.state.error ? <p style={{'color': 'red'}}>ERROR: {this.state.error}</p> : null }
					</div>
					<input type='submit' name='submit' value='Update' onClick={this.onSubmit} />
					<input type="button" value="Delete Account" onClick={e => this.props.deleteAccount()} />
				</form>
			</div>
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