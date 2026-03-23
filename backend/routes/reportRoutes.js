// backend/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createReport, getAllReports, getServiceReports, deleteReport } = require('../controllers/reportController');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Routes
router.post('/', upload.single('image'), createReport);
router.get('/', getAllReports);
router.get('/service-jobs', getServiceReports);
router.delete('/:id', deleteReport);

module.exports = router;