import ReactDOM from "react-dom/client";
import './styles/index.css';

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./siteVitrine/layout/Layout";
import Accueil from "./siteVitrine/pages/Accueil";
import QuiSommesNous from "./siteVitrine/pages/QuiSommesNous";
import PlumaPremium from "./siteVitrine/pages/PlumaPremium";
import ConnexionInscription from "./siteVitrine/pages/ConnexionInscription";
import MonEspace from "./siteOutil/pages/MonEspace";
import Page404 from "./404";
import Corbeille from "./siteOutil/pages/Corbeille";
import PartageAvecMoi from "./siteOutil/pages/PartageAvecMoi";
import ResumeProjet from "./siteOutil/pages/ResumeProjet";
import EditionProjet from "./siteOutil/pages/EditionProjet";
import EditionChapitre from "./siteOutil/pages/EditionChapitre";
import EcritureChapitre from "./siteOutil/pages/EcritureChapitre";
import Elements from "./siteOutil/pages/Elements";
import Compte from "./siteOutil/pages/Compte";
import ResultatRecherche from "./siteOutil/pages/ResultatRecherche";
import LayoutEditionProjet from "./siteOutil/layout/LayoutEditionProjet";
import LayoutEditionChapitre from "./siteOutil/layout/LayoutEditionChapitre";
import LayoutMonEspace from "./siteOutil/layout/LayoutMonEspace";
import Paiement from "./siteVitrine/pages/Paiement";
import Formules from "./siteVitrine/pages/Formules";
import Statistiques from "./siteOutil/pages/Statistiques";
import LayoutPremium from "./siteVitrine/layout/LayoutPremium";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Accueil />} />
                    <Route path="qui-sommes-nous" element={<QuiSommesNous />} />
                    <Route path="premium" element={<LayoutPremium />}>
                        <Route index element={<PlumaPremium />} />
                        <Route path="formules" element={<Formules />} />
                        <Route path="paiement" element={<Paiement />} />
                    </Route>
                    <Route path="inscription-connexion" element={<ConnexionInscription />} />
                    <Route path="*" element={<Page404 />} />
                </Route>
                <Route path="mon-espace" element={<LayoutMonEspace />}>
                    <Route index element={<MonEspace />} />
                    <Route path="partage-avec-moi" element={<PartageAvecMoi />} />
                    <Route path="corbeille" element={<Corbeille />} />
                    <Route path="resultat-recherche" element={<ResultatRecherche />} />
                    <Route path="mes-statistiques" element={<Statistiques />} />

                    <Route path="projet/:idProjet">                                         {/* idProjet unique */}
                        <Route index element={<ResumeProjet />} />
                        <Route path="edition" element={<LayoutEditionProjet />}>
                            <Route index element={<EditionProjet />} />
                            <Route path=":numChapitre" element={<LayoutEditionChapitre />}>       {/* numChapitre != idChapitre  |  numChapitre non unique */}
                                <Route index element={<EditionChapitre />} />
                                <Route path="ecriture" element={<EcritureChapitre />} />
                            </Route>
                            <Route path="elements" element={<Elements />} />
                        </Route>
                    </Route>

                    <Route path="compte" element={<Compte />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
