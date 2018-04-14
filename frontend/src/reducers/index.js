import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import ideasReducer from './ideas'

export default combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  ideasState: ideasReducer
});
