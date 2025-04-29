import React, { useState } from 'react';
import '../Popup.scss'

const PopupCreation = ({nomProjetInitial, onClose, onCreateProject }) => {
    const [nomProjet, setNomProjet] = useState(nomProjetInitial);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        setNomProjet(e.target.value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleConfirmClick = () => {
        if (nomProjet.trim() !== '') {
            onCreateProject(nomProjet);
            onClose();
        } else {
            setError(`Veuillez entrer un nom de Projet.`);
        }
    }

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>Renommer le projet</h2>
                <label htmlFor="nomProjet">Nom du projet:</label>
                <input
                    type="text"
                    id="nomProjet"
                    value={nomProjet}
                    onChange={handleInputChange}
                />
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                    <button onClick={handleCancelClick}>Annuler</button>
                    <button onClick={handleConfirmClick}>Renommer</button>
                </div>
            </div>
        </div>
    );
};

export default PopupCreation;
