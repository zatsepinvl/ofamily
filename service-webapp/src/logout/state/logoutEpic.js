import {combineEpics} from 'redux-observable';
import {createApiEpic} from "../../common/apiEpic";
import {LOGOUT, setLogout} from "./logoutReducer";

export const requestLogoutEpic = createApiEpic(
    LOGOUT,
    (api, action) => api.post(`/api/logout`, action.payload)
        .map(resp => setLogout({success: true}))
);


export const logoutEpic = combineEpics(
    requestLogoutEpic
);