const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url} - IP: ${req.ip}`);
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Request Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

app.use('/api', apiRoutes);

app.listen(3000, () => {
    console.log('API running on http://localhost:3000');
});
