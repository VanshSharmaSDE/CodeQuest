const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// PUT route to update isRoundLive property in a specific round by competition ID and round ID
router.put('/:id/:round_id/:checked/:roundStartTiming', async (req, res) => {
    const { id, round_id, checked, roundStartTiming } = req.params; // Extract competition ID and round ID from URL

    try {
        // Update the specific round where roundNumber matches round_id
        const updatedCompetition = await Competition.findOneAndUpdate(
            { _id: id, "rounds._id": round_id }, // Match competition ID and round ID
            { $set: { "rounds.$.isRoundLive": checked,
                "rounds.$.roundStartTiming": roundStartTiming // Add roundStartTiming property
             } }, // Use positional operator to set isRoundLive for the matched round
            { new: true, runValidators: true } // Return the updated document and run schema validators
        );

        if (!updatedCompetition) {
            return res.status(404).json({ error: 'Competition or round not found' });
        }

        // Return the updated competition with the updated round
        res.status(200).json(updatedCompetition);
    } catch (error) {
        console.error('Error updating competition round:', error);
        res.status(500).json({ error: 'An error occurred while updating the competition round.' });
    }
});

module.exports = router;

