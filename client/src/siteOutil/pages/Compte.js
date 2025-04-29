import React, {useEffect, useState} from 'react';
import "../styles/Compte.scss";
import TexteEditable from "../components/texteEditable/texteEditable";
import useLogout from "../hooks/useLogout";
import useUserInfo from "../hooks/useUserInfo";
import PopupChangePwd from "../components/Popups/PopupChangePwd/PopupChangePwd";
import PopupDisabledAccount from "../components/Popups/PopupDisabledAccount/PopupDisabledAccount";
import apiUrl from "../../config";
import {useOutletContext} from "react-router-dom";
import ImageEditable from "../components/imageEditable/imageEditable";

const Compte = () => {
    const [user, setUser] = useState({});
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [selectedFont, setSelectedFont] = useState('Arial, sans-serif');
    const [isPopupVisibleChangePwd, setPopupVisibilityChangePwd] = useState(false);
    const [isPopupVisibleDisabledAccount, setPopupVisibilityDisabledAccount] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const {logout} = useLogout();
    const {userInfo} = useUserInfo();
    const { image, setImage } = useOutletContext();

    useEffect(()=>{
        if(userInfo){
            setUser(userInfo);
            if(userInfo.photo){
                setImage(`../assets/userImport/profile-pic/${userInfo.photo}`)
            }else{
                setImage(`../assets/avatar/${userInfo.avatar}`)
            }
            setIsDarkMode(userInfo.dark_mode === 1);
        }
    }, [userInfo]);

    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 10)}.${file.name.split('.').pop()}`;

            const reader = new FileReader();
            reader.onloadend = async () => {
                setImage(reader.result);

                const formData = new FormData();
                formData.append('photo', fileName);
                formData.append('photoContent', file);

                try {
                    const response = await fetch(`${apiUrl}/user/update-info`, {
                        method: 'POST',
                        body: formData,
                        credentials: 'include',
                    });

                    const data = await response.json();

                    if (!data.success) {
                        console.error(data.message);
                    }
                } catch (error) {
                    console.error('Erreur de l\'envoi de l\'image ', error);
                }
            };

            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = async () => {
        try {
            const response = await fetch(`${apiUrl}/user/update-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    photo: null,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                setImage(`../assets/avatar/${userInfo.avatar}`);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la requête API', error);
        }
    };

    const handleRandomAvatar = async () => {
        try{
            const match = userInfo.avatar.match(/\d+/);
            const idAvatar = match ? parseInt(match[0], 10) : null;

            if(idAvatar === null){
                return;
            }

            let randomAvatarId = 1

            do{
                randomAvatarId = Math.floor(Math.random() * 6) + 1;
            }while (randomAvatarId === idAvatar);

            const response = await fetch(`${apiUrl}/user/update-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    randomAvatar: randomAvatarId,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                userInfo.avatar = `avatar_${randomAvatarId}.jpg`;
                setImage(`../assets/avatar/${userInfo.avatar}`);
            } else {
                console.error(data.message);
            }
        }catch (error){
            console.error('Erreur lors de la requête API', error);
        }
    }

    const handleDescSave = async (newDesc) => {
        try {
            const response = await fetch(`${apiUrl}/user/update-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: newDesc,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!data.success) {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la requête API', error);
        }
    };

    const toggleDarkMode = async () => {
        try {
            const idDarkMode = isDarkMode ? 2 : 1;

            const response = await fetch(`${apiUrl}/user/update-info`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    dark_mode: idDarkMode,
                }),
                credentials: 'include',
            });

            const data = await response.json();

            if (!data.success) {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Erreur lors de la requête API', error);
        }
        setIsDarkMode((prevMode) => !prevMode);
    };

    const handleFontChange = (e) => {
        setSelectedFont(e.target.value);
    };

    const toggleChangePwd = () => {
        setPopupVisibilityChangePwd(!isPopupVisibleChangePwd);
    };

    const toggleDisabledAccount = () => {
        setPopupVisibilityDisabledAccount(!isPopupVisibleDisabledAccount);
    };

    const handleSuccessMessage = (message) => {
        setSuccessMessage(message);

        // Effacer le message après 5 secondes
        setTimeout(() => {
            setSuccessMessage('');
        }, 5000);
    };

    return (
        <div className="parametres-container h-full">
            <div className="parametres h-full">
                <h1 className="titre">Mon profil</h1>

                <div className="lg:flex mt-8 lg:ms-6">
                    <ImageEditable
                        imageEditable={image}
                        handleImageChange={handleImageChange}
                        handleImageRemove={handleImageRemove}
                        handleRandomAvatar={handleRandomAvatar}
                        alt={"avatar"}
                    />

                    <div className="info-account flex-col my-auto lg:ms-16 mb-4 lg:mb-0 mt-6">
                        <div className="flex justify-center">
                            <div className="text-end">
                                <p>Pseudo :</p>
                                <p>Adresse Mail :</p>
                            </div>
                            <div className="ms-10">
                                <p>{user.pseudo}</p>
                                <p>{user.mail}</p>
                            </div>
                        </div>
                        <button className="change-pwd mt-6 flex mx-auto" onClick={toggleChangePwd}>
                            Modifier le mot de passe
                        </button>
                        <p className={`pwd-changed mt-2 flex mx-auto ${successMessage ? 'success' : '' }`}>{successMessage}</p>
                        {isPopupVisibleChangePwd && (
                            <div className="popup">
                                <PopupChangePwd onClose={toggleChangePwd} onSuccess={handleSuccessMessage} />
                            </div>
                        )}
                    </div>

                    <div className="blazon lg:ms-52">
                        <img className="mx-auto" src={`/assets/Blazon/Blazon-${user.type_abonnement}.png`}  alt={`blazon ${user.type_abonnement}`}/>
                        <p className="text-center capitalize">{user.type_abonnement}</p>
                    </div>
                </div>

                <div className="desc-account mt-8 space-y-3">
                    <p>Description :</p>
                    <TexteEditable initialValeur={user.description ? user.description : ''} onSave={handleDescSave} inputType="textarea" idInput={"desc"} valeurParDefaut={""} placeholder={"Décrivez-vous, partagez votre citation préférée ou autre information."} />
                </div>

                <div className="parameters mt-12 h-full">
                    <h3 className="titre">Paramètres généraux</h3>

                        <div className="ms-8 flex items-center mt-4">
                            <div className="text-end h-max space-y-5">
                                <p className="">Dark / Light mode</p>
                                <p className="">Police</p>
                            </div>
                            <div className="ms-10 space-y-3">
                                <div>
                                    <label className="switch">
                                        <input type="checkbox" checked={!isDarkMode} onChange={toggleDarkMode}/>
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                                <div>
                                    <select value={selectedFont} onChange={handleFontChange}>
                                        <option value="Arial, sans-serif">Arial</option>
                                        <option value="Helvetica, sans-serif">Helvetica</option>
                                        <option value="Georgia, serif">Georgia</option>
                                        <option value="Times New Roman, serif">Times New Roman</option>
                                    </select>
                                </div>
                            </div>
                    </div>
                </div>

                <div className="danger-zone space-y-2 ms-8 mb-6">
                    <button className="flex" onClick={logout}>
                        <svg id="logout" width="24" height="24" fill="none" stroke="#ff564f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13 12v.01"></path>
                            <path d="M3 21h18"></path>
                            <path d="M17 13.5V21"></path>
                            <path d="M5 21V5a2 2 0 0 1 2-2h7.5"></path>
                            <path d="M21 7h-7"></path>
                            <path d="m18 4 3 3-3 3"></path>
                        </svg>
                        <p className="ms-4">Se déconnecter</p>
                    </button>
                    <button className="flex" onClick={toggleDisabledAccount}>
                        <svg id="delete-account" width="24" height="24" fill="#ff564f" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2ZM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12Zm3.1 6.31A7.902 7.902 0 0 0 12 20c4.42 0 8-3.58 8-8 0-1.85-.63-3.55-1.69-4.9L7.1 18.31Z" clipRule="evenodd"></path>
                        </svg>
                        <p className="ms-4">Désactiver mon compte</p>
                    </button>
                    {isPopupVisibleDisabledAccount && (
                        <div className="popup">
                            <PopupDisabledAccount onClose={toggleDisabledAccount} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Compte;
