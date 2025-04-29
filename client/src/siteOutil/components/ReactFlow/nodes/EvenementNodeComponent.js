import React from 'react';

const EvenementNodeComponent = (count, id, reactFlowInstance, reactFlowBounds, event) => {
    const position = reactFlowInstance.project({
        x: (event.clientX - reactFlowBounds.left) - 50,
        y: (event.clientY - reactFlowBounds.top) - 50,
    });

    return {
        id: `dndnode_evenement_${id}`,
        type: 'evenement',
        className: 'evenement-node',
        position,
        data: {
            label: (
                <div>
                    <p>Résumé événement</p>
                </div>
            ),
        },
    };
};

export default EvenementNodeComponent;