import { combineReducers } from 'redux';
import sessionReducer from './session';
import ideasReducer from './ideas'

export default combineReducers({
  sessionState: sessionReducer,
  ideasState: ideasReducer
});
