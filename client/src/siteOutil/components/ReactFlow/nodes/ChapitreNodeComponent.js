import React from 'react';

const ChapitreNodeComponent = (count, id, reactFlowInstance, reactFlowBounds, event, onNodeDoubleClick) => {
    const position = reactFlowInstance.project({
        x: (event.clientX - reactFlowBounds.left) - 150,
        y: (event.clientY - reactFlowBounds.top) - 150,
    });

    return {
        id: `dndnode_chapitre_${count}`,
        type: 'chapitre',
        className: 'chapitre-node',
        position,
        data: {
            id,
            label: (
                <div onDoubleClick={() => onNodeDoubleClick(id)}>
                    <p>{`chapitre ${count} : "nomChapitre"`}</p>
                </div>
            ),
        },
    };
};

export default ChapitreNodeComponent;