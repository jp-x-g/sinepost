var express = require('express');
var router = express.Router();
var axios = require('axios');

router.get('/:path(*)', async function(req, res, next) {
  const path = req.params.path;

  try {
    const response = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        action: 'parse',
        page: `Wikipedia:Wikipedia_Signpost/${path}`,
        format: 'json'
      }
    });

    const text = response.data.parse.text['*'];

    res.send(text);
  } catch (error) {
    next(error); // Pass the error to the error handling middleware
  }
});

module.exports = router;