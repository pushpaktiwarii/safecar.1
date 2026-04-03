const express = require('express');
const router = express.Router();
const { db } = require('../db/init');
const { v4: uuidv4 } = require('uuid');

router.get('/qr/:qr_id', async (req, res) => {
    const { qr_id } = req.params;

    try {
        const result = await db.query('SELECT owner_name, emergency_contacts, is_active, city, blood_group, vehicle_type FROM qr_profiles WHERE qr_id = $1', [qr_id]);
        const profile = result.rows[0];

        if (!profile) {
            return res.status(404).json({ error: "QR Code not found" });
        }

        if (!profile.is_active) {
            return res.status(403).json({ error: "This QR Code has been deactivated by the owner" });
        }

        // Parse contacts
        try {
            profile.emergency_contacts = JSON.parse(profile.emergency_contacts);
        } catch (e) {
            profile.emergency_contacts = [];
        }

        res.json(profile); // Public data
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

router.post('/incident', async (req, res) => {
    const { qr_id, type } = req.body;

    try {
        // Verify QR exists
        const result = await db.query('SELECT qr_id FROM qr_profiles WHERE qr_id = $1', [qr_id]);
        const profile = result.rows[0];
        if (!profile) return res.status(404).json({ error: "Invalid QR" });

        const id = uuidv4();
        await db.query('INSERT INTO incidents (id, qr_id, location) VALUES ($1, $2, $3)', [id, qr_id, type || "General Alert"]);

        // Optional: Trigger notification logic here (mock)
        console.log(`[INCIDENT REPORTED] QR: ${qr_id}, Alert Type: ${type}`);

        res.json({ success: true, incident_id: id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
