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


router.route('/thoughts/search')

.get(function(req, res) {
    var tags = JSON.parse(req.query.tags);
    thoughts.searchByTags(tags, function(err, result) {
        if (err) {
            res.send('Error searching.');
        } else {
            res.json(result);
        }
    });
});

router.route('/thoughts/addAdjacency')

.post(function(req, res) {
    var firstId = req.body.firstId;
    var secondId = req.body.secondId;
    thoughts.addAdjacency(firstId, secondId, function(err) {
        if (err) {
            res.send('Error adding adjacency.');
        } else {
            res.json({});
        }
    });
});

module.exports = router;
