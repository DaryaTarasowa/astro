var express = require('express');
var router = express.Router();

/* GET data. */
router.get('/astro', function(req, res, next) {
	res.send('success');
});

module.exports = router;
