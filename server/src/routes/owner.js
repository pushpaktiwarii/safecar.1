const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { db } = require('../db/init');
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// Get Profile
router.get('/profile', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM qr_profiles WHERE user_id = $1', [req.user.id]);
        res.json(result.rows[0] || {});
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

// Update/Create Profile
router.post('/profile', async (req, res) => {
    const { owner_name, emergency_contacts, city, blood_group, vehicle_type } = req.body;

    if (!emergency_contacts || emergency_contacts.length === 0) {
        return res.status(400).json({ error: "At least one emergency number is required" });
    }

    try {
        const result = await db.query('SELECT * FROM qr_profiles WHERE user_id = $1', [req.user.id]);
        const profile = result.rows[0];

        const contactsJson = JSON.stringify(emergency_contacts);

        if (profile) {
            await db.query(`
                UPDATE qr_profiles 
                SET owner_name = $1, emergency_contacts = $2, city = $3, blood_group = $4, vehicle_type = $5 
                WHERE user_id = $6
            `, [owner_name, contactsJson, city, blood_group, vehicle_type, req.user.id]);
        } else {
            // Generate new QR ID (short UUID part)
            const qr_id = uuidv4().split('-')[0];
            await db.query(`
                INSERT INTO qr_profiles (qr_id, user_id, owner_name, emergency_contacts, city, blood_group, vehicle_type)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            `, [qr_id, req.user.id, owner_name, contactsJson, city, blood_group, vehicle_type]);
        }

        const updatedResult = await db.query('SELECT * FROM qr_profiles WHERE user_id = $1', [req.user.id]);
        res.json(updatedResult.rows[0]);
    } catch(err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
