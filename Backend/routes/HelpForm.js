const express = require('express');
const HelpForm = require('../models/helpForm.js');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { HelperName, HelperEmail, HelperQuery } = req.body;
        if (!HelperName || !HelperEmail || !HelperQuery) {
            return res.status(400).json({
                success: false,
                message: "All field are requied"
            })
        }
        const HelpFormData = {
            HelperName, 
            HelperEmail,
            HelperQuery,
        };

        const Form = new HelpForm(HelpFormData);
        await Form.save();
      return res.status(200).json({message :"Form save successfully"});
    }
     catch (error) {
        console.log("some problem in Help from", error)
        return res.status(400).json({
            success: false,
            message: "some problem in Help from "
        })
    }

})
module.exports = router;