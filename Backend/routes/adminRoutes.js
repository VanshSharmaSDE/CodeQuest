const express = require('express');
const router = express.Router();
const Admin = require('../models/admin');

router.post('/', async (req, res) => {
    try {
        // Add the role field explicitly as 'admin'
        const adminData = {
            ...req.body,
            role: 'admin',
        };

        const admin = new Admin(adminData);
        const savedAdmin = await admin.save();
        res.status(201).json(savedAdmin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

