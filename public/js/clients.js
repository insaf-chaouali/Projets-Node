const socket = io();

// Définition de rechercherProfessionnel
   const rechercherProfessionnel = async () => {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    try {
        document.getElementById('loadingSpinner').classList.remove('d-none');
        const response = await fetch(`/search/search-professionals?job=${searchTerm}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const professionals = await response.json();
        document.getElementById('loadingSpinner').classList.add('d-none');
        const resultsBody = document.getElementById('resultsBody');
        if (professionals.length === 0) {
            resultsBody.innerHTML = `<tr><td colspan="4" class="text-center">Aucun professionnel trouvé</td></tr>`;
        } else {
            resultsBody.innerHTML = professionals.map(prof => `
                <tr>
                    <td>${prof.username}</td>
                    <td>${prof.job}</td>
                    <td>${prof.cityAddress}</td>
                    <td><button class="btn btn-primary" onclick="reserver('${prof.username}')">Réserver</button></td>
                </tr>
            `).join('');
        }
        document.getElementById('resultsSection').classList.remove('d-none');
    } catch (error) {
        console.error('Erreur lors de la recherche :', error);
        alert('Une erreur est survenue lors de la recherche.');
        document.getElementById('loadingSpinner').classList.add('d-none');
    }
};

function reserver(professionnelName) {
  const data = {
    clientName: localStorage.getItem('username'), // Assurez-vous que le nom du client est stocké dans le localStorage
    professionnelName: professionnelName,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };
  socket.emit("reservation", data);
}

// Recevoir la réponse du professionnel
socket.on("maj_rendezvous", (data) => {
  if (data.clientId === localStorage.getItem('userId')) { // Assurez-vous que l'ID du client est stocké dans le localStorage
    alert(`Votre réservation a été ${data.reponse} par ${data.professionnelName}`);
  }
});

document.addEventListener("DOMContentLoaded", () => {
document.querySelector("button").addEventListener("click", rechercherProfessionnel);
});
    // Déconnexion
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });