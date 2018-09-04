'use strict';

function getNodes (jobnetName, callback) {
    var nodesDataSet = [];
    var edgesDataSet = [];
    getApi(`jobnet?name=${jobnetName}`, function (json) {
        if (json === '{}') {
            callback({
                nodes: new vis.DataSet(nodesDataSet),
                edges: new vis.DataSet(edgesDataSet)
            });

            return;
        }

        for (var from = 0; from < json.nextMatrix.length; from++) {
            nodesDataSet.push({
                id: from,
                label: json.jobs[from].code,
                shape: 'dot',
                size: 12
            });
            for (var to = 0; to < json.nextMatrix[from].length; to++) {
                if (json.nextMatrix[from][to] === 1) {
                    edgesDataSet.push({
                        from: from,
                        to: to
                    });
                }
            }
        }

        callback({
            nodes: new vis.DataSet(nodesDataSet),
            edges: new vis.DataSet(edgesDataSet)
        });
    });
};

function getNetwork (container, data, options) {
    return new vis.Network(container, data, options);
}

var options = {
    layout: {
        hierarchical: {
            direction: 'LR', // UD, DU, LR, RL
            sortMethod: 'directed' // hubsize, directed
        }
    },
    edges: {
        arrows: 'to'
    }
};