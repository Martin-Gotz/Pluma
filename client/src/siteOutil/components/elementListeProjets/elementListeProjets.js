import { Link } from 'react-router-dom';
import './elementListeProjets.scss';
import apiUrl from "../../../config";
import React, {useState} from "react";
import { modifierProjet } from "../../hooks/operationsDonnees";
import PopupCreationProjet from "../Popups/PopupCreation/PopupCreation";
import ReactDOM from 'react-dom';
import PopupRenommerProjet from "../Popups/PopupRenommerProjet/PopupRenommerProjet";

const ElementListeProjets = ({ id, titreInitial, couverture, statut, favori, onToggleFavori, onDelete}) => {
    const [survolMenu, setSurvolMenu] = useState(false);
    const [isPopupVisible, setPopupVisibility] = useState(false);

    const [titre, setTitre] = useState(titreInitial);



    const couleurStatut = (idStatut) => {
        switch (idStatut) {
            case 1:
                return 'en-cours';
            case 2:
                return 'en-pause';
            case 3:
                return 'termine';
            case 4:
                return 'archive';
            default:
                return '';
        }
    };

    const toggleFavori = async () => {
        fetch(`${apiUrl}/toggle-favori-projet/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({favoriValue: !favori}),
        })
            .then((response) => response.json())
            .catch((error) => console.error('Erreur lors du basculement de favori:', error));

        onToggleFavori();
    };

    const handleDeleteClick = () => {
        modifierProjet(id, "id_statut", 4)
            .then(() => {
                onDelete();
            })
            .catch((error) => {
                console.error('Erreur lors du changement d état:', error);
            });
    }

    const afficherMenu = () => {
        setSurvolMenu(true);
    };

    const cacherMenu = () => {
        setSurvolMenu(false);
    };

    const fermerPopup = () => {
        setPopupVisibility(false);
    };

    const handleRenameClick = () => {
        setPopupVisibility(true);
    };

    const renommerProjet = (nouveauTitre) => {
        modifierProjet(id, "titre", nouveauTitre)
            .then(() => {
                setTitre(nouveauTitre);
            })
    };

    const handleConsult = () => {
        const currentDate = new Date();

        const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

        modifierProjet(id, "derniere_consultation", formattedDate).then(r => null);
    }

    return (
        <div className="element-liste-projet-general">
            {isPopupVisible && (
                ReactDOM.createPortal(
                    <div className="popup">
                        <PopupRenommerProjet nomProjetInitial={titre} onClose={fermerPopup} onCreateProject={renommerProjet}/>
                    </div>,
                    document.body
                )
            )}
            <button onClick={toggleFavori} className={`Fav ${favori ? 'favorited' : ''}`}>
                <div className="Fav-bloom"></div>
                <svg className="Fav-star" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                    <path
                        d="M36.14,3.09l5.42,17.78H59.66a4.39,4.39,0,0,1,2.62,7.87L47.48,40.14,53,58.3a4.34,4.34,0,0,1-6.77,4.78L32,52l-14.26,11A4.34,4.34,0,0,1,11,58.27l5.55-18.13L1.72,28.75a4.39,4.39,0,0,1,2.62-7.87h18.1L27.86,3.09A4.32,4.32,0,0,1,36.14,3.09Z"/>
                </svg>
            </button>
            <button className="Del" onClick={afficherMenu} onMouseLeave={cacherMenu}>
                <svg className={"bin"} fill="#000000" width="25px" height="25px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12,7a2,2,0,1,0-2-2A2,2,0,0,0,12,7Zm0,10a2,2,0,1,0,2,2A2,2,0,0,0,12,17Zm0-7a2,2,0,1,0,2,2A2,2,0,0,0,12,10Z"/>
                </svg>
            </button>
            <Link to={`/mon-espace/projet/${id}`} className={`element-liste-projet cursor-pointer`} onClick={handleConsult}>
                <div className="rectangle">
                    {couverture ? (
                        <img className="couverture" src={`/assets/userImport/project-cover/${couverture}`} alt={`${titre} couverture`} />
                    ) : (
                        <div className="couverture">{titre}</div>
                    )}
                </div>
                <div className={`affichage-statut ${couleurStatut(statut)}`}></div>
            </Link>
            {survolMenu && (
                <div className="menu" onMouseEnter={afficherMenu} onMouseLeave={cacherMenu} onClick={cacherMenu}>
                    <ul className="menu-list">
                        <li className="menu-item">
                            <button className="menu-button" onClick={handleRenameClick}>
                                <svg width="25px" height="25px" viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.2942 7.95881C13.5533 7.63559 13.5013 7.16358 13.178 6.90453C12.8548 6.64549 12.3828 6.6975 12.1238 7.02072L13.2942 7.95881ZM6.811 14.8488L7.37903 15.3385C7.38489 15.3317 7.39062 15.3248 7.39623 15.3178L6.811 14.8488ZM6.64 15.2668L5.89146 15.2179L5.8908 15.2321L6.64 15.2668ZM6.5 18.2898L5.7508 18.2551C5.74908 18.2923 5.75013 18.3296 5.75396 18.3667L6.5 18.2898ZM7.287 18.9768L7.31152 19.7264C7.36154 19.7247 7.41126 19.7181 7.45996 19.7065L7.287 18.9768ZM10.287 18.2658L10.46 18.9956L10.4716 18.9927L10.287 18.2658ZM10.672 18.0218L11.2506 18.4991L11.2571 18.491L10.672 18.0218ZM17.2971 10.959C17.5562 10.6358 17.5043 10.1638 17.1812 9.90466C16.8581 9.64552 16.386 9.69742 16.1269 10.0206L17.2971 10.959ZM12.1269 7.02052C11.8678 7.34365 11.9196 7.81568 12.2428 8.07484C12.5659 8.33399 13.0379 8.28213 13.2971 7.95901L12.1269 7.02052ZM14.3 5.50976L14.8851 5.97901C14.8949 5.96672 14.9044 5.95412 14.9135 5.94123L14.3 5.50976ZM15.929 5.18976L16.4088 4.61332C16.3849 4.59344 16.3598 4.57507 16.3337 4.5583L15.929 5.18976ZM18.166 7.05176L18.6968 6.52192C18.6805 6.50561 18.6635 6.49007 18.6458 6.47532L18.166 7.05176ZM18.5029 7.87264L19.2529 7.87676V7.87676L18.5029 7.87264ZM18.157 8.68976L17.632 8.15412C17.6108 8.17496 17.5908 8.19704 17.5721 8.22025L18.157 8.68976ZM16.1271 10.0203C15.8678 10.3433 15.9195 10.8153 16.2425 11.0746C16.5655 11.3339 17.0376 11.2823 17.2969 10.9593L16.1271 10.0203ZM13.4537 7.37862C13.3923 6.96898 13.0105 6.68666 12.6009 6.74805C12.1912 6.80943 11.9089 7.19127 11.9703 7.60091L13.4537 7.37862ZM16.813 11.2329C17.2234 11.1772 17.5109 10.7992 17.4552 10.3888C17.3994 9.97834 17.0215 9.69082 16.611 9.74659L16.813 11.2329ZM12.1238 7.02072L6.22577 14.3797L7.39623 15.3178L13.2942 7.95881L12.1238 7.02072ZM6.24297 14.359C6.03561 14.5995 5.91226 14.9011 5.89159 15.218L7.38841 15.3156C7.38786 15.324 7.38457 15.3321 7.37903 15.3385L6.24297 14.359ZM5.8908 15.2321L5.7508 18.2551L7.2492 18.3245L7.3892 15.3015L5.8908 15.2321ZM5.75396 18.3667C5.83563 19.1586 6.51588 19.7524 7.31152 19.7264L7.26248 18.2272C7.25928 18.2273 7.25771 18.2268 7.25669 18.2264C7.25526 18.2259 7.25337 18.2249 7.25144 18.2232C7.2495 18.2215 7.24825 18.2198 7.24754 18.2185C7.24703 18.2175 7.24637 18.216 7.24604 18.2128L5.75396 18.3667ZM7.45996 19.7065L10.46 18.9955L10.114 17.536L7.11404 18.247L7.45996 19.7065ZM10.4716 18.9927C10.7771 18.9151 11.05 18.7422 11.2506 18.499L10.0934 17.5445C10.0958 17.5417 10.0989 17.5397 10.1024 17.5388L10.4716 18.9927ZM11.2571 18.491L17.2971 10.959L16.1269 10.0206L10.0869 17.5526L11.2571 18.491ZM13.2971 7.95901L14.8851 5.97901L13.7149 5.04052L12.1269 7.02052L13.2971 7.95901ZM14.9135 5.94123C15.0521 5.74411 15.3214 5.6912 15.5243 5.82123L16.3337 4.5583C15.4544 3.99484 14.2873 4.2241 13.6865 5.0783L14.9135 5.94123ZM15.4492 5.7662L17.6862 7.6282L18.6458 6.47532L16.4088 4.61332L15.4492 5.7662ZM17.6352 7.58161C17.7111 7.6577 17.7535 7.761 17.7529 7.86852L19.2529 7.87676C19.2557 7.36905 19.0555 6.88127 18.6968 6.52192L17.6352 7.58161ZM17.7529 7.86852C17.7524 7.97604 17.7088 8.07886 17.632 8.15412L18.682 9.22541C19.0446 8.87002 19.2501 8.38447 19.2529 7.87676L17.7529 7.86852ZM17.5721 8.22025L16.1271 10.0203L17.2969 10.9593L18.7419 9.15928L17.5721 8.22025ZM11.9703 7.60091C12.3196 9.93221 14.4771 11.5503 16.813 11.2329L16.611 9.74659C15.0881 9.95352 13.6815 8.89855 13.4537 7.37862L11.9703 7.60091Z" fill="#000000"/>
                                </svg>
                                Renommer
                            </button>
                        </li>
                        <li className="menu-item">
                            <button className="menu-button menu-button--delete" onClick={handleDeleteClick}>
                                <svg className="bin" width="25" height="25" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.96 3.6h3.6a.6.6 0 0 1 .6.6v1.2h-4.8V4.2a.6.6 0 0 1 .6-.6Zm5.4 1.8V4.2a1.8 1.8 0 0 0-1.8-1.8h-3.6a1.8 1.8 0 0 0-1.8 1.8v1.2H5.168a.6.6 0 0 0-.012 0H3.96a.6.6 0 0 0 0 1.2h.646L5.63 19.392A2.4 2.4 0 0 0 8.022 21.6h7.476a2.4 2.4 0 0 0 2.393-2.208L18.915 6.6h.645a.6.6 0 0 0 0-1.2h-1.194a.61.61 0 0 0-.012 0H15.36Zm2.35 1.2-1.015 12.696a1.2 1.2 0 0 1-1.197 1.104H8.022a1.2 1.2 0 0 1-1.196-1.104L5.811 6.6H17.71ZM8.726 7.8a.6.6 0 0 1 .633.564l.6 10.2a.6.6 0 0 1-1.197.072l-.602-10.2a.6.6 0 0 1 .564-.636h.002Zm6.07 0a.6.6 0 0 1 .563.636l-.6 10.2a.6.6 0 1 1-1.197-.072l.6-10.2a.6.6 0 0 1 .633-.564Zm-3.036 0a.6.6 0 0 1 .6.6v10.2a.6.6 0 1 1-1.2 0V8.4a.6.6 0 0 1 .6-.6Z"></path>
                                </svg>
                                Mettre à la corbeille
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ElementListeProjets;
