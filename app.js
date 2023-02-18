const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const winston = require('winston');
const bodyParser = require('body-parser');

const logger = winston.createLogger({
    level: 'debug',
    format: winston.format.simple(),
    transports: [
        new winston.transports.Stream({
            stream: process.stderr
        })
    ]
});

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable, or default to 3000
const message = process.env.MESSAGE || 'Hello, world!'; // Use the MESSAGE environment variable, or default to 'Hello, world!'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ inflate: true }));

// app initialization
logger.info('App initialization');
// Create a MySQL connection 
const connectionInfo = {
    host: process.env.DB_HOST || 'localhost1',
    user: process.env.DB_USER || 'root1',
    password: process.env.DB_PWD || '1111',
    database: process.env.DB_NAME || 'test1'
};

logger.info(`connection info: ${connectionInfo.host}/${connectionInfo.database}@${connectionInfo.user}::${connectionInfo.password}.`);

const connection = mysql.createConnection(connectionInfo);

// Define a route for the homepage
app.get('/', (req, res) => {
    logger('GET: /');
    res.send(message);
});

// Define a route that queries the database and returns the results
app.get('/attendant', (req, res) => {
    try {
        logger.info('GET: /attendant');
        connection.query('SELECT * FROM attendant;', (error, results, fields) => {
            if (error) throw error;
            res.send(results);
        });
    }
    catch (error) {
        logger.error('Error:');
        logger.error(error);
    }
});

// Start the server and listen on the specified port
app.listen(port, () => {
    logger.info(`Server listening on port ${port}`);
});
