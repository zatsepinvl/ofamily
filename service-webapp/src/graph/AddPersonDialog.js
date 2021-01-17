import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import {Button, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, TextField} from "material-ui";
import {DatePicker} from "material-ui-pickers";

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column'
    },
    item: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    group: {
        flexDirection: 'row',
    }
});

const initState = () => ({
    birthday: new Date(),
    parents: [],
    gender: 'male',
    firstName: undefined,
    lastName: undefined,
});

class AddPersonDialog extends React.Component {
    state = initState();

    handleChangeRadio = (event, value) => {
        this.handleChange('gender')(value);
    };

    handleChange = (name, transform = event => event) => (event) => {
        this.setState({[name]: transform(event)});
    };

    handleOnCancel = () => {
        this.setState(initState());
        this.props.onCancel();
    };

    handleOnCreate = (event) => {
        const person = {...this.state};
        this.setState(initState());
        this.props.onCreate(person);
        event.preventDefault();
    };

    render() {
        const {opened, classes} = this.props;
        const {gender, firstName, lastName, birthday} = this.state;
        return (
            <Dialog open={opened}>
                <form onSubmit={this.handleOnCreate}>
                    <DialogTitle>Add person to family tree</DialogTitle>
                    <DialogContent className={classes.container}>
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
                            id="firstName"
                            label="First name"
                            className={classes.item}
                            margin="normal"
                            value={firstName}
                            onChange={this.handleChange('firstName', event => event.target.value)}
                        />
                        <TextField
                            id="lastName"
                            label="Last name"
                            className={classes.item}
                            margin="normal"
                            value={lastName}
                            onChange={this.handleChange('lastName', event => event.target.value)}
                        />
                        <DatePicker
                            label="Birthday"
                            className={classes.item}
                            margin="normal"
                            value={birthday}
                            InputLabelProps={{shrink: true}}
                            onChange={this.handleChange('birthday')}
                            animateYearScrolling={false}
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleOnCancel}>
                            Cancel
                        </Button>
                        <Button color="primary" type="submit">
                            Add person
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }
}

AddPersonDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onCancel: PropTypes.func,
    onCreate: PropTypes.func
};

export default withStyles(styles)(AddPersonDialog);