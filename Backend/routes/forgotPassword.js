const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Student = require('../models/student');
const Teacher = require('../models/teacher');
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Dummy storage for OTPs (In production, store this in the database)
const otpStore = {};

// Route to send OTP
router.post('/', async (req, res) => {
    const { email } = req.body;

    let user = await Teacher.findOne({ teacherEmail: email }) || await Student.findOne({ studentEmail: email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit OTP
    otpStore[email] = { otp };

    // Set up your nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "codequest.server@gmail.com",
            pass: "vxsx qmyy gxgj mjsn",
        },
    });

    const mailOptions = {
        from: "codequest.server@gmail.com",
        to: email,
        subject: 'Your OTP Code',
        html: `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 8px;">
            <div style="text-align: center; padding-bottom: 20px;">
                <img src="https://res.cloudinary.com/hiddendev/image/upload/v1728365497/CodeQuestLogo_f16ph9.png" alt="CodeQuest" style="max-width: 150px;" />
            </div>
            <h2 style="color: #1d72b8; text-align: center;">Your One-Time Password (OTP)</h2>
            <p>Hi there,</p>
            <p>We received a request to change your CodeQuest account Password. Use the OTP below to securely change it:</p>
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
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to send OTP' });
        }
        res.json({ message: 'OTP sent to your email' });
    });
});

// Route to verify OTP and reset password
router.post('/verify-otp-forgotPassword', async (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Missing fields' });


    const storedData = otpStore[email];
    console.log(otp)
    console.log(storedData)
    // Verify the OTP
    if (storedData && storedData.otp == otp) {
        // Find the user
        let teacher = await Teacher.findOne({ teacherEmail: email });
        let student = await Student.findOne({ studentEmail: email });

        if (!teacher && !student) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password using bcrypt
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        if (teacher) {
            let T = await Teacher.findOneAndUpdate({ teacherEmail: email }, { teacherPassword: hashedPassword }, { new: true })
            if (T) {
                return res.status(200).json({ message: 'Teacher Password updated successfully!' });
            } else {
                return res.status(404).json({ message: 'User not found!' });
            }
        }

        if (student) {
            let S = await Student.findOneAndUpdate({ studentEmail: email }, { studentPassword: hashedPassword }, { new: true });
            if (S) {
                return res.status(200).json({ message: 'Student Password updated successfully!' });
            } else {
                return res.status(404).json({ message: 'User not found!' });
            }
        }

    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
});

module.exports = router;
