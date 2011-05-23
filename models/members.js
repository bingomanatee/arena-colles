var mongo_model = require('mvc/model/mongo');
var models_module = require(MVC_MODELS);
var grants_model = null;
var Gate = require('util/gate');

/**
 * NOTE - allows are so dynamic we do not store them with the member data
 * but rather load them dynamically via get_with_grants.
 */

module.exports = {

    collection: 'members',

    mixins: {

        get_with_grants: function(id, callback) {
            console.log(__filename, ': get_with_grants');
            var self = this;
            if (grants_model) {
                self._get_with_grants(id, callback);
            } else {
                models_module.model('grants', function(err, model) {
                    console.log(__filename, ': retrieved grants model');
                    grants_model = model;
                    self._get_with_grants(id, callback);
                })
            }
        },

        _get_with_grants: function(id, callback) {
            console.log(__filename, ': getting member ', id,' : callback, ', callback);
            var self = this;
            
            function _get_member(err, member) {
                if (err) {
                    callback(err);
                } else if (member){
                    member.actions = [];
                    if (member.hasOwnProperty('roles')) {
                        
                        function _end_gate() {
                            console.log(__filename, ':: _get_with_grants - uniquifiying actions ', member.actions);
                            member.actions = _.unique(member.actions);
                            callback(null, member);
                        }
                        
                        var gate = new Gate(_end_gate);
                        
                        function _grants_model_find(err, grant_results) {
                            console.log(__filename, ':: _get_with_grants: found ', grant_results);
                            if (grant_results) {
                                grant_results.forEach(function(grant_result) {
                                    member.actions.push(grant_result._id);
                                });
                            }
                            gate.task_done();
                        }

                        member.roles.forEach(function(role) {
                            console.log(__filename, ':: _get_with_grants - finding role ', role);
                            gate.task_start();
                            grants_model.find({
                                roles: role
                            }, _grants_model_find);
                        });
                        gate.start();
                    } else {
                        callback(null, member);
                    }
                } else {
                    callback(new Error('cannot find member ' + id));
                }
            }
            
            self.get(id, _get_member);
        },

        _as_oid: function(id) {
            return id;
        },

        session_member: function(request) {
           // console.log(__filename, ': request = ', request);
            if (!request) {
                return false;
            }
            if (request.hasOwnProperty('session')) {
                if (request.session.hasOwnProperty('member')) {
                    return request.session.member;
                }
            }
            return false;
        },

        authenticate: function(member, callback) {
            var self = this;
             console.log(__filename, ': member: ', member);
             
            function _auth(err, result) {
                console.log(__filename, ' found: ', result);
                if (result && (result.password == member.password)) {
                    console.log(__filename, ': member ', member, ' found: ', result);
                    callback(null, result);
                } else {
                    callback(new Error('Cannot authenticate'));
                }
            }
            
            this.get(member._id, _auth)

        }
    }
}