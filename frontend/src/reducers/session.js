import { AUTH_TOKEN_SET, DB_USER_SET } from '../actions';

function sessionReducer(state = {
  token: JSON.parse(localStorage.getItem('token')) || null,
  user: JSON.parse(localStorage.getItem('user')) || null
}, action) {
  switch(action.type) {
    case AUTH_TOKEN_SET : {
      localStorage.setItem('token', action.token)
      return {
        ...state,
        token: action.token
      }
    }
    case DB_USER_SET : {
      localStorage.setItem('user', JSON.stringify(action.user))
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user
        }
      }
    }
    default : return state;
  }
}

export default sessionReducer;