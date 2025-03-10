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

    } catch (error) {
        console.error('Erreur:', error);
        window.location.href = '/login.html';
    }

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

    // Déconnexion
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = '/login.html';
    });
});