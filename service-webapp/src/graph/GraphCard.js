import React from "react";
import Graph from "react-graph-vis";
import Card, {CardActions} from "material-ui/Card";
import {Button, IconButton, Toolbar} from "material-ui";
import {withStyles} from "material-ui/styles";
import FullScreenIcon from "material-ui-icons/Fullscreen";
import SearchIcon from "material-ui-icons/Search";
import AddIcon from "material-ui-icons/Add";
import LoopIcon from "material-ui-icons/Loop";
import DeleteIcon from "material-ui-icons/Delete";
import AutocompleteInput from "../common/AutocompleteInput";
import Loading from "../common/Loading";
import AddPersonDialog from "./AddPersonDialog";
import {connect} from "react-redux";
import * as graph from "./graph";
import {createPerson, deletePerson, updatePerson} from "./state/personsReducer";
import {focusNode, selectNode} from "./state/graphReducer";
import ConfirmDialog from "../common/ConfirmDialog";

const muiStyles = theme => ({
    primaryIcon: {fill: theme.palette.primary[500]},
    flex: {flex: 1,},
    card: {height: "100%", position: "relative", minHeight: 500, /*background: '#EFEBE9'*/},
    toolbar: {zIndex: 1},
    toolbarItem: {marginLeft: 4, marginRight: 4},
    cardActions: {position: "absolute", bottom: 0, left: 0, right: 0},
    flexGrow: {flex: "1 1 auto"},
});
const styles = {
    graphContainer: {position: "absolute", top: 0, left: 0, right: 0, bottom: 0},
    graph: {width: "100%", height: "100%"},
};

class TreeCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            network: undefined,
            options: graph.createOptions(),
            addPersonDialog: false,
            deletePersonDialog: false,
            selectedNode: undefined,
        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps({selectedNode, loading}) {
        const {network} = this.state;
        const oldSelectedNode = this.props.selectedNode;
        if (selectedNode && selectedNode !== oldSelectedNode) {
            network.focus(selectedNode, graph.focusOptions);
            network.selectNodes([selectedNode], true);
        }
    }

    handleGetNetwork = (network) => {
        this.setState({network: network});
    };

    handleReload = () => {
        const {network} = this.state;
        const {fetchPersons, focusNode, tree} = this.props;
        fetchPersons(tree.id);
        focusNode();
        network.redraw();
    };

    handleFit = () => {
        const {network} = this.state;
        network.fit(graph.fitOptions);
    };

    handleSelect = (event) => {
        const {selectNode} = this.props;
        const nodeId = event.nodes[0];
        const newState = {
            selectedNode: undefined,
        };
        if (nodeId) {
            selectNode(nodeId);
            newState.selectedNode = nodeId;
        }
        else {
            selectNode();
        }
        this.setState(newState);
    };

    handleAddPersonCreate = (person) => {
        const {createPerson} = this.props;
        createPerson(person);
        this.toggleAddPersonDialog();
    };


    toggleAddPersonDialog = () => {
        const {addPersonDialog} = this.state;
        this.setState({addPersonDialog: !addPersonDialog});
    };

    toggleDeletePersonDialog = () => {
        const {deletePersonDialog} = this.state;
        this.setState({deletePersonDialog: !deletePersonDialog});
    };

    handleCloseDeletePersonConfirmDialog = (result) => {
        this.toggleDeletePersonDialog();
        if (!result) {
            return;
        }
        const {deletePerson, selectNode} = this.props;
        const {selectedNode} = this.state;
        deletePerson(selectedNode);
        selectNode();
        this.setState({selectedNode: undefined});
    };


    events = {
        select: this.handleSelect
    };

    render() {
        const {classes, persons} = this.props;
        const {network, options, addPersonDialog, deletePersonDialog, selectedNode} = this.state;
        const selection = !!selectedNode;
        const data = graph.toGraphData(persons);
        return (
            <Card className={classes.card}>
                <Toolbar className={classes.toolbar}>
                    <SearchIcon className={classes.primaryIcon}/>
                    <AutocompleteInput
                        placeHolder="Search person..."
                        data={persons}
                        onSelected={person => network.focus(person.id, graph.focusOptions)}
                        getSuggestionValue={person => person.firstName + ' ' + person.lastName}
                    />
                </Toolbar>
                <Loading show={!network} caption={"Loading tree..."}/>
                <Graph
                    graph={data}
                    options={options}
                    style={styles.graphContainer}
                    getNetwork={this.handleGetNetwork}
                    events={this.events}
                />
                <CardActions className={classes.cardActions} disableActionSpacing>
                    <IconButton color="primary"
                                onClick={this.handleFit}
                    >
                        <FullScreenIcon/>
                    </IconButton>

                    <IconButton color="primary"
                                onClick={this.handleReload}
                    >
                        <LoopIcon/>
                    </IconButton>

                    <div className={classes.flexGrow}/>
                    <Button className={classes.toolbarItem}
                            color="primary"
                            onClick={this.toggleAddPersonDialog}
                    >
                        <AddIcon/> Add person
                        <AddPersonDialog opened={addPersonDialog}
                                         onCancel={this.toggleAddPersonDialog}
                                         onCreate={this.handleAddPersonCreate}
                        />
                    </Button>
                    <Button color="primary"
                            disabled={!selection}
                            onClick={this.toggleDeletePersonDialog}
                    >
                        <DeleteIcon/> Delete person
                        <ConfirmDialog opened={deletePersonDialog}
                                       onClose={this.handleCloseDeletePersonConfirmDialog}
                                       title="Delete this person?"
                                       yesText="Delete"
                                       noText="Cancel"
                        />
                    </Button>
                </CardActions>
            </Card>
        );
    }
}

export default connect(
    state => ({
        account: state.login,
        tree: state.tree,
        persons: state.persons,
        focusedNode: state.graph.focusedNode,
        selectedNode: state.graph.selectedNode,
    }),
    dispatch => ({
        createPerson: (person) => dispatch(createPerson(person)),
        updatePerson: (person) => dispatch(updatePerson(person)),
        deletePerson: (personId) => dispatch(deletePerson(personId)),
        focusNode: (nodeId) => dispatch(focusNode(nodeId)),
        selectNode: (nodeId) => dispatch(selectNode(nodeId)),
    })
)(withStyles(muiStyles)(TreeCard));