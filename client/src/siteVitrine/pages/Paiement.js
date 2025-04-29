import React, { useState } from "react";
import {Link, useOutletContext} from 'react-router-dom';
import "../styles/Paiement.scss";

const Paiement = () => {
    const { subType } = useOutletContext();
    const [securityMessage, setSecurityMessage] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const displaySecurityMessage = (type) => {
        if (type === "visa" || type === "mastercard" || type === "americanexpress") {
            setSecurityMessage(`Le code de sécurité correspond aux 3 chiffres situés au verso de la carte bancaire. Le code de sécurité correspond aux 4 chiffres situés au recto de la carte bancaire.`);
        }
        setIsPopupOpen(true);
    };

    const closeSecurityMessage = () => {
        setSecurityMessage("");
        setIsPopupOpen(false);
    };

    return (
        <div className="my-20 flex justify-center relative">
            <div className="fenetreDePaiement w-96 py-5 px-2 md:px-5 bg-white shadow-md rounded border border-gray-400">
                <p className="surTitrePaiement">ÉTAPE 2</p>
                <h1 className="titrepaiement text-center text-gray-800 font-bold tracking-normal leading-tight m-2">Paiement</h1>
                <div className="py-2">
                    {subType === "premium-1m" && (
                        <p className="typePremium">Pluma Premium 1 mois</p>
                    )}
                    {subType === "premium-3m" && (
                        <p className="typePremium">Pluma Premium 3 mois</p>
                    )}
                    {subType === "premium-12m" && (
                        <p className="typePremium">Pluma Premium 12 mois</p>
                    )}
                    {subType === "premium-1m" && (
                        <p className="euros">7.99€</p>
                    )}
                    {subType === "premium-3m" && (
                        <p className="euros">19.99€</p>
                    )}
                    {subType === "premium-12m" && (
                        <p className="euros">59.99€</p>
                    )}
                </div>

                <label htmlFor="name" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">NOM DU TITULAIRE</label>
                <input id="name"
                       className="mb-5 mt-2 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                       placeholder="M. | MME | MLLE"/>
                <label htmlFor="email2" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">NUMÉRO DE CARTE</label>
                <div className="relative mb-5 mt-2">
                    <div className="absolute text-gray-600 flex items-center px-4 border-r h-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-credit-card"
                             width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                             fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"/>
                            <rect x="3" y="5" width="18" height="14" rx="3"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                            <line x1="7" y1="15" x2="7.01" y2="15"/>
                            <line x1="11" y1="15" x2="13" y2="15"/>
                        </svg>
                    </div>
                    <input id="email2"
                           className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-16 text-sm border-gray-300 rounded border"
                           placeholder="XXXX - XXXX - XXXX - XXXX"/>
                </div>
                <label htmlFor="expiry" className="text-gray-800 text-sm font-bold leading-tight tracking-normal">DATE D'EXPIRATION</label>
                <div className="relative mb-5 mt-2">
                    <input id="expiry"
                           className="text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                           placeholder="MM/YY"/>
                </div>
                <label htmlFor="cvc"
                       className="text-gray-800 text-sm font-bold leading-tight tracking-normal">CVC</label>
                <div className="relative mb-5 mt-2">
                    <div className="absolute right-0 text-gray-600 flex items-center pr-3 h-full cursor-pointer" onClick={() => displaySecurityMessage("visa")}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-info-circle"
                             width="20" height="20" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor"
                             fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z"></path>
                            <circle cx="12" cy="12" r="9"></circle>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                            <polyline points="11 12 12 12 12 16 13 16"></polyline>
                        </svg>
                    </div>
                    <input id="cvc"
                           className="mb-8 text-gray-600 focus:outline-none focus:border focus:border-indigo-700 font-normal w-full h-10 flex items-center pl-3 text-sm border-gray-300 rounded border"
                           placeholder="CVC"/>
                </div>
                <div className="flex items-center justify-center w-full">
                    <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:bg-[#ffb7ac] transition duration-150 ease-in-out hover:bg-[#ffb7ac] bg-[#fc8c79] rounded text-white px-8 py-2 text-sm">TERMINER</button>
                    <Link to="/premium/formules">
                        <button className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 ml-3 bg-gray-100 transition duration-150 text-gray-600 ease-in-out hover:border-gray-400 hover:bg-gray-300 border rounded px-8 py-2 text-sm">Annuler</button>
                    </Link>
                </div>
            </div>

            {isPopupOpen && (
                <>
                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded border border-gray-300 shadow-md">
                        <p className="text-gray-800">{securityMessage}</p>
                        <button onClick={closeSecurityMessage} className="mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-600">Fermer</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Paiement;