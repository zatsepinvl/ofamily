import React from 'react';
import {withStyles} from "material-ui/styles";

import Card, {CardActions, CardContent} from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {loginRequest} from "./state/loginReducer";
import {Typography} from "material-ui";

const muiStyles = theme => ({
    card: {
        maxWidth: 260,
        marginTop: 4
    },
    item: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    error: {
        color: 'red'
    }
});

class FormLogin extends React.Component {

    state = {
        email: "",
        password: ""
    };

    handleChange = name => {
        return event => {
            this.setState({[name]: event.target.value,});
        };
    };

    handleSubmit = (event) => {
        this.props.login(this.state);
        event.preventDefault();
    };

    render() {
        const {classes, className, requestError} = this.props;
        return (
            <form onSubmit={this.handleSubmit}>
                <Card className={className}>
                    <CardContent>
                        <TextField
                            id="email"
                            label="Email"
                            className={classes.item}
                            type="email"
                            margin="normal"
                            value={this.state.email}
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            id="password"
                            label="Password"
                            className={classes.item}
                            type="password"
                            margin="normal"
                            value={this.state.password}
                            onChange={this.handleChange('password')}
                        />
                        {requestError && <Typography className={classes.error}>{requestError.message}</Typography>}
                    </CardContent>
                    <CardActions>
                        <div className={classes.flexGrow}/>
                        <Button color="primary" type="submit">Login</Button>
                    </CardActions>
                </Card>
            </form>
        );
    }
}

export default withRouter(connect(
    state => ({
        requestError: state.login.error
    }),
    dispatch => ({
        login: account => dispatch(loginRequest(account))
    })
)(withStyles(muiStyles)(FormLogin)));