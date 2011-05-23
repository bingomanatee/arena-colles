/**
 *  CONTROLLER CHARACTER
 * The creation of a Glitterwood actor
 */
module.exports = {

    index: require('./character/actions/index'),

    show: require('mvc/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),


    forms: {
  "default": {
    "fields": [
      {
        "name": "character[name]",
        "label": "Name",
        "type": "text",
        "value": ""
      },
      {
        "name": "character[gender]",
        "label": "Gender",
        "type": "radio",
        "options": [
          "M"
        ],
        "value": "M,F"
      },
      {
        "name": "character[hair]",
        "label": "Hair",
        "type": "select",
        "value": ""
      }
    ]
  }
}
    
};