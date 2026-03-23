// backend/controllers/applicationController.js
const pool = require('../config/db');

// --- APPLY TO A REPORT ---
const applyToReport = async (req, res) => {
    const { report_id, worker_id, message } = req.body;

    try {
        // Check if already applied
        const existing = await pool.query(
            'SELECT * FROM applications WHERE report_id = $1 AND worker_id = $2',
            [report_id, worker_id]
        );
        if (existing.rows.length > 0) {
            return res.status(400).json({ message: 'You have already applied to this job' });
        }

        // Check report exists and is open
        const report = await pool.query('SELECT * FROM reports WHERE id = $1', [report_id]);
        if (report.rows.length === 0) {
            return res.status(404).json({ message: 'Report not found' });
        }
        if (report.rows[0].status !== 'open') {
            return res.status(400).json({ message: 'This job is no longer open' });
        }

        const newApp = await pool.query(
            'INSERT INTO applications (report_id, worker_id, message) VALUES ($1, $2, $3) RETURNING *',
            [report_id, worker_id, message]
        );

        res.status(201).json({
            message: 'Application submitted!',
            application: newApp.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- GET APPLICATIONS FOR A REPORT (for the creator) ---
const getApplicationsForReport = async (req, res) => {
    const { reportId } = req.params;

    try {
        const apps = await pool.query(
            `SELECT a.*, u.name AS worker_name, u.email AS worker_email, u.phone AS worker_phone
             FROM applications a
             JOIN users u ON a.worker_id = u.id
             WHERE a.report_id = $1
             ORDER BY a.created_at DESC`,
            [reportId]
        );
        res.json(apps.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- GET WORKER'S OWN APPLICATIONS ---
const getWorkerApplications = async (req, res) => {
    const { workerId } = req.params;

    try {
        const apps = await pool.query(
            `SELECT a.*, r.title AS report_title, r.location AS report_location, r.status AS report_status,
                    u.name AS creator_name, u.phone AS creator_phone, u.email AS creator_email
             FROM applications a
             JOIN reports r ON a.report_id = r.id
             JOIN users u ON r.user_id = u.id
             WHERE a.worker_id = $1
             ORDER BY a.created_at DESC`,
            [workerId]
        );
        res.json(apps.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- ACCEPT / REJECT APPLICATION ---
const updateApplicationStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status. Must be accepted or rejected.' });
    }

    try {
        const app = await pool.query('UPDATE applications SET status = $1 WHERE id = $2 RETURNING *', [status, id]);

        if (app.rows.length === 0) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // If accepted, update the report status to in_progress
        if (status === 'accepted') {
            await pool.query('UPDATE reports SET status = $1 WHERE id = $2', ['in_progress', app.rows[0].report_id]);

            // Reject all other pending applications for this report
            await pool.query(
                "UPDATE applications SET status = 'rejected' WHERE report_id = $1 AND id != $2 AND status = 'pending'",
                [app.rows[0].report_id, id]
            );
        }

        res.json({
            message: `Application ${status}`,
            application: app.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { applyToReport, getApplicationsForReport, getWorkerApplications, updateApplicationStatus };
