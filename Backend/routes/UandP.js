const express = require('express');
const router = express.Router();
const Competition = require('../models/competition');

// GET route to fetch the number of previous and saved competitions created by a teacher
router.get('/:teacherId', async (req, res) => {
    const { teacherId } = req.params; // Extract teacher ID from URL

    try {
        // Fetch the previous competitions created by the teacher
        const previousCompetitions = await Competition.find({
            creatorId: teacherId,
            previousCompetition: true
        });

        // Count the number of previous competitions
        const previousCompetitionCount = previousCompetitions.length;

        // Fetch the total number of saved competitions that are not live and not previous
        const totalCompetitionCount = await Competition.countDocuments({
            creatorId: teacherId,
            isLive: false,               // The competition is not live
            previousCompetition: false    // The competition is not marked as previous
        });

        // Return the counts
        res.status(200).json({
            previousCompetitionCount,  // Number of previous competitions
            totalCompetitionCount,      // Number of saved competitions
            previousCompetitions          // List of previous competitions
        });
    } catch (error) {
        console.error('Error fetching competition counts:', error);
        res.status(500).json({ error: 'An error occurred while fetching the competition counts.' });
    }
});

module.exports = router;
