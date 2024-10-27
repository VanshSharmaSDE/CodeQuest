const express = require('express');
const FeedbackForm = require("../models/FeedbackForm")
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { FeedbackType, UserFeedback } = req.body;
        if (!FeedbackType || !UserFeedback) {
            return res.status(400).json({
                success: false,
                message: "All field are requied"
            })
        }
        const FeedbackFormData = {
            FeedbackType,
            UserFeedback
        };
        const Form = new FeedbackForm(FeedbackFormData);
        await Form.save();
        return res.status(200).json({ message: "your feedback save successfully" });
    } catch (error) {
        console.log("some problem in Feedback from ", error);
        return res.status(400).json({
            success: false,
            message: "some problem in Feedback from "
        })

    }
})
module.exports = router;