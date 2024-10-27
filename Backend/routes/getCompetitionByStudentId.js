const express = require('express');
const router = express.Router();
const Student = require('../models/student');

// API to get all competitions a student has joined
router.get('/:studentId', async (req, res) => {
    const { studentId } = req.params;

    try {
        const student = await Student.findById({_id:studentId}).populate('competitionsJoined');

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        res.json({
            message: 'Competitions retrieved successfully',
            competitions: student.competitionsJoined // Populated array of competitions
        });
    } catch (error) {
        console.error('Error fetching student competitions:', error);
        res.status(500).json({ message: 'Failed to retrieve competitions' });
    }
});

module.exports = router;
