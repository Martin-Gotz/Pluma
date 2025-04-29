import React from 'react';

const BlocnoteNodeComponent = (count, id, reactFlowInstance, reactFlowBounds, event) => {
    const position = reactFlowInstance.project({
        x: (event.clientX - reactFlowBounds.left) - 120,
        y: (event.clientY - reactFlowBounds.top) - 70,
    });

    return {
        id: `dndnode_blocnote_${id}`,
        type: 'blocnote',
        className: 'blocnote-node',
        position,
        data: {
            label: (
                <div>
                    <div className="titre-blocnote">
                        <p>Idée {id}</p>
                    </div>
                    <div className="contenu-blocnote">
                        <p>Contenu du bloc-note</p>
                    </div>
                </div>
            ),
        },
    };
};

export default BlocnoteNodeComponent;