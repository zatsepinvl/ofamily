import {combineEpics} from 'redux-observable';
import {treeEpic} from "../../graph/state/treeEpic";
import {personsEpic} from "../../graph/state/personsEpic";
import {loginEpic} from "../../login/state/loginEpic";
import {signupEpic} from "../../login/state/signupEpic";
import {treeAccountEpic} from "../../tree/state/treeAccountsEpic";
import {joinEpic} from "../../join/state/joinEpic";
import {treesEpic} from "../../tree/state/treesEpic";
import {logoutEpic} from "../../logout/state/logoutEpic";

export const appEpic = combineEpics(
    loginEpic,
    signupEpic,
    logoutEpic,
    treeEpic,
    treesEpic,
    treeAccountEpic,
    personsEpic,
    joinEpic,
);