const pool = require('../models/db');
const bcrypt = require('bcrypt');
const {logout} = require("./authController");

const getUserInfo = async (req, res) => {
    try {
        if (req.session.userId) {
            const userInfo = await pool.query('SELECT u.id_utilisateur, u.pseudo, u.mail, u.date_creation, u.photo, u.description, u.dark_mode, a.type_abonnement, av.image as avatar FROM utilisateur u LEFT JOIN abonnement a ON u.id_abonnement = a.id_abonnement LEFT JOIN avatar av ON u.id_avatar = av.id_avatar WHERE u.id_utilisateur = ?', [req.session.userId]);

            if (!userInfo || userInfo.length === 0) {
                return res.json({ success: false, message: 'Utilisateur non trouvé' });
            }

            res.json({ success: true, userInfo: userInfo[0] });
        } else {
            res.json({ success: false, message: 'Utilisateur non connecté' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const updateUserInfo = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (userId) {
            const userInfo = await pool.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [userId]);

            if (!userInfo || userInfo.length === 0) {
                return res.json({ success: false, message: 'Utilisateur non trouvé' });
            }

            let { description, photo, dark_mode, id_abonnement } = req.body;

            if (description) {
                await pool.query('UPDATE utilisateur SET description = ? WHERE id_utilisateur = ?', [description, userId]);
            }else{
                if (photo) {
                    const fileName = req.body.photo;
                    const file = req.files.photoContent;

                    try {
                        file.mv(__dirname + '../../../../client/public/assets/userImport/profile-pic/' + fileName);
                    } catch (error) {
                        return res.json({ success: false, message: 'Erreur lors de l\'enregistrement de l\'image' });
                    }

                    await pool.query('UPDATE utilisateur SET photo = ? WHERE id_utilisateur = ?', [fileName, userId]);
                }else if(req.body.randomAvatar){
                    await pool.query('UPDATE utilisateur SET photo = null, id_avatar = ? WHERE id_utilisateur = ?', [req.body.randomAvatar, userId]);
                }else{
                    await pool.query('UPDATE utilisateur SET photo = null WHERE id_utilisateur = ?', [userId]);
                }
            }

            if (dark_mode) {
                if (dark_mode === 2){ dark_mode = 0; }
                await pool.query('UPDATE utilisateur SET dark_mode = ? WHERE id_utilisateur = ?', [dark_mode, userId]);
            }

            if (id_abonnement && id_abonnement >= 1 && id_abonnement <= 3) {
                await pool.query('UPDATE utilisateur SET id_abonnement = ? WHERE id_utilisateur = ?', [id_abonnement, userId]);
            }

            res.json({ success: true, message: 'Informations utilisateur mises à jour avec succès' });
        }else{
            return res.json({ success: false, message: 'Utilisateur non connecté' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.session.userId;

        if (userId) {
            const userInfo = await pool.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [userId]);

            if (!userInfo || userInfo.length === 0) {
                return res.json({ success: false, message: 'Utilisateur non trouvé' });
            }

            if (newPassword === ""){
                return res.json({ success: false, message: 'Nouveau mot de passe vide' });
            }

            const passwordMatch = await bcrypt.compare(oldPassword, userInfo[0].mdp);

            if (!passwordMatch) {
                return res.json({ success: false, message: 'Le mot de passe actuel est incorrect' });
            }

            const hashedNewPassword = await bcrypt.hash(newPassword, 10);

            await pool.query('UPDATE utilisateur SET mdp = ? WHERE id_utilisateur = ?', [hashedNewPassword, userId]);

            res.json({ success: true, message: 'Mot de passe changé avec succès' });
        }else{
            return res.json({ success: false, message: 'Utilisateur non connecté' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const disabledAccount = async (req, res) => {
    try {
        const userId = req.session.userId;

        if (userId) {
            const userInfo = await pool.query('SELECT * FROM utilisateur WHERE id_utilisateur = ?', [userId]);

            const passwordMatch = await bcrypt.compare(req.body.password, userInfo[0].mdp);

            if (!passwordMatch){
                return res.json({ success: false, message: 'Mot de passe incorrect' });
            }

            await pool.query('DELETE FROM utilisateur WHERE id_utilisateur = ?', [userId]);

            req.session.destroy();

            res.json({ success: true, message: 'Compte désactivé' });
        }else{
            return res.json({ success: false, message: 'Utilisateur non connecté' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = { getUserInfo, updateUserInfo, changePassword, disabledAccount };