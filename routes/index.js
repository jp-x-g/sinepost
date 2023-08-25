var express = require('express');
var router = express.Router();
var wikiController = require('../controllers/wikiController');

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
    res.render('error', {
      title: 'Error', // Define the title variable
      message: 'An error occurred', // Customize the error message
      error: {
        message: error.message,
        status: 500,
        stack: error.stack
      }
    });
  }
});

module.exports = router;