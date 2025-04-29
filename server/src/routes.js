const express = require('express');
const authController = require('./controllers/authController');
const userController = require('./controllers/userController');
const dataController = require('./controllers/dataController');
const router = express.Router();

// AUTH
router.post('/login', authController.login);                // Route authentification
router.post('/register', authController.register);          // Route inscription
router.get('/check-session', authController.checkSession);  // Route vérification session
router.get('/logout', authController.logout);               // Route déconnexion

// USER
router.get('/user/info', userController.getUserInfo);                   // Route récupération des informations de l'utilisateur
router.post('/user/update-info', userController.updateUserInfo);        // Route changement de la photo de profil
router.post('/user/change-password', userController.changePassword);    // Route changement du mot de passe
router.post('/user/disabled-account', userController.disabledAccount);  // Route désactivation du compte (suppression)

// CRUD
router.get('/read-table/:table', dataController.readTable);
router.get('/read-element/:table/:id', dataController.readElement);
router.get('/read-projets-recents', dataController.readProjetsRecents);
router.get('/read-projets-favoris', dataController.readProjetsFavoris);

router.put('/toggle-favori-projet/:id',dataController.toggleFavoriProjet);
router.put('/changer-etat-projet/:id',dataController.changerEtatProjet);
router.put('/modifier-projet/:id',dataController.modifierProjet);

router.post('/creer-projet',dataController.creerProjet);

router.delete('/delete-element/:table/:id', dataController.deleteElement);

// PROJECT
router.get('/read-project-content/:id', dataController.readProjectContent);     // Route récupération du contenu du projet
router.put('/modifier-chapitre/:id',dataController.modifier);                   // Route modification d'un chapitre
router.put('/sauvegarde-chapitre/:id', dataController.saveChapitre)             // Route sauvegarde du chapitre

// POST-ITS
router.get('/post-its/:table/:id', dataController.getPostIts)                   // Route récupération des post-its
router.post('/postit-chap', dataController.createPostitChap);                   // Route création d'un post-it
router.delete('/postit-delete/:table/:id', dataController.deletePostIt);               // Route suppression d'un post-it

// STATISTIQUES
router.get('/read-total-mots/:projet/:mois/:annee', dataController.readTotalMots);

module.exports = router;
