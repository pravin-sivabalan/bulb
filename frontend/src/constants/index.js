export const HOME = '/';
export const SIGN_UP = '/signup';
export const LOGIN = '/login';
export const PASSWORD_FORGET = '/pw-forget';
export const ACCOUNT = '/account';
export const SETTINGS = '/settings';
export const CREATE_IDEA = '/ideas/create';
export const DISPLAY_IDEAS = '/ideas'
export const authCondition = (authUser) => !!authUser;
export default {
	SIGN_UP,
	LOGIN,
	PASSWORD_FORGET,
	HOME,
	ACCOUNT,
	SETTINGS,
	CREATE_IDEA,
	DISPLAY_IDEAS,
	authCondition
}