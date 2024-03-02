// client.js

document.addEventListener("DOMContentLoaded", () => {
    let messageForm = document.getElementById("messageForm");
    let messageInput = document.getElementById("messageInput");
    let typingNotification = document.getElementById('typingNotification');

    let socket = io();

    socket.on('connect', () => {
        console.log('Connexion au serveur');
    });

    socket.on('disconnect', () => {
        console.log('Disconnexion du serveur');
    });

    // messageForm.addEventListener('submit', (event) => {
    //     // Empêchons le formulaire de se soumettre normalement
    //     event.preventDefault();

    //     let message = messageInput.value.trim();

    //     if(message !== '')
    //     {
    //         // Envoyer le message au serveur
    //         // socket.emit('sendMessage', message);
    //         socket.emit('sendMessage', {
    //             text: message,
    //             author: socket.id // Utilisez une identité unique pour chaque utilisateur, par exemple l'ID de socket
    //         });

    //         // Effaçons le champ de saisie après l'envoi
    //         messageInput.value = '';
    //     }
    // })
    messageInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            // Si la touche "Entrée" est pressée sans maintenir la touche "Maj"
            event.preventDefault(); // Empêcher le comportement par défaut (soumission du formulaire)

            const message = messageInput.value.trim();

            if (message !== '') {
                // Envoyer le message au serveur avec l'identifiant de l'utilisateur actuel
                socket.emit('sendMessage', {
                    text: message,
                    author: socket.id // Utilisez une identité unique pour chaque utilisateur, par exemple l'ID de socket
                });

                // Effacer le champ de saisie après l'envoi
                messageInput.value = '';
            }
        } else {
            // Si une autre touche est pressée (donc l'utilisateur est en train de taper), émettre un événement de notification de saisie
            socket.emit('typing');
        }
    });
    
    // Écouter les événements de saisie des autres utilisateurs et afficher une notification
    socket.on('userTyping', () => {
        typingNotification.innerText = "Quelqu'un est entrain d'écrire...";
    });

    // Ecoutons les nouveaux messages envoyés par le serveur et les afficher sur la page
    socket.on('newMessage', (message) => {
        // Crééons un élément de paragraphe pour afficher le message
        let messageElement = document.createElement('p');
        let messageElement1 = document.createElement('p');
        let div = document.createElement('div');
        let div1 = document.createElement('div');
        // messageElement.textContent = message;
        // Ajouter une classe CSS en fonction de l'auteur du message
        messageElement.classList.add(message.author === socket.id ? 'sent' : 'received');
        messageElement1.style= "font-size : 12px"
        div.classList.add(message.author === socket.id ? "divElement" : "divElementTwo");
        
        // Créer une balise img pour l'image de profil
        if(message.author === socket.id )
        {
            messageElement1.innerHTML = "vous";
            const imgElement = document.createElement('img');
            imgElement.src = "/img/image.png";
            imgElement.alt = 'Profile Image';
            div.appendChild(imgElement);
        } else {
            messageElement1.innerHTML = message.author;
            const imgElement = document.createElement('img');
            imgElement.src = "/img/smile.png";
            imgElement.alt = 'Profile Image';
            div.appendChild(imgElement);
        }
            

        // Remplacer les sauts de ligne par des balises <br>
        const messageText = message.text.replace(/\n/g, '<br>');
        messageElement.innerHTML = messageText;

        // Appliquer une couleur différente en fonction de l'auteur
        messageElement.style.color = 'white';

        //  messageElement.textContent = message.text;

        // Ajoutons le message à la section des messages
        let messageSection = document.getElementById('messageSection')
        div1.appendChild(messageElement1);
        div1.appendChild(messageElement);
        div.appendChild(div1);
        messageSection.insertBefore(div, typingNotification);
        
        // Effacer la notification de saisie
        typingNotification.innerText = '';
    })
})

const socket = io();


// socket.on('disconnect', () => {
//     console.log('Disconnected from server');
// });
