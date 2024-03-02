const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const fs = require('fs');

const app = express();
const http = require("http")

const server = http.Server(app)
const io = require('socket.io')(server) // Créer une instance de socket.io

io.on('connection', (socket) => {
    console.log('Client', socket.id, 'is connected via WebSockets')
    socket.on('sendMessage', (message) => {
        console.log('Message received:', message);

        // Diffuser le message à tous les clients connectés
        io.emit('newMessage', message);
    });
    // Écouter l'événement de notification de saisie
    socket.on('typing', () => {
        // Diffuser un événement indiquant que l'utilisateur est en train de taper
        socket.broadcast.emit('userTyping');
    });
})

// Utiliser bodyParser pour analyser les requêtes en JSON
app.use(bodyParser.json());

// Configurer Express pour servir des fichiers statiques depuis le dossier 'img'
// app.use("/img", express.static(path.join(__dirname, "img")));

// Montrer à Express.js où se trouvent les vues
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'public/views'));

// Demander à express d'utiliser pug comme engin de template
app.set('view engine', 'pug');

app.get("/", (req, res) => {
    res.render("login")
});

const filePath = path.join(__dirname, 'public', 'scripts', 'users.json');
app.post("/informationConnexion", (req, res) => {
    // Traitez les données de la requête ici

    // Vérifier les informations de connexion (vous devrez implémenter votre propre logique ici)
    // Par exemple, vérifier dans votre fichier JSON d'utilisateurs
    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }

        const users = JSON.parse(data);
        
        const user = users.find(u => u.username === req.body.pseudos && u.password === req.body.passs);
console.log(user);
        if (user) {
            // Connexion réussie, vous pouvez renvoyer des données utilisateur ou un message de succès
            const userData = { pseudo: user.pseudo, email: user.email }; // Par exemple, renvoyer uniquement les informations nécessaires
            res.json({ success: true, user: userData });
        } else {
            // Échec de la connexion
            res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    });
    res.send("Données reçues avec succès !");
});

server.listen(9000, () => {
    console.log("Serveur en cours...");
})

