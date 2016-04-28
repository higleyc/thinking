var express = require('express');
var router = express.Router();

var thoughts = require('../lib/thoughts');

router.route('/thoughts')

.post(function(req, res) {
    var thought = req.body;
    thoughts.create(thought, function(err) {
        if (err) {
            res.send('Error adding thought.');
        } else {
            res.json(thought);
        }
    });
})

.get(function(req, res) {
    thoughts.get(null, function(err, result) {
        if (err) {
            res.send('Error getting thoughts.');
        } else {
            res.json(result);
        }
    });
});

module.exports = router;
