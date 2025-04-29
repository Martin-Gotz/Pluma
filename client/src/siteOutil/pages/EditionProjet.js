import React, {useEffect, useCallback, useRef, useState} from 'react';
import ReactFlow, {addEdge, updateEdge, Background, Controls, MiniMap, ReactFlowProvider, useEdgesState, useNodesState} from 'reactflow';
import 'reactflow/dist/style.css';
import '../styles/EditionProjet.scss'
import Toolbar from '../components/Toolbar/toolbar';
import FloatingEdge from "../components/ReactFlow/FloatingEdge";
import CustomConnectionLine from "../components/ReactFlow/CustomConnectionLine";
import ContextMenu from "../components/ReactFlow/ContextMenu";
import ActeNodeComponent from "../components/ReactFlow/nodes/ActeNodeComponent";
import ChapitreNodeComponent from "../components/ReactFlow/nodes/ChapitreNodeComponent";
import PersonnageNodeComponent from "../components/ReactFlow/nodes/PersonnageNodeComponent";
import LieuNodeComponent from "../components/ReactFlow/nodes/LieuNodeComponent";
import EvenementNodeComponent from "../components/ReactFlow/nodes/EvenementNodeComponent";
import BlocNoteNodeComponent from "../components/ReactFlow/nodes/BlocNoteNodeComponent";
import {useNavigate, useOutletContext} from "react-router-dom";

const initialNodes = [];
const initialEdges = [];

const nodeTypes = {
    acte: null,
    chapitre: null,
    personnage: null,
    lieu: null,
    evenement: null,
    blocnote: null
};

const edgeTypes = {
    floating: FloatingEdge,
};

const connectionLineStyle = {
    strokeWidth: 3,
    stroke: '#d6d6d6',
};

const EdgeOptions = {
    style: { strokeWidth: 4, stroke: '#b26b5d'},
    type: 'floating',
};

const idCounters = {
    chapitre: 1,
    acte: 1,
    personnage: 1,
    lieu: 1,
    evenement: 1,
    blocnote: 1
}

const getId = type => {
    const count = idCounters[type];
    idCounters[type]++;
    return `dndnode_${type}_${count}`;
}

