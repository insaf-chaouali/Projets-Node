document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.json();
    if (response.ok) {
        const token = result.token;
        
        localStorage.setItem('token', token); // Stockez le token dans le localStorage
        const role = result.role;
        if (role === 'admin') {
            window.location.href = '/admin';
        } else if (role === 'client') {
            window.location.href = '/clients';
        } else if (role === 'professionnel') {
            window.location.href = '/professionnel';
        } else {
            window.location.href = '/profile';
        }
    } else {
        const params = new URLSearchParams(window.location.search);
        if (params.has('error')) {
            document.getElementById('error-message').innerText = params.get('error');
    }}
});