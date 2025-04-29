import React from "react";
import "../styles/Fomules.scss";
import {Link, useOutletContext} from "react-router-dom";

const Formules = ({ id, title, price, description }) => {
    const { setSubType } = useOutletContext();

    return (
        <div className="flex w-full max-w-[416px] flex-col items-start rounded-2xl border border-solid border-[#9b9b9b] bg-white px-8 pb-12 pt-8">
            <div className="mb-4 rounded-lg bg-[#fc8c79] px-5 py-2">
                <p className="text-sm font-bold text-white">{title}</p>
            </div>
            <h2 className="mb-4 text-left text-3xl font-semibold md:text-5xl">{price}</h2>
            <p className="mb-6 font-light text-[#636262] italic md:mb-10 lg:mb-12">{description}</p>
            <div className="items-center justify-center">
                <Link to="/premium/paiement">
                    <button className="mx-auto rounded-xl bg-[#bf5748] px-7 py-4 text-center font-semibold text-white [box-shadow:rgb(252,_140,_121)_6px_6px]" onClick={() => setSubType(id)}>SÉLECTIONNER L'OFFRE</button>
                </Link>
            </div>
        </div>
    );
};

const SectionTarification = () => {
    const formulesData = [
        {
            id: "premium-1m",
            title: "1 mois",
            price: "7.99€",
            description: "Abonnement classique"
        },
        {
            id: "premium-3m",
            title: "3 mois",
            price: "19.99€",
            description: "Soit 17% d'éconnomie!"
        },
        {
            id: "premium-12m",
            title: "12 mois",
            price: "59.99€",
            description: "Soit 37% d'éconnomie!"
        }
    ];

    return (
        <section className="relative">
            <div className="mx-auto w-full max-w-7xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
                <div className="flex flex-col items-center justify-start max-[767px]:text-center">
                    <p className="text-xs m-5">ÉTAPE 1</p>
                    <h2 className="text-3xl font-semibold md:text-5xl">
                        <span className="bg-cover bg-center bg-no-repeat px-4 bg-[#fc8c79] text-white">Choisissez votre Abonnement</span>
                    </h2>
                    <div className="mx-auto mb-8 mt-4 max-w-[528px] md:mb-12 lg:mb-16">
                        <p className="text-[#636262]">Changez d'offre à tout moment !</p>
                    </div>
                    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3 md:gap-4 lg:grid-cols-3">
                        {formulesData.map((formule, index) => (
                            <Formules
                                key={index}
                                id={formule.id}
                                title={formule.title}
                                price={formule.price}
                                description={formule.description}
                            />
                        ))}
                    </div>
                    <p className="PetiteLigne m-5">L'abonnement est à payer immédiatement, aucun paiement en plusieurs fois n'est autorisé. Vous pouvez changer d'abonnement pour passer au PlumaPremium 1 mois, PlumaPremium 2 mois ou PlumaPremium 12 mois quand vous le souhaitez. La résiliation prendra effet à la fin de la période de facturation. Tous les abonnements sont détaillés sur <a href="/premium" className="lienPP">PlumaPremium</a>.</p>
                </div>
            </div>
        </section>
    );
};

export default SectionTarification;
