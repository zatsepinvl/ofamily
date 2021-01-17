import {handleError} from "../app/state/errorReducer";
import {createAction} from "./commonState";

export const defaultFallback = handleError();
export const emptyAction = createAction('OPERATION_SUCCESS');
export const createApiEpic = (type, request, next, fallback = defaultFallback) =>
    (action$, store, {api}) => {
        return action$.ofType(type)
            .switchMap(action => {
                return request(api, action, store)
                    .map(resp => ((next && next(resp)) || ((resp.type && resp) || emptyAction)))
                    .catch(fallback)
            })
    };
