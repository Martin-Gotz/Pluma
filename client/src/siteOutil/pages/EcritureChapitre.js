import React, {useEffect, useRef, useState} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {useNavigate, useLocation, useOutletContext} from 'react-router-dom';
import "../styles/EcritureChapitre.scss"
import PostItBar from "../components/PostItBar/postItBar";
import {Link} from "react-router-dom";
import apiUrl from "../../config";
import BoutonRetour from "../components/BoutonRetour/BoutonRetour";

export default function EcritureChapitre() {
    const editorRef = useRef(null);
    const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const navigate = useNavigate();
    const { contenuChapitre, contenuProjet } = useOutletContext();
    const location = useLocation();
    const [typingTimeout, setTypingTimeout] = useState(0);
    const [editorInitialized, setEditorInitialized] = useState(false);
    const [etatSauvegarde, setEtatSauvegarde] = useState('');
    const [numDernierChap, setNumDernierChap] = useState(0);
    const [numPremierChap, setNumPremierChap] = useState(0);

    useEffect(() => {
        if (contenuProjet) {
            let maxChapterNumber = 0;
            let minChapterNumber = Infinity;
            contenuProjet.actes.forEach(acte => {
                acte.chapitres.forEach(chapitre => {
                    if (chapitre.chapitre_numero > maxChapterNumber) {
                        maxChapterNumber = chapitre.chapitre_numero;
                    }
                    if (chapitre.chapitre_numero < minChapterNumber) {
                        minChapterNumber = chapitre.chapitre_numero;
                    }
                });
            });
            setNumDernierChap(maxChapterNumber);
            setNumPremierChap(minChapterNumber);
        }
    }, [contenuProjet]);

    useEffect(() => {
        setEditorInitialized(true);
    }, [contenuChapitre]);

    const handleTyping = () => {
        setEtatSauvegarde('Process');
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        setTypingTimeout(setTimeout(() => {
            Save();
            setEtatSauvegarde('Success');
        }, 2000));
    };

    const Save = () => {
        if (editorRef.current && editorRef.current.getContent()) {
            const content = editorRef.current.getContent();
            const count = editorRef.current.plugins.wordcount.body.getWordCount();

            fetch(`${apiUrl}/sauvegarde-chapitre/${contenuChapitre.id_chapitre}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contenu: content, totalMots: count, contenuProjet: contenuProjet }),
                credentials: 'include',
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('La requête a échoué');
                    }
                    return response.json();
                })
                .catch((error) => {
                    console.error('Erreur lors de la sauvegarde :', error);
                    setEtatSauvegarde('Error');
                });
        }
    };

    const goToChapter = (next) => {
        const projetParam = location.pathname.split('/')[3];
        let ChapterId = null;

        if(next)
            ChapterId = id + 1;
        else
            if (!isChapterOne) ChapterId = id - 1

        const newRoute = `/mon-espace/projet/${projetParam}/edition/${ChapterId}/ecriture`;

        setEditorInitialized(false);
        setEtatSauvegarde('');
        navigate(newRoute);
    };

    const id = parseInt(location.pathname.split('/')[5], 10);

    const isChapterOne = id === numPremierChap;
    const isLastChapter = id === numDernierChap;

    return (
        <div className="write-chapter">
            <BoutonRetour />
            <div className="write-chapter-content mon-espace">
                <h3>Chapitre {contenuChapitre.numero} : {contenuChapitre.titre}</h3>
                <form className="write-chapter-textarea" id="write-chapter-form">
                    <div className="save-container">
                    {editorRef.current && (
                        <div className="sauvegarde w-full">
                            {etatSauvegarde === 'Error' ? (
                                <div className="flex mt-1.5 save error">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 48 48" className="ms-5 me-1">
                                        <path fill="#f44336" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path>
                                        <line x1="16.9" x2="31.1" y1="16.9" y2="31.1" fill="none" stroke="#fff" strokeMiterlimit="10" strokeWidth="4"></line>
                                        <line x1="31.1" x2="16.9" y1="16.9" y2="31.1" fill="none" stroke="#fff" strokeMiterlimit="10" strokeWidth="4"></line>
                                    </svg>
                                    <p className="text-sm font-semibold">Erreur de sauvegarde</p>
                                </div>
                            ) : etatSauvegarde === 'Process' ? (
                                <div className="w-full flex items-center save process">
                                    <svg version="1.1" id="L4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 55 100" height="30px" className="ms-5 me-1">
                                        <circle fill="#d68e80" cx="6" cy="50" r="6">
                                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.1" />
                                        </circle>
                                        <circle fill="#d68e80" cx="26" cy="50" r="6">
                                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.2" />
                                        </circle>
                                        <circle fill="#d68e80" cx="46" cy="50" r="6">
                                            <animate attributeName="opacity" dur="1s" values="0;1;0" repeatCount="indefinite" begin="0.3" />
                                        </circle>
                                    </svg>
                                    <p className="text-sm font-semibold">Sauvegarde en cours</p>
                                </div>
                            ) : etatSauvegarde === 'Success' ? (
                                <div className="flex mt-1.5 save success">
                                    <svg xmlns="http://www.w3.org/2000/svg" height="22px" viewBox="0 0 48 48" className="ms-5 me-1">
                                        <path fill="#c8e6c9" d="M44,24c0,11-9,20-20,20S4,35,4,24S13,4,24,4S44,13,44,24z"></path>
                                        <polyline fill="none" stroke="#4caf50" strokeMiterlimit="10" strokeWidth="4" points="14,24 21,31 36,16"></polyline>
                                    </svg>
                                    <p className="text-sm font-semibold">Sauvegardé</p>
                                </div>
                            ) : undefined}
                        </div>
                    )}
                    </div>

                    <Editor
                        className="textarea-tinymce"
                        onInit={(evt, editor) => {
                            editorRef.current = editor;
                            editorRef.current.formElement = document.getElementById('write-chapter-form');
                            setEditorInitialized(true);
                        }}
                        apiKey='71wiknj441rhr2md3o44ea0s87fmdc3lmoa55fslxo4f9km3'
                        initialValue={contenuChapitre.contenu}
                        onEditorChange={editorInitialized ? handleTyping : () => {}}
                        onSaveContent={Save}
                        init={{
                            selector: 'textarea-write-chapter',

                            height: '100%',
                            resize: false,
                            menubar: false,

                            plugins: 'searchreplace autolink autosave save ' +
                                'directionality visualchars fullscreen image ' +
                                'link media charmap pagebreak nonbreaking ' +
                                'wordcount charmap',

                            toolbar: "undo redo | fontfamily fontsize | " +
                                "bold italic underline strikethrough | forecolor backcolor | " +
                                "align outdent indent | charmap link image | pagebreak | cut copy paste selectall | searchreplace",

                            contextmenu: 'copy paste cut selectall',

                            language: 'fr_FR',

                            autosave_ask_before_unload: true,
                            autosave_interval: '60s',
                            autosave_prefix: '{path}{query}-{id}-',
                            autosave_restore_when_empty: false,
                            autosave_retention: '30m',

                            newline_behavior: 'linebreak',

                            setup: function (editor) {
                                editor.on('keydown', function (e) {
                                    if (e.keyCode === 9) {
                                        e.preventDefault();
                                        editor.execCommand('mceInsertContent', false, '\u00A0\u00A0\u00A0\u00A0');
                                    }
                                });
                            },

                            content_style: 'body { font-family:Times New Roman, Helvetica, sans-serif; font-size:14pt; text-align: justify; line-height: 1.5; padding-inline: 2em; padding-block: 0.2em; }',

                            skin: useDarkMode ? 'oxide-dark' : 'oxide',
                            content_css: useDarkMode ? 'dark' : 'default',
                        }}
                    />

                    <button name="submitbtn"></button>
                </form>
                <div>
                    <div className="switch-chapter absolute flex bottom-2 ms-3 items-center">
                        <button onClick={() => goToChapter(false)} disabled={isChapterOne}>
                            <svg width="28" height="28" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14"></path>
                                <path d="m5 12 6 6"></path>
                                <path d="m5 12 6-6"></path>
                            </svg>
                        </button>
                        <p>{id}</p>
                        <button onClick={() => goToChapter(true)} disabled={isLastChapter}>
                            <svg width="28" height="28" fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 12h14"></path>
                                <path d="m13 18 6-6"></path>
                                <path d="m13 6 6 6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <PostItBar />
            <Link to={`../..`}>
                <button className="retour-salle-chapitres" onClick={Save}>
                    Retour à la salle des chapitres
                </button>
            </Link>
        </div>
    );
}