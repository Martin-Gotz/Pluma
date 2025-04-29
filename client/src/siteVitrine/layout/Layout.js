import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import "../styles/StyleLayout.scss";

const Layout = () => {
    return (
        <div className="div-principale-vitrine">
            <Header />
            <div className="contenu">
                <Outlet />
            </div>
        </div>
    )
};

export default Layout;