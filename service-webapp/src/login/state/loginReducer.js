import {createAction, createErrorAction} from "../../common/commonState";

export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const TRY_LOGIN_REQUEST = "TRY_LOGIN_REQUEST";
export const TRY_LOGIN_ERROR = "TRY_LOGIN_ERROR";
export const SET_LOGIN = 'SET_LOGIN';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const loginRequest = createAction(LOGIN_REQUEST);
export const tryLoginRequest = createAction(TRY_LOGIN_REQUEST);
export const tryLoginError = createAction(TRY_LOGIN_ERROR);
export const setLogin = createAction(SET_LOGIN);
export const loginError = createErrorAction(LOGIN_ERROR);

const loginReducer = (state = {}, {type, payload, error}) => {
    switch (type) {
        case LOGIN_REQUEST:
        case TRY_LOGIN_REQUEST:
            return {logging: true};
        case TRY_LOGIN_ERROR:
            return {};
        case LOGIN_ERROR:
            if (error.status === 401) {
                error.message = 'Invalid email or password'
            }
            return {error: error};
        case SET_LOGIN:
            return {...payload};
        default:
            return state;
    }
};
export default loginReducer;