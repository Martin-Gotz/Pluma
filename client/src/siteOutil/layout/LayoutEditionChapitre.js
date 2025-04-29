import {Outlet, useNavigate, useOutletContext, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";
import Chargement from "../components/Chargement/chargement";
import Page404 from "../../404";

const LayoutEditionChapitre = () => {
    const { numChapitre } = useParams();
    const { contenuProjet } = useOutletContext();
    const [contenuChapitre, setContenuChapitre] = useState({});
    const [idChapitre, setIdChapitre] = useState(null);

    useEffect(() => {
        if (contenuProjet && contenuProjet.actes) {
            const chapitreTrouve = contenuProjet.actes
                .flatMap(acte => acte.chapitres)
                .find(chapitre => chapitre.chapitre_numero.toString() === numChapitre);

            if (chapitreTrouve) {
                setIdChapitre(chapitreTrouve.chapitre_id);
            }
        }
    }, [contenuProjet, numChapitre]);

    // Lecture du chapitre
    const { data: donneesChapitre, loading: loadingChapitre, error: errorChapitre } = UseFetchData(`${apiUrl}/read-element/chapitre/${idChapitre}`, true);

    useEffect(() => {
        if (donneesChapitre) {
            setContenuChapitre(donneesChapitre);
        }
    }, [donneesChapitre]);

    if (loadingChapitre) {
        return <Chargement />;
    } else if (errorChapitre) {
        return <Page404 urlRedirection={"mon-espace"} />;
    }else {
        return (
            <div className="div-principale-edition">
                <Outlet context={{contenuChapitre, setContenuChapitre, contenuProjet}}/>
            </div>
        );
    }
};

export default LayoutEditionChapitre;