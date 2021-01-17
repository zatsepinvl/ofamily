import React from 'react';
import Grid from "material-ui/Grid";
import {withStyles} from "material-ui/styles";

import {connect} from "react-redux";
import GraphCard from "../graph/GraphCard";
import PersonCard from "../person/PersonCard";
import TreeInfoCard from "./TreeInfoCard";

const muiStyles = {
    maxHeight: {
        height: 'calc(100vh - 80px)'
    }
};

class Tree extends React.Component {

    render() {
        const {classes, showPersonCard, tree} = this.props;
        return (
            <div>
                {tree.id && <Grid container className={classes.maxHeight}>
                    <Grid item md={8} sm={12}>
                        <GraphCard/>
                    </Grid>
                    <Grid item md={4} sm={12}>
                        {showPersonCard && <PersonCard/>}
                        {!showPersonCard && <TreeInfoCard/>}
                    </Grid>
                </Grid>}
            </div>
        );
    }
}

export default connect(
    state => ({
        account: state.login,
        tree: state.tree,
        showPersonCard: !!state.graph.selectedNode,
    }),
    dispatch => ({})
)(withStyles(muiStyles)(Tree));