import {combineEpics} from 'redux-observable';
import {
    CREATE_PERSON,
    DELETE_PERSON,
    FETCH_PERSON,
    FETCH_PERSONS,
    fetchPersons,
    removePerson,
    setPerson,
    setPersons,
    UPDATE_PERSON
} from "./personsReducer";
import {createApiEpic} from "../../common/apiEpic";
import {Observable} from 'rxjs/Observable';
import {selectNode} from "./graphReducer";
import {SET_TREE} from "./treeReducer";
import {createOnEpic} from "../../common/chainEpic";

const personsFetchEpic = createApiEpic(
    FETCH_PERSONS,
    (api, {payload}) => api.get(`/api/trees/${payload}/persons`),
    setPersons
);

const personFetchEpic = createApiEpic(
    FETCH_PERSON,
    (api, {payload}) => api.get(`/api/persons/${payload}`),
    setPerson
);

const personCreateEpic = createApiEpic(
    CREATE_PERSON,
    (api, {payload}, store) => {
        payload.treeId = store.getState().tree.id;
        return api.post(`/api/persons`, payload)
            .flatMap(response => Observable.concat(
                Observable.of(setPerson(response)),
                Observable.of(selectNode(response.id)),
            ))
    }
);

const personUpdateEpic = createApiEpic(
    UPDATE_PERSON,
    (api, {payload}) => api.put(`/api/persons/${payload.id}`, payload),
    setPerson
);

const personDeleteEpic = createApiEpic(
    DELETE_PERSON,
    (api, {payload}) => api.delete(`/api/persons/${payload}`)
        .map(response => payload),
    removePerson
);

const personFetchOnTreeSetEpic = createOnEpic({
    type: SET_TREE,
    flatMap: ({payload}) => Observable.of(fetchPersons(payload.id))
});

export const personsEpic = combineEpics(
    personsFetchEpic,
    personFetchEpic,
    personCreateEpic,
    personUpdateEpic,
    personDeleteEpic,
    personFetchOnTreeSetEpic
);
