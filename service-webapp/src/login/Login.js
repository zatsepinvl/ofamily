import React from 'react';
import {connect} from "react-redux";
import FormLogin from "./FormLogin";
import FormSignup from "./FormSignup";
import AppBar from 'material-ui/AppBar';
import Tabs, {Tab} from 'material-ui/Tabs';
import {withStyles} from "material-ui/styles";
import {Snackbar, Typography} from "material-ui";

const muiStyles = theme => ({
    card: {
        maxWidth: 260,
        marginTop: 6
    },
    item: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    tab: {
        minWidth: 130
    },
    primary: {
        color: theme.palette.primary[500]
    }
});

const styles = {
    container: {
        display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        width: '100%', height: '100vh',
    },
    welcomeContainer: {
        //marginTop: 200, marginRight: 40,
    },
    loginContainer: {
        maxWidth: 260,
    },
    flexItem: {
        margin: 20
    }
};

const initState = {
    value: 0,
    snackBarOpened: false
};

const snackBarTimeout = 6000;

class Login extends React.Component {
    state = initState;

    componentWillReceiveProps(props) {
        if (props.signup.success) {
            this.setState({...initState, snackBarOpened: true});
        }
    }

    handleChange = (event, value) => {
        this.setState({value});
    };

    render() {
        const {classes} = this.props;
        const {value, snackBarOpened} = this.state;
        return (
            <div style={styles.container}>
                <div style={styles.flexItem}>
                    <Typography type="display2">
                        O`Family
                    </Typography>
                    <Typography type="subheading"
                                className={classes.primary}>
                        Bring your family together
                    </Typography>
                </div>
                <div style={styles.flexItem}>
                    <AppBar position="static"
                            color="default"
                    >
                        <Tabs value={value}
                              onChange={this.handleChange}
                              indicatorColor="primary"
                              textColor="primary"
                              fullWidth
                        >
                            <Tab className={classes.tab} label="Login"/>
                            <Tab className={classes.tab} label="Sign up"/>
                        </Tabs>
                    </AppBar>
                    {value === 0 && <FormLogin className={classes.card}/>}
                    {value === 1 && <FormSignup className={classes.card}/>}
                </div>
                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                    open={snackBarOpened}
                    autoHideDuration={snackBarTimeout}
                    onRequestClose={this.handleRequestClose}
                    SnackbarContentProps={{'aria-describedby': 'message-id',}}
                    message={<span id="message-id">You have been signed up successfully</span>}
                />
            </div>
        );
    }
}

export default connect(
    state => ({
        signup: state.signup
    }),
    dispatch => ({})
)(withStyles(muiStyles)(Login));