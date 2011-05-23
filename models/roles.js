var mongo_model = require('mvc/model/mongo');

module.exports = {

    collection: 'roles',

    mixins: {
        _as_oid: function(id){
            return id;
        },
        
        options: function(callback, use_none) {
            var self = this;
            self.all(function(err, roles) {
                if (err){
                    console.log(__filename, ': error in all: ', err);
                    callback(err);
                }
                
                console.log(__filename, ': roles: ', roles);
                
                var out = [];
                if (use_none){
                    out.push({value: '', label: '(none)'});
                }
                roles.forEach(function(role) {
                    out.push({value: role._id, label: role.label});
                });
                callback(null, out);
            })
        }

    }

}