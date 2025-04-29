import React from 'react';

const ActeNodeComponent = (count, id, reactFlowInstance, reactFlowBounds, event) => {
    const position = reactFlowInstance.project({
        x: (event.clientX - reactFlowBounds.left) - 150,
        y: (event.clientY - reactFlowBounds.top) - 50,
    });

    return {
        id: `dndnode_acte_${id}`,
        type: 'acte',
        className: 'acte-node',
        position,
        data: {
            label: (
                <div>
                    <p>acte {count} : "nomActe"</p>
                </div>
            ),
        },
    };
};

export default ActeNodeComponent;