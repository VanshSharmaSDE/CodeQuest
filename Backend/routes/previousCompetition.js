const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Competition = require('../models/competition');
const mongoose = require('mongoose'); 

// GET route to fetch all previous competitions the student has joined and count all previous competitions
router.get('/:_id', async (req, res) => {
    const { _id } = req.params; // Extract student ID from URL

    try {
        // Fetch the student by ID
        const student = await Student.findById({ _id });

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        // Convert the competition IDs in competitionsJoined to ObjectId
        const competitionIds = student.competitionsJoined.map(id => new mongoose.Types.ObjectId(id));

        // Fetch all previous competitions the student has joined using $in and where previousCompetition is true
        const joinedPreviousCompetitions = await Competition.find({
            _id: { $in: competitionIds },    // Fetch only the competitions the student joined
            previousCompetition: true        // Ensure previousCompetition is true
        });

        // Fetch all competitions where previousCompetition is true
        const previousCompetitions = await Competition.find({ previousCompetition: true });


        // Get the count of all competitions where previousCompetition is true
        const previousCompetitionCount = previousCompetitions.length;

        // Return the filtered competition list and count
        res.status(200).json({
            joinedPreviousCompetitions,   // Competitions the student joined
            previousCompetitionCount      // Total count of previous competitions
        });
    } catch (error) {
        console.error('Error fetching previous competitions:', error);
        res.status(500).json({ error: 'An error occurred while fetching the competitions.' });
    }
});

module.exports = router;
