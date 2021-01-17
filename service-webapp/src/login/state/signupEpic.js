import {combineEpics} from 'redux-observable';
import {setSignup, SIGNUP_REQUEST, signupError} from "./signupReducer";
import {createApiEpic} from "../../common/apiEpic";
import {handleError} from "../../app/state/errorReducer";

export const requestSignupEpic = createApiEpic(
    SIGNUP_REQUEST,
    (api, action) => api.post(`/api/signup`, action.payload)
        .map(response => ({...response, success: true})),
    setSignup,
    handleError(signupError)
);

export const signupEpic = combineEpics(
    requestSignupEpic
);