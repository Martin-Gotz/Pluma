import React, { useState } from 'react';
import '../Popup.scss'

const PopupSuppressionProjet = ({idProjet, onClose, onDelete }) => {
    const handleDeleteConfirm = () => {
        onDelete(idProjet);
        onClose()
    };

    const handleDeleteCancel = () => {
        onClose();
    };

    return (
        <div className="popup-container">
            <div className="popup">
                <p className="text-xl mb-4">Confirmer la suppression ?</p>
                <div className="button-container delete-button">
                    <button
                        onClick={handleDeleteCancel}
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleDeleteConfirm}
                    >
                        Supprimer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PopupSuppressionProjet;
