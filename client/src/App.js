import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Layout from "./siteVitrine/layout/Layout";
import Accueil from "./siteVitrine/pages/Accueil";

export default function App() {
    return (
        <Router>
            <Route element={<Layout />}>
                <Route index element={<Accueil />} />
            </Route>
        </Router>
    );
}
