import React, {useEffect, useRef, useState} from 'react';
import {Link} from "react-router-dom";
import './profil.scss';
import useLogout from "../../hooks/useLogout";
import useUserInfo from "../../hooks/useUserInfo";
import ShareDeleteIcons from "../ShareDeleteIcons/ShareDeleteIcons";

const Profil = ({ toolsButtons = true, image: imageProfil, setImage: setImage }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState({ pseudo: '' });
    const dropdownRef = useRef(null);
    const {logout} = useLogout();
    const {userInfo} = useUserInfo();

    const handleArrowClick = () => {
        setIsOpen(prevState => !prevState);
    };

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsOpen(false);
        }
    };

    useEffect(()=>{
        if(userInfo){
            setUser(userInfo);
            if(userInfo.photo){
                setImage(`/assets/userImport/profile-pic/${userInfo.photo}`)
            }else{
                setImage(`/assets/avatar/${userInfo.avatar}`)
            }
        }
    }, [userInfo]);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex absolute right-6 top-3 items-center z-20">

            <div className={`profil ${isOpen ? 'open' : ''}`} onClick={handleArrowClick} ref={dropdownRef}>
                <div className="flex items-center">
                    <img className="mr-2" src={imageProfil} alt="profil"/>
                    <p className="mr-5 username">{user.pseudo.length > 10 ? `${user.pseudo.slice(0, 10)}...` : user.pseudo}</p>
                    <svg width="20" height="20" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="m19 9-7 7-7-7"></path>
                    </svg>

                </div>
                {isOpen && (
                    <ul className="dropdown-menu absolute">
                        <Link to="/mon-espace/compte">
                            <li><p>Mon Compte</p></li>
                        </Link>
                        <li><p className="logout" onClick={logout}>Se déconnecter</p></li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Profil;
