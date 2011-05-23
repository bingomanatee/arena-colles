var inflect = require('inflect');
var string_utils = require('util/string');
var forms = require('mvc/forms');

/**
 *  CONTROLLER ROLE
 * Roles for ACL
 */
module.exports = {

	index:     require('mvc/actions/index'),

	show:      require('mvc/actions/show'),

	add:       require('mvc/actions/add'),

	edit:      require('mvc/actions/edit'),

	"delete":  require('mvc/actions/delete'),

	create:    require('mvc/actions/create'),

	update:    require('mvc/actions/update'),

	destroy:   require('mvc/actions/destroy'),

	forms: {
		"default": {
			fields: [{
				name: "role[label]",
				label: "Label",
				type: "text",
				value: ""
			},{
				name: "role[description]",
				label: "Description",
				type: "text",
				value: ""
			},{
				name: "role[parent]",
				label: "Parent",
				type: "select",
				value: ""
			},{
				name: "role[deleted]",
				label: "Deleted",
				type: "checkbox",
				options: ["deleted"],
				value: ""
			}]
		}
	}
};