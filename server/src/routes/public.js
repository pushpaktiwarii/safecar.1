const express = require('express');
const router = express.Router();
const { db } = require('../db/init');
const { v4: uuidv4 } = require('uuid');

router.get('/qr/:qr_id', (req, res) => {
    const { qr_id } = req.params;

    const profile = db.prepare('SELECT owner_name, emergency_contacts, is_active, city, blood_group, vehicle_type FROM qr_profiles WHERE qr_id = ?').get(qr_id);

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
});

router.post('/incident', (req, res) => {
    const { qr_id, type } = req.body;

    // Verify QR exists
    const profile = db.prepare('SELECT qr_id FROM qr_profiles WHERE qr_id = ?').get(qr_id);
    if (!profile) return res.status(404).json({ error: "Invalid QR" });

    const id = uuidv4();
    // Assuming 'location' column exists, we can save the 'type' in it or add a new column. 
    // Since we only have location for now, we'll store the 'type' in the 'location' column as a fallback till we expand DB.
    db.prepare('INSERT INTO incidents (id, qr_id, location) VALUES (?, ?, ?)').run(id, qr_id, type || "General Alert");

    // Optional: Trigger notification logic here (mock)
    console.log(`[INCIDENT REPORTED] QR: ${qr_id}, Alert Type: ${type}`);

    res.json({ success: true, incident_id: id });
});

module.exports = router;
