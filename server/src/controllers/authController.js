const pool = require('../models/db');
const bcrypt = require('bcrypt');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM utilisateur WHERE pseudo = ? OR mail = ?', [username, username]);

        if (result.length > 0) {
            const match = await bcrypt.compare(password, result[0].mdp);

            if (match) {
                req.session.userId = result[0].id_utilisateur;
                res.json({ success: true, message: 'Authentification réussie' });
            } else {
                res.json({ success: false, message: 'Identifiants incorrects' });
            }
        } else {
            res.json({ success: false, message: 'Identifiants incorrects' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const register = async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const usernameCheck = await pool.query('SELECT * FROM utilisateur WHERE pseudo = ?', [username]);
        if (usernameCheck.length > 0) {
            return res.json({ success: false, message: 'Pseudo déjà utilisé' });
        }

        const emailCheck = await pool.query('SELECT * FROM utilisateur WHERE mail = ?', [email]);
        if (emailCheck.length > 0) {
            return res.json({ success: false, message: 'Email déjà utilisé' });
        }

        const randomAvatarId = Math.floor(Math.random() * 6) + 1;   // Générer un entier aléatoire entre 1 et 6 pour id_avatar

        await pool.query('INSERT INTO utilisateur (pseudo, mail, mdp, date_creation, dark_mode, id_abonnement, id_avatar) VALUES (?, ?, ?, NOW(), 0, 1, ?)', [username, email, hashedPassword, randomAvatarId]);

        const checkRegister = await pool.query('SELECT * FROM utilisateur WHERE pseudo = ?', [username]);

        req.session.userId = checkRegister[0].id_utilisateur;

        res.json({ success: true, message: 'Inscription réussie' });
    }
    catch (error) {
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

const checkSession = async (req, res) => {
    if (req.session.userId) {
        return res.json({ loggedIn: true, userId: req.session.userId });
    } else {
        return res.json({ loggedIn: false });
    }
};

const logout = (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) {
                console.error('Erreur lors de la déconnexion :', err);
                return res.status(500).json({ success: false, error: 'Internal Server Error' });
            }
            return res.json({ success: true, message: 'Déconnexion réussie' });
        });
    } catch (error) {
        return res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

module.exports = { login, register, checkSession, logout };
