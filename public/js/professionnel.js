document.addEventListener('DOMContentLoaded', async () => {
    // Chargement des données utilisateur
    const token = localStorage.getItem('token');
    
    if (!token) {
        window.location.href = '/login.html';
        return;
    }

    try {
        const response = await fetch('/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Erreur de chargement');
        
        const user = await response.json();
        
        
        // Remplissage des données
        document.getElementById('name').value = user.username;
        document.getElementById('job').value = user.job;
        document.getElementById('location').value = user.cityAddress;
        document.getElementById('email').value = user.email;

    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = '/login.html';
    }

    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });

    document.getElementById('editProfileBtn').addEventListener('click', function() {
        document.getElementById('name').removeAttribute('readonly');
        document.getElementById('email').removeAttribute('readonly');
        document.getElementById('job').removeAttribute('readonly');
        document.getElementById('location').removeAttribute('readonly');
        document.getElementById('saveProfileBtn').classList.remove('d-none');
        document.getElementById('editProfileBtn').classList.add('d-none');
    });

    document.getElementById('profileForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        const username = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const job = document.getElementById('job').value;
        const cityAddress = document.getElementById('location').value;
        const token = localStorage.getItem('token');

        try {
            console.log('Données envoyées :', { username, email, job, cityAddress });

            const response = await fetch('/auth/Update', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email, job, cityAddress })
            });

            const text = await response.text();
            console.log("Réponse brute du serveur :", text);

            let result;
            try {
                result = JSON.parse(text);
            } catch (e) {
                throw new Error('La réponse du serveur n\'est pas un JSON valide');
            }

            console.log("Réponse serveur :", result);

            if (!response.ok) {
                throw new Error(result.message || 'Erreur de mise à jour');
            }

            alert(result.message);
            // Mise à jour de l'affichage
            document.getElementById('name').value = username;
            document.getElementById('email').value = email;
            document.getElementById('job').value = job;
            document.getElementById('location').value = cityAddress;

            document.getElementById('name').setAttribute('readonly', 'readonly');
            document.getElementById('email').setAttribute('readonly', 'readonly');
            document.getElementById('job').setAttribute('readonly', 'readonly');
            document.getElementById('location').setAttribute('readonly', 'readonly');
            document.getElementById('saveProfileBtn').classList.add('d-none');
            document.getElementById('editProfileBtn').classList.remove('d-none');
        } catch (error) {
            console.error('Erreur :', error);
            alert(error.message || 'Erreur lors de la mise à jour du profil');
        }
    
    });

    const socket = io();

    // Gestion des événements de connexion et d'erreur
    socket.on('connect', () => {
        console.log('Connecté au serveur Socket.io');
    });

    socket.on('connect_error', (error) => {
        console.error('Erreur de connexion à Socket.io:', error);
    });

    // Recevoir une nouvelle réservation
    socket.on("nouvelle_reservation", (data) => {
        console.log("Nouvelle réservation reçue :", data);
        const appointmentList = document.getElementById("appointmentList");
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${data.clientName || 'Nom non disponible'}</td>
            <td>${data.date}</td>
            <td>${data.time}</td>
            <td>
                <button class="btn btn-success" onclick="repondreReservation('${data.reservationId}', 'accepté')">Accepter</button>
                <button class="btn btn-danger" onclick="repondreReservation('${data.reservationId}', 'refusé')">Refuser</button>
            </td>
        `;
        appointmentList.appendChild(newRow);
    });

    // Envoyer la réponse du professionnel
    function repondreReservation(reservationId, reponse) {
        const data = {
            reservationId: reservationId,
            reponse: reponse,
        };
        console.log("Réponse envoyée :", data);
        socket.emit("reponse_professionnel", data, (ack) => {
            if (ack && ack.status === 'success') {
                alert('Réponse envoyée avec succès');
            } else {
                alert('Erreur lors de l\'envoi de la réponse');
            }
        });
    }

    // Déconnexion
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        window.location.href = '/login.html';
    });
});