import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar/sidebar";
import Profil from "../components/Profil/profil";
import "../styles/LayoutMonEspace.scss"
import {useEffect, useState} from "react";
import useCheckSession from "../../hooks/useCheckSession";
import {UseFetchData} from "../hooks/operationsDonnees";
import apiUrl from "../../config";

const LayoutMonEspace = () => {
    //Lecture des projets
    const { data: donneesProjet, loading: loadingProjet, error: errorProjet } = UseFetchData(`${apiUrl}/read-table/projet`);

    const [listeProjet, setListeProjet] = useState([]);

    useEffect(() => {
        if (donneesProjet) {
            setListeProjet([...donneesProjet.filter(projet => projet.id_statut !== 4)]);
        }
    }, [donneesProjet]);

    const [recherche, setRecherche] = useState('');
    const alreadyConnect = useCheckSession();

    //Image de profil
    const [image, setImage] = useState("../assets/profil.png");

    if(alreadyConnect === false){
        window.location.href = "/inscription-connexion"
    }

    const handleRechercheChange = (nouvelleRecherche) => {
        setRecherche(nouvelleRecherche);
    };

    const ToastMessage = ({ message }) => {
        const [isVisible, setIsVisible] = useState(true);

        useEffect(() => {
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000); // Change the duration as needed

            return () => {
                clearTimeout(timer);
            };
        }, []);

        return (
            <div
                className={`toast ${isVisible ? 'visible' : ''}`}
            >
                {message}
            </div>
        );
    };

    return (
        <div className="div-principale-outil">
            {/*<div>
                <ToastMessage message="This is a success message!" />
            </div>*/}
            <Sidebar onRechercheChange={handleRechercheChange} listeProjet={listeProjet} />
            <div className="contenu">
                <Outlet context={{recherche, setRecherche, listeProjet, setListeProjet, image, setImage}}/>
                <Profil image={image} setImage={setImage}/>
            </div>
        </div>
    );
};

export default LayoutMonEspace;