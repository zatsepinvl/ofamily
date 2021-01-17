import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import {Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField, Typography} from "material-ui";
import ImagesUploader from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';
import {DatePicker} from "material-ui-pickers";

const muiStyles = theme => ({
    container: {},
    item: {marginLeft: theme.spacing.unit, marginRight: theme.spacing.unit, width: 200},
    dialogContent: {maxWidth: 460},
    group: {flexDirection: 'row',}
});

const styles = {
    imagesContainer: {
        display: 'flex',
    }
};

class EditPersonDialog extends React.Component {
    state = {
    };

    constructor(props) {
        super(props);
        this.state = {person: {...props.person}}
    }

    componentWillReceiveProps(nextProps) {
        this.setState({person: {...nextProps.person}})
    }

    handleChange = name => event => {
        this.updateProfile(name, event.target.value);
    };

    handleOnLoadEnd = name => (err, response) => {
        if (err) {
            console.error(err);
        }
        this.updateProfile(name, response[0]);
    };

    handleDateChange = name => date => {
        this.updateProfile(name, date);
    };


    handleOnDelete = name => () => {
        this.updateProfile(name, '');
    };

    handleChangeRadio = (event, value) => {
        this.updateProfile('gender', value);
    };

    updateProfile = (name, value) => {
        const profile = {...this.state.person};
        profile[name] = value;
        this.setState({person: profile})
    };

    handleOnSave = () => {
        this.props.onSave(this.state.person);
    };

    render() {
        const {opened, classes} = this.props;
        const {person} = this.state;
        return (
            <Dialog open={opened}>
                <DialogTitle>Edit person info</DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <form className={classes.container}>
                        <div style={styles.imagesContainer}>
                            <div>
                                <Typography paragraph/>
                                <Typography type="body2">
                                    Person image
                                </Typography>
                                <ImagesUploader
                                    dataName="file"
                                    url="/api/files"
                                    image={person.personImage}
                                    multiple={false}
                                    optimisticPreviews
                                    onLoadEnd={this.handleOnLoadEnd('personImage')}
                                    deleteImage={this.handleOnDelete('personImage')}
                                />
                            </div>
                            <div>
                                <Typography paragraph/>
                                <Typography type="body2">
                                    Profile image
                                </Typography>
                                <ImagesUploader
                                    dataName="file"
                                    url="/api/files"
                                    optimisticPreviews
                                    multiple={false}
                                    image={person.profileImage}
                                    onLoadEnd={this.handleOnLoadEnd('profileImage')}
                                    deleteImage={this.handleOnDelete('profileImage')}
                                />
                            </div>
                        </div>
                        <Typography paragraph/>
                        <Typography type="body2">
                            Gender
                        </Typography>
                        <FormControl className={classes.item}>
                            <RadioGroup
                                name="gender"
                                className={classes.group}
                                value={person.gender}
                                onChange={this.handleChangeRadio}
                            >
                                <FormControlLabel value="male" control={<Radio/>} label="Male"/>
                                <FormControlLabel value="female" control={<Radio/>} label="Female"/>
                            </RadioGroup>
                        </FormControl>
                        <Typography paragraph/>
                        <Typography type="body2">
                            General information
                        </Typography>
                        <TextField
                            id="firstName"
                            label="First name"
                            className={classes.item}
                            margin="dense"
                            value={person.firstName}
                            onChange={this.handleChange('firstName')}
                        />
                        <TextField
                            id="lastName"
                            label="Last name"
                            value={person.lastName}
                            className={classes.item}
                            margin="dense"
                            onChange={this.handleChange('lastName')}
                        />
                        <DatePicker
                            label="Birthday"
                            className={classes.item}
                            margin="dense"
                            InputLabelProps={{shrink: true}}
                            value={person.birthday}
                            onChange={this.handleDateChange('birthday')}
                            animateYearScrolling={false}
                        />
                        <Typography paragraph/>
                        <Typography type="body2">
                            Biography
                        </Typography>
                        <TextField
                            id="biography"
                            multiline
                            value={person.biography}
                            onChange={this.handleChange('biography')}
                            className={classes.item}
                            margin="dense"
                            style={{width: 416}}
                        />
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.onCancel}>
                        Cancel
                    </Button>
                    <Button color="primary" onClick={this.handleOnSave}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

        );
    }
}

EditPersonDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    opened: PropTypes.bool,
    onCancel: PropTypes.func,
    onSave: PropTypes.func,
    person: PropTypes.object
};
export default withStyles(muiStyles)(EditPersonDialog);