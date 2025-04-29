import React from 'react';
import {Link, useOutletContext} from "react-router-dom"
import "../styles/EditionChapitre.scss"
import TexteEditable from "../components/texteEditable/texteEditable";
import {modifier} from "../hooks/operationsDonnees";
import PostItBar from "../components/PostItBar/postItBar";
import BoutonRetour from "../components/BoutonRetour/BoutonRetour";

const EditionChapitre = () => {
    const { contenuChapitre } = useOutletContext();

    const handleTitreSave = async (nouveauTitre) => {
        await modifier(contenuChapitre.id_chapitre, "chapitre", "titre", nouveauTitre)
    };

    const handleDescriptionSave = async (nouvelleDescription) => {
        await modifier(contenuChapitre.id_chapitre, "chapitre", "description", nouvelleDescription)
    };

    const recupererDate = () => {
        const dateCreation = new Date(contenuChapitre.date_creation);

        const jour = dateCreation.getDate();
        const mois = dateCreation.getMonth() + 1;
        const annee = dateCreation.getFullYear();

        return `${jour}/${mois}/${annee}`;
    };

    return (
        <>
            <div className="flex">
                <BoutonRetour />
                <div className="mon-espace">
                    <div className="resume-chapitre">
                        <div className="info-chapitre">
                            <div className="titre flex">
                                <h2>Chapitre {contenuChapitre.numero} :&#160;&#160;</h2>
                                <TexteEditable initialValeur={contenuChapitre.titre} onSave={handleTitreSave} idInput={"titreProjet"} valeurParDefaut={"Projet sans titre"} />
                            </div>

                            <div className="date-creation">
                                <label>Date de création : </label>
                                <p>{recupererDate()}</p>
                            </div>

                            <div className="description">
                                <label>Résumé / Description : </label>
                                <div className="paragraphe">
                                    <TexteEditable initialValeur={contenuChapitre.description ? contenuChapitre.description : ''} onSave={handleDescriptionSave} inputType="textarea" valeurParDefaut={""} />
                                </div>
                            </div>

                            { contenuChapitre.personnages &&
                                <div className="personnage">
                                    <label>Personnage(s) : </label>
                                    <div className="list">
                                        {contenuChapitre.personnages}
                                    </div>
                                </div>
                            }


                            { contenuChapitre.lieux &&
                                <div className="lieu">
                                    <label>Lieu(x) : </label>
                                    <div className="list">
                                        {contenuChapitre.lieux}
                                    </div>
                                </div>
                            }

                            { contenuChapitre.evenements &&
                                <div className="evenement">
                                    <label>Événément(s) : </label>
                                    <div className="list">
                                        {contenuChapitre.evenements}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    <Link to={`./ecriture`}>
                        <button className="editer">
                            Éditer
                        </button>
                    </Link>
                </div>
                <PostItBar />
            </div>
        </>
    );
};

export default EditionChapitre;