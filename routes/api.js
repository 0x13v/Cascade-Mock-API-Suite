const express = require('express');
const router = express.Router();

const endpoints = require('../config/endpoints');
const { sendFromFile } = require('../controllers/fileResponse.controller');

endpoints.forEach(endpoint => {
    router[endpoint.method](
        endpoint.path,
        sendFromFile(endpoint.file, {
            injectBody: endpoint.injectBody
        })
    );
});

module.exports = router;
