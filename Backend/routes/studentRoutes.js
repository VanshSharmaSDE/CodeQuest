const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const nodemailer = require('nodemailer'); // For sending emails

// In-memory storage for OTPs
const otpStorage = {};

// Setup transporter for nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: 'codequest.server@gmail.com', // Your email
        pass: 'vxsx qmyy gxgj mjsn' // Your email password
    }
});

// Function to remove expired OTPs
function removeExpiredOtps() {
    const now = Date.now();
    for (const email in otpStorage) {
        if (otpStorage[email].expiry < now) {
            delete otpStorage[email]; // Remove expired OTP
        }
    }
}

// Route to handle student signup
router.post('/', async (req, res) => {
    try {
        const { studentName, studentEmail, studentPassword } = req.body;

        // Check if a student with the same email already exists
        const existingStudent = await Student.findOne({ studentEmail });
        if (existingStudent) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
        otpStorage[studentEmail] = { otp, studentName, studentPassword, expiry: Date.now() + 5 * 60 * 1000 }; // Store OTP with expiry

        // Send OTP to student's email
        await transporter.sendMail({
            from: 'codequest.server@gmail.com', // Sender address
            to: studentEmail, // List of receivers
            subject: 'Your One-Time Password (OTP) for CodeQuest',
            html: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
                <div style="text-align: center; padding-bottom: 20px;">
                    <img src="https://res.cloudinary.com/hiddendev/image/upload/v1728365497/CodeQuestLogo_f16ph9.png" alt="CodeQuest" style="max-width: 150px;" />
                </div>
                <h2 style="color: #1d72b8; text-align: center;">Your One-Time Password (OTP)</h2>
                <p>Hi there,</p>
                <p>We received a request to sign into your CodeQuest account. Use the OTP below to securely log in:</p>
                <div style="background: #f9f9f9; padding: 15px; border: 1px dashed #1d72b8; font-size: 18px; text-align: center; margin: 20px 0;">
                    <strong style="color: #1d72b8; font-size: 24px;">${otp}</strong>
                </div>
                <p>This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
                <p>If you didn't request this, please ignore this email or contact our support team immediately.</p>
                <p>Best regards,<br>The CodeQuest Team</p>
                <hr style="border: none; border-top: 1px solid #eee;" />
                <p style="font-size: 12px; color: #888; text-align: center;">&copy; 2024 CodeQuest. All rights reserved.</p>
            </div>
        `
        });

        res.status(200).json({ message: 'OTP sent to email' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Route to verify OTP and complete registration
router.post('/verify-otp', async (req, res) => {
    try {
        const { studentEmail, otp } = req.body; // Accept email with OTP

        console.log(otpStorage);
        // Check if the OTP matches
        const storedData = otpStorage[studentEmail];
        if (storedData && storedData.otp === otp) {
            const { studentName, studentPassword } = storedData; // Retrieve student data

            const studentData = {
                studentName,
                studentEmail,
                studentPassword,
                role: 'student',
            };

            const student = new Student(studentData);
            await student.save();
            delete otpStorage[studentEmail]; // Clear the OTP from memory after successful registration
            res.status(201).json({ message: 'Student Created Successfully', student });
        } else {
            res.status(400).json({ message: 'Invalid OTP or OTP expired' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Call removeExpiredOtps every minute to clean up expired OTPs
setInterval(removeExpiredOtps, 60 * 1000); // Run every minute

module.exports = router;


// ==================================================================================================================================

// without otp
// Route to handle student signup
// router.post('/', async (req, res) => {
//     try {
//         const { studentName, studentEmail, studentPassword } = req.body;

//         // Check if a student with the same email already exists
//         const existingStudent = await Student.findOne({ studentEmail });
//         if (existingStudent) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         // Create new student data
//         const studentData = {
//             studentName,
//             studentEmail,
//             studentPassword,
//             role: 'student',
//         };

//         // Save the new student to the database
//         const student = new Student(studentData);
//         await student.save();

//         res.status(201).json({ message: 'Student Created Successfully', student });
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

module.exports = router;
