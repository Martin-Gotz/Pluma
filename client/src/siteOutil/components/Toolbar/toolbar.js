import React, {useState} from 'react';
import './toolbar.scss';
import {Link} from "react-router-dom";
import GenerateurPrenom from './Generateur.js';

const Toolbar = ({allOptions = true}) => {
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [activeList, setActiveList] = useState(null);
    const openOverlay = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
    };

    const toggleList = (listType) => {
        if (activeList === listType) {
            setActiveList(null);
        } else {
            setActiveList(listType);
        }
    };

    const onDragStart = (event, nodeType) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    const preventDrag = (e) => {
        e.preventDefault ? e.preventDefault() : e.returnValue = false
    }

    return (
        <div className="toolbar relative z-20 w-auto bg-white h-screen flex flex-col justify-between">
            <div className="content">
                {allOptions ? (
                    <>
                        <div className="dndnode chapitre mb-6 mt-3">
                            <img src="/assets/toolbar/chapitre.png" alt="Icone chapitre" title="Chapitre" onDragStart={(event) => onDragStart(event, 'chapitre')} draggable />
                        </div>
                        <div className="dndnode acte mb-6">
                            <img src="/assets/toolbar/acte.png" alt="Icone acte" title="Acte" onDragStart={(event) => onDragStart(event, 'acte')} draggable />
                        </div>
                    </>
                    ) : (
                    <>
                        <div onMouseDown={preventDrag} className="dndnode__disabled chapitre mb-6 mt-3">
                            <img src="/assets/toolbar/chapitre.png" alt="Icone chapitre" title="Chapitre"/>
                        </div>
                        <div onMouseDown={preventDrag} className="dndnode__disabled acte mb-6">
                            <img src="/assets/toolbar/acte.png" alt="Icone acte" title="Acte"/>
                        </div>
                    </>
                )}
                <div className={`dndnode list personnage mb-6 ${activeList === 'personnage' ? 'active' : ''}`} onClick={() => toggleList('personnage')}>
                    <img src="/assets/toolbar/personnage.png" alt="Icone personnage" className="img-list"/>
                    <ul>
                        <Link to={`./elements#personnages`}>
                            <li><svg id="e8KT56hp0Ry1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision"><ellipse rx="150" ry="150" transform="translate(150 150)" fill="#fff" strokeWidth="0"/><rect width="18.295917" height="124.624359" rx="0" ry="0" transform="translate(140.852041 87.687821)" fill="#fc8c79" strokeWidth="0"/><rect width="18.295917" height="124.624359" rx="0" ry="0" transform="matrix(0 1-1 0 212.31218 140.852042)" fill="#fc8c79" strokeWidth="0"/></svg></li>
                        </Link>
                        <li className="my-2"><hr/></li>
                        <li>
                            <img src="/assets/personnages/perso-1.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />
                            Sorciere de la cité
                        </li>
                        <li><img src="/assets/personnages/perso-2.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />M. Abiel</li>
                        <li><img src="/assets/personnages/perso-3.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />Thomas</li>
                        <li><img src="/assets/personnages/perso-4.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />Guerrier</li>
                        <li><img src="/assets/personnages/perso-5.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />Ash</li>
                        <li><img src="/assets/personnages/perso-6.png" alt="nomPerso" onDragStart={(event) => onDragStart(event, 'personnage')} draggable />Splash</li>
                    </ul>
                </div>
                <div className={`dndnode lieu list mb-6 ${activeList === 'lieu' ? 'active' : ''}`} onClick={() => toggleList('lieu')}>
                    <img src="/assets/toolbar/lieu.png" alt="Icone lieu" className="img-list"/>
                    <ul>
                        <Link to={`./elements#lieux`}>
                            <li><svg id="eFqsPA2tl801" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision"><rect width="300" height="141.594485" rx="0" ry="0" transform="translate(0 79.202758)" fill="#fff" strokeWidth="0"/><polygon points="0,-104.910931 99.776224,-32.419261 61.665098,84.874726 -61.665098,84.874726 -99.776224,-32.419261 0,-104.910931" transform="matrix(1.507746 0 0 1.064986 150.437203 111.728673)" fill="#fff" strokeWidth="0"/><polygon points="0,-104.910931 99.776224,-32.419261 61.665098,84.874726 -61.665098,84.874726 -99.776224,-32.419261 0,-104.910931" transform="matrix(-1.507746 0 0-1.064986 150.437203 188.271333)" fill="#fff" strokeWidth="0"/><rect width="18.3" height="124.62" rx="0" ry="0" transform="translate(140.85 87.69)" fill="#52ad66" strokeWidth="0"/><rect width="18.3" height="124.62" rx="0" ry="0" transform="matrix(0 1-1 0 212.31 140.85)" fill="#52ad66" strokeWidth="0"/></svg></li>
                        </Link>
                        <li className="my-2"><hr/></li>
                        <li>
                            <img src="/assets/lieux/lieu-1.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />
                            La grande montagne
                        </li>
                        <li><img src="/assets/lieux/lieu-2.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />Le désert perdu</li>
                        <li><img src="/assets/lieux/lieu-3.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />Le village</li>
                        <li><img src="/assets/lieux/lieu-4.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />La forêt</li>
                        <li><img src="/assets/lieux/lieu-5.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />Megacity</li>
                        <li><img src="/assets/lieux/lieu-6.png" alt="nomLieu" onDragStart={(event) => onDragStart(event, 'lieu')} draggable />Les berges du fleuve</li>
                    </ul>
                </div>
                <div className={`dndnode evenement list mb-6 ${activeList === 'evenement' ? 'active' : ''}`} onClick={() => toggleList('evenement')}>
                    <img src="/assets/toolbar/evenement.png" alt="Icone evenement" className="img-list"/>
                    <ul>
                        <Link to={`./elements#evenements`}>
                            <li><svg id="eGkTMNqAYSf1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" shapeRendering="geometricPrecision" textRendering="geometricPrecision"><polygon points="0,-218.707805 208.003483,-67.584428 128.553222,176.938331 -128.553222,176.938331 -208.003483,-67.584428 0,-218.707805" transform="matrix(.721141 0 0 1.979917 150.00016 433.023301)" fill="#fff" strokeWidth="0"/><rect width="18.3" height="124.62" rx="0" ry="0" transform="translate(140.85 140.984622)" fill="#df331a" strokeWidth="0"/><rect width="18.3" height="124.62" rx="0" ry="0" transform="matrix(0 1-1 0 212.31016 194.144622)" fill="#df331a" strokeWidth="0"/></svg></li>
                        </Link>
                        <li className="my-2"><hr/></li>
                        <li>
                            <img src="/assets/evenements/evenement-1.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />
                            Meutre
                        </li>
                        <li><img src="/assets/evenements/evenement-2.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />Mariage</li>
                        <li><img src="/assets/evenements/evenement-3.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />Naissance de Diego</li>
                        <li><img src="/assets/evenements/evenement-4.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />Anniversaire de Diego</li>
                        <li><img src="/assets/evenements/evenement-5.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />Divorce</li>
                        <li><img src="/assets/evenements/evenement-6.png" alt="nomEvenement" onDragStart={(event) => onDragStart(event, 'evenement')} draggable />Combat</li>
                    </ul>
                </div>
                <div className="dndnode bloc-note">
                    <img src="/assets/toolbar/bloc-note.png" alt="Icone bloc-note" title="Bloc-note" onDragStart={(event) => onDragStart(event, 'blocnote')} draggable />
                </div>
            </div>

            <div className="generateur-nom-button flex items-center justify-center">
                <button onClick={openOverlay}>
                    <img src="/assets/toolbar/eclair.png" alt="Icone générateur de nom (éclair)" draggable="false"/>
                </button>
            </div>

            {isOverlayOpen && (
                <div className="overlay">
                    <GenerateurPrenom closeOverlay={closeOverlay} />
                </div>
            )}
        </div>
    );
};

export default Toolbar;