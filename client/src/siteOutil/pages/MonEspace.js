import ElementListeProjets from "../components/elementListeProjets/elementListeProjets";
import "../styles/MonEspace.scss"
import React, {useEffect, useState} from "react";
import {creerNouveauProjet, UseFetchData} from "../hooks/operationsDonnees";
import {useNavigate, useOutletContext} from "react-router-dom";
import apiUrl from "../../config";
import Chargement from "../components/Chargement/chargement";
import PopupCreationProjet from "../components/Popups/PopupCreation/PopupCreation";

const MonEspace = () => {
    const navigate = useNavigate();

    const {listeProjet, setListeProjet} = useOutletContext();

    const { data: donneesRecent, loading: loadingRecents, error: errorRecents } = UseFetchData(`${apiUrl}/read-projets-recents`);

    const [activeIndex, setActiveIndex] = useState(0); // Indice du caroussel de la liste des favoris
    const [isPopupVisible, setPopupVisibility] = useState(false);

    const [listeRecents, setListeRecents] = useState([]);
    const [listeFavoris, setListeFavoris] = useState([]);
    const [listeFavorisPrev, setListeFavorisPrev] = useState([]); // Précédent état de listeFavoris


    useEffect(() => {
        if (donneesRecent) {
            setListeRecents([...donneesRecent.filter(projet => projet.id_statut !== 4)]);
        }
    }, [donneesRecent]);

    useEffect(() => {
        setListeFavorisPrev(listeFavoris);
        setListeFavoris(listeProjet.filter(projet => projet.favori))
    }, [listeProjet]);

    useEffect(() => {
        if (listeFavoris) {
            if (listeFavoris.length < listeFavorisPrev.length){
                handlePrev()
            }
        }
    }, [listeFavoris]);

    const toggleFavori = (id) => {
        const updatedProjets = listeProjet.map(projet =>
            projet.id_projet === id ? { ...projet, favori: projet.favori === 1 ? 0 : 1 } : projet
        );

        const updatedProjetsRecents = listeRecents.map(projet =>
            projet.id_projet === id ? { ...projet, favori: projet.favori === 1 ? 0 : 1 } : projet
        );

        setListeProjet(updatedProjets);
        setListeRecents(updatedProjetsRecents);
    };

    const FlecheTriangle = () => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-chevron-left"
        >
            <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
    );


    const fermerPopup = () => {
        setPopupVisibility(false);
    };

    const handleCreerClick = () => {
        setPopupVisibility(true);
    };
    
    const creerProjet = async (nomProjet) => {
        creerNouveauProjet(nomProjet).then((r) => {
            setListeProjet((listeProjet) => [...listeProjet, r.projet]);
            navigate(`/mon-espace/projet/${r.projet.id_projet}`)
        });
    };

    const handleDeleteClick = (id) => {
        setListeProjet(listeProjet.filter(projet => projet.id_projet !== id));
        setListeRecents(listeRecents.filter(projet => projet.id_projet !== id));
    };

    const handlePrev = () => {
        setActiveIndex(Math.max(activeIndex - 1, 0));
    };

    const handleNext = () => {
        const nextIndex = activeIndex + 1;
        const maxIndex = Math.floor((listeFavoris.length - 5)) + 1;

        if (nextIndex < maxIndex) {
            setActiveIndex(nextIndex);
        }
    };

    const calcWidth = (index) => {
        return`calc(calc(10vw + calc((100% - 50vw) / 4)) * ${index})`
    };

    /*if (loadingProjet || loadingRecents) {
        return <Chargement/>;
    }

    if (errorProjet || errorRecents) {
        navigate('/404', { replace: true });
        return null;
    }*/

    return (
        <div className="mon-espace">

            <h1 className="titre-general">Mon Espace de Travail</h1>

            <button type="button" className="button" onClick={handleCreerClick}>
                <span className="button__text">Nouveau Projet</span>
                <span className="button__icon"><svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24"
                                                    strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
                                                    stroke="currentColor" height="24" fill="none" className="svg"><line
                    y2="19" y1="5" x2="12" x1="12"></line><line y2="12" y1="12" x2="19" x1="5"></line></svg></span>
            </button>
            {isPopupVisible && (
                <div className="popup">
                    <PopupCreationProjet typeCreation={"Projet"} onClose={fermerPopup} onCreateProject={creerProjet}/>
                </div>
            )}



            {listeRecents.length === 0 ? (
                <div></div>
            ) : (
                <div className="section-sup">
                    <h2 className="titre-section">Consultés récemment</h2>
                    <div className="section">
                        <div className="liste-recents" style={{ transform: `translateX(${calcWidth(0)})` }}>
                            {listeRecents.map((projet, index) => (
                                <div key={index} className={`element ${index >= 5 ? 'element-hidden' : ''}`}>
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
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}



            {listeFavoris.length === 0 ? (
                <div></div>
            ) : (
                <div className="section-sup">
                    <h2 className="titre-section">Favoris</h2>
                    <div className="section">
                        <button onClick={handlePrev} className="arrow-button left-arrow" style={{ visibility: listeFavoris.length > 5 ? 'visible' : 'hidden' }}><FlecheTriangle /></button>
                        <div className="liste-favoris" style={{ transform:`translateX(${calcWidth(-activeIndex)})` }}>
                            {listeFavoris.map((projet, index) => (
                                <div key={index} className={`element element-${projet.id_projet} ${index < activeIndex || index >= activeIndex + 5 ? 'element-hidden' : ''}`}>
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
                                </div>
                            ))}
                        </div>
                        <button onClick={handleNext} className="arrow-button right-arrow" style={{ visibility: listeFavoris.length > 5 ? 'visible' : 'hidden'}}><FlecheTriangle /></button>
                    </div>
                </div>
            )}



            <div className="section-sup">
                <h2 className="titre-section">Projets</h2>
                {listeProjet.length === 0 ? (
                    <p className="text-center mb-10 mt-8 text-stone-500">Aucun projet 😥</p>
                ) : (
                    <div className="section">
                        <div className="liste-globale" style={{ transform: `translateX(${calcWidth(0)})` }}>
                            {listeProjet.map((projet, index) => (
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
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MonEspace;