export default function EditionProjet() {
    const reactFlowWrapper = useRef(null);
    const ref = useRef(null);
    const edgeUpdateSuccessful = useRef(true);
    const [menu, setMenu] = useState(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const {contenuProjet, setContenuProjet} = useOutletContext();

    console.log(contenuProjet)

    const onInit = useCallback((reactFlowInstance) => {
        setReactFlowInstance(reactFlowInstance);
    }, [setReactFlowInstance]);

    const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const navigate = useNavigate();

    const onNodeDoubleClickHandler = useCallback((id, type) => {
        if(type != null){
            if (type.type === 'chapitre') {
                navigate(`./${type.data.id}`);
            }
        }
    }, [navigate]);

    const onEdgeUpdateStart = useCallback(() => {
        edgeUpdateSuccessful.current = false;
    }, []);

    const onEdgeUpdate = useCallback((oldEdge, newConnection) => {
        edgeUpdateSuccessful.current = true;
        setEdges((els) => updateEdge(oldEdge, newConnection, els));
    }, [setEdges]);

    const onEdgeUpdateEnd = useCallback((_, edge) => {
        if (!edgeUpdateSuccessful.current) {
            setEdges((eds) => eds.filter((e) => e.id !== edge.id));
        }

        edgeUpdateSuccessful.current = true;
    }, [setEdges]);

    const onNodeContextMenu = useCallback(
        (event, node) => {
            event.preventDefault();

            setMenu({
                id: node.id,
                top: event.clientY,
                left: event.clientX - 240,
                data: node.data,
                type: node.type,
            });
        },
        [setMenu]
    );

    const onEdgeContextMenu = useCallback(
        (event, edge) => {
            event.preventDefault();

            setMenu({
                id: edge.id,
                top: event.clientY,
                left: event.clientX - 240,
                data: edge.data,
                type: edge.type,
            });
        },
        [setMenu]
    );

    const onPaneClick = useCallback(() => {setMenu(null);}, [setMenu]);

    const handleNodeDelete = useCallback((nodeId, type) => {
        setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
        setEdges((edges) => edges.filter((edge) => edge.source !== nodeId));

        if (idCounters[type] > 1) {
            idCounters[type]--;
        }
    }, [setNodes, setEdges]);

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const type = event.dataTransfer.getData('application/reactflow');

        if (typeof type === 'undefined' || !type) {
            return;
        }

        const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();

        const count = idCounters[type];

        let newNode = {
            id: getId(type),
            type: type,
            className: `${type}-node`
        }

        switch (type) {
            case 'acte':
                newNode = ActeNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event);
                break;
            case 'chapitre':
                newNode = ChapitreNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event, onNodeDoubleClickHandler);
                break;
            case 'personnage':
                newNode = PersonnageNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event);
                break;
            case 'lieu':
                newNode = LieuNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event);
                break;
            case 'blocnote':
                newNode = BlocNoteNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event);
                break;
            case 'evenement':
                newNode = EvenementNodeComponent(count, idCounters[type] - 1, reactFlowInstance, reactFlowBounds, event);
                break;
            default:
                return;
        }

        setNodes((nds) => nds.concat(newNode));
    }, [setNodes, reactFlowInstance, onNodeDoubleClickHandler]);

  /*  const generateChapitreNodes = useCallback((acte, acteIndex) => {
        const chapitreNodes = [];
        acte.chapitres.forEach((chapitre, chapitreIndex) => {
            const chapitreNode = {
                id: `chapitre_${acteIndex}_${chapitreIndex}`,
                data: {
                    id: chapitre.chapitre_id,
                    titre: chapitre.chapitre_titre,
                    acte_titre: acte.acte_titre
                },
                position: {
                    x: 500 * chapitreIndex,
                    y: 300 * acteIndex
                },
                type: 'chapitre'
            };
            chapitreNodes.push(chapitreNode);
        });
        return chapitreNodes;
    }, []);

    const generatePostitNodes = useCallback((postits, projetId) => {
        const postitNodes = [];
        postits.forEach((postit, postitIndex) => {
            const postitNode = {
                id: `postit_${projetId}_${postitIndex}`,
                data: {
                    id: postit.postit_projet_id,
                    titre: postit.postit_projet_titre,
                    contenu: postit.postit_projet_contenu,
                    date_creation: postit.postit_projet_date_creation
                },
                position: {
                    x: 1000,
                    y: 300 * postitIndex
                },
                type: 'blocnote'
            };
            postitNodes.push(postitNode);
        });
        return postitNodes;
    }, []);

    // Generate nodes for actes and chapitres
    useEffect(() => {
        if (contenuProjet && contenuProjet.actes && Array.isArray(contenuProjet.actes)) {
            const newNodes = [];
            const newEdges = [];

            contenuProjet.actes.forEach((acte, acteIndex) => {
                const acteNode = {
                    id: `acte_${acteIndex}`,
                    data: {
                        id: acte.acte_id,
                        titre: acte.acte_titre
                    },
                    position: {
                        x: 0,
                        y: 300 * acteIndex
                    },
                    type: 'acte'
                };
                newNodes.push(acteNode);
                // Create chapitre nodes
                const chapitreNodes = generateChapitreNodes(acte, acteIndex);
                newNodes.push(...chapitreNodes);
                // Create edges between acte and chapitre nodes
                chapitreNodes.forEach((chapitreNode, chapitreIndex) => {
                    const edge = {
                        id: `edge_${acteIndex}_${chapitreIndex}`,
                        source: acteNode.id,
                        target: chapitreNode.id,
                        animated: true
                    };
                    newEdges.push(edge);
                });
                // Add acte node to nodes
                newNodes.push(acteNode);
            });
            // Add nodes for post-its
            const postitNodes = generatePostitNodes(contenuProjet.postits, contenuProjet.projet_id);
            newNodes.push(...postitNodes);
            setNodes(newNodes);
            setEdges(newEdges);
            console.log(newEdges);
            console.log(newNodes)
        } else {
            console.log('null');
        }
    }, [contenuProjet, generateChapitreNodes, generatePostitNodes, setNodes, setEdges]); */

    return (
        <div className="dndflow">
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <div style={{ width: '100%', height: '100%' }}>
                    <ReactFlow
                        ref={ref}
                        onInit={onInit}
                        nodes={nodes}
                        edges={edges}
                        nodeTypes={nodeTypes}
                        onNodesChange={onNodesChange}
                        onNodeDoubleClick={onNodeDoubleClickHandler}
                        onEdgesChange={onEdgesChange}
                        onEdgeUpdate={onEdgeUpdate}
                        onEdgeUpdateStart={onEdgeUpdateStart}
                        onEdgeUpdateEnd={onEdgeUpdateEnd}
                        edgeTypes={edgeTypes}
                        defaultEdgeOptions={EdgeOptions}
                        onConnect={onConnect}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        onPaneClick={onPaneClick}
                        onNodeContextMenu={onNodeContextMenu}
                        onEdgeContextMenu={onEdgeContextMenu}
                        connectionLineComponent={CustomConnectionLine}
                        connectionLineStyle={connectionLineStyle}
                        attributionPosition="bottom-left"
                        fitView
                    >
                        <Toolbar />
                        <Controls position="top-right" />
                        <MiniMap />
                        <Background variant="dots" gap={10} size={0.5} />
                        {menu && <ContextMenu onClick={onPaneClick} onDelete={handleNodeDelete} {...menu} />}
                    </ReactFlow>
                    </div>
                </div>
            </ReactFlowProvider>
        </div>
    );
}