import React from 'react';
import './Header.scss';
import { Link, useLocation } from "react-router-dom";
import useCheckSession from "../../../hooks/useCheckSession";

function Header() {
    const url = useLocation();
    const alreadyConnect = useCheckSession();

    return (
        <div className="header-container">
            <div className="logo-et-texte">
                <Link to="/" className={url.pathname === '/' ? 'active' : ''}>
                    <img src="/assets/plume-doie.png" alt="logo clair" className="logo" />
                    <h5>Pluma</h5>
                </Link>
            </div>
            <div className="menu">
                <nav>
                    <ul className="menu-ul">
                        <Link to="/" className={url.pathname === '/' ? 'active' : ''}>
                            <li>
                                Accueil
                            </li>
                        </Link>
                        <Link to="/qui-sommes-nous" className={url.pathname === '/qui-sommes-nous' ? 'active' : ''}>
                            <li>
                                Qui sommes nous
                            </li>
                        </Link>
                        <Link to="/premium" className={url.pathname === '/premium' ? 'active' : ''}>
                            <li>
                                PlumaPremium
                            </li>
                        </Link>
                        <Link to={alreadyConnect ? "/mon-espace" : "/inscription-connexion"} className={url.pathname === '/inscription-connexion' ? 'active a-acces-espace' : 'a-acces-espace'}>
                            <li>
                                Accéder à votre espace
                            </li>
                        </Link>
                    </ul>
                </nav>
            </div>
        </div>
    );
}

export default Header;