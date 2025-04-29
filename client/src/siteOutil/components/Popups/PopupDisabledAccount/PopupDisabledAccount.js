import React, { useState } from 'react';
import '../Popup.scss';
import apiUrl from "../../../../config";
import {useNavigate} from "react-router-dom";

const PopupChangePwd = ({ onClose  }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleCancelClick = () => {
        onClose();
    };

    const handleDisabledAccount = async () => {
        try {
            if (!password){
                setError('Rentrez le mot de passe');
                return;
            }

            const response = await fetch(`${apiUrl}/user/disabled-account`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: password,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                onClose();
                navigate('/');
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
                <h2>Désactivation du compte</h2>

                <label htmlFor="password">Mot de passe :</label>
                <input required type="password" id="password" value={password} onChange={handlePasswordChange}/>

                {error && <p className="error-message">{error}</p>}

                <div className="button-container">
                    <button onClick={handleCancelClick}>Annuler</button>
                    <button onClick={handleDisabledAccount}>Valider</button>
                </div>

            </div>
        </div>
    );
};

export default PopupChangePwd;