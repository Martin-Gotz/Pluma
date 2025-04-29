import React from 'react';

const LieuNodeComponent = (count, id, reactFlowInstance, reactFlowBounds, event) => {
    const position = reactFlowInstance.project({
        x: (event.clientX - reactFlowBounds.left) - 50,
        y: (event.clientY - reactFlowBounds.top) - 50,
    });

    return {
        id: `dndnode_lieu_${id}`,
        type: 'lieu',
        className: 'lieu-node',
        position,
        data: {
            label: (
                <div>
                    <p>Nom du lieu</p>
                </div>
            ),
        },
    };
};

export default LieuNodeComponent;