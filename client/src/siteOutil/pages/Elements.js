import React, {useEffect, useState} from "react";
import "../styles/Elements.scss";
import TexteEditable from "../components/texteEditable/texteEditable";
import {useNavigate} from "react-router-dom"

const Personnage = ({ onglet, onCreate, liste, setListe }) => {
    const [elementSelect, setElementSelect] = useState();

    const toggleElement = (element) => {
        if (elementSelect?.id !== element.id) {
            setElementSelect(element);
        } else {
            setElementSelect(null);
        }
    };

    const handleDescriptionSave = async (nouvelleDescription) => {
        const updatedListe = liste.map((element) =>
            element.id === elementSelect.id ? { ...element, description: nouvelleDescription } : element
        );
        setListe(updatedListe);
    };

    const handleNomSave = async (nouveauNom) => {
        const updatedListe = liste.map((element) =>
            element.id === elementSelect.id ? { ...element, name: nouveauNom } : element
        );
        setListe(updatedListe);
    };

    const handleValiderClick = () => {
        setElementSelect(null);
    };

    const handleCreerClick = () => {
        let typeElement;
        switch (onglet) {
            case "personnage":
                typeElement = "Nouveau personnage";
                break;
            case "lieux":
                typeElement = "Nouveau lieu";
                break;
            case "evenements":
                typeElement = "Nouvel événement";
                break;
            default:
                typeElement = "Nouvel élément";
        }

        const nouvelElement = {
            id: liste.length + 1,
            name: typeElement,
            description: "Description par défaut"
        };

        const nouvelleListe = [...liste, nouvelElement];

        setElementSelect(nouvelElement);
        setListe(nouvelleListe);
    };

    return (
        <>
            <div className={`edition-global ${onglet} flex-row w-full p-8`}>
                <div className="edition-header w-full h-1/6 flex items-center justify-start">
                    <button type="button" className="bouton-ajout-element" onClick={handleCreerClick}>
                        <span className="bouton-ajout-element__text">Nouveau</span>
                        <span className="bouton-ajout-element__icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" height="24" fill="none" className="svg">
                                <line y2="19" y1="5" x2="12" x1="12"></line>
                                <line y2="12" y1="12" x2="19" x1="5"></line>
                            </svg>
                        </span>
                    </button>
                </div>
                <div className="edition-principal flex w-full h-5/6">
                    <div className="edition-liste edition-onglet overflow-y-auto bg-white p-4">
                        <ul>
                            {liste.map((element, index) => (
                                <li key={index} onClick={() => toggleElement(element)} className={elementSelect?.id === element.id ? "element-selectionne" : ""}>{element.name}</li>
                            ))}
                        </ul>
                    </div>
                    <div className="edition-info edition-onglet bg-white p-4">
                        {elementSelect && (
                            <>
                                <div className="nom">
                                    <TexteEditable initialValeur={elementSelect.name} onSave={handleNomSave} idInput={"titreProjet"} valeurParDefaut={"Projet sans titre"} />
                                </div>
                                <label>Description : </label>
                                <TexteEditable initialValeur={elementSelect?.description ? elementSelect?.description : ''} onSave={handleDescriptionSave} inputType="textarea" valeurParDefaut={""} />
                                <button className="bouton-valider-element" onClick={handleValiderClick}>Valider</button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};



const Elements = () => {
    const [activeOnglet, setActiveOnglet] = useState('personnage');


    const [personnages, setPersonnages] = useState([
        { id: 1, name: 'Jon Snow', description: 'Bâtard de la famille Stark, ancien Lord Commandant de la Garde de Nuit.' },
        { id: 2, name: 'Daenerys Targaryen', description: 'Dernière survivante de la maison Targaryen, Mère des Dragons.' },
        { id: 3, name: 'Arya Stark', description: 'Jeune fille de la famille Stark, formée comme une assassin.' },
        { id: 4, name: 'Tyrion Lannister', description: 'Le nain de la famille Lannister, connu pour son intelligence.' },
    ]);
    const [lieux, setLieux] = useState([
        { id: 1, name: 'Winterfell', description: 'Siège de la maison Stark.' },
        { id: 2, name: 'Port-Réal', description: 'Capitale des Sept Couronnes.' },
        { id: 3, name: 'Mur', description: 'Barrière protégeant des terres au nord de Westeros.' },
        { id: 4, name: 'Qarth', description: 'Port de la mer de Jade.' },
    ]);
    const [evenements, setEvenements] = useState([
        { id: 1, name: 'La Nuit Longue', description: 'Longue période hivernale avec des créatures surnaturelles.' },
        { id: 2, name: 'La Guerre des Cinq Rois', description: 'Conflit après la mort de Robert Baratheon.' },
        { id: 3, name: 'Mariage Rouge', description: 'Événement sanglant à la Maison Frey.' },
        { id: 4, name: 'Conquête de Daenerys', description: 'Campagne pour conquérir les Sept Couronnes.' },
    ]);

    const navigate = useNavigate();

    useEffect(() =>{
        const anchor = window.location.hash;

        if (anchor === '#lieux') {
            setActiveOnglet("lieux")
        }
        else if (anchor === '#evenements') {
            setActiveOnglet("evenements")
        }
    }, []);

    const handlePageChange = (onglet) => {
        setActiveOnglet(onglet);
    };

    return (
        <div className="elements-page">
            <button className="retour" onClick={() => navigate(-1)}>
                <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="m17.835 3.87-1.78-1.77-9.89 9.9 9.9 9.9 1.77-1.77L9.705 12l8.13-8.13Z"></path>
                </svg>
            </button>
            <div className="panel">
                <div className="panel-heading">
                    <a className={activeOnglet === 'personnage' ? "z-50" : "z-10"} onClick={() => handlePageChange('personnage')}>
                        Personnages
                    </a>
                    <a className={activeOnglet === 'lieux' ? "z-40" : "z-20"} onClick={() => handlePageChange('lieux')}>
                        Lieux
                    </a>
                    <a className={activeOnglet === 'evenements' ? "z-30" : "z-0"} onClick={() => handlePageChange('evenements')}>
                        Événements
                    </a>
                </div>
                <div className="panel-body flex">
                    {activeOnglet === 'personnage' && <Personnage onglet={activeOnglet} liste={personnages} setListe={setPersonnages} />}
                    {activeOnglet === 'lieux' && <Personnage onglet={activeOnglet} liste={lieux} setListe={setLieux} />}
                    {activeOnglet === 'evenements' && <Personnage onglet={activeOnglet} liste={evenements} setListe={setEvenements}/>}
                </div>
            </div>
        </div>
    );
};

export default Elements;