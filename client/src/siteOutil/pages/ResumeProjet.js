import React, {useEffect, useState} from 'react';
import {Link, useParams, useNavigate, useOutletContext} from "react-router-dom"
import "../styles/MonEspace.scss"
import "../styles/ResumeProjet.scss"
import TexteEditable from "../components/texteEditable/texteEditable";
import ListeGenres from "../components/ListeGenres/ListeGenres";
import {modifierProjet, UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";
import Chargement from "../components/Chargement/chargement";
import ImageEditable from "../components/imageEditable/imageEditable";
import ShareDeleteIcons from "../components/ShareDeleteIcons/ShareDeleteIcons";
import BoutonRetour from "../components/BoutonRetour/BoutonRetour";

const ResumeProjet = () => {

    const { idProjet } = useParams();

    const { data: projet, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-element/projet/${idProjet}`, true);

    const { data: donneesStatut, loading: loadingStatut, error: errorStatut } = UseFetchData(`${apiUrl}/read-table/statut`);

    const [listeStatut, setListeStatut] = useState([]);
    const [etatProjet, setEtatProjet] = useState();
    const [couverture, setCouverture] = useState(false);

    const {listeProjet, setListeProjet} = useOutletContext();

    const navigate = useNavigate();

    useEffect(() => {
        if (projet) {
            setEtatProjet(projet.id_statut);
            if (projet.id_statut === 4) {
                navigate('/404', {replace: true});
            }

            if (projet.couverture && projet.couverture !== "img-init.jpg") {
                setCouverture(`/assets/userImport/project-cover/${projet.couverture}`)
            }else{
                setCouverture(`/assets/userImport/project-cover/img-init.jpg`)
            }
        }
    }, [projet]);

    useEffect(() => {
        if (donneesStatut && donneesStatut.length > 0) {
            setListeStatut(donneesStatut.slice(0, -1));
        }
    }, [donneesStatut]);


    //Charger l'état initial de la couverture
    useEffect(()=>{
        if(projet){
            if(projet.couverture){
                setCouverture(`/assets/userImport/project-cover/${projet.couverture}`)
            }
        }
    }, [projet]);

    const handleTitreSave = async (nouveauTitre) => {
        const nouvelleListeProjet = [...listeProjet];

        try {
            //setListeProjet(nouvelleListeProjet);
            await modifierProjet(idProjet, "titre", nouveauTitre);
        } catch (error) {
            console.error('Erreur lors du changement d état:', error);
        }
    };

    const handleDescriptionSave = async (nouvelleDescription) => {
        await modifierProjet(idProjet, "description", nouvelleDescription)
    };

    const handleEtatChange = (idNouveauStatut) => {
        modifierProjet(idProjet, "id_statut", idNouveauStatut)
            .then(() => {
                setEtatProjet(idNouveauStatut);
            })
            .catch((error) => {
                console.error('Erreur lors du changement d état:', error);
            });
    };

    const recupererDate = () => {
        const dateCreation = new Date(projet.date_creation);

        const jour = dateCreation.getDate();
        const mois = dateCreation.getMonth() + 1;
        const annee = dateCreation.getFullYear();

        return `${jour}/${mois}/${annee}`;
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${file.name.split('.').pop()}`;

            const reader = new FileReader();
            reader.onloadend = async () => {
                setCouverture(reader.result);

                const formData = new FormData();
                formData.append('colonne', 'couverture');
                formData.append('valeur', fileName);
                formData.append('couvertureContent', file);

                try {
                    const response = await fetch(`${apiUrl}/modifier-projet/${idProjet}`, {
                        method: 'PUT',
                        body: formData,
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (!data.success) {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error('Erreur de l\'envoi de l\'image ', error);
                }
            };

            reader.readAsDataURL(file);
        }
    };


    const handleImageRemove = () => {
        console.log("remove")
    };

    const handleDeleteProject = () => {
        modifierProjet(idProjet, "id_statut", 4)
            .then(() => {
                setListeProjet(listeProjet.filter(projet => projet.id_projet !== idProjet));
                navigate('/mon-espace', { replace: true });
            })
            .catch((error) => {
                console.error('Erreur lors du changement d état:', error);
            });
    }

    const handleShareProject = () => {
        console.log("Partage du projet " + idProjet)
    }

    if (loading || loadingStatut) {
        return <Chargement/>;
    }
    else if (!projet) {
        return null;
    }
    else {
        return (
            <>
                <BoutonRetour />
                <div className="mon-espace">
                    <ShareDeleteIcons onShare={handleShareProject} onDelete={handleDeleteProject}/>
                    <div className="resume-projet">
                        <div className="couverture">
                            {/*{projet.titre}*/}

                            <ImageEditable
                                imageEditable={couverture}
                                handleImageChange={handleImageChange}
                                handleImageRemove={handleImageRemove}
                                toolButtons={false}
                                alt={"Couverture"}
                            />
                        </div>

                        <div className="info-projet">
                            <div className="titre">
                                <TexteEditable initialValeur={projet.titre} onSave={handleTitreSave} idInput={"titreProjet"} valeurParDefaut={"Projet sans titre"} />
                            </div>
                            <div className="date-creation">
                                <label>Date de création:</label>
                                <p>{recupererDate()}</p>
                            </div>

                            <ListeGenres idProjet={idProjet} initialSelectedGenres={projet.id_genre} />

                            <div className="etat-projet">
                                <label>État du projet:</label>
                                <select value={etatProjet} onChange={(e) => handleEtatChange(e.target.value)}>
                                    {listeStatut.map((statut, index) => (
                                        <option
                                            key={index}
                                            value={statut.id_statut}
                                        >
                                            {statut.nom_statut}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="separator"></div>

                    <div className="titre-description">
                        Résumé / Description :
                    </div>
                    <div className="paragraphe-resume">
                        <TexteEditable initialValeur={projet.description ? projet.description : ''} onSave={handleDescriptionSave} inputType="textarea" valeurParDefaut={""} />
                    </div>

                    <Link to={`./edition`}>
                        <button className="editer">
                            Éditer
                        </button>
                    </Link>
                </div>
            </>


        );
    }
};

export default ResumeProjet;