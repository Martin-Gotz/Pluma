import React, {useEffect, useState} from 'react';
import apiUrl from "../../config";
import "../styles/ConnexionInscription.scss";

const ConnexionInscription = () => {
    const [isLoginActive, setIsLoginActive] = useState(true);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [authSuccess, setAuthSuccess] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            try {
                const response = await fetch(`${apiUrl}/check-session`, {
                    method: 'GET',
                    credentials: 'include',
                });

                const data = await response.json();

                if (data.loggedIn) {
                    window.location.href = './mon-espace';
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de session', error);
            }
        };

        checkSession().then(r => null);

        const anchor = window.location.hash;

        if (anchor === '#inscription') {
            changeFormState(false)
        }else if (anchor === '#connexion') {
            changeFormState(true)
        }
    }, []);

    const changeFormState = (loginState) => {
        setIsLoginActive(loginState);
        setLoginData({ username: '', password: '' });
        setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
        setError('');
    };

    const handleSubmit = async (e, isLogin) => {
        e.preventDefault();

        if (!isLogin) {
            if (registerData.password !== registerData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                return;
            }
        }

        try {
            const response = await fetch(`${apiUrl}/${isLogin ? 'login' : 'register'}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(isLogin ? loginData : registerData),
                credentials: 'include',
            });

            const data = await response.json();

            if (data.success) {
                window.location.href = './mon-espace';
                setError('');
                if (isLogin) {
                    setAuthSuccess('Connexion réussie !');
                    setLoginData({ username: '', password: '' });
                } else {
                    setAuthSuccess('Inscription réussie !');
                    setRegisterData({ username: '', email: '', password: '', confirmPassword: '' });
                }
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
        <div className="connexion-page">
            <div className="connexion-panel">
                <div className="panel-heading">
                    <button className={isLoginActive ? "z-30" : "z-10"} onClick={() => changeFormState(true)}>
                        Connexion
                    </button>
                    <button className={!isLoginActive ? "z-20" : "z-0"} onClick={() => changeFormState(false)}>
                        Inscription
                    </button>
                </div>
                <div className={`panel-body ${isLoginActive ? 'connexion' : 'inscription'} flex`}>
                    {isLoginActive &&
                        <>
                            <div className={"formulaire formulaire-connexion"}>
                                <form onSubmit={(e) => handleSubmit(e, true)} method="post" className="active-form flex">
                                    <div className={"contenu-formulaire contenu-formulaire-connexion"}>
                                        <div className="en-tete-slogan">
                                            <p>Connecte-toi vite afin de reprendre ton chef-d'œuvre.</p>
                                        </div>
                                        <div className={"champs-formulaire"}>
                                            <div className="champ-formulaire pseudo">
                                                <input required type="text" name="username" id="username" tabIndex="1" className="form-input" placeholder="Pseudo / Adresse Mail" onChange={e => setLoginData({ ...loginData, username: e.target.value })}/>
                                            </div>
                                            <div className="champ-formulaire mot-de-passe">
                                                <input required type="password" name="password" id="password" tabIndex="2" className="form-input" placeholder="Mot de passe" onChange={e => setLoginData({ ...loginData, password: e.target.value })}/>
                                            </div>
                                        </div>
                                        <div className={`auth-message ${error ? 'error' : ''} ${authSuccess ? 'success' : '' }`}>
                                            <p>{error}{authSuccess}</p>
                                        </div>
                                        <div className="bouton-connexion-inscription">
                                            <button type="submit" name="login-submit" id="login-submit" tabIndex="3" className="btn btn-login">
                                                <b>Se connecter</b>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            <div className="boite-slogan">
                                <span>
                                    <img className="m-auto mb-6" src="/assets/connection-cover-image.jpg" alt="Ordinateur application Pluma devant un livre et un café"/>
                                    <b>Laissez votre créativité s’exprimer avec Pluma</b>
                                </span>
                            </div>
                        </>
                    }
                    {!isLoginActive &&
                        <>
                            <div className="boite-slogan">
                                    <span>
                                        <img className="m-auto mb-6" src="/assets/register-cover-image.jpg" alt="Femme avec tas de livres dans ses bras" />
                                        <b>Laissez votre créativité s’exprimer avec Pluma</b>
                                    </span>
                            </div>
                            <div className={"formulaire formulaire-inscription"}>
                                <form className="active-form flex" onSubmit={(e) => handleSubmit(e, false)} method="post">
                                    <div className={"contenu-formulaire contenu-formulaire-inscription"}>
                                        <div className="en-tete-slogan">
                                            <p>Laisse ta plume te guider en rejoignant Pluma. </p>
                                        </div>
                                        <div className={"champs-formulaire"}>
                                            <div className="champ-formulaire pseudo">
                                                <input required type="text" name="username" id="username" tabIndex="1" className="form-input" placeholder="Pseudo" onChange={e => setRegisterData({ ...registerData, username: e.target.value })} />
                                            </div>
                                            <div className="champ-formulaire email">
                                                <input required type="email" name="email" id="email" tabIndex="1" className="form-input" placeholder="Adresse Mail" onChange={e => setRegisterData({ ...registerData, email: e.target.value })} />
                                            </div>
                                            <div className="champ-formulaire motdepasse">
                                                <input required type="password" name="password" id="password" tabIndex="2" className="form-input" placeholder="Mot de passe" onChange={e => setRegisterData({ ...registerData, password: e.target.value })} />
                                            </div>
                                            <div className="champ-formulaire motdepasse">
                                                <input required type="password" name="confirm-password" id="confirm-password" tabIndex="2" className="form-input" placeholder="Confirmation du mot de passe" onChange={e => setRegisterData({ ...registerData, confirmPassword: e.target.value })} />
                                            </div>
                                        </div>
                                        <div className={`auth-message ${error ? 'error' : ''} ${authSuccess ? 'success' : ''}`}>
                                            <p>{error}{authSuccess}</p>
                                        </div>
                                        <div className="bouton-connexion-inscription">
                                            <button type="submit" name="register-submit" id="register-submit" tabIndex="4" className="btn btn-register">
                                                <b>Nous rejoindre</b>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </>
                    }
                </div>
            </div>
        </div>
    );
};

export default ConnexionInscription;