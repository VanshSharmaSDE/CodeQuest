const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// PUT route to mark competition as no longer live and set it as a previous competition
router.put('/:id', async (req, res) => {
    const { id } = req.params; // Extract competition ID from URL

    try {
        // Find the competition by ID and update the isLive and previousCompetition fields
        const updatedCompetition = await Competition.findByIdAndUpdate(
            id,
            { 
                $set: { isLive: false, previousCompetition: true } // Update fields
            },
            { new: true, runValidators: true } // Return the updated document and run schema validators
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
