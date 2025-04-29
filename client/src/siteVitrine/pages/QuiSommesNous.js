import React from "react";
import "../styles/QuiSommesNous.scss";

const QuiSommesNous = () => {
    const rectangleStyle = {
        backgroundColor: "#FFAFA5",
        width: "100%",
        height: "100px",
        marginTop: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    };

    const textStyle = {
        color: "#FFFFFF",
        fontSize: "25px",
    };

    const bodyStyle = {
        margin: 0,
    };

    return (
        <div style={bodyStyle}>
            <div style={rectangleStyle}>
                <p style={textStyle}>Qui sommes-nous ?</p>
            </div>

            <div className="contentContainerQuiSommesNous">
                <div className="decoQuiSommesNous">
                    <img src="/assets/livre-ouvert.png" alt="Livre ouvert" className="livre-ouvert"/>
                    <img src="/assets/livre-fermer1.png" alt="Livre fermer" className="livre-fermer"/>
                    <img src="/assets/livre-ouvert.png" alt="Livre ouvert" className="livre-ouvert"/>
                </div>

                <div className="decoQuiSommesNousDroite">
                    <img src="/assets/livre-fermer1.png" alt="Livre fermer" className="livre-fermer"/>
                    <img src="/assets/livre-ouvert.png" alt="Livre ouvert" className="livre-ouvert"/>
                    <img src="/assets/livre-fermer1.png" alt="Livre fermer" className="livre-fermer"/>
                </div>

                <div className="containerQuiSommesNous">
                    <p>
                        Bienvenue chez Pluma, votre partenaire créatif dans le monde de l'écriture. Pluma est bien plus qu'une simple application web ; c'est une communauté d'auteurs, de conteurs et de créateurs littéraires passionnés. Notre histoire, notre mission et notre passion se reflètent dans chaque aspect de ce que nous faisons.
                    </p>

                    <h2>Notre Histoire</h2>
                    <p>
                        L'histoire de Pluma prend racine dans une profonde passion pour l'écriture et le désir de soutenir la créativité des écrivains du monde entier. Nos fondateurs ont ressenti le besoin de créer un outil qui simplifierait le processus de gestion des écrits, tout en inspirant les auteurs à donner vie à leurs idées de manière cohérente et captivante. L'aventure a commencé avec la conviction que chaque histoire mérite d'être racontée, et Pluma est née de cette vision.
                    </p>

                    <h2>Notre Mission</h2>
                    <p>
                        Notre mission est claire : nous visons à stimuler la créativité tout en aidant les créateurs littéraires à produire un contenu mieux structuré et plus captivant. Nous croyons en la puissance des mots pour toucher les âmes, inspirer et divertir. Notre but ultime est de simplifier le processus créatif pour tous ceux qui ont une histoire à partager.
                    </p>

                    <h2>Notre Engagement</h2>
                    <p>
                        Nous sommes déterminés à libérer le potentiel créatif de chacun. Pluma est bien plus qu'un simple outil de gestion de projet, c'est un compagnon de voyage pour tous les écrivains. Que vous soyez un écrivain chevronné ou que vous commenciez tout juste à explorer votre talent, nous sommes là pour vous accompagner à chaque étape de votre voyage littéraire.
                    </p>

                    <h2>Rejoignez-nous dans votre Voyage Littéraire</h2>
                    <p>
                        Nous vous invitons à explorer tout ce que Pluma a à offrir. Transformez vos rêves d'écriture en œuvres abouties grâce à nos outils de structuration, de planification et de rédaction. Rejoignez notre communauté et partagez votre passion pour l'écriture avec d'autres créateurs comme vous. Nous sommes fiers de faire partie de votre voyage littéraire et de contribuer à l'épanouissement des talents littéraires du monde entier.
                    </p>
                </div>
            </div>

            <div style={rectangleStyle}>
                <p style={textStyle}>Découvrez l'art de raconter des histoires avec Pluma.</p>
            </div>
        </div>
    );
};
export default QuiSommesNous;