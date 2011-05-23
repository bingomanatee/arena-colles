var forms_module = require('mvc/forms');
var string_utils = require('util/string');
var params_module = require('mvc/params');

module.exports = function(context) {
    var self = this;
    var id = context.request.params.id;
    self.model.get(id, function(err, item) {
	if (!item) {
	    return context.flash('Creating new ' + id, 'info', '/grants/' + id + '/add');
	}
	var params = params_module(self.name);
	//params.form = {render: function(){return '<p>Form</p>'}}
	try {

	    function _form_handler(err, form) {
		if (err) {
		    console.log(__filename, ': error in form: ', err);
		    throw err;
		} else {
		    form.configs.action = form.configs.action.replace('__ID__', item._id);
		    params.form = form;
		    params[self.name] = params.item = item;
		    context.render(self._views.edit, params);
		}
	    }

	    forms_module(_form_handler, self, 'edit', item, {
		context: self.name
	    });
	} catch (err) {
	    console.log(__filename, ': error in form caught, ', err);
	}
	// response.render(self._views.edit, params);
    }); // end get
}