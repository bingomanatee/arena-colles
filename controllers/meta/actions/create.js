var json_utils = require('util/json');
var path_module = require('path');
var fs = require('fs');
var ejs = require('ejs');

module.exports = function(context) {
        var self = this;
        
         // console.log(__filename, ':: body = ', context.request.body)
        var cont = context.request.body.meta_controller;
        var name = cont.name = cont.name.toLowerCase();
        
        var cont_path = MVC_CONTROLLERS + '/' + name + '.js';

        cont.forms.default.fields = json_utils.as_array(cont.forms.default.fields);
        cont.forms.default.fields = _.filter(cont.forms.default.fields, function(field) {
            return field.name;
        });
        var fmregex = new RegExp(self.name + '\[(.*)\]');
        cont.forms.default.fields.forEach(function(field) {
            if (!fmregex.test(field.name)){
                field.name = cont.name + '[' + field.name + ']';
            }
            if (field.options) {
                var option_list = [];
                field.options.split("\n").forEach(function(option) {
                    option = option.replace(/[\s]/g, '');
                    if (option) option_list.push(option);
                });
                field.options = option_list;
            } else {
                delete(field.options);
            }
        });

         // console.log(__filename, '::create: looking for ', cont_path);
        path_module.exists(cont_path, function(exists) {
            if (exists) {
                 // console.log(__filename, '::create: not saving controller ' + name);
                context.flash('Sorry, controller ' + name + ' already exists', 'error');
                response.redirect('/meta');
            } else {
				function _write_handler(err) {
				     // console.log(__filename, '::create: written controller ' + name);
				    context.flash('Controller ' + name + ' created');
				    context.response.redirect('/meta/' + name);
				}
				
				function _read_handler(err, template) {
				     // console.log(__filename, '::create: controller: ', cont);
				    _extend_actions(cont.actions);
				    var new_controller = ejs.render(template.toString(), {
				        locals: cont
				    })
				     // console.log('content: ', new_controller);
				
				    fs.writeFile(cont_path, new_controller, _write_handler);
				}

                var template_path = MVC_CONTROLLERS + '/meta/templates/controller.js';
                 // console.log(__filename, '::create: saving controller ', name, ' from ', template_path);
                if (!path_module.existsSync(template_path)) {
                    throw new Error('Cannot get template ' + template_path);
                }
                fs.readFile(template_path, _read_handler);
            }
        });
    }

    function _extend_actions (actions) {
        if (!actions) return;
        if (actions.indexOf('add') > -1) {
            actions.push('create');
        }
        if (actions.indexOf('edit') > -1) {
            actions.push('update');
        }
        if (actions.indexOf('delete') > -1) {
            actions.push('destroy');
        }
    }