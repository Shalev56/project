const express = require('express');
const Joi = require('joi');
const Cake = require('../models/cake');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Joi schema for validating cake input
const cakeSchema = Joi.object({
    name: Joi.string().required(),
    cals: Joi.number().required(),
    price: Joi.number().required(),
});

// GET Route for Paginated and Sorted Cakes
router.get('/cakes', async (req, res) => {
    const { page = 1, limit = 10, sort = 'name' } = req.query;

    try {
        const cakes = await Cake.find()
            .sort({ [sort]: 1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.json(cakes);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving cakes' });
    }
});

// POST Route to Add a Cake (Requires Token and UserID)
router.post('/cakes', authenticateToken, async (req, res) => {
    const { name, cals, price } = req.body;

    // Validate the input data
    const { error } = cakeSchema.validate({ name, cals, price });
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    try {
        const cake = new Cake({
            name,
            cals,
            price,
            user_id: req.user._id  // The user ID is attached via the authentication middleware
        });
        await cake.save();

        res.status(201).json(cake);  // Respond with the created cake
    } catch (err) {
        res.status(500).json({ message: 'Error creating cake' });
    }
});


// DELETE Route to Remove a Cake (Only User Who Created It Can Delete)
router.delete('/cakes/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    try {
        const cake = await Cake.findById(id);

        if (!cake) {
            return res.status(404).json({ message: 'Cake not found' });
        }

        // Check if the user who made the request is the one who created the cake
        if (cake.user_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this cake' });
        }

        await cake.remove();
        res.status(200).json({ message: 'Cake deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting cake' });
    }
});

module.exports = router;
