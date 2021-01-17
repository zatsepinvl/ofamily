import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import registerServiceWorker from './registerServiceWorker';
import {BrowserRouter} from 'react-router-dom';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import {Provider} from 'react-redux'
import {applyMiddleware, compose, createStore} from 'redux'
import {amber, green} from 'material-ui/colors';
import {createEpicMiddleware} from 'redux-observable';
import reduxCatch from 'redux-catch';
import RestService from "./service/RestService";
import {appEpic} from "./app/state/appEpic";
import {appReducer} from "./app/state/appReducer";
import "rxjs";
import './index.css';

const muiTheme = createMuiTheme({
    fontFamily: 'Roboto, sans-serif',
    palette: {
        primary: {
            ...green,
            500: '#388E3C',
            A500: '#388E3C',
            A700: '#388E3C',
        },
        accent: {
            ...amber,
            500: "#FFA000",
            A500: "#FFA000",
            A700: "#FFA000",
        },
    },
});

const errorHandler = (error) => {
    console.error('Caught an exception!', error);
};

const epicMiddleware = createEpicMiddleware(appEpic, {
    dependencies: {
        api: RestService
    }
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
    appReducer,
    {},
    composeEnhancers(
        applyMiddleware(epicMiddleware, reduxCatch(errorHandler))
    ),
);

ReactDOM.render(
    <Provider store={store}>
        <MuiThemeProvider theme={muiTheme}>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </MuiThemeProvider>
    </Provider>,
    document.getElementById('root')
);

registerServiceWorker();
