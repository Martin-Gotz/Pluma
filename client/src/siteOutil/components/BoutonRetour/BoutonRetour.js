import "./BoutonRetour.scss";
import React from "react";
import {useNavigate} from "react-router-dom";

const BoutonRetour = () => {
    const navigate = useNavigate();

    return (
        <button className="retour" onClick={() => navigate(-1)}>
          <svg fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="m17.835 3.87-1.78-1.77-9.89 9.9 9.9 9.9 1.77-1.77L9.705 12l8.13-8.13Z"></path>
          </svg>
        </button>
    );
};

export default BoutonRetour;
