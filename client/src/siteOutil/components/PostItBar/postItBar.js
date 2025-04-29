import React, {useEffect, useState} from 'react';
import './postItBar.scss';
import {useOutletContext} from "react-router-dom";
import apiUrl from "../../../config";

const PostItBar = () => {
    const { contenuChapitre } = useOutletContext();
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isPostItBarOpen, setIsPostItBarOpen] = useState(false);
    const [newPostitTitle, setNewPostitTitle] = useState('');
    const [newPostitContent, setNewPostitContent] = useState('');
    const [postits, setPostits] = useState([]);

    useEffect(() => {
        if (contenuChapitre.id_chapitre) {
            const url = `${apiUrl}/post-its/chapitre/${contenuChapitre.id_chapitre}`;
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    setPostits(data.data);
                })
                .catch(error => console.error('Erreur lors de la récupération des post-its:', error));
        }
    }, [contenuChapitre]);

    const deletePostIt = async (id) => {
        try {
            const response = await fetch(`${apiUrl}/postit-delete/chapitre/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression du post-it');
            }

            setPostits((prevPostits) => prevPostits.filter((postit) => postit.id_postit_chap !== id));
        } catch (error) {
            console.error('Erreur lors de la suppression du post-it:', error);
        }
    };

    const togglePostItBar = () => {
        setIsPostItBarOpen(prevState => !prevState);
    };

    const openOverlay = () => {
        setIsOverlayOpen(true);
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
        setNewPostitTitle('');
        setNewPostitContent('');
    };

    const addNewPostit = async (e) => {
        e.preventDefault();

        if (!newPostitTitle || !newPostitContent) {
            closeOverlay();
            return;
        }

        const postitData = {
            titre: newPostitTitle,
            contenu: newPostitContent,
            id_chapitre: contenuChapitre.id_chapitre,
            date_creation: new Date().toLocaleDateString('en-CA'),
        };

        try {
            const response = await fetch(`${apiUrl}/postit-chap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postitData),
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la création du post-it');
            }

            const newPostit = (await response.json()).postit;

            setPostits((prevPostits) => [...prevPostits, newPostit]);

            closeOverlay();
        } catch (error) {
            console.error('Erreur lors de la création du post-it:', error);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            const postItBarElement = document.querySelector('.postitbar');
            const isPostItbarClose = postItBarElement.classList.contains('close');

            if (window.innerWidth < 768 && !isPostItbarClose) {
                togglePostItBar();
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className={`postitbar relative w-auto z-5 h-screen flex flex-col justify-between ${isPostItBarOpen ? 'close' : ''}`}>
            <div className={`postitbar__content z-10 h-full ${isPostItBarOpen ? 'close' : ''}`}>
                <h5 className="text-center py-5">Post-Its</h5>
                <div className={`postit-container ${postits.length === 0 ? 'h-4/5 flex items-center justify-center' : ''}`}>
                    {postits.map(postit => (
                        <div key={postit.id_postit_chap} className="postit">
                            <div className="header-section">
                                <h6>{postit.titre}</h6>
                                <svg className="delete-postit" onClick={() => deletePostIt(postit.id_postit_chap)} width="15" height="15" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </div>
                            <div className="content-section">
                                <p>{postit.contenu}</p>
                            </div>
                        </div>
                    ))}
                    {postits.length > 0 && <hr />}
                    <div className={`postit add-postit ${postits.length === 0 ? 'w-full' : ''}`} onClick={openOverlay}>
                        <div className="header-section">
                            <h6> </h6>
                        </div>
                        <div className="content-section flex flex-col items-center justify-center pb-4">
                            <svg width="46" height="46" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 5v14"></path>
                                <path d="M5 12h14"></path>
                            </svg>
                            <p>Nouveau Post-It</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`toggle-button-right ${isPostItBarOpen ? 'close' : ''}`} onClick={togglePostItBar}>
                <svg id="eQXyaThE5gd1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 500" shapeRendering="geometricPrecision" textRendering="geometricPrecision" width="100%" height="100%">
                    <ellipse rx="237.58581" ry="214.427627" transform="matrix(.711193 0 0 1.000001 178.909992 250)" fill="#ffafa5" strokeWidth="0"/>
                    <polygon points="0,-98.25934 93.450185,-30.363806 57.755391,79.493476 -57.755391,79.493476 -93.450185,-30.363806 0,-98.25934" transform="matrix(1.138413 1.360925-1.539158 1.287505 56.492851 165.484719)" fill="#ffafa5" strokeWidth="0"/>
                    <polygon points="0,-98.25934 93.450185,-30.363806 57.755391,79.493476 -57.755391,79.493476 -93.450185,-30.363806 0,-98.25934" transform="matrix(.786197 1.590596-1.798908 0.889161 80.24744 339.908492)" fill="#ffafa5" strokeWidth="0"/>
                    <path d="M20.972,95.594L78.577,49.643c.951-.76.951-2.367,0-3.127L20.968,0.56c-.689-.547-1.716-.709-2.61-.414-.186.061-.33.129-.436.186-.65.35-1.056,1.025-1.056,1.764v91.967c0,.736.405,1.414,1.056,1.762.109.06.253.127.426.185.903.295,1.933.134,2.624-.416Z" transform={isPostItBarOpen ? "matrix(1.93752 0 0 1.93752 114.577189 156.84779)" : "matrix(-1.93752 0 0 -1.93752 300.881839 343.15225)"} fill="#fff" style={{ transition: 'transform 0.2s ease' }}/>
                </svg>
            </div>
            {isOverlayOpen && (
                <div className="overlay">
                    <form onSubmit={addNewPostit}>
                        <div className="overlay-post-it-container">
                            <div className="absolute right-2 top-2">
                                <svg onClick={closeOverlay} width="20" height="20" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6 6 18"></path>
                                    <path d="m6 6 12 12"></path>
                                </svg>
                            </div>
                            <div className="new-postit-form">
                                <h6 className="text-center mb-6 text-xl">Nouveau post-it</h6>
                                <div className="header-section">
                                    <label>
                                        <input type="text" id="small-input" value={newPostitTitle} onChange={(e) => setNewPostitTitle(e.target.value)} placeholder="Titre de votre idée..."
                                               className="block w-full p-2"></input>
                                    </label>
                                </div>
                                <div className="content-section">
                                    <label>
                                    <textarea value={newPostitContent} onChange={(e) => setNewPostitContent(e.target.value)} id="message" rows="4" className="block p-2.5 w-full"
                                              placeholder="Exprimez-vous..."></textarea>
                                    </label>
                                </div>
                                <button className="flex mx-auto mt-6 btn-add-post-it" type="submit">Ajouter</button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostItBar;