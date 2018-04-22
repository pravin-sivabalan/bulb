import { AUTH_TOKEN_SET, DB_USER_SET } from '../actions';

function sessionReducer(state = {
  token: localStorage.getItem('token') || null,
  user: JSON.parse(localStorage.getItem('user')) || null
}, action) {
  switch(action.type) {
    case AUTH_TOKEN_SET : {
      action.token ? localStorage.setItem('token', action.token) : localStorage.removeItem('token')
      return {
        ...state,
        token: action.token
      }
    }
    case DB_USER_SET : {
      action.user ? localStorage.setItem('user', JSON.stringify(action.user)) : localStorage.removeItem('user')
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