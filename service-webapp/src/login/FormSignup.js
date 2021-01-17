import React from 'react';
import {withStyles} from "material-ui/styles";

import Card, {CardActions, CardContent} from 'material-ui/Card';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {withRouter} from "react-router";
import {connect} from "react-redux";
import {signupRequest} from "./state/signupReducer";
import {Radio, Typography} from "material-ui";
import {CircularProgress} from "../../node_modules/material-ui/Progress/index";
import {FormControl, FormControlLabel, FormLabel} from "../../node_modules/material-ui/Form/index";
import RadioGroup from "../../node_modules/material-ui/Radio/RadioGroup";

const muiStyles = theme => ({
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
    },
    group: {
        flexDirection: 'row',
    }
});

class FormSignup extends React.Component {
    state = {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        error: false,
        gender: "male",
    };

    handleChangeRadio = (event, value) => {
        this.setState({gender: value});
    };

    handleChange = name => {
        return event => {
            this.setState({[name]: event.target.value, error: false});
        };
    };

    handleSubmit = (event) => {
        const {password, confirmPassword} = this.state;
        if (password !== confirmPassword) {
            this.setState({error: 'Passwords don\'t match'});
        }
        else {
            this.props.signup(this.state);
        }
        event.preventDefault();
    };

    render() {
        const {classes, className, requestError, signing} = this.props;
        const {error, firstName, lastName, email, password, confirmPassword, gender} = this.state;
        return (
            <form onSubmit={this.handleSubmit}>
                <Card className={className}>
                    <CardContent>
                        <FormControl className={classes.item}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup
                                name="gender"
                                className={classes.group}
                                value={gender}
                                onChange={this.handleChangeRadio}
                            >
                                <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                                <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                            </RadioGroup>
                        </FormControl>
                        <TextField
                            required
                            id="firstName"
                            label="First name"
                            className={classes.item}
                            type="text"
                            margin="normal"
                            value={firstName}
                            onChange={this.handleChange('firstName')}
                        />
                        <TextField
                            required
                            id="lastName"
                            label="Last name"
                            className={classes.item}
                            type="text"
                            margin="normal"
                            value={lastName}
                            onChange={this.handleChange('lastName')}
                        />
                        <TextField
                            required
                            id="email"
                            label="Email"
                            className={classes.item}
                            type="email"
                            margin="normal"
                            value={email}
                            onChange={this.handleChange('email')}
                        />
                        <TextField
                            required
                            id="password"
                            label="Password"
                            className={classes.item}
                            type="password"
                            margin="normal"
                            value={password}
                            onChange={this.handleChange('password')}
                        />
                        <TextField
                            required
                            id="confirmPassword"
                            label="Confirm password"
                            className={classes.item}
                            type="password"
                            margin="normal"
                            value={confirmPassword}
                            onChange={this.handleChange('confirmPassword')}
                        />
                        {error && <Typography className={classes.error}>{error}</Typography>}
                        {requestError && <Typography className={classes.error}>{requestError.message}</Typography>}
                    </CardContent>
                    <CardActions>
                        {signing && <CircularProgress color="primary"/>}
                        <div className={classes.flexGrow}/>
                        <Button color="primary" type="submit">Sign up</Button>
                    </CardActions>
                </Card>
            </form>
        );
    }
}

export default withRouter(connect(
    state => ({
        requestError: state.signup.error,
        signing: state.signup.signing,
    }),
    dispatch => ({
        signup: account => dispatch(signupRequest(account))
    })
)(withStyles(muiStyles)(FormSignup)));