import React, {useEffect, useState} from 'react';
import ElementListeProjets from "../components/elementListeProjets/elementListeProjets";
import {useOutletContext} from "react-router-dom";
import { UseFetchData } from "../hooks/operationsDonnees";
import apiUrl from "../../config";
import "../styles/MonEspace.scss"

const ResultatRecherche = () => {
    const {recherche} = useOutletContext();

    const { data: donneesProjet, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-table/projet`);

    const [listeProjet, setListeProjet] = useState([]);

    useEffect(() => {
        if (donneesProjet) {
            setListeProjet([...donneesProjet.filter(projet => projet.id_statut !== 4)]);
        }
    }, [donneesProjet]);

    const resultatsFiltres = recherche
        ? listeProjet.filter(item =>
            item.titre.toLowerCase().includes(recherche.toLowerCase())
        )
        : listeProjet;



    const toggleFavori = (id) => {
        const updatedProjets = listeProjet.map(projet =>
            projet.id_projet === id ? { ...projet, favori: projet.favori === 1 ? 0 : 1 } : projet
        );

        setListeProjet(updatedProjets);
    };

    const handleDeleteClick = (id) => {
        setListeProjet(listeProjet.filter(projet => projet.id_projet !== id));
    };

    return (
        <div className="mon-espace">
            <h1 className="titre-general">Projets</h1>
            <div className="section-sup">
                <h2 className="titre-section">Projets</h2>
                <div className="section">
                    <div className="liste-globale">
                        {resultatsFiltres.length > 0 ? (
                            resultatsFiltres.map((projet, index) => (
                                <ElementListeProjets
                                    key={index}
                                    id={projet.id_projet}
                                    titreInitial={projet.titre}
                                    couverture={projet.couverture}
                                    statut={projet.id_statut}
                                    favori={projet.favori === 1 || false}
                                    onToggleFavori={() => toggleFavori(projet.id_projet)}
                                    onDelete={() => handleDeleteClick(projet.id_projet)}
                                />
                            ))
                        ) : (
                            <p>Aucun résultat trouvé.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultatRecherche;
