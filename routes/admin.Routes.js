const express = require('express');
const router = express.Router();
const path = require('path');
const isAuthenticated = require('../middleware/isAuthenticated');
const hasRole = require('../middleware/hasRole');


// Route pour la page Admin
router.get("/admin", isAuthenticated, hasRole('admin'), (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

<<<<<<< HEAD


=======
>>>>>>> eeebb862438e97a1348f32c41a0db4a94f65407b
module.exports = router;