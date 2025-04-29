import React, { useState } from 'react';
import '../Popup.scss';
import apiUrl from "../../../../config";

const PopupChangePwd = ({ onClose, onSuccess  }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');

    const handleOldPasswordChange = (e) => {
        setOldPassword(e.target.value);
    };

    const handleNewPasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleConfirmNewPasswordChange = (e) => {
        setConfirmNewPassword(e.target.value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleChangePasswordClick = async () => {
        try {
            if (!oldPassword || !newPassword || !confirmNewPassword){
                setError('Remplir les champs demandés');
                return;
            }

            if (newPassword !== confirmNewPassword) {
                setError('Les nouveaux mots de passe ne correspondent pas');
                return;
            }

            const response = await fetch(`${apiUrl}/user/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    oldPassword: oldPassword,
                    newPassword: newPassword,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                onSuccess('Mot de passe modifié avec succès');
                onClose();
            } else {
                console.error(data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la requête API', error);
            setError('Erreur lors de la requête API');
        }
    };

    return (
        <div className="popup-container">
            <div className="popup">
                <h2>Modifier le mot de passe</h2>

                <label htmlFor="oldPassword">Ancien mot de passe :</label>
                <input required type="password" id="oldPassword" value={oldPassword} onChange={handleOldPasswordChange}/>

                <label htmlFor="newPassword">Nouveau mot de passe :</label>
                <input required type="password" id="newPassword" value={newPassword} onChange={handleNewPasswordChange}/>

                <label htmlFor="confirmNewPassword">Confirmer le nouveau mot de passe :</label>
                <input required type="password" id="confirmNewPassword" value={confirmNewPassword} onChange={handleConfirmNewPasswordChange}/>

                {error && <p className="error-message">{error}</p>}

                <div className="button-container">
                    <button onClick={handleCancelClick}>Annuler</button>
                    <button onClick={handleChangePasswordClick}>Valider</button>
                </div>

            </div>
        </div>
    );
};

export default PopupChangePwd;