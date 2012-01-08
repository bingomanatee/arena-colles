var model_names = require('./_model_names');
var forms_module = require('mvc/forms');

module.exports = function(context) {
    var self = this;
    function _form_callback(err, form){
         // console.log(__filename, ': form - ', form);
        
        form.fields[0].options = model_names();
        context.render({form: form});
    }
    
    forms_module(_form_callback, self, 'export_models', {}, {context: 'models', action: '/meta/0/export_models', method: 'post'});
}
