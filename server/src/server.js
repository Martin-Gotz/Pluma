const express = require('express');
const session = require('express-session');
const cors = require('cors');
const routes = require('./routes');
const crypto = require('crypto');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3001;
const secretKey = crypto.randomBytes(64).toString('hex');

app.use(express.json());

app.use(
    fileUpload({
        limits: {
            fileSize: 5000000, // Taille de fichier limite : 5MB
        },
        abortOnLimit: true,
    })
);

app.use(cors({
    origin: 'http://localhost:3000',        // A CHANGER SELON SERVEUR
    credentials: true,
}));

app.use(session({
    secret: secretKey,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 18000000, // 1 heure
        httpOnly: false,
        secure: false,
    }
}));

app.use('/api', routes);

app.listen(PORT, () => {
    console.log(`Serveur en cours sur le port ${PORT}`);
});
