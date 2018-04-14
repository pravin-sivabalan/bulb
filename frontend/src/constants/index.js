export const HOME = '/';
export const SIGN_UP = '/signup';
export const LOGIN = '/login';
export const PASSWORD_FORGET = '/pw-forget';
export const ACCOUNT = '/account';
export const SETTINGS = '/settings';
export const CHAT = '/chat';
export const CREATE_IDEA = '/post/create';
export const DISPLAY_IDEAS = '/posts'
export const SUPPORT = '/support';
export const TERMS = '/terms';
export const ABOUTUS = '/aboutUs'
export const authCondition = (authUser) => !!authUser;
export default {
	SIGN_UP,
	LOGIN,
	PASSWORD_FORGET,
	CHAT,
	HOME,
	ACCOUNT,
	SETTINGS,
	CREATE_IDEA,
	DISPLAY_IDEAS,
	SUPPORT,
	TERMS,
	ABOUTUS,
	authCondition

}