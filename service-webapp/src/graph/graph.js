import {personImage} from "../common/image";

const addEdgeDefault = (edgeData, callback) => callback(edgeData);
export const createOptions = (addEdge = addEdgeDefault) => ({
    layout: {
        hierarchical: {
            levelSeparation: 60,
            nodeSpacing: 120,
            sortMethod: 'directed',
            direction: 'DU'
            // blockShifting: false,
        },
    },
    edges: {
        smooth: {
            type: "dynamic",
            forceDirection: "none",
            roundness: 1
        },
        color: "#1B5E20",
        arrows: {
            to: {
                enabled: false,
            }
        },
        width: 1
    },
    nodes: {
        physics: false,
        borderWidth: 0,
        chosen: {
            node: (values) => {
                values.borderWidth = 4;
                values.borderColor = "#EF6C00";
            },
        },
    },
});

export const defaultAnimation = {
    duration: 600,
    easingFunction: "easeInOutQuad",
};

export const focusOptions = {
    scale: 2.8,
    animation: defaultAnimation,
};

export const fitOptions = {
    animation: defaultAnimation,
};

export const toGraphData = (persons = []) => {
    const nodes = [];
    const connectors = [];
    const edges = [];
    persons.forEach(person => {
        const color = person.gender === 'male' ? '#64B5F6' : '#F06292';
        nodes.push({
            ...person,
            label: person.firstName,
            shape: 'circularImage',
            image: personImage(person),
            borderWidth: 4,
            color: {
                border: color,
                background: '#FAFAFA'
            },
        });
        if (person.parents.length === 0) {
            return;
        }
        let connector = connectors.find(c => sameParents(c.parents, person.parents));
        if (!connector) {
            connector = {
                id: 'connector' + person.id,
                parents: person.parents,
                shape: 'dot',
                size: 0,
                chosen: false,
            };
            connectors.push(connector);
            person.parents.forEach(parentId => {
                edges.push({to: parentId, from: connector.id, chosen: false});
            });
        }
        edges.push({to: connector.id, from: person.id, chosen: false});
    });
    return {
        nodes: nodes.concat(connectors),
        edges: edges
    };
};

const sameParents = (a, b) => {
    if (a.length !== b.length) {
        return false;
    }
    for (let i = 0; i < a.length; i++) {
        if (b.indexOf(a[i]) === -1) {
            return false;
        }
    }
    return true;
};