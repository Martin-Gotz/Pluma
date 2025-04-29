import React, { useState } from 'react';
import '../Popup.scss'

const PopupCreation = ({typeCreation, onClose, onCreateProject }) => {
    const [nomProjet, setNomProjet] = useState(`${typeCreation} sans nom`);
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
            setError(`Veuillez entrer un nom de ${typeCreation}.`);
        }
    }

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>Créer un nouveau {typeCreation}</h2>
                <label htmlFor="nomProjet">Nom du {typeCreation}:</label>
                <input
                    type="text"
                    id="nomProjet"
                    value={nomProjet}
                    onChange={handleInputChange}
                />
                {error && <p className="error-message">{error}</p>}
                <div className="button-container">
                    <button onClick={handleCancelClick}>Annuler</button>
                    <button onClick={handleConfirmClick}>Valider</button>
                </div>
            </div>
        </div>
    );
};

export default PopupCreation;
