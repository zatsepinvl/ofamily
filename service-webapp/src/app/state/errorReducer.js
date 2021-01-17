import {Observable} from 'rxjs/Observable';

export const FETCH_ERROR = 'FETCH_ERROR';

export const logError = (error, request) => ({type: FETCH_ERROR, error: error});

export const handleError = (logger) =>
    error => {
        if (!!logger) {
            return Observable.concat(
                Observable.of(logger(error)),
                Observable.of(logError(error))
            )
        }
        else {
            return Observable.of(logError(error))
        }
    };

export const errorReducer = (state = [], {type, error}) => {
    switch (type) {
        case FETCH_ERROR:
            console.error('[LOG_ERROR]' + error);
            state.push({...error});
            return state;
        default:
            return state;
    }
};