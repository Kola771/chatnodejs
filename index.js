const path = require("path");
const express = require("express");

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

// Configurer Express pour servir des fichiers statiques depuis le dossier 'img'
// app.use("/img", express.static(path.join(__dirname, "img")));

// Montrer à Express.js où se trouvent les vues
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'public/views'));

// Demander à express d'utiliser pug comme engin de template
app.set('view engine', 'pug');

app.get("/", (req, res) => {
    res.render("index")
});

server.listen(9000, () => {
    console.log("Serveur en cours...");
})

