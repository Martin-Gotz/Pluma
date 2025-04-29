import React, {useState} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MonEspace.scss";
import ElementListeProjets from "../components/elementListeProjets/elementListeProjets";

const PartageAvecMoi = () => {
    const [projetsPartages, setProjetsPartages] = useState([]);

    return (
        <div className="mon-espace">
            <h1 className="titre-general">Partagés avec moi</h1>
            <h2 className="titre-section">Projets</h2>
            <p className="text-center mb-10 mt-8 text-stone-500">Aucun projet 😥</p>
            <div className="section">
                <div className="liste-globale">
                    {projetsPartages.map((projet, index) => (
                        <ElementListeProjets
                            key={index}
                            id={`${projet.id_projet}`}
                            titreInitial={projet.titre}
                            statut={projet.id_statut}
                            favori={projet.favori === 1 || false}
                        />
                    ))}
                </div>
            </div>
        </div>
    );

};

export default PartageAvecMoi;