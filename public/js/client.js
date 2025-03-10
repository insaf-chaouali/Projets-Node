const token = localStorage.getItem('token'); // Récupérez le token depuis le localStorage

fetch('/client', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => console.error('Erreur:', error));