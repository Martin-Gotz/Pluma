import {Outlet, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";
import Chargement from "../components/Chargement/chargement";
import Page404 from "../../404";

const LayoutEditionProjet = () => {

    const { idProjet } = useParams();

    // Lecture du projet
    const { data: donneesProjet, loading: loadingProjet, error: errorProjet } = UseFetchData(`${apiUrl}/read-project-content/${idProjet}`, true);

    const [contenuProjet, setContenuProjet] = useState({});

    useEffect(() => {
        if (donneesProjet) {
            setContenuProjet(donneesProjet);
        }
    }, [donneesProjet]);

    if (loadingProjet) {
        return <Chargement />;
    } else if (errorProjet) {
        return <Page404 urlRedirection={"mon-espace"} />;
    }else {
        return (
            <div className="div-principale-edition">
                <Outlet context={{contenuProjet, setContenuProjet}}/>
            </div>
        );
    }
};

export default LayoutEditionProjet;