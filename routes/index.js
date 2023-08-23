var express = require('express');
var router = express.Router();
var wikiController = require('../controllers/wikiController');

router.get('/', async function(req, res, next) {
  const path = req.params.path;

  try {
    const processedText = await wikiController.fetchAndProcessData("");

    // Send the processed text as a response
    res.send(processedText);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

router.get('/:path(*)', async function(req, res, next) {
  const path = req.params.path;

  try {
    const processedText = await wikiController.fetchAndProcessData("/" + path);

    // Send the processed text as a response
    res.send(processedText);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;