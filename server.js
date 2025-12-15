require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Request logging middleware
if (process.env.DEBUG === 'true' || process.env.DEBUGFILE === 'true') {
    app.use((req, res, next) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`;

        var bodyEntry = '';
        if (req.body && Object.keys(req.body).length > 0) {
            bodyEntry = 'Request Body: ' + JSON.stringify(req.body, null, 2) + '\n==========================================================================\n';
        }
        if (process.env.DEBUG === 'true') {
            console.log(logMessage);
            console.log(bodyEntry);
        }

        if (process.env.DEBUGFILE === 'true') {
            const logEntry = logMessage + '\n';
            fs.appendFileSync(path.join(__dirname, 'debug.log'), logEntry + bodyEntry);
        }
        next();
    });
}

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3001;
let HOST = process.env.HOST || 'localhost';

// Handle HOST with protocol (e.g., "http://localhost" -> "localhost")
if (HOST.startsWith('http://')) {
    HOST = HOST.replace('http://', '');
} else if (HOST.startsWith('https://')) {
    HOST = HOST.replace('https://', '');
}

app.listen(PORT, HOST, () => {
    const protocol = process.env.HOST && process.env.HOST.startsWith('https://') ? 'https' : 'http';
    console.log(`API running on ${protocol}://${HOST}:${PORT}`);
});