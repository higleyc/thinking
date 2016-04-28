var monk = require('monk');
var db = monk('localhost:27017/thinking');

module.exports = {
    create: function(thought, callback) {
        var thoughts = db.get('thoughts');
        
        //TODO: preprocessing
        
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
    }
}