const pool = require('../models/db');

async function readTable(req, res) {
    const nomTable = req.params.table;
    const userId = req.session.userId;

    try {
        let result;

        if (nomTable === 'projet'){
            result = await pool.query(`SELECT * FROM projet WHERE id_utilisateur = ?`, [userId]);
        }else{
            result = await pool.query(`SELECT * FROM ${nomTable}`);
        }

        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function readElement(req, res) {
    const nomTable = req.params.table;
    const idElement = req.params.id;

    try {
        const result = await pool.query(`SELECT * FROM ${nomTable} WHERE id_${nomTable} = ${idElement}`);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function readProjetsRecents(req, res) {
    const userId = req.session.userId;

    try {
        const result = await pool.query(`SELECT * FROM projet WHERE id_utilisateur = ${userId} ORDER BY derniere_consultation DESC LIMIT 5`);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error1' });
    }
}

async function readProjetsFavoris (req, res) {
    const userId = req.session.userId;

    try {
        const result = await pool.query(`SELECT * FROM projet WHERE favori = true AND id_utilisateur = ${userId}`);
        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function toggleFavoriProjet(req, res) {
    const { id } = req.params;
    const { favoriValue } = req.body;

    try {
        if (typeof favoriValue !== 'boolean') {
            return res.status(400).json({ success: false, error: 'Invalid value for favori. It should be a boolean.' + favoriValue });
        }

        const result = await pool.query('UPDATE projet SET favori = ? WHERE id_projet = ?', [favoriValue, id]);
        res.json({ success: true, message: 'Mise à jour du statut favori réussie' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function changerEtatProjet(req, res) {
    const { id } = req.params;
    const { etatValue } = req.body;

    try {
        const result = await pool.query('UPDATE projet SET id_statut = ? WHERE id_projet = ?', [etatValue, id]);
        res.json({ success: true, message: 'Projet ajouté à la corbeille' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const modifierProjet = async (req, res) => {
    const { id } = req.params;
    const { colonne, valeur } = req.body;

    try {
        if (colonne === "couverture"){
            const file = req.files.couvertureContent;
            if(file){
                try {
                    file.mv(__dirname + '../../../../client/public/assets/userImport/project-cover/' + valeur);
                } catch (error) {
                    res.json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'image' });
                }
            }
        }

        await pool.query(`UPDATE projet SET ${colonne} = ? WHERE id_projet = ?`, [valeur, id]);
        res.json({ success: true, message: 'Projet modifié' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function getPseudo(req){
    try {
        if (req.session.userId) {
            const userQuery = await pool.query('SELECT pseudo FROM utilisateur WHERE id_utilisateur = ?', [req.session.userId]);

            if (userQuery.length > 0) {
                return userQuery[0].pseudo;
            } else {
                throw new Error('Aucun utilisateur trouvé avec cet ID');
            }
        }else{
            throw new Error('ID de session non défini');
        }
    } catch (error) {
        console.error(error);
    }
}

async function creerProjet(req, res) {
    const { titre } = req.body;
    const userId = req.session.userId;

    const currentDate = new Date();

    const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')} ${String(currentDate.getHours()).padStart(2, '0')}:${String(currentDate.getMinutes()).padStart(2, '0')}:${String(currentDate.getSeconds()).padStart(2, '0')}`;

    const idUnique = Math.floor(Math.random() * 100000000);
    const baseNeo4j = `${await getPseudo(req)}-${idUnique}`;

    const defaultValues = {
        favori: 0,
        serif: 1,
        taille_police: 14,
        id_genre: 1,
        id_statut: 1,
        id_police: 4,
    };

    try {
        const result = await pool.query(
            'INSERT INTO projet (titre, favori, serif, taille_police, id_utilisateur, id_genre, id_statut, id_police, date_creation, derniere_consultation, base_neo4j) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [titre, defaultValues.favori, defaultValues.serif, defaultValues.taille_police, userId, defaultValues.id_genre, defaultValues.id_statut, defaultValues.id_police, formattedDate, formattedDate, baseNeo4j]
        );

        const projetId = result.insertId.toString();
        const projetDetails = await pool.query(
            'SELECT * FROM projet WHERE id_projet = ?',
            [projetId]
        );

        await pool.query(
            'INSERT INTO acte (titre, numero, id_projet) VALUES (?, ?, ?)',
            ["", 0, projetId]
        );

        res.json({ success: true, message: 'Nouveau projet créé', projet: projetDetails[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


async function deleteElement(req, res) {
    const nomTable = req.params.table;
    const idElement = req.params.id;

    try {
        await pool.query(`DELETE FROM postit_chap WHERE id_chapitre IN (SELECT id_chapitre FROM chapitre WHERE id_acte IN (SELECT id_acte FROM acte WHERE id_projet=?))`, [idElement]);
        await pool.query(`DELETE FROM stat_chapitre WHERE id_chapitre IN (SELECT id_chapitre FROM chapitre WHERE id_acte IN (SELECT id_acte FROM acte WHERE id_projet=?))`, [idElement]);
        await pool.query(`DELETE FROM partage_chapitre WHERE id_chapitre IN (SELECT id_chapitre FROM chapitre WHERE id_acte IN (SELECT id_acte FROM acte WHERE id_projet=?))`, [idElement]);
        await pool.query(`DELETE FROM chapitre WHERE id_acte IN (SELECT id_acte FROM acte WHERE id_projet=?)`, [idElement]);
        await pool.query(`DELETE FROM acte WHERE id_projet=?`, [idElement]);
        await pool.query(`DELETE FROM postit_projet WHERE id_projet=?`, [idElement]);
        await pool.query(`DELETE FROM stat_projet WHERE id_projet=?`, [idElement]);
        await pool.query(`DELETE FROM partage_projet WHERE id_projet=?`, [idElement]);
        const deleteResult = await pool.query(`DELETE FROM ${nomTable} WHERE id_${nomTable} = ?`, [idElement]);

        if (deleteResult.affectedRows > 0) {
            res.json({ success: true, message: 'Enregistrement supprimé avec succès' });
        } else {
            res.status(404).json({ success: false, error: 'Enregistrement non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const modifier = async (req, res) => {
    const { id } = req.params;
    const { table, colonne, valeur } = req.body;

    try {
        await pool.query(`UPDATE ${table} SET ${colonne} = ? WHERE id_${table} = ?`, [valeur, id]);
        res.json({ success: true, message: `${table} modifié` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const readProjectContent = async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query(`
            SELECT
                projet.id_projet AS projet_id, projet.base_neo4j AS projet_base_neo4j, projet.titre AS projet_titre,
                acte.id_acte AS acte_id, acte.titre AS acte_titre, acte.numero AS acte_numero,
                chapitre.id_chapitre AS chapitre_id, chapitre.numero AS chapitre_numero, chapitre.titre AS chapitre_titre, chapitre.date_creation AS chapitre_date_creation,
                postit_projet.id_postit_projet AS postit_projet_id, postit_projet.titre AS postit_projet_titre, postit_projet.contenu AS postit_projet_contenu, postit_projet.date_creation AS postit_projet_date_creation,
                postit_chap.id_postit_chap AS postit_chap_id, postit_chap.titre AS postit_chap_titre, postit_chap.date_creation AS postit_chap_date_creation
            FROM
                projet
                    LEFT JOIN
                acte ON projet.id_projet = acte.id_projet
                    LEFT JOIN
                chapitre ON acte.id_acte = chapitre.id_acte
                    LEFT JOIN
                postit_projet ON projet.id_projet = postit_projet.id_projet
                    LEFT JOIN
                postit_chap ON chapitre.id_chapitre = postit_chap.id_chapitre
            WHERE
                projet.id_projet = ?;
        `, [id]);

        const structuredData = [];

        result.forEach(row => {
            const projectId = row.projet_id;
            const acteId = row.acte_id;
            const chapitreId = row.chapitre_id;
            const postItId = row.postit_projet_id;

            let projectIndex = structuredData.findIndex(item => item.projet_id === projectId);
            if (projectIndex === -1) {
                projectIndex = structuredData.length;
                structuredData.push({
                    projet_id: row.projet_id,
                    projet_base_neo4j: row.projet_base_neo4j,
                    projet_titre: row.projet_titre,
                    actes: [],
                    postits: []
                });
            }

            let acteIndex = structuredData[projectIndex].actes.findIndex(item => item.acte_id === acteId);
            if (acteIndex === -1) {
                acteIndex = structuredData[projectIndex].actes.length;
                structuredData[projectIndex].actes.push({
                    acte_id: row.acte_id,
                    acte_titre: row.acte_titre,
                    acte_numero: row.acte_numero,
                    chapitres: []
                });
            }

            if (chapitreId) {
                let chapitreIndex = structuredData[projectIndex].actes[acteIndex].chapitres.findIndex(item => item.chapitre_id === chapitreId);
                if (chapitreIndex === -1) {
                    chapitreIndex = structuredData[projectIndex].actes[acteIndex].chapitres.length;
                    structuredData[projectIndex].actes[acteIndex].chapitres.push({
                        chapitre_id: row.chapitre_id,
                        chapitre_titre: row.chapitre_titre,
                        chapitre_numero: row.chapitre_numero,
                        chapitre_date_creation: row.chapitre_date_creation,
                        postits: []
                    });
                }

                if (row.postit_chap_id) {
                    structuredData[projectIndex].actes[acteIndex].chapitres[chapitreIndex].postits.push({
                        postit_chap_id: row.postit_chap_id,
                        postit_chap_titre: row.postit_chap_titre,
                        postit_chap_date_creation: row.postit_chap_date_creation
                    });
                }
            }

            let postItIndex = structuredData[projectIndex].postits.findIndex(item => item.postit_projet_id === postItId);
            if (postItIndex === -1) {
                structuredData[projectIndex].postits.push({
                    postit_projet_id: row.postit_projet_id,
                    postit_projet_titre: row.postit_projet_titre,
                    postit_projet_contenu: row.postit_projet_contenu,
                    postit_projet_date_creation: row.postit_projet_date_creation
                });
            }
        });

        res.json({ success: true, data: structuredData, message: `Succès de la récupération des données du projet` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const saveChapitre = async (req, res) => {
    const { id } = req.params;
    const contenu = req.body.contenu;
    const contenuProjet = req.body.contenuProjet;
    const totalMots = req.body.totalMots;
    const userId = req.session.userId;

    try {
        await pool.query(`UPDATE chapitre SET contenu = ? WHERE id_chapitre = ?`, [contenu, id]);
        await updateTotalMots(id, totalMots, contenuProjet.projet_id, userId);
        res.json({ success: true, message: `Chapitre sauvegardé` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

const updateTotalMots = async (id_chapitre, totalMots, id_projet, id_utilisateur) => {
    try {
        const dateActuelle = new Date().toISOString().split('T')[0];

        await pool.query(`
            INSERT INTO dates (la_date) VALUES (?)
                ON DUPLICATE KEY UPDATE la_date = VALUES(la_date)
        `, [dateActuelle]);

        const [dateDetails] = await pool.query(`SELECT id_date FROM dates WHERE la_date = ?`, [dateActuelle]);
        const id_date = dateDetails.id_date;

        const [existingTotalMots] = await pool.query(`
            SELECT IFNULL(SUM(total_mots_chapitre), 0) AS total FROM stat_chapitre
            WHERE id_chapitre = ? AND id_date < ?
        `, [id_chapitre, id_date]);

        const newTotalMots = totalMots - existingTotalMots.total;
        console.log("Total mots ----------------------- " + newTotalMots)
        console.log("Existing Total mots ----------------------- " + existingTotalMots.total)


        await pool.query(`
            INSERT INTO stat_chapitre (id_chapitre, id_date, total_mots_chapitre)
            VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE total_mots_chapitre = VALUES(total_mots_chapitre)
        `, [id_chapitre, id_date, newTotalMots]);

        await pool.query(`
            INSERT INTO stat_projet (id_projet, id_date, total_mots_projet)
            VALUES (?, ?, (SELECT SUM(total_mots_chapitre) FROM stat_chapitre WHERE id_chapitre IN (SELECT id_chapitre FROM chapitre WHERE id_acte IN (SELECT id_acte FROM acte WHERE id_projet=?)) AND id_date = ? ))
                ON DUPLICATE KEY UPDATE total_mots_projet = VALUES(total_mots_projet)
        `, [id_projet, id_date, id_projet, id_date]);

        await pool.query(`
            INSERT INTO stat_utilisateur (id_utilisateur, id_date, total_mots_utilisateur)
            VALUES (?, ?, (SELECT SUM(total_mots_projet) FROM stat_projet WHERE id_projet IN (SELECT id_projet FROM projet WHERE id_utilisateur = ?) AND id_date = ?))
                ON DUPLICATE KEY UPDATE total_mots_utilisateur = VALUES(total_mots_utilisateur)
        `, [id_utilisateur, id_date, id_utilisateur, id_date]);
    } catch (error) {
        console.error(error);
    }
};


// Post-Its

const getPostIts = async (req, res) => {
    const table = req.params.table;
    const id = req.params.id;

    try {
        if(table === 'chapitre'){
            const result = await pool.query(`SELECT * FROM postit_chap WHERE id_chapitre = ?`, [id]);
            res.json({ success: true, data: result, message: `Succès de la récupération des post-its du chapitre` });
        }else if(table === 'projet'){
            const result = await pool.query(`SELECT * FROM postit_projet WHERE id_projet = ?`, [id]);
            res.json({ success: true, data: result, message: `Succès de la récupération des post-its du projet` });
        }else{
            res.json({ success: true, message: `${table} inexistant` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function createPostitChap(req, res) {
    const { titre, contenu, id_chapitre, date_creation } = req.body;

    try {
        const result = await pool.query('INSERT INTO postit_chap (titre, contenu, id_chapitre, date_creation) VALUES (?, ?, ?, ?)', [titre, contenu, id_chapitre, date_creation]);

        const postitId = result.insertId.toString();
        const postitDetails = await pool.query(
            'SELECT * FROM postit_chap WHERE id_postit_chap = ?',
            [postitId]
        );

        res.status(201).json({ success: true, message: 'Nouveau post-it créé', postit: postitDetails[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function deletePostIt(req, res) {
    const id = req.params.id;
    const table = req.params.table;

    let deleteResult;

    try {
        if(table === 'chapitre'){
            deleteResult = await pool.query(`DELETE FROM postit_chap WHERE id_postit_chap = ?`, [id]);
        }else if(table === 'projet'){
            deleteResult = await pool.query(`DELETE FROM postit_projet WHERE id_postit_projet = ?`, [id]);
        }else{
            return res.json({ success: true, message: `${table} inexistant` });
        }

        if (deleteResult.affectedRows > 0) {
            res.json({ success: true, message: 'Supprimé avec succès' });
        } else {
            res.status(404).json({ success: false, error: 'Non trouvé' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

async function readTotalMots(req, res) {
    const projet = req.params.projet;
    const annee = req.params.annee;
    const mois = req.params.mois;
    const userId = req.session.userId;

    try {
        let query;
        let values;

        if (projet === '0') {
            query = `
                SELECT DAY(la_date) as jour, total_mots_utilisateur as total_mots
                FROM stat_utilisateur
                JOIN dates ON stat_utilisateur.id_date = dates.id_date
                WHERE id_utilisateur = ? 
                    AND YEAR(la_date) = ? 
                    AND MONTH(la_date) = ?
                GROUP BY DAY(la_date)
            `;
            values = [userId, annee, mois];
        } else {
            query = `
                SELECT DAY(la_date) as jour, total_mots_projet as total_mots
                FROM stat_projet
                JOIN dates ON stat_projet.id_date = dates.id_date
                WHERE id_projet = ? 
                    AND YEAR(la_date) = ? 
                    AND MONTH(la_date) = ?
                GROUP BY DAY(la_date)
            `;
            values = [projet, annee, mois];
        }

        const result = await pool.query(query, values);

        res.json({ success: true, data: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

module.exports = {
    readTable,
    readElement,
    readProjetsRecents,
    readProjetsFavoris,
    toggleFavoriProjet,
    changerEtatProjet,
    modifierProjet,
    creerProjet,
    deleteElement,
    modifier,
    readProjectContent,
    saveChapitre,
    getPostIts,
    createPostitChap,
    deletePostIt,
    readTotalMots
};