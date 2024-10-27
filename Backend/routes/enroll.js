const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Competition = require('../models/competition');

// API to enroll a student in a competition
router.post('/', async (req, res) => {
    const { studentId, competitionId } = req.body;
    try {
        // Check if both IDs are present
        if (!studentId || !competitionId) {
            return res.status(400).json({ message: 'Student ID and Competition ID are required' });
        }
        const student = await Student.findById({ _id: studentId });
        const competition = await Competition.findById({ _id: competitionId });

        if (!student || !competition) {
            return res.status(404).json({ message: 'Student or Competition not found' });
        }

        // Check if the student is already enrolled
        if (!student.competitionsJoined.includes(competitionId)) {
            student.competitionsJoined.push(competitionId);
            await student.save();
        }

        res.json({ message: 'Student enrolled in competition successfully' });
    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ message: 'Failed to enroll student' });
    }
});

module.exports = router;
