import React, { useState } from 'react';
import './Generateur.scss';
import Chargement from "../Chargement/chargement";

const GenerateurPrenom = ({ closeOverlay }) => {
    const [prenom, setPrenom] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [genre, setGenre] = useState('');
    const [origine, setOrigine] = useState('random');

    const genererPrenom = async () => {
        setIsLoading(true);
        try {
            const apiKey = 'ne194524905';

            let originParam = origine;

            if (origine === "random") {
                const options = document.querySelector('select[name="origine"]').options;
                const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
                originParam = options[randomIndex].value;
            }

            const response = await fetch(`https://www.behindthename.com/api/random.json?key=${apiKey}&gender=${genre}&usage=${originParam}&randomsurname=yes`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            if (data.names && data.names.length > 0) {
                const randomIndex = Math.floor(Math.random() * data.names.length);
                setPrenom(data.names[randomIndex]);
            } else {
                setPrenom('Aucun prénom trouvé dans la réponse');
            }
        } catch (error) {
            setError(error.message);
        }
        setIsLoading(false);
    };

    const [copied, setCopied] = useState(false);

    const copierPrenom = () => {
        navigator.clipboard.writeText(prenom);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="generateur-nom">
            <button onClick={closeOverlay} className="boutonFermer">
                <img src="/assets/toolbar/fermer.png" alt="Fermer" />
            </button>

            {isLoading && <div className="h-full absolute top-0 bottom-0 right-0 left-0 flex justify-center"><Chargement /></div>}
            {error && <p>Error: {error}</p>}
            {!isLoading && !error && (
                <div>
                    {prenom && (
                        <h2 className="prenomGenere px-5 py-2">Prénom généré :</h2>
                    )}
                    <p className="Prenom">{prenom}</p>

                    <div className="SousPrenom">
                        <p className="PrenomSansFont">{prenom}</p>
                        {prenom && (
                            <>
                                <button onClick={copierPrenom} className="boutonCopier">
                                    <img src="/assets/toolbar/copier_coller.png" alt="copier coller" />
                                </button>
                                {copied && <p className="ms-1" style={{ fontSize: '12px', color: '#fc8c79'}}>Copié !</p>}
                            </>
                        )}
                    </div>

                    <div>
                        <div className="mx-10 my-2">
                            <label>
                                Genre :
                                <select className="my-2" value={genre} onChange={(e) => setGenre(e.target.value)}>
                                    <option value="">Unisexe</option>
                                    <option value="m">Masculin</option>
                                    <option value="f">Féminin</option>
                                </select>
                            </label>
                        </div>
                        <div className="mx-10 my-2">
                            <label>
                                Origine :
                                <select className="my-2" name="origine" value={origine} onChange={(e) => setOrigine(e.target.value)}>
                                    <option value="random">Aléatoire</option>
                                    <option value="ame">Amérindien</option>
                                    <option value="amem">Mythologie du Nouveau Monde</option>
                                    <option value="amh">Amharique</option>
                                    <option value="anci">Ancien</option>
                                    <option value="afr">Africain</option>
                                    <option value="afk">Afrikaans</option>
                                    <option value="aka">Akan</option>
                                    <option value="alb">Albanais</option>
                                    <option value="alg">Algonquin</option>
                                    <option value="ara">Arabe</option>
                                    <option value="arm">Arménien</option>
                                    <option value="asm">Assamais</option>
                                    <option value="ast">Asturien</option>
                                    <option value="astr">Astronomie</option>
                                    <option value="aus">Aborigène australien</option>
                                    <option value="ava">Avar</option>
                                    <option value="aym">Aymara</option>
                                    <option value="aze">Azéri</option>
                                    <option value="bal">Balinais</option>
                                    <option value="bas">Basque</option>
                                    <option value="bel">Biélorusse</option>
                                    <option value="ben">Bengali</option>
                                    <option value="ber">Berbère</option>
                                    <option value="bhu">Bhoutanais</option>
                                    <option value="bibl">Biblique (tous)</option>
                                    <option value="bos">Bosniaque</option>
                                    <option value="bre">Breton</option>
                                    <option value="bsh">Bachkir</option>
                                    <option value="bul">Bulgare</option>
                                    <option value="bur">Birman</option>
                                    <option value="cat">Catalan</option>
                                    <option value="cela">Ancient Celtic</option>
                                    <option value="celm">Celtic Mythology</option>
                                    <option value="cew">Chewa</option>
                                    <option value="cha">Chamorro</option>
                                    <option value="che">Tchétchène</option>
                                    <option value="chi">Chinois</option>
                                    <option value="chk">Cherokee</option>
                                    <option value="cht">Choctaw</option>
                                    <option value="chy">Cheyenne</option>
                                    <option value="cir">Circassien</option>
                                    <option value="cmr">Comorien</option>
                                    <option value="com">Comanche</option>
                                    <option value="cop">Copte</option>
                                    <option value="cor">Cornique</option>
                                    <option value="cre">Cree</option>
                                    <option value="cro">Croate</option>
                                    <option value="crs">Corse</option>
                                    <option value="cze">Tchèque</option>
                                    <option value="dan">Danois</option>
                                    <option value="dgs">Dagestani</option>
                                    <option value="dhi">Dhivehi</option>
                                    <option value="dut">Néerlandais</option>
                                    <option value="egya">Ancient Egyptian</option>
                                    <option value="egym">Egyptian Mythology</option>
                                    <option value="elf">Elfe de Noël</option>
                                    <option value="eng">Anglais</option>
                                    <option value="enga">Anglo-Saxon</option>
                                    <option value="esp">Espéranto</option>
                                    <option value="est">Estonien</option>
                                    <option value="eth">Éthiopien</option>
                                    <option value="ewe">Éwé</option>
                                    <option value="fae">Féroïen</option>
                                    <option value="fairy">Fée</option>
                                    <option value="fij">Fidjien</option>
                                    <option value="fil">Philippin</option>
                                    <option value="fin">Finlandais</option>
                                    <option value="fle">Flamand</option>
                                    <option value="fntsg">Gluttakh</option>
                                    <option value="fntsm">Monstrall</option>
                                    <option value="fntso">Orinami</option>
                                    <option value="fntsr">Romanto</option>
                                    <option value="fntss">Simitiq</option>
                                    <option value="fntst">Tsang</option>
                                    <option value="fntsx">Xalaxxi</option>
                                    <option value="fre">Français</option>
                                    <option value="fri">Frison</option>
                                    <option value="ful">Fula</option>
                                    <option value="gaa">Ga</option>
                                    <option value="gal">Galicien</option>
                                    <option value="gan">Ganda</option>
                                    <option value="geo">Géorgien</option>
                                    <option value="ger">Allemand</option>
                                    <option value="gmca">Ancien Germanic</option>
                                    <option value="goth">Goth</option>
                                    <option value="gre">Grec</option>
                                    <option value="grea">Ancien Grec</option>
                                    <option value="grem">Greek Mythology</option>
                                    <option value="grn">Groenlandais</option>
                                    <option value="gua">Guarani</option>
                                    <option value="guj">Gujarati</option>
                                    <option value="hau">Haoussa</option>
                                    <option value="haw">Hawaïen</option>
                                    <option value="hb">Hillbilly</option>
                                    <option value="heb">Hébreu</option>
                                    <option value="hin">Hindi</option>
                                    <option value="hippy">Hippie</option>
                                    <option value="hist">Histoire</option>
                                    <option value="hmo">Hmong</option>
                                    <option value="hun">Hongrois</option>
                                    <option value="ibi">Ibibio</option>
                                    <option value="ice">Islandais</option>
                                    <option value="igb">Igbo</option>
                                    <option value="ind">Indien</option>
                                    <option value="indm">Hindu Mythology</option>
                                    <option value="ing">Ingouche</option>
                                    <option value="ins">Indonésien</option>
                                    <option value="inu">Inuit</option>
                                    <option value="iri">Irlandais</option>
                                    <option value="iro">Iroquois</option>
                                    <option value="ita">Italien</option>
                                    <option value="jap">Japonais</option>
                                    <option value="jav">Javanais</option>
                                    <option value="jer">Jèrriais</option>
                                    <option value="jew">Juif</option>
                                    <option value="kan">Kannada</option>
                                    <option value="kaz">Kazakh</option>
                                    <option value="khm">Khmer</option>
                                    <option value="kig">Kiga</option>
                                    <option value="kik">Kikuyu</option>
                                    <option value="kk">Kreatyve</option>
                                    <option value="kon">Kongo</option>
                                    <option value="kor">Coréen</option>
                                    <option value="kur">Kurde</option>
                                    <option value="kyr">Kirghize</option>
                                    <option value="lao">Laotien</option>
                                    <option value="lat">Letton</option>
                                    <option value="lim">Limbourgeois</option>
                                    <option value="lite">Littérature</option>
                                    <option value="litk">Arthurian Romance</option>
                                    <option value="lth">Lituanien</option>
                                    <option value="luh">Luhya</option>
                                    <option value="luo">Luo</option>
                                    <option value="mac">Macédonien</option>
                                    <option value="mag">Maguindanao</option>
                                    <option value="mal">Maltais</option>
                                    <option value="man">Manx</option>
                                    <option value="mao">Maori</option>
                                    <option value="map">Mapuche</option>
                                    <option value="may">Maya</option>
                                    <option value="mbu">Mbundu</option>
                                    <option value="medi">Médiéval</option>
                                    <option value="mlm">Malayalam</option>
                                    <option value="mly">Malais</option>
                                    <option value="moh">Mohawk</option>
                                    <option value="mon">Mongol</option>
                                    <option value="morm">Mormon</option>
                                    <option value="mrt">Marathi</option>
                                    <option value="mwe">Mwera</option>
                                    <option value="myth">Mythologie</option>
                                    <option value="nah">Nahuatl</option>
                                    <option value="nav">Navajo</option>
                                    <option value="nde">Ndebele</option>
                                    <option value="neaa">Ancien Proche-Orient</option>
                                    <option value="neam">Near Eastern Mythology</option>
                                    <option value="nep">Népalais</option>
                                    <option value="nor">Norvégien</option>
                                    <option value="nrm">Normand</option>
                                    <option value="nuu">Nuu-chah-nulth</option>
                                    <option value="occ">Occitan</option>
                                    <option value="odi">Odia</option>
                                    <option value="oji">Ojibwé</option>
                                    <option value="one">Oneida</option>
                                    <option value="oro">Oromo</option>
                                    <option value="oss">Ossète</option>
                                    <option value="pas">Pashto</option>
                                    <option value="pcd">Picard</option>
                                    <option value="per">Persan</option>
                                    <option value="pets">Animaux de compagnie</option>
                                    <option value="pin">Pintupi</option>
                                    <option value="pol">Polonais</option>
                                    <option value="popu">Culture Populaire</option>
                                    <option value="por">Portugais</option>
                                    <option value="pow">Powhatan</option>
                                    <option value="pun">Pendjabi</option>
                                    <option value="que">Quechua</option>
                                    <option value="rap">Rappeur</option>
                                    <option value="rmn">Roumain</option>
                                    <option value="roma">Ancien Romain</option>
                                    <option value="romm">Roman Mythology</option>
                                    <option value="rus">Russe</option>
                                    <option value="sam">Sami</option>
                                    <option value="sar">Sarde</option>
                                    <option value="sax">Bas-allemand</option>
                                    <option value="scaa">Ancien Scandinave</option>
                                    <option value="scam">Norse Mythology</option>
                                    <option value="sco">Écossais</option>
                                    <option value="sct">Scots</option>
                                    <option value="sen">Sénèque</option>
                                    <option value="ser">Serbe</option>
                                    <option value="sha">Shawnee</option>
                                    <option value="sho">Shona</option>
                                    <option value="sic">Sicilien</option>
                                    <option value="sik">Siksika</option>
                                    <option value="sin">Sinhala</option>
                                    <option value="sio">Sioux</option>
                                    <option value="sla">Slave</option>
                                    <option value="slam">Slavic Mythology</option>
                                    <option value="slk">Slovaque</option>
                                    <option value="sln">Slovène</option>
                                    <option value="smn">Samoan</option>
                                    <option value="som">Somali</option>
                                    <option value="sor">Sorabe</option>
                                    <option value="sot">Sotho</option>
                                    <option value="spa">Espagnol</option>
                                    <option value="swa">Swahili</option>
                                    <option value="swe">Suédois</option>
                                    <option value="swz">Swazi</option>
                                    <option value="tag">Tagalog</option>
                                    <option value="tah">Tahitien</option>
                                    <option value="taj">Tadjik</option>
                                    <option value="tam">Tamoul</option>
                                    <option value="tat">Tatar</option>
                                    <option value="tau">Tausug</option>
                                    <option value="tel">Télougou</option>
                                    <option value="tha">Thaï</option>
                                    <option value="theo">Théologie</option>
                                    <option value="tib">Tibétain</option>
                                    <option value="tkm">Turkmène</option>
                                    <option value="ton">Tongan</option>
                                    <option value="too">Tooro</option>
                                    <option value="trans">Transformateur</option>
                                    <option value="tsw">Tswana</option>
                                    <option value="tum">Tumbuka</option>
                                    <option value="tup">Tupi</option>
                                    <option value="tur">Turc</option>
                                    <option value="ukr">Ukrainien</option>
                                    <option value="urd">Ourdou</option>
                                    <option value="urh">Urhobo</option>
                                    <option value="usa">Américain</option>
                                    <option value="uyg">Ouïghour</option>
                                    <option value="uzb">Ouzbek</option>
                                    <option value="vari">Divers</option>
                                    <option value="vie">Vietnamien</option>
                                    <option value="wel">Gallois</option>
                                    <option value="witch">Sorcière</option>
                                    <option value="wrest">Lutteur</option>
                                    <option value="xho">Xhosa</option>
                                    <option value="yao">Yao</option>
                                    <option value="yol">Yolngu</option>
                                    <option value="yor">Yoruba</option>
                                    <option value="zap">Zapotèque</option>
                                    <option value="zul">Zoulou</option>
                                </select>
                            </label>
                        </div>

                    </div>
                    <button onClick={genererPrenom} className="boutonGenerer mx-auto mt-8">Générer</button>
                </div>
            )}
        </div>
    );
};

export default GenerateurPrenom;