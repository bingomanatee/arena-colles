module.exports = {

    collection: 'grants',

    mixins: {
        _as_oid: function(id){
            return id;
        },
        
        can: function(member, action, callback) {
            var self = this;

            var member_roles = [];
            var allowed_roles = [];

            if (member && member.hasOwnProperty('roles')) {
                member_roles = member.roles;
            }

            this.get(action, function(err, result) {

                if (!result) {
                    callback(null, true); // allow all untracked actions
                } else {
                    if (result.hasOwnProperty('roles')) {
                        allowed_roles = result.roles;
                    }

                    var can = _.intersect(member_roles, allowed_roles).length;

                    callback(null, can);
                }
            })
        }
    }
}