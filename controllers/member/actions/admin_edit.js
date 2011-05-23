var forms_module = require('mvc/forms');
var string_utils = require('util/string');
var params_module = require('mvc/params');
var ACL = require('mvc/acl');

module.exports = function(context) {
  var self = this;
  var id = context.request.params.id;

  var acl = new ACL(context);
  acl.can('members_admin', function(err, can) {
  	// if (can){
    self.model.get(id, function(err, item) {
      if (err || !item) {
        console.log(__filename, ': error ', err);
        context.flash('Cannot get ' + id, 'error', 'home');
      } else {
        var params = params_module(self.name);
        //params.form = {render: function(){return '<p>Form</p>'}}
        try {
           function _forms_module_callback(err, form) {
            if (err) {
              console.log(__filename, ': error in form: ', err);
            } else {
              form.configs.action = form.configs.action.replace('__ID__', item._id);
              params.form = form;
	      params.member = params.item = item;
              context.render(self._views.edit, params);
            }
          };
          forms_module(_forms_module_callback, self, 'edit', item, {
            context: self.name
          });
        } catch (err) {
          console.log(__filename, ': error in form caught, ', err);
        }
        // response.render(self._views.edit, params);
      }
    }); // end get
    // } // end if;
  }); // end ACL
}