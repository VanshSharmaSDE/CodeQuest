const express = require('express');
const router = express.Router();
const Teacher = require('../models/teacher');

router.post('/', async (req, res) => {
    try {
        // Add the role field explicitly as 'teacher'
        const teacherData = {
            ...req.body,
            role: 'teacher',
        };

        const teacher = new Teacher(teacherData);
        const savedTeacher = await teacher.save();
        res.status(201).json(savedTeacher);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
