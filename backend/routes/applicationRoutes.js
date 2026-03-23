// backend/routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const {
    applyToReport,
    getApplicationsForReport,
    getWorkerApplications,
    updateApplicationStatus
} = require('../controllers/applicationController');

// Worker applies to a report
router.post('/', applyToReport);

// Get all applications for a specific report (for the creator)
router.get('/report/:reportId', getApplicationsForReport);

// Get all applications by a specific worker
router.get('/worker/:workerId', getWorkerApplications);

// Accept or reject an application
router.patch('/:id', updateApplicationStatus);

module.exports = router;
