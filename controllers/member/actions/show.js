var params_module = require('mvc/params');

module.exports = function(context) {
    var self = this;
  //  console.log(__filename, ':: request: ', request);
     // console.log(__filename, ':: showing ', context.request.params);
    if (!self.hasOwnProperty('model')){
        throw new Exception(__filename, ': no model');
    } else if (!self.model.hasOwnProperty('get_with_grants')){
        throw new Error(__filename + ': no GWG');
    }
    self.model.get_with_grants(context.request.params.id, function(err, member) {
        if (err) {
             // console.log(__filename, ': error: ', err);
            context.flash('cannot find member ' + context.request.params.id, 'error', 'home');
        } else if (member) {
            var params = params_module(self.name);
            params.member = params.item = member;
            params.actions = member.actions;
            delete member.actions;
            context.render(params);
        } else {
            context.flash('cannot find member ' + context.request.params.id, 'error', 'home');
        }
    })
}