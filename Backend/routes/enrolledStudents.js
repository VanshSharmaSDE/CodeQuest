const express = require('express');
const Student = require('../models/student'); // Assuming you have a Student model
const router = express.Router();

// API to get students who have joined a specific competition
router.get('/:competitionId', async (req, res) => {
    const { competitionId } = req.params;

    try {
        // Find students who have the competitionId in their joinedCompetitions array
        const students = await Student.find({ 
            competitionsJoined: { $in: [competitionId] } 
        });

        if (students.length === 0) {
            return res.status(404).json({ message: 'No students found for this competition' });
        }

        res.status(200).json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
