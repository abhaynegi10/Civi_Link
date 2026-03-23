// backend/controllers/reportController.js
const pool = require('../config/db');
const { GoogleGenAI } = require('@google/genai');

// --- GEMINI AI SETUP ---
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// --- AI CLASSIFICATION (Gemini) ---
const classifyReport = async (title, description) => {
    try {
        const prompt = `You are a civic issue classifier for a community platform. Classify the following report into exactly one category.

RULES:
- "government" = Issues that ONLY the government/municipality can fix: roads, streetlights, sewage systems, public parks, drainage, garbage collection on public land, broken public infrastructure, water supply from mains, and government building maintenance.
- "service" = Issues that a PRIVATE skilled worker can fix: plumbing, electrical work, carpentry, painting, AC/appliance repair, cleaning, home maintenance, vehicle repair, or any task a freelancer/handyman can do.

IMPORTANT: If someone NEEDS a specific worker (plumber, electrician, mechanic, carpenter, etc.), it is ALWAYS "service" — even if the problem involves water or electricity. The key question is: "Can a private worker fix this?" If yes → "service".

Examples:
- "Need a plumber to fix broken pipe" → service
- "Pothole on main road" → government
- "Electrical wiring issue in my house" → service
- "Streetlight not working" → government
- "Need someone to repair my fence" → service
- "Garbage dumped on public road" → government
- "AC not cooling, need repair" → service
- "Water pipeline burst on highway" → government

Title: ${title}
Description: ${description}

Respond with ONLY one word: "government" or "service". Nothing else.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: prompt,
        });

        const category = response.text.trim().toLowerCase();

        // Validate — only accept expected values
        if (category === 'government' || category === 'service') {
            return category;
        }

        // Fallback if AI gives unexpected response
        console.warn('Gemini returned unexpected category:', category);
        return 'service';

    } catch (error) {
        console.error('Gemini AI Error:', error.message);
        // Fallback to basic keyword matching if AI fails
        return fallbackClassify(title + ' ' + description);
    }
};

// --- FALLBACK (if Gemini API is down or errors) ---
const fallbackClassify = (text) => {
    const desc = text.toLowerCase();
    if (desc.includes('pothole') || desc.includes('road') || desc.includes('water') || desc.includes('garbage') || desc.includes('street light')) {
        return 'government';
    }
    if (desc.includes('mechanic') || desc.includes('plumber') || desc.includes('electrician') || desc.includes('cleaner') || desc.includes('repair')) {
        return 'service';
    }
    return 'service';
};

// --- CREATE REPORT (With File) ---
const createReport = async (req, res) => {
    const { title, description, location, user_id } = req.body;

    let image_url = null;
    if (req.file) {
        image_url = `/uploads/${req.file.filename}`;
    }

    try {
        // AI Classification
        const category = await classifyReport(title, description);

        const newReport = await pool.query(
            'INSERT INTO reports (title, description, location, user_id, category, image_url) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [title, description, location, user_id, category, image_url]
        );

        res.status(201).json({
            message: `Report submitted! AI classified as: ${category.toUpperCase()}`,
            report: newReport.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- GET ALL REPORTS ---
const getAllReports = async (req, res) => {
    try {
        const allReports = await pool.query('SELECT * FROM reports ORDER BY created_at DESC');
        res.status(200).json(allReports.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- GET SERVICE JOBS (Open, for Workers) ---
const getServiceReports = async (req, res) => {
    try {
        const reports = await pool.query(
            `SELECT r.*, u.name AS creator_name
             FROM reports r
             JOIN users u ON r.user_id = u.id
             WHERE r.category = 'service' AND r.status = 'open'
             ORDER BY r.created_at DESC`
        );
        res.status(200).json(reports.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- DELETE REPORT ---
const deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM reports WHERE id = $1', [id]);
        res.json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};

module.exports = { createReport, getAllReports, getServiceReports, deleteReport };