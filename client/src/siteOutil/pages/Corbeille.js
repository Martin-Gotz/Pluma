import React, {useEffect, useState} from 'react';
import "../styles/MonEspace.scss"
import "../styles/Corbeille.scss";
import {deleteData, modifierProjet, UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";
import {useNavigate, useOutletContext} from "react-router-dom";
import PopupSuppressionProjet from "../components/Popups/PopupSuppressionProjet/PopupSuppressionProjet";


const Corbeille = () => {
    const { data: donneesProjet, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-table/projet`);

    const {listeProjet, setListeProjet} = useOutletContext();

    const [projetsDansCorbeille, setProjetsDansCorbeille] = useState([]);

    const [isPopupVisible, setPopupVisibility] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (donneesProjet) {
            setProjetsDansCorbeille([...donneesProjet.filter(projet => projet.id_statut === 4)]);
        }
    }, [donneesProjet]);


    const fermerPopup = () => {
        setPopupVisibility(false);
    };

    const handleDeleteClick = (id) => {
        setPopupVisibility(id);
    };

    const onDelete = (id) => {
        deleteData(`${apiUrl}/delete-element/projet/${id}`)
            .then(() => {
                setProjetsDansCorbeille(projetsDansCorbeille.filter(projet => projet.id_projet !== id));
            })
    };

    const onRestore = (id) => {
        modifierProjet(id, "id_statut", 1)
            .then(() => {
                setProjetsDansCorbeille(projetsDansCorbeille.filter(projet => projet.id_projet !== id));
                const projetsFiltres = projetsDansCorbeille.filter(projet => projet.id_projet === id);
                setListeProjet([...listeProjet, ...projetsFiltres]);
            })
    };

    const [expandedItems, setExpandedItems] = useState([]);

    const toggleExpansion = (itemId) => {
        setExpandedItems((prevExpandedItems) =>
            prevExpandedItems.includes(itemId)
                ? prevExpandedItems.filter((id) => id !== itemId)
                : [...prevExpandedItems, itemId]
        );
    };

    if (loading) {
        return <div className="chargement">Chargement en cours...</div>;
    }

    if (error) {
        navigate('/404', { replace: true });
        return null;
    }

    return (
        <div className="mon-espace">
            {isPopupVisible && (
                <div className="popup">
                    <PopupSuppressionProjet idProjet={isPopupVisible} onClose={fermerPopup} onDelete={onDelete}/>
                </div>
            )}
            <div className="corbeille">
                <h1 className="titre-general">Corbeille</h1>
                {projetsDansCorbeille.length === 0 ? (
                    <p>Aucun élément dans la corbeille.</p>
                ) : (
                    <ul>
                        {projetsDansCorbeille.map((projet, index) => (
                            <li key={index} className={expandedItems.includes(projet.id_projet) ? 'expanded' : ''}>
                                <div className="header-element">
                                    <div className={`debut ${expandedItems.includes(projet.id_projet)  ? 'open' : ''}`}
                                         onClick={() => toggleExpansion(projet.id_projet)}
                                    >
                                        <svg width="20" height="20" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m19 9-7 7-7-7"></path>
                                        </svg>
                                        <span>{projet.titre}</span>
                                    </div>
                                    <div className="boutons">
                                        <button className="bouton bouton-restaurer" onClick={() => onRestore(projet.id_projet)}>Restaurer</button>
                                        <button className="bouton bouton-supprimer" onClick={() => handleDeleteClick(projet.id_projet)}>Supprimer</button>
                                    </div>
                                </div>
                                <div className="details-element">
                                    <div className="rectangle">
                                        { projet.couverture ? (
                                            <img src={`/assets/userImport/project-cover/${projet.couverture}`} alt={`${projet.titre} couverture`} />
                                        ) : (
                                            <p className="couverture">{projet.titre}</p>
                                        )}
                                    </div>

                                    <p>{projet.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Corbeille;