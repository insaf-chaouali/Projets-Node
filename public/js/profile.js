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
        document.getElementById('username').textContent = user.username;
        document.getElementById('email').textContent = user.email;
        document.getElementById('city').textContent = user.cityAddress;
<<<<<<< HEAD
        document.getElementById('dateOfBirth').textContent=user.dateOfBirth;
=======
>>>>>>> eeebb862438e97a1348f32c41a0db4a94f65407b

    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = '/login.html';
    }

<<<<<<< HEAD
   document.getElementById('editProfileForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('editUsername').value;
    const email = document.getElementById('editEmail').value;
    const city = document.getElementById('editCity').value;
    const status = document.getElementById('editStatus').value;
    const cityAddress = document.getElementById('editCityAddress').value;
    const job = document.getElementById('editJob').value;
    const token = localStorage.getItem('token');

    console.log("Données envoyées :", { username, email, city, status, cityAddress, job });

    try {
        const response = await fetch('/auth/update/:id', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        });

        if (!response.ok) throw new Error('Erreur de chargement');

        const result = await response.json();
        console.log("Réponse serveur :", result);

        if (response.ok) {
            alert(result.message);
            document.getElementById('username').textContent= username;
            document.getElementById('email').textContent = email;
            document.getElementById('city').textContent = city;
            document.getElementById('status').textContent = status;
            document.getElementById('cityAddress').textContent = cityAddress;
            document.getElementById('job').textContent = job;

            document.querySelector('.profile-container').style.display = 'block';
            document.querySelector('.edit-profile-container').style.display = 'none';
        } else {
            alert(result.message || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Erreur :', error);
    }
});

=======
    // Gestion de l'avatar
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarUpload = document.getElementById('avatar-upload');

    avatarPreview.addEventListener('click', () => avatarUpload.click());

    avatarUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                avatarPreview.src = e.target.result;
                // Ici vous pouvez ajouter l'envoi au serveur
            };
            reader.readAsDataURL(file);
        }
    });
>>>>>>> eeebb862438e97a1348f32c41a0db4a94f65407b

    // Déconnexion
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });
});