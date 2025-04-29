import { Outlet } from "react-router-dom";
import "../styles/StyleLayout.scss";
import {useState} from "react";

const LayoutPremium = () => {
    const [subType, setSubType] = useState('');

    return (
        <div className="div-principale-vitrine">
            <Outlet context={{subType, setSubType}} />
        </div>
    )
};

export default LayoutPremium;