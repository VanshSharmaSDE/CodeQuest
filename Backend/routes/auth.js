const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const Admin = require('../models/admin');
const Teacher = require('../models/teacher');
const Student = require('../models/student');

const router = express.Router();

// Login API
router.post('/', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: 'Please add all the Fields' })
    }

    try {
        console.log('Received email:', email);

        // Check in all collections
        let user = await Admin.findOne({ adminEmail: email });
        if (!user) {
            console.log('User not found in Admin');
            user = await Teacher.findOne({ teacherEmail: email });
        }
        if (!user) {
            console.log('User not found in Teacher');
            user = await Student.findOne({ studentEmail: email });
        }

        if (!user) {
            console.log('User not found in Student');
            return res.status(404).json({ message: 'User not found' });
        }

        // Check which password field to use
        const userPassword = user.adminPassword || user.teacherPassword || user.studentPassword;

        // Compare provided password with hashed password
        const isMatch = await bcrypt.compare(password, userPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate token
        const payload = {
            user: {
                id: user.id,
                email: user.email,
                role: user.role || 'user'  // Adjust according to the schema
            },
        };

        // const token = jwt.sign({ id: user._id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Update the loginTime field with the current date and time
        user.loginTime.push(new Date());  // Update loginTime to the current time
        // Save the updated user document
        await user.save();

        res.json({ token, user: { id: user.id, email: user.email, role: user.role || 'user' }, message: 'Login successful' });

        // res.status(200).json({ message: 'Login successful', token });
    } catch (error) {

        // console.error('Error:', error.message);
        // res.status(500).send('Server error');

        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
