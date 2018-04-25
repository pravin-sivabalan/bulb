import axios from 'axios';

// Idea actions
export const GLOBAL_FEED_SET = 'GLOBAL_FEED_SET';
export const GLOBAL_FEED_ADD = 'GLOBAL_FEED_ADD';
export const GLOBAL_FEED_REMOVE = 'GLOBAL_FEED_REMOVE';
export const GLOBAL_FEED_ERROR = 'GLOBAL_FEED_ERROR';

export const FOLLOW_FEED_SET = 'FOLLOW_FEED_SET';
export const FOLLOW_FEED_ADD = 'FOLLOW_FEED_ADD';
export const FOLLOW_FEED_REMOVE = 'FOLLOW_FEED_REMOVE';
export const FOLLOW_FEED_ERROR = 'FOLLOW_FEED_ERROR';

export const USER_FEED_SET = 'USER_FEED_SET';
export const USER_FEED_ADD = 'USER_FEED_ADD';
export const USER_FEED_REMOVE = 'USER_FEED_REMOVE';
export const USER_FEED_ERROR = 'USER_FEED_ERROR';

// Session actions
export const AUTH_TOKEN_SET = 'AUTH_TOKEN_SET';
export const DB_USER_SET = 'DB_USER_SET';

// Idea creators
export const onSetGlobalFeed = (feed) => ({ type: GLOBAL_FEED_SET, feed });
export const onAddGlobalFeed = (idea) => ({ type: GLOBAL_FEED_ADD, idea });
export const onRemoveGlobalFeed = (idea) => ({ type: GLOBAL_FEED_REMOVE, idea });
export const onErrorGlobalFeed = (error) => ({ type: GLOBAL_FEED_SET, error });

export const onSetFollowFeed = (feed) => ({ type: FOLLOW_FEED_SET, feed });
export const onAddFollowFeed = (idea) => ({ type: FOLLOW_FEED_ADD, idea });
export const onRemoveFollowFeed = (idea) => ({ type: FOLLOW_FEED_REMOVE, idea });
export const onErrorFollowFeed = (error) => ({ type: FOLLOW_FEED_SET, error });

export const onSetUserFeed = (feed) => ({ type: USER_FEED_SET, feed });
export const onAddUserFeed = (idea) => ({ type: USER_FEED_ADD, idea });
export const onRemoveUserFeed = (idea) => ({ type: USER_FEED_REMOVE, idea });
export const onErrorUserFeed = (error) => ({ type: USER_FEED_SET, error });

// Session creators
export const onSetDBUser = (user) => ({ type: DB_USER_SET, user });
export const onSetAuthToken = (token) => ({ type: AUTH_TOKEN_SET, token });

// Idea handlers
export const fetchGlobalFeed = () => {
	return async (dispatch, getState) => {
		if (!getIdToken()) dispatch(onSetFollowFeed([]));
		else {
			try {
				// Get DB user and update Redux store
				const feed = await fetchFeed('global');
				dispatch(onSetGlobalFeed(feed));
				return feed;
			} catch (error) {
				console.error('Error:', error.response.data.error);
				dispatch(onErrorUserFeed(error.response.data.error));
				throw error.response.data.error;
			}
		}
	}
}

export const fetchFollowFeed = () => {
	return async (dispatch, getState) => {
		if (!getIdToken()) dispatch(onSetFollowFeed([]));
		else {
			try {
				// Get DB user and update Redux store
				const feed = await fetchFeed('follow');
				dispatch(onSetFollowFeed(feed));
				return feed;
			} catch (error) {
				console.error('Error:', error.response.data.error);
				dispatch(onErrorUserFeed(error.response.data.error));
				throw error.response.data.error;
			}
		}
	}
}

export const fetchUserFeed = () => {
	return async dispatch => {
		if (!getIdToken()) dispatch(onSetUserFeed([]));
		else {
			try {
				// Get DB user and update Redux store
				const {_id} = getCurrentUser();
				const ideas = await fetchIdeas(_id);
				dispatch(onSetUserFeed(ideas));
				return ideas;
			} catch (error) {
				console.error('Error:', error.response.data.error);
				dispatch(onErrorUserFeed(error.response.data.error));
				throw error.response.data.error;
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
			const { data: {response} } = await axios.post('/api/ideas', idea, {
				headers: {"Authorization" : `Bearer ${token}`}
			})

			console.log('Created user idea:', response);
			
			dispatch(onAddUserFeed(response))
			return response;
		} catch (error) {
			console.error('Error:', error.response.data.error);
			dispatch(onErrorUserFeed(error.response.data.error));
			throw error.response.data.error;
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
				headers: {"Authorization" : `Bearer ${token}`}
			});

			console.log('Deleted user idea:', data.response);
			dispatch(onRemoveUserFeed(data.response));
			return data.response;
		} catch (error) {
			console.error('Error:', error.response.data.error);
			dispatch(onErrorUserFeed(error.response.data.error));
			throw error.response.data.error;
		}
	}
}

