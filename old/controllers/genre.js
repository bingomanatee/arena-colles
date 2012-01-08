/**
 *  CONTROLLER GENRE
 * Movie Types
 */
module.exports = {

    index: require('mvc/actions/index'),

    show: require('mvc/actions/show'),

    add: require('mvc/actions/add'),

    edit: require('mvc/actions/edit'),

    delete: require('mvc/actions/delete'),

    create: require('mvc/actions/create'),

    update: require('mvc/actions/update'),

    destroy: require('mvc/actions/destroy'),


    forms: {
  "add": {
    configs: {
      method: 'post',
      action: '/genres/0'
      },
    "fields": [
      {
        "name": "genre[_id]",
        "label": "Name",
        "type": "text",
        "value": ""
      },
      {
        "name": "genre[label]",
        "label": "Label",
        "type": "text",
        "value": ""
      },
      {
        "name": "genre[description]",
        "label": "Description",
        "type": "textarea",
        "value": ""
      }
    ]
  },
  "edit": {
    configs: {
      method: 'post',
      action: '/genres/0/update'
      },
    "fields": [
      {
        "name": "genre[_id]",
        "label": "Name",
        "type": "text",
        "value": ""
      },
      {
        "name": "genre[label]",
        "label": "Label",
        "type": "text",
        "value": ""
      },
      {
        "name": "genre[description]",
        "label": "Description",
        "type": "textarea",
        "value": ""
      }
    ]
  }
}
    
};