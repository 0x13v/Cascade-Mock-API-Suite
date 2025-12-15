const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'endpoints.json');

function loadEndpoints() {
    try {
        const raw = fs.readFileSync(configPath, 'utf8');
        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            throw new Error('endpoints.json must export an array');
        }

        return parsed;
    } catch (error) {
        console.error('Failed to load endpoints configuration:', error.message);
        return [];
    }
}

module.exports = loadEndpoints();