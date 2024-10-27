const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// POST route to create a new competition
router.post('/',  async (req, res) => {
    const { competitionName,creatorId, rounds, id , lastSaved } = req.body;

    try {
        // Create a new competition document
        const newCompetition = new Competition({
            competitionName,
            creatorId,
            rounds,
            id,
            lastSaved
        });

        // Save the competition document to the database
        const savedCompetition = await newCompetition.save();

        // Return the saved competition as a response
        res.status(201).json(savedCompetition);
    } catch (error) {
        console.error('Error saving competition:', error);
        res.status(500).json({ error: 'An error occurred while saving the competition.' });
    }
});

module.exports = router;
