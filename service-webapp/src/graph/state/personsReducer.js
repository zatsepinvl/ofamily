import * as _ from 'lodash';
import {createAction} from "../../common/commonState";

//epic actions
export const FETCH_PERSONS = "FETCH_PERSONS";
export const UPDATE_PERSON = "UPDATE_PERSON";
export const CREATE_PERSON = "CREATE_PERSON";
export const FETCH_PERSON = "GET_PERSON";
export const DELETE_PERSON = "DELETE_PERSON";

export const fetchPersons = createAction(FETCH_PERSONS);
export const fetchPerson = createAction(FETCH_PERSON);
export const createPerson = createAction(CREATE_PERSON);
export const updatePerson = createAction(UPDATE_PERSON);
export const deletePerson = createAction(DELETE_PERSON);

//store actions
export const SET_PERSONS = "SET_PERSONS";
export const SET_PERSON = "SET_PERSON";
export const REMOVE_PERSON = "REMOVE_PERSON";

export const setPersons = createAction(SET_PERSONS);
export const setPerson = createAction(SET_PERSON);
export const removePerson = createAction(REMOVE_PERSON);

export const personsReducer = (state = [], {type, payload}) => {
    switch (type) {
        case SET_PERSONS:
            return [...payload];
        case SET_PERSON:
            const index = _.findIndex(state, p => p.id === payload.id);
            if (index !== -1) {
                state[index] = payload;
            }
            else {
                state.push(payload);
            }
            return [...state];
        case REMOVE_PERSON:
            state.splice(_.findIndex(state, p => p.id === payload), 1);
            return [...state];
        default:
            return state;
    }
};
