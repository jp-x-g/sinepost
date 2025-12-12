var express = require('express');
var router = express.Router();
var wikiController = require('../controllers/wikiController');
const fs = require('fs');
const path = require('path');

// Middleware to log incoming requests
function logRequest(req, res, next) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} ///// Path: ${req.path} ///// Referrer: ${req.get('referer') || 'N/A'}\n`;
  // Define the path to the log file
  const logFilePath = path.join(__dirname, '../data/traffic.log');

  // Append the log message to the log file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error('Error writing to traffic log:', err);
    }
  });

  next(); // Proceed to the next middleware or route handler
}

// Attach the logRequest middleware to all routes
router.use(logRequest);

router.get('/', async function(req, res, next) {
  const path = req.params.path;

  try {
    var processedText = await wikiController.fetchAndProcessData("");
    // Send the processed text as a response
    res.send(processedText);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/:path(*)', async function(req, res, next) {
  var path = req.params.path;
  try {
    //   if (path.substring(path.length - 4) == ".css") {
    //      console.log("CSS")
    //      var processedText = await wikiController.fetchAndProcessCSS("/" + path);
    //    } else {
    //      var processedText = await wikiController.fetchAndProcessData("/" + path);
    //    }
    var processedText = await wikiController.fetchAndProcessData("/" + path);
    // Send the processed text as a response
    res.send(processedText);
  } catch (error) {
    // Render the error.jade template directly
    try {
      res.render('error', {
        title: 'Error',
        message: 'An error occurred',
        error: {
          message: error.message,
          status: 500,
          stack: error.stack
        }
      });
    } catch (ReferenceError) {
      res.render('error', {
        title: 'Error',
        message: 'An error occurred',
        error: {
          message: "ReferenceError",
          status: 500,
          stack: error.stack
        }
      });
    }
  }
});

module.exports = router;