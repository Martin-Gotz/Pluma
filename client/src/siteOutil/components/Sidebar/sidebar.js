import React, {useState, useEffect} from 'react';
import {Link, useLocation, useNavigate} from "react-router-dom"
import './sidebar.scss';
import { UseFetchData } from "../../hooks/operationsDonnees";
import apiUrl from "../../../config";

const Sidebar = ({ onRechercheChange, listeProjet }) => {
    //const { data: listeProjet, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-table/projet`);

    const [isProjectsOpen, setIsProjectsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [recherche, setRecherche] = useState('');
    const [estSurResultatRecherche, setEstSurResultatRecherche] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const toggleProjects = () => {
        setIsProjectsOpen(!isProjectsOpen);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(prevState => !prevState);
    };

    const handleRechercheChangeLocal = (e) => {
        const nouvelleRecherche = e.target.value;
        setRecherche(nouvelleRecherche);
        onRechercheChange(nouvelleRecherche);
        console.log(estSurResultatRecherche)

        if (nouvelleRecherche.trim() !== '' && !estSurResultatRecherche) {
            navigate('/mon-espace/resultat-recherche');
            setEstSurResultatRecherche(() => true);
        }
    };

    const viderRecherche = () => {
        setRecherche('');
    };


    useEffect(() => {
        const handleResize = () => {
            const sidebarElement = document.querySelector('.sidebar');
            if (sidebarElement) {
                const isSidebarClose = sidebarElement.classList.contains('close');

                if (window.innerWidth < 768 && !isSidebarClose) {
                    toggleSidebar();
                }
            }
        };

        if (location.pathname !== '/mon-espace/resultat-recherche') {
            setEstSurResultatRecherche(() => false);
            viderRecherche()
        }

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [location.pathname]);


    /*if (loading) {
        return null;
    }

    if (error || !listeProjet) {
        navigate('/404', { replace: true });
        return null;
    }*/

    return (
        <div className={`sidebar ${isSidebarOpen ? 'close' : ''}`}>
            <div className={`sidebar-content ${isSidebarOpen ? 'close' : ''}`}>
                <div className="sidebar-header">
                    <Link to="/mon-espace" className="titre">
                        <img src="/assets/logo_clair_1.png" alt="logo" className="logo" />
                        <h2>Pluma</h2>
                    </Link>
                    <div className="barre-de-recherche">
                        <input
                            type="text"
                            placeholder="Rechercher"
                            value={recherche}
                            onChange={handleRechercheChangeLocal}
                        />
                        <button className="icone-de-recherche">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20px" height="20px">
                                <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <ul>
                    <Link to="/mon-espace">
                        <li>
                            <div className="icone-navigation">
                                <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="22px" height="22px"><path d="M 23.951172 4 A 1.50015 1.50015 0 0 0 23.072266 4.3222656 L 8.859375 15.519531 C 7.0554772 16.941163 6 19.113506 6 21.410156 L 6 40.5 C 6 41.863594 7.1364058 43 8.5 43 L 18.5 43 C 19.863594 43 21 41.863594 21 40.5 L 21 30.5 C 21 30.204955 21.204955 30 21.5 30 L 26.5 30 C 26.795045 30 27 30.204955 27 30.5 L 27 40.5 C 27 41.863594 28.136406 43 29.5 43 L 39.5 43 C 40.863594 43 42 41.863594 42 40.5 L 42 21.410156 C 42 19.113506 40.944523 16.941163 39.140625 15.519531 L 24.927734 4.3222656 A 1.50015 1.50015 0 0 0 23.951172 4 z M 24 7.4101562 L 37.285156 17.876953 C 38.369258 18.731322 39 20.030807 39 21.410156 L 39 40 L 30 40 L 30 30.5 C 30 28.585045 28.414955 27 26.5 27 L 21.5 27 C 19.585045 27 18 28.585045 18 30.5 L 18 40 L 9 40 L 9 21.410156 C 9 20.030807 9.6307412 18.731322 10.714844 17.876953 L 24 7.4101562 z"/></svg>
                            </div>
                            Accueil
                        </li>
                    </Link>
                    <li className="menu" onClick={toggleProjects}>
                        <div className={`icone-depli icone-navigation ${isProjectsOpen ? 'rotate' : ''}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24">
                                <path d="M7.293 4.707 14.586 12l-7.293 7.293 1.414 1.414L17.414 12 8.707 3.293 7.293 4.707z" />
                            </svg>
                        </div>
                        <div className="titre-menu">
                            Projets
                        </div>
                    </li>
                    <div className={`liste-projets ${isProjectsOpen ? 'open' : ''}`}>
                        {listeProjet.map((projet, index) => (
                            <Link key={index} to={`/mon-espace/projet/${projet.id_projet}`}>
                                <li>{projet.titre}</li>
                            </Link>
                        ))}
                    </div>
                    <Link to="/mon-espace/partage-avec-moi">
                        <li>
                            <div className="icone-navigation">
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M15.8 21C15.8 21.3866 16.1134 21.7 16.5 21.7C16.8866 21.7 17.2 21.3866 17.2 21H15.8ZM4.8 21C4.8 21.3866 5.1134 21.7 5.5 21.7C5.8866 21.7 6.2 21.3866 6.2 21H4.8ZM6.2 18C6.2 17.6134 5.8866 17.3 5.5 17.3C5.1134 17.3 4.8 17.6134 4.8 18H6.2ZM12.3 21C12.3 21.3866 12.6134 21.7 13 21.7C13.3866 21.7 13.7 21.3866 13.7 21H12.3ZM13.7 18C13.7 17.6134 13.3866 17.3 13 17.3C12.6134 17.3 12.3 17.6134 12.3 18H13.7ZM11.7429 11.3125L11.3499 10.7333L11.3499 10.7333L11.7429 11.3125ZM16.2429 11.3125L15.8499 10.7333L15.8499 10.7333L16.2429 11.3125ZM3.2 21V19.5H1.8V21H3.2ZM8 14.7H11V13.3H8V14.7ZM15.8 19.5V21H17.2V19.5H15.8ZM11 14.7C13.651 14.7 15.8 16.849 15.8 19.5H17.2C17.2 16.0758 14.4242 13.3 11 13.3V14.7ZM3.2 19.5C3.2 16.849 5.34903 14.7 8 14.7V13.3C4.57583 13.3 1.8 16.0758 1.8 19.5H3.2ZM11 14.7H15.5V13.3H11V14.7ZM20.3 19.5V21H21.7V19.5H20.3ZM15.5 14.7C18.151 14.7 20.3 16.849 20.3 19.5H21.7C21.7 16.0758 18.9242 13.3 15.5 13.3V14.7ZM6.2 21V18H4.8V21H6.2ZM13.7 21V18H12.3V21H13.7ZM9.5 11.3C7.67746 11.3 6.2 9.82255 6.2 8.00001H4.8C4.8 10.5958 6.90426 12.7 9.5 12.7V11.3ZM6.2 8.00001C6.2 6.17746 7.67746 4.7 9.5 4.7V3.3C6.90426 3.3 4.8 5.40427 4.8 8.00001H6.2ZM9.5 4.7C11.3225 4.7 12.8 6.17746 12.8 8.00001H14.2C14.2 5.40427 12.0957 3.3 9.5 3.3V4.7ZM12.8 8.00001C12.8 9.13616 12.2264 10.1386 11.3499 10.7333L12.1358 11.8918C13.3801 11.0477 14.2 9.61973 14.2 8.00001H12.8ZM11.3499 10.7333C10.8225 11.091 10.1867 11.3 9.5 11.3V12.7C10.4757 12.7 11.3839 12.4019 12.1358 11.8918L11.3499 10.7333ZM14 4.7C15.8225 4.7 17.3 6.17746 17.3 8.00001H18.7C18.7 5.40427 16.5957 3.3 14 3.3V4.7ZM17.3 8.00001C17.3 9.13616 16.7264 10.1386 15.8499 10.7333L16.6358 11.8918C17.8801 11.0477 18.7 9.61973 18.7 8.00001H17.3ZM15.8499 10.7333C15.3225 11.091 14.6867 11.3 14 11.3V12.7C14.9757 12.7 15.8839 12.4019 16.6358 11.8918L15.8499 10.7333ZM11.9378 5.42349C12.5029 4.97049 13.2189 4.7 14 4.7V3.3C12.8892 3.3 11.8667 3.68622 11.0622 4.33114L11.9378 5.42349ZM14 11.3C13.3133 11.3 12.6775 11.091 12.1501 10.7333L11.3642 11.8918C12.1161 12.4019 13.0243 12.7 14 12.7V11.3Z" fill="#000000"/>
                                </svg>
                            </div>
                            Partagés avec moi
                        </li>
                    </Link>
                    <Link to="/mon-espace/mes-statistiques">
                        <li>
                            <div className="icone-navigation">
                                <svg fill="#000000" height="25px" width="25px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 511 511">
                                    <g>
                                        <path d="m415.5,32h-80.001c-0.089,0-0.174,0.01-0.262,0.013-7.204-9.708-18.747-16.013-31.737-16.013h-20.68c-5.521-9.749-15.921-16-27.32-16s-21.799,6.251-27.32,16h-20.68c-12.99,0-24.533,6.305-31.736,16.013-0.089-0.003-0.175-0.013-0.264-0.013h-80c-21.78,0-39.5,17.72-39.5,39.5v400c0,21.78 17.72,39.5 39.5,39.5h320c21.78,0 39.5-17.72 39.5-39.5v-400c0-21.78-17.72-39.5-39.5-39.5zm-232.5,23.5c0-13.509 10.991-24.5 24.5-24.5h25.47c3.174,0 6.004-1.998 7.067-4.988 2.341-6.587 8.555-11.012 15.463-11.012s13.122,4.425 15.463,11.012c1.063,2.99 3.893,4.988 7.067,4.988h25.47c13.509,0 24.5,10.991 24.5,24.5v24.5h-145v-24.5zm257,416c0,13.509-10.991,24.5-24.5,24.5h-320c-13.509,0-24.5-10.991-24.5-24.5v-400c0-13.509 10.991-24.5 24.5-24.5h73.431c-0.603,2.74-0.931,5.582-0.931,8.5v32c0,4.142 3.358,7.5 7.5,7.5h160c4.142,0 7.5-3.358 7.5-7.5v-32c0-2.918-0.328-5.76-0.931-8.5h73.431c13.509,0 24.5,10.991 24.5,24.5v400z"/>
                                        <path d="m415.5,64h-48c-4.142,0-7.5,3.358-7.5,7.5s3.358,7.5 7.5,7.5h40.5v385h-305v-385h40.5c4.142,0 7.5-3.358 7.5-7.5s-3.358-7.5-7.5-7.5h-48c-4.142,0-7.5,3.358-7.5,7.5v400c0,4.142 3.358,7.5 7.5,7.5h320c4.142,0 7.5-3.358 7.5-7.5v-400c0-4.142-3.358-7.5-7.5-7.5z"/>
                                        <path d="m255.5,32c-1.97,0-3.91,0.8-5.3,2.2-1.4,1.39-2.2,3.33-2.2,5.3 0,1.97 0.8,3.91 2.2,5.3 1.39,1.4 3.33,2.2 5.3,2.2 1.97,0 3.91-0.8 5.3-2.2 1.4-1.39 2.2-3.32 2.2-5.3 0-1.97-0.8-3.91-2.2-5.3-1.39-1.401-3.33-2.2-5.3-2.2z"/>
                                        <path d="m128,359.5c0,12.958 10.542,23.5 23.5,23.5s23.5-10.542 23.5-23.5c0-4.239-1.134-8.216-3.106-11.654l34.417-38.719c2.824,1.205 5.93,1.873 9.189,1.873 6.763,0 12.864-2.876 17.156-7.464l47.465,21.575c-0.08,0.786-0.121,1.582-0.121,2.389 0,12.958 10.542,23.5 23.5,23.5s23.5-10.542 23.5-23.5c0-7.067-3.14-13.41-8.092-17.721l39.05-94.835c0.51,0.033 1.024,0.056 1.542,0.056 12.958,0 23.5-10.542 23.5-23.5s-10.542-23.5-23.5-23.5-23.5,10.542-23.5,23.5c0,7.067 3.14,13.41 8.092,17.721l-39.05,94.835c-0.51-0.033-1.024-0.056-1.542-0.056-6.763,0-12.864,2.876-17.156,7.464l-47.465-21.575c0.08-0.786 0.121-1.582 0.121-2.389 0-12.958-10.542-23.5-23.5-23.5s-23.5,10.542-23.5,23.5c0,4.239 1.134,8.216 3.106,11.654l-34.417,38.719c-2.824-1.205-5.93-1.873-9.189-1.873-12.958,0-23.5,10.542-23.5,23.5zm231.5-176.5c4.687,0 8.5,3.813 8.5,8.5s-3.813,8.5-8.5,8.5-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5zm-56,136c4.687,0 8.5,3.813 8.5,8.5s-3.813,8.5-8.5,8.5-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5zm-88-40c4.687,0 8.5,3.813 8.5,8.5s-3.813,8.5-8.5,8.5-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5zm-55.5,80.5c0,4.687-3.813,8.5-8.5,8.5s-8.5-3.813-8.5-8.5 3.813-8.5 8.5-8.5 8.5,3.813 8.5,8.5z"/>
                                    </g>
                                </svg>
                            </div>
                            Mes statistiques
                        </li>
                    </Link>
                    <Link to="/mon-espace/corbeille">
                        <li>
                            <div className="icone-navigation">
                                <svg className="bin trash" width="25" height="25" fill="#000000" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.96 3.6h3.6a.6.6 0 0 1 .6.6v1.2h-4.8V4.2a.6.6 0 0 1 .6-.6Zm5.4 1.8V4.2a1.8 1.8 0 0 0-1.8-1.8h-3.6a1.8 1.8 0 0 0-1.8 1.8v1.2H5.168a.6.6 0 0 0-.012 0H3.96a.6.6 0 0 0 0 1.2h.646L5.63 19.392A2.4 2.4 0 0 0 8.022 21.6h7.476a2.4 2.4 0 0 0 2.393-2.208L18.915 6.6h.645a.6.6 0 0 0 0-1.2h-1.194a.61.61 0 0 0-.012 0H15.36Zm2.35 1.2-1.015 12.696a1.2 1.2 0 0 1-1.197 1.104H8.022a1.2 1.2 0 0 1-1.196-1.104L5.811 6.6H17.71ZM8.726 7.8a.6.6 0 0 1 .633.564l.6 10.2a.6.6 0 0 1-1.197.072l-.602-10.2a.6.6 0 0 1 .564-.636h.002Zm6.07 0a.6.6 0 0 1 .563.636l-.6 10.2a.6.6 0 1 1-1.197-.072l.6-10.2a.6.6 0 0 1 .633-.564Zm-3.036 0a.6.6 0 0 1 .6.6v10.2a.6.6 0 1 1-1.2 0V8.4a.6.6 0 0 1 .6-.6Z"></path>
                                </svg>
                            </div>
                            Corbeille
                        </li>
                    </Link>
                </ul>
            </div>
            <div className={`premium ${isSidebarOpen ? 'close' : ''}`}>
                <Link to="/premium">
                    <button className="btn-premium" type="button">
                        <strong>PlumaPremium</strong>
                        <div id="container-stars">
                            <div id="stars"></div>
                        </div>

                        <div id="glow">
                            <div className="circle"></div>
                            <div className="circle"></div>
                        </div>
                    </button>
                </Link>
            </div>
            <div className={`toggle-button ${isSidebarOpen ? 'close' : ''}`} onClick={toggleSidebar}>
                <svg id="eQXyaThE5gd1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 500" shapeRendering="geometricPrecision" textRendering="geometricPrecision" width="100%" height="100%">
                    <ellipse rx="237.58581" ry="214.427627" transform="matrix(.711193 0 0 1.000001 178.909992 250)" fill="#ffafa5" strokeWidth="0"/>
                    <polygon points="0,-98.25934 93.450185,-30.363806 57.755391,79.493476 -57.755391,79.493476 -93.450185,-30.363806 0,-98.25934" transform="matrix(1.138413 1.360925-1.539158 1.287505 56.492851 165.484719)" fill="#ffafa5" strokeWidth="0"/>
                    <polygon points="0,-98.25934 93.450185,-30.363806 57.755391,79.493476 -57.755391,79.493476 -93.450185,-30.363806 0,-98.25934" transform="matrix(.786197 1.590596-1.798908 0.889161 80.24744 339.908492)" fill="#ffafa5" strokeWidth="0"/>
                    <path d="M20.972,95.594L78.577,49.643c.951-.76.951-2.367,0-3.127L20.968,0.56c-.689-.547-1.716-.709-2.61-.414-.186.061-.33.129-.436.186-.65.35-1.056,1.025-1.056,1.764v91.967c0,.736.405,1.414,1.056,1.762.109.06.253.127.426.185.903.295,1.933.134,2.624-.416Z" transform={isSidebarOpen ? "matrix(1.93752 0 0 1.93752 114.577189 156.84779)" : "matrix(-1.93752 0 0 -1.93752 300.881839 343.15225)"} fill="#fff" style={{ transition: 'transform 0.2s ease' }}/>
                </svg>
            </div>
        </div>
    );
};

export default Sidebar;