// Session handlers
export const createUser = user => {
	return async dispatch => {
		try {
			const { data } = await axios.post('/api/auth/signup', user);
			dispatch(onSetAuthToken(data.response.token));
			dispatch(onSetDBUser(data.response.user));
			return data;
		} catch (error) {
			console.error(error.response.data.error);
			throw error.response.data.error;
		}
	}
}


export const fetchDBUser = () => {
	return async dispatch => {
		if (!getIdToken()) dispatch(onSetDBUser(null));
		else {
			try {
				// Get DB user and update Redux store
				const user = await fetchUser();
				dispatch(onSetDBUser(user));
				return user;
			} catch (error) {
				console.error(error.response.data.error);
				throw error.response.data.error;
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
			const { data: {response} } = await axios.put(
				`/api/users/`, 
				user,
				{headers: {"Authorization" : `Bearer ${token}`}}
			)
			dispatch(onSetDBUser(response.user))
			dispatch(onSetAuthToken(response.token));
			console.log(response);
			return response;
		} catch (error) {
			console.error(error.response.data.error)
			throw error.response.data.error;
		}
	}
}

export const setAuthUser = authUser => dispatch => dispatch(onSetAuthToken(authUser));

export const deleteAccount = () => async dispatch => {
	try {
		const token = getIdToken();
		const { data } = await axios.delete(`/api/users/`,{
			headers: {"Authorization" : `Bearer ${token}`}
		});
		signOut()(dispatch);
		// dispatch(onSetAuthToken(null));
		// dispatch(onSetDBUser(null));
		console.log('Deleted user:', data.response);
	} catch (error) {
		console.error(error.response.data.error)
		throw error.response.data.error;
	}
}
	
// Miscellaneous async actions
export const fetchUser = async id => {
	try {
		// Get DB user and update Redux store
		const token = getIdToken()
		const response = await axios.get(
			`/api/users/${id}`,
			{headers: {"Authorization" : `Bearer ${token}`},}
		)
		console.log('Got User:', response.data.response);
		return response.data.response
	} catch (error) {
		console.error(error.response.data.error)
		throw error.response.data.error;
	}
}

export const fetchIdeas = async id => {
	try {
		const token = getIdToken();
		// Get DB user and input into Redux store
		console.log(`Getting user ideas w/ user id: ${id}`)
		const { data } = await axios.get(
			`/api/ideas/user/${id}`,
			{headers: {"Authorization" : `Bearer ${token}`},}
		)
		console.log('Got user ideas:', data.response);
		return data.response;
	} catch (error) {
		console.error('Error:', error.response.data.error);
		throw error.response.data.error;
	}
}

export const fetchFeed = async type => {
	try {
		const token = getIdToken();
		// Get DB user and input into Redux store
		console.log('Getting feed');
		const { data } = await axios.get(
			'/api/ideas',
			{
				params: { type },
				headers: { "Authorization" : `Bearer ${token}` }
			}
		)
		console.log('Got feed:', data.response);
		return data.response;
	} catch (error) {
		console.error('Error:', error.response.data.error);
		throw error.response.data.error;
	}
}


export const signIn = (email, password) => async dispatch => {
	const { data } = await axios.post('/api/auth/login', {email, password});
	console.log('Sign in returned data:', data.response);
	dispatch(onSetAuthToken(data.response.token));
	dispatch(onSetDBUser(data.response.user));
	return data;
}

export const signOut = () => dispatch => {
	console.log('Signing out');
	dispatch(onSetAuthToken(null));
	dispatch(onSetDBUser(null));
	console.log('Signed out');
}

export const getIdToken = () => localStorage.getItem('token');
export const getCurrentUser = () => JSON.parse(localStorage.getItem('user'));
export const localStorageChanged = (e) => (dispatch, getState) => {
	dispatch(onSetAuthToken(getIdToken()));
	dispatch(onSetDBUser(getCurrentUser()));
}