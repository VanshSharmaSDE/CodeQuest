const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// PUT route to update a competition by ID
router.put('/:_id', async (req, res) => {
    const { _id } = req.params;  // Extract the competition ID from the URL
    const { competitionName, creatorId, rounds } = req.body;

    try {
        // Find the competition by ID and replace the data with the new one
        const updatedCompetition = await Competition.findByIdAndUpdate(
            _id, 
            { competitionName, creatorId, rounds },
            { new: true, overwrite: true } // 'new' returns the updated document; 'overwrite' replaces all fields
        );

        if (!updatedCompetition) {
            return res.status(404).json({ error: 'Competition not found' });
        }

        // Return the updated competition
        res.status(200).json(updatedCompetition);
    } catch (error) {
        console.error('Error updating competition:', error);
        res.status(500).json({ error: 'An error occurred while updating the competition.' });
    }
});

module.exports = router;
