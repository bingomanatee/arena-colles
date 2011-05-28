var forms       = require('mvc/forms');
var mvc_params  = require('mvc/params');

module.exports  = function(context) {
    var self = this;
    var callback = function(err, form) {
         // console.log(__filename, ': add form ', form.render());
        context.render(self._views.add, mvc_params(self.name, {form: form}));
    };
    
    values = {};

    if (context.request.hasOwnProperty('body')){
        if (context.request.body.hasOwnProperty('values')){
            values = request.body.values;
        }
    }
     // console.log(__filename, ' values = ', values);
    forms(callback, self, 'add' , values);

}