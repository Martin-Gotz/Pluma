import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './ListeGenres.scss';
import {modifierProjet, UseFetchData} from "../../hooks/operationsDonnees";
import apiUrl from "../../../config";
import {useNavigate} from "react-router-dom";

const ListeGenres = ({idProjet, initialSelectedGenres}) => {
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [menuOuvert, setMenuOuvert] = useState(false);
    const [position, setPosition] = useState({left: 0 });
    const menuSelectionRef = useRef(null);
    const boutonSelectionRef = useRef(null);

    const navigate = useNavigate();

    const { data: listeGenres, loading: loading, error: error } = UseFetchData(`${apiUrl}/read-table/genre`);

    useEffect(() => {
        if (listeGenres.length > 0){
            setSelectedGenres([listeGenres[initialSelectedGenres-1]])
        }
    }, [listeGenres, initialSelectedGenres]);

    useEffect(() => {
        if (selectedGenres.length > 0 && selectedGenres[0].id_genre != initialSelectedGenres){
            setGenreProjet(selectedGenres[0].id_genre)
        }
    }, [selectedGenres]);

    const updatePosition = () => {
        if (menuSelectionRef.current) {
            const rect = menuSelectionRef.current.getBoundingClientRect();
            const rightEdgeDistance = window.innerWidth - rect.right;

            setPosition({
                left: rightEdgeDistance <= 0 ? rightEdgeDistance : 'auto',
            });
        }
    };

    useLayoutEffect(() => {
        updatePosition();

        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [menuOuvert]);



    const handleClickOutside = (e) => {
        if (boutonSelectionRef.current && !boutonSelectionRef.current.contains(e.target)) {
            setMenuOuvert(false);
        }
    };

    useEffect(() => {
        window.addEventListener('click', handleClickOutside);

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [menuOuvert]);

    const setGenreProjet = async (idGenre) => {
        await modifierProjet(idProjet, "id_genre", idGenre)
    };

    const handleGenresSelect = async (genre) => {
        if (!selectedGenres.includes(genre)) {
            setSelectedGenres([...selectedGenres, genre]);
        }

        setMenuOuvert(false);
        setSelectedGenre('');
    };

    const handleGenreRemove = async (genre) => {
        const updatedGenres = selectedGenres.filter((selectedGenre) => selectedGenre !== genre);
        setSelectedGenres(updatedGenres);
    };



    if (loading) {
        return <div className="chargement">Chargement en cours...</div>;
    }

    if (error || !listeGenres) {
        navigate('/404', { replace: true });
        return null;
    }

    return (
        <div className="genres">
            <label className="label-container">Genre(s):</label>
            <ul className="liste-selection">
                {selectedGenres.map((genre, index) => (
                    <li className="genre-ajoute" onClick={() => handleGenreRemove(genre)} key={index}>
                        <span>{genre.nom_genre}</span>
                        <span className="remove-button">
                            {' '}x
                        </span>
                    </li>
                ))}
                <li>
                    <div className={`select-personnalise`}>
                        <div className="bouton-selection" onClick={() => setMenuOuvert(!menuOuvert)} ref={boutonSelectionRef}></div>
                        <ul className={`genres ${menuOuvert ? 'open' : ''}`} ref={menuSelectionRef} style={{ ...position }}>
                            {listeGenres.map((genre, index) => (
                                <li key={index} className={`genre ${selectedGenres.includes(genre.id_genre) ? 'genre-selectionne' : ''}`} onClick={() => handleGenresSelect(genre)}>
                                    {genre.nom_genre}
                                </li>
                            ))}
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ListeGenres;