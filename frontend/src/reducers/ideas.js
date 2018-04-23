import { FEED_IDEAS_SET, FEED_IDEAS_ERROR, USER_IDEAS_SET, USER_IDEA_DELETED, USER_IDEAS_ADD, USER_IDEAS_ERROR } from '../actions';

function ideasReducer(state = {
	feedIdeas: [],
	feedIdeasError: null,
	userIdeas: [],
	userIdeasError: null
}, action) {
	switch (action.type) {
		case FEED_IDEAS_SET: {
			return {
				...state,
				feedIdeas: action.feedIdeas
			}
		}
		case FEED_IDEAS_ERROR: {
			return {
				...state,
				feedIdeasError: action.error
			}
		}
		case USER_IDEAS_SET: {
			return {
				...state,
				userIdeas: action.userIdeas
			}
		}
		case USER_IDEA_DELETED: {
			return {
				...state,
				userIdeas: state.userIdeas.filter(item => item._id !== action._id)
			}
		}
		case USER_IDEAS_ADD: {
			return {
				...state,
				userIdeas: [...state.userIdeas, action.idea]
			}
		}
		case USER_IDEAS_ERROR: {
			return {
				...state,
				userIdeasError: action.error
			}
		}
		default:
			return state;
	}
}

export default ideasReducer;