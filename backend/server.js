const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// --- USERS ---
app.post('/api/auth/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const [users] = await db.execute(
            'SELECT * FROM users WHERE email = ? AND password = ? AND role = ?', 
            [email, password, role]
        );
        if (users.length > 0) {
            res.json({ success: true, user: users[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, role, department, institution } = req.body;
    try {
        await db.execute(
            'INSERT INTO users (name, email, password, role, department, institution) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, password, role, department, institution || 'HICAS']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- EVENTS ---
app.get('/api/events', async (req, res) => {
    try {
        const [events] = await db.execute('SELECT * FROM events ORDER BY date ASC');
        res.json({ success: true, events });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/events', async (req, res) => {
    const { title, date, time, venue, description, sub_events, poster_url, coordinatorSignature } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO events (title, date, time, venue, description, sub_events, poster_url, coordinatorSignature) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [title, date, time, venue, description, sub_events, poster_url, coordinatorSignature]
        );
        res.json({ success: true, id: result.insertId });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/events/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM events WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- REGISTRATIONS ---
app.get('/api/registrations', async (req, res) => {
    try {
        const [regs] = await db.execute('SELECT * FROM registrations');
        res.json({ success: true, registrations: regs });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/registrations', async (req, res) => {
    const { eventId, studentName, email, institution, eventTitle, department, subEvents, date } = req.body;
    try {
        await db.execute(
            'INSERT INTO registrations (eventId, studentName, email, institution, eventTitle, department, subEvents, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [eventId, studentName, email, institution, eventTitle, department, subEvents, date]
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// --- STATS ---
app.get('/api/events/stats', async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as total FROM users WHERE role = "student"');
        const [eventCount] = await db.execute('SELECT COUNT(*) as total FROM events');
        const [regCount] = await db.execute('SELECT COUNT(*) as total FROM registrations');
        
        const [deptStats] = await db.execute('SELECT department, COUNT(*) as count FROM registrations GROUP BY department');
        const [eventStats] = await db.execute('SELECT eventTitle as title, COUNT(*) as count FROM registrations GROUP BY eventTitle');
        
        res.json({
            success: true,
            stats: {
                totalUsers: userCount[0].total,
                totalEvents: eventCount[0].total,
                totalRegistrations: regCount[0].total,
                deptStats,
                eventStats,
                institutionStats: [
                    { name: 'HICAS (Internal)', value: regCount[0].total }, // Simplified
                    { name: 'Other Colleges (External)', value: 0 }
                ]
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
