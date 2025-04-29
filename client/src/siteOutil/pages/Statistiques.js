import "../styles/MonEspace.scss"
import "../styles/Statistiques.scss";
import React, {useEffect, useState} from "react";
import {useOutletContext} from "react-router-dom";
import {UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";

const Statistiques = () => {

    const listeMois = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const { listeProjet } = useOutletContext();

    const dateActuelle = new Date();
    const jourActuel = dateActuelle.getDate();
    const moisActuel = dateActuelle.getMonth();
    const anneeActuelle = dateActuelle.getFullYear();

    const [moisActif, setMoisActif] = useState(moisActuel);
    const [anneeActive, setAnneeActive] = useState(anneeActuelle);


    const [filtreActif, setFiltreActif] = useState(0);

    const [statistiques, setStatistiques] = useState([]);

    const { data: donneesStatistiques, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-total-mots/${filtreActif}/${moisActif + 1}/${anneeActive}`);



    useEffect(() => {
        if (donneesStatistiques) {
            setStatistiques([...donneesStatistiques.filter(projet => projet.id_statut !== 4)]);
        }
    }, [donneesStatistiques]);

    useEffect(() => {
        //console.log(statistiques)
    }, [statistiques]);

    const getStats = (jour) => {
        const stats = statistiques.find(stat => stat.jour === jour);

        return stats ? stats.total_mots : 0;
    };

    const handleClickFiltreProjet = (index) => {
        setFiltreActif(index);
    };

    const moisPrecedent = () => {
        const nouveauMois = (moisActif - 1 + 12) % 12;
        if (nouveauMois === 11) {
            setAnneeActive(anneeActive - 1);
        }

        setMoisActif(nouveauMois);
    };

    const moisSuivant = () => {
        const nouveauMois = (moisActif + 1) % 12;
        if (nouveauMois === 0) {
            setAnneeActive(anneeActive + 1);
        }

        setMoisActif(nouveauMois);
    };

    const joursDansMoisActif = new Date(anneeActive, moisActif + 1, 0).getDate();

    const getNomMois = (moisActif) => {
        return listeMois[moisActif];
    }

    return (
        <div className="mon-espace">
            <h1 className="titre-general">Mes Statistiques</h1>
            <div className={"statistiques-global"}>
                <div className={"en-tete-statistiques"}>
                    <div className={"defilement-calendrier"}>
                        <div className={"bouton-defilement-mois arriere"} onClick={moisPrecedent}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                                <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                            </svg>
                        </div>
                        <div className={"indicateur-mois"}>
                            {getNomMois(moisActif) + " " + anneeActive}
                        </div>
                        <div className={"bouton-defilement-mois avant"} onClick={moisSuivant}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                                <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className={"statistiques"}>
                    <div className={"liste-filtre-projet"}>
                        <ul>
                            <li key={0} onClick={() => handleClickFiltreProjet(0)} className={`tous-les-projets ${filtreActif === 0 ? 'active' : ''}`}>
                                Tous les projets
                            </li>
                            <div className={"separateur"}></div>
                            {listeProjet.map((element, index) => (
                                <li key={index + 1} onClick={() => handleClickFiltreProjet(element.id_projet)} className={element.id_projet === filtreActif ? 'active' : ''}>
                                    {element.titre}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={"tableau-statistiques"}>
                        <table className="table">
                            <thead>
                            <tr>
                                <th className={"colonne-jour"}>Jour</th>
                                <th className={"colonne-nombre-mots"}>Nombre de mots</th>
                            </tr>
                            </thead>
                            <tbody>
                                {[...Array(joursDansMoisActif)].map((_, index) => {
                                    return (
                                        <tr key={index} className={index + 1 === jourActuel && moisActif === moisActuel && anneeActive === anneeActuelle ? 'jour-actuel' : ''}>
                                            <td className={"jour"}>{index + 1}</td>
                                            <td className={"nombre-mots"}>{getStats(index + 1)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Statistiques;