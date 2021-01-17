import {combineEpics} from 'redux-observable';
import {LOGIN_REQUEST, loginError, setLogin, TRY_LOGIN_REQUEST, tryLoginError} from "./loginReducer";
import {createApiEpic} from "../../common/apiEpic";
import {handleError} from "../../app/state/errorReducer";

export const requestLoginEpic = createApiEpic(
    LOGIN_REQUEST,
    (api, action) => api.post(`/api/login`, action.payload),
    setLogin,
    handleError(loginError)
);

export const requestTryLoginEpic = createApiEpic(
    TRY_LOGIN_REQUEST,
    (api, action) => api.post(`/api/login/jwt`, action.payload),
    setLogin,
    handleError(tryLoginError)
);


export const loginEpic = combineEpics(
    requestLoginEpic,
    requestTryLoginEpic
);