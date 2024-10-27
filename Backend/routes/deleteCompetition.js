const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// DELETE route to delete a competition by ID
router.delete('/:_id', async (req, res) => {
    const { _id } = req.params; // Extract the competition ID from the URL

    try {
        // Find the competition by ID and delete it
        const deletedCompetition = await Competition.findByIdAndDelete(_id);

        if (!deletedCompetition) {
            return res.status(404).json({ error: 'Competition not found' });
        }

        // Return success message if competition is deleted
        res.status(200).json({ message: 'Competition deleted successfully', deletedCompetition });
    } catch (error) {
        console.error('Error deleting competition:', error);
        res.status(500).json({ error: 'An error occurred while deleting the competition.' });
    }
});

module.exports = router;
