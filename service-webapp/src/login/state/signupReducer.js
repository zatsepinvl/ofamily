import {createAction, createErrorAction} from "../../common/commonState";

export const SET_SIGNUP = 'SET_SIGNUP';
export const SIGNUP_REQUEST = "SIGNUP_REQUEST";
export const SIGNUP_ERROR = 'SIGNUP_ERROR';

export const signupRequest = createAction(SIGNUP_REQUEST);
export const setSignup = createAction(SET_SIGNUP);
export const signupError = createErrorAction(SIGNUP_ERROR);

const signupReducer = (state = {}, {type, payload, error}) => {
    switch (type) {
        case SIGNUP_REQUEST:
            return {signing: true};
        case SET_SIGNUP:
            return {...payload};
        case SIGNUP_ERROR:
            return {error: error};
        default:
            return state;
    }
};

export default signupReducer;