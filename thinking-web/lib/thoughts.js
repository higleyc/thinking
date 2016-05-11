var monk = require('monk');
var db = monk('localhost:27017/thinking');

module.exports = {
    create: function(thought, callback) {
        var thoughts = db.get('thoughts');
        
        preInsert(thought);
        
        thoughts.insert(thought, function(err) {
            callback(err);
        });
    },
    
    get: function(id, callback) {
        var thoughts = db.get('thoughts');
        
        var filters = {};
        if (id) {
            filters = {_id: id};
        }
        thoughts.find(filters, function(err, result) {
            callback(err, result);
        })
    },
    
    searchByTags: function(tags, callback) {
        var thoughts = db.get('thoughts');
        
        thoughts.find({'tags[]': {$in: tags}}, function(err, result) {
            callback(err, result);
        });
    },
    
    addAdjacency: function(firstId, secondId, callback) {
        var thoughts = db.get('thoughts');
        
        thoughts.findOne({_id: firstId}, function(err, first) {
            if (err) {
                callback(err);
                return;
            }
            thoughts.findOne({_id: secondId}, function(err, second) {
                if (err) {
                    callback(err);
                    return;
                }
                first.next = secondId;
                second.previous = firstId;
                thoughts.update({_id: firstId}, first, function(err) {
                    if (err) {
                        callback(err);
                    }
                });
                thoughts.update({_id: secondId}, second, function(err) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null);
                    }
                });
            });
        });
    }
};

function preInsert(thought) {
    thought.createdAt = new Date();
}