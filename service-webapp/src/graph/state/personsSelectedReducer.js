import {createAction} from "../../common/commonState";

export const SELECT_PERSON = 'SELECT_PERSON';
export const selectPerson = createAction(SELECT_PERSON);

export const personsSelectedReducer = (state = {}, {type, payload}) => {
    switch (type) {
        case SELECT_PERSON:
            return {...payload};
        default:
            return state;
    }
};
