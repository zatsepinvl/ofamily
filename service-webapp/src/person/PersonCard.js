import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import Card, {CardActions, CardContent, CardHeader, CardMedia} from 'material-ui/Card';
import Typography from 'material-ui/Typography';
import EditIcon from 'material-ui-icons/Edit';
import CloseIcon from 'material-ui-icons/Close';
import {Button, Divider, IconButton, List} from 'material-ui';
import EditPersonDialog from "./EditPersonDialog";
import {connect} from "react-redux";
import AccountAvatar from "../common/AccountAvatar";
import moment from 'moment';
import {updatePerson} from "../graph/state/personsReducer";
import {ListItem, ListItemSecondaryAction, ListItemText} from "../../node_modules/material-ui/List/index";
import {selectNode} from "../graph/state/graphReducer";
import AutocompleteInput from "../common/AutocompleteInput";
import KeyboardBackspaceIcon from 'material-ui-icons/KeyboardBackspace';

const styles = theme => ({
    card: {
        position: 'relative',
        maxHeight: 'calc(100vh - 96px)',
        overflow: 'auto',
    },
    media: {
        height: 200,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    flexGrow: {
        flex: '1 1 auto',
    },
    input: {
        margin: 0
    }
});

const dateFormat = 'DD MMMM YYYY';

class PersonCard extends React.PureComponent {
    state = {
        editDialog: false,
        editedRelative: -1,
    };

    handleEditOpen = () => {
        this.setState({editDialog: true});
    };

    handleEditSave = (person) => {
        this.setState({editDialog: false});
        this.props.savePerson(person);
    };

    handleEditCancel = () => {
        this.setState({editDialog: false});
    };

    handleSelectNode = (id) => () => {
        id && this.props.selectNode(id);
    };

    handleEditRelative = (id) => () => {
        this.setState({editedRelative: id});
    };

    handleCancelEditRelative = () => {
        this.setState({editedRelative: -1});
    };

    handleDeleteRelative = (relative) => () => {
        const {person, savePerson} = this.props;
        const parentId = relative && person.parents.indexOf(relative.id);
        parentId >= 0 && person.parents.splice(parentId, 1);
        this.handleCancelEditRelative();
        savePerson(person);
    };

    handleSelectRelative = (relative) => (selected) => {
        const {person, savePerson} = this.props;
        const parentId = relative && person.parents.indexOf(relative.id);
        parentId >= 0 && person.parents.splice(parentId, 1);
        person.parents.push(selected.id);
        this.handleCancelEditRelative();
        savePerson(person);
    };

    createRelativeElement = (relative, name, gender = '') => {
        const {classes, persons, person} = this.props;
        const {editedRelative} = this.state;
        const id = relative.id || relative.key;
        return (id === editedRelative ?
                <ListItem key={id}>
                    <AutocompleteInput
                        className={classes.input}
                        autoFocus
                        placeHolder="Input parent..."
                        data={persons.filter(p => p.gender === gender && p.id !== person.id)}
                        onSelected={this.handleSelectRelative(relative)}
                        getSuggestionValue={relative => `${relative.firstName} ${relative.lastName}`}
                    />
                    <ListItemSecondaryAction>
                        <IconButton color="primary"
                                    onClick={this.handleCancelEditRelative}>
                            <KeyboardBackspaceIcon/>
                        </IconButton>
                        <IconButton color="primary"
                                    onClick={this.handleDeleteRelative(relative)}>
                            <CloseIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
                :
                <ListItem key={id} dense button
                          onClick={this.handleSelectNode(relative.id)}>
                    <AccountAvatar account={relative}/>
                    <ListItemText primary={`${relative.firstName} ${relative.lastName}`}
                                  secondary={name}
                    />
                    <ListItemSecondaryAction>
                        <IconButton color="primary"
                                    onClick={this.handleEditRelative(id)}>
                            <EditIcon/>
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
        )
    };

    formatBirthday = (date) => {
        return moment(date).format(dateFormat) || ''
    };

    createPersonBiography = ({firstName, lastName, birthday}) => {
        return `${firstName} ${lastName} was burn on ${this.formatBirthday(birthday)}.`
    };

    render() {
        const {classes, person, mother, father, children} = this.props;
        const {editDialog} = this.state;
        const birthday = this.formatBirthday(person.birthday);

        return (
            <div>
                <Card className={classes.card}>
                    <CardHeader
                        avatar={
                            <AccountAvatar account={person}/>
                        }
                        title={person.firstName + " " + person.lastName}
                        subheader={birthday}
                        onClick={this.handleSelectNode(person.id)}
                    />
                    {
                        person.profileImage &&
                        <CardMedia
                            className={classes.media}
                            image={person.profileImage}
                            title="Contemplative Reptile"
                        />
                    }
                    <CardContent>
                        <Typography type="body2">
                            Parents
                        </Typography>
                        <List>
                            {this.createRelativeElement(mother, 'Mother', 'female')}
                            <Divider light/>
                            {this.createRelativeElement(father, 'Father', 'male')}
                        </List>
                        {
                            children.length > 0 &&
                            <Typography type="body2">
                                Children
                            </Typography>
                        }
                        <List>
                            {children.map((child, i) =>
                                <ListItem key={child.id}
                                          dense button
                                          onClick={this.handleSelectNode(child.id)}>
                                    <AccountAvatar account={child}/>
                                    <ListItemText primary={`${child.firstName} ${child.lastName}`}/>
                                </ListItem>
                            )}
                        </List>
                        <Typography type="body2">
                            Biography
                        </Typography>
                        <Typography paragraph>
                            {person.biography || this.createPersonBiography(person)}
                        </Typography>
                    </CardContent>
                    <CardActions disableActionSpacing>
                        <Button className={classes.toolbarItem}
                                color="primary"
                                onClick={this.handleEditOpen}
                        >
                            <EditIcon/> Edit profile
                            <EditPersonDialog opened={editDialog}
                                              person={person}
                                              onCancel={this.handleEditCancel}
                                              onSave={this.handleEditSave}
                            />
                        </Button>
                        <div className={classes.flexGrow}/>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

PersonCard.propTypes = {
    classes: PropTypes.object.isRequired,
};

const unknownParent = (key, gender) => ({
    key: key,
    gender: gender,
    firstName: 'Unknown',
    lastName: '',
});
export default connect(
    (state) => {
        const person = state.persons.find(p => p.id === state.graph.selectedNode);
        const parents = person && state.persons.filter(p => person.parents.indexOf(p.id) !== -1);
        const children = person && state.persons.filter(p => p.parents.indexOf(person.id) !== -1);
        return ({
            mother: (parents && parents.find(p => p.gender === 'female')) || unknownParent(1, 'female'),
            father: (parents && parents.find(p => p.gender === 'male')) || unknownParent(2, 'male'),
            person: person || {},
            persons: state.persons,
            children: children || [],
        })
    },
    (dispatch) => ({
        savePerson: (person) => dispatch(updatePerson(person)),
        selectNode: (nodeId) => dispatch(selectNode(nodeId)),
    })
)(withStyles(styles)(PersonCard));