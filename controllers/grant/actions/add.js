var forms       = require('mvc/forms');
var mvc_params  = require('mvc/params');

module.exports  = function(context) {
    var self = this;
    var _forms_callback = function(err, form) {
    //    console.log(__filename, ': add form ', form.render());
        var params = context.params({form: form});
        context.render(self._views.add, params);
    };
    
    if (context.request.hasOwnProperty('body')){
        if (context.request.body.hasOwnProperty('values')){
            values = request.body.values;
        }
    } else {
        values = {};
    }
    
    var rps = context.req_params(true);
    console.log(__filename, ': rps: ', rps, context.request);
    
    if (rps.hasOwnProperty('id') && (rps.id != '0') && rps.id){
        values._id = rps.id;
    }

    // console.log(__filename, ' values = ', values);
    forms(_forms_callback, self, 'add' , values);

}