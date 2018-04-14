import axios from 'axios';

// Idea actions
export const FEED_IDEAS_SET = 'FEED_IDEAS_SET';
export const FEED_IDEAS_ERROR = 'FEED_IDEAS_ERROR';
export const USER_IDEAS_SET = 'USER_IDEAS_SET';
export const USER_IDEAS_ADD = 'USER_IDEAS_ADD';
export const USER_IDEAS_ERROR = 'USER_IDEAS_ERROR';
export const USER_IDEA_DELETED = 'USER_IDEA_DELETED';

// Session actions
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';
export const DB_USER_SET = 'DB_USER_SET';

// Users actions
export const USERS_SET = 'USERS_SET';

// Idea creators
export const onSetFeedIdeas = (feedIdeas) => ({ type: FEED_IDEAS_SET, feedIdeas });
export const onErrorFeedIdeas = (error) => ({ type: FEED_IDEAS_ERROR, error });
export const onSetUserIdeas = (userIdeas) => ({ type: USER_IDEAS_SET, userIdeas });
export const onAddUserIdea = (idea) => ({ type: USER_IDEAS_ADD, idea });
export const onDeleteUserIdea = (ideaId) => ({ type: USER_IDEA_DELETED, ideaId });
export const onErrorUserIdeas = (error) => ({ type: USER_IDEAS_ERROR, error });

// Session creators
export const onSetDBUser = (user) => ({ type: DB_USER_SET, user });
export const onSetAuthToken = (token) => ({ type: AUTH_TOKEN_SET, token });

// Idea handlers
export const fetchFeedIdeas = (params) => {
	return async (dispatch, getState) => {
		try {
			const token = getIdToken();
			const { data } = await axios.get(
				`/api/ideas/`,
				{
				  headers: {token},
				  params
				}
			  )
			  
			console.log('Got ideas feed:', data.responseData);
			dispatch(onSetFeedIdeas(data.responseData));
			
		} catch (error) {
			console.error('Error:', error.response.data.error);
			dispatch(onErrorFeedIdeas(error.response.data.error));
		}
		
	}
}

export const fetchUserIdeas = () => {
	return async dispatch => {
		if (!getIdToken()) dispatch(onSetUserIdeas([]));
		else {
			try {
				// Get DB user and update Redux store
				const ideas = await fetchIdeas();
				dispatch(onSetUserIdeas(ideas));
			} catch (error) {
				console.error('Error:', error.response.data.error);
				dispatch(onErrorUserIdeas(error.response.data.error));
			}
		}
	}
}

export const createIdea = (idea) => {
	return async dispatch => {
		try {
			const token = getIdToken();
			// Get DB user and input into Redux store
			console.log(`Creating user idea:`, idea)
			const { data: {responseData} } = await axios.post('/api/ideas', idea, {
				headers: {token}
			})

			console.log('Created user idea:', responseData);
			
			dispatch(onAddUserIdea(responseData))
		} catch (error) {
			console.error('Error:', error.response.data.error);
			dispatch(onErrorUserIdeas(error.response.data.error));
		}
	}
}

export const deleteIdea = (id) => {
	return async dispatch => {
		try {
			const token = getIdToken()
			// Get DB user and input into Redux store
			console.log(`User: deleting idea: ${id}`)
			const { data } = await axios.delete(`/api/ideas/${id}`,{
				headers: {token}
			});

			console.log('Deleted user idea:', data);
			// fetchUserIdeas();
			dispatch(onDeleteUserIdea(id));
		} catch (error) {
			console.error('Error:', error.response.data.error);
			dispatch(onErrorUserIdeas(error.response.data.error));
		}
	}
}

// Session handlers
export const createUser = user => {
	return async dispatch => {
		try {
			const { data } = await axios.post('/api/auth/signup', user);
			dispatch(onSetAuthToken(data.token));
			dispatch(onSetDBUser(data.user));
			return data;
		} catch (error) {
			console.error(error)
			return error
		}
	}
}


export const fetchDBUser = () => {
	return async dispatch => {
		if (!getIdToken())
			dispatch(onSetDBUser({}));
		else {
			try {
				// Get DB user and update Redux store
				const user = await fetchUser();
				dispatch(onSetDBUser(user));
			} catch (error) {
				console.error(error);
				return error;
			}
		}
	}
}

export const updateDBUser = (user) => {
	return async dispatch => {
		try {
			// Get DB user and update Redux store
			const token = getIdToken()
			console.log('Updating user:', 'to:', user)
			const response = await axios.put(
				`/api/users/`, 
				user,
				{headers: {token}}
			)
			dispatch(onSetDBUser(user))
			console.log(response.data.responseData)
			return response.data.responseData
		} catch (error) {
			console.error(error)
			return error
		}
	}
}

export const setAuthUser = authUser => dispatch => dispatch(onSetAuthToken(authUser));

export const deleteAccount = () => async dispatch => {
	try {
		const token = getIdToken()
		const { data } = await axios.delete(`/api/users/`,{
			headers: {token}
		});
		signOut();
		dispatch(onSetAuthToken(null));
		console.log('Deleted user:', data.responseData);
	} catch (error) {
		console.error('Error:', error);
	}
}
	
// Miscellaneous async actions
export const fetchUser = async id => {
	try {
		// Get DB user and update Redux store
		const token = getIdToken()
		const response = await axios.get(
			`/api/users/${id}`,
			{headers: {token}}
		)
		console.log('Got User:', response.data.responseData);
		return response.data.responseData
	} catch (error) {
		console.error(error)
		return error;
	}
}

export const fetchIdeas = async id => {
	try {
		const token = getIdToken()
		// Get DB user and input into Redux store
		console.log(`Getting user ideas w/ user id: ${id}`)
		const { data } = await axios.get(
			`/api/ideas/user/${id}`,
			{headers: {token}}
		)
		console.log('Got user ideas:', data.responseData);
		return data.responseData;
	} catch (error) {
		console.error('Error:', error.response.data.error);
		return error.response.data.error;
	}
}


export const signIn = (email, password) => async dispatch => {
	const { data } = await axios.post('/api/auth/login', {email, password});
	console.log('Sign in returned data:', data);
	dispatch(onSetAuthToken(data.token));
	dispatch(onSetDBUser(data.user));
	return data;
}

export const signOut = () => dispatch => {
	// localStorage.removeItem('token');
	// localStorage.removeItem('user');
	console.log('Signing out');
	dispatch(onSetAuthToken(null));
	dispatch(onSetDBUser(null));
	console.log('Signed out');
}

export const getIdToken = () => localStorage.getItem('authToken');