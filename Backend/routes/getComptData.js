const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

router.get('/:loginId', async (req, res) => {
    const creatorId = req.params.loginId;
    try {
        const competitions = await Competition.find({creatorId:creatorId});
        res.status(200).json(competitions);  // Make sure you're sending an array
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching competitions.' });
    }
});

module.exports = router;