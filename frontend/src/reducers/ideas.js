import {
	GLOBAL_FEED_SET,
	GLOBAL_FEED_ADD,
	GLOBAL_FEED_REMOVE,
	GLOBAL_FEED_ERROR,
	FOLLOW_FEED_SET,
	FOLLOW_FEED_ADD,
	FOLLOW_FEED_REMOVE,
	FOLLOW_FEED_ERROR,
	USER_FEED_SET,
	USER_FEED_ADD,
	USER_FEED_REMOVE,
	USER_FEED_ERROR
} from '../actions';

function ideasReducer(state = {
	globalFeed: [],
	globalFeedError: null,
	followFeed: [],
	followFeedError: null,
	userFeed: [],
	userFeedError: null,
}, action) {
	switch (action.type) {
		// Global feed
		case GLOBAL_FEED_SET: {
			return {
				...state,
				globalFeed: action.feed
			}
		}
		case GLOBAL_FEED_ADD: {
			return {
				...state,
				globalFeed: [...state.globalFeed, action.idea]
			}
		}
		case GLOBAL_FEED_REMOVE: {
			return {
				...state,
				globalFeed: state.globalFeed.filter(idea => idea._id !== action.idea._id)
			}
		}
		case GLOBAL_FEED_ERROR: {
			return {
				...state,
				globalFeedError: action.error
			}
		}

		// Follow Feed
		case FOLLOW_FEED_SET: {
			return {
				...state,
				followFeed: action.feed
			}
		}
		case FOLLOW_FEED_ADD: {
			return {
				...state,
				followFeed: [...state.followFeed, action.idea]
			}
		}
		case FOLLOW_FEED_REMOVE: {
			return {
				...state,
				followFeed: state.followFeed.filter(idea => idea._id !== action.idea._id)
			}
		}
		case FOLLOW_FEED_ERROR: {
			return {
				...state,
				followFeedError: action.error
			}
		}

		// User feed
		case USER_FEED_SET: {
			return {
				...state,
				userFeed: action.feed
			}
		}
		case USER_FEED_ADD: {
			return {
				...state,
				userFeed: [...state.userFeed, action.idea]
			}
		}
		case USER_FEED_REMOVE: {
			return {
				...state,
				userFeed: state.userFeed.filter(idea => idea._id !== action.idea._id)
			}
		}
		case USER_FEED_ERROR: {
			return {
				...state,
				userFeedError: action.error
			}
		}
		
		default:
			return state;
	}
}

export default ideasReducer;