//step: {type, map: action => Observable: action}
export const createOnEpic = (next) => {
    return (action$, store, {api}) => {
        return action$
            .filter(action => next && next.type === action.type)
            .flatMap(action => {
                return next.flatMap(action, store, api);
            });
    };
};

