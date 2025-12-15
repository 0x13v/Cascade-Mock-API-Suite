const fs = require('fs');
const path = require('path');

exports.sendFromFile = (file, options = {}) => {
    return (req, res) => {
        const filePath = path.join(__dirname, '../responses', file);

        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return res.status(500).json({
                    error: 'Response file not found'
                });
            }

            let json = JSON.parse(data);

            // Handle dynamic path parameters (e.g., {{id}} from Express :id)
            if (req.params && Object.keys(req.params).length > 0) {
                Object.keys(req.params).forEach(param => {
                    json = JSON.parse(
                        JSON.stringify(json).replace(
                            `"{{${param}}}"`,
                            JSON.stringify(req.params[param])
                        )
                    );
                });
            }

            if (options.injectBody) {
                json = JSON.parse(
                    JSON.stringify(json).replace(
                        '"{{body}}"',
                        JSON.stringify(req.body)
                    )
                );
            }

            // Handle dynamic attributes from config.attributes array with template replacement
            if (json.config && json.config.attributes && json.return && json.return.data) {
                json.config.attributes.forEach(attribute => {
                    const attributeValue = req.query[attribute] || 
                                        (req.body && req.body[attribute]) || 
                                        null;
                    
                    // Handle nested attributes with dot notation (e.g., "salePrice.value")
                    if (attribute.includes('.')) {
                        const [parent, child] = attribute.split('.');
                        const parentValue = req.query[parent] || 
                                          (req.body && req.body[parent]) || 
                                          null;
                        
                        if (parentValue && typeof parentValue === 'object' && parentValue[child] !== undefined) {
                            // Use the nested value from request
                            json = JSON.parse(
                                JSON.stringify(json).replace(
                                    `"{{${attribute}}}"`,
                                    JSON.stringify(parentValue[child])
                                )
                            );
                        } else {
                            // Use null if nested value not found
                            json = JSON.parse(
                                JSON.stringify(json).replace(
                                    `"{{${attribute}}}"`,
                                    'null'
                                )
                            );
                        }
                    } else {
                        // Handle flat attributes (original behavior)
                        json = JSON.parse(
                            JSON.stringify(json).replace(
                                `"{{${attribute}}}"`,
                                JSON.stringify(attributeValue)
                            )
                        );
                    }
                });
            }

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store');
            
            // Return only the 'return' section for cleaner API responses
            if (json.return) {
                res.json(json.return);
            } else {
                res.json(json);
            }
        });
    };
};
